#!/usr/bin/env python3
"""
HackerNews collector — pulls stories + top-level comments matching any
configured query, filtered by lookback window and minimum points.

Uses the Algolia HN API (https://hn.algolia.com/api). No auth, no
rate-limit gating below ~10k req/hr — well within budget.

Run standalone:
    python3 scripts/llm-monitor/collectors/hackernews.py

Emits JSONL to stdout. See `_common.py` for the record shape.
"""
from __future__ import annotations

import urllib.parse
from datetime import timedelta

from _common import (
    emit, http_get_json, load_sources, now_utc, truncate, warn,
)

ALGOLIA = "https://hn.algolia.com/api/v1/search_by_date"


def fetch_query(query: str, since_ts: int) -> list[dict]:
    params = {
        "query": query,
        "tags": "(story,comment)",
        "numericFilters": f"created_at_i>={since_ts}",
        "hitsPerPage": "50",
    }
    url = f"{ALGOLIA}?{urllib.parse.urlencode(params)}"
    try:
        return http_get_json(url).get("hits", [])
    except Exception as e:  # noqa: BLE001 — collector best-effort
        warn(f"hackernews: query {query!r} failed: {e}")
        return []


def main() -> int:
    cfg = load_sources()["hackernews"]
    lookback_h = int(cfg.get("lookback_hours", 36))
    min_points = int(cfg.get("min_points", 5))
    since = now_utc() - timedelta(hours=lookback_h)
    since_ts = int(since.timestamp())

    seen_ids: set[str] = set()
    emitted = 0

    for query in cfg["queries"]:
        for hit in fetch_query(query, since_ts):
            obj_id = str(hit.get("objectID") or "")
            if not obj_id or obj_id in seen_ids:
                continue
            seen_ids.add(obj_id)

            points = int(hit.get("points") or 0)
            num_comments = int(hit.get("num_comments") or 0)
            # Stories below threshold are skipped; comments always
            # pass the points gate (they don't have one) but inherit
            # their parent's relevance via the keyword match.
            is_comment = bool(hit.get("comment_text"))
            if not is_comment and points < min_points:
                continue

            title = hit.get("title") or hit.get("story_title") or "(no title)"
            body = hit.get("comment_text") or hit.get("story_text") or ""
            url = hit.get("url") or f"https://news.ycombinator.com/item?id={obj_id}"

            emit({
                "source": "hackernews",
                "source_detail": "comment" if is_comment else "story",
                "id": f"hn:{obj_id}",
                "url": url,
                "title": truncate(title, 300),
                "body": truncate(body),
                "author": hit.get("author") or "",
                "ts": hit.get("created_at") or "",
                "score": points,
                "comments": num_comments,
                "raw": {"query": query, "hn_id": obj_id},
            })
            emitted += 1

    warn(f"hackernews: emitted {emitted} records across {len(cfg['queries'])} queries")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
