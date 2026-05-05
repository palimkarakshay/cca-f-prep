# Iteration 06 — Hostile Review (Operator psychology / decision quality)

> **Date.** 2026-05-05
> **Stance.** After 5 iterations the canonical plan has accreted ~30
> launch-blocking obligations: legal posture, validator regression
> suite, cost circuit-breaker, EU geo-fence, model migration runbook,
> insurance, LLC, certification commitment, dashboard. **The plan
> is no longer a "side bet"; it's a small full-time-shaped operation
> being run on side-bet hours.** This iteration attacks the cumulative
> operator-load and the decision-quality risks that come with it.
> **Reviewer profile.** A senior IC who has watched 12 friends try
> indie SaaS, 9 quit, 2 burn out hard, 1 succeed. They speak in numbers.
> **Output.** N43+.

---

## N43 — The cumulative launch-blocking checklist now exceeds 200 hours.

Tally after iter-01 through iter-05:

| Item | Source | Hours |
|---|---|---|
| 5 routes + auth + payment | iter-01 N1 (16 weeks part-time = 150h) | 150 |
| Calibration-Δ + spaced review + retake (cog-sci diff) | iter-02 N21 | 30–40 |
| 30 SEO lessons (12 weeks) | iter-01 N2 + iter-03 N23 | 200–240 |
| 25 supporting topical-authority articles | iter-03 N23 | 100–150 |
| 12 guest posts (1 per month over Y1) | iter-03 N24 | 24–36 |
| 8 linkable assets (2/quarter) | iter-03 N24 | 24–40 |
| Validator regression suite (50–100 pairs) | iter-05 N37 | 16–24 |
| Cost circuit-breaker | iter-05 N42 | 6 |
| Auth abstraction (Clerk migration prep) | iter-05 N41 | 4 |
| CI/CD setup | iter-05 N39 | 6–10 |
| LLC formation + insurance | iter-04 N32 | 4 |
| Privacy / DSAR / cookie banner | iter-04 N34 | 8 |
| EU geo-fence | iter-04 N31 | 4 |
| Stripe + Paddle backup setup | iter-02 N17 | 4 |
| 5 runbooks already created | iter-01 N10, iter-02, iter-04, iter-05 | already done |
| AI-103 study + exam attempt | iter-03 N26 | 30 |
| **Subtotal** | | **610–760 hours** |

**At 10–12 hr/wk, the launch-blocking checklist alone is
51–76 weeks** — i.e., 1.0–1.5 years before the operator could
plausibly start *measuring* whether the product works.

**Why this is structural.** The plan is no longer compatible with
the §11 operator-bandwidth constraint. Every iteration added
critical-path obligations without commensurate scope cuts. **The
cumulative result is that even the "safe" plan no longer fits in
the operator's available hours.**

**Recommended edit.** Add a §16.14 *"Cumulative-load reality check"*:

> The launch-blocking checklist after 5 iterations is 610–760 hours.
> At 10–12 hr/wk, this is 51–76 weeks (1.0–1.5 years) before MRR
> measurement is possible. Compared to the original promise of
> "8 weeks to launch," this is **6–9× longer**. Three responses:
>
> 1. **Cut the launch-blocking list aggressively.** The 30 SEO
>    lessons and 25 supporting articles can be cut to 12 lessons
>    and 6 articles, with topical authority deferred to Y2.
>    Saves 200+ hours.
> 2. **Reduce non-product hours.** The cog-sci differentiation
>    (calibration-Δ + spaced review + retake) can ship as
>    "calibration-Δ only" in v1. Saves 20 hours.
> 3. **Accept the timeline.** Plan for 12–18 month launch with
>    explicit calendar checkpoints; do not promise self or others
>    a 6-month launch.
>
> The honest answer is **all three**. After cuts, the
> launch-blocking checklist drops to ~400 hours = 33–40 weeks at
> 10–12 hr/wk = ~9 months. **Still not a 3-month project.**

---

## N44 — The operator's day-job + family + study + side-bet load is unsustainable past Month 6.

The CLAUDE.md states: *"Senior ABAP developer; …Tendency to change
goals mid-session."* The iter-01 N5 + iter-03 N26 commitments add:

- Day job: 40 hr/wk minimum.
- CCA-F study (the operator's own goal, primary): 5–10 hr/wk.
- Side bet (the AI-LMS): 10–15 hr/wk.
- **Plus** AI-103 study + exam (iter-03 N26): another 5 hr/wk for
  the first 3 months.
- Family / personal / sleep / health: the leftover.

**Total committed hours/week:** 60–75. That's the schedule of a
fast-tracking startup founder with no day job.

**The N7 / §17b reviewer cadence assumes the operator keeps
commitments.** When the schedule slips (and at 60–75 hr/wk it does
slip — the literature on side-projects is extremely consistent on
this), the operator misses reviewer calls, defers the cost-circuit-
breaker build, ships without the validator regression suite. Each
deferral compounds.

**Why this is structural.** The plan as-currently-written assumes
the operator is in a sustained sprint. **No operator has been on a
sustained sprint after Month 6** in the public side-project
literature. Burnout, family pressure, day-job demands, motivation
decay all kick in.

**Recommended edit.** Add to §11 / §16 / §17:

> **Sustainability gates (added 2026-05-05 iter-06 N44):**
>
> 1. **Hard maximum: 12 hr/wk on the side bet.** No "crunch
>    weekends." Crunch weekends compound and break the plan.
> 2. **AI-103 study and the side bet share the 12 hr/wk** for
>    the first 90 days. After that, only the side bet.
> 3. **CCA-F study stays separate** — it's the operator's
>    primary goal and is not subject to the 12 hr/wk cap.
> 4. **One review-free week per quarter.** Operator's spouse /
>    reviewer can veto the project for one week if it's eating
>    the relationship.
> 5. **Quarterly "do you still want to do this?" check.** Three
>    consecutive "no" answers triggers §17 stop.

These are guardrails, not soft suggestions.

---

## N45 — The operator's CCA-F study performance signal is being ignored.

The operator's diagnostic-01 score: **3/10** (per CLAUDE.md). The
project is a cert-prep tool for *another* certification. **Why
trust the operator to ship a great cert-prep tool when their own
study results suggest difficulty with the cognitive demands?**

This is not a personal attack. It's a signal:
- 3/10 cold suggests the operator has not yet internalised the
  cognitive-science features they plan to differentiate on
  (spaced repetition, calibration, retake review). The product
  needs to be *better* than what the operator currently uses for
  themselves — but the operator's results suggest current methods
  aren't producing exam-readiness.
- A founder who is themselves an above-90th-percentile user of
  spaced repetition will design a better app than a founder who
  is at the 30th percentile. The operator is currently the latter.

**Two interpretations:**
1. **Generous:** the operator is at the start of the learning
   curve; will improve with the discipline of building. Plausible.
2. **Less-generous:** the difficulty score is leading-indicator
   evidence that this product-market fit is misaligned with the
   founder's strengths.

**The plan never asks which interpretation is right.** That itself
is a planning failure.

**Recommended edit.** Add a §16.15 — *"Founder fit proof"*:

> **Founder fit proof.** Before launch, operator must demonstrate
> mastery of the methods the product teaches:
>
> 1. **Pass CCA-F at 800/1000+** (not just 720). The methods the
>    product sells must produce a >720 score for the founder
>    first.
> 2. **Pass AI-103 first attempt** (per iter-03 N26).
> 3. **Document the operator's own calibration-Δ trajectory** as
>    they study; publish as a blog post. This is the credibility
>    asset.
>
> If the operator can't pass CCA-F at 800+ within 6 months from
> today (i.e., by 2026-11-05), **stop the project**. The product
> requires founder cognitive-science mastery to be defensible;
> mastery is provable; if it can't be proved, the project shouldn't
> ship.

This is a real kill signal that operates on a faster timeline than
the §17 MRR signals.

---

## N46 — "Decisions.md" is referenced 4 times but doesn't exist.

The plan references `decisions.md`:
- §18.3 — "Open a `decisions.md` in the repo and record the chosen
  track in writing, dated and signed."
- §11.7 (iter-01 N11) — "operator must record the answer to that
  question in `decisions.md` with a date."
- §17b (iter-01 N7) — "trigger response is signed and dated to a
  `decisions.md` file."
- iter-05 N37 (model migration) — "document the swap in
  `decisions.md`."

**The file doesn't exist.** Without it, every reference is a
TODO that compounds into "we'll do that when the time comes." That
moment-of-need is a bad time to invent the format.

**Recommended edit.** Create `plans/decisions.md` now, with:
- Pre-filled template for each decision class (track choice,
  opportunity-cost answer, kill-trigger response, model swap).
- Date column, sign column ("operator" or reviewer name).
- First entry: "2026-05-05 — accepted §16 micro-SaaS shape after
  iter-01 mitigation review. Reviewer: TBD."

---

## N47 — The plan has no "what success looks like" written down.

§16.5 has revenue numbers ("Y1 MRR $500–2,000"). **It does not
define what "success" means in operator-experiential terms.**

**Why this matters.** Without a written-down "what success looks
like," the operator cannot recognize success when it happens, and
ends up rolling forward indefinitely past the right stopping
point.

Examples of what "success" could mean:
- "Y2 MRR ≥ $5k AND I'm happy 4 days a week."
- "I learned enough about cognitive-science applied to learning
  to publish 2 papers."
- "I built a public-good open-source library used by 5+ companies."
- "I made enough side income to cover a sabbatical."

**Recommended edit.** Add to `plans/decisions.md` a "Success
definition" section:

> ### What I commit to "success" meaning
>
> - **Definition 1 (financial):** Y2 MRR ≥ $X. Y2 net to me ≥ $Y.
> - **Definition 2 (learning):** By Y2 I understand cognitive
>   psychology applied to spaced learning well enough to (a) pass
>   CCA-F at >800; (b) explain it to a non-expert in 30 minutes;
>   (c) ship one open-source contribution.
> - **Definition 3 (life):** Spouse/family unaffected. No more
>   than 12 hr/wk on this. Day-job performance unaffected.
>
> All three must be true for success. If any of (1), (2), (3) are
> at risk and not recoverable in 90 days, project stops per §17.

This forces the operator to be honest *before* the data comes in.

---

## N48 — Iteration count itself is now becoming a procrastination surface.

This is a meta-finding about the *iteration-review process*. The
operator (or this AI) has spent 5 iterations and ~9,000 lines of
hostile review on a project that hasn't shipped a single feature
yet. **Iteration is *also* a way of avoiding the build.**

The honest framing: at some point the iterations should stop and
the operator should ship. The hostile review is high-leverage at
the start; the marginal value drops fast after iteration 5–7.

**Recommended edit.** Set a *built-in stop on iteration*:

> **Iteration cap.** No more than **8 hostile-review iterations**
> total. By iteration 8, either:
> 1. The plan has survived 5 consecutive clean passes (success),
>    OR
> 2. The plan is "good enough" and the operator ships, accepting
>    that residual risks exist, OR
> 3. The accumulated risks indicate the project is not viable;
>    stop per §17.
>
> Iterations beyond 8 are diminishing-return and should be deferred
> to scheduled annual review, not done in burst.

This caps procrastination via review. **Iter-06 is iteration #6;
iters 7–8 are the last full-shape passes; iters 9–10 are the
streak-validation passes.**

---

## Iteration 06 verdict

**New structural findings:** N43 (cumulative load 610–760 h), N44
(60–75 hr/wk life schedule unsustainable), N45 (founder fit proof
missing), N48 (iteration is itself procrastination).

**4 new structural findings.**

**Tactical findings:** N46 (decisions.md missing), N47 (success
definition missing).

**Streak counter: still 0/5.** 

This iteration sharpens the **operator-load** thread that has been
implicit in P10 / N11 but never quantified. The mitigation plan
must be *trimmed*, not just *added to*.

The mitigation in this iter is therefore unusual: it **subtracts**
launch-blocking items from prior iterations, rather than adding new
ones.
