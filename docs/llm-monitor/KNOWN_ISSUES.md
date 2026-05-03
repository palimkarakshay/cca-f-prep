<!-- AUTO-MAINTAINED — do not hand-edit between the AUTO-START / AUTO-END
markers. The llm-monitor pipeline rewrites those sections each run.
Hand-curated context goes ABOVE the AUTO-START line. -->

# LLM monitor — known issues feed

> _Read by the codex-review prompt (and any future deep-research /
> delegation prompts) so every bot run starts from current field
> reports instead of frozen training data._
> _See [`scripts/llm-monitor/README.md`](../../scripts/llm-monitor/README.md)._

This file is the **self-awareness layer** for the bot fleet. The
`llm-monitor` pipeline scrapes blogs, GitHub, HN, and Reddit, asks
Claude Opus to classify what's signal and what's noise, and rewrites
the auto-maintained section below. Code-review / research / automation
prompts read this file at the start of every run.

## How to use this from a prompt

Include the auto section verbatim in your prompt's "Operating context"
block. Each bullet is short by design — title + action_hint — so it
doesn't blow your context budget. Example:

```
## Known LLM issues (refreshed by llm-monitor)
{paste contents of AUTO-START..AUTO-END here}
```

If a bullet is older than 14 days OR no longer reproducible, the
analyzer drops it on the next run. There is no "expire by hand" knob.

## Hand-curated section (operator notes)

_(Add long-lived gotchas here — they survive auto-rewrites. Keep to
~10 entries; if it grows beyond that, the underlying problem belongs
in a permanent doc, not this list.)_

- _none yet_

<!-- AUTO-START — everything below is rewritten by feedback.py -->

## Auto-discovered (last 14 days)

_No high-signal items in the rolling window._

<!-- AUTO-END -->
