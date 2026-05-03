<!-- AUTO-MAINTAINED above the AUTO-START line by feedback.py.
The hand-curated section below the AUTO-END marker is preserved on
auto-rewrites. Code-review / research / automation prompts read this
list to decide whether the next architecture pass should pick up a
system-level enhancement to the bot fleet. -->

# Self-automation system recommendations

> _A running, deduped list of "the bot fleet should do X" suggestions
> surfaced by the llm-monitor analyzer. See
> [`scripts/llm-monitor/README.md`](../../scripts/llm-monitor/README.md)
> for how the analyzer produces these._

The llm-monitor pipeline reads news/blog/Reddit/GitHub for changes in
the world that could enhance our automation system. When it spots
"oh, we should also be watching X" or "this would have been caught by
a Y check", it adds an entry here. The list is **input** to the next
architecture pass — it does not auto-implement anything.

## How items get on / off this list

* **On**: when an llm-monitor analyzer pass yields a record with a
  non-empty `recommendation` field, `feedback.py` upserts a one-line
  entry into the auto-section below, deduped by recommendation slug.
* **Off**: the operator manually moves items into the
  "Implemented / declined" section below the AUTO-END marker, with
  a note. Items in the auto-section that haven't been seen in 30
  days drop off automatically.

## How to act on items

The codex-review prompt (and any future deep-research / delegation
prompts) include a directive:

> "If the user's request involves the bot fleet itself, check
> RECOMMENDATIONS.md for relevant entries before scoping the work."

So a "let's improve the bots" issue starts pre-loaded with what the
field has been suggesting. To promote a recommendation into actual
work, file a regular issue, link the slug, and remove the entry from
the auto-section in the same PR (it'll re-appear if the underlying
signal hasn't been resolved — that's a correctness check on whether
the work actually addressed it).

<!-- AUTO-START — everything below is rewritten by feedback.py -->

## Active recommendations (last 30 days)

_No active recommendations in the rolling window._

<!-- AUTO-END -->

## Implemented / declined (operator-curated)

_(Move items here with a one-line note when actioned. Format:
`- [done|declined] (YYYY-MM-DD) <slug> — <note>`.)_

- _none yet_
