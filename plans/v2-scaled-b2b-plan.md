# v2 — Scaled-Down B2B Plan (canonical)

> **Reading order (added 2026-05-11).** This document is the canonical
> *business shape*. For the code-side implementation lens on `/web/`,
> read [`commercialization-readiness-plan.md`](./commercialization-readiness-plan.md).
> The parallel B2C micro-SaaS track (`IMPLEMENTATION-v2.md`) was retired
> 2026-05-11 — see [`archive-2026-05-04/IMPLEMENTATION-v2.md`](./archive-2026-05-04/IMPLEMENTATION-v2.md).

> **Status.** Source of truth for the post-audit shape of this venture.
> Supersedes the v1 plans (`deck-*.md`, `content-pack-management-plan.md`,
> `IMPLEMENTATION.md`, `research-and-strategy-dossier.md` §5–6,
> `expert-review-audit.md`) where they conflict.
>
> **Why this exists.** The hostile review
> (`./business-viability-negative-study.md`) identified nine independently
> fatal problems with the v1 SaaS plan. The mitigation plan
> (`./business-viability-mitigation-plan.md`) classified each as tactical /
> structural / unmitigable and prescribed a safe path. This document
> *combines the findings and the prescribed solutions* into a single
> coherent plan that:
>
> - **keeps a B2B case alive** at a deliberately scaled-down size, and
> - **survives all nine audit findings simultaneously.**
>
> **It is not a rationalisation of v1.** Where v1 made a claim that the
> review struck (95% gross margin, $25M ARR, 18-day Phase 1, Maven 96%),
> v2 does not put the claim back in. The reduced ambition is the price
> of survival.
>
> **Underlying evidence.** `./business-viability-research-notes.md`
> preserves the line-cited subagent ammunition.

---

## Table of contents

1. Executive summary — what v2 is and isn't
2. ICP — one segment, named
3. Pricing — bands that cover operator labour
4. Sales motion — what the operator can actually run
5. Product surface area — the scaled architecture
6. Phase 1 build (8–12 weeks part-time)
7. Phase 2 build (gated on revenue, not on date)
8. Revised unit economics
9. Vendor strategy — provider abstraction from day 1
10. Risk register (revised)
11. Stop-signals (carried over from mitigation plan §17)
12. What v2 explicitly does NOT promise
13. Crosswalk — v1 → v2 changes by document

---

## 1. Executive summary — what v2 is and isn't

**v2 is a focused B2B + B2C learning-content platform for one named
segment, run by one operator on a side-bet schedule, with a hard
ceiling of 10 paying B2B tenants in Year 1 and ~$10–15k MRR by month
12.** It survives every finding in the negative study by being
deliberately smaller than v1.

**v2 is:**
- A **B2C cert-prep web app** that doubles as the wedge content for the
  B2B motion. The operator is the first user; the operator's CCA-F
  study material is the seed catalog.
- A **B2B "team" upgrade** that converts an existing B2C account into
  a small-team workspace. SMB-only (≤50 employees), non-regulated.
- One product, one engine, one segment.

**v2 is *not*:**
- A horizontal AI-LMS competing with Workday-Sana, Articulate, or
  NotebookLM (those won; see `business-viability-research-notes.md`
  §E).
- A mid-market enterprise pitch (no SOC2, no SAML, no SCIM in v1).
- A multi-segment platform (drops deskless, financial-services
  compliance, healthcare, manufacturing, high-PDI cultures from the
  pitch).
- A venture-shaped startup (no $100k MRR Month-24 roadmap, no
  fundraising motion).

**v2 keeps from v1:**
- The two-phase capital-efficiency discipline (de-risk AI cost before
  paying for it).
- Validators-as-quality-floor (not as moat).
- Methodologically honest measurement (Kirkpatrick L1–L4 framework,
  calibration-Δ as a *measurement* not a *promise*).
- The CCA-F study repo as seed content and dogfood.

**v2 drops from v1:**
- $25M ARR / 0.05% SAM-share framing.
- 95% gross margin / NRR 110–120% claims.
- 18-day Phase 1 timeline.
- Mid-market enterprise / regulated-vertical pitch until SOC2 exists.
- The "8 segments, one engine" framing.
- Maven 96% / altMBA 96% / Duolingo CURR / 14× retention citations
  borrowed from cohort or B2C-app contexts.
- Pilot fee with full credit toward subscription.
- Vercel Hobby for any commercial surface.
- Validator-suite-as-moat positioning.
- Claims of vendor portability that don't survive scrutiny.

---

## 2. ICP — one segment, named

**Primary ICP (B2C):** Adults studying for a tech/cloud/AI
certification while employed full-time. CCA-F, AWS Solutions
Architect, GCP Professional Cloud Architect, Anthropic Practitioner.
Pain: practice quizzes are bad, don't space-test, don't surface
calibration. Willingness-to-pay: $10–25/mo for the duration of cert
prep (typically 3–6 months).

**Secondary ICP (B2B small-team):** Engineering teams of 5–50 at
SaaS / AI / cloud / dev-tools companies who are paying for cert prep
out of L&D budgets ($1k–$3k per engineer per year is common). The
buyer is the engineering manager or VP Eng, NOT a Head of L&D, NOT a
compliance officer, NOT HR. **Critical constraint:** the buyer's
procurement does NOT require SOC2, SAML, or a security questionnaire
that exceeds a one-pager. If they ask for SOC2, you say "not in v1"
and walk away.

**Anti-ICP (explicitly out of scope for v1):**
- Healthcare frontline / clinical SMEs (HIPAA gating).
- Financial-services compliance (SOX, FINRA gating).
- Government (FedRAMP gating).
- Manufacturing / shop-floor (deskless wedge requires a different
  product shape).
- Mid-market enterprise (>250 employees) — sales cycle and SOC2 too
  expensive for a solo operator.
- High-PDI / face-saving culture pitches — out of v1 scope.

**Why this segment.** The operator is in it. Distribution is
community-shaped (Reddit, dev.to, Hacker News) rather than
field-sales-shaped. The buyer is technical and forgives a
one-pager-rather-than-SOC2 posture. Engineering managers buy more
quickly than HR/L&D.

---

## 3. Pricing — bands that cover operator labour

| Tier | Audience | Price | Includes |
|---|---|---|---|
| **Free** | Trial / freemium | $0 | 3 lessons across 1 catalog; spaced-review on those 3 |
| **Pro (B2C)** | Individual learner | **$15/mo** or **$129/yr** | All catalogs, full spaced-review, calibration-Δ dashboard |
| **Team Starter (B2B)** | 5–25 seats | **$20/seat/mo**, **$300/mo platform minimum** | All catalogs, basic team admin, weekly progress digest |
| **Team Pro (B2B)** | 25–50 seats | **$25/seat/mo**, **$750/mo platform minimum** | + per-team private custom-catalog (up to 1) drafted from team's own knowledge file |
| **Enterprise** | >50 seats | not-sold-in-v1 | Sales conversation deferred to Year 2+ pending SOC2 |

**Pilot offer (B2B only):** **$10,000 fee, 60-day pilot, no credit
toward subscription.** Pilot fee compensates operator setup labour;
it is non-refundable. Continuation requires a NEW signed annual
contract at list price.

**Why this is different from v1:**
- v1 had $5/seat entry tier; v2 has $20 floor. The $5 tier was
  loss-making per seat once operator labour was priced in.
- v1 had $5,000 pilot fully credited; v2 has $10k non-credited.
- v1 had no platform minimum at the entry tier; v2 has $300/mo floor.
- v1 implied B2C $9/mo pricing parity with Duolingo Plus; v2 raises
  to $15 because cert-prep buyers tolerate more, and the math at $9
  did not work (LTV ~$112 at 8% monthly churn vs realistic CAC).

**Money-back guarantee** for B2C: 30 days, no questions, automated.
Reduces friction; structurally cheap because B2C subscribers churn
naturally if it doesn't fit.

**No money-back on B2B pilot** — the operator delivered work.

---

## 4. Sales motion — what the operator can actually run

**B2C is community-led, not paid-acquisition-led.**

- Weekly post on Reddit (/r/AnthropicAI, /r/AWSCertifications,
  /r/cscareerquestions, /r/devops) sharing one quiz question + one
  cognitive-science note. Drives traffic to free tier.
- Monthly "Show HN" / dev.to post on a building-in-public theme.
- Email list with one short newsletter per week.
- **No paid acquisition until LTV:CAC > 3:1 is measured** — i.e.,
  not in Year 1.

**B2B is warm-intro-led, not outbound-led.**

- Operator's own network: ex-colleagues running engineering teams.
- Conversion path: B2C user → "I'd like this for my team" →
  Team Starter pilot.
- **Maximum 2 concurrent pilots.** Each pilot = ~50 hours of
  operator labour over 60 days. Three concurrent = full-time job.
- Outbound only for tier-2 prospects after the network is exhausted.
- **No SDR, no demo automation, no CRM beyond a spreadsheet** in v1.

**Sales-cycle expectations:** B2B small-team SaaS sales cycles for
ENG-buyers run 14–45 days (much shorter than mid-market HR/L&D's
60–120 days because the buyer is the user). Plan for ~30-day average
from first email to signed pilot.

---

## 5. Product surface area — the scaled architecture

**v1 had 15+ user-facing surfaces.** v2 has **6**:

| # | Surface | Audience | Routes |
|---|---|---|---|
| 1 | Marketing one-pager | All | `/` |
| 2 | Auth | All | `/sign-in`, `/sign-up` |
| 3 | Learner dashboard | B2C + B2B | `/dashboard` (catalog list, spaced-review banner, streak) |
| 4 | Lesson + quiz | B2C + B2B | `/study/[slug]` (lesson + 3-Q quiz + JOL slider + calibration trend) |
| 5 | Account + Stripe portal | B2C + B2B | `/account` |
| 6 | Team admin (B2B only) | B2B owner role | `/team` (seat management, invites, weekly digest, catalog assignment) |

**Deferred from v1 (build only after Year-1 paying revenue):**

- Custom-catalog drafting from buyer's knowledge files (Year 2).
- SCORM / xAPI export.
- SAML / SCIM / Clerk Enterprise.
- SOC2 audit trail / append-only ledger.
- Cohort routes / peer-comparison / leaderboard.
- Voice-first or camera-first authoring.
- Worked-example fading editor.
- Suggestion / topic-request triage queue.
- Embedding-based dedup.
- Per-SME blind-spot dashboard.
- Inngest pipelines (Phase-2 generation queue).
- Multi-tenant RLS hardening (single-tenant in v1; tenant-scoping at
  the application layer; RLS rebuild deferred until tenant count
  justifies the audit).

**Stack choices (v2):**

- **Hosting**: Vercel Pro $20/mo from day 1 (no Hobby; TOS-clean).
- **Auth**: Clerk free → Pro at 25 active orgs.
- **DB**: Neon free tier in v1; upgrade to Scale ($19/mo) at 100 paid
  users or 250 MB.
- **Files**: Cloudflare R2 (egress-free, free under 10 GB).
- **AI**: OpenRouter as the API surface; Anthropic Haiku 4.5 as
  drafter; Anthropic Sonnet as sampled critic (≤ 5% of drafts);
  vendor-neutral prompt templates.
- **Email**: Resend free → AWS SES at 3k/mo.
- **Telemetry**: PostHog free with sampled server-side events;
  Sentry free.
- **Payments**: Stripe Checkout + Customer Portal. No custom billing
  in v1.

**Observability**: a single status page (e.g., BetterStack $25/mo
when first paying B2B tenant lands) and a Sentry alert for unhandled
errors. No custom dashboards.

---

## 6. Phase 1 build (8–12 weeks part-time)

The v1 18-day claim is dead. v2 budgets **8–12 weeks of evening +
weekend hours** for one operator.

**Week 1–2 — Foundations:**
- Vercel Pro project, Next.js App Router, Tailwind v4, shadcn/ui.
- Clerk auth (single-user pool, no orgs in v1).
- Neon Postgres + Drizzle ORM. Three tables: `user`, `progress`,
  `attempt`. No tenant_id column yet.
- R2 client; static catalog JSON committed to repo.
- Stripe Checkout + Customer Portal wired.

**Week 3–4 — Learner experience (the wedge):**
- `/dashboard` route with catalog tile + spaced-review banner.
- `/study/[slug]` route — lesson markdown + 3-Q quiz + JOL slider.
- Spaced-review scheduler (1/3/7/14/30d expanding interval).
- Streak counter + simple email digest at modal study time.
- One catalog: CCA-F Foundations content from
  `/home/user/cca-f-prep/00-academy-basics/`.

**Week 5–6 — Authoring loop + Quality:**
- Local validator suite — code the 17 currently-stubbed validators.
  Open-source the lot at `npm:cca-content-quality`.
- `/.claude/skills/draft-topic` Claude Code skill that runs
  validators and writes JSON; operator authors content offline on
  Max 20x.
- Lint script: `pnpm lint:content`.

**Week 7–8 — Team mode (the B2B add-on):**
- Add `tenant_id` column to existing tables (single migration).
- Add `team` table; Clerk Organizations role enabled.
- `/team` route: invite flow, seat list, weekly progress digest.
- Stripe seat-based pricing.

**Week 9–10 — Polish + verification:**
- Mobile Lighthouse ≥ 90 on the 6 routes.
- axe-core sweep — WCAG 2.1 AA on the 6 routes.
- Status page + Sentry alerts.
- One-pager marketing site at `/` with Stripe Payment Link for the
  B2C tier.

**Week 11–12 — Launch + first cohort:**
- Show HN / Reddit / dev.to launch.
- First 5 free-tier signups manually onboarded.
- Watch metrics for 2 weeks; fix the obvious issues.

**If anything is unshipped at week 12, stop and re-plan.** Do not
extend without a written reason.

---

## 7. Phase 2 build (gated on revenue, not on date)

**Phase 2 fires only when ALL three are true:**

1. ≥ $3,000 MRR (combined B2C + B2B) sustained for 8 weeks.
2. ≥ 1 paying B2B tenant on Team Starter or Team Pro.
3. Operator weekly hours ≤ 25 on average for the prior 8 weeks.

**Phase 2 features (in order of revenue-yield priority):**

1. **In-app AI generation pipeline.** Inngest queue, Sonnet drafter
   on operator-supplied knowledge files.
2. **Custom team catalog** drafted from a buyer's PDF/runbook upload
   (the highest-priced upgrade path).
3. **Sampled Opus critic** at ≤ 5% of generations — quality
   spot-check, not the default path.
4. **Per-tenant token-budget circuit breaker** server-enforced.
5. **B2B audit log** (append-only event ledger) — needed for SOC2
   later, but useful immediately for buyer trust.
6. **Suggestion / topic-request loop** for B2C learners.
7. **Voice-first authoring** for the operator (not for buyers) —
   reduces operator authoring time on the core catalog.

Each feature ships behind a feature flag, on a quarter-long cadence.
**Two features per quarter is the cap**; three is overcommitment.

**Phase 2 has no fixed end date.** It runs for as long as there is a
prioritised feature whose marginal revenue contribution exceeds the
operator's marginal time cost.

---

## 8. Revised unit economics

**Real numbers (v2):**

- **B2C ARPU**: $15/mo. At 7% monthly churn, LTV ≈ $214.
- **B2B ARPU per seat**: $20–25. At 3% monthly churn (engineering-
  team buyers stick if the value is there), LTV per seat ≈
  $670–840.
- **Average team size**: 12 seats blended. Team-LTV ≈ $8–10k.
- **CAC**: ~$0 paid acquisition in v1; operator-time CAC priced at
  market rate ($75/hr).
- **Year-1 realistic outcome**:

  | Metric | Conservative | Plan | Optimistic |
  |---|---|---|---|
  | B2C paying users at Mo 12 | 50 | 150 | 400 |
  | B2B paying tenants at Mo 12 | 1 | 3 | 7 |
  | Average B2B seats | 8 | 12 | 18 |
  | Combined MRR at Mo 12 | $1.0k | $3.1k | $9.2k |
  | Annualised at Mo 12 | $12k | $37k | $110k |

**Gross margin** (v2 honest):

- AI cost line at 100 active B2C + 5 B2B tenants × ~50 generations
  /mo per tenant ≈ 750 generations/mo total. With Haiku drafter +
  5% Sonnet sampled critic + amortised across cohort: ~$80–150/mo.
  At 5–10× scale: $400–1,500/mo.
- Infra base: $50–80/mo (Vercel Pro $20, Neon Scale $19, BetterStack
  $25, misc).
- Stripe fees: 2.9% + 30¢.
- **Realistic gross margin: 60–75%**, not 95%.

**NRR target (v2 honest):**

- B2C: 80–95% (consumer churn is real; cert-prep is finite-duration).
- B2B: 100–115% if seat-expansion works; 85–100% if it doesn't.
- Blended: ~95–105% — in line with SMB SaaS benchmarks per Pavilion
  2025.

**CAC payback target:** B2C 4–6 months; B2B 6–10 months on operator-
time CAC.

**Honest LTV:CAC**: targeted 3:1 once paid acquisition turns on;
in v1 it is N/A because there is no paid acquisition.

---

## 9. Vendor strategy — provider abstraction from day 1

**Per mitigation plan §12.** Build the LLM-call layer through a
vendor-neutral interface from day 1. Don't yak-shave a custom DSL;
use OpenRouter or a thin OpenAI-shape wrapper.

**Concrete v2 commitments:**

1. **All AI calls go through `lib/ai/router.ts`** — a single file,
   one function `generate({ system, user, model })`. Default route:
   Anthropic via OpenRouter. No Anthropic SDK calls outside this
   file.
2. **No prompt caching keys, no XML tool-use, no Anthropic-specific
   features in core paths in v1.** When introduced (Phase 2), they
   are isolated to a `lib/ai/anthropic-features.ts` module that has
   a graceful fallback.
3. **Prompt templates are markdown** in `prompts/` directory; never
   inline strings.
4. **Migration runbooks** at `plans/runbooks/`:
   - `runbook-vercel-to-cloudflare.md`
   - `runbook-clerk-to-betterauth.md`
   - `runbook-neon-to-supabase.md`
   - `runbook-anthropic-to-openai.md`
   - `runbook-stripe-to-paddle.md`
   Each: one page, three sections (trigger / steps / blast radius +
   ETA). Don't *do* the migrations; just *plan* them.
5. **Hard server-side cost circuit breaker.** Per-tenant token
   ledger; reaching the cap **stops generation**, doesn't just warn.
   ~1 day of work; saves a runaway invoice.
6. **Cap the vendor count at 6.** Vercel, Clerk, Neon, R2, Stripe,
   OpenRouter. Add only when revenue demands.

---

## 10. Risk register (revised)

| Risk | Likelihood | Impact | Mitigation in v2 |
|---|---|---|---|
| AI cost spikes 3× overnight | M | M | Hard server-side per-tenant cap; Haiku-default; OpenRouter switch route |
| Anthropic deprecates a model | M | L | Vendor abstraction; OpenRouter fallback to OpenAI |
| Vercel TOS / pricing change | L | M | Already on Pro; runbook for Cloudflare migration |
| Quality incident reaches a learner | M | H | Validators + 5% sampled critic + post-publish "pause-not-pull" + open-source library for community review |
| Operator hits >30 hr/wk for 2 months | M | H | Cap pilots at 2; cap B2B tenants at 10; stop-signal triggers |
| First B2B prospect demands SOC2 | H | M | Walk away politely; document as "not in v1"; ICP filter |
| Day-job conflict | M | H | Side-bet shape preserved; never quit day job until MRR ≥ 60% take-home for 2 quarters |
| Hyperscaler ships a free competitor for cert-prep | L | H | Differentiate on community + niche-cert depth; if they ship and dominate, exit gracefully |
| Validator suite goes obsolete with model upgrade | H | L | Already open-sourced as commodity tooling; not the moat |
| 76% B-bias regression repeats | M | L | Pre-publish validator with letter-distribution check (already coded as F1); CI-fail if violated |

---

## 11. Stop-signals (carried over from mitigation plan §17)

These are non-negotiable kill triggers, not "consider pivoting"
triggers.

| Trigger | Action |
|---|---|
| MRR < $1,000 by Month 6 | Stop. Migrate to open-source library + consulting. |
| 3 B2B pilots fail their pre-defined success criteria | Stop the B2B motion. |
| AI cost > 30% of MRR for 2 consecutive months | Raise prices or stop. |
| Vercel / Anthropic / Clerk policy change requires > 2 weeks migration | Stop. Vendor risk crystallised. |
| Operator > 30 hr/wk for 2 consecutive months on side-bet schedule | Stop or quit day job consciously. |
| Day-job income or partner relationship at risk | Stop immediately. |
| External reviewer (paid, signed, dated) recommends "do not continue" | Don't continue. |
| 12 months elapsed and < 100 paying users | Segment fit wrong. Stop. |
| Quality incident with documented harm reaches a learner | Stop new generation; fix; audit; publicly document. |

---

## 12. What v2 explicitly does NOT promise

(Carried over from mitigation plan appendix; bind operator against
scope creep.)

- $25M ARR.
- $100k MRR by Month 24.
- 95% gross margin.
- 110%/120% NRR.
- 3 signed B2B LOIs in Year 1 (target is **1 signed pilot**).
- Mid-market enterprise deals.
- SOC2 Type 2 in Year 1.
- A "category-king" outcome.
- Venture funding.
- A team of 12.
- 7 vertical wedges.
- Anthropic acquisition.
- Outcome equivalence with Maven, altMBA, Duolingo, Cornerstone.

What it *does* promise: a sustainable side project that **makes a
B2B case viable at small scale** while preserving the operator's
day-job income, family time, and reputation. Optionality to grow
later if the data warrants.

---

## 13. Crosswalk — v1 → v2 changes by document

For each v1 doc, the headline changes:

| Doc | v1 claim | v2 status |
|---|---|---|
| `deck-overview.md` §"Two markets, one product" | $9 B2C + $5–15 B2B | **Updated**: $15 B2C + $20–25 B2B with $300/mo platform minimum |
| `deck-overview.md` §"Phase 1 cost — essentially free" | ~$1/mo | **Updated**: ~$20/mo (Vercel Pro from day 1) |
| `deck-overview.md` §"Phase 2 cost" | $450–1000/mo | **Updated**: $400–2,000/mo at v2 scale (10× lower scale than v1) |
| `deck-overview.md` §"Pricing math at modest scale" | 95% gross margin | **Updated**: 60–75% honest gross margin |
| `deck-overview.md` §"Why learners come back" | Maven 96% + Duolingo CURR | **Struck**; replaced with methodologically honest framing |
| `deck-overview.md` §"Eight segments, one engine" | 7+ segments | **Reduced to 1 segment** (tech-cert prep for adults; B2B = small eng teams) |
| `deck-overview.md` §"Phase 1 timeline — ~18 working days" | 18 days | **Updated to 8–12 weeks part-time** |
| `deck-investor.md` §"Market size (rough)" | $370B TAM, 0.05% = $25M ARR | **Struck**; replaced with bottoms-up named-account count |
| `deck-investor.md` §"Business model & unit economics" | 95% margin, 110%/120% NRR | **Struck**; replaced with honest 60–75% / 95–105% |
| `deck-investor.md` §"Roadmap to $100k MRR" | Month 24–30 | **Struck**; v2 targets ~$10–15k MRR by Month 12 |
| `deck-investor.md` §"What we're asking for" | "Not raising capital." | **Unchanged**; v2 is explicitly bootstrapped |
| `deck-b2b-prospect.md` §"Pricing after the pilot" | $5/$10/$15 tiers | **Updated**: $20/$25, drop $5 tier, $300/$750 platform min |
| `deck-b2b-prospect.md` §"Pilot offer" | $5,000 fully credited | **Updated**: $10,000, no credit |
| `deck-b2b-prospect.md` §"Security & compliance" | SOC2 at 5 enterprise tenants | **Updated**: SOC2 not in v1; ICP filter excludes buyers requiring it |
| `deck-b2b-prospect.md` §"How we make your SMEs effective" | Custom-catalog AI drafting from buyer's files | **Deferred to Phase 2** |
| `deck-collaborator.md` §"Phase 1 build (~18 days)" | 18 days | **Updated**: 8–12 weeks |
| `deck-collaborator.md` §"What we're asking for" | Co-founder shape, vague terms | **Updated**: explicit "no collaborator hire in v1" |
| `IMPLEMENTATION.md` Part 1–6 | 18-day Phase 1 | **Superseded**; see §6 above + `IMPLEMENTATION.md` v2 section |
| `content-pack-management-plan.md` §C9–C11 | Same 18-day breakdown | **Superseded**; see §6 above |
| `research-and-strategy-dossier.md` §5.1 TAM | $20–40B SAM, 0.05% = $25M ARR | **Struck** as quantitative claim; kept as qualitative framing |
| `research-and-strategy-dossier.md` §5.4 unit economics | 95%, 110/120%, $0 CAC | **Struck**; replaced with v2 §8 numbers |
| `research-and-strategy-dossier.md` §5.7 Phase-1 budget | 18 days operator-time | **Struck**; replaced with v2 §6 |
| `expert-review-audit.md` whole doc | Empty rubric | **Replaced** by negative study + this document; legacy doc archived |

The v1 docs remain on disk as a record of v1 thinking. **Where v1
and v2 conflict, v2 wins.**



