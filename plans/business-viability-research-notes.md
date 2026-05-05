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

---

## 2. Subagent B — implementation + content-pack-management critique

**Sources.** `IMPLEMENTATION.md` (~132KB) and
`content-pack-management-plan.md` (~76KB).

### B.1 The 18-day Phase 1 timeline is fiction

Per `IMPLEMENTATION.md` lines 1003 and 491–499, six sub-phases
compress a multi-tenant SaaS into 18 working days.

- **P1 ("~3 days"):** monorepo + Drizzle schema + Clerk org/user/
  tenant onboarding + R2 client + RLS policies on every tenant-
  scoped table + RLS isolation test + ESLint custom rule that flags
  un-wrapped tenant queries + Vercel project setup. **Multi-tenant
  RLS correctness alone is a 1–2 week engagement when done properly;
  testing it adversarially is its own week.**
- **P3 ("~4 days"):** server-component learner app, MCQ/TF/FillIn
  quiz runner, tsvector search with weighted indexes, mobile
  Lighthouse ≥90 with bundle ≤220kB gzipped (line 1294),
  accessibility AA, **plus** Section D extensions (lines 1324–1378):
  RetrievalGate, PrincipleWrite with Levenshtein similarity, JOL
  slider with calibration delta, mastery-gated 4th depth rung,
  calibration sparkline. **3 weeks of UI work, not 4 days.**
- **P4 ("~4 days"):** an entire admin app — catalog CRUD, version
  history with rollback, JSON paste import with side-by-side diff
  viewer, lint heatmap, suggestion triage with TF-IDF dedup,
  knowledge upload with PDF/DOCX text extraction (`unpdf` +
  `mammoth`), tenant policy editor, **plus** Section D scaffolds
  10–14 (lines 1518–1576). **Two months of work.**
- **P5 ("~2 days"):** Claude Code skill + lint script + a seed
  script that imports `cca-f-prep` to Postgres+R2 (the skill is
  supposed to iterate on validator failures up to 3 times, line
  1619). The CLAUDE.md proves the operator hasn't even authored the
  cca-f-prep content fully (38 concepts auto-generated with B-bias).
- **P6 ("~2 days"):** axe-core sweep, Lighthouse CI, k6 load test,
  adversarial RLS test, status page, Sentry monitors. **WCAG 2.1 AA
  compliance across 8 surfaces (line 1753) takes weeks of
  remediation, not 2 days.**

**Realistic Phase 1: 3–5 months for one person.**

### B.2 Hidden ongoing operator labour at "100 tenants, 10k MAU"

The plan says **30 min/day authoring** (line 2552) and **2 hours/week
business loop** (line 2564).

- Support tickets: ~3–5% of MAU/month opens a ticket. 10k MAU =
  300–500 tickets/month, ~15–25/business-day. At 5 min triage each =
  **2 hours/day**.
- Content authoring backlog: line 2557 says *"wait ~3 minutes for the
  skill to draft + auto-validate."* But B2B tenants are human-
  required (line 2057); 100 tenants × ~2–3 drafts/day = **200–300
  drafts** the operator must approve (line 425 hand-waves "10 min/
  day per tenant" — that's 16+ hours/day across 100 tenants).
- SSO debugging (Clerk Enterprise SAML), SCIM provisioning failures,
  billing disputes, Resend domain reputation, R2 quota alerts,
  security patching across pnpm workspace + Astro + Next.js +
  Drizzle migrations.
- On-call: line 2582 *"Triage within 24h"* — single human, no
  rotation. Single point of human failure.

**Realistic load: 60–80 hours/week minimum**, before sales work.

### B.3 Free-tier limits the plan handwaves

- **Vercel Hobby ToS forbids commercial use.** Plan acknowledges
  this (line 95, line 174, line 2691) but designs the business to
  launch *on* Hobby and *"flip to Pro at first paying customer."*
  That means Phase 1 traffic from B2B prospects — being demoed for
  purchase — *is already a ToS breach* the moment you charge anyone.
  C12 row 3 (line 546) admits Hobby was wrong "indefinitely" but
  still uses it day-1.
- **Neon free 0.5 GB** (line 137). 10k MAU × event/progress/
  calibration_event/retrieval_event/spaced_review_item rows = blow
  through 0.5 GB inside weeks.
- **Clerk free 10k MAU.** Line 138 says *"Free 10k MAU"* but C12 row
  17 (line 560) admits Clerk Organizations has a ~100 free org cap.
  100 B2B tenants = at the cap on day one of Phase 2.
- **PostHog free 1M events/month.** Line 559: *"Per-keystroke events
  blow this fast."* Phase 2 adds calibration_event, retrieval_event,
  cohort events, spaced_review_enqueued, push outcomes, NPS/CES
  surveys.
- **Sentry 5k events.** A single bad release at 10k MAU exhausts
  this in minutes.
- **Resend 3k emails.** Cohort-completion email cron (line 2353)
  sends to every cohort member 7 days post-end. 100 tenants × 50
  learners = 5k emails in one cron run.

### B.4 Architectural fragility

- Single Vercel region, no multi-region failover.
- Single Neon instance, no read replicas, no PITR strategy named.
- Single R2 bucket; no cross-region replication.
- No incident response on-call rotation; the 7.3 playbook (line
  2572) is one human.
- No DR plan. *"Migration off vendors"* (line 2606) lists 5–10 day
  ETAs to leave Clerk/Inngest/Anthropic/Vercel/R2 — *none pre-built*.
- No status page beyond `/api/health` (line 1771).
- Anthropic is single-vendor for both drafter (Sonnet) and critic
  (Opus) — line 2073 explicitly defers cross-vendor critic to "v2
  escape hatch."

### B.5 Phase 2 cost estimate — actual math

Plan claims **~$200 Sonnet + ~$100 Opus = $300/mo for AI** at "100
tenants × 10k MAU × 50k generations/mo" (lines 93–94).

| Line | Tokens × rate | Monthly cost |
|---|---|---|
| Sonnet input  | 50k × 2k tok × $3/MTok | $300 |
| Sonnet output | 50k × 3k tok × $15/MTok | $2,250 |
| Opus input (with knowledge-file context) | 50k × 5k × $15/MTok | $3,750 |
| Opus output | 50k × 1k × $75/MTok | $3,750 |
| **Sub-total** | | **$10,050/mo** |
| With 50% optimistic prompt caching | | ~$5–6k/mo |
| With realistic 0–30% caching at sporadic traffic | | **~$8–10k/mo** |

**The "gross margin > 95%" claim (line 65) is fantasy.**

### B.6 "Phase 1 carries over without rewrites" claim

False. Concrete forced rewrites:

- Vercel Hobby → Pro: project re-import, env migration, build budget
  changes.
- Neon free → Scale: connection pooling changes (HTTP driver vs
  pooled), reads on replicas, query plans differ.
- Clerk free → Pro+Enterprise: org model fundamentally changes;
  existing personal-tenant rows (line 1049) don't map cleanly to
  enterprise SAML/SCIM.
- Adding Inngest where Phase 1 had no queue means refactoring every
  draft path to be event-driven.
- Adding pgvector + HNSW indexes (line 2315) requires rebuilding all
  dedup paths.
- token_usage, subscription, calibration_rule, embedding tables —
  all introduce new RLS surfaces requiring re-audit of every query.

### B.7 Quality-validator coverage gaps

- **F1 letter-bias validator** (line 414) is the *operator's own
  miss*. CLAUDE.md admits 76% B-bias in their own auto-generated
  quizzes. The detector runs three places (line 407) and still
  didn't fire.
- F5 *"fabricatedRuleDetector"* detects phrasing patterns ("exceeds
  N tools", line 418). LLMs trivially route around regex by
  paraphrasing.
- F12 *"cue-bias"* via distractor-length heuristic (line 656) — a
  model that varies distractor lengths randomly bypasses it.
- F23 *"answer-justification audit"* (line 431) only works if the
  critic agrees the span is sufficient — confidence-in-the-critic,
  not deterministic.

### B.8 Multi-tenant data security: SOC2 / HIPAA

- Plan relies on Postgres RLS as the *only* isolation (line
  599–606). Risk register row 2 (line 437) calls this "L probability,
  H impact." That's optimistic.
- One bug in any of dozens of `withTenant`-wrapped handlers leaks
  all tenants. Line 626 enforces via lint rule — lint rules don't
  survive aggressive refactor.
- Neon HTTP driver fresh-connection-per-request (line 619) costs
  latency and blows the database connection budget at scale.
- SOC2 Type II requires audit logs the plan never specifies (no
  append-only ledger, no immutable storage).
- HIPAA: Clerk free tier doesn't sign BAAs. Resend doesn't sign BAAs
  on free. Anthropic API has BAA gates.

### B.9 User-facing surfaces — too many for one person

Counted: B2C learner web + B2B admin web + Astro marketing site +
SME review queue (P10) + observability dashboard `/admin/measurement`
+ billing portal (P7) + `/admin/sso, /admin/quality, /admin/cohorts,
/admin/sme/[id], /admin/generate, /admin/review, /admin/leads,
/admin/knowledge, /admin/settings` + `/api/*` (11 endpoints, line
8.2). **15+ distinct UI surfaces** plus a public-facing API.

Industry rule of thumb: a competent solo founder maintains **3–4
surfaces** before quality cliffs. Side-project: **2**.

### B.10 Bottom line (subagent B verbatim)

*"The plan substitutes AI-prompt-as-spec for actual scoping. Phase 1
is at minimum a 4-month build, Phase 2 economics undercount AI by
~10×, 'free-tier' is a ToS breach the moment money changes hands,
and the operator load at promised scale exceeds 60h/week before
sales. Either the scope shrinks 80% or the timeline grows 5×. The
plan does neither, so it will fail at first contact with a paying
customer."*

---

## 3. Subagent C — expert-review-audit critique

**Source.** `expert-review-audit.md` (744 lines, 49KB).

### C.1 Provenance — this is not an external audit, it is a template

The document is not a completed audit — it is a *framework for a
hypothetical future audit that has never been performed*.

- Lines 258–470: every Score, Recommendation, and Notes column is
  empty (`| | | |`).
- L66–68: "Three distinct reviewer profiles" — described in the
  abstract; no names, no signatures.
- L675–714: §G "Review submission template" — blank Mad-Libs with
  empty signature lines.
- L8–10: operator *"uses the result to strengthen, hedge, or abandon"*
  — future tense.

**This is operator self-review costumed as adversarial review.**

### C.2 What the audit catches (and immediately defers)

- L519–523: SOC2 admitted as gating: *"Compliance-vertical pricing
  ($100k–1M ACV) is **ambitious without formal SOC 2**. Phase-1 budget
  reality is closer to $50k–$200k ACV pre-SOC2."* Acknowledged then
  re-classified as "conditional, not committed."
- L454–455 (C19): margin compression at scale flagged: *"At 1000
  tenants, AI cost may scale more linearly — does margin compress to
  80%?"* Posed as a question; no answer.
- L437 (C12): *"Is this conversion rate (operator → 1k SMB tenants in
  3 years) realistic given operator-time-only sales motion?"*
  Question, not finding.
- L463 (C23): *"Is this defensible in serious LP-level due diligence,
  or do LPs require fully-loaded cost (including operator-time at
  market rate)?"* — admits the $0 incremental claim is not LP-
  defensible.

### C.3 What it misses entirely

- TAM/SAM/SOM math is never stress-tested. L434–438 lists the figures
  but only asks reviewers whether sources are credible. No critique
  of the $25M ARR @ 0.05% market-share narrative.
- The 18-day Phase 1 timeline is not in the audit at all. §F (L637)
  declares *"Phase 1 P1–P6 sequencing detail"* out of scope (L653),
  deflecting it to `content-pack-management-plan.md`.
- 95% gross-margin contradiction is touched at C19 (L454) but never
  reconciled with prompt-caching uncertainty at C20 (L455): *"At
  sporadic traffic, caching efficiency is closer to 0%."* If caching
  is 0% and AI scales linearly, the 95% claim is dead — the audit
  puts these on adjacent rows and never connects them.
- Competitive landscape hand-waved. C5 (L425) asks whether Section is
  the closest peer; C6 (L426) asks if 360Learning ships CTA. These
  are reviewer questions, not findings. Synthesia at $1B (C7, L427)
  is dismissed via the *"generation-vs-elicitation distinction"* —
  the audit itself notes *"An LP could argue Synthesia is the
  precedent"* and provides no rebuttal.
- No mention of B2C $9/mo CAC, churn, or payback — entirely missing
  despite C14 (L444) flagging Duolingo Plus pricing parity.

### C.4 Self-serving framing (the comfort blanket)

- L57–60: pre-emptive *"The audit is not a rubber-stamp"* rhetorical
  inoculation.
- L495–547 §D *"Acknowledged hedges"*: operator pre-confesses minor
  sins to look thorough. L543–547: *"Operator background is senior
  ABAP developer, not academic cognitive psychologist"* — a charm-
  offensive disclosure that costs nothing.
- L593–633 §E *"What we'd abandon if disproven"*: exits are **always
  to a smaller version of the same business**, never *"shut down
  because TAM is wrong."* Exit move 5 (L627–633) admits possible
  shutdown only if ≥ 4 of 14 mechanics fail simultaneously — a
  deliberately implausible bar.
- L637–663 §F *"Out-of-scope"*: deflects engineering, sequencing,
  data-model, marketing-copy, and Phase-1 ordering to other docs.
  Anything financially load-bearing is bounced.

### C.5 Findings logged but not addressed

- L501–511 admits the synthesis-of-14-mechanisms thesis *"has no
  published precedent at scale"* — then immediately rationalises it
  as *"plausible."*
- L527–532 admits Kirkpatrick L4 self-report is *"the weakest
  empirical link"* and defers the fix to *"year-3+."*
- L538–541 admits the 3.5× compliance correlation (the **entire
  monetisation argument**) *"is from one industry source"* and *"may
  not generalise"* — recommendation: *"Reviewers should flag."* No
  reviewer exists to flag.

### C.6 Verdict (subagent C verbatim)

*"The audit is **a procedural shield, not a critique**. It performs
the rituals of adversarial review (scoring rubric, COI disclosure,
signed submissions, 30-day commitments) without ever generating a
single binding finding. Every existential weakness — SOC2 gate,
margin scaling, competitive moat, founder bandwidth, TAM math, $0-
cost fiction — is either deflected to 'reviewer's view' (questions
for an absent reviewer), dropped to §D as a pre-confessed hedge, or
pushed out of scope in §F. The decks' rosy claims (95% margin, $25M
ARR, 18-day Phase 1) survive untouched because the audit framework,
by design, never reaches them."*

