#!/usr/bin/env python3
"""
GitHub collector — pulls recent releases + issues from each tracked
SDK / CLI repo (configured in `sources.json`).

Why this is high-signal: when the Anthropic SDK ships a new version
or the OpenAI SDK has a 100-reaction "ChatCompletion is broken on
Python 3.13" issue, those are the events most likely to *immediately*
affect this operator pipeline. We pull both:

  * **Releases** — newest first, filtered by lookback window. The
    release body is the changelog; the analyzer mines it for breaking
    changes and deprecations.
  * **Issues** — recent or recently-updated, filtered by reaction
    count so we only see issues the community is actively confirming.

Uses the `gh` CLI when GH_TOKEN is set (matching every other script
in this repo) — no extra auth code, no rate-limit babysitting. Falls
back to the unauthenticated REST API when invoked outside CI; that
path is rate-limited to 60 req/hr and is intended for local dev only.

Run standalone:
    GH_TOKEN=$(gh auth token) python3 scripts/llm-monitor/collectors/github.py
"""
from __future__ import annotations

import json
import os
import subprocess
from datetime import timedelta

from _common import (
    emit, http_get_json, load_sources, now_utc, parse_iso, truncate, warn,
)


def _gh_api(path: str) -> list | dict:
    """Call `gh api` and return decoded JSON. Returns [] on failure."""
    try:
        out = subprocess.check_output(
            ["gh", "api", path, "--paginate", "-H", "Accept: application/vnd.github+json"],
            text=True, stderr=subprocess.PIPE,
        )
        # `gh api --paginate` concatenates JSON arrays; for a single page
        # the output is one JSON document. We try both.
        try:
            return json.loads(out)
        except json.JSONDecodeError:
            # Concatenated arrays: split, parse, flatten.
            results: list = []
            depth = 0
            buf = []
            for ch in out:
                buf.append(ch)
                if ch == "[":
                    depth += 1
                elif ch == "]":
                    depth -= 1
                    if depth == 0:
                        results.extend(json.loads("".join(buf)))
                        buf = []
            return results
    except subprocess.CalledProcessError as e:
        warn(f"github: gh api {path} failed: {e.stderr.strip()[:200]}")
        return []


def _public_api(path: str) -> list | dict:
    """Unauthenticated GitHub REST. Used only when gh is unavailable."""
    try:
        return http_get_json(f"https://api.github.com{path}")
    except Exception as e:  # noqa: BLE001
        warn(f"github: public api {path} failed: {e}")
        return []


def fetch(path: str) -> list | dict:
    if os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN"):
        return _gh_api(path)
    return _public_api(path)


def collect_releases(repo: str, cutoff) -> int:
    releases = fetch(f"/repos/{repo}/releases?per_page=20")
    if not isinstance(releases, list):
        return 0
    n = 0
    for rel in releases:
        ts = parse_iso(rel.get("published_at") or rel.get("created_at") or "")
        if ts < cutoff:
            continue
        emit({
            "source": "github",
            "source_detail": f"{repo}/release",
            "id": f"gh-release:{repo}:{rel.get('id')}",
            "url": rel.get("html_url") or "",
            "title": truncate(f"{repo} {rel.get('tag_name') or rel.get('name') or ''}".strip(), 300),
            "body": truncate(rel.get("body") or ""),
            "author": (rel.get("author") or {}).get("login", ""),
            "ts": ts.isoformat(),
            "score": 0,
            "comments": 0,
            "raw": {
                "repo": repo,
                "tag": rel.get("tag_name"),
                "prerelease": bool(rel.get("prerelease")),
            },
        })
        n += 1
    return n


def collect_issues(repo: str, cutoff, min_reactions: int) -> int:
    # `sort=updated` gives us recently-touched issues; we then filter by
    # the lookback cutoff. Pull requests come back in the same endpoint;
    # we drop them by checking the `pull_request` key.
    issues = fetch(f"/repos/{repo}/issues?state=all&sort=updated&per_page=50")
    if not isinstance(issues, list):
        return 0
    n = 0
    for iss in issues:
        if iss.get("pull_request"):
            continue
        ts = parse_iso(iss.get("updated_at") or iss.get("created_at") or "")
        if ts < cutoff:
            continue
        reactions = (iss.get("reactions") or {}).get("total_count", 0)
        if reactions < min_reactions:
            continue
        labels = [l.get("name", "") for l in iss.get("labels", []) if isinstance(l, dict)]
        emit({
            "source": "github",
            "source_detail": f"{repo}/issue",
            "id": f"gh-issue:{repo}:{iss.get('number')}",
            "url": iss.get("html_url") or "",
            "title": truncate(iss.get("title") or "", 300),
            "body": truncate(iss.get("body") or ""),
            "author": (iss.get("user") or {}).get("login", ""),
            "ts": ts.isoformat(),
            "score": reactions,
            "comments": int(iss.get("comments") or 0),
            "raw": {"repo": repo, "labels": labels, "state": iss.get("state")},
        })
        n += 1
    return n


def main() -> int:
    cfg = load_sources()["github"]
    lookback_h = int(cfg.get("lookback_hours", 48))
    cutoff = now_utc() - timedelta(hours=lookback_h)
    min_reactions = int(cfg.get("issue_min_reactions", 3))

    total = 0
    for repo in cfg["repos"]:
        if cfg.get("include_releases", True):
            total += collect_releases(repo, cutoff)
        if cfg.get("include_issues", True):
            total += collect_issues(repo, cutoff, min_reactions)

    warn(f"github: emitted {total} records across {len(cfg['repos'])} repos")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
