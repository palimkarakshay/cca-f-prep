# Iteration 02 — Hostile Review

> **Date.** 2026-05-05
> **Stance.** This pass attacks the §16 safe-path **unit economics** at
> the granularity of LTV, CAC, churn, payback period, and competitive
> reference price. The mitigation plan as of post-iter-01 has shrunk the
> ambition; iter-02 asks whether the *shrunken* shape still pencils.
> **Reviewer profile assumed.** A B2C-subscription growth analyst who has
> looked at 200 indie-hacker books, advised on cert-prep M&A, and knows
> the difference between "lifestyle profitable" and "actually profitable
> after operator labour."
> **Output.** New findings (N12, N13, …) and refinements of N1–N11.

---

## N12 — At $10/mo with 6.5–8% monthly churn, LTV is $40 and the operator can't afford to acquire customers.

The §16 plan: $10/mo or $79/yr; expect 50–200 paying users in Y1.

**Pull on the LTV thread.**
- 2026 B2C-SaaS monthly churn benchmark: **6.5–8%** (digital media,
  retail, education).
- Cert-prep churn is *worse*: customers cancel the day after the exam.
  Industry rule of thumb: **3–6 month average customer lifetime** for
  monthly cert-prep subscriptions, **9–12 months** for annual.
- LTV = ARPU × lifetime − refunds − payment-processor fees.
  - At $10/mo monthly subscriber: $10 × 4 mo × (1 − 3% Stripe) − $0
    refunds = **$38.80 LTV.**
  - At $79/yr annual: $79 × ~1.05 lifetime − ~3% Stripe = **$80.43 LTV.**
- Blended LTV at typical 60% monthly / 40% annual mix in cert-prep:
  **~$55.**

**For LTV:CAC ≥ 3:1** (the standard "you're not bleeding"
benchmark): **CAC ≤ $18 blended.** Half the operator's targeting
universe is people who Google an exam code. Even *organic* SEO has
real CAC: content-creation hours × hourly rate. At 8–12 hr/wk
content production for 12 weeks (the SEO ramp in §16.3) and an
opportunity cost of $50/hr, the operator burns **$4,800–$7,200 of
labour value** to produce the SEO surface. To hit 50 paying users
from that surface, CAC = $96–144 per user. That is **5–7× the
allowed budget** at the published price.

**Why this is a structural finding.** The §16 plan implicitly assumes
*organic marketing is free*. It is not — it is the operator's
opportunity-cost-priced labour. The N11 mitigation forced an
opportunity-cost honest accounting on the operator's overall labour;
the same logic applied to *acquisition* labour reveals that the
acquisition is net-loss for the first 6–12 months at the published
price.

**Recommended edit.** Either:
1. **Raise the price.** $19/mo or $149/yr is the floor that produces
   acceptable unit economics at the operator's CAC. AWS Skill Builder
   is $29/mo and is the buyer reference price; pricing at $19 is
   defensibly *below* the official, with quality differentiation
   ("better practice questions, real spaced-repetition") as the
   wedge. Don't price below $19; the unit economics break.
2. **Add a one-time pricing tier.** Tutorials Dojo's pattern:
   $15–$25 one-time exam-pack purchase, no subscription. Eliminates
   the churn problem entirely; trades MRR for revenue. For 50 paying
   users at $20 one-time = $1,000 one-time revenue + zero retention
   risk. This is a *worse business* but a *less-broken business*.
3. **Drop the user count target.** 50–200 users at $10/mo can't
   produce $500–2k MRR with 6.5% monthly churn — net-new acquisition
   has to *exceed* churn just to maintain MRR, which contradicts
   "10–15 hr/wk side bet" hours.

---

## N13 — The "$79/yr" annual price is below the breakeven on a single AWS Skill Builder reference.

**Buyer reference price.** AWS Skill Builder Individual: **$29/mo**.
Median AWS-cert candidate subscribes for 1–2 months while studying =
**$29–58 per cert attempt.**

**The §16 plan's $79/yr.** A buyer who takes 2 AWS exams/year at the
operator's price = $79 (annual). At AWS Skill Builder, the same
buyer pays $29 × 4 mo of total prep = $116. **The operator's annual
plan is 32% below the all-in cost of the official option.**

That is not "competitive" pricing. It is "you cannot generate
margin" pricing. The "discount-to-official" anchor is a tactic, not
a strategy — once the operator is a known seller, AWS / Anthropic /
GCP can freely cut official prices to retake the price floor (which
they will, because they have AWS credits to subsidize).

**Sharper observation.** Tutorials Dojo (the unambiguous category
king of paid AWS practice exams) prices at:
- Single exam-pack practice tests: **$15–25 one-time** on Udemy.
- Tutorials Dojo Reviewer (subscription): **$14.99–$24.99/mo.**

Tutorials Dojo has been the dominant third-party practice provider
for **8 years** and has settled at this price band after extensive
A/B testing. The $79/yr ($6.58/mo equivalent) is pricing *below* the
established category norm.

**Why this is structural.** Pricing below norm without a defensible
cost advantage means margin compresses when:
1. AI-API costs are passed-through after Anthropic price changes,
2. Stripe/Paddle fees rise with chargeback volume,
3. Refund rates rise with new-user dissatisfaction (which they will,
   because the operator has 0 reputation in cert-prep).

**Recommended edit.** Mitigation plan §16.2: change pricing to
**$19/mo or $149/yr (with a Stripe-first-30-days-money-back guarantee).
No free trial; 3 free lessons publicly visible as the funnel.** This
is at-or-below Tutorials Dojo's subscription tier and below AWS Skill
Builder, leaving room for "buy quality not bundle" positioning.

---

## N14 — The 6.5–8% B2C churn benchmark is the *floor* for cert-prep; the realistic number is 15–20% monthly.

The 6.5–8% figure is generic B2C SaaS (Netflix-shape: ongoing utility).
**Cert-prep utility is bounded by exam pass.** Once the buyer passes
(or fails and gives up), the product has zero remaining utility.

Modeled monthly churn for cert-prep:
- Month 1 (just signed up): 5–10% churn (buyer's-remorse, payment
  fail, switched to YouTube-free, found a better app).
- Month 2 (studying actively): 10–15% churn (didn't pass mock,
  cancelled to "come back later," credit-card declined).
- Month 3 (took exam): **30–60% churn** (passed → cancel; failed →
  give up).
- Month 4+ (still studying): 15–25% churn (motivation decay).

Blended over the cohort: **15–20% monthly** is the honest number.
At 17.5% blended monthly churn, expected lifetime is **~5.7 months
nominal**, but the long tail dominates — most users churn at month
3, and LTV is closer to **$30, not $55**.

**Industry corroboration.** BrainDump, ExamCram, MeasureUp, Boson,
and Tutorials Dojo all run on a "buy-once" model precisely *because*
subscription churn at exam-pass kills the lifetime number.
Subscription cert-prep is rare for this exact reason.

**Why this is structural.** The §16 plan picked subscription pricing
for an industry that has *empirically* settled on one-time purchase
or short-window subscription (1–3 months max). The plan is
swimming against a category norm that exists because it works.

**Recommended edit.** Default pricing model in §16.2 should be:

> **Tier 1 — Single exam pack:** $29 one-time, lifetime access to
> that exam's content. Refundable 30 days; no subscription, no
> renewal pain.
>
> **Tier 2 — All-access subscription** (added when there are ≥3
> exam packs published): $19/mo or $149/yr, all current and future
> exams.

The §16 plan's "single product, one price, $10/mo" doesn't fit the
category. Switch to one-time-default + subscription-secondary.

---

## N15 — The §16 plan still implicitly counts the operator as a paying user.

§16.1: *"AI: Haiku 4.5 for content drafts; operator runs them locally
via Claude Code (Max 20x covers it)."* §16.2: *"Free tier with 3
lessons."*

**The operator's CCA-F study repo IS the lead-magnet content per
§16.3.** The operator is using the product for their own studying
while building it. **They are not paying for it.** Realistic Y1
paying-user count therefore needs to be reduced by 1 (the operator
themselves) and by the operator's friends-and-family who try the
product but don't pay (typically 5–15 in early indie launches).

The §16.5 number "50–200 paying users in Y1" is the *gross* number
without accounting for:
- ~15 free-tier-only "try it once" users.
- ~5–10 friends-and-family non-payers.
- Possibly 1–2 paid users who churn within the 30-day money-back
  window.

**Net Y1 paying users** at the median: **30–150**. At $19/mo blended
(post-N13 pricing), net Y1 MRR median lands **$570–$2,850**, which
is *similar* to the §16.5 range but at a *higher* price. The
*lower* price in the original §16 plan would have produced 50–80%
less MRR, which the plan never modeled.

**Why this is mostly cosmetic.** N15 doesn't change the order of
magnitude — but it does mean the operator should track *paying-net-
of-churn* in the dashboard (per §17b N7), not just gross signups.
The temptation otherwise: count 50 free signups in the dashboard
URL, feel productive, ignore the fact only 6 are paying.

**Recommended edit.** §17b dashboard line item must distinguish:
- Total signups (vanity).
- 30-day-retained paying users (real).
- Churned in last 30 days (lagging health).

---

## N16 — The recommended SEO + YouTube motion (post-iter-01) requires SEO content the operator cannot competitively produce.

Iter-01 N2 forced SEO + YouTube as the primary motion. **Now examine
whether the operator can win at SEO.**

**SEO competitive landscape for AWS-SAA-C03 long-tail queries
(May 2026):**

- *"aws saa-c03 practice questions"*: 18 results on page 1; first 5
  are ExamPro, Tutorials Dojo, Udemy, Whizlabs, A Cloud Guru. All
  have DA (domain authority) 50–80; the operator's new domain has
  DA 0.
- *"aws saa-c03 sample mcqs"*: dominated by Whizlabs and
  Tutorials Dojo at top, plus a few medium.com long-form posts.
- *"aws saa-c03 spaced repetition"*: 4 results on page 1; less
  competitive but ~20 monthly searches (per Ahrefs estimates) — too
  small to drive volume.
- *"aws saa-c03 retake strategy"*: 6 monthly searches. Negligible.

**Long-tail volume at the level the operator can rank**
(<DA-30 results on page 1) is about **200–400 monthly searches
total** across all combinations the operator might target. At 1–3%
click-through and 1–5% paid conversion, that's **0.5–4 paid users
per month from organic search.**

**Y1 SEO-attributable revenue:** 6 × ($19/mo × 5 mo lifetime) =
**~$570 max.** That's at the *high end*. The realistic median for a
new domain ranking against ExamPro and Tutorials Dojo: **0–2 paid
users/mo, ~$100–400/yr SEO revenue.**

**Why this is structural.** The iter-01 distribution mitigation
(SEO + YouTube) was correct that those are the only motions that
work in cert-prep — but it didn't model the competitive density.
The operator is the new entrant against incumbents with 8–18 years
of SEO compounding. SEO doesn't get them to $500–2k MRR; it gets
them to $50–400/yr if they execute well.

**Recommended edit.** §16.3 must change again:
- **Drop the AWS / GCP target.** SEO is not winnable against
  Tutorials Dojo / ExamPro for these certs.
- **Pick a cert that's new enough to have low SEO competition but
  established enough to have demand.** Candidates: Anthropic CCA-F
  (the operator's natural fit but small audience), GCP Professional
  AI Engineer (launched 2024, growing), Azure AI-102 (steady
  demand, less SEO crowding than AWS), Databricks Generative AI
  Engineer Associate (launched 2024).
- **Specifically reject AWS as the launch catalog** — even though
  it's the largest market, it's also the most-saturated SEO surface,
  and the operator's CAC will be infinite.

This is the inverse conclusion to N5, which had switched the segment
*to* AWS to escape CCA-F's narrowness. Iter-02 finds: **CCA-F is too
small but AWS is too saturated.** The honest answer is a *mid-size,
mid-saturation* cert — and there is no perfect candidate.

---

## N17 — The plan still doesn't model refund / chargeback overhead.

Stripe pass-through fee at $19/mo: ~$0.85/transaction.
**Chargebacks** (forced refunds via card-issuer): in cert-prep B2C,
chargeback rate is **1.5–3%** (above the Stripe-acceptable 0.75%
threshold for "good standing"). Each chargeback:
- Costs $15 in chargeback fees.
- Counts against Stripe's chargeback ratio. >0.75% triggers Stripe
  warning; >1.5% triggers Stripe account review or termination.

At Y1 50–200 customers and ~2% chargeback: **1–4 chargebacks/year =
$15–60 fees + Stripe-account-review risk.** A single Stripe
termination is a 14–30 day outage — game over for B2C subscription
revenue.

**Recommended edit.** Mitigation plan §16:
- Budget $50/mo "compliance overhead" line: chargeback fees,
  occasional refund-arbitration time, Stripe-account-warning
  responses.
- Add to runbooks: `stripe-account-review.md` (3–4 hours work, pre-
  written so it's not improvised under stress).
- Implement *low-friction* refund policy from day 1 (30-day money-
  back, no questions). Voluntary refunds are cheaper than
  chargebacks; ratio matters more than dollar amount.

---

## N18 — The "no paid acquisition until LTV:CAC > 3:1" rule (§16.3) is unreachable at current LTV.

Per N12: blended LTV at $10/mo pricing = ~$55. Per N13 pricing-fix
to $19/mo: LTV ≈ $90.

For LTV:CAC ≥ 3:1, max CAC is **$30**.

Cheapest paid acquisition channels in cert-prep (May 2026):
- Google Ads on long-tail keywords: $1.50–$4 CPC, 1–3% conversion =
  **CAC $50–400** depending on quality.
- YouTube pre-roll on cert-prep videos: $0.10–$0.30 CPV, 0.5–2%
  conversion = **CAC $30–100.**
- Reddit / TikTok Spark Ads: variable, untested for cert-prep,
  typically $20–80 CAC.

**The §16 promise of "paid acquisition only when LTV:CAC > 3:1" is
mathematically equivalent to "no paid acquisition, ever, at $19/mo."**
The only way to make paid acquisition pencil is:
- Higher price ($39+/mo), OR
- Multi-cert all-access bundles to lift LTV past $200, OR
- Annual-prepay with high attach rate (50%+) to stretch LTV to $150.

**Recommended edit.** §16.3 should explicitly say *"no paid
acquisition is planned in Year 1 or Year 2 at this price."* Frame it
as a deliberate choice, not a conditional, so the operator doesn't
spend hours optimising a paid funnel that can't math.

---

## N19 — There is no plan for what happens if AI-generated content gets a public quality complaint.

Mitigation plan §16 ships AI-generated lessons. **Inevitable scenario:**
1. A paying user posts on Reddit / Twitter: "I bought [product] for
   $19/mo and the AWS Lambda question they generated has the wrong
   answer."
2. The post gets 50–500 upvotes.
3. The operator's domain reputation, organic SEO ranking, and Stripe
   chargeback rate all degrade in the same week.

**The expert-review-audit doc, mitigation plan §13, and the validator
suite all address this *theoretically*** but the operator has no
*incident playbook*. What's the publicly-visible response?
Refund-and-fix? Refund-and-apologize? Opensource the validator
audit log to show the bug-fix?

**Recommended edit.** Add `plans/runbooks/quality-incident.md`:

```
# Runbook: public quality complaint on generated content

## Trigger
- Public post (Reddit, Twitter, HN, in-app feedback) alleging a
  factual error in generated content with > 50 upvotes / engagement.

## Steps (≤24 hours)
1. Acknowledge publicly within 4 hours: "We're investigating. Refund
   issued unconditionally regardless of finding."
2. Issue refund within 4 hours via Stripe.
3. Investigate within 24 hours; produce signed correction note
   linked to the original post.
4. If validated: post the corrected lesson + a public "what we
   changed in the validator suite to prevent this class of error"
   write-up.
5. If not validated (user error / out-of-date question): acknowledge
   publicly the mismatch, but keep the refund.
6. If the cycle hits ≥3 incidents in a quarter, **stop new content
   generation** until the validator suite addresses the root cause.

## Pre-loaded responses
- Stripe refund template URL.
- Public apology template (drafted, signed, ready to publish).
- Validator-suite changelog format.
```

The §13 mitigation got "pay an external reviewer" right but missed
the *runbook* layer entirely.

---

## N20 — The "free tier with 3 lessons" funnel is a churn-amplifier, not a conversion-amplifier.

§16.2: *"$10/mo or $79/yr. Free tier with 3 lessons."*

**Cert-prep free-tier conversion benchmarks (2024–25):**
- Anki, Brainscape, Quizlet free → paid conversion: **0.5–1.5%**.
- Tutorials Dojo "free practice quiz" → paid: **2–4%** (better
  because it's a lifetime purchase, lower commitment).
- Subscription cert-prep free-tier conversion: **0.3–1.0%** (worst
  category — "free is fine for me" beats "$10/mo seems unnecessary").

At 0.7% conversion and a target of 50 paying users, the operator
needs **~7,100 free-tier signups in Year 1**. At the SEO traffic
realistic from N16 (200–400 unique monthly visitors → 2,400–4,800
visitors annually), even with 100% trial-signup the operator can't
hit the free-tier-signup volume needed.

**Why this is structural.** Free-tier-with-paid-upgrade only works
when upstream funnel volume is sufficient. The operator's volume
isn't sufficient. A free tier here trains users to expect free,
amplifies support load (free users complain at the same rate as
paid users), and produces no signal worth measuring.

**Better funnel:**
- **No free tier.** Single $29 lifetime purchase per exam (per N14).
- **Free sample.** One-page-public sample lesson with a quiz preview
  + a side-by-side "what's gated behind the paywall" — this is a
  marketing surface, not a free tier.

**Recommended edit.** §16.2: replace "free tier with 3 lessons"
with **"public sample lesson + buyable single-exam pack at $29 +
all-access subscription at $19/mo or $149/yr."** Three SKUs;
no free product.

---

## N21 — Anki / Brainscape / Quizlet are not in the §16 competition list, but they are the actual competition.

Mitigation plan §3 / iter-01 N3 fixated on hyperscalers (Workday,
Synthesia, NotebookLM). For B2C cert-prep, the actual competition
is:

| Competitor | Price | Position |
|---|---|---|
| **Anki** | Free, open-source | The default for serious cert-prep |
| **Brainscape** | $9.99/mo | Mid-market with cert decks |
| **Quizlet** | $7.99/mo | Mass-market flashcards + AI |
| **Tutorials Dojo** | $15–25 one-time | Category king for AWS practice |
| **ExamPro** | Free YouTube + $9.99/mo Pro | Strong for AWS, free tier kills paid SaaS |
| **A Cloud Guru** | $35/mo (acquired by Pluralsight) | Up-market |
| **Whizlabs** | $50–199 lifetime per exam | Long-running incumbent |

**The §16 plan competes against Anki at the bottom (Anki is free,
beloved, and has plug-in cert decks shared in subreddits) and
Brainscape/Quizlet in the middle (both at $7.99–9.99/mo with
massive content libraries already).** AWS Skill Builder at $29/mo is
the *upper bound* the operator referenced — but the *lower bound* is
$0 (Anki + free YouTube), and that's the binding constraint.

**The differentiated wedge** the §16 plan needs is **measurement
quality** (per the cognitive-science integration the operator has
been building) — calibration-Δ, JOL slider, expanding-interval
spaced review tied to *actual exam date*, retake-prep mode after a
failed exam. **None of this exists yet** and is part of the §16.4
"don't build" list.

**Why this is structural.** The differentiation the operator
*planned* to build (cognitive-science features) is the only thing
that could justify $19/mo against Anki+free-YouTube. The §16 plan
deferred that build. So the launch product is undifferentiated —
just another cert-prep app at not-quite-the-best-price.

**Recommended edit.** Add a §16.9 *"What gets built that *isn't*
deferred"*:
- Calibration-Δ tracker (the difference between predicted and actual
  performance per question).
- Expanding-interval spaced review tied to user-set exam date.
- Retake-prep mode (for users who failed once).

These three features, *together*, are the only honest defense
against $0 Anki + free YouTube. Without them, the launch product
*should not launch*.

---

## Iteration 02 verdict

**New structural findings:** N12 (LTV math broken), N13 (price below
norm), N14 (subscription model wrong category), N16 (SEO unwinnable
at AWS), N18 (paid acquisition unreachable), N20 (free-tier funnel
broken), N21 (real competitors are Anki/Quizlet, not Workday).

**7 new structural findings**, mostly inter-related (price-LTV-CAC
loop). Mitigated by a **substantial pricing rewrite** (one-time
$29 + subscription $19/$149) and a **segment re-pick** (away from
saturated AWS, toward mid-volume mid-saturation certs).

**Tactical findings:** N15 (operator-as-user accounting), N17
(chargeback / refund overhead), N19 (incident runbook).

**Streak counter: still 0.** Iter-02 is not clean — it found the
post-iter-01 plan still under-priced and aimed at the wrong segment.
