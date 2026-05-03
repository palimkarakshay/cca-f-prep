"""
Shared helpers for llm-monitor collectors.

Every collector emits a *normalized record* — a dict with the same
shape regardless of source — so `store.py` and `analyzer.py` don't
have to know per-source details.

Record shape (JSONL — one record per line on stdout):

    {
      "source":        "hackernews" | "rss" | "reddit" | "github",
      "source_detail": "<feed name | subreddit | repo>",
      "id":            "<source-stable id, used for dedupe>",
      "url":           "<canonical URL>",
      "title":         "<short title>",
      "body":          "<text body, truncated to ~2k chars>",
      "author":        "<username or display name>",
      "ts":            "<ISO-8601 UTC>",
      "score":         <int, 0 if N/A>,
      "comments":      <int, 0 if N/A>,
      "raw":           {<source-specific extras the analyzer may want>}
    }

`emit(record)` writes one JSON line to stdout. `http_get_json` and
`http_get_text` use stdlib only — no `requests` dep — to keep this
runnable on the bare CI image.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

USER_AGENT = "cca-f-prep-llm-monitor/0.1 (+https://github.com/palimkarakshay/cca-f-prep)"
HTTP_TIMEOUT_SECS = 30
BODY_MAX_CHARS = 2000

ROOT = Path(__file__).resolve().parents[1]


def load_sources() -> dict[str, Any]:
    with (ROOT / "sources.json").open() as fh:
        return json.load(fh)


def http_get_json(url: str, headers: dict[str, str] | None = None) -> Any:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "application/json", **(headers or {})},
    )
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT_SECS) as r:
        return json.loads(r.read())


def http_get_text(url: str, headers: dict[str, str] | None = None) -> str:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, **(headers or {})},
    )
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT_SECS) as r:
        return r.read().decode("utf-8", errors="replace")


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def parse_iso(s: str) -> datetime:
    """Best-effort ISO-8601 parser. Falls back to now() on failure."""
    if not s:
        return now_utc()
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return now_utc()


def truncate(text: str, limit: int = BODY_MAX_CHARS) -> str:
    text = (text or "").strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "…"


def strip_html(html: str) -> str:
    """Crude HTML-to-text. Good enough for RSS bodies."""
    no_tags = re.sub(r"<[^>]+>", " ", html or "")
    return re.sub(r"\s+", " ", no_tags).strip()


def emit(record: dict[str, Any]) -> None:
    """Write one normalized record as a JSON line to stdout."""
    sys.stdout.write(json.dumps(record, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def warn(msg: str) -> None:
    sys.stderr.write(f"[llm-monitor] {msg}\n")
