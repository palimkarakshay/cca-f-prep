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
- `06-failure-analysis/error-log.md` — the F1–F8 taxonomy and 23 documented failure modes.
- `08-cheat-sheets/` — decision trees and anti-patterns the validators encode.
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
