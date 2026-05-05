# Runbook: Claude Max recategorised as commercial-disallowed

## Trigger

Any one of:

- Anthropic TOS update flags personal-tier subscriptions (Pro, Max
  5x, Max 20x) as prohibited for commercial output.
- Anthropic enforces existing language on the operator's account
  (warning email, usage flag, throttle).
- Anthropic raises Max 20x pricing more than 50% in a single review
  cycle, making API-direct cheaper at the operator's volume.

## Steps (≤ 4 hours)

1. Switch content authoring from Claude Code (Max) to Anthropic API
   direct via the OpenRouter wrapper (P11 mitigation).
2. Update environment: set `ANTHROPIC_API_KEY` direct; remove any
   `CLAUDE_CODE_MODE` reliance from the content-generation pipeline.
3. Re-run the AI-cost spreadsheet at the new shape (per P2
   mitigation): one row per pipeline call, list prices, no prompt
   caching credit.
4. Update the canonical mitigation plan §16.5 cost basis: drop the
   $200 Max line, add the API line ($30–80 Y1, $80–200 Y2).
5. Update `decisions.md` with the date and reason; flag if cost
   basis crossed any §17 kill trigger.

## Worst case

Operator pays an additional $0–100/mo. No content loss; no migration
of stored content; no churn impact on existing users. Total downside
is bounded; this runbook is one afternoon, not a week.

## Pre-emptive hedge

If the operator wants to retire this risk before it triggers, run
content authoring exclusively on Anthropic API direct from day 1 and
treat Claude Code Max as personal-only. Net Y1 cost delta: ~$30–80/mo
extra (small absolute, large peace-of-mind).
