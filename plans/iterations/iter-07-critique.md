# Iteration 07 — Hostile Review (Tax / VAT / Accessibility / International)

> **Date.** 2026-05-05
> **Stance.** Attacks the **regulatory frictions** the §16 plan
> currently glosses over — sales tax in 38 US states, EU VAT OSS,
> WCAG 2.2 / ADA exposure, US state-level data privacy beyond
> California (Colorado, Connecticut, Virginia, Texas, etc.).
> **Output.** N49+.

---

## N49 — Sales tax / VAT compliance is unbudgeted; Stripe Tax doesn't solve nexus determination.

**US state-level reality (May 2026):** ~38 states tax SaaS / digital
products. Each has its own:
- Economic-nexus threshold (typically $100k-$500k annual revenue OR
  200 transactions).
- Tax rate.
- Filing cadence (monthly / quarterly / annually).
- Registration requirement before first taxable sale.

**For a solo founder in the §16 shape:**
- At Y1 MRR $500–2k, the operator **likely doesn't trip economic
  nexus thresholds in any state** ($6k-$24k annual). Safe in Y1.
- At Y2 MRR $2k-8k → $24k-$96k annual, *some* states may be tripped
  (e.g., Pennsylvania has a $100k AND 200 transactions threshold;
  if the §16 plan has 200+ paying users, Pennsylvania is tripped at
  $24k).
- **Home state always applies** — the operator's resident state has
  nexus from the first sale. If the operator is in a SaaS-taxing
  state (e.g., Washington, Texas, Connecticut), filing starts at $1.

**EU VAT (most consequential):**
- **Single sale** to an EU consumer triggers immediate VAT
  registration obligation OR €10k cross-border threshold rule.
- Below €10k cross-border: charge home-country VAT (operator is
  US-based → no VAT).
- Above €10k: **register for OSS in one EU member state**, charge
  customer-country VAT, file quarterly OSS returns in EUR.
- **The §16 plan geo-fences EU users (per §16.11)** → this risk
  is mostly closed, **provided the geo-fence is reliable.** Any
  EU customer who slips through (VPN, EU-resident-but-US-mailing
  address, etc.) creates a compliance gap.

**Stripe Tax** ($/transaction or 0.5% of charges with a $0.50 floor):
- Calculates correct tax per transaction.
- **Doesn't tell you where you have nexus.**
- Requires the operator to register manually in each state once
  nexus is tripped.
- Cost at Y1 scale: ~$5–15/mo in fees.

**Recommended edit.** Add to §16.11:

> ### Tax / VAT compliance
>
> 1. **Geo-fence non-US, non-Canada traffic** at signup (extends
>    iter-04 EU geo-fence to all jurisdictions until tax compliance
>    capacity exists). Reduces exposure to ~50 US states + 13
>    Canadian provinces.
> 2. **Stripe Tax enabled from day 1.** ~$5–15/mo at Y1 scale.
> 3. **Operator's home-state registration done before first sale**
>    if the home state taxes SaaS. Cost: $0–$300 depending on state.
> 4. **Quarterly nexus review** in the §17b reviewer call: confirm
>    no state has tripped its threshold. Tools: TaxJar Insights,
>    Numeral, Anrok ($0–500/mo depending on tier; defer to Y2 unless
>    Y1 MRR > $2k).
> 5. **Y2 escape valve:** if MRR > $5k, hire a fractional
>    bookkeeper / tax accountant ($300–800/mo) to take this
>    surface off the operator entirely.

This adds **~$10/mo Y1 ($120/yr) and $300–800/mo Y2** to the
cost basis. Apply.

---

## N50 — WCAG 2.2 / ADA compliance is mandatory; current plan has zero accessibility work.

**ADA Title II (state/local govt only)** has an April 24, 2026
compliance deadline for WCAG 2.1 AA — *technically not applicable*
to private-B2C SaaS.

**ADA Title III** (private business "places of public accommodation")
is the relevant tier for the §16 plan. Title III interpretation
treats websites and apps used by the public as places of
accommodation when they tightly integrate with physical commerce —
contested for pure-online SaaS, but **2024 had 4,000+ ADA-related
website lawsuits**, with EdTech / educational platforms being a
heavily-targeted vertical.

**Risk profile for the §16 plan:**
- Cert-prep B2C SaaS sold to consumers in the US is precisely the
  ADA-Title-III plaintiff target shape.
- Plaintiff lawyers in this space file 10–50 lawsuits/week against
  websites that fail simple automated WCAG scans.
- Settlement range: $5k-$25k for solo-LLC defendants.
- The §16 plan has zero accessibility work budgeted.

**WCAG 2.1 AA conformance for a small SaaS:**
- Color contrast (4.5:1 for text).
- Keyboard navigation (all interactive elements reachable).
- Alt text on images.
- Form labels.
- Focus indicators.
- ARIA labels on custom components.
- Heading hierarchy.
- Skip-to-content link.

Most of this is achievable by:
- Using a WCAG-conformant component library (Radix UI, shadcn/ui
  meet most criteria out of the box).
- One-time audit ($1k-$3k for an external auditor at small-business
  rates, OR a free automated scan + ~10 hours of operator
  remediation).
- Per-quarter regression scan ($0 with axe-core in CI).

**Recommended edit.** Add to §16.11:

> ### Accessibility (added 2026-05-05, iter-07 N50)
>
> 1. **Use WCAG-conformant component library** at build time
>    (Radix UI, shadcn/ui). Saves ~80% of remediation work.
> 2. **axe-core in CI** scanning every PR; fail PRs that
>    introduce accessibility regressions. Free.
> 3. **One-time audit before launch** by external auditor or via
>    free automated scan + 10–15 operator hours of remediation.
>    Budget: $0–500 (free tools route) or $1k–3k (auditor route).
> 4. **Public accessibility statement** at `/accessibility`
>    listing conformance level and known limitations. Industry
>    norm; reduces lawsuit risk.
> 5. **Year 1 budget:** ~$0–500 + 10–15 hours. Year 2 budget:
>    re-audit at $1k–3k.

Add ~10–15 hours to the launch-blocking checklist (already trimmed
in iter-06).

---

## N51 — US state privacy laws beyond California — Colorado, Connecticut, Virginia, Texas — are unmodeled.

The §16.11 covered GDPR/CCPA. **Beyond California, six other US
states have comprehensive privacy laws as of 2026:**
- Virginia VCDPA (effective 2023).
- Colorado CPA (effective 2023).
- Connecticut CTDPA (effective 2023).
- Utah UCPA (effective 2023).
- Texas TDPSA (effective July 2024).
- Iowa, Indiana, Tennessee, Florida, Oregon, New Jersey, etc. — all
  with effective dates in 2024–2025.

**Each has its own threshold and obligations:**
- Most thresholds are 100k+ residents' data OR ≥50% revenue from
  selling data — the §16 plan probably doesn't trip any in Y1.
- **However, all require a privacy notice that meets each state's
  specific disclosure requirements.** A single "compliant in
  California" privacy policy isn't compliant in Virginia or Texas.
- Some require the operator to support DSARs (data subject access
  requests) regardless of threshold.

**Mitigation cost:**
- A privacy policy that covers all 11+ state laws + GDPR + UK GDPR:
  $500–1,000 for an attorney-reviewed template (one-time).
- DSAR endpoint handles all states uniformly (already in §16.11).
- Quarterly review: ~30 min to spot-check new state law changes.

**Recommended edit.** Append to §16.11:

> Privacy policy template covers: GDPR, UK GDPR, CCPA/CPRA,
> Virginia VCDPA, Colorado CPA, Connecticut CTDPA, Utah UCPA,
> Texas TDPSA, plus a residual "all other US state laws" section.
> Reviewed annually by attorney.

This is largely already in the §16.11 budget — the $500/yr
attorney review covers it. Just specify scope.

---

## N52 — The plan has no plan for what happens when the operator gets sick / takes vacation.

Solo founder + one paying customer = the operator is a single point
of failure for support. **What happens when:**
- The operator is hospitalized for a week?
- Family emergency takes the operator off-grid for 10 days?
- The operator takes a 2-week vacation (which they should)?

**Concrete failure modes:**
- Stripe webhook fails silently for 5 days; chargebacks accumulate.
- Sentry/BetterStack alerts pile up unread.
- Anthropic 60-day deprecation notice arrives during vacation;
  operator misses 50% of the response window.
- Customer emails accumulate in support@; one customer's "I want
  a refund" sits for 10 days, escalates to Stripe chargeback.

**The §16 plan has no continuity playbook.**

**Recommended edit.** Add a runbook
`plans/runbooks/operator-unavailable.md`:

```
# Runbook: Operator unavailable (vacation, illness, emergency)

## Pre-emptive setup (do once before first paying customer)
1. Auto-responder on support@ during planned absences:
   "We respond within 48 hours. During current operator absence
   ending {date}, expect a 5-day delay. Refunds processed
   automatically within 3 days regardless of operator status."
2. Stripe auto-refund flag: enabled for refund requests via API
   webhook so customer-initiated refund-in-app works without
   operator action.
3. BetterStack alerts pause-on-vacation toggle.
4. Reviewer (per §17b) is briefed and has emergency contact
   info; they can pause new signups via feature flag if a
   critical incident occurs.

## Trigger on actual absence
1. Set out-of-office on support@.
2. Email reviewer: "I'm out from {date} to {date}. Critical
   alerts go to ___."
3. Cost circuit-breaker (§16.13) configured to a tighter limit
   for the duration ($5/day cap instead of $10/day default) —
   prevents a runaway bug from running while operator is away.

## Recovery
1. Triage support@ in chronological order.
2. Honor any chargebacks that fired during absence; document.
3. Update §17b log with absence + impact.
```

This makes the operator's life sustainable. Add ~4 hours to the
launch-blocking list.

---

## N53 — The "review-free week per quarter" rule (iter-06 N44) needs implementation.

§11.8 added "one review-free week per quarter" as a policy. **Without
implementation, it doesn't happen.** The operator and reviewer need:
- Pre-scheduled vacation weeks in shared calendar.
- "I'm taking my review-free week starting X" trigger.
- An auto-pause on alerts for that week.

**Recommended edit.** Append to §11.8:

> Implementation:
> 1. Pre-schedule one calendar week per quarter as "review-free."
>    Mark in spouse's / reviewer's calendar.
> 2. Use the operator-unavailable runbook (iter-07 N52) for the
>    week.
> 3. The §17b reviewer call before the review-free week confirms
>    the operator is on track to take it.
> 4. Skipping a review-free week without a documented reason
>    (in `decisions.md`) counts as a stop signal.

---

## Iteration 07 verdict

**New structural findings:** N49 (tax / VAT compliance), N50 (WCAG /
ADA compliance), N52 (no continuity playbook).

**3 new structural findings.**

**Tactical findings:** N51 (privacy beyond CCPA), N53 (review-free
week implementation).

**Streak counter: still 0/5.**

The streak doesn't move yet. After iter-07 the canonical plan should
be substantially complete on the regulatory + operational surface.
Iter-08 should attack what's left, then iters 9–10 should be clean
streak-validation passes.
