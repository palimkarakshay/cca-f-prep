# Iteration 14 — Streak-validation pass (4/5 target)

> **Date.** 2026-05-05
> **Reviewer profile.** A founder/operator who shipped a profitable
> $30k MRR cert-prep micro-SaaS and writes about indie operations.
> Looking for "the thing the plan thinks is solved but isn't."

## Re-attack

Re-read the canonical post-iter-13 plan. Looked at execution-velocity
and operator-attention failure modes specifically.

### Considered angles
- **Operator's first paying customer is a friend.** The §16 plan
  doesn't say what to do when a friend signs up — refund? Real
  payment? Document either way. Already implicit (no exception
  for friends-and-family) but worth a one-line policy.
- **What MRR-tracking tool?** §17b says "Stripe webhook → public-
  read Notion / Sheets / a custom 50-line page" but this is
  abstract. Specific recommendation would help operator commit.
- **First negative review on Trustpilot / G2.** Not modeled.
- **Operator's response time to support@ inbox.** Not specified.
  "Within 48 hours" is a reasonable SLA; should be in the
  accessibility / support disclosure.
- **Subscription-pause feature.** B2C subscription churn is largely
  payment-decline-induced; a "pause my subscription for 1–3
  months" feature retains the customer through life events.
  Industry standard but not in the §16 plan.
- **Annual-renewal warning.** §16.2 has annual at $149/yr. Stripe
  default is to renew silently; some jurisdictions require a
  pre-renewal notice (CA at 30 days; EU at "reasonable"). Already
  implicit in "send 7-day-before-renewal reminders" in
  stripe-account-review.md but should be in §16 too.

### Findings

**Structural: 0.** None of these are fatal; the §16 shape works
without them.

**Tactical:**
- **T-14.1.** Friend-and-family policy: friends pay at list price
  with same refund policy. No comp accounts; comps create
  expectation drift and tax weirdness. Document in §16.2.
- **T-14.2.** Specific MRR dashboard recommendation: Plausible
  Self-hosted with a 30-line custom Stripe-webhook ingestion, OR
  Baremetrics ($50/mo) for plug-and-play. Default at Y1: custom
  page (cheapest, most control); Y2 if MRR > $5k: Baremetrics.
- **T-14.3.** Subscription-pause feature: implement at v1.1
  (already deferred). Reduces involuntary churn ~15% per
  industry data.
- **T-14.4.** Pre-renewal reminder for annual subscribers: Stripe
  Subscription Reminders enabled (7-day, 1-day) by default.

## Verdict

**0 structural, 4 tactical. Streak: 4/5.**
