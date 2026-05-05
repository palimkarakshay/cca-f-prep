# Final consolidated business plan — v2

> **Status.** Survived 5 consecutive structural-clean hostile review
> passes (iters 11–15) after 10 substantive review/mitigation
> iterations and 1 streak reset. Iteration ledger:
> `plans/iterations/ledger.md`. **This document is the canonical
> answer to "what is the current plan?"** — superseding the
> venture-shape decks now archived in `plans/archive-2026-05-04/`.
>
> **Date.** 2026-05-05.
>
> **What this is not.** Not a pitch document. Not investor-ready.
> Not a marketing artefact. It is the operator's own working
> agreement with the project, with explicit kill triggers.

---

## 0. One-paragraph summary

A B2C cert-prep micro-SaaS for adults studying for one technical
certification (default: Anthropic CCA-Developer if launched by
2026-08-01, else Microsoft Azure AI-103). Three-SKU pricing ($29
one-time, $19/mo, $149/yr). Differentiation: calibration-Δ +
spaced-review + retake-mode (cognitive-science wedge against
Anki + free YouTube). SEO-only distribution; no paid acquisition;
no B2B; no SOC2; no enterprise. Operator runs at 12 hr/wk for
6–10 months to launch. Y1 net to operator: -$36k to -$30k after
implicit labour cost; Y1 is a learning project, not income. Y2
median outcome: $5–15k cash + Y2-optionality on a 36× MRR exit.
External reviewer holds kill triggers; founder-fit-proof gate at
Day 90 (pass chosen cert); employment-agreement compatibility gate
at Day 14. Anthropic Claude Marketplace, regulated-vertical pivots,
and venture-shape framing are all rejected.

---

## 1. Decision history (read this if you're confused)

The project began (pre-2026-05-04) as a venture-shape AI-LMS
plan: 7+ segments, $25M ARR claim, 18-day Phase 1, 95% gross
margin, mid-market enterprise. **The negative study (2026-05-04)
identified 14 structurally fatal problems.** Fifteen subsequent
hostile-review iterations identified 59 additional issues across
finance, distribution, legal, technical, operational,
behavioural, and regulatory dimensions. The plan that survives is
substantively different from where it started.

For provenance: every claim below is anchored to an iteration
finding. See `plans/iterations/iter-NN-{critique,mitigations}.md`
for the reasoning. See `plans/business-viability-mitigation-plan.md`
for the long-form canonical doc with all sections.

---

## 2. Product

### 2.1 What it is

A web app for one technical certification at a time. Default
catalog selection logic (iter-08 N54, recorded in `decisions.md`
D-004):

1. **Anthropic CCA-Developer** if it launches by 2026-08-01.
   Operator has the only credible "I built this *while* studying"
   story. Demand small but competition zero.
2. **Microsoft Azure AI-103** otherwise. Anti-first-mover
   positioning: "we came late but better — calibration-Δ, real
   spaced repetition, retake mode."

CCA-F (the operator's own current study target) is a **free
secondary catalog**, used as SEO top-of-funnel. CCA-F is *not*
the paid catalog (12–18 month peak window too narrow per
iter-01 N5).

### 2.2 Surface (5 routes)

- `/` — lander + one sample lesson per catalog.
- `/study/[slug]` — lesson + quiz with calibration-Δ tracker.
- `/dashboard` — calibration-Δ trend at v1.
- `/retake` — failed-exam recovery flow (v1.1).
- `/account` — Stripe customer portal.

**v1 launch:** dashboard ships calibration-Δ only. **v1.1
(Month 4–5 post-launch):** adds spaced-review controls, retake
mode UI, and subscription pause (iter-14 T-14.3).

### 2.3 The cognitive-science wedge

Without calibration-Δ + (eventually) spaced-review + retake mode,
the §16 plan cannot defend $19/mo against Anki + free YouTube
(iter-02 N21). These three features are the differentiation; the
launch ships calibration-Δ; the rest follow.

---

## 3. Pricing & packaging

Three SKUs, no free tier (iter-02 N12-N14, N20):

| SKU | Price | Gates |
|---|---|---|
| Single-exam pack (default) | $29 one-time | Lifetime access to that exam's catalog |
| All-access subscription (after ≥3 packs) | $19/mo | All current and future packs |
| All-access annual | $149/yr | Same as monthly; ~35% savings |

- **Public sample.** One sample lesson per pack on the marketing
  site, with quiz preview. Marketing surface, not free tier.
- **Refund policy.** 30-day money-back, no questions asked.
  Visible at Stripe checkout AND on email receipt (iter-05 N40).
- **Pre-renewal reminders** for annual subscribers at 7-day and
  1-day (iter-14 T-14.4).
- **Friend-and-family policy.** Friends pay list price with same
  refund policy. No comp accounts (iter-14 T-14.1).

---

## 4. Distribution

### 4.1 Channels

**SEO-only in Year 1** (iter-01 N2, iter-03 N23):

- **Lessons:** 12 SEO-optimised lesson pages at launch (cut from
  30 in iter-06 N43); topical authority deferred to Y2.
- **Supporting articles:** 6 long-form pieces at launch (cut from
  25 in iter-06 N43).
- **Backlinks:** 4 guest posts/yr + 2 linkable assets/yr;
  realistic Y1 RD count 30–60 (iter-03 N24).
- **YouTube:** lesson companion videos for embedding only; no
  standalone channel-building Y1 (iter-03 N25).
- **Reddit / HN / dev.to:** announcements only, not channels;
  one post per quarter per relevant subreddit max (iter-01 N2).

**No paid acquisition, ever, at this price.** At blended LTV
$90 the only sustainable CAC is <$30, which no paid channel
achieves in cert-prep B2C (iter-02 N18).

### 4.2 Realistic timeline

- **First paid user from organic:** Month 9–14 at earliest, more
  likely Month 12–18 (iter-03 N23 reset).
- **MRR ≥ $200** not before Month 9.
- **MRR ≥ $500** not before Month 12.
- **MRR ≥ $2,000** not before Month 18.

### 4.3 Geo-fencing

Non-US, non-Canada traffic geo-fenced at signup (iter-04 N31 +
iter-07 N49). Reduces tax + EU-AI-Act + multi-jurisdiction privacy
exposure to ~50 US states + 13 Canadian provinces. Reconsider EU
unblock at $5k MRR.

---

## 5. Legal & compliance

### 5.1 Entity + insurance

- **Wyoming or Delaware LLC**, single-member, formed by Day 30
  (iter-04 N32). $300 setup + $50/yr registered agent.
- **Insurance bundle** (general liability $50/mo + cyber $50/mo +
  E&O $100/mo = $200/mo). Buy at first paying user, not before
  launch (iter-04 N32 + iter-09 T-09.1).

### 5.2 NDA / exam-content discipline (iter-04 N29)

- All practice questions derived from publicly published Microsoft
  Learn Skills Measured documentation (or Anthropic CCA equivalent).
- Question authoring **completes before** the operator takes the
  exam. No post-exam updates.
- Validator pipeline records `derived_from_public_doc_url` per
  question; missing field rejects the question.
- No marketing language: "exam dump," "real questions," "100%
  pass rate," "guaranteed pass."
- Allowed language: "objective-aligned practice questions,"
  "covers Skills Measured," "spaced-repetition of cognitive
  concepts."

### 5.3 Trademark / branding (iter-04 N30, N35)

- Domain is brand-first (e.g., `calibrant.io`); never includes
  "ai103," "azure," "microsoft," etc.
- Marketing copy uses nominative fair use only.
- No reproduction of Microsoft / AWS / GCP cert badges.
- Founder identity brand-first; operator's personal name not on
  public marketing site; day-job stays separate (no LinkedIn
  cross-link).
- Domain registrar = Porkbun or Cloudflare Registrar; transfer-
  locked, 2FA on, masked contact info (iter-12 T-12.4).

### 5.4 EU AI Act (iter-04 N31)

- Transparency banner on every lesson and quiz: *"Generated with
  AI-assisted authoring + validator suite. Spot an error? Email
  support@; we refund unconditionally on verified errors."*
- Public model card at `/model-card`.
- Provenance ledger in DB (`generated_by_model`, `generated_at`,
  `validator_pass_log`).
- Calibration-Δ + retake framed as **study aid**, not assessment.
- **Geo-fence EU users entirely** until conformity assessment is
  feasible (not Y1/Y2).

### 5.5 Privacy (iter-04 N34, iter-07 N51)

- Privacy policy template covers GDPR + UK GDPR + CCPA/CPRA +
  VCDPA + CPA + CTDPA + UCPA + TDPSA + residual US state laws.
  Annual attorney review (~$500/yr).
- Public DSAR endpoint at `/privacy/dsar`.
- DPAs from Stripe, Clerk, Anthropic, Vercel/Render/Cloudflare,
  Neon, PostHog stored in `legal/dpa/`.
- Cookie banner (Cookiebot free / Klaro) for residual non-EU.
- Data-breach playbook at `runbooks/data-breach.md`.

### 5.6 Tax / VAT (iter-07 N49)

- Stripe Tax day 1 (~$10/mo Y1 scale).
- Operator's home-state SaaS-tax registration before first sale.
- Quarterly nexus review in §17b.
- Y2 escape valve: fractional bookkeeper / tax accountant
  ($300–800/mo) at MRR > $5k.

### 5.7 Accessibility (iter-07 N50)

- WCAG-conformant component library (Radix UI / shadcn/ui).
- axe-core in CI on every PR.
- One-time pre-launch audit ($0–500 or $1k–3k).
- Public accessibility statement at `/accessibility`.
- Quarterly axe-core regression.

### 5.8 Open-source license (iter-04 N33)

- Validator suite ships under Apache 2.0.
- `TRAINING_DATA.md` describes operator's-own-notes lineage; no
  scraped third-party content.
- `THIRD_PARTY_NOTICES.md` lists deps.
- "Library does not include exam content; validates user-submitted
  MCQ format only" disclaimer.

---

## 6. Technical architecture

### 6.1 Hosting

Ranked by operator-time-cost (iter-08 N55):

1. **Render Professional ($19/mo)** — Postgres bundled, lowest ops
   complexity. **Default.**
2. **Vercel Pro ($20–80/mo realistic)** — best DX, accept cost
   variance from Sept-2025 pricing restructure.
3. **Cloudflare Pages + Workers (free)** — cheapest cash, highest
   learning curve.

### 6.2 Stack

- **Auth:** Clerk free tier; abstraction at `lib/auth.ts` so
  Auth0/Supabase migration is bounded (iter-05 N41 +
  `runbooks/clerk-migration.md`).
- **Payments:** Stripe with Stripe Tax; Paddle / Lemon Squeezy
  pre-registered as backup (`runbooks/stripe-account-review.md`).
- **DB:** Neon (Render-bundled or standalone); weekly `pg_dump` to
  R2 (`runbooks/db-restore.md`).
- **Storage:** Cloudflare R2 (~$5/mo).
- **AI:** Anthropic API direct, **pinned exact model versions**
  (`claude-sonnet-4-6-20251015`, `claude-haiku-4-5-20251001`).
  Validator regression suite at `tests/validators/`
  (`runbooks/model-deprecation.md`).
- **Observability:** Sentry free + BetterStack uptime ($25/mo).
- **Email:** Resend / SES; transactional only.
- **Cost circuit-breaker:** per-tenant + global daily AI spend cap;
  alert on >2× rolling 7-day avg (iter-05 N42).

### 6.3 Pre-launch security (iter-12 §16.17)

- 2FA on every account (Clerk, Stripe, Anthropic, GitHub,
  registrar, hosting, Neon, email, brand socials).
- `pnpm audit` in CI; weekly Dependabot review; pinned lockfile.
- Quarterly secret rotation (ANTHROPIC, STRIPE, CLERK keys).

### 6.4 CI/CD (iter-05 N39)

- GitHub Actions free tier: lint + typecheck + unit-test on every PR.
- Validator regression test on PRs touching `validators/` or
  `prompts/`.
- DB migration apply+revert on PRs touching `db/migrations/`.

---

## 7. Operator commitments

### 7.1 Time

- **Hard cap: 12 hr/wk** on the side bet (iter-06 N44).
- AI-103 / CCA-Developer study + side bet share the 12 hr/wk for
  the first 90 days; after that, only side bet.
- CCA-F study stays separate (operator's primary goal).
- One review-free week per quarter, owned by spouse / reviewer.

### 7.2 Day-job compatibility (iter-10 N59)

By 2026-05-19:
- Read employment agreement (moonlighting, IP, non-compete).
- File required disclosures.
- All side-bet work on personal hardware in personal hours.
- IP registered to operator personally.
- If incompatible: stop and follow §17.2 of negative study
  (consulting day rates with disclosure).

### 7.3 Founder-fit proof (iter-06 N45)

By **2026-11-05** (6 months from today):
- Pass CCA-F at 800/1000+ (not just 720). The methods sold must
  produce >720 for the founder first.
- Pass AI-103 (or CCA-Developer) within 90 days of project start.
- Document operator's own calibration-Δ trajectory; publish as a
  blog post.

If CCA-F not at 800+ by 2026-11-05: **stop the project**.

### 7.4 Opportunity cost (iter-01 N11)

By 2026-05-12, operator records in `decisions.md` D-002:
- Y1 forgone side-consulting income: $20–35k.
- Y1 expected project profit: $3–17k (before labour).
- Y1 net after labour: -$36k to -$30k.
- Y2 best-case net: +$55k.
- Operator's signed answer to "is the Y2 optionality worth $25k of
  PV bet?"

If "no": stop and take consulting income directly.

---

## 8. Financial snapshot

### 8.1 Y1 P&L (iter-08 N56)

| Metric | Year 1 | Year 2 |
|---|---|---|
| Paying users (post-churn) | 30–150 | 150–600 |
| MRR (M1–M9 / M10–12) | $0–500 / $500–2,000 | $2,000–8,000 |
| Operator hours / wk | 12 | 12 |
| Cost basis | $374–552/mo (API path) | $400–800/mo |
| Y1 revenue total | $2,000–8,000 | $24,000–96,000 |
| Y1 cost total | $4,000–6,600 | $4,800–9,600 |
| Y1 net before labour | -$4,600 to +$1,400 | $14,400–86,400 |
| Implicit operator labour | $31,200 | $31,200 |
| **Y1 net after labour** | **-$36,000 to -$30,000** | **-$17,000 to +$55,000** |

### 8.2 Cost-basis line items

| Line | Y1 monthly |
|---|---|
| Hosting (Render $19 default) | $19 (or $0 Cloudflare / $20–80 Vercel Pro) |
| Anthropic API direct | $30–80 |
| Stripe transaction fees (~3%) | $5–15 |
| Stripe Tax | $10 |
| Cloudflare R2 backup | $5 |
| Cloudflare DNS | $1 |
| BetterStack uptime | $25 |
| Personal-account email | $6 |
| LLC + registered agent amortised | $0–25 |
| Compliance / chargeback overhead | $50 |
| Insurance bundle (~$50 Y1 effective; full $200 Y2+) | $50 |
| Privacy / attorney amortised | $42 |

Y1 subtotal: **$374–552 (API path)** / **$544–672 (if Max 20x).**

---

## 9. Kill signals + reviewer system

### 9.1 Kill table (§17 + iter-03 N27 + iter-15 T-15.3)

| Trigger | Action |
|---|---|
| Day 14: employment-agreement incompatible | Stop. Migrate to consulting. |
| Day 30: LLC not formed | Stop. The plan needs entity-shield. |
| Day 90: cert not attempted | Pass within 30 days OR reposition catalog as "study-along" until passed |
| Month 6 (B2C): no first paying user (MRR < $19) OR organic SE volume <200/mo for the chosen exam | Stop. Migrate to negative study §17.2. |
| Month 6: AI-103 (or chosen) search volume <200/mo | Pivot catalog to backup within 30 days OR stop. |
| 2026-11-05: CCA-F not at 800+ | Stop. |
| Month 9: MRR < $200 | Stop or radically simplify. |
| Month 12: MRR < $500 OR organic search < 500/mo | Stop. Migrate to §17.2. |
| Month 18: MRR < $2,000 | Stop. Migrate to §17.2. |
| Catalog retirement announced | Within 30 days, decide on next catalog OR plan wind-down. |
| AI cost > 30% of MRR for 2 consecutive months | Raise prices or stop. |
| Operator hours > 30/wk for 2 consecutive months | Stop. The side-bet shape failed. |
| Spouse / family / therapist asks if it's still healthy | Treat as P0. |

### 9.2 Externalised reviewer (§17b)

By 2026-05-31, operator names one reviewer (spouse / advisor /
fractional CFO / friend) who:
- Owns the calendar invites for Month-3, 6, 9, 12 review calls.
- Asks the §17 questions out loud at each call.
- Holds the kill-trigger doc and reads aloud at each call.
- Logs trigger responses to `decisions.md` (signed + dated).
- Has emergency contact info per the
  `runbooks/operator-unavailable.md` runbook.

**Pre-commitment device** (iter-13 T-13.1): operator pre-commits
$500 to a charity-of-anti-choice (StickK-style); released if
operator fails to act on a kill-trigger within 14 days of
trigger firing.

### 9.3 Live dashboard (§17b iter-14 T-14.2)

Custom 30–50 line public-read page reading Stripe webhook into
`daily_metrics` Postgres table. Y1: built in-house. Y2 if
MRR > $5k: switch to Baremetrics ($50/mo).

Tracks daily:
- Total signups (vanity).
- 30-day-retained paying users (real).
- Trailing-30-day churned paying users (lagging health).
- AI-cost-as-%-of-MRR.

### 9.4 Weekly motivation log (iter-13 T-13.2)

Every Sunday in `decisions.md`: 1–10 score for "would I do this
again knowing what I now know?" Three consecutive <5 = mandatory
stop-review.

### 9.5 Quarterly checklist (iter-10/12)

- §17 trigger review.
- Link-rot scan on `derived_from_public_doc_url`.
- Content-freshness audit (Skills Measured outline diff).
- Stripe chargeback ratio review.
- Insurance policy renewal status.
- Tax nexus status.
- axe-core regression.
- `pnpm audit` resolver review.
- Secret rotation.
- DPA verification.

---

## 10. Exit / wind-down (iter-08 N57)

Three pre-defined paths.

- **Acquihire ($1–10k MRR; 12–36× MRR multiple = $100–300k).**
  Buyer audit needs Stripe revenue export, customer list,
  churn data, validator OSS, DPAs. Operator already has these
  from §17b cadence.
- **Passive conversion.** Reduce content cadence to quarterly;
  operator hours drop to 2–4 hr/wk; revenue plateau. Acceptable
  if success-definition (1) met and operator wants out.
- **Wind-down.** 90-day notice; 6-month static catalog access;
  pro-rata refunds for annual subscribers; CC BY-NC-SA the
  catalog; 305-redirect domain.
- **Lifetime-deal Y2 cash injection** (iter-11 T-11.2): AppSumo
  / Lemon Squeezy listing at $39–79 with capped redemptions;
  one-time $30–60k; useful as runway-extension if MRR is on
  track but cash-flow timing matters.

---

## 11. What success means (`decisions.md`)

All three must be true:

1. **Financial.** Y2 MRR ≥ $5k AND Y2 net to operator ≥ $5k after
   costs and self-employment tax.
2. **Learning.** By Y2 the operator can (a) pass CCA-F at >800,
   (b) explain cog-sci-applied-to-spaced-learning to a non-expert
   in 30 minutes, (c) ship one open-source contribution.
3. **Life.** Spouse / family unaffected. Operator hours <12/wk.
   Day-job performance unaffected.

If any are at risk and not recoverable in 90 days: stop per §17.

---

## 12. What the plan does NOT promise

- $25M ARR.
- $100k MRR by Month 24.
- 95% gross margin.
- 110%/120% NRR.
- 3 signed B2B LOIs in Year 1.
- Mid-market enterprise deals.
- SOC2 Type 2 in Year 1.
- Category-king outcome.
- Venture funding.
- A team.
- Outcome equivalence with Maven, altMBA, Duolingo, Cornerstone.
- Outcome equivalence with the Maven 96% / altMBA 96% / Duolingo
  +21% effect-size citations (those have been struck from all
  documents).
- Anthropic acquisition at any specific multiple.

What it does promise: **a sustainable side-bet learning project
with optionality on a small profitable Y2 exit, run within
12 hr/wk and an externalised reviewer system, with clear stop
signals at every checkpoint.**

---

## 13. Required next actions (Day 0–30)

1. Read this document end-to-end (~30 minutes).
2. By 2026-05-12: D-002 opportunity-cost answer in
   `decisions.md`.
3. By 2026-05-19: D-006 employment-agreement compatibility.
4. By 2026-05-31: D-003 reviewer named.
5. Pre-commit $500 StickK device (iter-13 T-13.1).
6. Catalog selection D-004 (CCA-Developer launched? else AI-103).
7. Hosting D-005 (Render default; Cloudflare or Vercel only with
   reason).
8. Form LLC by Day 30.
9. Begin AI-103 / CCA-Developer study within 12 hr/wk cap.
10. Begin first 12 SEO lesson pages (per §16.3 motion).

If items 1–10 take more than two weekends, the operator is
already too busy for even the trimmed plan. That itself is a
signal.

---

## Appendix: iteration provenance

Every claim in this document is anchored to one or more iteration
findings. The full reasoning chain:

| Section | Anchored in |
|---|---|
| 2.1 Catalog logic | iter-08 N54, iter-03 N22, iter-02 N16 |
| 2.3 Cog-sci wedge | iter-02 N21, iter-06 N43 cuts |
| 3 Pricing | iter-02 N12, N13, N14, N20 |
| 4.1 SEO-only | iter-01 N2, iter-02 N18, iter-03 N23 |
| 4.3 Geo-fence | iter-04 N31, iter-07 N49 |
| 5.1 LLC + insurance | iter-04 N32, iter-09 T-09.1 |
| 5.2 NDA discipline | iter-04 N29 |
| 5.4 EU AI Act | iter-04 N31 |
| 5.6 Tax | iter-07 N49 |
| 5.7 Accessibility | iter-07 N50 |
| 6.1 Hosting | iter-05 N36, iter-08 N55 |
| 6.4 CI/CD | iter-05 N39 |
| 7.1 Time | iter-06 N44 |
| 7.2 Day-job | iter-10 N59 |
| 7.3 Founder fit | iter-06 N45 |
| 8 Financial | iter-08 N56, iter-15 T-15.1, T-15.2 |
| 9.1 Kill table | iter-03 N27, iter-15 T-15.3 |
| 9.2 Reviewer | iter-01 N7, iter-13 T-13.1 |
| 10 Exit | iter-08 N57, iter-11 T-11.2 |
| 11 Success | iter-06 N47 |

Full reasoning chains in `plans/iterations/iter-NN-{critique,
mitigations}.md`. Original 14 problems in
`plans/business-viability-negative-study.md`. Long-form canonical
plan in `plans/business-viability-mitigation-plan.md`.
