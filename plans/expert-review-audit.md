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

*§A, §B, §C, §D, §E, §F, §G filled in subsequent commits per the
plan in `/root/.claude/plans/`. Each is gated by the verification
checks listed in that plan.*