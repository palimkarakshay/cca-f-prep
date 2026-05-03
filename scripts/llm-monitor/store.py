#!/usr/bin/env python3
"""
Normalize + dedupe layer between collectors and analyzer.

The orchestrator (`run.py`) feeds collector stdout (JSONL) through
`ingest_jsonl(...)`. This module:

  * drops malformed lines,
  * dedupes by `id` against `state/seen.json` (last 90 days kept),
  * appends the new records to a per-month JSONL archive at
    `state/raw/<YYYY-MM>.jsonl`,
  * returns the new records so the analyzer can process them.

State files are stdlib JSON / JSONL — no DB dependency. The CI job
restores `state/seen.json` from the previous run's artifact, so dedupe
spans across cron invocations. If the artifact is missing (first run,
expired), every record is treated as new — that's a one-day
duplicate-digest cost we accept rather than carry a heavier store.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent
STATE = ROOT / "state"
RAW_DIR = STATE / "raw"
SEEN_FILE = STATE / "seen.json"
SEEN_RETENTION_DAYS = 90
REQUIRED_KEYS = {"source", "id", "url", "title", "ts"}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_seen() -> dict[str, str]:
    """Return {id: first_seen_iso}. Old entries are pruned on load."""
    if not SEEN_FILE.exists():
        return {}
    try:
        data = json.loads(SEEN_FILE.read_text())
    except json.JSONDecodeError:
        return {}
    cutoff = datetime.now(timezone.utc) - timedelta(days=SEEN_RETENTION_DAYS)
    pruned = {}
    for k, v in data.items():
        try:
            ts = datetime.fromisoformat(v.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            continue
        if ts >= cutoff:
            pruned[k] = v
    return pruned


def save_seen(seen: dict[str, str]) -> None:
    STATE.mkdir(exist_ok=True)
    SEEN_FILE.write_text(json.dumps(seen, sort_keys=True))


def _archive_path(record: dict) -> Path:
    """`state/raw/<YYYY-MM>.jsonl`, derived from the record's ts."""
    ts = record.get("ts") or _now_iso()
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except ValueError:
        dt = datetime.now(timezone.utc)
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    return RAW_DIR / f"{dt.strftime('%Y-%m')}.jsonl"


def ingest_jsonl(stream: Iterable[str], seen: dict[str, str]) -> list[dict]:
    """Parse JSONL lines, drop dupes/malformed, archive, return new records."""
    new_records: list[dict] = []
    now = _now_iso()
    for line in stream:
        line = line.strip()
        if not line:
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not isinstance(rec, dict) or not REQUIRED_KEYS.issubset(rec.keys()):
            continue
        rid = rec["id"]
        if rid in seen:
            continue
        seen[rid] = now
        new_records.append(rec)

    if new_records:
        # Group writes by archive file to avoid reopening for each line.
        by_path: dict[Path, list[dict]] = {}
        for rec in new_records:
            by_path.setdefault(_archive_path(rec), []).append(rec)
        for path, recs in by_path.items():
            with path.open("a") as fh:
                for r in recs:
                    fh.write(json.dumps(r, ensure_ascii=False) + "\n")

    return new_records


def cli() -> int:
    """Read JSONL from stdin, write deduped JSONL to stdout. Useful for piping:
        python3 collectors/hackernews.py | python3 store.py
    """
    import sys
    seen = load_seen()
    new = ingest_jsonl(sys.stdin, seen)
    save_seen(seen)
    for r in new:
        sys.stdout.write(json.dumps(r, ensure_ascii=False) + "\n")
    sys.stderr.write(f"[store] kept {len(new)} new records (seen={len(seen)})\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(cli())
