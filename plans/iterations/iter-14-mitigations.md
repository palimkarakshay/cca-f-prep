# Iteration 14 — Mitigations (streak 4/5)

## Tactical fixes

### T-14.1 — Friend-and-family policy

Append to §16.2:

> **Friend-and-family policy.** Friends pay at list price with
> the same refund policy as everyone else. No comp accounts.
> Comp accounts create expectation drift and tax-reporting
> weirdness; treat all customers identically.

### T-14.2 — Specific MRR dashboard

Update §17b dashboard line:

> **Live MRR + cost dashboard.** Default Y1: a custom 30–50 line
> Next.js / Astro page that reads Stripe via webhook into a
> Postgres `daily_metrics` table. Public read URL, refreshes
> daily. Y2 (if MRR > $5k): switch to Baremetrics ($50/mo) for
> plug-and-play.

### T-14.3 — Subscription pause (v1.1)

Append to §16.1 surface block:

> v1.1 also adds **subscription pause** (1–3 months) — reduces
> involuntary churn ~15% per indie SaaS benchmark; implementation
> ~6 hours.

### T-14.4 — Pre-renewal reminder

Append to §16.2:

> **Pre-renewal reminders** for annual subscribers: Stripe
> Subscription Reminder emails enabled at 7-day and 1-day before
> renewal. Required in California; defensible everywhere; reduces
> chargebacks.

## Streak counter

**Iter 14: 0 structural + 4 tactical. Streak = 4/5.**
