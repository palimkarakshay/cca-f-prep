# Iteration 11 — Streak-validation pass (after N59 reset)

> **Date.** 2026-05-05
> **Reviewer profile.** A senior product manager who's launched two
> failed cert-prep apps before; pessimistic, wants to find what kills
> the plan.

## Re-attack of post-iter-10 plan

Walked through the canonical plan (16 sections + 16 sub-sections),
8 runbooks, decisions.md, and the negative study to verify nothing
new is fatal.

### Considered angles
- **Pricing-elasticity:** $19/mo or $149/yr could be too low or too
  high depending on segment. Already addressed by Tutorials Dojo /
  Skill Builder anchoring (iter-02).
- **Free-trial vs no-free-trial:** the §16.2 explicit "no free tier"
  could lose conversions vs Brainscape's free tier. Already
  considered in iter-02 N20.
- **Refund-policy tuning:** "30-day money-back" matches Stripe norms
  and N17 chargeback mitigation.
- **Onboarding flow:** not specified in the plan but is implicit in
  the §16.1 5-route surface. Tactical, not structural.
- **App-store / SaaS-marketplace alternative distribution:** not
  considered. AppSumo, lifetime deals on Lemon Squeezy — these are
  *single-shot revenue events*, not subscription-friendly. Worth
  noting as a *marketing* tactic, but not a structural shift.
- **Localization:** product is English-only. EU geo-fence covers EU
  buyers; non-English markets are out of scope. Acceptable.

### Findings

**Structural: 0.**

**Tactical:**
- **T-11.1.** §16.1 surface mentions `/dashboard` but the §16.2
  features list (calibration-Δ at launch; spaced review + retake
  at v1.1) implies the dashboard ships with calibration-Δ only.
  Should be explicit: launch dashboard shows calibration-Δ; v1.1
  adds spaced-review and retake controls.
- **T-11.2.** AppSumo / Lemon Squeezy lifetime-deal listing is a
  potentially viable Y2 cash-injection motion (typical lifetime
  deal: $39–79 for 6× lifetime-LTV with capped redemptions).
  Worth a one-sentence mention in §16.16 (exit/wind-down) as a
  Y2 option.

## Verdict

**0 structural, 2 tactical. Streak: 1/5.**
