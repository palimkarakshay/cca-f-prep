# Iteration 02 — Mitigations

> **Companion to.** `iter-02-critique.md`
> **Stance.** Pricing, packaging, and segment are now the binding
> constraints. The mitigation here changes §16's product shape from
> "$10/mo subscription" to "$29 one-time + optional $19/mo all-access
> + $149/yr." Segment moves away from both CCA-F (too small) and
> AWS-SAA (too SEO-saturated) toward mid-saturation certs.

---

## Triage — iteration 02

| # | Finding | Triage | Closes in |
|---|---|---|---|
| N12 | LTV $40 can't sustain CAC | Structural (raise price) | this iter |
| N13 | $79/yr below category floor | Structural (price up) | this iter |
| N14 | Subscription wrong for cert-prep | Structural (one-time default) | this iter |
| N15 | Operator-as-user inflates count | Tactical (dashboard distinction) | this iter |
| N16 | AWS SEO unwinnable | Structural (segment re-pick) | this iter |
| N17 | Chargeback overhead unbudgeted | Tactical (runbook + line item) | this iter |
| N18 | Paid acquisition unreachable | Tactical (declare openly) | this iter |
| N19 | No quality-incident runbook | Tactical (write runbook) | this iter |
| N20 | Free tier broken funnel | Structural (drop free tier) | this iter |
| N21 | Real competition is Anki/Quizlet | Structural (re-add cog-sci wedge) | this iter |

---

## N12 / N13 / N14 / N20 / N21 — pricing + packaging consolidation

The five findings collapse into one fix. Replace §16.2 with:

> ### 16.2 What you sell (revised 2026-05-05, iteration 02)
>
> Three SKUs, no free tier:
>
> | SKU | Price | What it gates |
> |---|---|---|
> | **Single-exam pack** (default) | **$29 one-time** | Lifetime access to that exam's catalog |
> | **All-access subscription** (after ≥3 packs published) | **$19/mo** | All current and future exam packs |
> | **All-access annual** | **$149/yr** | Same as monthly; ~35% savings |
>
> **No free tier.** Public sample is *one* sample lesson per exam pack,
> readable on the marketing site, with a quiz preview but the full
> question bank gated. That is a marketing surface, not a free tier.
>
> **Refund policy.** 30-day money-back, no questions asked. (Builds
> trust, lowers chargeback rate, signals confidence.)
>
> **The cognitive-science differentiation must ship in v1**, otherwise
> the product cannot defend $19/mo against Anki + free YouTube. Three
> features are non-negotiable for launch (re-instated from §16.4
> defer list):
>
> 1. **Calibration-Δ tracker.** After each quiz, show predicted vs
>    actual score; over time, plot the calibration curve.
> 2. **Expanding-interval spaced review tied to user-set exam date.**
>    The default reviews schedule keys off the user's exam date so
>    review pressure scales accordingly.
> 3. **Retake mode.** A separate flow for users who failed an exam
>    once — focuses on weakest topics from their first attempt.
>
> Everything else in §16.4 stays deferred.

The original §16 said "single product, one price" because the
mitigation plan was reacting against the venture-shape's tier
sprawl. Three SKUs is *not* tier sprawl — it's matching the
category's empirical pricing model (one-time-default + optional
subscription). The pricing-format-correction outweighs the
"simplicity" cost.

**Apply to canonical mitigation plan §16.2.**

## N16 — Segment re-pick

The post-iter-01 plan defaulted segment to AWS SAA-C03. **Iter-02
shows AWS is too SEO-saturated for a new domain.** The honest
re-pick:

| Cert | Demand (monthly searches) | SEO competition (DA<30 page-1 results) | Operator fit |
|---|---|---|---|
| AWS SAA-C03 | ~30k | ~0 (saturated) | High demand, unwinnable SEO |
| GCP ACE | ~3k | ~3 (mid) | Moderate fit |
| GCP Pro AI Engineer | ~800 | ~6 (low-saturation) | Operator's interest area |
| Azure AI-102 | ~2k | ~4 (low-saturation) | Steady demand |
| Databricks GenAI | ~500 | ~8 (low-saturation) | New, growing |
| Anthropic CCA-F | ~50 | ~12 (low-saturation, low demand) | Operator's prep |

**Recommended pick:** **Azure AI-102** as default catalog. Reasons:
- Demand high enough (2k/mo searches) to fund the project at modest
  conversion.
- SEO low-enough-saturation to be winnable in 12 months for a new
  domain.
- Microsoft Learn (the official) is comprehensive but bland and
  free; *no* dominant third-party at the operator's tier exists, so
  the wedge "better practice questions, real spaced repetition,
  calibration-Δ" stays open.
- Operator's AI/Anthropic background transfers — Azure AI-102 is
  about Azure OpenAI, Cognitive Services, and AI agents.

**If the operator doesn't want Azure** (it requires non-Anthropic
cloud experience): default to **GCP Pro AI Engineer** as second
choice. CCA-F stays as a *secondary, free-content* catalog used to
feed top-of-funnel SEO and the operator's own learning.

**Apply to canonical mitigation plan §11.2 / §16.3 / §16.5 — replace
"AWS SAA-C03 / GCP ACE" defaults with the table above and the
Azure AI-102 pick.**

## N15 — Dashboard hygiene

Update §17b dashboard to track three numbers separately:

- Total signups (vanity, do not optimise on this).
- 30-day-retained paying users (the real number).
- Trailing-30-day churned paying users (lagging health).

Apply by editing §17b accordingly.

## N17 — Chargeback + Stripe runbook

**Add `plans/runbooks/stripe-account-review.md`:**

```
# Runbook: Stripe account review or chargeback-ratio warning

## Trigger
- Stripe email: "Your account is under review" or "Chargeback ratio
  exceeded threshold."
- Chargeback ratio crosses 0.75% (warning) or 1.5% (termination
  risk).

## Steps (≤ 4 hours)
1. Pause new sign-ups in the app: feature flag `signups_paused = true`.
2. Reply to Stripe email within 24 hours with: business model
   summary, refund policy, dispute-handling process, links to
   customer satisfaction evidence (Reddit, reviews).
3. For each open chargeback, file Stripe evidence with: signup
   timestamp, IP, email confirmation timestamp, lesson access logs,
   refund-policy disclosure on checkout.
4. Lower chargeback ratio: issue 30-day proactive refunds to any
   user with <2 sessions in the last 30 days (catch the dormant-
   subscriber chargebacks before they happen).
5. Update billing flow: enforce double-confirmation on annual plan
   ("you are about to be charged $149"); send 7-day-before-renewal
   reminders.

## Backup payment processor
- Pre-register a Paddle / Lemon Squeezy account before launch.
- If Stripe terminates, migrate active subscribers via Paddle's
  one-click migration tool. Estimated migration: 12–18 hours,
  including DNS / webhook reconfiguration.

## Pre-launch hardening
- 30-day money-back policy clearly visible on checkout AND in the
  emailed receipt.
- 3D Secure enforced on annual plans.
- Decline list for high-risk countries (configurable per Stripe
  recommendations).
```

Add a $50/mo line "compliance overhead" to §16.5 cost table.

## N18 — Declare paid acquisition off-limits

Edit §16.3:

> *No paid acquisition is planned in Year 1 or Year 2 at the
> projected price. At LTV ~$90, the only sustainable CAC is <$30,
> which no paid channel currently achieves in cert-prep B2C. This
> is a deliberate constraint, not a deferred decision; do not
> 'experiment with $200 of Google Ads' — it will produce zero
> signal at that budget.*

## N19 — Quality-incident runbook

**Add `plans/runbooks/quality-incident.md`** as drafted in iter-02
critique N19. Wire it into the §17b reviewer call: at each quarterly
audit, report incident count and resolutions.

## N21 — Cognitive-science differentiation re-introduced

The §16.4 deferred-features list was over-cut. Three features are
non-negotiable for launch (already integrated into N12/N13/N14
fix above): calibration-Δ, expanding-interval spaced review,
retake mode. Estimated incremental build: ~30–40 operator hours
on top of the basic web app.

Update §16.1 (surface) accordingly:

> **Surface:** five routes — `/` (lander + sample lesson),
> `/study/[slug]` (lesson + quiz with calibration-Δ),
> `/dashboard` (progress + spaced-review with exam-date target),
> `/retake` (failed-exam recovery flow), `/account`. The
> calibration-Δ + spaced-review + retake mode are the
> differentiation; without them launch is not viable.

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — §16.1 surface
   add `/retake`, §16.2 pricing rewrite, §16.3 SEO motion +
   segment re-pick (Azure AI-102 default), §16.5 cost-basis
   add chargeback/compliance line and segment-pricing
   reflective adjustment, §17b dashboard distinction.
2. `plans/runbooks/stripe-account-review.md` — created.
3. `plans/runbooks/quality-incident.md` — created.
4. `plans/iterations/ledger.md` — append iteration-02.

---

## Streak counter

**Iter 02: 7 new structural findings + 3 tactical. Streak = 0/5.**
