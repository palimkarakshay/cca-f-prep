#!/usr/bin/env python3
"""
llm-monitor orchestrator. Runs the full pipeline end-to-end:

  collectors/*.py  →  store.ingest_jsonl()  →  analyzer.classify()
                  →  digest.render()
                  →  feedback.update_known_issues()
                  →  feedback.update_recommendations()
                  →  feedback.open_issues_for_high_signal()

Designed to run in CI on a stdlib-only Python 3.11 image (no `pip
install`). Each collector is invoked as a subprocess so a single
collector failing (e.g. Reddit 429s on the runner IP) doesn't take
the rest of the run with it.

Exits 0 on full success, 0 with a stderr warning when individual
collectors fail (so the cron job stays green), and 1 only on a fatal
config / IO error.

Env (all optional except where noted):
    ANTHROPIC_API_KEY  — analyzer; falls back to Gemini → OpenAI → stub
    GEMINI_API_KEY     — analyzer fallback
    OPENAI_API_KEY     — analyzer last-resort fallback
    GH_TOKEN           — collector + feedback (gh CLI). REQUIRED for
                         CI runs that file issues / commit the digest.
    REDDIT_CLIENT_ID   — Reddit collector OAuth path
    REDDIT_CLIENT_SECRET
    REPO               — default palimkarakshay/cca-f-prep
    LLM_MONITOR_MODEL  — override classifier model (default claude-opus-4-7)
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
COLLECTORS_DIR = ROOT / "collectors"

# Two cadence tiers, configured from the workflow via --mode:
#   sweep (every ~2h): full content sweep — used by llm-monitor.yml
#   watch (every ~15min): outage / fresh-issue detection only —
#                         used by llm-monitor-watch.yml
COLLECTORS_BY_MODE = {
    "sweep": ["hackernews", "rss", "reddit", "github", "stackoverflow", "statuspages"],
    "watch": ["statuspages"],
}
COLLECTOR_NAMES = COLLECTORS_BY_MODE["sweep"]  # back-compat default

sys.path.insert(0, str(ROOT))
import store        # noqa: E402
import analyzer     # noqa: E402
import digest as digest_mod  # noqa: E402  (avoid shadowing stdlib hashlib digest)
import feedback     # noqa: E402

LLM_MONITOR_DIR = ROOT.parents[1] / "docs" / "llm-monitor"
DIGEST_DIR = LLM_MONITOR_DIR / "digests"


def run_collector(name: str) -> list[str]:
    """Run a single collector and return the JSONL stdout lines.
    Returns [] if the collector fails — error logged to stderr."""
    script = COLLECTORS_DIR / f"{name}.py"
    if not script.exists():
        print(f"[run] collector {name} missing", file=sys.stderr)
        return []
    try:
        result = subprocess.run(
            ["python3", str(script)],
            capture_output=True, text=True, timeout=180,
            cwd=str(COLLECTORS_DIR),
            env={**os.environ},
        )
    except subprocess.TimeoutExpired:
        print(f"[run] collector {name} timed out", file=sys.stderr)
        return []
    if result.returncode != 0:
        print(f"[run] collector {name} exited {result.returncode}: "
              f"{result.stderr.strip()[:300]}", file=sys.stderr)
    if result.stderr:
        # Surface collector warnings (one line each).
        for ln in result.stderr.strip().splitlines()[:5]:
            print(f"[run] {name}: {ln}", file=sys.stderr)
    return [ln for ln in result.stdout.splitlines() if ln.strip()]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", default="sweep", choices=["sweep", "watch"],
                    help="sweep = full content pipeline (every ~2h); "
                         "watch = fast outage detection only (every ~15min, "
                         "skips digest rewrite)")
    ap.add_argument("--dry-run", action="store_true",
                    help="Skip Anthropic + gh writes (KNOWN_ISSUES still rewritten locally)")
    ap.add_argument("--no-issues", action="store_true",
                    help="Don't file GitHub issues even on real runs")
    ap.add_argument("--collectors",
                    help="Comma-separated subset of collectors to run "
                         "(default: derived from --mode)")
    args = ap.parse_args()

    default_collectors = COLLECTORS_BY_MODE.get(args.mode, COLLECTOR_NAMES)
    selected_str = args.collectors or ",".join(default_collectors)
    selected = [c.strip() for c in selected_str.split(",") if c.strip()]
    print(f"[run] starting llm-monitor — mode={args.mode} "
          f"collectors={selected} dry_run={args.dry_run}",
          file=sys.stderr)

    # --- 1. Collect ---
    all_lines: list[str] = []
    for name in selected:
        lines = run_collector(name)
        print(f"[run] {name}: {len(lines)} raw records", file=sys.stderr)
        all_lines.extend(lines)

    if not all_lines:
        print("[run] no records collected; nothing to do", file=sys.stderr)
        return 0

    # --- 2. Store + dedupe ---
    seen = store.load_seen()
    new = store.ingest_jsonl(iter(all_lines), seen)
    store.save_seen(seen)
    print(f"[run] {len(new)} new records after dedupe (seen={len(seen)})",
          file=sys.stderr)
    if not new:
        print("[run] all records were duplicates; skipping analyzer", file=sys.stderr)
        return 0

    # --- 3. Analyze ---
    classified = analyzer.classify(new, dry_run=args.dry_run)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    analyzer_path = ROOT / "state" / f"analyzer-{today}.json"
    analyzer_path.parent.mkdir(exist_ok=True)
    analyzer_path.write_text(json.dumps(classified, ensure_ascii=False, indent=2))
    print(f"[run] analyzer wrote {analyzer_path}", file=sys.stderr)

    # --- 4. Digest (sweep mode only) ---
    # Watch mode skips the digest: it's a heavy text output that doesn't
    # change on a 15-min cadence, and rewriting it every 15 min would
    # churn the git tree without surfacing new info. Watch mode still
    # runs the feedback step below — that's the load-bearing outage path.
    if args.mode == "sweep":
        digest_md = digest_mod.render(classified, today=today)
        DIGEST_DIR.mkdir(parents=True, exist_ok=True)
        digest_path = DIGEST_DIR / f"{today}.md"
        digest_path.write_text(digest_md)
        print(f"[run] digest written to {digest_path}", file=sys.stderr)
    else:
        print("[run] watch mode: skipping digest rewrite", file=sys.stderr)

    # --- 5. Feedback (KNOWN_ISSUES + RECOMMENDATIONS + auto-issues) ---
    records = classified.get("records", [])
    originals = classified.get("originals_by_id", {})

    ki_body = feedback.render_known_issues(records, originals)
    ki_changed = feedback.update_known_issues(ki_body)
    print(f"[run] KNOWN_ISSUES.md changed: {ki_changed}", file=sys.stderr)

    rec_body = feedback.render_recommendations(records, originals)
    rec_changed = feedback.update_recommendations(rec_body)
    print(f"[run] RECOMMENDATIONS.md changed: {rec_changed}", file=sys.stderr)

    if not args.no_issues:
        filed = feedback.open_issues_for_high_signal(
            records, originals, dry_run=args.dry_run,
        )
        print(f"[run] issues filed: {len(filed)} {filed}", file=sys.stderr)

    print("[run] done", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
