#!/usr/bin/env python3
"""
Claude-powered classifier for new llm-monitor records.

Takes a list of normalized records and asks Claude Opus to:

  * classify each as one of {bug, feature, best_practice, comparison,
    news, noise},
  * tag the model / SDK each is about (claude-opus-4-7,
    anthropic-sdk, claude-code, mcp, openai-gpt-5.5, gemini-2.5-pro,
    or "general"),
  * score severity 1-5 (only severity ≥ 4 reaches KNOWN_ISSUES.md),
  * score novelty 1-5 (helps surface genuinely new info vs.
    repetition of the same thread),
  * write a one-sentence summary the digest can quote verbatim,
  * suggest a one-line action_hint when severity ≥ 4 and the action
    is obvious (e.g. "pin SDK to 0.65.x").

Why one Claude call instead of one per record: batch classification
is far cheaper and gives Claude visibility across records, so it can
say "these three are the same thread" via the dedupe_group field.

Input: JSONL (one record per line) on stdin OR --input <file>.
Output: a single JSON document `{records: [...], summary: {...}}`
to stdout (or --output <file>).

Skip with `--dry-run` to bypass the API and produce classifier-shaped
stub output (used by tests / when no API keys are present).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
DEFAULT_MODEL = os.environ.get("LLM_MONITOR_MODEL", "claude-opus-4-7")
MAX_TOKENS = 8000
RECORDS_PER_BATCH = 25  # Keep prompt under ~50k input tokens

CLASSIFY_PROMPT = """You are the analyzer stage of an LLM-monitoring pipeline. The input is
a JSON array of social/news records about LLMs, SDKs, and dev-tooling
that this study/automation repo depends on. For EACH record, emit one
entry in your output JSON. Do NOT add fields, do NOT skip records.

This pipeline serves the cca-f-prep study repo (Anthropic CCA-F exam
preparation). It tracks news / regressions / best-practices for the
LLMs and tooling discussed in the exam and used by the bot fleet
running in this repo.

Tag `impact_targets` with the SUBSET of these surfaces this record
could plausibly affect:

  - study      = exam-prep content (MCQs, notes, challenges, mock exams)
  - automation = the bot fleet (codex-review, llm-monitor, future
                 delegation workflows)
  - content    = future content additions (new domains, new examples,
                 reference patterns)

Empty array means "interesting context, but no concrete impact on this
repo right now".

Output ONLY a single JSON object of this shape, no preamble, no fences:

{
  "records": [
    {
      "id":              "<exact id from input>",
      "kind":            "bug" | "feature" | "best_practice" | "comparison" | "news" | "noise",
      "subject":         "claude-opus-4-7" | "claude-sonnet-4-6" | "claude-haiku-4-5" | "claude-code" | "anthropic-sdk" | "mcp" | "openai-gpt-5.5" | "openai-codex" | "gemini-2.5-pro" | "gemini-2.5-flash" | "github-actions" | "general",
      "impact_targets":  ["study" | "automation" | "content", ...],
      "severity":        1-5,
      "novelty":         1-5,
      "summary":         "<one sentence, quotable, technical>",
      "action_hint":     "<one line if severity>=4 AND action is obvious, else empty string>",
      "recommendation":  "<one line suggestion to ENHANCE the bot fleet based on this record; empty if not applicable>",
      "dedupe_group":    "<short slug; same slug = same underlying issue>"
    }
  ]
}

Severity rubric:
  5 = confirmed regression / outage in a model/SDK we use right now
  4 = likely regression or breaking change with multiple confirmations
  3 = useful best-practice or feature announcement worth knowing
  2 = mild signal — a single anecdote, opinion piece
  1 = noise — promo, off-topic, or already-handled issue

Novelty rubric:
  5 = first time this thread surfaces in our monitoring
  3 = a developing thread; new details on something already known
  1 = pure repetition of the same complaint as other records in batch

Field-by-field guidance:
- `action_hint` is for engineers. Concrete (e.g. "pin @anthropic-ai/sdk
  to 0.65.x", "switch model id to claude-opus-4-7", "add retry on 529
  overloaded_error"). Empty when no clear action.
- `recommendation` is for the BOT FLEET, not for the immediate bug. It
  answers "should we add a new bot, watcher, prompt hook, or check?"
  Examples: "add a daily npm-audit watcher", "have the codex review
  prompt include link checks for new MCQ explanations", "monitor the
  Anthropic SDK changelog for breaking-change frontmatter". Empty when
  this record doesn't suggest a system-level enhancement.

Be conservative on severity 5. If unsure, choose 4.
"""


def _post_anthropic(prompt: str, records: list[dict], api_key: str, model: str) -> dict:
    payload = {
        "model": model,
        "max_tokens": MAX_TOKENS,
        "messages": [{
            "role": "user",
            "content": prompt + "\n\n## Records\n\n" + json.dumps(records, ensure_ascii=False),
        }],
    }
    req = urllib.request.Request(
        ANTHROPIC_URL,
        data=json.dumps(payload).encode(),
        headers={
            "x-api-key": api_key,
            "anthropic-version": ANTHROPIC_VERSION,
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = json.loads(r.read())
    text = resp["content"][0]["text"]
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(text)


def _post_gemini(prompt: str, records: list[dict], api_key: str) -> dict:
    """Fallback when ANTHROPIC_API_KEY is absent."""
    full_prompt = prompt + "\n\n## Records\n\n" + json.dumps(records, ensure_ascii=False)
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.5-pro:generateContent?key={api_key}"
    )
    req = urllib.request.Request(
        url,
        data=json.dumps({
            "contents": [{"parts": [{"text": full_prompt}]}],
            "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"},
        }).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = json.loads(r.read())
    text = resp["candidates"][0]["content"]["parts"][0]["text"].strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(text)


def _post_openai(prompt: str, records: list[dict], api_key: str) -> dict:
    """Last-resort fallback when both Anthropic and Gemini are unavailable."""
    full_prompt = prompt + "\n\n## Records\n\n" + json.dumps(records, ensure_ascii=False)
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps({
            "model": "gpt-5.5",
            "messages": [{"role": "user", "content": full_prompt}],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
        }).encode(),
        headers={"Authorization": f"Bearer {api_key}",
                 "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = json.loads(r.read())
    text = resp["choices"][0]["message"]["content"].strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(text)


def _classify_one_batch(prompt: str, records: list[dict]) -> dict:
    """Try Anthropic → Gemini → OpenAI in order. Each is best-effort.
    Returns the first successful result; raises RuntimeError if all
    three are unavailable so the caller can stub-fall-back."""
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
    openai_key = os.environ.get("OPENAI_API_KEY", "").strip()

    errors: list[str] = []
    if anthropic_key:
        try:
            return _post_anthropic(prompt, records, anthropic_key, DEFAULT_MODEL)
        except (urllib.error.HTTPError, urllib.error.URLError, KeyError, ValueError) as e:
            errors.append(f"anthropic: {e}")
    if gemini_key:
        try:
            return _post_gemini(prompt, records, gemini_key)
        except (urllib.error.HTTPError, urllib.error.URLError, KeyError, ValueError) as e:
            errors.append(f"gemini: {e}")
    if openai_key:
        try:
            return _post_openai(prompt, records, openai_key)
        except (urllib.error.HTTPError, urllib.error.URLError, KeyError, ValueError) as e:
            errors.append(f"openai: {e}")
    if not (anthropic_key or gemini_key or openai_key):
        errors.append("no API keys set (ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY all empty)")
    raise RuntimeError(f"all LLM providers failed: {'; '.join(errors)}")


def _stub_classify(records: list[dict]) -> dict:
    """Offline classifier used when every API provider is unavailable.

    Rules:
      1. Subject detection requires the WHOLE keyword (no stem matching)
         and is title-only — body comments don't decide the topic.
      2. A record is only `bug` if BOTH the title carries a bug keyword
         AND the subject was identified (i.e. it's about something we
         care about). General-subject records max out at sev=3.
      3. Statuspages records use the kind_hint provided by the collector
         (which already knows the indicator → kind/severity mapping).
    """
    out = []
    for r in records:
        title = (r.get("title") or "").lower()
        raw = r.get("raw") or {}
        source = r.get("source", "")

        # Subject — title-only, exact-keyword match. Order is important:
        # more-specific names first so "claude-code" beats "claude".
        subject = "general"
        SUBJECT_KEYWORDS = [
            ("claude-code",      ["claude code", "claude-code"]),
            ("claude-opus-4-7",  ["claude opus", "claude-opus", "opus 4.7"]),
            ("claude-sonnet-4-6",["claude sonnet", "claude-sonnet", "sonnet 4.6"]),
            ("claude-haiku-4-5", ["claude haiku", "claude-haiku", "haiku 4.5"]),
            ("anthropic-sdk",    ["anthropic sdk", "anthropic-sdk", "@anthropic-ai/sdk"]),
            ("mcp",              ["mcp", "model context protocol"]),
            ("openai-codex",     ["codex cli", "openai codex"]),
            ("openai-gpt-5.5",   ["gpt-5", "gpt5", "openai gpt"]),
            ("gemini-2.5-pro",   ["gemini 2.5 pro", "gemini-2.5-pro"]),
            ("gemini-2.5-flash", ["gemini 2.5 flash", "gemini-2.5-flash"]),
            ("github-actions",   ["github actions", "github-actions"]),
        ]
        for subj, kws in SUBJECT_KEYWORDS:
            if any(kw in title for kw in kws):
                subject = subj
                break

        # Statuspages — collector already supplies the right kind via
        # raw.kind_hint. Use the score as severity (collector populates
        # that with our 0-5 mapping).
        if source == "statuspages":
            kind = raw.get("kind_hint") or "bug"
            sev = int(r.get("score") or 3)
            provider = (raw.get("provider") or "").lower()
            if provider == "anthropic" and subject == "general":
                subject = "anthropic-sdk"
            elif provider == "github":
                subject = "github-actions"
        else:
            text_for_kind = title  # title-only for non-statuspage sources too
            BUG_WORDS = ("bug", "broken", "regression", "outage",
                         "crash", "fails to ", "doesn't work", "not working",
                         "error 5", "503", "504", "529", "overloaded")
            NEWS_WORDS = ("releases", "released", "launches", "launched",
                          "announces", "announcing", "introducing")
            COMPARISON_WORDS = (" vs ", " compared", "benchmark",
                                "head-to-head")
            BEST_PRACTICE_WORDS = ("how to", "best practice", "guide to",
                                   "pattern for", "lessons from")

            if any(w in text_for_kind for w in BUG_WORDS) and subject != "general":
                kind, sev = "bug", 4
            elif any(w in text_for_kind for w in BUG_WORDS):
                kind, sev = "bug", 3  # general-subject bugs max at 3
            elif any(w in text_for_kind for w in NEWS_WORDS):
                kind, sev = "news", 3
            elif any(w in text_for_kind for w in COMPARISON_WORDS):
                kind, sev = "comparison", 2
            elif any(w in text_for_kind for w in BEST_PRACTICE_WORDS):
                kind, sev = "best_practice", 3
            else:
                kind, sev = "noise", 1

        # Impact targets — derived from subject.
        impact: list[str] = []
        if subject in ("claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5",
                       "claude-code", "anthropic-sdk", "mcp", "openai-gpt-5.5",
                       "openai-codex", "gemini-2.5-pro", "gemini-2.5-flash"):
            impact.extend(["automation", "study"])
        elif subject == "github-actions":
            impact.append("automation")

        out.append({
            "id": r["id"], "kind": kind, "subject": subject,
            "impact_targets": impact,
            "severity": sev, "novelty": 3,
            "summary": (r.get("title") or "")[:200],
            "action_hint": "",
            "recommendation": "",
            "dedupe_group": kind + "-" + subject,
        })
    return {"records": out}


def classify(records: list[dict], dry_run: bool = False) -> dict:
    if not records:
        return {"records": []}

    has_any_key = any(os.environ.get(k, "").strip() for k in
                      ("ANTHROPIC_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"))
    if dry_run or not has_any_key:
        if not dry_run:
            print("[analyzer] no LLM API keys available "
                  "(ANTHROPIC_API_KEY / GEMINI_API_KEY / OPENAI_API_KEY all empty) "
                  "— using stub classifier", file=sys.stderr)
        return summarize(_stub_classify(records), records)

    classified: list[dict] = []
    stub_used_for_batches = 0
    for i in range(0, len(records), RECORDS_PER_BATCH):
        batch = records[i:i + RECORDS_PER_BATCH]
        slim = [{
            "id": r["id"],
            "source": r["source"],
            "title": r["title"],
            "body": r.get("body", "")[:1500],
            "score": r.get("score", 0),
            "url": r["url"],
        } for r in batch]
        try:
            result = _classify_one_batch(CLASSIFY_PROMPT, slim)
            classified.extend(result.get("records", []))
        except (RuntimeError, KeyError, ValueError) as e:
            print(f"[analyzer] batch {i}-{i+len(batch)} failed: {e}", file=sys.stderr)
            classified.extend(_stub_classify(batch)["records"])
            stub_used_for_batches += 1

    if stub_used_for_batches:
        print(f"[analyzer] {stub_used_for_batches} batch(es) fell back to stub",
              file=sys.stderr)
    return summarize({"records": classified}, records)


def summarize(classified: dict, originals: list[dict]) -> dict:
    """Attach an aggregate `summary` block."""
    by_id = {r["id"]: r for r in originals}
    kinds = Counter(c["kind"] for c in classified["records"])
    subjects = Counter(c["subject"] for c in classified["records"])
    sev_hist = Counter(c["severity"] for c in classified["records"])
    high = []
    recommendations = []
    impacts = Counter()
    for c in classified["records"]:
        for tgt in c.get("impact_targets") or []:
            impacts[tgt] += 1
        if c["severity"] >= 4 and c["kind"] in ("bug", "feature", "best_practice"):
            orig = by_id.get(c["id"], {})
            high.append({**c, "url": orig.get("url"), "title": orig.get("title"),
                         "source": orig.get("source"), "ts": orig.get("ts")})
        if (c.get("recommendation") or "").strip():
            orig = by_id.get(c["id"], {})
            recommendations.append({**c, "url": orig.get("url"),
                                    "title": orig.get("title"),
                                    "source": orig.get("source")})
    return {
        "records": classified["records"],
        "originals_by_id": by_id,
        "summary": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "model": DEFAULT_MODEL,
            "total": len(classified["records"]),
            "by_kind": dict(kinds),
            "by_subject": dict(subjects),
            "by_severity": {str(k): v for k, v in sev_hist.items()},
            "by_impact": dict(impacts),
            "high_signal": high,
            "recommendations": recommendations,
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", help="JSONL file (default: stdin)")
    ap.add_argument("--output", help="JSON file (default: stdout)")
    ap.add_argument("--dry-run", action="store_true",
                    help="Skip API calls; use heuristic classifier")
    args = ap.parse_args()

    src = open(args.input) if args.input else sys.stdin
    records = [json.loads(line) for line in src if line.strip()]
    if args.input:
        src.close()

    result = classify(records, dry_run=args.dry_run)
    out = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w") as fh:
            fh.write(out)
    else:
        sys.stdout.write(out + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
