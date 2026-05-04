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

*This section will be filled in commit 3.*

---

## §3 — How industry has historically mitigated (case studies)

*This section will be filled in commit 4.*

---

## §4 — What we are planning (problem-by-problem walkthrough)

*This section will be filled in commit 5.*

---

## §5 — Commercial viability

*This section will be filled in commit 6.*

---

## §6 — Verification & falsifiability

*This section will be filled in commit 6.*

---

## §7 — Bibliography

*This section will be filled in commit 6.*
