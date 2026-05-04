# Expert-Review Audit Framework

> **Purpose.** Structured critical-review template for an external
> domain expert to audit [`research-and-strategy-dossier.md`](./research-and-strategy-dossier.md)
> against (a) the cited evidence, (b) what the platform has built today,
> and (c) what is planned in
> [`content-pack-management-plan.md`](./content-pack-management-plan.md).
> Reviewer fills assessment fields per claim; the operator uses the
> result to **strengthen, hedge, or abandon** claims before they reach
> investors, B2B buyers, or partners.
>
> **Stance.** Adversarial-collaborative. Reviewers are explicitly
> invited to dispute. Hedges, open questions, and falsification
> criteria are foregrounded — there is no penalty for an "abandon-
> claim" recommendation if the evidence is weak or non-generalising.
>
> **Output.** Per-row scoring + recommendation + signed summary at end
> (§G template). Operator commits to acting on the result within 30
> days.

---

## Table of contents

- [§0 — Purpose](#0--purpose)
- [§1 — Reviewer roles (3 distinct profiles + scope)](#1--reviewer-roles)
- [§2 — Methodology](#2--methodology)
- [§3 — How to score each row](#3--how-to-score-each-row)
- [§4 — Decision rights](#4--decision-rights)
- [§A — Psychology-specialist audit checklist](#a--psychology-specialist-audit-checklist) *(commit 8)*
- [§B — Learning-specialist audit checklist](#b--learning-specialist-audit-checklist) *(commit 8)*
- [§C — Business-partner audit checklist](#c--business-partner-audit-checklist) *(commit 9)*
- [§D — Hedges, open questions, falsification](#d--hedges-open-questions-falsification) *(commit 10)*
- [§E — What we'd abandon if disproven](#e--what-wed-abandon-if-disproven) *(commit 10)*
- [§F — Out-of-scope (don't waste reviewer time)](#f--out-of-scope) *(commit 10)*
- [§G — Review submission template](#g--review-submission-template) *(commit 10)*

---

## §0 — Purpose

The dossier collects 50+ cited claims across cognitive psychology,
behavioural economics, instructional design, industry case studies,
and commercial viability. Internal review by the operator alone is
insufficient — domain blind spots are systemic, and the cost of a
single buyer-facing claim that doesn't survive expert scrutiny is
high (lost trust, lost deal, post-hoc retraction).

This audit doc partitions the dossier into three review surfaces, one
per role, so each reviewer can complete their portion in ~2 hours
without needing to be expert in the others. The reviewer's output is
a per-claim score and a recommendation in {ship-as-is,
strengthen-claim, add-evidence, abandon-claim}. The operator commits
to acting on every "abandon" recommendation within 30 days (either
abandon, or produce additional evidence and re-submit for review).

**The audit is not a rubber-stamp.** The framework explicitly invites
strong disputes; §D foregrounds the hedges and open questions the
operator already acknowledges, so reviewers have a baseline of what
the operator considers settled vs uncertain.

---

## §1 — Reviewer roles

Three distinct reviewer profiles. Each role has a defined scope, time
commitment, output shape, and conflicts-of-interest (COI) disclosure
requirement. A complete audit cycle requires all three roles; partial
audits are documented as such.

### Role 1 — Psychology specialist

**Profile.** Cognitive-psychology PhD, post-doc researcher,
research-practitioner with publications in *Psychological Science*,
*Psychological Bulletin*, *Memory & Cognition*, or equivalent venues;
or a senior research lead at a peer-reviewed cognitive-science
research lab.

**Scope.**
- Dossier §2.1 (cognitive mechanisms of retention and absorption).
- Dossier §2.2 (behavioural mechanisms of return-visit and habit).
- Dossier §1.2 (knowledge-decay claims).
- Dossier §1.4 (engagement / return-visit claims).
- Dossier §4.1–§4.8 (learner-side L1–L8 problem-mitigation
  walkthrough).
- §A of this audit doc.

**Time commitment.** ~2 hours.

**Output shape.** Per-row score (1–5) + recommendation + notes on
each row in §A; summary signature in §G.

**COI disclosure.** Reviewer must disclose any commercial
relationship with cited researchers, ed-tech companies named in §3
of the dossier, or competing products. A consulting relationship
with a competitor (Section, Maven, Duolingo, Coursera) is
disqualifying for this role; academic citation of a cited author is
not.

### Role 2 — Learning / instructional-design specialist

**Profile.** Practising instructional designer with formal training
in 4C/ID, Cognitive Task Analysis, or Understanding by Design;
L&D leader with ≥ 5 years authoring corporate / clinical / vocational
content; instructional-design academic; or CTA-trained interviewer
in a high-stakes domain (clinical, defence, complex systems).

**Scope.**
- Dossier §1.3 (SME knowledge-sharing crisis).
- Dossier §2.3 (instructional-design mechanisms).
- Dossier §3.7 (SME-elicitation tools industry case study).
- Dossier §4.9–§4.16 (SME-side S1–S8 problem-mitigation walkthrough).
- §B of this audit doc.

**Time commitment.** ~2 hours.

**Output shape.** Per-row score + recommendation + notes in §B;
summary signature in §G.

**COI disclosure.** Reviewer must disclose any commercial
relationship with 360Learning, Articulate, Cornerstone, Docebo,
Synthesia, or similar SME-authoring vendors. CTA practitioners with
prior work for cited authors (Clark, Feldon, van Merriënboer) should
disclose but are not disqualified — that experience is the point.

### Role 3 — Business partner / GTM-diligence reviewer

**Profile.** Operator with go-to-market or LP-diligence experience
at an ed-tech, B2B SaaS, or LMS-vendor business; partner at a
venture firm with diligence-track-record on ed-tech investments; or
former CFO / COO of a comparable LMS-tier business (Cornerstone,
Docebo, 360Learning, Maven, Section, Coursera, Duolingo).

**Scope.**
- Dossier §3 (industry historical mitigation — case studies).
- Dossier §5 (commercial viability — TAM, comparables, pricing,
  unit economics, NRR, scalability, capital efficiency).
- §C of this audit doc.

**Time commitment.** ~2 hours.

**Output shape.** Per-question score + recommendation + notes in §C;
summary signature in §G.

**COI disclosure.** Reviewer must disclose any commercial / equity
relationship with named comparables (Duolingo, Coursera, Maven,
Section, Cornerstone, Docebo, 360Learning, Quizlet, Synthesia) or
with the data sources cited (SaaS Capital, a16z, Sequoia, Mordor,
KPI Depot, Training Industry Inc., ATD, Absorb, TalentCards). An
active board seat or paid-advisor relationship at a direct competitor
is disqualifying; a passive index investment is not.

---

## §2 — Methodology

**Step 1 — Read the dossier end-to-end (~45 min).** Do not skip.
Each section depends on prior context; assessing §4 without §1–§3
context produces incoherent audit output.

**Step 2 — Walk this audit doc top-to-bottom in your role's scope.**
Fill the assessment column on each row. Use the 5-point scoring
rubric in §3. Where a row spans multiple roles (rare), note the
scope boundary in your assessment.

**Step 3 — For each "abandon" recommendation, document one specific
falsifying study or industry counter-example.** A bare "I don't
believe this" is not actionable; the operator needs the citation
that disputes the dossier's claim.

**Step 4 — For each "strengthen" recommendation, document the
missing evidence type:**
- effect size from a single study insufficient → meta-analysis needed
- meta-analysis exists but population-narrow → replication in our
  population (adult professional learners) needed
- generalisability from cited population to our population is the
  weakness → real-world deployment data needed
- the cited mechanism's *implementation* in our planned feature is
  not faithful to the original protocol → describe the faithful
  implementation
- vendor / market figure is stale (>12 months old) → current data
  source needed

**Step 5 — Submit signed recommendation summary at end (§G).**
Operator commits to acting on every "abandon" within 30 days and to
producing the requested evidence on every "add-evidence" within 30
days (or demoting the claim if evidence cannot be found).

---

## §3 — How to score each row

5-point scale. Single integer, no half-scores.

| Score | Label | Meaning |
|---|---|---|
| **5** | Robust | Claim is well-supported by peer-reviewed evidence; effect size is real and replicated; generalises to adult professional learners in vocational / certification / compliance domains. Ship-as-is. |
| **4** | Sound with caveat | Claim is supported but a hedge or specific caveat is needed (population narrowness, effect-size variance, replication gap). Strengthen-claim before buyer-facing use. |
| **3** | Plausible but under-evidenced | Mechanism is theoretically sound and named in the literature, but the platform's implementation lacks empirical grounding *for our context*. Add-evidence — operator must produce within 30 days or demote. |
| **2** | Disputed | Domain has competing evidence the dossier doesn't acknowledge; or the cited effect is real but smaller / context-specific than the dossier implies. The dossier should explicitly acknowledge the dispute. Strengthen-claim with hedge. |
| **1** | Unsupported | Claim is not supported by the cited evidence, or the cited evidence does not say what the dossier claims it says. Abandon-claim — drop from dossier and downstream decks. |

**Operator commitment.** Any row scored 1 or 2 by ≥ 1 reviewer is
acted on within 30 days. Any row scored 3 by ≥ 2 reviewers triggers
an evidence-collection sprint. Rows scored 4 or 5 by all reviewers
are considered audit-cleared.

---

## §4 — Decision rights

Reviewers can issue four recommendations. Each is binding on the
operator within the 30-day commitment window:

**1. Ship-as-is.** Claim is robust enough for buyer-facing use in
decks, dossier, and direct customer conversations. No action required.

**2. Strengthen-claim.** Claim is supported but a hedge, qualifier,
or specific caveat is needed. Reviewer specifies the hedge language
in their notes; operator integrates within 30 days. Example: "Add
hedge: 'effect size is from K-12 population; replication in adult
learners is limited to single studies and the magnitude varies.'"

**3. Add-evidence.** Claim is plausible but under-evidenced for our
context. Reviewer specifies the evidence type needed (effect size /
meta-analysis / replication / real-world deployment). Operator
either (a) produces the evidence within 30 days, or (b) demotes the
claim to a hedged version, or (c) abandons. Example: "Add evidence:
real-world deployment data for spaced retrieval in adult professional
certification, not just K-12 vocabulary memorisation."

**4. Abandon-claim.** Claim is not supported by the cited evidence,
or domain consensus disputes it, or the implementation in our
platform is not faithful to the cited mechanism. Drop from dossier
and downstream decks within 30 days. Example: "Abandon: the cited
study does not support the platform's specific implementation of
worked-example fading because the platform applies fading at concept
level, not within-problem; the original CLT mechanism is
problem-internal."

**Audit-cleared status.** A claim is "audit-cleared" only after all
three reviewer roles have scored it 4+ and issued ship-as-is. The
operator publishes the audit-cleared subset to investors / buyers
with explicit citation that the dossier has passed expert review.

---

## §A — Psychology-specialist audit checklist

**Reviewer scope:** dossier §1.2 (knowledge-decay), §1.4 (engagement),
§2.1 (cognitive mechanisms), §2.2 (behavioural mechanisms), §4.1–§4.8
(L1–L8 problem-mitigation walkthrough). 18 mechanism rows below. Fill
**Score**, **Recommendation**, **Notes** for each. Standard 5-point
scoring rubric (§3); standard four recommendations (§4).

### A.1 — Cognitive mechanisms (dossier §2.1)

| # | Claim | Cited source | Built today | Planned (Phase) | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|---|
| A1 | **Spacing effect** — expanding-interval review (1/3/7/14/30d) lifts long-term retention ~2× vs massed practice; optimal gap ≈ 10–20% of retention horizon. | Cepeda et al. 2008 *Psych Sci*; Cepeda 2006 254-study meta | `09-progress-tracker/spaced-review.md` schema only — no scheduler, no surface. | LM1 — `SpacedReviewBanner.tsx` + `web/src/lib/spaced-review.ts` scheduler + cron-driven nightly enqueue; leech rule on 3+ misses (Phase 2). | | | |
| A2 | **Testing effect / retrieval practice** — single self-test produces ~50% lift on 1-week delayed recall vs re-reading. | Roediger & Karpicke 2006 *Psych Sci*; Karpicke & Blunt 2011 *Science* | Lesson-depth toggle (re-reading-shaped) — no retrieval gate. | LM2 — `RetrievalGate` primitive in `LessonView.tsx`; recall-write before reveal (Phase 2). | | | |
| A3 | **Generation effect** — self-generated answers retained ~30% better than read answers. | Slamecka & Graf 1978 *J Exp Psych: HLM* | Quiz reveal is recognition-only. | LM3 — principle-write field in `QuizRunner.tsx` before reveal (Phase 2). | | | |
| A4 | **Interleaving > blocked** — shuffled-practice 63% accuracy vs blocked 20% on 1-week delayed transfer test (3× lift). | Rohrer & Taylor 2007; Rohrer 2012 review | Methodology cites it; recommender does not enforce. | LM4 — `nextPick.subArea !== lastPick.subArea` constraint in `recommendation.ts` (Phase 2). | | | |
| A5 | **Desirable difficulties** — slowing acquisition (spacing, interleaving, generation, varied context) accelerates long-term retention and transfer. | Bjork 1994; Bjork & Bjork 2011 | Methodology cites; surfaces default to Easy (re-reading). | LM2 + LM3 + LM4 collectively; Easy depth-toggle becomes opt-out, not default (Phase 2). | | | |
| A6 | **Cognitive Load Theory + worked-example fading** — fully-worked examples for novices, faded for intermediates, solo for experts; mismatch produces extraneous load. | Sweller 1988; Sweller, van Merriënboer & Paas 2019 | Lesson depth toggle (Easy / Conceptual / Deeper) — fixed scaffolding, not adaptive. | LM5 — depth-toggle gains "solo" rung that disables hints once mastery ≥ 3 (Phase 2). | | | |
| A7 | **Expertise-reversal effect** — scaffolding that helps novices hurts intermediate-and-above learners. | Kalyuga 2003 *Edu Psych Rev* | Mastery rungs 0–4 in `progress-types.ts`. | LM5 — rung-3 cutover trigger for fading-to-solo (Phase 2). | | | |
| A8 | **Metacognitive calibration / JOL** — re-reading produces high judgment-of-learning + low actual recall (fluency illusion); pre-answer JOL capture closes the gap. | Dunlosky & Bjork (Handbook of Metamemory); Kruger & Dunning 1999 | `Gap` column in `09-progress-tracker/skills-matrix.md` (formalised as Calibration Δ on `main`). | LM6 — JOL slider in `QuizRunner.tsx` + Δ trend in `StatsPanel.tsx` (Phase 2). | | | |
| A9 | **Transfer (near vs far)** — far transfer requires varied contextualised practice with explicit principles; encoding-specificity dominates near transfer. | Barnett & Ceci 2002 *Psych Bull* | Diagnostic-01 is flat 10-Q; real exam is 4 scenarios × 15 Q. | LM4 — `MockExamPage.tsx` restructured to scenario-anchored shape with persisted scenario context (Phase 2). | | | |
| A10 | **Andragogy** — adult learners are self-directed, problem-centred, anchored to prior experience; need rationale-first. | Knowles 1973 *The Adult Learner* | Methodology cites; no rationale-first lesson structure enforced. | Cross-cuts SM1–SM5 (rationale exposed at every required SME field). | | | |
| A11 | **Dual-coding** — verbal + visual encoding outperforms either alone, but only when non-redundant (Mayer redundancy principle). | Paivio 1971/1986; Mayer multimedia learning principles | Lessons are text-heavy; visual content optional. | Phase 2 — image / diagram fields in lesson schema; critic checks for non-redundancy. | | | |

**Row-level question prompts (psychology specialist).** For each row,
note your answer in the **Notes** column:
- Is the cited effect size from a peer-reviewed meta-analysis, or a
  single study?
- Does the cited population (typically K-12 or undergraduate) generalise
  to adult professional learners in vocational / certification /
  compliance domains?
- Is our planned implementation faithful to the original mechanism, or
  only inspired-by? Specifically: A6 worked-example fading — is our
  implementation problem-internal (faithful to Sweller) or concept-
  external (a re-interpretation)?
- A1 spacing — is the 10–20% optimal-gap rule applicable at 30-day
  retention horizons, or does it break down for shorter horizons?
- A8 JOL — does pre-answer JOL capture actually train calibration, or
  does it merely measure it?

### A.2 — Behavioural mechanisms (dossier §2.2)

| # | Claim | Cited source | Built today | Planned (Phase) | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|---|
| A12 | **Hook Model** — trigger → action → variable reward → investment; trigger phase is the under-leveraged ed-tech surface. | Eyal 2014 *Hooked* | `computeStreak()` returns flags; no notification or trigger surface. | LM7 — web-push at modal study-time + email digest fallback; streak-freeze affordance (Phase 2). | | | |
| A13 | **Fogg B = MAP** — when behaviour fails, raise Ability before Motivation; add Prompt before changing user dispositions. | Fogg 2009 (Persuasive '09) | Recommendation engine prioritises drill → continue → done; no Prompt surface. | LM7 (prompt) + LM8 (cohort = Ability raise via cohort-format reduces friction); decision-trees.md §5 re-engagement tree (Phase 2). | | | |
| A14 | **Self-Determination Theory (SDT)** — autonomy + competence + relatedness drive intrinsic motivation; solo learning surfaces leave relatedness unmet. | Ryan & Deci 2000; Ryan & Deci 2017 *SDT* | Solo surfaces only; no cohort, no peer. | LM8 — per-cohort routes + peer-comparison + group leaderboard + live touchpoint (Phase 2). | | | |
| A15 | **Variable-ratio reinforcement** — unpredictable reward schedules produce most extinction-resistant behaviour. | Skinner 1957 *Schedules of Reinforcement* | None. | LM7 push-cadence — variable not fixed; bandit-optimised (Phase 2). | | | |
| A16 | **Loss aversion via streaks** — losses loom ~2× as large as gains; streak-as-asset framing exploits this. | Kahneman & Tversky 1979 *Econometrica* | Streak counter computed; not surfaced. | LM7 — streak counter in Header; streak-freeze (Phase 2). | | | |
| A17 | **Goal-gradient + endowed progress** — pre-stamped progress and proximity-to-goal accelerate completion. | Hull (drive-reduction); Kivetz, Urminsky & Zheng 2006 *J Marketing Res* (34% faster completion with 2-of-12 pre-marked vs 0-of-10) | Progress tracking exists; no endowed-progress surface. | Phase 2 — progress bar shows fractional credit early; "you're 78% to mastery on this concept" framing. | | | |
| A18 | **Cohort-commitment / parasocial accountability** — cohort-format effect from social identity + parasocial commitment + peer accountability. | Maven W1→W2 96% (vs MOOC 16%); Reich 2019 *Science* (14× MOOC); altMBA 96%; HBS Online | None. | LM8 — cohort surface (Phase 2). | | | |

**Row-level question prompts (behavioural side).**
- A12 Hook Model — is the published Eyal framework rigorous enough to
  cite as evidence, or is it a popular-press synthesis that we should
  hedge?
- A14 SDT — relatedness in our cohort surface is mediated by group
  leaderboard + peer-comparison; is that *actually* relatedness in the
  Ryan & Deci sense, or is it competence with a social wrapper?
- A18 cohort effect — what fraction of the 96% Maven W1→W2 retention
  is attributable to (a) self-selection (only motivated learners pay
  $300+); (b) cohort mechanism; (c) instructor quality? The published
  data does not decompose this — should we hedge?

### A.3 — Learner-side problem-mitigation rows (dossier §4.1–§4.8)

For each of L1–L8 in dossier §4: assess whether the planned feature
faithfully implements the cited mechanism, and whether the falsification
trigger is the right metric.

| # | Problem | Mechanism + planned feature (cross-ref dossier §4) | Falsification trigger | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|
| A19 | L1 knowledge decay without review | spacing → SpacedReviewBanner + scheduler | D7 lift < 12pp at 8 weeks | | | |
| A20 | L2 streak no return-trigger | Hook + variable-ratio → web-push + email digest | CURR lift < 10pp at 8 weeks | | | |
| A21 | L3 re-reading not retrieval | testing + generation → RetrievalGate + principle-write | mock pass-rate < 8pp lift | | | |
| A22 | L4 flat mocks | encoding-specificity → 4 scenarios × 15 Q | r < 0.6 with cert pass | | | |
| A23 | L5 no JOL capture | calibration → JOL slider + Δ trend | \|Δ\| not converging at 60% | | | |
| A24 | L6 letter-bias | cue-validity → validator | distribution not uniform within ±5pp | | | |
| A25 | L7 interleaving not enforced | Rohrer & Taylor → recommender constraint | transfer accuracy < 15pp | | | |
| A26 | L8 no cohort surface | SDT relatedness → cohort routes | cohort vs solo < 20pp | | | |

**Row-level question prompts (problem mitigation).**
- A19 — is the +1d / +3d / +7d / +14d / +30d cadence the right one for
  the platform's retention horizon (~30–60 days from concept first
  exposure to certification)? Or should it be SM-2-with-ease-factor
  (Anki-style adaptive)?
- A24 — is `> 55% any single letter` the right validator threshold?
  Or should it be statistical (chi-square against uniform)?
- A25 — does `nextPick.subArea !== lastPick.subArea` produce *enough*
  interleaving, or does it merely prevent immediate-adjacency repeats?

---

## §B — Learning-specialist audit checklist

**Reviewer scope:** dossier §1.3 (SME crisis), §2.3 (instructional-design
mechanisms), §3.7 (SME-elicitation tools), §4.9–§4.16 (S1–S8 problem-
mitigation walkthrough). 18+ rows below.

### B.1 — Instructional-design mechanisms (dossier §2.3)

| # | Claim | Cited source | Built today | Planned (Phase) | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|---|
| B1 | **Cognitive Task Analysis (CTA)** — SMEs omit ~70% of decisions in self-narration; CTA-built instruction +46% gain, d ≈ 1.72. | Clark, Feldon, van Merriënboer, Yates & Early; Clark & Estes 1996; Lee 2004; Tofel-Grehl & Feldon 2013 | None — content authored by hand-editing `curriculum.js`. | SM1 — `DrafterIntake` schema with 5 required JSON fields (Phase 2). | | | |
| B2 | **4C/ID** — four components (learning tasks / supportive info / JIT info / part-task practice) required for complex-skill instruction. | van Merriënboer 1997; van Merriënboer & Kirschner 2018 *Ten Steps to Complex Learning* | Quiz schema captures correct/distractors but no 4C/ID coverage. | SM6 — critic returns `missing_components` (Phase 2). | | | |
| B3 | **Backward design / Understanding by Design** — assessment first, lesson second; produces measurable lessons. | Wiggins & McTighe 1998/2005 *Understanding by Design* | Quiz authoring is post-hoc to lesson. | SM2 — admin app at `/admin/draft/[slug]` opens to assessment intake; lesson editor locked until passing assessment authored (Phase 2). | | | |
| B4 | **Worked-example fading** — pair every concept with worked + faded variant; worked → faded → solo across mastery rungs. | Sweller 1988; Sweller, van Merriënboer & Paas 2019; Renkl 2014 | None — examples are SME's choice; no pair structure. | SM3 — pair editor with worked + faded mandatory fields (Phase 2). | | | |
| B5 | **Andragogy applied to SME interview design** — SMEs are adult learners of "how to teach"; intake protocol must surface why before what. | Knowles 1973; adapted to SME interview design | None. | Tooltips and inline rationale at every required SME field (Phase 2). | | | |
| B6 | **Tacit knowledge capture** — text-from-blank is unrecoverable for ~80% of operationally-relevant knowledge in skilled-trades / clinical domains. | Polanyi 1966; Nonaka & Takeuchi 1995 | None — text-only authoring. | SM7 — voice / camera-first authoring with auto-draft (Phase 2). | | | |
| B7 | **Deliberate practice + feedback specificity** — skill improvement requires specific, repeated feedback on a named dimension over time. | Ericsson 1993; Ericsson & Pool 2016 *Peak* | Critic feedback is per-draft; not aggregated per-SME. | SM8 — per-SME blind-spot dashboard at `/admin/sme/[id]/` (Phase 2). | | | |
| B8 | **Question-led authoring** — start from "what should the learner be able to do?" not "what do I know?". | Dirksen *Design for How People Learn* 2nd ed. 2016 | None. | SM2 (backward design surface implements this in product form). | | | |
| B9 | **Expert blind spot** — high-content-knowledge instructors over-estimate novice prerequisites. | Nathan & Petrosino 2003 *AERJ* | None. | SM4 — "what would a novice get wrong here?" textarea required at submission (Phase 2). | | | |
| B10 | **Curse of expertise** — experts can't simulate novice mental state; under-predict task duration. | Hinds 1999 *J Exp Psych: Applied* | None. | SM4 (same mitigation as B9). | | | |

**Row-level question prompts (learning specialist).**
- B1 CTA — is our 5-probe intake (`novice_error`, `one_principle`,
  `worked_example`, `faded_variant`, `boundary_case`,
  `nearest_confusable`) faithful to the canonical CTA protocol
  (knowledge audit, simulation interview, critical-decision method)?
  Or is it a *productisation* that loses fidelity? If lossy, what's
  lost?
- B2 4C/ID — does our critic's `missing_components` check actually
  enforce 4C/ID at the lesson level, or only at the concept level?
  van Merriënboer's protocol is whole-task; concept-level enforcement
  is a re-interpretation.
- B3 backward design — does locking the lesson editor until a passing
  assessment is authored produce *better* lessons, or just *measurable*
  ones? The former is the goal; the latter is the metric.
- B5 closed-taxonomy principle picker — does it meaningfully reduce
  drift (the goal), or merely impose surface uniformity (an artefact)?
  Reviewer's view on whether the taxonomy itself is the bottleneck.
- B7 per-SME blind-spot dashboard — is this a deliberate-practice
  feedback channel in the Ericsson sense, or just analytics? The
  dossier claims the former; reviewer assess.

### B.2 — SME-side problem-mitigation rows (dossier §4.9–§4.16)

| # | Problem | Mechanism + planned feature (cross-ref dossier §4) | Falsification trigger | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|
| B11 | S1 70% omission | CTA → DrafterIntake 5 probes | learner pass-rate < 20pp lift | | | |
| B12 | S2 telling-what-I-know | backward design → assessment-locked lesson editor | gate-bypass > 20% at month 1 | | | |
| B13 | S3 no worked-example pair | Sweller / Renkl → mandatory pair editor | faded compliance < 95% at month 3 | | | |
| B14 | S4 no novice-error probe | Nathan & Petrosino → required textarea | rejection-rate not declining | | | |
| B15 | S5 free-typed principle drift | closed taxonomy → principle picker | drift > 5% same-principle different-strings | | | |
| B16 | S6 no 4C/ID gate | van Merriënboer → critic missing_components | ≥ 5% lessons missing components at audit | | | |
| B17 | S7 tacit knowledge | Polanyi / CTA-for-trades → voice / camera | SME TTFV > 1h at deskless pilot | | | |
| B18 | S8 critic feedback no loop | Ericsson → per-SME dashboard | rejection-rate not flat-or-improving at 8w | | | |

**Row-level question prompts (SME problem-mitigation).** For each:
- Is the problem real and at the cited prevalence in the populations
  the platform targets (compliance, technical certifications,
  vocational, clinical)? Or is it K-12-only?
- Does the planned feature actually mitigate the problem, or only
  address a symptom?
- What's the strongest counter-example — a published case where the
  planned mitigation failed or the problem proved different?
- Is the falsification trigger the right metric, or is it gameable
  / proxy-only?

---

## §C — Business-partner audit checklist

**Reviewer scope:** dossier §3 (industry historical mitigation case
studies) + §5 (commercial viability — TAM, comparables, pricing, unit
economics, NRR, scalability, capital efficiency). 24 rows below
covering the six commercial-viability sub-sections plus the industry
case studies. Same scoring rubric (§3) and recommendations (§4).

### C.1 — Industry-comparable sanity checks (dossier §3 + §5.2)

| # | Claim | Reviewer question | Cited source | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|
| C1 | **Duolingo CURR +21%, DAU 4.5× from streak design alone over 4 years.** | Is Mazal 2022 the right primary source? Is the lift attributable to streak iteration *alone* or to the broader product evolution? | Mazal 2022 (Duolingo eng blog) | | | |
| C2 | **Maven W1→W2 96% retention; cohort-based 14× MOOC.** | Is the 96% figure from a published source or Wes Kao posts? Is it self-reported or third-party-verified? Self-selection bias on the cohort participants? | Maven internal data via Wes Kao published essays | | | |
| C3 | **Coursera ~5% baseline completion.** | Is the 3.13% Reich & Ruipérez-Valiente figure (HarvardX/MITx) generalisable to Coursera at large? Coursera is a different vendor with different content; the figure may understate. | Reich & Ruipérez-Valiente 2019 *Science* | | | |
| C4 | **Cornerstone OnDemand acquired Clearlake $5.2B 2021.** | Right valuation; is Cornerstone the right comparable for the platform's positioning, or is it too enterprise-LMS-coded? | Public M&A filings | | | |
| C5 | **Section ($50M Series B 2022) — closest peer.** | Is Section actually the closest peer? Counter-candidate: Khan Academy + Duolingo for AI-tutored mastery; counter-candidate: Articulate AI for SME-side. Reviewer's view. | Crunchbase / Section press | | | |
| C6 | **360Learning ($200M Series C 2021); 360Learning is most-likely-overlapping competitor on SME side.** | Is 360Learning shipping CTA-style intake or only text-editor authoring? Reviewer's empirical knowledge. | 360Learning published materials | | | |
| C7 | **Synthesia ($1B+ valuation 2023) — generation, not elicitation.** | Is the generation-vs-elicitation distinction defensible? An LP could argue Synthesia is the precedent. | Industry coverage | | | |
| C8 | **Top-quartile ed-tech ARR multiples 8–12×.** | Is SaaS Capital 2025 the right reference for our mixed B2B/B2C model, or should we anchor to consumer-recurring multiples (which are lower)? | SaaS Capital 2025 | | | |

### C.2 — Market-sizing critique (dossier §5.1)

| # | Claim | Reviewer question | Cited source | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|
| C9 | **Global e-learning market $315B 2025.** | Is Mordor's $315B credible, or is it a vendor-blog inflation? IBISWorld and Statista give different numbers; reviewer's preferred source. | Mordor Intelligence 2025 *E-Learning Market Report* | | | |
| C10 | **Corporate training market $399B 2025.** | Is Training Industry Inc.'s figure inclusive of in-person training, instructor salaries, and venue cost? If so, it's not a SAM for digital ed-tech. | Training Industry Inc. 2025 *Training Industry Report* | | | |
| C11 | **Compliance training $14B sub-segment.** | What is the regulatory driver mix (FINRA / OSHA / GDPR / SOX / HIPAA)? Is the sub-segment growing or stagnant? | Industry consensus across LMS-vendor reports | | | |
| C12 | **SOM target — 1k SMB tenants × $5k ACV = $5M ARR by Y3.** | Is this conversion rate (operator → 1k SMB tenants in 3 years) realistic given operator-time-only sales motion? | Internal projection | | | |
| C13 | **SOM mid-path — 100 enterprise tenants × $50k ACV = $5M ARR Y4–5.** | Enterprise ACV is 100% gated on SOC2; is the year-2 SOC2 timeline realistic for an operator-funded business? | Internal projection | | | |

### C.3 — Pricing-tier questions (dossier §5.3)

| # | Claim | Reviewer question | Cited comparable | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|
| C14 | **B2C standalone $9.99–19.99/mo.** | Is the price ~30% premium over Duolingo Plus ($7–13/mo) defensible by the full mechanism stack, or is it a barrier to acquisition? | Duolingo Plus, Brilliant, Quizlet Plus | | | |
| C15 | **B2C cohort $99–299 / 6-week cohort.** | Is this priced *below* Maven ($300–3000) intentionally, and if so, what's the WTP justification? | Maven, altMBA | | | |
| C16 | **B2B SMB $49/SME/mo + $5/learner/mo (min $99).** | Per-SME pricing is novel; do SMB buyers value it, or do they prefer per-learner only (Cornerstone-style)? | TalentLMS, Docebo, EdApp | | | |
| C17 | **B2B Enterprise $50k–500k ACV.** | Is the $50k floor deliverable at our margin structure, or does it require feature-stripping? Is the $500k ceiling realistic without SOC2 / FedRAMP / HIPAA-BAA? | Cornerstone, Workday Learning, SuccessFactors | | | |
| C18 | **B2B Compliance vertical $100k–1M ACV.** | The 3.5×-violation-rate cost-curve is the value-capture argument; is it actually how compliance buyers calculate? Or do they buy on regulatory mandate alone? | KPI Depot 2026; industry consensus | | | |

### C.4 — Unit economics + NRR plausibility (dossier §5.4 + §5.5)

| # | Claim | Reviewer question | Cited source | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|
| C19 | **95%+ gross margin at Phase 2 scale.** | Is this consistent with the AI-cost line ($300/mo at 100 tenants / 50k generations)? At 1000 tenants, AI cost may scale more linearly — does margin compress to 80%? | Internal projection vs Anthropic API | | | |
| C20 | **Prompt-caching 30–60% input-token cost reduction.** | Is 30–60% the right band, or is it more variable based on traffic pattern? At sporadic traffic, caching efficiency is closer to 0%. | Anthropic API + internal estimates | | | |
| C21 | **NRR Y1 ≥ 110%, Y2 ≥ 120%.** | Is this achievable for a mixed B2B/B2C model, or do consumer-recurring (high churn) and B2B-Enterprise (high expansion) average to a lower number? | SaaS Capital 2025 | | | |
| C22 | **LTV 24–36 months B2B SaaS norm.** | Is 24–36 months right for SMB-tier (where churn is higher), or does the platform need a different LTV assumption per tier? | Industry consensus | | | |

### C.5 — Capital efficiency + scalability (dossier §5.6 + §5.7)

| # | Claim | Reviewer question | Source | Score | Recommendation | Notes |
|---|---|---|---|---|---|---|
| C23 | **Phase 1 ~$0 incremental cost; Claude Max 20× $200/mo is operator sunk cost.** | Is this defensible in serious LP-level due diligence, or do LPs require fully-loaded cost (including operator-time at market rate)? | Internal | | | |
| C24 | **Vercel ToS at scale is the bring-your-own-infra escape hatch.** | Is the bring-your-own-infra migration realistic at $X-MRR (when does it block growth)? Cloudflare Pages / Fly.io / self-host on AWS are real but costly migrations. | Internal projection vs Vercel ToS | | | |

**Row-level question prompts (business partner).** For each:
- Are the cited revenue / valuation figures current within 12 months?
- Do the comparables' published metrics generalise to our positioning,
  or are we comparing to companies in different categories?
- Are the SaaS Capital benchmarks the right reference for our mixed
  B2B/B2C model, or should we anchor to a more relevant comparable
  set?
- Is the SOM model (1k SMB tenants × $5k ACV = $5M ARR Y3) reflective
  of realistic conversion rates given operator-time-only sales motion
  in Phase 1?
- Is the Phase 1 ~$0 incremental claim defensible (operator already
  pays Claude Max 20× sunk cost — does this pencil out in serious
  due-diligence) or is it an artefact of operator-funded calculation?
- Is the Anthropic API cost-curve assumption (sub-linear with prompt
  caching) right, or are we still optimistic about the caching
  efficiency?
- Is the L4-Kirkpatrick compliance-pass-rate / audit-finding-deltas
  expansion-revenue mechanic actually how compliance buyers calculate
  ROI, or is it operator-side projection only?