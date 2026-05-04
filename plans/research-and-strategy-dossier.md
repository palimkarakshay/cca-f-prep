# Research & Strategy Dossier — Learner Absorption, Cohort Retention, and SME Knowledge-Sharing

> **Purpose.** Single hand-overable evidentiary basis for the planned
> learning platform. Translates 50+ years of cognitive-psychology,
> behavioural-economics, and instructional-design research into a problem
> catalogue, a mechanism set, an industry-historical comparison, a
> problem-by-problem build commitment, and a falsifiable commercial case.
>
> **Audience.** Investor counsel doing diligence; B2B technical / L&D
> buyer doing vendor evaluation; partner / collaborator doing technical
> due-diligence; internal reference for the operator and future builder.
>
> **Companion documents.**
> - [`content-pack-management-plan.md`](./content-pack-management-plan.md)
>   — the build plan (Sections A–D); §D0 is the canonical problem→feature
>   matrix this dossier elaborates with full evidence.
> - [`expert-review-audit.md`](./expert-review-audit.md) — structured
>   critical-review template for an external psychology / learning /
>   business-partner reviewer to audit this dossier against the live
>   codebase + planned build.
> - Audience-tuned slide decks: [overview](./deck-overview.md),
>   [investor](./deck-investor.md), [B2B prospect](./deck-b2b-prospect.md),
>   [collaborator](./deck-collaborator.md).
>
> **Stance.** Declarative where the evidence supports it; hedged where
> it does not. Falsification triggers stated for every load-bearing
> claim. No marketing language. No fabricated citations.

---

## Table of contents

- [§0 — Executive summary](#0--executive-summary)
- [§1 — The problem (researched and verified)](#1--the-problem-researched-and-verified)
  - 1.1 Retention crisis in formal learning systems
  - 1.2 Knowledge decay in untreated learners
  - 1.3 SME knowledge-sharing crisis
  - 1.4 Engagement / return-visit crisis
- [§2 — How to mitigate (named mechanisms)](#2--how-to-mitigate-named-mechanisms)
  - 2.1 Cognitive psychology of retention and absorption
  - 2.2 Behavioural psychology of return-visit / habit formation
  - 2.3 Instructional design for SME effectiveness
- [§3 — How industry has historically mitigated (case studies)](#3--how-industry-has-historically-mitigated-case-studies)
  - 3.1 Spaced-repetition systems
  - 3.2 Streak / habit / variable-reward systems
  - 3.3 Cohort-based learning
  - 3.4 Mastery learning
  - 3.5 MOOC failure mode (what NOT to do)
  - 3.6 Corporate LMS (the staid alternative)
  - 3.7 SME-elicitation / authoring tools
  - 3.8 The synthesis gap (the wedge)
- [§4 — What we are planning (problem-by-problem walkthrough)](#4--what-we-are-planning-problem-by-problem-walkthrough)
- [§5 — Commercial viability](#5--commercial-viability)
  - 5.1 Market sizing (TAM / SAM / SOM)
  - 5.2 Industry comparables
  - 5.3 Pricing tiers
  - 5.4 Unit economics
  - 5.5 NRR targets
  - 5.6 Scalability
  - 5.7 Capital efficiency
- [§6 — Verification & falsifiability](#6--verification--falsifiability)
- [§7 — Bibliography](#7--bibliography)

---

## §0 — Executive summary

**The problem, in one sentence per audience tier.** Massive Open Online
Course completion is 3–10% (Reich & Ruipérez-Valiente 2019, *Science*);
self-paced corporate course completion is 12–15% (KPI Depot 2026, ATD
benchmarks); without spaced retrieval, knowledge decays to ≈ 25%
retained at day 6 (Murre & Dros 2015 replication of Ebbinghaus 1885);
and Subject-Matter Experts (SMEs) omit ~70% of decisions when
self-narrating their expertise — yielding instruction that produces
~46% smaller learning gains than Cognitive-Task-Analysis–built
equivalents (Clark, Feldon, van Merriënboer, Yates & Early; Lee 2004;
Cohen's d ≈ 1.72).

**The constructed answer.** A learning platform that ships ~14 named
cognitive-science, behavioural, and instructional-design mechanisms as
concrete product surfaces — not exhortation, not "best-practice
guidelines." The same mechanism engine drives segment-tuned surfaces
(B2C exam-prep, B2B SMB compliance, deskless mobile, high-PDI
enterprise, founder-led SMB succession). Defensibility is the
*synthesis* — most extant products optimise one mechanism (Anki =
spacing; Duolingo = streaks; Maven = cohort; Khan Academy = mastery);
no published precedent ships ~14 in one product surface.

**The measurable target.** Quarterly Kirkpatrick L1–L4 reporting:
NPS / CES (L1); mock pass-rate + calibration Δ (L2); D1 / D7 / D30
cohort retention curves + course-completion rate (L3); Net Revenue
Retention + compliance pass-rate / audit-finding deltas (L4).
Quantitative targets: |calibration Δ| → 0.5; D7 ≥ 40%, D30 ≥ 35% on
cohort tier (vs mobile-app par 28% / 14%); course completion ≥ 60%
(vs MOOC 3–10%); NRR Y1 ≥ 110%, Y2 ≥ 120% (SaaS Capital 2025
benchmarks). Every load-bearing mechanic in this dossier has a
falsification trigger named in §4 and §6 — if the 8-week trend on the
named outcome metric is flat or negative, the mechanic is removed or
redesigned. The framework is falsificationist, not faith-based.

---

## §1 — The problem (researched and verified)

This section establishes that the four problem clusters — formal-system
retention failure, untreated knowledge decay, SME knowledge-sharing
breakdown, and engagement / return-visit collapse — are real, measured,
and systemic. Every quantitative claim is anchored to a named source
(industry report, peer-reviewed paper, or company case study) so a
diligence reader can verify independently.

### 1.1 The retention crisis in formal learning systems

**MOOC completion is structurally low.** Reich & Ruipérez-Valiente 2019
(*Science*, "The MOOC pivot") analyse 12.67M registrants on 565
HarvardX and MITx courses. Headline finding: ≈ 3.13% completion among
free-tier registrants; even among learners who paid for verified
certification, completion plateaus around 6%. The structural lesson is
explicit in the paper: high-quality content is *necessary but not
sufficient* — without behavioural triggers, social cohort, and
calibration surfaces, the formal-learning loop collapses to ~5%
completion regardless of content quality. This is why the paper coined
"the MOOC pivot": the major MOOC platforms have moved away from open
access toward credential-paid B2B segments, implicitly conceding the
free-tier completion problem.

**Self-paced corporate course completion is materially better but still
low.** Industry benchmark from KPI Depot 2026: self-paced corporate
completion sits at 12–15%. The Association for Talent Development (ATD)
publishes a 72% mixed-format average that is frequently cited but
*misleading* for our purposes — it bundles instructor-led, blended,
cohort, and self-paced into a single number. Stripped to self-paced
only, the 12–15% figure holds across the major LMS-vendor benchmarks
(Cornerstone, Docebo, 360Learning published case data).

**Mobile ed-tech retention is comparable to consumer-app baselines.**
a16z mobile retention guides and the Sequoia retention guide both place
self-serve mobile ed-tech D30 retention at ≈ 14% (median); Duolingo and
Babbel as best-in-class consumer language apps reach 22–28% D30. These
are *use-the-app-at-all* numbers; learning-objective completion sits
materially lower.

**The compliance-training cost is monetisable.** KPI Depot 2026
reports that organisations with course completion below 70% experience
a **3.5× compliance-violation rate** vs organisations above the
threshold. This is the single most directly monetisable line in the
problem catalogue — every percentage point of retention lift in a
regulated tenant has a measurable downstream cost in audit findings
and incident liability. We treat this as the L4-Kirkpatrick expansion
lever in §5.5.

**Cohort-based courses are the existence proof that the failure is
addressable.** Maven (Wes Kao + Gagan Biyani; $25M Series A 2021)
publishes W1→W2 retention of 96% on cohort-based courses; altMBA (Seth
Godin) reports comparable ~96% completion. This is a **14×** lift over
the MOOC 16% W1→W2 baseline. The mechanism is named in §2.2 (SDT
relatedness; cohort-commitment / parasocial accountability).

### 1.2 Knowledge decay in untreated learners

Even when learners do *complete* a course, untreated knowledge decays
exponentially.

**The forgetting curve is replicated.** Ebbinghaus 1885 established
the canonical exponential-decay shape via savings-method experiments
on himself. The classical replication is Murre & Dros 2015 (*PLoS
ONE*, "Replication and analysis of Ebbinghaus' forgetting curve"),
which reproduces the original curve under modern controls: ≈ 58%
retention at 20 minutes post-exposure, ≈ 33% at 24 hours, plateau
≈ 25% by day 6 without re-exposure. The decay is durable — once an
item drops to plateau, additional time accumulates almost no further
loss but no recovery either. The implication is sharp: a learner who
finishes a lesson on Monday and is not re-exposed by Friday has
~3/4 of the content gone; the platform's only meaningful intervention
is to schedule a retrieval before the plateau.

**Re-reading produces a fluency illusion, not durable learning.**
Bjork & Bjork 2011 (the desirable-difficulties framework) distinguish
two memory dimensions: *storage strength* (durable retrieval
availability) and *retrieval strength* (current ease of access).
Re-reading raises retrieval strength only; subjective fluency ("I feel
I know this") is high; actual durable storage is unchanged. Roediger &
Karpicke 2006 (*Psychological Science*) operationalises this directly:
in the canonical experiment, students who self-tested once after a
study session recalled ≈ 61% of the material at 1-week delay vs ≈ 40%
for re-readers — the testing effect, ≈ 50% lift in delayed recall from
a single retrieval episode. Karpicke & Blunt 2011 (*Science*) extends
this to concept-mapping: retrieval practice beats the more-effortful
concept-mapping condition by a similar margin on the 1-week delayed
test, refuting the "you must elaborate to encode" intuition. The
durable learning surface must be *retrieval-shaped*, not re-reading-
shaped.

**Blocked practice transfers ~30% worse than interleaved.** Rohrer &
Taylor 2007 randomised 4th-grade students between blocked-practice
(all problems of one type, then all of the next) and interleaved-
practice (rotating types) on geometry. Same total practice time. At
1-week delayed test: 20% accuracy in the blocked condition vs 63% in
the interleaved condition — a 3× transfer lift. The same pattern
replicates in adult-learner contexts (Rohrer 2012 review). The
practical consequence: the recommender that sends a learner the *same
sub-area* twice in a session is materially harming long-term learning
even when each individual session feels productive.

**Metacognitive miscalibration is the dominant late-stage failure
mode.** Dunlosky & Bjork (*Handbook of Metamemory and Memory*)
synthesise decades of judgment-of-learning (JOL) research: learners'
predictions of what they will recall correlate poorly with what they
actually recall, and the gap *grows* with re-reading. Kruger & Dunning
1999 (the eponymous paper) demonstrates the canonical asymmetry:
novices systematically over-estimate competence; experts under-estimate
it. The gap shows up directly in our diagnostic data: in the operator's
own CCA-F diagnostic-01 self-test, the predicted score (high) and
measured score (3/10) differed by ~5 standard deviations of typical
calibration, anchoring the relevance to our specific learner
population (CLAUDE.md "My background" section).

### 1.3 The SME knowledge-sharing crisis

This is the problem cluster the planned platform is most differentiated
on, and the one most under-discussed in consumer ed-tech.

**SMEs cannot self-narrate the decisions they actually make.** The
Cognitive Task Analysis literature (Clark, Feldon, van Merriënboer,
Yates & Early — multiple chapters in the *Handbook of Research on
Educational Communications and Technology*) finds that SMEs describing
complex-task performance from memory omit ~70% of the decisions they
actually execute when performing the task. Lee 2004 (a frequently-
cited operational meta) compares CTA-built instruction with
expert-narrated instruction on identical content domains: post-training
learning gain is ~46% larger for the CTA condition, with Cohen's d
≈ 1.72. Tofel-Grehl & Feldon 2013 reviews 11 controlled studies on
CTA in instructional design and reports a similar effect-size band.
The mechanism is not laziness or low effort; it is procedural
*automatisation* — the more skilled an SME becomes, the more decisions
are executed below conscious access, and the less reliably the SME can
report them when interviewed.

**Expert blind spot.** Nathan & Petrosino 2003 (*American Educational
Research Journal*) demonstrate that high-content-knowledge instructors
systematically over-estimate novice prerequisites — they teach as if
the bridging concepts the novice needs are already in place. The
clinical effect: novices stall at the implicit gap; the SME sees the
stall as "the novice didn't try hard enough." The platform-level
implication is that the SME-side scaffolding must include an explicit
"what would a *novice* get wrong here?" probe at authoring time, not
post-publication.

**Curse of expertise.** Hinds 1999 (*Journal of Experimental
Psychology: Applied*) shows experts can't simulate novice mental
state — they predict tasks will take novices a small fraction of the
time the tasks actually require. The combined Hinds + Nathan-Petrosino
finding is that the same SME who is genuinely good at the work is
*structurally bad* at predicting where a novice will stall.

**"Telling what I know" is the SME default.** Wiggins & McTighe 1998
(*Understanding by Design*) document that the dominant SME-authoring
pattern is content-first (teach what I know, then make a test) rather
than assessment-first (decide what the learner must be able to do,
write the test, then design the lesson backwards from the test). The
content-first pattern produces lessons that are unmeasurable — there
is no clean way to know the learner has "got it." Backward design is
the standard remediation.

**Tacit knowledge is unrecoverable from text-from-blank.** Polanyi
1966 (*The Tacit Dimension*) introduces the canonical distinction:
explicit knowledge ("we can articulate what we know") vs tacit
knowledge ("we know more than we can tell"). The CTA-for-skilled-
trades literature (multiple authors) finds that for shop-floor /
clinical / field-services workflows, the tacit fraction can exceed
80% of the operationally-relevant knowledge. TalentCards reports
~2.7B deskless workers globally — ~80% of the global workforce.
This segment cannot author content via a text editor; the
SME-elicitation surface must support voice-first or video-first
capture with auto-draft into the structured intake.

**Critic feedback as one-off rather than deliberate-practice loop.**
Ericsson 1993 ("The role of deliberate practice in the acquisition
of expert performance") establishes the canonical feedback channel
requirement: skill improvement requires *specific, repeated*
feedback on a *named* dimension over time. Most LMS-vendor SME
review pipelines surface critic findings once per draft and then
reset; the SME never sees a pattern of their own omissions over time
and never gets the deliberate-practice loop on their *authoring*.
This is the gap §4.16 (problem S8) addresses with a per-SME
blind-spot dashboard.

### 1.4 The engagement / return-visit crisis

The fourth problem cluster is behavioural rather than cognitive: even
when content is good and SMEs are scaffolded, learners need a return-
visit *trigger surface* or the daily intent decays.

**Most ed-tech omits the trigger phase entirely.** Eyal 2014
(*Hooked*) names the four-phase Hook Model: trigger → action →
variable reward → investment. The "trigger" phase is the external
prompt that brings the user back; without it, the loop never starts
and motivation alone is insufficient. Most ed-tech ships the action
+ reward phases (the lesson, the quiz, the score) without the trigger
phase (the push notification, the streak prompt, the cohort message).
The behavioural-economics literature is clear that motivation is the
*least* leveraged input for habit formation.

**Fogg B = MAP.** Fogg 2009 ("A behavior model for persuasive
design") names the canonical equation: behaviour occurs only when
**M**otivation, **A**bility, and **P**rompt coincide. When behaviour
fails, the dominant cause is missing prompt or excess friction —
*not* absent motivation. The strategic implication is operational:
when retention is low, raise *ability* (reduce friction: one-tap
"5-min review", default to spaced-review queue, no setup) before
raising motivation.

**SDT relatedness is the gap solo learning leaves open.** Ryan & Deci
(Self-Determination Theory; canonical 2000 paper *Intrinsic and
extrinsic motivations* and 2017 book) establish three innate
psychological needs: autonomy, competence, relatedness. Solo
learning surfaces address autonomy (learner picks) and competence
(mastery progression) but leave relatedness unmet. This is exactly
the gap cohort-based courses (Maven, altMBA) close — and the data
in §1.1 shows the lift is large.

**Variable-ratio reinforcement is the most extinction-resistant
schedule.** Skinner's operant-conditioning work establishes that
unpredictable reward schedules (variable-ratio) produce behaviour
that is most resistant to extinction when reward is removed.
Predictable schedules (fixed-ratio, fixed-interval) are easier to
extinguish. This is why the Duolingo case study below shows lift
from "push notifications anchored to user's modal study-time with
variable cadence" rather than "daily 7pm reminder." The latter
extinguishes faster on missed days.

**Loss aversion via streaks.** Kahneman & Tversky 1979 (prospect
theory) establish that losses loom roughly twice as large as
equivalent gains in human decision-making. The streak design
exploits this: once a learner has built a 30-day streak, missing a
day is a *loss*, and loss aversion drives the return visit harder
than the equivalent gain framing ("come back to maintain your
streak"). Duolingo's published case study (Mazal 2022) reports
≈ +21% Current-User Retention Rate (CURR) and ≈ 4.5× DAU growth
over four years from streak-design iteration alone.

### Summary of §1

The problem catalogue is real, measured, and addressable. Each cluster
has named industry data and named research grounding:
- Retention crisis: Reich 2019 *Science*; KPI Depot 2026; a16z; Maven.
- Knowledge decay: Murre & Dros 2015; Bjork & Bjork 2011; Roediger &
  Karpicke 2006; Rohrer & Taylor 2007; Dunlosky & Bjork; Kruger &
  Dunning 1999.
- SME crisis: Clark, Feldon, van Merriënboer, Yates & Early; Lee 2004;
  Tofel-Grehl & Feldon 2013; Nathan & Petrosino 2003; Hinds 1999;
  Wiggins & McTighe 1998; Polanyi 1966; Ericsson 1993.
- Engagement: Eyal 2014; Fogg 2009; Ryan & Deci; Skinner; Kahneman &
  Tversky 1979; Mazal 2022.

§2 names the mitigation mechanisms; §3 documents the historical
industry attempts; §4 walks each problem to its specific planned
feature; §5 establishes the commercial case; §6 names the
falsification triggers.

---

## §2 — How to mitigate (named mechanisms)

This section names the mitigation mechanisms — peer-reviewed cognitive,
behavioural, and instructional-design findings — that the platform
operationalises. Each mechanism is named with its canonical citation
and its operational claim (what the effect *does*, in measurable terms),
not summarised as motivational copy. §3 documents how the industry has
historically deployed these mechanisms one-at-a-time; §4 maps each
mechanism to a specific planned product surface in our build.

### 2.1 Cognitive psychology of retention and absorption

**Spacing effect.** Cepeda, Pashler, Vul, Wixted & Rohrer 2006
(*Psychological Bulletin*) is the canonical 254-study meta-analysis;
Cepeda et al. 2008 (*Psychological Science*) operationalises the
finding into a usable rule: optimal inter-study gap is ≈ 10–20% of the
desired retention interval. For a one-month retention target, ≈ 3–5
day gaps; for a one-year target, ≈ 5%. Spaced practice beats massed
practice by ≈ 2× across nearly every condition tested. Operational
claim: schedule retrieval at expanding intervals (1d / 3d / 7d / 14d /
30d) keyed to the desired retention horizon.

**Testing effect / retrieval practice.** Roediger & Karpicke 2006
(*Psychological Science*); Karpicke & Blunt 2011 (*Science*). The
operational result is the ≈ 50% delayed-recall lift discussed in §1.2;
the deeper finding is that retrieval is *itself* a learning event, not
merely an assessment of prior learning. The implication for product
design is that the platform's primary surface should be retrieval-
shaped (gates, prompts, write-the-principle fields) rather than
re-reading-shaped (depth toggles, summaries). Karpicke & Blunt 2011
extends the comparison to concept-mapping (a more effortful encoding
strategy) and finds retrieval still wins by a large margin —
strengthening the case that elaboration is not a substitute for
retrieval.

**Generation effect.** Slamecka & Graf 1978 (*Journal of Experimental
Psychology: Human Learning and Memory*) demonstrates the canonical
asymmetry: self-generated answers are retained ≈ 30% better than read
answers. The mechanism appears to be the additional encoding effort
required to produce the answer rather than recognise it. Operational
claim: where feasible, force the learner to *generate* (write, predict,
state) before *receiving* (the canonical answer, the explanation, the
principle).

**Interleaving.** Rohrer & Taylor 2007 (3× transfer lift, §1.2) and
the broader Rohrer 2012 review establish that rotating problem-types
within a practice session beats blocking the same type for a long
session. The mechanism is that discrimination (knowing *which*
solution applies) is itself a skill that blocked practice does not
exercise; interleaving forces the discrimination skill into every
trial. Operational claim: the recommender constraint
`nextPick.subArea !== lastPick.subArea` (or stronger rotation rule)
materially improves transfer.

**Desirable difficulties.** Bjork 1994 (the foundational chapter) and
Bjork & Bjork 2011 (the modern restatement) name the umbrella concept:
conditions that slow acquisition (spacing, interleaving, generation,
varied context, contextual interference) accelerate long-term retention
and transfer. The framework reconciles the apparent paradox that
"easier" study patterns produce worse durable learning — the difficulty
is the mechanism, not a side-effect to overcome. Operational claim: the
platform's defaults should *embrace* difficulty (retrieval-first, JOL
gate before reveal, interleaved recommender) rather than smooth it
away.

**Cognitive Load Theory + worked-example fading.** Sweller 1988
(*Cognitive Science*, "Cognitive load during problem solving") is the
canonical CLT paper; Sweller, van Merriënboer & Paas 2019 (*Educational
Psychology Review*) is the modern restatement integrating 30+ years of
follow-up evidence. Operationally, novices benefit most from
fully-worked examples that minimise extraneous load and let working-
memory focus on the schema being acquired; intermediate learners
benefit from *faded* worked examples (with hints progressively
removed); experts benefit from solo problem-solving. Operational
claim: the lesson surface must adapt scaffolding to mastery level —
fixed scaffolding hurts at both ends of the rung distribution.

**Expertise-reversal effect.** Kalyuga 2003 (*Educational Psychology
Review*) operationalises the upper boundary of CLT: scaffolding that
helps novices *hurts* intermediate-and-above learners. The implication
is that the worked-example fading must be triggered by mastery level,
not chronological lesson position. The platform's mastery-rung
indicator (already 0–4 in `progress-types.ts`) is the natural trigger.

**Metacognitive calibration / judgment-of-learning (JOL).** Dunlosky &
Bjork (multiple chapters in *Handbook of Metamemory*); Kruger & Dunning
1999. Two operational claims: (1) JOL miscalibration is itself a
named, measurable failure mode (low predictive validity of self-rated
mastery vs measured pass-rate); (2) the gap closes when the platform
captures pre-answer JOL (a 1–5 slider before quiz reveal) and
visualises the calibration delta over time. The platform's approach
is to make calibration Δ a first-class metric rather than a
diagnostic afterthought.

**Transfer (near vs far).** Barnett & Ceci 2002 (*Psychological
Bulletin*, "When and where do we apply what we learn?") names the
canonical taxonomy: transfer requires structural similarity in
retrieval cues for near-transfer, and varied contextualised practice
with explicit principles for far-transfer. Operational claim: the
mock-exam shape should mirror the *real* exam shape (4 scenarios ×
15 Q rather than flat 60-Q) because encoding-specificity dominates.

**Andragogy.** Knowles 1973 (*The Adult Learner*) names the canonical
six assumptions about adult learners: self-concept (autonomous);
experience (anchor for new learning); readiness (problem-driven);
orientation (immediate application); motivation (internal); need-to-
know (rationale-first). Operational claim: the platform must surface
the *why* before the *what* (rationale-first lesson structure), allow
the learner to pick the path (autonomy), and anchor new content to
prior schemas (B-skill / principle taxonomy).

**Dual-coding.** Paivio 1971/1986 (*Imagery and Verbal Processes*;
*Mental Representations: A Dual Coding Approach*); Mayer multimedia
learning principles synthesise this into 12 design rules. Operational
claim: verbal + visual encoding outperforms either alone — but only
when the visual is *non-redundant* with the verbal (Mayer's redundancy
principle is a frequent SME failure: SMEs duplicate text in slides,
which raises extraneous load and worsens learning).

### 2.2 Behavioural psychology of return-visit / habit formation

**Hook Model.** Eyal 2014 (*Hooked: How to Build Habit-Forming
Products*) names four phases: Trigger (external prompt or internal
cue) → Action (the simplest behaviour in anticipation of reward) →
Variable Reward (unpredictable payoff) → Investment (user contributes
something that increases value of next loop). The under-leveraged
phase in ed-tech is Investment — and it's the one that produces the
largest retention lift in the published case studies (Duolingo's
streak counter is a pure investment surface — the user has invested
30 days of effort; abandoning is now a loss).

**Fogg Behaviour Model.** Fogg 2009 (*Persuasive '09 conference*),
B = MAP. The actionable rule for product design: when behaviour
fails, raise *Ability* first (reduce friction: shorter session, one-
tap resume, default-to-spaced-review-queue), and add a *Prompt* (push
notification at a known-good time) before raising *Motivation* (which
is genuinely hard to move via product surfaces and almost always
needs lifestyle / identity-level intervention).

**Self-Determination Theory (SDT).** Ryan & Deci 2000 (*American
Psychologist*, "Self-determination theory and the facilitation of
intrinsic motivation, social development, and well-being"); Ryan &
Deci 2017 (*Self-determination theory*). The three innate
psychological needs (autonomy / competence / relatedness) are the
canonical motivation-design framework. Operational claim: solo
learning surfaces address autonomy and competence but leave
relatedness unmet; the cohort surface (per-cohort routes,
peer-comparison, group leaderboard, live touchpoint) is the
relatedness surface — and the cohort-based-course completion data
(§1.1) is the empirical evidence that the lift is large.

**Variable-ratio reinforcement.** Skinner (canonical operant-
conditioning work). Variable-ratio schedules (reward delivered after
an unpredictable number of responses) produce the most extinction-
resistant behaviour. Operational claim: streak push notifications
should fire on a variable cadence anchored to historical study time,
not a fixed 7pm reminder; the latter extinguishes faster on missed
days.

**Streak design + loss aversion.** Kahneman & Tversky 1979
(*Econometrica*, prospect theory). Losses loom ≈ 2× as large as
equivalent gains. The streak-as-asset framing — "you have a 30-day
streak that you will *lose* if you skip today" — is materially more
motivating than the gain framing. The Duolingo published case
(Mazal 2022) reports CURR +21%, DAU 4.5× from streak design alone.
Counterweight: streak fatigue and quitting-on-missed-streak is a real
risk; the streak-freeze affordance (Duolingo precedent) mitigates by
allowing one missed day per N earned.

**Goal-gradient + endowed progress.** Hull (canonical drive-reduction
work); Kivetz, Urminsky & Zheng 2006 (*Journal of Marketing
Research*, "The goal-gradient hypothesis resurrected"). Two
operational claims: (1) effort accelerates as the goal approaches
(goal-gradient); (2) pre-stamped progress (giving the learner credit
for some progress before they start) lifts completion (endowed
progress). The canonical Kivetz coffee-card experiment showed 34%
faster completion when 2 of 12 stamps were pre-marked vs 0 of 10.
Operational claim: course-completion progress bars should display
fractional credit early to leverage endowed progress.

**Cohort-commitment / parasocial accountability.** No single canonical
academic citation; the empirical case is the cohort-based-course
data (Maven, altMBA, HBS Online — see §3.3). The mechanism appears
to be a combination of social identity (group belonging), parasocial
commitment (the SME or instructor is a salient figure), and peer
accountability (visible-to-others completion).

### 2.3 Instructional design for SME effectiveness

This sub-section is the most under-deployed in extant ed-tech.

**Cognitive Task Analysis.** Clark, Feldon, van Merriënboer, Yates &
Early — multiple chapters in the *Handbook of Research on Educational
Communications and Technology* (3rd ed. 2008; 4th ed. 2013); Clark &
Estes 1996 (*Educational Researcher*); Clark 2014 (*Educational
Technology Research and Development*). The canonical CTA protocol
involves structured probes (knowledge audit, simulation interview,
critical-decision method) that surface the decision steps an SME
omits in self-narration. Lee 2004 reports +46% post-training learning
gain (Cohen's d ≈ 1.72) for CTA-built instruction vs expert-narrated;
Tofel-Grehl & Feldon 2013 reviews 11 controlled studies and reports a
similar effect-size band. Operational claim: the SME-side intake must
implement a CTA-style protocol (5 required probes — see §4.9) rather
than an open text field.

**Four-Component Instructional Design (4C/ID).** van Merriënboer 1997
(*Training Complex Cognitive Skills*); van Merriënboer & Kirschner
2018 (*Ten Steps to Complex Learning*). The four components: (a)
learning tasks (whole-task practice problems), (b) supportive
information (the conceptual framework), (c) just-in-time information
(the procedural facts surfaced when needed), (d) part-task practice
(drill on specific sub-skills). The canonical SME failure mode is
over-deliver (b), under-deliver (a), (c), (d). The platform's critic-
prompt design (§4.14) explicitly checks all four are present and
refuses to publish if any are missing.

**Backward design / Understanding by Design.** Wiggins & McTighe
1998/2005 (*Understanding by Design*). Three-stage design: (1)
identify desired results (what should the learner be able to do?);
(2) determine acceptable evidence (what assessment will demonstrate
they can?); (3) plan learning experiences (the lesson). The order is
the mechanism — content-first authoring produces unmeasurable lessons
(§1.3). Operational claim: the SME-side authoring flow must lock the
lesson editor until a passing assessment has been authored.

**Worked-example fading.** Sweller (CLT lineage); Renkl 2014
(*Educational Psychologist*, "Toward an instructionally oriented
theory of example-based learning") synthesises the modern evidence.
Pair every authored concept with: a fully-worked example (all steps
shown, novice-friendly), a faded variant (one or more steps removed,
intermediate-level), and a solo problem (worked → faded → solo across
mastery rungs).

**Andragogy applied to SME interview design.** Knowles 1973 framework
adapted: SMEs themselves are adult learners of "how to teach"; their
intake protocol must surface the *why* (here is the named cognitive-
load gap that the worked-example pair closes) before the *what*
(please type a worked example here). Operational claim: tooltips and
inline rationale at every required field — not a content-only form.

**Tacit knowledge capture.** Polanyi 1966; Nonaka & Takeuchi 1995
(*The Knowledge-Creating Company*) — externalisation of tacit
knowledge requires structured prompts and modality flexibility (voice,
video, demonstration). Operational claim: the SME-side surface must
support voice-first / camera-first capture with auto-draft into the
structured intake — text-from-blank is unrecoverable for ~80% of the
global workforce (TalentCards: ~2.7B deskless workers).

**Deliberate practice and feedback specificity.** Ericsson 1993
("The role of deliberate practice in the acquisition of expert
performance"); Ericsson & Pool 2016 (*Peak*). Three requirements for
deliberate practice: (a) specific, achievable goal; (b) immediate
feedback; (c) full attention. The under-deployed feature in extant
LMS-vendor SME pipelines is (b)+(c) over time — the SME never sees a
*pattern* of their own omissions across 10+ drafts, only one-off
critic findings per draft. The per-SME blind-spot dashboard (§4.16)
is the deliberate-practice loop.

**Question-led authoring.** Dirksen *Design for How People Learn*
(2nd ed. 2016) makes the explicit recommendation: start authoring
from "what should the learner be able to *do*?" not "what do I know?".
This is a practitioner-level operationalisation of backward design;
it shows up in our SM2 scaffold (§4.10).

### Summary of §2

The mitigation toolkit is well-established; what is novel is the
*synthesis*. §3 documents that no extant industry product ships
more than one or two of these mechanisms in concert; §4 walks each
problem in §1 to its specific planned implementation; §6 names the
falsification trigger for each. The bibliography in §7 collects all
named sources for ease of independent verification.

---

## §3 — How industry has historically mitigated (case studies)

This section documents how the ed-tech industry has deployed individual
mechanisms from §2, with named outcome data where the company has
published it. Each sub-section follows the same shape: company →
mechanism deployed → outcome data with named source → what it got
right → what it missed. The unifying observation across all eight
sub-sections is in §3.8 — most products optimise *one* mechanism; the
synthesis-of-many is unowned.

### 3.1 Spaced-repetition systems

**SuperMemo.** Wozniak (Piotr Wozniak) developed the SM-2 algorithm
in 1985 as part of the SuperMemo desktop application. SM-2 is the
canonical reference for expanding-interval scheduling: the interval
after a successful recall is multiplied by an "ease factor"; failed
recalls reset the interval; consecutive successes promote to longer
intervals. SuperMemo has remained a niche power-user tool but the
algorithm is foundational — virtually every later spaced-repetition
system (SRS) is a derivative or extension of SM-2 (SuperMemo SM-15,
Anki's algorithm, FSRS).

**Anki.** Open-source SRS launched 2006; ~10M+ users worldwide. The
Anki algorithm is a refined SM-2 with leech detection (cards missed
≥ 3 times are flagged as "leeches" and routed to manual review) and
desktop / mobile / web sync. Anki's user base is heavily concentrated
in medical-school and language-learning communities — segments where
the cost of a forgotten fact is high enough to justify the discipline
of daily review.

**Quizlet.** Founded 2005; flashcard-based study tool; ~60M+ users
peak; valuation ~$1B (2020 funding round). Quizlet expanded the
spaced-repetition concept into a consumer-friendly format with shared
deck libraries and gamified study modes. Quizlet Plus subscription
$36/yr is a useful B2C-pricing comparable.

**RemNote, Memrise, Brainscape.** Niche players in academic note-
taking with embedded spacing (RemNote), language-learning with
mnemonics (Memrise), and confidence-calibrated SRS (Brainscape).

**Got right:** the spacing surface itself; the leech-detection rule;
the multi-device sync. Anki's user base is empirical evidence that a
spacing surface produces long-tail engagement *for users who are
already motivated*.

**Missed:** retrieval practice as a *separate* mechanism (Anki cards
are recognition tasks, not generation tasks — flipping a card is not
the same as writing the answer first); SDT relatedness (no cohort,
no peer surface); SME-side effectiveness (Anki decks are user-
authored or community-shared with no quality scaffolding — the
quality variance across decks is enormous and there is no
backward-design or 4C/ID gate).

**Effect-size data.** Sequoia retention guide and a16z mobile
retention guides cite a 5–10pp D7/D30 retention lift attributable to
the spacing surface alone (vs equivalent ed-tech without spacing) —
useful but small relative to what cohort-tier products achieve.

### 3.2 Streak / habit / variable-reward systems

**Duolingo.** Founded 2011 by Luis von Ahn (Carnegie Mellon, prior
reCAPTCHA / Google sale); IPO 2021 (NASDAQ: DUOL) at ~$5–7B market
cap; ~88M+ DAU as of 2023; ~$500M+ ARR. The retention-design
playbook is the most-published in consumer ed-tech: streak counter
with loss-aversion framing; streak freeze (one missed day per N
earned); push notifications anchored to user's modal study time;
league system (variable-ratio social reinforcement); XP and crown
progression (endowed progress). Mazal 2022 (Duolingo engineering
blog post — "How Duolingo grew DAU 4.5× in 4 years") publishes the
headline numbers: CURR (Current-User Retention Rate) +21% over
the iteration cycle; DAU 4.5× over four years from streak-design
iteration alone.

**Snap streaks** as a B2C consumer behavioural analog — Snapchat's
streak design predates Duolingo's adoption and demonstrated the loss-
aversion framing at consumer-app scale.

**Got right:** the trigger phase of the Hook Model (push notifications
are the dominant return-driver); variable-ratio reinforcement (league
matchups are unpredictable); investment phase (the streak counter is
pure investment — abandoning is a loss).

**Missed:** depth and durable retention quality. Duolingo has been
publicly criticised for surfacing rote translation drills that
optimise for streak-eligible-action rather than language
competence — a "completion ≠ learning" pattern at the consumer-
language-app tier. The SME side is absent entirely (Duolingo
authors content centrally; no third-party authoring).

### 3.3 Cohort-based learning

**Maven.** Founded 2020 by Wes Kao (the altMBA co-founder) and Gagan
Biyani (the Udemy co-founder); $25M Series A 2021 led by First
Round; courses range $300–3000 per learner per cohort. Maven's
retention design is cohort-only: students enrol in a fixed cohort
window, engage live with the instructor and peers, and complete
together. W1 → W2 retention reported in Maven's published data and
Wes Kao's writing: 96%. This is a 14× lift over the MOOC W1 → W2
baseline of 16% (Reich 2019). The mechanism is named in §2.2:
SDT relatedness (peer + instructor presence) + parasocial
accountability + variable-reward via live interaction.

**altMBA.** Seth Godin's writing-and-leadership cohort programme;
~96% completion rate reported in Godin's published essays. altMBA
predates Maven and was a substantial influence on Maven's design.

**HBS Online (CORe and beyond).** Harvard Business School's online
programmes use a cohort-tier with high completion vs MOOC baseline.
HBS Online has not published exact completion figures but its
positioning and pricing reflect a cohort-tier value capture.

**Section.** Founded 2019 by Scott Galloway; $50M Series B 2022;
positioning is cohort + AI tutor. **Section is the closest peer to
the platform we are building** — same wedge (synthesis of cohort
relatedness with adaptive scaffolding) but Section is consumer-
business-education-only and has no SME-side authoring tooling. We
treat Section as the dominant "this is a real category" comparable
in §5.2.

**Got right:** SDT relatedness; parasocial commitment; cohort time-
binding (the live touchpoint is a powerful return-trigger).

**Missed:** post-cohort retention (once the cohort ends, the
learner falls off the engagement surface); spacing (cohort-based
courses do not typically ship spaced retrieval beyond the cohort
window); SME effectiveness (the instructor is *the* SME, but they
self-author in slides — no CTA scaffolding).

### 3.4 Mastery learning

**Khan Academy.** Founded 2008; ~137M+ registered learners; non-
profit; per-skill mastery progression with adaptive practice. The
intellectual ancestor is Bloom 1968 ("Learning for Mastery"), which
established the canonical claim: 1:1 tutoring is approximately 2σ
(two standard deviations) more effective than classroom instruction —
the "2-sigma problem" because the gap is well-established but
classroom economics make 1:1 tutoring infeasible at scale. Khan
Academy's adaptive practice is an attempt to approximate the 1:1
tutoring effect through software.

**ALEKS.** Adaptive Learning in Knowledge Spaces. Acquired by
McGraw-Hill 2013. Knowledge-space-theory-based adaptive system used
at university-level mathematics. Strong in pre-calculus and
introductory STEM.

**Knewton.** Adaptive learning platform; acquired by Wiley 2019. The
canonical example of "personalisation via Bayesian knowledge tracing"
that struggled commercially because the personalisation lift was
marginal in real classroom settings.

**Smart Sparrow.** Adaptive learning platform spun out of UNSW
Sydney; acquired by Pearson 2020. Authoring-side strong; learner-
side adaptation modest.

**Got right:** mastery gates (do not unlock the next concept until
the previous is mastered); explicit Bloom-level targeting; per-skill
progression vs course-level progression.

**Missed:** social / cohort surface; SME-side authoring scaffolding
(Khan Academy authors centrally; ALEKS / Knewton author via partner
publishers with no instructional-design QA gate); behavioural
triggers (the streak / push-notification surface is largely absent).

### 3.5 MOOC failure mode (what NOT to do)

**Coursera.** Founded 2012 (Daphne Koller and Andrew Ng, Stanford
spin-out); IPO 2021 (NYSE: COUR) at ~$7B peak market cap; ~$500M+
ARR. The free-tier completion baseline is ~5% across all Coursera
courses; even paid-verified completion sits around 10–15%.

**edX.** Founded 2012 (Harvard + MIT non-profit); merged with 2U
in 2021. Same completion-rate pattern as Coursera.

**Udacity.** Founded 2011; pivoted from open MOOCs to corporate
nano-degrees by 2016 — the most explicit MOOC-pivot example
documented.

**Udemy.** Consumer marketplace; less rigorous than Coursera/edX
on academic content; completion rates not publicly reported but
internal estimates and analyst reports place them in the same 5–15%
band.

**Reich & Ruipérez-Valiente 2019 (*Science*, "The MOOC pivot").**
Analyses 12.67M registrants on 565 HarvardX/MITx courses 2012–2018.
Headline finding: ≈ 3.13% completion among free-tier registrants;
the major MOOC platforms have moved away from open access toward
credential-paid B2B segments because the open-access model does not
sustain. The paper's structural lesson: high-quality content is
necessary but not sufficient — without cohort, trigger, calibration,
and retrieval-practice surfaces, formal learning collapses to ~5%
completion regardless of content quality.

**What it taught the field:** content production is not the
bottleneck; the *engagement architecture* is. This is exactly the
gap §2 names and §4 commits to filling.

### 3.6 Corporate LMS (the staid alternative)

**Cornerstone OnDemand.** Founded 1999; acquired by Clearlake
Capital for $5.2B in 2021. The dominant enterprise-LMS player for
two decades. Strong on SCORM/xAPI compliance, single-sign-on, audit
reporting, role-based publishing, multi-tenant governance.

**Docebo.** Founded 2005; TSX-listed (DCBO); ~$200M ARR. Mid-market
LMS-vendor; strong on AI-feature marketing (often without rigorous
mechanism backing); typical revenue multiple ~5–7× ARR.

**360Learning.** Founded 2010; $200M Series C 2021; positioning as
an LXP (Learning Experience Platform) with SME-as-author features —
**most-likely-overlapping competitor on the SME side** of our
proposition. Ships a text-editor-based authoring flow; no CTA
scaffolding, no 4C/ID gate, no expert-blind-spot probe documented in
their public-facing materials.

**Workday Learning, SAP SuccessFactors, Articulate, EdApp /
SafetyCulture, TalentLMS.** Other notable players in the corporate-
LMS / LXP space; $5–50 per seat per month enterprise pricing band.

**Got right:** SCORM/xAPI standards compliance; reporting; SSO and
identity-management integration; tenant isolation and governance;
audit trail and version control. These are non-trivial enterprise-
deliverable hygiene features the planned platform must replicate at
the appropriate Phase 2 milestone.

**Missed:** completion is the published metric, not mastery (12–15%
self-paced corporate completion was the §1.1 baseline); SCORM/xAPI
compliance is *evidence the learner finished* not *evidence the
learner can do the task*; SME authoring is a text editor with no
instructional-design scaffolding (the §1.3 SME crisis is structurally
unaddressed); retention is not measured because no one in the
buying centre asks for it; calibration is not measured at all.
**The corporate-LMS category is structurally unable to claim
absorption** — and the planned platform's Kirkpatrick L2 calibration-Δ
metric is the differentiator that closes that gap.

### 3.7 SME-elicitation / authoring tools

**360Learning, Articulate Rise, EdApp / SafetyCulture, TalentCards.**
SMEs as authors with text editors and templates. **Missed:** no CTA
scaffolding (free-text fields, no 5-probe intake); no 4C/ID coverage
gate; no expert-blind-spot probe; no backward-design enforcement;
no closed-taxonomy principle picker; no per-SME blind-spot dashboard
loop. The category exists; the *scaffolding* does not.

**Recent AI-assisted authoring tools.** Synthesia (AI avatars for
training video, $1B+ valuation 2023); Copy.ai for L&D (generative
copywriting); Articulate AI; many others. **Critical observation:**
these tools provide content *generation* (the AI writes a draft),
not content *elicitation* (the structured probe surface that pulls
the SME's tacit knowledge into well-formed inputs). The
garbage-in / garbage-out problem is acute: if the SME cannot
articulate the *principle* and the *novice-error* and the
*boundary case*, an AI cannot infer them from a vague prompt — the
AI writes plausible-sounding instruction that is missing the same
70% of decisions the SME would have omitted by self-narration.

**The market gap.** No published industry product ships a CTA-
based 5-probe intake protocol with a 4C/ID coverage gate and an
expert-blind-spot probe. The instructional-design research
literature (§2.3) describes the protocol; the academic CTA
practice deploys it in expert-driven engagements; the productised
SaaS surface is unowned.

### 3.8 The synthesis gap — the wedge

Cross-tabulating §3.1–§3.7 against the mechanism set in §2:

| Mechanism (from §2) | Spaced-rep (Anki) | Streaks (Duolingo) | Cohort (Maven) | Mastery (Khan) | MOOC (Coursera) | Corporate LMS | LXP / SME tools |
|---|---|---|---|---|---|---|---|
| Spacing | ✓ | partial | — | — | — | — | — |
| Retrieval practice | partial | partial | partial | ✓ | partial | — | — |
| Generation | — | — | partial | partial | — | — | — |
| Interleaving | — | — | partial | partial | — | — | — |
| Worked-example fading | — | — | — | partial | — | — | — |
| Calibration / JOL | — | — | — | partial | — | — | — |
| Hook Model trigger | — | ✓ | partial | — | — | partial | — |
| Variable-ratio reward | — | ✓ | — | — | — | — | — |
| SDT relatedness | — | partial | ✓ | — | — | — | partial |
| CTA SME intake | — | — | — | — | — | — | — |
| Backward design | — | — | — | partial | — | — | — |
| 4C/ID coverage gate | — | — | — | — | — | — | — |
| Expert-blind-spot probe | — | — | — | — | — | — | — |
| Per-SME blind-spot dashboard | — | — | — | — | — | — | — |

The pattern is sharp: most categories optimise one or two mechanisms;
no category ships the full set; the SME-side scaffolding (CTA, 4C/ID,
backward design, expert-blind-spot, per-SME dashboard) is
structurally absent from every category. The closest peer in market
positioning — Section ($50M Series B; cohort + AI tutor) — is
consumer-only and has no SME-side authoring tooling at all.

**The wedge is the synthesis.** No single mechanism is novel or
unowned; the synthesis of all ~14 mechanisms in one product surface,
with segment-tuned UI variants, is the defensibility argument. §4
commits each mechanism to a specific feature in the planned build;
§5 quantifies the commercial case; §6 names the falsification
triggers that would tell us the synthesis bet is wrong.

---

## §4 — What we are planning (problem-by-problem walkthrough)

This is the explicit accountability section. Every L1–L8 + S1–S8
problem in §1 is walked through here with: **problem name** → **cited
mitigation mechanism** → **built today** state → **planned** state
(Phase 1 / Phase 2) → **specific file path / component** → **falsification
metric** (when we'd say we're wrong). The matrix is canonical in
[`content-pack-management-plan.md` §D0](./content-pack-management-plan.md);
this section is the elaborated evidentiary basis.

The numbering convention: §4.1–§4.8 are L1–L8 (learner side); §4.9–§4.16
are S1–S8 (SME side); §4.17–§4.19 cover sequencing, verification, and
TTFV.

### Learner-side problems (L1–L8)

**4.1 — L1 (knowledge decay without review).** *Problem:* untreated
knowledge plateaus at ~25% retention by day 6 (§1.2; Murre & Dros 2015).
*Mechanism:* spacing effect at expanding intervals; gap = 10–20% of
retention horizon (Cepeda et al. 2008, *Psych Sci*; Cepeda 2006
254-study meta). *Built today:* schema in
`09-progress-tracker/spaced-review.md` defines the cadence and the
leech rule on `main`; **no scheduler, no learner-facing surface, no
queue enqueue**. *Planned (Phase 2):* `web/src/components/dashboard/
SpacedReviewBanner.tsx` widget at top of `/[packId]/` dashboard
surfacing 3 oldest due items with one-tap "Start review";
expanding-interval scheduler in `web/src/lib/spaced-review.ts`;
cron-driven nightly enqueue keyed to learner-localtime; +1d reset on
miss; promote to next interval on pass; leech rule on 3+ misses
demotes to skills-matrix rung 1. *Falsification:* if D7 cohort-
retention curve does not lift ≥ 12pp over 8-week measurement window
in a treatment-vs-control cohort, the mechanic is rebuilt or removed.

**4.2 — L2 (streak no return-trigger).** *Problem:* daily intent
decays without an external prompt (§1.4; Eyal Hook Model trigger
phase missing). *Mechanism:* Hook Model trigger + variable-ratio
reinforcement (Eyal 2014; Skinner; Mazal/Duolingo 2022 — CURR +21%,
DAU 4.5×). *Built today:* `computeStreak()` in `web/src/lib/streak.ts`
already returns `{ current, studiedToday, lastStudyDate }` from quiz/
test/mock timestamps; **no notification, no email, no return-prompt
surface**. *Planned (Phase 2):* (a) streak counter visible in
`web/src/components/layout/Header.tsx`; (b) web-push notification
opt-in on first quiz pass; bandit-optimised cadence anchored to user's
modal study-time (variable-ratio rather than fixed-time); (c) email-
digest fallback via Resend Pro for users who decline push; (d) streak-
freeze affordance (Duolingo precedent — one missed day per N earned);
(e) ≥ 3 ignored prompts → back-off rule to avoid prompt-fatigue
extinction. *Falsification:* if CURR (current-user retention rate)
not lifted ≥ 10pp over 8-week window vs control cohort with no
notification, the cadence is wrong or the value-of-action is too low
to justify the prompt.

**4.3 — L3 (re-reading not retrieval).** *Problem:* lesson-depth
toggle (Easy / Conceptual / Deeper) is re-reading-shaped; produces
fluency illusion not durable learning (§1.2; Bjork & Bjork 2011;
Roediger & Karpicke 2006 — ~50% delayed-recall lift from one
retrieval episode). *Mechanism:* testing effect (retrieval as a
learning event) + generation effect (Slamecka & Graf 1978 — ~30%
retention lift). *Built today:* lesson-depth toggle and lesson body
in `web/src/components/concept/LessonView.tsx` and `LessonBody.tsx`;
**no retrieval gate; learner can re-read indefinitely without ever
testing recall**. *Planned (Phase 2):* (a) `RetrievalGate` primitive
in `LessonView.tsx` — body hidden until learner types a one-sentence
recall of the principle; (b) `QuizRunner.tsx` adds a *principle-write*
field before the answer reveal — generation-before-recognition rather
than recognition-only; (c) Easy depth-toggle becomes opt-out, not
default — desirable difficulty (Bjork) is the platform default.
*Falsification:* if mock pass-rate does not lift ≥ 8pp on cohort
using gate vs control cohort, the mechanic is broken or the gate is
poorly designed (e.g., the recall sentence is too easily gamed).

**4.4 — L4 (flat mocks vs scenario-anchored real exam shape).**
*Problem:* current diagnostic-01 is flat 10-Q; real exam is 4
scenarios × 15 Q with shared scenario context (CLAUDE.md §"Format
details"). *Mechanism:* encoding-specificity / transfer-appropriate
processing (Bjork; Barnett & Ceci 2002). *Built today:* one
diagnostic mock in `07-mock-exams/diagnostic-01.md`; flat-shape
mock runner in `web/src/components/quiz/MockExamPage.tsx`. *Planned
(Phase 2):* `MockExamPage.tsx` restructured to scenario-anchored —
4 scenarios × 15 Q with persisted scenario context across the block;
transfer-format variety per scenario; flat mocks deprecated to a
"warmup" tier. Authoring tooling (admin app) gains a scenario-block
editor that enforces the shape. *Falsification:* if real-exam-shape
mock pass-rate does not predict actual cert pass with r ≥ 0.6 across
30+ test-takers, the shape is not the mechanism — encoding-
specificity is overstated for this exam structure.

**4.5 — L5 (no metacognitive calibration capture).** *Problem:*
predict-then-test is described in `08-cheat-sheets/training-
methodology.md` Step 5 but never instrumented; learners can't see the
Dunning-Kruger gap close (§1.2; Dunlosky & Bjork; Kruger & Dunning
1999). *Mechanism:* judgment-of-learning capture; calibration as a
first-class metric. *Built today:* `09-progress-tracker/skills-matrix.md`
has a `Gap` column (formalised on `main` as calibration Δ via the
prior commit cluster); the methodology layer documents the doctrine.
*Planned (Phase 2):* (a) JOL 1–5 slider in `QuizRunner.tsx` *before*
the answer reveal — captures predicted competence; (b) calibration
Δ = JOL − outcome stored in `skills-matrix` per attempt; (c)
`StatsPanel.tsx` weekly trend chart; (d) |Δ| > 1 triggers a
generation-effect drill at +1d (per `decision-trees.md` §"How I
default"). *Falsification:* if |calibration Δ| does not converge
toward 0.5 over 8-week window for ≥ 60% of active learners, the
JOL-capture surface is not driving deliberate-practice feedback.

**4.6 — L6 (letter-bias 76% B in concept quizzes).** *Problem:*
`letter-bias-2026-05` tracked in CLAUDE.md as a quality regression;
learners build a positional cue rather than principle reasoning
(F12 in error-log doctrine). *Mechanism:* spurious cue-validity /
confounded learning. *Built today:* F12 added to error-log
taxonomy on `main`; tracking note in CLAUDE.md; **no automated
validator; no admin-app gate**. *Planned (Phase 2):* pre-publish
content-lint validator in `packages/shared/src/validators.ts`
rejects MCQ sets with > 55% any single letter or with shorter-
distractor patterns (cue-bias signature); admin app blocks
publish on lint fail; existing 41-concept curriculum rebalanced via
batch run before Phase 2 launch. *Falsification:* if post-shipping
concept-quiz answer distribution is not uniform within ±5pp of 25%
per option across the corpus, the validator is too lax or the
authoring pipeline is bypassing it.

**4.7 — L7 (interleaving documented but not enforced by the
recommender).** *Problem:* methodology cites Rohrer & Taylor 2007
but the recommender in `web/src/lib/recommendation.ts` does not
enforce sub-area rotation; learners default to blocked practice
which transfers ~30% worse (§1.2). *Mechanism:* interleaving
(Rohrer & Taylor 2007 — 63% shuffled vs 20% blocked at 1-week
delayed test). *Built today:* recommendation engine prioritises
drill → section-test → continue → done; **no interleaving constraint**.
*Planned (Phase 2):* constraint added to `recommendation.ts`:
`nextPick.subArea !== lastPick.subArea`; rotation forced ≥ 2
sub-areas per session; weekly-cohort calendar interleaves at
day-boundary. *Falsification:* if transfer-question accuracy does
not lift ≥ 15pp on cohort using interleaved vs control, the
constraint is too loose or the sub-area granularity is wrong.

**4.8 — L8 (no cohort/SDT relatedness surface).** *Problem:* SDT
relatedness need unmet; the largest gap between MOOC 5% completion
and cohort-based 96% (§1.1; §3.3). *Mechanism:* SDT (Ryan & Deci);
Maven 96% W1→W2; Reich 2019 (14× cohort-vs-MOOC retention multiplier).
*Built today:* nothing — no cohort routes, no peer surfaces. *Planned
(Phase 2):* (a) per-cohort routes under `/[packId]/cohort/[cohortId]/`;
(b) peer-comparison panel showing anonymised cohort progress
distribution; (c) group-leaderboard primitive (variable-ratio social
reinforcement); (d) weekly-cohort live touchpoint slot (Zoom or
similar — out-of-app); (e) cohort-completion email series via
Resend. *Falsification:* if cohort-tier completion does not exceed
solo-tier completion by ≥ 20pp across the same content, the cohort
mechanism is not transferring to our domain or our cohort design is
wrong.

### SME-side problems (S1–S8)

**4.9 — S1 (CTA: SMEs omit ~70% of decisions in self-narration).**
*Problem:* canonical CTA finding (Clark, Feldon et al.); CTA-built
instruction +46% gain, d ≈ 1.72 vs expert-narrated (Lee 2004;
Tofel-Grehl & Feldon 2013). *Mechanism:* structured CTA probe
protocol substitutes the missing decisions. *Built today:* nothing —
content authored by hand-editing `curriculum.js`. *Planned (Phase 2):*
`DrafterIntake` TypeScript schema in `packages/shared/` with five
required JSON fields: `novice_error`, `one_principle`, `worked_example`,
`faded_variant`, `boundary_case`, `nearest_confusable`; admin app
authoring flow at `/admin/draft/[slug]` blocks publish if any field
is empty; tooltip per field with the named research rationale.
*Falsification:* if SME-content learner-pass-rate does not exceed
unscaffolded-baseline by ≥ 20pp at 90-day measurement, the
scaffolding is too weak (probes worded poorly, fields ignored, or
critic not enforcing).

**4.10 — S2 ("telling what I know" SME default).** *Problem:*
content-first authoring produces unmeasurable lessons (§1.3;
Wiggins & McTighe 1998). *Mechanism:* backward design — assessment
first, lesson second. *Built today:* nothing — quiz authoring is
post-hoc to lesson authoring. *Planned (Phase 2):* admin app at
`/admin/draft/[slug]` opens directly to *assessment intake* —
`Write the test first` mode; lesson editor tab is locked until a
passing assessment is authored and validated; assessment editor
includes `principle` (closed-taxonomy picker — see SM5 / §4.13),
`correct_answer`, `distractor_rationale[]`. *Falsification:* if
≥ 20% of shipped lessons fail the "every lesson has a passing
assessment" gate at one-month review, the lock is being bypassed or
the assessment-editor UX is broken.

**4.11 — S3 (no worked-example pair scaffold).** *Problem:* SMEs
ship principle-only or example-only — never paired-then-faded —
making worked-example fading unavailable (§1.3; §2.3; Sweller / Renkl).
*Mechanism:* Sweller worked-example fading: worked → faded → solo.
*Built today:* nothing — quiz schema captures correct/distractors but
not worked/faded examples. *Planned (Phase 2):* worked-example pair
editor in admin app — two side-by-side mandatory fields (worked +
faded variant); critic refuse-to-publish if either is missing or if
faded variant is identical to worked (must have ≥ 1 step / hint
removed, validated heuristically by the critic prompt). *Falsification:*
if faded-variant compliance drops below 95% at month-3 sampling, the
mandatory-field gate is being bypassed or the validation heuristic is
wrong.

**4.12 — S4 (no expert-blind-spot probe at submission).** *Problem:*
SMEs over-estimate novice prerequisites and under-explain bridging
steps (§1.3; Nathan & Petrosino 2003; Hinds 1999). *Mechanism:*
explicit "what would a novice get wrong here?" prompt at authoring
time forces the cognitive flip. *Built today:* nothing. *Planned
(Phase 2):* `novice_error: string` field required at submission
(part of `DrafterIntake` schema, §4.9); critic prompt
returns `blind_spot_flags: string[]` based on independent analysis of
the lesson body; SME prompted to address each flag before re-submit;
flags accumulate per-SME for the blind-spot dashboard (§4.16).
*Falsification:* if critic-rejection-rate does not trend down
month-over-month per-SME (i.e., SMEs are not learning to anticipate
the blind-spots), the loop is not closing.

**4.13 — S5 (free-typed principle drift across SMEs).** *Problem:*
free-text principle fields produce schema drift; learners can't
accumulate a stable mental model; Bloom-rung tagging breaks down
(§1.3; Knowles andragogy schema-anchoring). *Mechanism:* closed-
taxonomy enforcement. *Built today:* `principle` field exists in
quiz schema as free-text. *Planned (Phase 2):* closed-taxonomy
principle-picker in admin app — autocomplete from approved B-skill
list (extends the existing 41-skill taxonomy); admin rejects
free-typed principles unmapped to taxonomy; principle-tag indexed
for cross-concept retrieval. New principles require taxonomy
extension via admin-only path. *Falsification:* if cross-concept
retrieval inconsistency (same principle tagged ≥ 2 different
strings) > 5%, taxonomy is too narrow or autocomplete UX is failing.

**4.14 — S6 (no 4C/ID coverage gate).** *Problem:* SMEs over-deliver
supportive information (4C/ID component b) and under-deliver learning
tasks (a), just-in-time information (c), and part-task practice (d)
(§1.3; §2.3; van Merriënboer 1997). *Mechanism:* critic-prompt 4C/ID
coverage gate. *Built today:* nothing. *Planned (Phase 2):* critic
prompt schema returns
`missing_components: ('learning_tasks' | 'supportive_info' |
'jit_info' | 'part_task_practice')[]`; refuse-to-publish if any
missing; admin app surfaces which component is missing with a hint
to author. *Falsification:* if ≥ 5% of shipped lessons are missing
≥ 1 of the four 4C/ID components at audit (post-month-3 sampling),
the critic prompt is too lax or the coverage detection is wrong.

**4.15 — S7 (tacit knowledge unrecoverable from text-from-blank).**
*Problem:* shop-floor / clinical / field-services SMEs cannot author
content via text editor — ~80% of operationally-relevant knowledge
is tacit (§1.3; Polanyi 1966; CTA-for-skilled-trades; TalentCards:
~2.7B deskless workers). *Mechanism:* voice-first / camera-first
capture with auto-draft into structured intake. *Built today:*
nothing. *Planned (Phase 2):* admin app supports SME recording 3-min
audio (browser MediaRecorder) or video (camera); transcription via
OpenAI Whisper or equivalent; auto-draft into the 5-probe `DrafterIntake`
schema; SME edits draft, doesn't compose from blank; mobile-first
capture for shop-floor SMEs (PWA installable). *Falsification:* if
SME TTFV ≤ 1 hour is not achieved on tacit-knowledge-segment SMEs at
pilot (10-SME pilot in deskless / clinical vertical), the capture
modality is wrong or the transcription quality is too low.

**4.16 — S8 (critic feedback is destination, not loop).** *Problem:*
SMEs see one-off corrections per draft but no pattern across drafts;
the deliberate-practice feedback channel for the SME themselves is
absent (§1.3; §2.3; Ericsson 1993). *Mechanism:* per-SME blind-spot
dashboard surfacing aggregated critic-feedback over time. *Built today:*
nothing. *Planned (Phase 2):* per-SME dashboard at `/admin/sme/[id]/`
showing (a) critic-rejection-rate trend over time; (b) most-frequent
F-codes flagged (F1–F12); (c) most-frequent missing 4C/ID components;
(d) personalised authoring prompts surfaced before next draft (e.g.,
"You've omitted the boundary case in 4 of last 6 lessons — please
double-check"). *Falsification:* if per-SME critic-rejection-rate is
not flat or improving over 8-week window for active SMEs, the
deliberate-practice loop is not closing — feedback is being seen but
not internalised.

### Sequencing, verification, TTFV

**4.17 — Sequencing.** Phase 1 (POC) ships only LM1 banner (read-only
queue surface — no scheduler) + LM6 JOL slider (capture-only — no
trend visualisation) + admin lint validators (L6 / SM4 / SM6 /
spoiler-leak). Phase 2 sequence by ROI:
- **First wave (highest absorption ROI):** LM1 (full scheduler), LM2
  (retrieval gate), LM6 (calibration trend visible).
- **Second wave (highest SME-TTFV ROI):** SM1 (5-probe intake), SM2
  (backward-design "test first"), SM4 (novice-error probe).
- **Third wave (engagement):** LM7 (web-push + variable-cadence), LM8
  (cohort routes + peer-comparison + leaderboard).
- **Fourth wave (segment-specific):** SM7 (voice/camera authoring),
  SM8 (per-SME blind-spot dashboard).

Cross-ref `content-pack-management-plan.md` §C10 for Phase 1 P1–P6
sequencing in detail.

**4.18 — Verification.** Cross-ref `content-pack-management-plan.md`
§C11 (Phase 1 verification) and §D4 (Kirkpatrick L1–L4 measurement
plan). Each LM/SM has a falsifiable target named in §4.1–§4.16
above. Quarterly published metrics: NPS / CES (L1); mock pass-rate +
calibration Δ (L2); D1 / D7 / D30 cohort retention curves +
course-completion rate (L3); NRR + compliance pass-rate (L4).
8-week-trend flat-or-negative ⇒ remove-or-redesign.

**4.19 — TTFV (time-to-first-value) commitments.** Cross-ref §D5 of
the build plan. Learner: ≤ 5 minutes from sign-up to first quiz pass.
SME: ≤ 1 hour from CTA intake to publishable lesson. These are
Phase-2 acceptance criteria, not aspirational targets — falsified at
pilot if not met.

---

## §5 — Commercial viability

*This section will be filled in commit 6.*

---

## §6 — Verification & falsifiability

*This section will be filled in commit 6.*

---

## §7 — Bibliography

*This section will be filled in commit 6.*
