# Business Viability — Research Notes (raw subagent findings)

> **What this is.** The raw, line-cited ammunition produced by the five
> subagents that contributed to `business-viability-negative-study.md`.
> Preserved here as evidence of record. The negative study integrated and
> condensed these findings; this doc keeps the underlying quotes and line
> numbers intact in case any specific claim needs to be re-verified or cited.
>
> **Provenance.** Five parallel subagent runs on 2026-05-04, plus one web-
> research pass. Subagents read documents the operator authored; the market
> researcher pulled 2026 external data from Tracxn, TechCrunch, Pavilion,
> Mordor Intelligence, HolonIQ, Synthesia, Anthropic, Google, and others.
>
> **Status.** Reference material. Do not edit the quoted findings;
> annotations or follow-ups belong in `business-viability-negative-study.md`
> or `business-viability-mitigation-plan.md`.

---

## Table of contents

1. Subagent A — research dossier critique
2. Subagent B — implementation + content-pack-management critique
3. Subagent C — expert-review-audit critique
4. Subagent D — collaborator-deck critique
5. Subagent E — 2026 market & competitor research

---

## 1. Subagent A — research dossier critique

**Source.** `research-and-strategy-dossier.md` (1,722 lines). Citations
below use `dossier:LINE`.

### A.1 TAM/SAM/SOM is top-down fantasy math (§5.1, lines 1249–1289)

- **TAM bait-and-switch.** Quotes "$315B global e-learning" (Mordor,
  line 1252) and "$399B corporate training" (line 1257) as if additive
  — they overlap massively. Then jumps to a **$20–40B SAM** (line
  1276) with **zero bottom-up derivation**; the word "defensible" is
  doing all the work. Textbook **percentage-of-a-huge-number fallacy**.
- **SOM is arithmetic, not strategy.** Lines 1280–1285: "1,000 B2B SMB
  tenants × $5k blended ACV ≈ $5M ARR by Y3." No funnel logic: no
  leads, no win-rate, no sales-cycle, no churn. A solo operator
  landing 1,000 paying SMB tenants in 36 months = **~1 new tenant per
  workday for 3 years straight** — implausible without a sales team.
- **Cohort-based TAM cited as "no single authoritative source ...
  pieced together"** (line 1267). Translation: made up.

### A.2 Maven 96% is apples-to-oranges (dossier §1.1 line 153, §3.3 lines 731–738, §4.8 line 1075)

- Maven's 96% W1→W2 is on **$300–$3,000 paid live-cohort programs**
  with synchronous instructor + peer accountability. Dossier admits
  this pricing on line 1322: "Maven $300–3000 / cohort; altMBA $4500
  / 4-week."
- The dossier proposes **$9.99/mo B2C** (line 1321) and projects
  *"≥ 20pp cohort-vs-solo lift"* (line 1085) on this pricing tier —
  borrowing the engagement-architecture lift while stripping out the
  price signal, the live human, and the small-group accountability
  that produce it. **A $9 self-serve subscriber is not a Maven cohort
  participant.**
- Line 1077: *"14× lift over MOOC 16% W1→W2 baseline"* — multiplier
  applied implicitly to the $9/mo plan. Causally invalid.

### A.3 Unit economics omit every meaningful cost (§5.4, lines 1337–1391)

- **Founder labor priced at zero.** Line 1391: *"CAC is operator-
  time-only in Phase 1."* Operator time is THE constraining resource.
- **Sales cost erased.** Line 1387: *"B2B target: 6–12 month payback"*
  with **no SDR, no demo cost, no field sales, no implementation
  services**. Enterprise LMS deals at **$50k–$1M ACV** (line 1325) do
  not close on operator outbound + warm intros.
- **CAC literally absent.** No CAC number appears anywhere in §5.4 —
  only "payback" period asserted.
- **LTV asserted, not derived.** Line 1380: *"B2C: 12–18 months"* — no
  churn rate, no ARPU walk, no cohort data. At $9.99/mo × 15mo =
  **$150 LTV** before refunds.
- **Anthropic API cost concentration.** Line 1429–1434: a 30–60%
  cache savings assumption is the linchpin; if caching drops to 0%,
  AI line **3× from $300 to $700–1,000/mo** at just 100 tenants.

### A.4 NRR claims contradict consumer churn (§5.5, lines 1393–1410)

- *"Year 1: ≥ 110%"* (line 1399) and *"Year 2: ≥ 120%"* (line 1402)
  for a product whose lead segment is **$9.99/mo B2C** (line 1321).
  B2C consumer subscriptions sit at **70–90% NRR** because there's
  nothing to expand into.
- Line 1407–1410: *"expansion-revenue mechanic"* is *"compliance
  pass-rate / audit-finding deltas"* — an unproven causal claim.

### A.5 GTM contradiction — solo operator attacking 5+ segments

- Line 82–84 commits to **B2C exam-prep + B2B SMB compliance +
  deskless mobile + high-PDI enterprise + founder-led SMB succession**
  simultaneously. 5 distinct ICPs with 5 distinct messaging stacks.
- Line 1325: *"B2B Compliance vertical $100k–$1M ACV"* — these are
  9–18 month enterprise sales cycles. **Solo founders do not close
  $1M ACV deals.**

### A.6 SOC2 chicken-and-egg

- Line 1288: *"the mid path requires SOC2 (deferred to year-2 per §B4
  risk 5)."*
- Line 1470: *"Enterprise-heavy ... Requires SOC2 (year-2)."*
- §5.1 already counts enterprise revenue in the SOM. **You cannot
  book $50–500k ACV enterprise tenants (line 1324) without SOC2 Type
  II in hand at deal close.**

### A.7 Vendor lock-in claimed as portable (§5.6 lines 1414–1428)

- Line 1417: *"Vercel ToS at scale is a known risk; mitigation is
  bring-your-own-infra escape hatch (Cloudflare Pages, Fly.io, or
  self-host on AWS)."* This **is not a mitigation** — it's a 6–12
  week migration project.
- Line 1428: *"Cloudflare R2: egress free — this is the strategic
  moat"* — egress-free is R2's pricing today, not a moat the platform
  owns.

### A.8 Pedagogical research → product feature leap

- Cepeda 2008 (line 376–384), Roediger & Karpicke 2006 (line
  184–187), Rohrer & Taylor 2007 (line 197–203) all measured students
  who **had to** participate. The dossier asserts these effect sizes
  will transfer to **voluntary self-serve users at $9/mo who can
  ignore the spaced-review banner** (line 962).
- Line 1499–1503: *"D7 ≥ 40%, D30 ≥ 35% on cohort tier"* against
  industry par of 14% D30 — **3× best-in-class** asserted with no
  pilot data.

### A.9 Phase 1 in 18 working days is fantasy (§5.7 line 1458)

- Line 1458: *"Phase 2 (Commercial) build cost. ~18 working days
  operator-time."* For a product with: spaced-review scheduler,
  retrieval gates, JOL slider with trend viz, scenario-anchored mock
  runner, 5-probe CTA intake, backward-design lock, worked-example
  pair editor, expert-blind-spot probe, closed-taxonomy picker, 4C/
  ID critic, voice/camera authoring with Whisper, per-SME blind-spot
  dashboard, cohort routes, peer-comparison, leaderboard, web push
  with bandit-optimised cadence, email digests, Stripe billing,
  multi-tenant auth, audit trail, SCORM/xAPI hygiene (§3.6 line 856),
  admin app. **18 days = ~144 hours.**

### A.10 The fundamental contradiction (§3.7 lines 882–898)

- Line 884–892 explicitly attacks Synthesia, Articulate AI, Copy.ai
  for *"content generation (the AI writes a draft), not content
  elicitation"* and warns *"AI writes plausible-sounding instruction
  that is missing the same 70% of decisions the SME would have
  omitted by self-narration."*
- Then §4.9 line 1095, §4.15 line 1183: the platform's own SME flow
  uses **Sonnet drafter + Opus critic** to auto-draft from voice
  transcription. **Same tooling, same failure mode** — wrapped in a
  5-field schema and a critic prompt.

### A.11 "0.05% = $25M ARR" framing

The dossier supports $5–7M ARR by Y4 (line 1280–1285) under named
scenarios — but uses **TAM-as-denominator share-of-market reasoning**
(line 1276 "$20–40B SAM"). 0.05% of $50B = $25M, but no causal pathway
is named. Canonical *"if we just get 1% of China"* fallacy.

### A.12 Falsifiability theatre (§6 lines 1485–1540)

The "falsification triggers" (table line 1513) all require **8-week
trends with treatment-vs-control cohorts** (line 968, 988, 1007,
etc.). A solo operator at pre-revenue stage will have **N too small
for any of these to fire**. The framework is falsificationist in
form, not in practice.

### A.13 Strongest single attack vector

The plan books enterprise revenue ($50k–$1M ACV, line 1324–1325) into
Year 3 SOM (line 1280–1285) while simultaneously deferring SOC2 to
Year 2 (lines 1288, 1470) and pricing CAC at $0 (line 1391). **Three
independent claims that cannot all be true.** Pick any two and the
third collapses.

