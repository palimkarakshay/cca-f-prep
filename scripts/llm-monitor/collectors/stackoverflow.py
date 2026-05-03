#!/usr/bin/env python3
"""
Stack Overflow collector — pulls recent questions tagged with the
LLMs / SDKs / frameworks this pipeline depends on.

Uses the StackExchange API v2.3:

    https://api.stackexchange.com/docs/questions

No auth required for read access. Anonymous quota is 300 req/day per
IP, which jumps to 10,000 req/day with a free `key` parameter
(register at https://stackapps.com/apps/oauth/register — script-type
OAuth).

Pagination budget (codex P2 round 3 on PR #241):
  * Unauthenticated path: capped at 1 page per tag — 6 tags × 12
    sweeps = 72 req/day, well under the 300/day anonymous cap. The
    most-recent 50 questions per tag are plenty at every-2h cadence.
  * Authenticated path (STACKEXCHANGE_API_KEY set): up to MAX_PAGES
    pages per tag — 6 tags × 5 pages × 12 sweeps = 360 req/day, well
    under the 10k authed cap.
  * Backoff: API-requested backoff is honoured between page requests
    (capped at 30s so the watch tier's 8-min timeout still applies).

Why Stack Overflow matters for this pipeline:
  * Questions tagged `claude-code` / `anthropic` / `openai-api` are
    where bugs surface as concrete reproductions before they reach
    HN front page.
  * Answers (when present) often contain the workaround the
    feedback step's `action_hint` field is meant to capture.
  * Slow signal but high quality — the inverse of Reddit.

Activity-based windowing (vs creation-based, codex-P2 on PR #241):
  We filter `sort=activity` + `min=<unix>`, NOT `sort=creation` +
  `fromdate`. A question's workaround often lands as an answer days
  after the question was posted; creation-windowing would drop those
  permanently. Combined with an `answer_count`-aware dedupe id
  (`so:{qid}:a{n}`), a fresh answer re-flows the question through
  the analyzer while routine comment churn does not.

Run standalone:
    python3 scripts/llm-monitor/collectors/stackoverflow.py
"""
from __future__ import annotations

import os
import time
import urllib.parse
from datetime import datetime, timedelta, timezone

from _common import (
    emit, http_get_json, load_sources, now_utc, strip_html, truncate, warn,
)

API = "https://api.stackexchange.com/2.3/questions"
PAGE_SIZE = 50
# Hard cap on pages per tag, only applied when STACKEXCHANGE_API_KEY
# is set (codex P2 round 3 on PR #241). Without a key, the daily
# anonymous quota (300 req/day) does not afford multi-page fetching:
# 6 tags × 5 pages × 12 sweeps = 360 req/day blows the budget. With a
# key the quota jumps to 10k/day and 360 req/day is comfortable.
MAX_PAGES_AUTHED = 5
MAX_PAGES_ANON = 1


def fetch_tag(tag: str, since_ts: int, key: str) -> list[dict]:
    # `sort=activity` + `min=<unix ts>` returns questions whose LAST
    # activity (any answer / edit / new comment) falls inside the
    # window, not just questions created in it. This matters because
    # a question's workaround often arrives in an answer hours or days
    # after it was first posted (codex-review P2 on PR #241): if we
    # filtered by creation we'd permanently miss any answer that
    # lands later than the next sweep.
    #
    # Pagination: loop on `page` until `has_more=false` or the
    # authenticated/anonymous page cap, honouring API backoff between
    # requests. The cap depends on whether a key is set — the
    # anonymous cap (1 page) keeps daily request count under the
    # 300/day quota; the authed cap (5 pages) only applies when a
    # STACKEXCHANGE_API_KEY pushes the quota to 10k/day.
    max_pages = MAX_PAGES_AUTHED if key else MAX_PAGES_ANON
    items: list[dict] = []
    for page in range(1, max_pages + 1):
        params = {
            "order": "desc",
            "sort": "activity",
            "tagged": tag,
            "site": "stackoverflow",
            "pagesize": str(PAGE_SIZE),
            "page": str(page),
            "min": str(since_ts),
            # `withbody` returns the question body so the analyzer can
            # see actual repro steps instead of just titles.
            "filter": "withbody",
        }
        if key:
            params["key"] = key
        url = f"{API}?{urllib.parse.urlencode(params)}"
        try:
            resp = http_get_json(url)
        except Exception as e:  # noqa: BLE001
            warn(f"stackoverflow: tag {tag!r} page {page} fetch failed: {e}")
            break

        items.extend(resp.get("items", []))

        # StackExchange asks for a back-off sleep when nearing rate
        # limits. Honour it before issuing the next page request.
        backoff = resp.get("backoff")
        if backoff:
            warn(f"stackoverflow: backoff requested by API for {tag!r}: {backoff}s")
            time.sleep(min(int(backoff), 30))

        if not resp.get("has_more"):
            break
    else:
        # Loop exhausted the page cap without has_more=False — note in
        # stderr so the operator can spot a tag that consistently caps
        # out. Anonymous mode tripping this often is a strong signal
        # to add STACKEXCHANGE_API_KEY.
        mode = "authed" if key else "anonymous"
        warn(f"stackoverflow: tag {tag!r} hit page cap ({mode}, "
             f"{max_pages} page(s), {len(items)} items pulled); consider "
             f"adding STACKEXCHANGE_API_KEY to raise the cap to "
             f"{MAX_PAGES_AUTHED} pages.")

    return items


def main() -> int:
    cfg = load_sources().get("stackoverflow", {})
    tags = cfg.get("tags", [])
    if not tags:
        warn("stackoverflow: no tags configured; skipping")
        return 0
    lookback_h = int(cfg.get("lookback_hours", 12))
    min_score = int(cfg.get("min_score", 0))
    cutoff = now_utc() - timedelta(hours=lookback_h)
    cutoff_ts = int(cutoff.timestamp())

    # Optional API key — read from env if set; collector is
    # intentionally happy with anonymous quota at this cadence.
    key = os.environ.get("STACKEXCHANGE_API_KEY", "").strip()
    if key:
        warn("stackoverflow: using authenticated quota")

    seen: set[str] = set()
    emitted = 0
    for tag in tags:
        for q in fetch_tag(tag, cutoff_ts, key):
            qid = str(q.get("question_id") or "")
            if not qid or qid in seen:
                continue
            seen.add(qid)

            score = int(q.get("score") or 0)
            if score < min_score:
                continue

            owner = q.get("owner") or {}
            answer_count = int(q.get("answer_count") or 0)
            # Use last_activity_date for the record timestamp because
            # we're filtering by activity, not creation. This makes the
            # digest's "ts" reflect when the question moved into our
            # window (e.g. when an answer landed), which is the
            # operationally meaningful moment for this pipeline.
            ts = datetime.fromtimestamp(
                int(q.get("last_activity_date")
                    or q.get("creation_date") or 0),
                tz=timezone.utc,
            ).isoformat()
            body_text = strip_html(q.get("body") or "")

            # Dedupe id incorporates answer_count so a new answer
            # produces a fresh id and the question re-flows through
            # the analyzer — that's the codex-P2 fix path. Routine
            # comment churn (which doesn't bump answer_count) does
            # NOT re-emit, so we don't churn the digest on every
            # sweep.
            emit({
                "source": "stackoverflow",
                "source_detail": tag,
                "id": f"so:{qid}:a{answer_count}",
                "url": q.get("link", ""),
                "title": truncate(q.get("title") or "", 300),
                "body": truncate(body_text),
                "author": owner.get("display_name", ""),
                "ts": ts,
                "score": score,
                "comments": answer_count,
                "raw": {
                    "tags": q.get("tags", []),
                    "is_answered": bool(q.get("is_answered")),
                    "answer_count": answer_count,
                    "view_count": int(q.get("view_count") or 0),
                    "creation_date": int(q.get("creation_date") or 0),
                    "last_activity_date": int(q.get("last_activity_date") or 0),
                },
            })
            emitted += 1

    warn(f"stackoverflow: emitted {emitted} records across {len(tags)} tags")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
