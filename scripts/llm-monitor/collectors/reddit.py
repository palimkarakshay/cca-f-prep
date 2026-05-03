#!/usr/bin/env python3
"""
Reddit collector — pulls recent posts from each configured subreddit.

Two paths, picked at runtime:

  * **Authed (preferred)** — OAuth client-credentials flow when both
    REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are set. ~600 req/10min
    per OAuth app, plenty for our cadence.
  * **Public JSON (fallback)** — `https://www.reddit.com/r/<sub>/new.json`.
    No auth, ~60 req/min user-agent-keyed, often returns 429s on shared
    CI IPs but works for local dev.

The collector is best-effort per subreddit: a single failure does not
abort the run. Posts below the configured score / comment thresholds
are skipped — Reddit volume is high and noise-heavy, so the gates
matter.

Run standalone:
    python3 scripts/llm-monitor/collectors/reddit.py
"""
from __future__ import annotations

import base64
import os
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

from _common import (
    USER_AGENT, emit, http_get_json, http_get_text, load_sources,
    now_utc, truncate, warn,
)

OAUTH_TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
OAUTH_API = "https://oauth.reddit.com"
PUBLIC_API = "https://www.reddit.com"


def _get_oauth_token() -> str | None:
    cid = os.environ.get("REDDIT_CLIENT_ID", "").strip()
    secret = os.environ.get("REDDIT_CLIENT_SECRET", "").strip()
    if not cid or not secret:
        return None
    auth = base64.b64encode(f"{cid}:{secret}".encode()).decode()
    data = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
    req = urllib.request.Request(
        OAUTH_TOKEN_URL,
        data=data,
        headers={
            "Authorization": f"Basic {auth}",
            "User-Agent": USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            import json as _json
            return _json.loads(r.read()).get("access_token")
    except Exception as e:  # noqa: BLE001
        warn(f"reddit: oauth token fetch failed: {e}")
        return None


def fetch_subreddit(sub: str, token: str | None, limit: int = 50) -> list[dict]:
    if token:
        url = f"{OAUTH_API}/r/{sub}/new?limit={limit}"
        headers = {"Authorization": f"Bearer {token}"}
    else:
        url = f"{PUBLIC_API}/r/{sub}/new.json?limit={limit}"
        headers = {}
    try:
        data = http_get_json(url, headers=headers)
    except Exception as e:  # noqa: BLE001
        warn(f"reddit: r/{sub} fetch failed: {e}")
        return []
    return [c["data"] for c in data.get("data", {}).get("children", []) if c.get("data")]


def main() -> int:
    cfg = load_sources()["reddit"]
    lookback_h = int(cfg.get("lookback_hours", 36))
    min_score = int(cfg.get("min_score", 10))
    min_comments = int(cfg.get("min_comments", 5))
    cutoff = now_utc() - timedelta(hours=lookback_h)

    token = _get_oauth_token()
    mode = "oauth" if token else "public"
    warn(f"reddit: using {mode} API")

    emitted = 0
    for sub in cfg["subreddits"]:
        posts = fetch_subreddit(sub, token)
        for p in posts:
            created = datetime.fromtimestamp(int(p.get("created_utc") or 0), tz=timezone.utc)
            if created < cutoff:
                continue
            score = int(p.get("score") or 0)
            num_comments = int(p.get("num_comments") or 0)
            if score < min_score and num_comments < min_comments:
                continue
            permalink = p.get("permalink", "")
            url = f"https://reddit.com{permalink}" if permalink else (p.get("url") or "")
            emit({
                "source": "reddit",
                "source_detail": f"r/{sub}",
                "id": f"reddit:{p.get('id')}",
                "url": url,
                "title": truncate(p.get("title") or "", 300),
                "body": truncate(p.get("selftext") or ""),
                "author": p.get("author") or "",
                "ts": created.isoformat(),
                "score": score,
                "comments": num_comments,
                "raw": {"subreddit": sub, "flair": p.get("link_flair_text") or ""},
            })
            emitted += 1

    warn(f"reddit: emitted {emitted} records across {len(cfg['subreddits'])} subreddits")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
