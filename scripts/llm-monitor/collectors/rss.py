#!/usr/bin/env python3
"""
RSS / Atom collector — pulls recent entries from each configured feed.

Stdlib-only XML parsing (`xml.etree.ElementTree`). Handles both
RSS 2.0 (`<item>` under `<channel>`) and Atom (`<entry>` under
`<feed>`). Bodies are HTML-stripped to plain text and truncated.

Run standalone:
    python3 scripts/llm-monitor/collectors/rss.py
"""
from __future__ import annotations

import xml.etree.ElementTree as ET
from datetime import timedelta
from email.utils import parsedate_to_datetime

from _common import (
    emit, http_get_text, load_sources, now_utc, parse_iso,
    strip_html, truncate, warn,
)

ATOM_NS = "{http://www.w3.org/2005/Atom}"


def _text(elem, tag: str) -> str:
    if elem is None:
        return ""
    child = elem.find(tag)
    if child is None:
        # Try Atom namespace
        child = elem.find(ATOM_NS + tag.split("}")[-1])
    return (child.text or "").strip() if child is not None and child.text else ""


def _parse_date(s: str):
    if not s:
        return now_utc()
    # Try RFC 822 (RSS) then ISO (Atom)
    try:
        return parsedate_to_datetime(s)
    except (TypeError, ValueError):
        return parse_iso(s)


def parse_feed(name: str, xml_text: str) -> list[dict]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as e:
        warn(f"rss: {name}: parse error: {e}")
        return []

    out: list[dict] = []

    # RSS 2.0
    for item in root.iter("item"):
        title = _text(item, "title")
        link = _text(item, "link")
        desc = _text(item, "description")
        pub = _text(item, "pubDate")
        guid = _text(item, "guid") or link
        out.append({
            "title": title, "link": link, "body_html": desc,
            "ts_raw": pub, "guid": guid,
        })

    # Atom
    for entry in root.iter(ATOM_NS + "entry"):
        title_el = entry.find(ATOM_NS + "title")
        title = (title_el.text or "").strip() if title_el is not None else ""
        link_el = entry.find(ATOM_NS + "link")
        link = link_el.get("href", "") if link_el is not None else ""
        summary_el = entry.find(ATOM_NS + "summary") or entry.find(ATOM_NS + "content")
        body = (summary_el.text or "") if summary_el is not None else ""
        ts_el = entry.find(ATOM_NS + "updated") or entry.find(ATOM_NS + "published")
        ts_raw = (ts_el.text or "") if ts_el is not None else ""
        id_el = entry.find(ATOM_NS + "id")
        guid = (id_el.text or link) if id_el is not None else link
        out.append({
            "title": title, "link": link, "body_html": body,
            "ts_raw": ts_raw, "guid": guid,
        })

    return out


def main() -> int:
    cfg = load_sources()["rss"]
    lookback_h = int(cfg.get("lookback_hours", 48))
    cutoff = now_utc() - timedelta(hours=lookback_h)

    emitted = 0
    for feed in cfg["feeds"]:
        name = feed["name"]
        url = feed["url"]
        try:
            xml_text = http_get_text(url)
        except Exception as e:  # noqa: BLE001
            warn(f"rss: {name}: fetch failed: {e}")
            continue

        for item in parse_feed(name, xml_text):
            ts = _parse_date(item["ts_raw"])
            if ts.tzinfo is None:
                # Treat naive as UTC; better than dropping the entry.
                from datetime import timezone as _tz
                ts = ts.replace(tzinfo=_tz.utc)
            if ts < cutoff:
                continue

            link = item["link"]
            if not link:
                continue
            emit({
                "source": "rss",
                "source_detail": name,
                "id": f"rss:{item['guid']}",
                "url": link,
                "title": truncate(item["title"], 300),
                "body": truncate(strip_html(item["body_html"])),
                "author": "",
                "ts": ts.isoformat(),
                "score": 0,
                "comments": 0,
                "raw": {"feed": name},
            })
            emitted += 1

    warn(f"rss: emitted {emitted} records across {len(cfg['feeds'])} feeds")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
