#!/usr/bin/env python3
"""
Status-page collector — pulls current incident state from the
provider status pages this operator pipeline depends on.

Most of these run on Statuspage.io and expose a uniform JSON API:

    /api/v2/status.json              — top-level "all systems operational"
                                       indicator (none/minor/major/critical)
    /api/v2/incidents/unresolved.json — currently open incidents
    /api/v2/incidents.json           — recent (last ~50, including resolved)

We hit `unresolved.json` (load-bearing — open outages) plus the
`status.json` indicator (lets us emit a sev-3 "still degraded" record
even when there's no formal incident page yet).

Watched providers (configured in `sources.json` → `statuspages.providers`):
  - Anthropic              — Claude API + claude.ai
  - OpenAI                 — gpt-* + ChatGPT
  - Vercel                 — site hosting (impacts site lane)
  - GitHub                 — Actions / API (impacts pipeline lane)
  - Cloudflare             — DNS + CDN front of most providers above

This collector is the load-bearing input to the new "watch" cadence
(every 15 min). When an incident appears here, the orchestrator's
watch mode files an auto-discovered issue + appends to KNOWN_ISSUES
without waiting for the next 2-hour sweep.

Run standalone:
    python3 scripts/llm-monitor/collectors/statuspages.py
"""
from __future__ import annotations

from datetime import timedelta

from _common import (
    emit, http_get_json, load_sources, now_utc, parse_iso, truncate, warn,
)

# Statuspage.io status indicator → severity mapping. The indicator is
# their canonical four-level scale; we map it to our 1-5 rubric.
INDICATOR_SEVERITY = {
    "none": 0,        # operational — no record emitted
    "minor": 3,       # degraded performance / partial outage
    "major": 4,       # significant outage
    "critical": 5,    # full outage
    "maintenance": 2, # planned maintenance — informational
}

INDICATOR_KIND = {
    "none": "noise",
    "minor": "bug",
    "major": "bug",
    "critical": "bug",
    "maintenance": "news",
}


def fetch_statuspage(name: str, base_url: str) -> list[dict]:
    """Return zero or more normalized records for one statuspage.io provider."""
    base_url = base_url.rstrip("/")
    out: list[dict] = []

    # 1. Top-level indicator. Always emit a record so the analyzer can
    #    say "still degraded" even when no incident is active. We
    #    suppress emission for `none` so green-status doesn't flood
    #    the digest.
    try:
        status = http_get_json(f"{base_url}/api/v2/status.json")
    except Exception as e:  # noqa: BLE001
        warn(f"statuspages: {name}: status.json fetch failed: {e}")
        status = None

    if status:
        ind = (status.get("status") or {}).get("indicator", "none")
        desc = (status.get("status") or {}).get("description", "")
        page_updated = (status.get("page") or {}).get("updated_at", "")
        if ind != "none":
            sev = INDICATOR_SEVERITY.get(ind, 3)
            kind_hint = INDICATOR_KIND.get(ind, "bug")
            out.append({
                "source": "statuspages",
                "source_detail": f"{name}/indicator",
                "id": f"sp-indicator:{name}:{ind}:{page_updated[:10]}",
                "url": base_url,
                "title": truncate(f"{name} status: {desc or ind}", 300),
                "body": f"Top-level indicator from {base_url}: {ind}. "
                        f"Description: {desc}",
                "author": name,
                "ts": page_updated or now_utc().isoformat(),
                "score": sev,           # repurpose `score` as raw severity
                "comments": 0,
                "raw": {
                    "provider": name,
                    "indicator": ind,
                    "kind_hint": kind_hint,
                },
            })

    # 2. Unresolved incidents — the highest-signal bucket. One record
    #    per open incident.
    try:
        incidents = http_get_json(f"{base_url}/api/v2/incidents/unresolved.json")
    except Exception as e:  # noqa: BLE001
        warn(f"statuspages: {name}: incidents/unresolved.json fetch failed: {e}")
        incidents = {}

    for inc in (incidents.get("incidents") or []):
        impact = inc.get("impact", "minor")
        sev = INDICATOR_SEVERITY.get(impact, 3)
        kind_hint = INDICATOR_KIND.get(impact, "bug")
        latest = ""
        for upd in (inc.get("incident_updates") or [])[:1]:
            latest = upd.get("body", "")
        body = f"Status: {inc.get('status', 'investigating')}\n" \
               f"Impact: {impact}\n" \
               f"Started: {inc.get('started_at', '')}\n\n" \
               f"Latest update:\n{latest}"
        out.append({
            "source": "statuspages",
            "source_detail": f"{name}/incident",
            "id": f"sp-incident:{name}:{inc.get('id')}",
            "url": inc.get("shortlink") or f"{base_url}/incidents/{inc.get('id', '')}",
            "title": truncate(f"[{name}] {inc.get('name', 'incident')}", 300),
            "body": truncate(body),
            "author": name,
            "ts": inc.get("updated_at") or inc.get("started_at") or now_utc().isoformat(),
            "score": sev,
            "comments": len(inc.get("incident_updates") or []),
            "raw": {
                "provider": name,
                "impact": impact,
                "status": inc.get("status"),
                "kind_hint": kind_hint,
                "incident_id": inc.get("id"),
            },
        })

    return out


def main() -> int:
    cfg = load_sources().get("statuspages", {})
    providers = cfg.get("providers", [])
    lookback_h = int(cfg.get("lookback_hours", 6))
    cutoff = now_utc() - timedelta(hours=lookback_h)

    total = 0
    for prov in providers:
        name = prov["name"]
        url = prov["url"]
        for rec in fetch_statuspage(name, url):
            ts = parse_iso(rec.get("ts", ""))
            if ts.tzinfo is None:
                from datetime import timezone as _tz
                ts = ts.replace(tzinfo=_tz.utc)
            # Skip records older than the lookback window — when an
            # incident closes, statuspage.io still returns the
            # historical entry on `incidents.json`; we don't pull
            # that endpoint, so this is mostly a defensive guard.
            if ts < cutoff:
                continue
            emit(rec)
            total += 1

    warn(f"statuspages: emitted {total} records across {len(providers)} providers")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
