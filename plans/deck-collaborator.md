# Content Pack Management Platform — Technical Collaborator Brief

> Slide-style deck for a senior engineer evaluating joining as co-founder, first hire, or technical advisor. Engineering-language; assumes you can read TypeScript and SQL. Slide breaks are marked by `---`.
> Companion docs: [`./content-pack-management-plan.md`](./content-pack-management-plan.md), [`./deck-overview.md`](./deck-overview.md), [`./deck-investor.md`](./deck-investor.md), [`./deck-b2b-prospect.md`](./deck-b2b-prospect.md).

---

# Content Pack Management Platform

A B2C/B2B learning platform with a deliberate quality loop:
AI drafter → deterministic validators → stronger-model critic → human gate.

*For: a senior engineer or technical co-founder. ~10-minute read. Assumes the detailed plan is the source of truth for everything below.*

---

## Product in one paragraph

A learning platform where AI drafts lessons + quizzes from operator-supplied knowledge files; a library of deterministic validators catches a documented set of AI failure modes; a stronger reviewer model audits the drafter; and a human always approves before publish. Two markets (B2C self-service + B2B with SME review) share one platform. The killer feature is **the quality loop, not the lessons themselves.**

---

## Why this is technically interesting

Three things that aren't templated SaaS:

1. **The validator library is the moat** — 23 documented AI-content failure modes (F1–F8 cognitive failure-mode taxonomy) catalogued from real misses. Vendor-independent. Reused across local lint, server-side import, and the commercial critic stage.
2. **HITL pipeline that doesn't burn out the reviewer** — the hard part isn't catching bad AI output; it's surfacing the right thing to the human at the right time, with pre-computed findings and side-by-side diffs. Most teams get this wrong.
3. **Multi-tenant from day 1, on serverless Postgres** — RLS at the connection layer, with the Neon HTTP driver to avoid pool-reuse leaks. Verified by an integration test that asserts cross-tenant queries return 0 rows.

---

## The hard problems

| Problem | Why it's hard | Our angle |
|---|---|---|
| **Catching AI failure modes deterministically** | LLM output looks plausible even when it's wrong | Pre-existing F1–F8 taxonomy + Zod + bias detection + spoiler detection + cross-ref checks; runs in ~50ms |
| **HITL UX that scales** | SME burns out at >15 min/day per tenant | Pre-computed findings, side-by-side diffs, three-button decision (approve / approve+edit / reject); target ≤10 min/day |
| **RLS on serverless Postgres** | Connection pool reuse leaks tenant context | Neon HTTP driver (fresh connection per request); `withTenant(...)` helper; integration test enforces it |
| **AI cost discipline** | One bad config = $10k/day burn | Per-tenant monthly budget cap, server-enforced; UI burn meter; alerts at 80% and 100% |
| **Calibration loop without prompt growth** | Naive few-shot accumulation blows context | Cap at 8 most-recent rejections; older ones summarised into anti-pattern rules in the system prompt |

---

## Architecture at a glance

```
┌──────────────────────────────────────────────────────────────────────┐
│  Astro marketing site (separate Vercel project, www subdomain)       │
│   - LOI form (B2B), waitlist (B2C), Stripe pre-order Payment Link    │
└──────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼ POST /api/leads
┌──────────────────────────────────────────────────────────────────────┐
│  Next.js app on Vercel (app subdomain)                               │
│   Route groups: (public) / (learner) / (admin)                       │
│   Auth: Clerk; tenant via Clerk Organizations                        │
└──────────────────────────────────────────────────────────────────────┘
              │                     │                     │
              ▼                     ▼                     ▼
       ┌────────────┐       ┌──────────────┐      ┌──────────────────┐
       │ Postgres   │       │ Cloudflare R2│      │ PostHog / Sentry │
       │ (Neon)     │       │  pack JSON   │      │ Resend (email)   │
       │  RLS       │       │  knowledge   │      │                  │
       └────────────┘       └──────────────┘      └──────────────────┘
```

Phase 2 adds an Inngest pipeline (generate → validate → critique → route → publish) and Stripe.

---

## What's built today

In the existing repo at `/home/user/cca-f-prep`:

- `web/` — Next.js App Router skeleton, Tailwind v4, shadcn/ui, Playwright e2e, Vitest unit tests.
- `web/content-packs/` — three live content packs including the actual CCA-F study material we drink-our-own-champagne with.
- `web/src/content/curriculum-types.ts` — schema we extend.
- `06-failure-analysis/error-log.md` — the F1–F12 cognitive failure-mode taxonomy and 23 documented failure modes (extended from F1–F8 in the methodology layer to cover JOL miscalibration, transfer failure, fluency illusion, and cue-bias / surface-feature bias). Each F-code has a mechanism crosswalk citing research source and standard remediation.
- `08-cheat-sheets/` — decision trees and anti-patterns the validators encode (now includes learner re-engagement tree, SME content-elicitation tree, and segment-aware mechanism selection tree).
- `09-progress-tracker/spaced-review.md` and `skills-matrix.md` — the calibration-Δ and JOL doctrine the LM6 surface implements.
- Codex review pipeline (gpt-5.5 with multi-vendor fallback) on every PR.

You are **not** starting from a blank Next.js project.

---

## What you'd build in Phase 1 (~18 days)

| Phase | Days | Deliverable |
|---|---|---|
| **P1** | ~3 | Monorepo (pnpm workspaces) + Drizzle schema + Clerk + R2 wired in `web/`. RLS isolation test green. |
| **P2** | ~3 | Astro marketing site at `marketing/`, deployed; LOI / waitlist / Stripe pre-order links live; `/api/leads` storing rows; Resend confirmation emails. |
| **P3** | ~4 | Learner app: catalog browse, lesson page, quiz runner, progress, search, suggestion submit. Mobile Lighthouse ≥90. |
| **P4** | ~4 | Admin app: import draft, server-side validators, version diff, lint mode, suggestions queue, knowledge file upload, leads dashboard. |
| **P5** | ~2 | Operator authoring loop: `/.claude/skills/draft-topic` skill + `pnpm lint:draft` script + seeding from existing content packs. |
| **P6** | ~2 | Verification: 12-step end-to-end + Lighthouse + RLS isolation + accessibility on marketing forms. |

Tickets, file paths, and acceptance criteria are in [`./content-pack-management-plan.md`](./content-pack-management-plan.md) §C9–C11.

---

## What you'd build in Phase 2

Each item ships behind a feature flag:

1. **In-app generation pipeline** — Inngest `generate → validate → critique → route → publish`; SSE streams to admin UI.
2. **Critic stage** — Opus reviewer prompt outputting `{confidence, findings, suggested_edits}`; answer-justification audit.
3. **Confidence routing** — B2C auto-publish at conf ≥0.85 with 1-in-20 spot-check; B2B human-required by default.
4. **B2B controls** — SME role (Clerk role), two-eye gate, per-tenant private catalogs, SAML/SCIM via Clerk Enterprise.
5. **Stripe billing** — webhook → `tenant.plan`; B2C $9/mo Pro, B2B per-seat with $100/mo minimum.
6. **Embedding-based suggestion dedup** — replaces Phase 1 TF-IDF; Voyage `voyage-3-lite`.
7. **Post-publish quality signals** — nightly aggregation; pause-not-pull at <30% correct over ≥30 attempts.
8. **Calibration loop** — bounded few-shot (8) + anti-pattern rules.
9. **Cross-tenant catalog import (v2)** — pinned versions, "update available" prompt.
10. **Cost dashboards** — per-tenant token spend, alerts at 80% / 100%.
11. **Calibration-Δ surface** — JOL pre-answer captured in quiz runner; Δ written to `progress` server table; trend visible in dashboard stats panel. Implements LM6 (Dunlosky & Bjork; Kruger & Dunning 1999).
12. **SME blind-spot dashboard** — per-SME critic-feedback aggregated; personalised authoring prompts surfaced before next draft. Implements SM8 (Ericsson 1993 — deliberate-practice feedback channel).
13. **Segment-affordance switchboard** — per-tenant `tenant_policy` config selects which UI surface variation is active (deskless mobile / compliance-enterprise / B2C cohort / founder-SMB / high-PDI). One critic engine, many surfaces (cross-ref content-pack-management-plan §D6).
14. **xAPI emit hooks** — events posted to mid-market / enterprise tenants' SCORM/xAPI LMS for L2 / L3 Kirkpatrick reporting in their existing L&D dashboards.
15. **WCAG 2.2 AA + Section 508 conformance** — public-sector / enterprise prerequisite; accessibility audit passed before Enterprise tier is sold.

---

## The HITL design (subtle, important)

Refined over 3 plan rounds. The bit teams typically get wrong:

**Humans decide one of three things, at most:**
1. Approve — content goes live as drafted.
2. Approve with edits — edited inline; goes live edited.
3. Reject with reason — reason becomes a few-shot example, then an anti-pattern rule.

**Everything else is automated:**
- Running validators (server, deterministic).
- Computing critic confidence (Opus, JSON output).
- Picking which drafts the human sees (confidence < 0.85, OR validator failed, OR justification audit failed, OR sampled spot-check).
- Building the side-by-side diff view.

**Anti-pattern guardrails:**
- "AI tells the human everything is fine" risk — critic and drafter from same family miss same blind spots. Mitigation: Opus critic on Sonnet drafts (stronger reviewer); cross-vendor critic via OpenRouter as v2 escape hatch.
- Validators are vendor-independent and catch the F1–F8 modes regardless of model.

---

## The validator library (the moat)

```typescript
// /packages/shared/src/validators/index.ts (P1 deliverable)

import { z } from 'zod';

export const conceptSchema = z.object({
  slug: z.string(),
  lesson: z.string().min(200).max(2000),
  quiz: z.array(quizQuestionSchema).length(3),
  // ...
});

export const validators = [
  schemaValidator,            // Zod shape
  letterDistributionValidator, // F-code F3: B-bias detector
  spoilerValidator,            // F-code F1: stem leaks the answer
  distractorDifferentiationValidator, // F-code F4
  closedListWhitelistValidator, // F-code F2: forbidden phrases
  crossRefValidator,           // F-code F5: broken internal links
  // 17 more...
];

export function lintDraft(draft: ConceptDraft): LintResult {
  return validators.flatMap(v => v.run(draft));
}
```

Reused in three places: local lint script (operator's Claude Code loop), admin server-side import handler, and (Phase 2) the critic pipeline.

---

## Mechanics-to-mechanism map

The retention claims aren't aspirational. Each product surface is wired
to a peer-reviewed cognitive-psychology mechanism with a measurable
outcome. The L-codes are referenced from
[`./content-pack-management-plan.md`](./content-pack-management-plan.md)
§ D0 / § D1 / § D7. **Read each row left-to-right: identified problem
→ shipped feature → research source → falsifiable metric.**

**Learner side (LM1–LM8):**

| Problem solved | Feature (specific surface) | Source | Measured outcome |
|---|---|---|---|
| ~25% retained at day 6 without review | LM1 Spaced-review banner (`SpacedReviewBanner.tsx`); 1/3/7/14/30d scheduler in `web/src/lib/spaced-review.ts`; cron-driven enqueue; leech rule | Cepeda et al. 2008 (*Psych Sci*); Murre & Dros 2015 | D7 cohort-retention curve ≥ 40% (cohort tier) |
| Re-reading produces fluency illusion, not learning | LM2 Mid-lesson retrieval gate (`RetrievalGate` primitive in `LessonView.tsx`); recall-write before reveal | Roediger & Karpicke 2006; Karpicke & Blunt 2011 (*Science*) | Mock pass-rate lift; calibration-Δ closure |
| Recognition-ease beats generation in default UX | LM3 Generation-before-reveal field in `QuizRunner.tsx`; principle-write required before answer | Slamecka & Graf 1978 | Long-term retention +30% precedent |
| Blocked practice transfers ~30% worse | LM4 Interleaving constraint in `recommendation.ts`: `nextPick.subArea !== lastPick.subArea` | Rohrer & Taylor 2007 (63% shuffled vs 20% blocked) | Transfer-question accuracy lift |
| Static scaffolding hurts intermediates (expertise-reversal) | LM5 Worked-example fading + rung-3 cutover; lesson-depth toggle gains "solo" rung | Sweller, van Merriënboer & Paas 2019; Kalyuga 2003 | Per-rung intervention efficacy |
| Dunning-Kruger gap invisible | LM6 JOL slider before reveal; calibration-Δ in `StatsPanel.tsx`; weekly trend persisted | Dunlosky & Bjork; Kruger & Dunning 1999 | \|Δ\| trend toward 0.5 over 8-week window |
| Streak computed but no return-trigger | LM7 Web-push at modal study-time + email digest; bandit-optimised cadence; streak-freeze | Eyal 2014; Skinner (variable-ratio); Mazal 2022 (Duolingo) | CURR +21%, DAU 4.5× precedent |
| MOOC 3–10% completion — no relatedness surface | LM8 Per-cohort routes; peer-comparison panel; group leaderboard primitive; live-cohort touchpoint | Ryan & Deci (SDT — relatedness); Maven W1→W2 96% vs MOOC 16%; Reich 2019 *Science* | Course-completion rate ≥ 60% target |

**SME side (SM1–SM8):**

| Problem solved | Feature (specific surface) | Source | Measured outcome |
|---|---|---|---|
| SMEs omit ~70% of decisions self-narrating | SM1 `DrafterIntake` schema — 5 required JSON fields; admin app blocks publish if any empty | Clark / Feldon; Lee 2004 (+46% gain, d ≈ 1.72); Tofel-Grehl & Feldon 2013 | SME-content learner-pass-rate vs unscaffolded baseline |
| "Telling what I know" instead of designing toward an assessment | SM2 Backward-design "write the test first" mode; lesson editor locked until assessment authored | Wiggins & McTighe 1998 | Lesson measurability gate (every lesson has a passing assessment) |
| Principle-only or example-only ships | SM3 Worked-example pair editor (worked + faded mandatory); critic refuse-to-publish if either missing | Sweller; Renkl (faded worked examples) | 4C/ID supportive-info coverage |
| Curse of expertise — bridging steps under-explained | SM4 "What would a novice get wrong here?" textarea required; critic surfaces `blind_spot_flags` | Nathan & Petrosino 2003; Hinds 1999 | Critic-rejection-rate trend per SME |
| Free-typed principle drift | SM5 Closed-taxonomy principle-picker; rejection if free-typed and unmapped | Knowles; Bloom revised | Cross-concept retrieval consistency |
| 4C/ID component coverage gaps | SM6 Critic returns `missing_components: ('learning_tasks' \| 'supportive_info' \| 'jit_info' \| 'part_task_practice')[]`; refuse-to-publish on any missing | van Merriënboer 1997 (4C/ID) | All four components present per published lesson |
| Tacit knowledge unrecoverable from text-from-blank | SM7 Voice-first / camera-first authoring + auto-draft into 5-probe intake (mobile-first for deskless) | Polanyi 1966; CTA-for-skilled-trades; TalentCards (~2.7B deskless) | SME TTFV ≤ 1 hour for tacit-knowledge segments |
| Critic feedback is destination, not loop | SM8 Per-SME blind-spot dashboard at `/admin/sme/[id]/`; aggregated critic-feedback over time; personalised authoring prompts | Ericsson 1993 (deliberate-practice feedback channel) | Critic-rejection-rate trends down month-over-month per SME |

**Coverage assertion.** Every problem maps to ≥ 1 specific feature
(file path or component named); every feature maps to ≥ 1 cited source.
No problem is closed by exhortation alone. Cross-ref §D0 in the build
plan for the canonical matrix; full evidentiary basis in
[`research-and-strategy-dossier.md`](./research-and-strategy-dossier.md)
(industry case studies, problem-by-problem mitigation walkthrough with
falsification triggers, full bibliography).

---

## Phase-2 elicitation tooling

Drafter + critic + SME-facing UI implementing SM1–SM8:

**Drafter prompt schema** — required JSON fields matching the 5-probe
CTA tree from `08-cheat-sheets/decision-trees.md` § 6:

```typescript
type DrafterIntake = {
  novice_error: string;          // (a) expert-blind-spot probe
  one_principle: string;         // (b) backward-design — closed taxonomy
  worked_example: string;        // (c) Sweller worked-example
  faded_variant: string;         // (c) Sweller faded variant
  boundary_case: string;         // (d) CTA boundary probe
  nearest_confusable: string;    // (e) interleaving prep — Rohrer & Taylor
};
```

**Critic prompt schema** (Opus on Sonnet drafts):

```typescript
type CriticOutput = {
  confidence: number;                          // 0..1
  missing_components: ('learning_tasks' | 'supportive_info' |
                       'jit_info' | 'part_task_practice')[];   // 4C/ID
  blind_spot_flags: string[];                  // SM4-style probes
  fcode_risks: ('F1' | 'F2' | ... | 'F12')[]; // pre-publish failure-mode scan
  suggested_probes: string[];                  // SM8 dashboard input
};
```

**SME-facing UI affordances:**
- Principle-picker (closed taxonomy; rejection if free-typed and
  unmapped) — pre-empts F12 cue-bias and F4 rationale gap.
- Worked-example pair editor (worked + faded variant required).
- "What would a novice get wrong?" textarea (SM4).
- Backward-design "write the test first" mode (SM2).
- Per-SME blind-spot dashboard (SM8) showing aggregated critic
  feedback over time + personalised authoring prompts.

Each surface tagged to which F1–F12 codes it pre-empts in the source
comments (audit trail for the codex review pipeline).

---

## Segment-aware UI/affordance map

One critic engine + one CTA-probe schema + one calibration-Δ column,
projected through segment-specific UI affordances. The mechanism set
does not vary by segment — only the surface does.

| Segment | UI/affordance variation | Phase-2 component (engineering wiring) |
|---|---|---|
| **Deskless mobile** (manufacturing / retail / hospitality / healthcare-frontline) | Voice-to-text capture; ≤ 3-min nano-format; offline cache; push at variable-ratio | `web/src/app/(learner)/deskless/` route group; `voice-capture.ts`; service worker for offline |
| **Compliance enterprise** (finance / healthcare / government) | SCORM 2004 + xAPI emit; audit-trail; version-pin; role-based publish; WCAG 2.2 AA / Section 508 | Inngest `xapi-emit` workflow; Postgres `audit_log` + `version_pin` tables; Clerk SAML/SCIM; accessibility-conformance test gate |
| **B2C cert-prep** | Streak + cohort + leaderboard + goal-gradient progress bar (Hook Model + SDT) | `web/src/components/streak/`; `web/src/app/(learner)/cohort/[id]/`; `web/src/components/dashboard/GoalGradient.tsx` |
| **Founder / SMB single-SME** | Succession-of-knowledge wizard (interview-record → CTA-extract → auto-draft → reviewer-pair) | Inngest `interview-extract` workflow; R2 audio bucket; auto-draft model call |
| **High-PDI / face-saving** | Leader-endorsement step gate before SME publish; anonymised peer review; critic copy framed as *probe* / *suggestion* | `tenant_policy.publish_gate = 'leader_endorse'`; copy-variant table for critic-output i18n |

That's the wiring diagram. One engine, segment-specific projections.

---

## Tooling & developer experience

| | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Already in repo |
| Language | TypeScript strict | Already in repo |
| ORM | Drizzle | Type-safe, lightweight, plays nice with Neon HTTP |
| DB | Neon Postgres | Serverless, generous free tier, branch-per-PR for previews |
| Auth | Clerk | Best-in-class B2C+B2B; Organizations for tenancy |
| File storage | Cloudflare R2 | Free egress, S3-compatible API |
| Styling | Tailwind v4 + shadcn/ui | Fast, predictable |
| UI components | Radix primitives | Accessible by default |
| Testing | Vitest + Playwright | Already in repo |
| Job queue (P2) | Inngest | Serverless-native; cron + step retries |
| AI (P2) | Anthropic Claude (Sonnet drafter, Opus critic) | Caching support, JSON tool use |
| Observability | PostHog + Sentry | Free tiers cover early commercial |
| Email | Resend | Markdown templates, generous free tier |
| Hosting | Vercel (Hobby → Pro at first $1) | Familiar; ships fast |
| Repo | pnpm workspaces | Multi-package monorepo without Turbo overhead |

No exotic stack. No gRPC, no Protobuf, no Kubernetes, no DIY auth.

---

## Tech debt / known gaps (deliberate)

Phase 1 ships intentionally minimal. Things you'll see and want to "fix" — but don't, until Phase 2:

- **TF-IDF + Jaccard for suggestion dedup**, not embeddings. Adequate at Phase 1 volume; replaced in Phase 2.
- **No Inngest in Phase 1.** Quality-signal aggregation is a Vercel cron job (1 per day).
- **No SSO** in Phase 1 (Clerk magic-link is enough for early B2B pilots).
- **Stripe Payment Link only** for pre-orders, not full subscription billing. Real billing in Phase 2.
- **No SME role / two-eye gate** in Phase 1. POC B2B = shared catalogs with B2C.
- **No SOC2** — formal audit deferred until 5+ enterprise pipeline. Tenant isolation, audit log, soft-delete already designed in.
- **No cross-vendor critic** — Opus-on-Sonnet at v1; cross-vendor becomes a v2 escape hatch on first quality incident.

These are documented in §C12 of the plan as "what we deliberately did not do."

---

## Cadence & decision rights

- **Founder/operator** owns product priorities, customer convos, content authoring (in Phase 1 they're the SME).
- **Engineer/collaborator** owns architecture, code review gate, test gate, performance budgets.
- **External review:** every PR goes through a codex (gpt-5.5 with multi-vendor fallback) review workflow that posts a labeled comment. `codex-blockers` label = don't merge until addressed.
- **Async-first.** Sync is for unblocking, not status.
- **No standups.** PR descriptions and the codex review serve as the audit trail.

---

## What we're looking for

- Senior full-stack — comfortable with TS, Postgres, Next.js App Router.
- Opinionated about LLM evaluation and prompt engineering — not "let's prompt-tune" but "let's design the eval suite first".
- Comfortable with **shipping a paid product before adding hires** (this isn't a fund-the-team situation).
- Bias for shipping over architecting; suspicious of premature abstraction.
- Either a co-founder shape (equity-heavy, unpaid until revenue) or a first-hire shape (cash + small equity once Phase 1 hits the gate).

---

## What we are NOT looking for

- Someone who wants to refactor before shipping.
- Someone who wants to use this as their first AI/LLM project (we need pattern-recognition, not learning-on-the-job here).
- Someone who needs a salary in month 1 — Phase 1 has no revenue and no fundraising.
- Someone who wants to add another framework / language / orchestration layer to the stack.

---

## Next step

If this looks interesting:

1. **Read the detailed plan** ([`./content-pack-management-plan.md`](./content-pack-management-plan.md)) — focus on §C2, §C5, §C7, §C12.
2. **30-minute call** to talk about your projects + your read on this plan + what you'd change. No commitment from either side.
3. **If we click**, we agree on a Phase 1 scope you'd own (probably one of P1, P3, or P4).

**Contact:** [operator email] • [scheduling link]

---

## In one sentence

> *We've got a quality-loop architecture that solves the AI-content trust problem, a real validator library already in production use, and a discipline of not building the expensive part until paying intent is signed — and we're looking for one strong technical partner who'll help ship Phase 1.*
