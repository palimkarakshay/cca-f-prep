# Content Pack Management Platform — Build Plan

> **One file. Three audiences.** Section A is for anyone (5-minute read). Section B is for a business owner / advisor who never wants to see code. Section C is the technical hand-off — a senior architect (or capable AI) should be able to pick this up and start building from it without further context.

---

## Section A — Executive summary (plain English)

### What we are building

A learning platform that lets people study **content packs** — short, focused lessons grouped into catalogs (e.g. "AWS Cloud Practitioner", "GDPR for Product Managers", "Beginner Sewing"). Two markets share the same product:

- **Direct-to-consumer (B2C):** anyone signs up, picks a catalog, learns at their own pace.
- **Business (B2B):** companies buy access for their employees; their internal expert reviews the material before staff see it.

Learners can request topics they want covered. Those requests feed a queue; AI helps draft content; a human always reviews before publishing.

### How we'll build it (two phases)

We **deliberately split the build into two phases** so we don't spend money on AI before knowing whether anyone will pay:

1. **Phase 1 — Proof-of-concept (POC). Cost: essentially $0.**
   The platform itself does not generate AI content. The operator (you) authors content using **Claude Code locally**, which is already paid for via the existing Claude Max 20x subscription. The web platform is a polished delivery and admin tool — it stores, versions, and serves the content the operator authored offline. Goal of this phase: prove that learners want this, and prove that companies will pay for it. Success measured by **signed letters of intent (B2B) and pre-orders (B2C)**, not vanity metrics.

2. **Phase 2 — Commercial. Cost: ~$450–1000/month at planned scale.**
   Once Phase 1 has produced paying intent, we turn on in-app AI generation, billing, B2B controls (per-company catalogs, expert reviewers, two-eye approval), and proper enterprise features. Everything built in Phase 1 carries over without rewrites — the upgrade is purely additive.

### Where the work happens

The repo already has the bones of the learner web app at `web/` (Next.js, content-pack runtime, Playwright, Vitest, sample packs including the CCA-F study material itself). Phase 1 extends that scaffolding rather than starting fresh. A separate static **marketing site** (Astro) is added on a subdomain to host the value proposition and the lead-capture / pre-order forms.

### Rough timeline

Phase 1 lands in ~18 working days of focused build. Phase 2 ships incrementally over the following 4–8 weeks once Phase 1 demand is validated.

### Decision triggers worth knowing

| Trigger | What flips |
|---|---|
| First B2C paid pre-order or B2B signed LOI | Move learner app from Vercel Hobby (free) to Vercel Pro ($20/mo). Required by the host's terms of service. |
| Operator can't keep up with content demand | Turn on Phase 2's in-app AI generation. |
| First B2B contract requires per-company expert review | Activate the SME role and two-eye gate. |
| Quality incident from auto-publish | Switch reviewer model from Anthropic-only to cross-vendor. |

---

## Section B — Business plan (for a non-technical reader)

### B1. The product in 60 seconds

A content delivery platform with a learner-facing app and an operator-facing admin tool. Lessons are grouped into catalogs; each lesson has a short read and a 3-question quiz. Learners track progress across devices and can suggest topics. Companies (B2B) get group accounts where their administrator picks which catalogs their employees see, and an internal expert reviews drafts before publish.

What sets this product apart is **not the lessons themselves** — it is the loop that produces them: AI drafts the content, deterministic validators catch the common AI failure modes (biased answer distributions, fabricated facts, missing citations, weak distractors, spoilers), a stronger-model reviewer audits the drafter, and a human is always in the loop before publish. We have direct experience with these failure modes in the existing CCA-F study repo and have a documented taxonomy (the "F1–F8" cognitive failure modes) baked into the validators.

### B2. Markets and pricing intuition

| Segment | Who | Pricing intuition | Why they buy |
|---|---|---|---|
| B2C | Self-directed learners (e.g. cert candidates, hobbyists) | Free tier (5 catalogs, limited quiz attempts) + **Pro at $9/mo** | Cheaper and more focused than full course platforms; quizzes that aren't trash; ability to request topics |
| B2B | SMB and mid-market HR / L&D | **$5–15 per learner per month, $100/mo platform minimum** | Curated, expert-reviewed material; SSO; usage reporting; lower cost than custom-build |

Math at modest scale:
- 1000 paying B2C learners × $9 = **$9k MRR**
- 50 B2B tenants × 50 seats × $10 = **$25k MRR**
- Combined ≈ $34k MRR vs ~$600/mo infra ⇒ **gross margin > 95%** at this scale.

### B3. Cost structure

#### Phase 1 (POC) — operator already pays, infra is free

| Line | Vendor | Cost | Note |
|---|---|---|---|
| Hosting | Vercel Hobby | $0 | Free for non-commercial use |
| Database | Neon Postgres free | $0 | 0.5 GB |
| File storage | Cloudflare R2 free | $0 | 10 GB, no egress fees |
| Authentication | Clerk free | $0 | 10k monthly active users |
| Email (waitlist, notifications) | Resend free | $0 | 3k emails/mo |
| Analytics | PostHog Cloud free | $0 | 1M events/mo |
| Errors | Sentry Developer free | $0 | 5k events/mo |
| AI authoring | Claude Code via Max 20x | already paid | Operator drafts in their local CLI |
| Domain | registrar | ~$12/yr | One domain |
| **Total incremental** | | **~$1/mo** | |

#### Phase 2 (Commercial) — at 100 B2B tenants, 10k MAU, 50k generations/mo

| Line | Vendor | Estimated monthly | Note |
|---|---|---|---|
| Hosting | Vercel Pro | $20 | Commercial-use compliant |
| Database | Neon Scale | $19 | 10 GB, autoscaling |
| File storage | Cloudflare R2 | ~$5 | First 10 GB free |
| Auth | Clerk Pro | $25+ | Above 10k MAU adds $0.02/MAU |
| Job queue | Inngest Pro | $20 | 200k step runs/mo |
| **AI generation (Sonnet drafter)** | Anthropic API | ~$200 | With prompt caching |
| **AI review (Opus critic)** | Anthropic API | ~$100 | Smaller outputs but pricier model |
| Embeddings (search, dedup) | Voyage | ~$10 | Or self-host |
| Analytics | PostHog | $0–50 | Stays free under 1M events |
| Errors | Sentry Team | $26 | |
| Email | Resend Pro | $20 | 50k emails |
| Stripe fees | Stripe | 2.9% + $0.30 / charge | Revenue cost, not OpEx |
| Domain + SSL | various | ~$2 | |
| **Total infrastructure** | | **~$450–1000/mo** | AI is the dominant line |

The AI cost line is the one to watch. The hard cap is per-tenant monthly token budgets, enforced server-side, with a UI burn-meter so admins see their usage.

### B4. Risks that could kill this commercially

1. **AI cost spirals.** A tenant could re-trigger generation per learner. *Mitigation: per-tenant monthly budget cap; UI shows burn rate.*
2. **Enterprises won't trust AI content unreviewed.** *Mitigation: B2B default is human-required; auto-publish is opt-in per catalog.*
3. **Bad-quality content erodes trust faster than no content.** *Mitigation: deterministic validators + reviewer model + post-publish quality signals; "pause-not-pull" any flagged question for new sessions, never mid-quiz.*
4. **Vendor lock-in (Clerk, Inngest).** *Mitigation: data shapes are portable; migration paths documented but not pre-built.*
5. **Compliance blockers (SOC2, GDPR) on first big B2B sale.** *Mitigation: tenant isolation, audit log, soft-delete, data export designed in from Phase 1; formal SOC2 deferred until 5+ enterprise pipeline.*

### B5. Decision points the operator faces

| Decision | When | Trigger |
|---|---|---|
| Move from Vercel Hobby to Pro | At first paying customer / signed LOI | Host's terms of service |
| Turn on in-app AI generation | When operator's authoring backlog grows beyond ~1 week | Operator burnout signal |
| Add the SME / expert-review role | First B2B contract requires per-company review | Sales requirement |
| Pursue formal SOC2 | 5+ enterprise pipeline | Sales blocker named in 2+ deals |
| Switch the AI reviewer to a different vendor | First quality incident reaching learners | Post-mortem finding |

### B6. Go-to-market and Phase 1 success metric

The Phase 1 success metric is **paying intent**, captured in two ways:

- **B2B:** "Request a pilot" form on the marketing site → operator follow-up call → signed LOI. Success target before Phase 2 spend: **3 signed LOIs**.
- **B2C:** "Get early access" waitlist + a refundable Stripe pre-order ($9). Success target: **50 waitlisted, 10 pre-orders**.

The marketing site is built with Astro (separate static site at `www.<domain>`), the learner+admin app at `app.<domain>`. The marketing site's only forms are the lead-capture and pre-order CTAs — those are the metric.

### B7. End of Section B

A non-technical reader can stop here. The rest of the document is technical implementation detail for the next builder.

---

## Section C — Technical implementation (architect / AI hand-off)

This section is **self-contained**. A senior architect (or AI agent) starting fresh on the repo should be able to read from C1 to C12 and have everything needed to build Phase 1 without further dialog.

### C1. Repo state today

```
/home/user/cca-f-prep
├── 00-academy-basics/ … 09-progress-tracker/   ← study material (not the platform)
├── docs/                                       ← static curriculum site (GH Pages)
└── web/                                        ← THIS is where the platform lives
    ├── src/
    │   ├── app/        (Next.js App Router)
    │   ├── content/    (curriculum types, schema)
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   └── __tests__/
    ├── content-packs/
    │   ├── cca-f-prep/      (existing curriculum content)
    │   ├── sample-pack/
    │   └── sewing-beginners/
    ├── e2e/                  (Playwright)
    ├── playwright.config.ts
    ├── vitest.config.ts
    └── vercel.json
```

A platform skeleton exists in `web/`. **Phase 1 extends this skeleton; do not start a new project.** The `content-packs/` directory is the canonical local source of pack JSON during early development; Phase 1 migrates this into Postgres + R2.

### C2. Hard constraints

1. **Phase 1 must run on free tiers everywhere.** The only paid line item is the operator's existing Claude Max 20x subscription.
2. **Claude Max 20x funds Claude Code (the local CLI), not Anthropic API.** Therefore the **Phase 1 web app makes zero Anthropic API calls** — no in-app generation, no critic, no embeddings.
3. **Phase 1 → Phase 2 must be additive, not a rewrite.** Same data model, same auth, same hosting; Phase 2 adds tables, jobs, billing, but doesn't change what Phase 1 already wrote.
4. **B2B and B2C share the same platform.** Tenancy is in the schema from day 1, even though Phase 1 only exercises a single-tenant code path.
5. **Vercel Hobby is OK for Phase 1 while pre-revenue.** The trigger to move to Pro is the first paid customer or signed LOI — pre-buy Pro at the moment of signature.

### C3. Locked decisions (carry-over from prior rounds; do not re-litigate)

- POC = free + Max 20x; **no Anthropic API calls from server**.
- Postgres (Neon) + Cloudflare R2 (not GitHub) for canonical storage.
- **Clerk** for auth.
- **Single Next.js app** with route groups `(public) / (learner) / (admin)` for POC. Split into separate apps only if the admin bundle bloats > 1 MB gzipped in commercial.
- **Drizzle** ORM; **RLS at the DB layer**; tenant context via Neon HTTP driver to avoid pool reuse leaks.
- Validators are a shared library reused across local lint, server-side import, and (later) the commercial critic stage.
- HITL defaults: B2B human-required, B2C confidence-routed (commercial only).
- **Pause-not-pull** on quality signal failures: a flagged question hides for new sessions only; in-flight quizzes hold their version snapshot.
- **Pinned-version imports** for cross-tenant catalogs (commercial v2 only).
- **B2B in POC = shared-catalog only.** No per-tenant catalogs, no SME role, no two-eye gate in POC. B2B tenants in POC are just Clerk Organizations grouping employees.
- **POC success metric = paying-customer LOIs (B2B) or pre-orders (B2C).** Build the LOI/pre-order capture surface from day one.
- **Commercial critic = Opus critiques Sonnet.** Same family but stronger model on the critic side. Cross-vendor critic stays as a v2-commercial escape hatch.
- **Marketing site = separate Astro static site on `www.` subdomain.** App stays at `app.` subdomain.

### C4. POC architecture (what you build in Phase 1)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Astro marketing site (separate Vercel project)                          │
│   - 5–6 pages: home, B2B, B2C, pricing-preview, about, blog stub         │
│   - LOI form (B2B) + waitlist form (B2C) + Stripe pre-order Payment Link │
│   - Forms POST to /api/leads on the app subdomain                        │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  Single Next.js app on Vercel Hobby (`app.<domain>`)                     │
│  Route groups:                                                           │
│    (public)   /                ← landing + signup                        │
│    (learner)  /catalogs/...    ← browse, lessons, quizzes, progress      │
│    (admin)    /admin/...       ← operator-only: import, suggestions, etc │
│  Auth: Clerk (single org for B2C; per-org for early B2B pilots)          │
└──────────────────────────────────────────────────────────────────────────┘
              │                     │                     │
              ▼                     ▼                     ▼
       ┌────────────┐       ┌──────────────┐      ┌──────────────────┐
       │ Postgres   │       │ Cloudflare R2│      │ PostHog (events) │
       │ (Neon)     │       │  pack JSON   │      │ Sentry (errors)  │
       │  metadata  │       │  knowledge   │      │ Resend (email)   │
       │  RLS by    │       │  files       │      │                  │
       │  tenant    │       │              │      │                  │
       └────────────┘       └──────────────┘      └──────────────────┘

OPERATOR-LOCAL (off-platform, paid by Max 20x):
       ┌──────────────────────────────────────────────────────┐
       │ Operator's machine                                   │
       │  - Claude Code                                        │
       │  - cca-f-prep repo with /packages/shared validators   │
       │  - Knowledge files                                    │
       │  - Slash command /draft-topic                         │
       │  - Output: validated JSON pasted into /admin          │
       └──────────────────────────────────────────────────────┘
```

#### C4.1 Operator authoring loop (the "no API cost" trick)

1. Operator runs Claude Code in the cca-f-prep repo (paid by Max).
2. A repo-local skill `/draft-topic` prompts Claude with the curriculum schema, F1–F8 anti-patterns, closed-list whitelists, and any in-scope knowledge files.
3. Claude drafts a JSON payload (concept + lesson + 3-question quiz, or a section).
4. Local validator script `pnpm lint:draft drafts/<slug>.json` runs Zod + bias + spoiler + cross-ref checks (the same shared validators the server uses).
5. Operator pastes the JSON into `/admin/catalogs/[id]/import`.
6. Admin re-runs validators server-side (defense in depth), shows a diff vs the current published version, asks for confirm.
7. On confirm: writes a new `catalog_version` row + new R2 blob + flips `catalog.current_version_id`. Calls `revalidateTag(catalog:${id})` so learners see the new content on next request.

#### C4.2 Admin app (Phase 1)

- **Dashboard:** suggestion queue, recent imports, learner counts, **lead funnel from marketing site**.
- **Catalogs:** create / archive / version history / rollback (re-point `current_version_id`).
- **Import draft:** paste JSON, see validator results, see diff, publish or save as draft.
- **Lint mode:** runs all validators against the current published version of any catalog (catches latent issues like the cca-f-prep B-bias).
- **Suggestions:** triage list (open / accepted / dismissed / linked-to-existing); admin can mark "in progress in Claude Code" so learners see "we heard you".
- **Knowledge files:** upload / list / delete (used as context the operator pastes into Claude Code). Stored in R2.
- **Leads:** list of B2B LOI requests + B2C waitlist + pre-orders; export CSV.
- **Settings:** tenant policy (catalog visibility default, suggestion rate limit, per-question failure threshold).

#### C4.3 Learner app (Phase 1)

- Sign up / sign in via Clerk (email-link).
- `/` shows public catalogs (visibility = `public`) plus tenant-private catalogs the user has access to.
- Catalog page lists concepts; concept page shows lesson + 3-question quiz.
- Progress synced to Postgres on quiz attempt; localStorage warm cache.
- Search across accessible catalogs (Postgres `tsvector`).
- "Suggest a topic" button at every concept and at catalog level; submission filtered by length + closed-list of disallowed tokens.
- "Report this content" button on every concept (writes a special-kind suggestion).
- Mobile-first; Lighthouse mobile target ≥90.

#### C4.4 Marketing site (Phase 1, Astro)

- Workspace at `marketing/` (sibling to `web/`).
- Astro 5; deployed as a separate Vercel project pointing at the `marketing/` workspace.
- Domain DNS: `www.<domain>` → Astro project; `app.<domain>` → Next.js app.
- Shared design tokens via a tiny `@cca/design-tokens` package (Tailwind v4 vars).
- Pages: home, /b2b, /b2c, /pricing-preview, /about, /blog (stub).
- Forms POST to `https://app.<domain>/api/leads` (Astro and the app share an origin via DNS but are separate Vercel projects; CORS allowed).
- Stripe **Payment Link** embedded as a CTA "Reserve a Pro seat for $9 (refundable)". Money flow flips the app's hosting trigger to Vercel Pro; the marketing site itself stays on Hobby.

#### C4.5 Phase 1 explicit non-goals

- **No** in-app AI generation.
- **No** async pipeline / Inngest / cron jobs (other than the post-publish quality-signal aggregator, a daily cron that fits within Vercel Hobby's 2/day cap).
- **No** SSO (Clerk magic-link is enough for B2C and B2B pilots).
- **No** subscription billing in-app (waitlist + Stripe Payment Link only).
- **No** cross-tenant catalog sharing / marketplace.
- **No** embedding-based suggestion dedup (use TF-IDF + Jaccard).
- **No** critic, no confidence routing (operator's eyes are the gate).
- **No** SME role, no two-eye gate, no per-tenant catalogs.

### C5. Commercial architecture (Phase 2 — additive on Phase 1)

Each item below ships behind a feature flag, in this order:

1. **Vercel Pro.** Trigger: first paid customer / signed LOI.
2. **In-app AI generation pipeline (Inngest + Anthropic API):**
   - `/admin/generate` form (topic, scope, knowledge files, model choice).
   - Inngest sequence: `generate → validate → critique → route → (optionally) publish`.
   - **Sonnet** default drafter; **Opus** as the critic. Caching on system prompt.
   - Per-tenant monthly token budget; UI burn meter; alerts at 80% / 100%.
   - Per-user daily generation rate limit.
3. **Critic stage (Opus reviewer):**
   - Reviewer prompt against the generator's output.
   - Output `{ confidence: 0..1, findings: [...], suggested_edits: ... }`.
   - **Answer-justification audit** for quizzes: model points at the knowledge-file span justifying the marked answer; refuse to publish if no span found.
4. **Confidence routing & sampled spot-check:**
   - B2C: confidence ≥ 0.85 → auto-publish; 1-in-20 sampled to operator queue (calibration only, not rollback).
   - B2B: human-required; admin can opt in to confidence routing per catalog.
5. **B2B features:**
   - Clerk Organizations active; per-tenant catalog visibility.
   - **SME role** (review-only) gated separately from admin.
   - **Two-eye gate** option: admin + SME both must approve before publish.
   - SAML / SCIM SSO via Clerk's enterprise tier on demand.
6. **Billing (Stripe):**
   - B2C: free tier (5 catalogs, 100 quiz attempts / month) + Pro $9/mo.
   - B2B: per-seat pricing with $100/mo platform minimum; quoted per-tenant for v1.
   - Stripe webhook → `tenant.plan` updates.
7. **Embedding-based suggestion dedup:** Voyage `voyage-3-lite` or OpenAI `text-embedding-3-small`; cosine similarity + keyword overlap + admin synonyms. Replaces Phase 1 TF-IDF.
8. **Post-publish quality signals:** `question_signal` aggregated nightly. Threshold: ≥30 attempts and <30% correct → pause that question for new sessions, queue for human review.
9. **Calibration loop:** up to 8 most-recent rejections per tenant kept as few-shot examples; older ones summarised into anti-pattern rules (bounded growth — never let the prompt grow unboundedly).
10. **Cross-tenant catalog import (v2 commercial only):** B2B admin imports a B2C public catalog, **version-pinned**. "Update available" banner when source publishes a new version; admin chooses to upgrade.
11. **Observability:** PostHog dashboards (lessons, quizzes, suggestions, generation cost per tenant); Sentry on admin and learner; cost dashboard with per-tenant token spend, quotas, alerts.

#### C5.1 Migration matrix Phase 1 → Phase 2

| Layer | Phase 1 | Phase 2 change |
|---|---|---|
| Routes | route groups in one Next.js app | Same. Optionally split if admin bundle > 1 MB gzipped. |
| Postgres | Neon free | Bump plan; new tables: `inngest_state`, `embedding`, `subscription`. No schema breaks. |
| R2 | one bucket, public-prefix only | Add `private/` prefix with presigned URLs for B2B-private catalogs. |
| Auth | Clerk free | Clerk Pro; Organizations active everywhere; SAML on enterprise tier. |
| AI | none | Anthropic API (Sonnet drafter + Opus critic) + Inngest. |
| Validators | shared lib already | Same lib reused inside critic + post-publish lint. |
| Billing | none | Stripe; `tenant.plan` gated by webhook. |
| Calibration capture | none (Phase-1 progress timestamps only) | JOL pre-answer + calibration Δ written to skills-matrix-equivalent server table; surfaced in dashboard stats panel (LM6). |
| Spaced-review surface | schema only (`09-progress-tracker/spaced-review.md` is paper-only) | Server-side scheduler; dashboard banner; expanding-interval queue; leech rule (LM1). |

Nothing in Phase 1 is thrown away.

### C6. Data model

Existing tables (carry forward unchanged): `tenant`, `user`, `tenant_member`, `catalog`, `catalog_version`, `progress`, `suggestion`, `draft`, `knowledge_file`, `event`, `question_signal`.

**New / changed for Phase 1:**

```sql
-- Lead capture (consequence of LOI/pre-order success metric)
lead (
  id uuid pk,
  kind text check (kind in ('b2b_pilot','b2c_waitlist','b2c_preorder')),
  email text not null,
  org_name text,
  org_size text,
  use_case text,
  source text,                       -- utm_source, etc.
  stripe_payment_intent_id text,     -- only for b2c_preorder
  created_at timestamptz default now()
);

-- Per-tenant policy (replaces hardcoded thresholds)
tenant_policy (
  tenant_id uuid pk references tenant,
  approval_mode text check (approval_mode in ('always-human','confidence-routed','auto-publish')) default 'always-human',
  confidence_threshold numeric default 0.85,
  spot_check_rate numeric default 0.05,
  two_eye_gate boolean default false,
  generations_per_user_per_day int default 10,
  suggestions_per_user_per_day int default 10,
  monthly_token_budget_usd numeric,
  rule_overrides jsonb
);
```

**New for Phase 2 (commercial):**

```sql
-- Cross-tenant pinned imports (v2 commercial only)
catalog_import (
  importer_tenant_id uuid references tenant,
  source_catalog_id uuid references catalog,
  pinned_version_id uuid references catalog_version,
  imported_at timestamptz,
  primary key (importer_tenant_id, source_catalog_id)
);

-- Anti-pattern rules learned from rejections (bounded; replaces unbounded few-shot growth)
calibration_rule (
  id uuid pk,
  tenant_id uuid references tenant,
  rule_text text,
  source_rejection_ids uuid[],
  created_at timestamptz
);
```

**RLS policy template** (apply to every tenant-scoped table):

```sql
alter table catalog enable row level security;
create policy tenant_isolation on catalog
  using (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Required test:** seed a 2-tenant DB and assert that a query without `app.tenant_id` set returns 0 rows. Wire this as a first-class integration test in `vitest.config.ts`.

### C7. HITL design (refined)

#### What humans decide (only one of three)

1. **Approve** — content goes live as drafted.
2. **Approve with edits** — content edited inline; goes live edited.
3. **Reject with reason** — reason becomes a few-shot example, then an anti-pattern rule.

Everything else (running validators, computing confidence, picking which drafts the human sees) is automated.

#### Who feeds the human queue

- **Phase 1:** every draft (operator does it all anyway).
- **Phase 2 B2B default:** every draft (human-required).
- **Phase 2 B2C default and B2B-opt-in:** drafts where any of: critic confidence < 0.85, OR any deterministic validator failed, OR answer-justification audit failed, OR sampled spot-check (1-in-20 of auto-published, calibration only).

#### Anti-pattern guardrails

- "AI tells the human everything is fine" risk: critic + generator both miss the same blind spots. Mitigations:
  - Phase 2 v1: Opus critic on Sonnet drafts (stronger reviewer in the same family).
  - Phase 2 v2 escape hatch: cross-vendor critic via OpenRouter, activated post quality incident.
  - Deterministic validators are vendor-independent and catch the F1–F8 cognitive failure modes regardless of model.

#### Why this minimises human work

At realistic commercial scale (50 generations/day per tenant, ~95% pass auto-publish thresholds), the human queue is ~2–3 drafts/day per tenant, ~1–2 minutes each given pre-computed findings and side-by-side diff. Net: **~10 minutes/day of SME time per tenant**.

The human queue also exposes per-SME blind-spot dashboards aggregated
from critic-feedback over time (cross-ref § D2 SM8 / § D3). Rejection
reasons feed back as personalised authoring prompts, not just one-off
corrections — closing the deliberate-practice feedback loop (Ericsson
1993).

### C8. Risk register

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| 1 | API cost spirals (Phase 2) | M | H | Per-tenant monthly budget; per-user daily rate limit; UI burn meter; alerts at 80%. |
| 2 | Tenant data leak via RLS bug | L | H | RLS policies + integration test + Neon HTTP driver (no pool reuse) + code review checklist. |
| 3 | Vercel Hobby ToS violation at first paid customer | M | M | Pre-buy Vercel Pro at first signed contract; trigger documented. |
| 4 | AI hallucination reaches learner | M | H | Validators + critic + answer-justification audit + post-publish signals; B2B defaults to human-required. |
| 5 | Inngest vendor lock | L | M | Vercel Cron + DB queue is fallback; ~3 days of work to migrate. |
| 6 | Clerk vendor lock | L | M | Auth.js + WorkOS migration documented but not pre-built. |
| 7 | PDF parser supply chain | L | M | `unpdf` (active fork) pinned; sandbox in serverless; quarantine on failure. |
| 8 | Suggestion spam / abuse | M | L | Length + closed-list filter at submit; rate limit; AI moderation in Phase 2. |
| 9 | Operator burnout (Phase 1 manual authoring) | M | M | Slash command + validators ≈ 10 min/topic; Phase 2 in-app generation is the relief valve. |
| 10 | No revenue path validated before Phase 2 spend | H | H | Phase 1's job is to validate willingness to pay. Hard gate before any AI cost is incurred. |
| 11 | Compliance blocker on first enterprise sale | M | H | Tenant isolation + audit log + data export designed in from Phase 1; SOC2 deferred until 5+ pipeline. |
| 12 | "Pause-not-pull" UX confusion mid-quiz | L | L | Active quiz attempt holds its version snapshot; pause only affects new sessions. |
| 13 | Anthropic Max 20x policy change re: Claude Code use | L | H | Stay within ToS (single operator, own subscription); document in CLAUDE.md. |

### C9. Critical files

#### Read first (no edits in Phase 1 P1)

- `/CLAUDE.md`
- `/web/src/content/curriculum-types.ts`
- `/web/content-packs/cca-f-prep/curriculum.ts`
- `/06-failure-analysis/error-log.md` (F1–F8 codes for the future critic prompt)
- `/scripts/codex-review-validate.py` (regex source for `secret-scan`)

#### Created in Phase 1

- `/package.json` — workspace root (pnpm workspaces)
- `/packages/shared/{src,package.json}` — schema, validators, F1–F8 rules
- `/packages/shared-ui/{src,package.json}` — `LessonView`, `QuizRunner`
- `/packages/db/{src,package.json}` — Drizzle schema, queries with `withTenant(...)` helper
- `/packages/design-tokens/` — Tailwind v4 vars shared by `web/` and `marketing/`
- `/web/src/app/(public)/...` — landing, signup
- `/web/src/app/(learner)/...` — catalogs, lessons, quizzes, suggestions
- `/web/src/app/(admin)/...` — operator tools (catalogs, import, lint, suggestions, leads, settings)
- `/web/src/middleware.ts` — Clerk middleware + tenant context
- `/web/src/server/r2-client.ts` — R2 SDK wrapper (read/write/presign)
- `/web/src/server/with-tenant.ts` — `SET LOCAL app.tenant_id` helper using Neon HTTP driver
- `/web/src/app/api/leads/route.ts` — POST handler for marketing-site forms
- `/web/src/app/api/stripe-webhook/route.ts` — Stripe webhook for pre-order tracking
- `/marketing/` — Astro site (separate Vercel project)
- `/scripts/seed-from-existing-packs.ts` — one-time migration of `web/content-packs/*` into Postgres + R2
- `/scripts/lint-draft.ts` — local validator runner used by the operator's Claude Code loop
- `/.claude/skills/draft-topic/` — repo-local skill that prompts Claude to draft & validate

#### Created in Phase 2

- `/web/src/inngest/...` — `generate` / `validate` / `critique` / `publish` step handlers
- `/web/src/server/anthropic-client.ts`
- `/web/src/server/critic-prompts.ts`
- `/web/src/server/billing-stripe.ts`
- `/web/src/app/(admin)/sme/...` — SME-role review queue

### C10. Phase 1 sequencing (for the next builder)

| Phase | Days | Deliverable |
|---|---|---|
| **P1** | ~3 | Monorepo + Drizzle schema + Clerk + R2 wired in `web/`. RLS test passing. |
| **P2** | ~3 | Astro marketing site at `marketing/`, deployed; LOI / waitlist / Stripe pre-order links working; `/api/leads` storing rows; Resend confirmation emails. |
| **P3** | ~4 | Learner app: catalog browse, lesson page, quiz runner, progress, search, suggestion submit. Mobile Lighthouse ≥90. |
| **P4** | ~4 | Admin app: import draft, server-side validators, version diff, lint mode, suggestions queue, knowledge file upload, leads dashboard. |
| **P5** | ~2 | Operator authoring loop: `/.claude/skills/draft-topic` skill, `pnpm lint:draft` script, seeding script that imports `web/content-packs/cca-f-prep` into Postgres + R2. |
| **P6** | ~2 | Verification: 10-step end-to-end (C11), Lighthouse, RLS isolation test, accessibility pass on marketing forms. |

**Total: ~18 working days for a Phase 1 that costs $0 to run, decisively measures willingness to pay, and migrates additively to Phase 2.**

### C11. Verification

#### Phase 1 end-to-end (must pass before declaring P6 done)

1. Sign up two test accounts; one B2C learner, one operator.
2. Operator creates a catalog "test", imports one concept (sample JSON in `/scripts/seed-pack.json`).
3. Learner sees the catalog, takes the quiz, progress is recorded.
4. Learner submits a suggestion; operator sees it in the queue.
5. Operator runs `/draft-topic <suggestion>` in Claude Code, gets JSON, validators pass, imports.
6. Learner refreshes, sees the new concept; receives an in-app notification "your suggestion is live."
7. Lint mode flags any latent bias in the seeded content (e.g. cca-f-prep B-bias).
8. Rollback: import a v2 of a concept, then rollback to v1; learner sees v1 on next request.
9. Multi-tenant isolation: operator B (separate Clerk org) cannot see operator A's drafts (RLS test).
10. Lighthouse mobile score ≥90 on `/catalogs/test`.
11. **Marketing-side metric loop:** submit B2B LOI form on `www.` site → row appears in admin `/admin/leads` within 2s.
12. **Pre-order loop:** click Stripe Payment Link → complete test charge → webhook fires → `lead.kind = 'b2c_preorder'` row written with `stripe_payment_intent_id`.

#### Phase 2 verification additions

13. Generate a quiz via `/admin/generate`; SSE streams; validators run; critic returns confidence; auto-publish at confidence ≥0.85.
14. Force a low-confidence draft; ends up in human queue; reviewer approves with edits; goes live.
15. Per-user rate limit: 11th generation in a day rejected.
16. Per-tenant budget cap: 80% threshold shows banner; 100% blocks generation.
17. B2B human-required: new draft cannot be auto-published even at confidence 0.99.
18. Two-eye gate: admin approval + SME approval both required.
19. Calibration: rejected draft's reason appears in next generation's prompt within ~1 min.
20. Quality signal: simulate 30 attempts on a question with 20% correct rate → question paused for new sessions.
21. Stripe upgrade → `tenant.plan` flips → quota lifted.
22. Cross-tenant import (v2 commercial): pinned version doesn't drift when source publishes a new version.
23. **Cohort retention curves** visible in operator dashboard: D1, D7, D30 plotted per-cohort; targets per § D4 (D7 ≥ 40%, D30 ≥ 35% on cohort tier).
24. **Calibration-Δ trend** visible per-tenant: weekly snapshot stored; |Δ| trending toward 0.5 over 8-week window.
25. **Leech-rule operation:** an item missed ≥ 3 times by a learner is auto-routed to error-log-equivalent table; demoted to mastery rung 1; "rewrite the concept" task surfaced.
26. **Drafter intake gates the 5 CTA probes** (§ D2 SM1): publish blocked if any of (novice-error, principle, worked-example pair, boundary case, nearest confusable) is empty.
27. **TTFV — learner ≤ 5 min** sign-up to first quiz pass measured on test cohort.
28. **TTFV — SME ≤ 1 hour** CTA intake to publishable lesson measured on operator + first paying SME.

### C12. Appendix — Issues fixed from earlier plan rounds

This plan is the third pass. Earlier rounds had these issues; record them so the next builder knows the rationale (and doesn't re-introduce them):

| # | Earlier claim | Why it was wrong | What this plan does |
|---|---|---|---|
| 1 | "POC uses Anthropic API with Sonnet default" | Violates the free-tier constraint | POC: zero API calls; authoring via Claude Code locally. |
| 2 | "Vercel Blob with signed URLs for private B2B" | Vercel Blob has no native signed URLs | Cloudflare R2 + presigned URLs (or proxied through auth-checked API route). |
| 3 | "Vercel Hobby for the POC indefinitely" | Hobby ToS forbids commercial use | Pro flips at first paid / signed customer. |
| 4 | "70% input-token savings via prompt caching" | 5-min default TTL ⇒ misleading at sporadic traffic | Don't promise 70%; assume 30–60% at sustained traffic. |
| 5 | "Self-consistency check by regenerating the answer key" | Hand-wavy; true self-consistency = N samples × cost | Replaced with answer-justification audit + distractor differentiation. |
| 6 | "B2B silently imports B2C catalog" | Compliance disaster on regulated B2B | Pinned-version imports; "update available" prompt. |
| 7 | "Drizzle RLS via SET LOCAL with pool reuse" | Connection-pool reuse on Neon serverless leaks tenant context | Use Neon HTTP driver (fresh connection per request); add isolation test. |
| 8 | "Inngest free 50k runs covers POC" | Step-counted, tight at scale | POC has no queue; Phase 2 monitors step count, fallback = Vercel Cron + DB queue. |
| 9 | "HITL with auto-publish on high confidence" | Wrong default for B2B | B2C confidence-routed; B2B human-required by default. |
| 10 | "Calibration appends rejections as few-shot indefinitely" | Prompt grows unbounded | Cap at 8 recent; older ones summarised into anti-pattern rules. |
| 11 | "Embedding-based dedup at POC" | Adds API spend | POC: TF-IDF + Jaccard. Phase 2: embeddings. |
| 12 | "Spot-check rolls back published content" | UX consequences mid-quiz | Spot-check is calibration only; rollback only on explicit admin action or hard quality threshold. Pause-not-pull. |
| 13 | "pdf-parse for knowledge files" | Unmaintained, security issues | `unpdf` (Mozilla pdf.js wrapper). |
| 14 | "Per-API-call rate limit only" | Suggestion submit also costs | Two-tier rate limits: submit + generate. |
| 15 | "Codex review on every PR" | Inherited from cca-f-prep; calls paid APIs from CI | POC: codex workflow disabled or defer-only. Paid only at Phase 2. |
| 16 | "PostHog 1M events/mo" | Per-keystroke events blow this fast | Tight event taxonomy: ~10 event types, no per-millisecond timing. |
| 17 | "Clerk Organizations free at any scale" | Org count limit (~100 free) | Document migration path to Auth.js + WorkOS; do not pre-build. |
| 18 | "Three Next.js apps in monorepo" | Eager-architecting; more deploys, more auth surfaces | One app, route groups; split only when admin bundle bloats. |
| 19 | "Marketing site optional" | True earlier, but POC success metric needs it | Astro marketing site is a Phase 1 deliverable. |
| 20 | "Cross-tenant catalog import in v1 commercial" | Adds complexity, billing implications | Deferred to v2 commercial. |
| 21 | "Postgres canonical with RLS" | Sound. | Kept. |
| 22 | "GitHub repo per pack family" | Already dropped earlier | Stays dropped. |
| 23 | "User suggestions with no moderation" | Spam vector | Length + closed-list filter at submit + rate limit; AI moderation in Phase 2. |

---

## Section D — Learner Absorption & SME-Elicitation Strategy

This section is the load-bearing pedagogical and commercial thesis of the
platform. It ties Phase-2 product surfaces to peer-reviewed cognitive-
psychology and instructional-design research, so every retention or
SME-effectiveness claim made in the decks is grounded in named evidence
and a measurable benchmark delta.

The methodology layer (`08-cheat-sheets/training-methodology.md`,
`08-cheat-sheets/decision-trees.md`, `09-progress-tracker/spaced-review.md`,
`09-progress-tracker/skills-matrix.md`, `06-failure-analysis/error-log.md`)
defines the doctrine. This section translates the doctrine into Phase-2
commitments, critic-prompt design, Kirkpatrick L1–L4 measurement, TTFV
acceptance criteria, segment-specific wedges, mechanism rationale, and
the business-case foundation.

### D0. Problem catalogue & feature-mitigation matrix

The single canonical mapping the rest of § D elaborates. Every row reads
**identified problem → specific app/platform feature that mitigates →
source**. Same shape across the five plans/-folder documents (this plan
plus the four decks) so a reader can audit the chain end-to-end.

#### Learner-side: retention + absorption problems (L1–L8)

| # | Identified problem | Specific platform feature | Source |
|---|---|---|---|
| **L1** | Knowledge decays exponentially without review (~25% retained at day 6) yet the spaced-review queue is invisible to the learner | **`SpacedReviewBanner.tsx`** widget at top of `/[packId]/` dashboard — surfaces 3 oldest due items with one-tap "Start review"; expanding-interval scheduler (1/3/7/14/30d) in `web/src/lib/spaced-review.ts`; cron-driven nightly enqueue; +1d reset on miss, leech rule on 3+ misses (LM1) | Cepeda et al. 2008 *Psych Sci*; Cepeda 2006 (254-study meta); Murre & Dros 2015 (Ebbinghaus replication) |
| **L2** | Streak is computed but never used as a return-trigger; daily intent decays without an external prompt | **Streak counter** in `web/src/components/layout/Header.tsx` + **web-push notification** anchored to user's modal study-time (variable-ratio cadence to avoid extinction); streak-freeze affordance; email-digest fallback when push not granted (LM7) | Eyal 2014 (Hook Model — trigger phase); Fogg B = MAP (prompt leg); Skinner variable-ratio reinforcement; Mazal 2022 / Duolingo: CURR +21%, DAU 4.5× |
| **L3** | Lesson "depth toggle" is re-reading, which produces a fluency illusion (high JOL, low actual recall) — not learning | **Mid-lesson `RetrievalGate` primitive** in `LessonView.tsx`: body hidden until learner types a recall sentence; **principle-write field** in `QuizRunner.tsx` before answer reveal (generation effect) (LM2 + LM3) | Roediger & Karpicke 2006 (~50% lift on 1-week delayed test); Karpicke & Blunt 2011 *Science*; Slamecka & Graf 1978 (generation effect ~+30%); Bjork & Bjork 2011 (stability vs fluency) |
| **L4** | Mocks are flat 60-Q lists; the real exam is 4 scenarios × 15 questions, so practice fails encoding-specificity / transfer-appropriate processing | **`MockExamPage.tsx`** restructured to scenario-anchored: 4 scenarios × 15 Q with persisted scenario-context across the block; transfer-format variety per scenario; flat mocks deprecated to "warmup" tier | Bjork; Barnett & Ceci 2002 (taxonomy of transfer); encoding-specificity principle |
| **L5** | No metacognitive calibration capture — "predict-then-test" is described in methodology but never instrumented; learners can't see Dunning-Kruger gap close | **JOL 1–5 slider** in `QuizRunner.tsx` before reveal; **calibration-Δ column** in `StatsPanel.tsx`; weekly trend persisted; \|Δ\| > 1 triggers a generation-effect drill at +1d (LM6) | Dunlosky & Bjork (handbook of metamemory); Kruger & Dunning 1999; Kalyuga 2003 (expertise-reversal sets the under-confident remediation) |
| **L6** | Letter-bias (~76% B in concept quizzes) was tracked as `letter-bias-2026-05` but uncommitted; learners build a positional cue rather than principle reasoning | **Pre-publish content-lint validator** (`packages/shared/src/validators.ts`) rejects MCQ sets with > 55% any single letter or with shorter-distractor patterns; F12 (cue-bias) added to error-log doctrine; admin app blocks publish on lint fail | Cue-validity / spurious-cue learning literature; F12 doctrine in `06-failure-analysis/error-log.md` |
| **L7** | Interleaving is documented but not enforced; learners (and SMEs scheduling content) default to blocked practice, which transfers ~30% worse | **Recommender constraint** in `web/src/lib/recommendation.ts`: `nextPick.subArea !== lastPick.subArea`; rotation forced ≥ 2 sub-areas per session; weekly-cohort calendar interleaves (LM4) | Rohrer & Taylor 2007 (63% shuffled vs 20% blocked at 1-week delayed test); Bjork desirable difficulties |
| **L8** | No social / cohort surface; the SDT relatedness need is unmet — the single largest gap between MOOC (3–10% completion) and cohort-based courses (Maven 96%) | **Per-cohort routes** under `/[packId]/cohort/[cohortId]/`; **peer-comparison panel** + **group leaderboard** primitive; weekly-cohort live touchpoint slot; cohort-completion email (LM8) | Ryan & Deci (Self-Determination Theory — relatedness); Maven W1→W2 96% vs MOOC 16% (14× retention multiplier); Reich & Ruipérez-Valiente 2019 *Science* |

#### SME-side: knowledge-sharing effectiveness problems (S1–S8)

The unifying thesis: SMEs are not bad teachers — Cognitive Task Analysis
finds they omit ~70% of decisions when self-narrating (Clark, Feldon, van
Merriënboer, Yates & Early). The platform substitutes structured
elicitation for the missing tacit-knowledge transfer, so SMEs share more
without needing to *learn how to teach*.

| # | Identified problem | Specific platform feature | Source |
|---|---|---|---|
| **S1** | SMEs self-narrating expertise omit ~70% of decisions; instruction built from narration is ~46% less effective than CTA-built equivalent | **`DrafterIntake` TypeScript schema** — five required JSON fields (`novice_error`, `one_principle`, `worked_example`, `faded_variant`, `boundary_case`, `nearest_confusable`); admin app cannot submit lesson if any field empty (SM1) | Clark, Feldon, van Merriënboer, Yates & Early; Lee 2004 (+46% post-training learning gain, Cohen's d ≈ 1.72 — CTA-built vs expert-narrated); Tofel-Grehl & Feldon 2013 |
| **S2** | SMEs default to "telling what I know" instead of designing toward an assessment; lessons end up unmeasurable | **Backward-design "write the test first" mode** in `/admin/draft/[slug]` — the assessment intake editor unlocks first; lesson editor only unlocks once a passing test is authored (SM2) | Wiggins & McTighe 1998 *Understanding by Design*; Dirksen *Design for How People Learn* |
| **S3** | SMEs ship principle-only or example-only — never paired-then-faded — so worked-example fading effect is unavailable | **Worked-example pair editor** with two mandatory side-by-side fields (worked + faded variant); critic refuse-to-publish if either missing; faded variant validated as having ≥ 1 hint removed (SM3) | Sweller 1988; Sweller, van Merriënboer & Paas 2019; Renkl (faded worked examples) |
| **S4** | "Curse of expertise" — SMEs over-estimate novice prerequisites and under-explain bridging steps; learners stall at the implicit gap | **"What would a novice get wrong here?" textarea** required at submission; critic surfaces blind-spot flags via `blind_spot_flags: string[]` in `CriticOutput`; SME prompted to address each before re-submit (SM4) | Nathan & Petrosino 2003 (preservice-teacher expert blind spot); Hinds 1999 (curse of expertise) |
| **S5** | Free-typed principles drift across SMEs; learners can't accumulate a stable schema; Bloom-rung tagging breaks down | **Closed-taxonomy principle-picker** (autocomplete from approved B-skill list); admin app rejects free-typed principles unmapped to taxonomy; principle-tag is required and indexed for cross-concept retrieval (SM5) | Knowles andragogy (anchor to existing schema); Bloom revised taxonomy |
| **S6** | SMEs over-deliver supportive information (4C/ID component b) and under-deliver learning tasks (a), just-in-time info (c), and part-task practice (d) | **Critic-prompt 4C/ID coverage gate** — `CriticOutput.missing_components` returns any of `{learning_tasks, supportive_info, jit_info, part_task_practice}` absent from the lesson; refuse-to-publish on any missing component (SM6) | van Merriënboer 1997 — Four-Component Instructional Design (4C/ID) |
| **S7** | Tacit knowledge (skilled-trades, deskless, founder-built workflows) is unrecoverable from text-from-blank — the SME literally cannot type what they know | **Voice-first / camera-first authoring**: SME records 3-min audio or video; transcription + auto-draft into the 5-probe intake; SME edits, doesn't compose; mobile-first capture for shop-floor / field-services SMEs (SM7) | Polanyi 1966 (tacit knowledge); CTA-for-skilled-trades research; TalentCards: ~2.7B deskless workers globally |
| **S8** | Critic feedback is destination, not loop — SMEs see one-off corrections but never their own pattern, so no deliberate-practice channel exists for the SME themselves | **Per-SME blind-spot dashboard** at `/admin/sme/[id]/` aggregating critic-feedback over time; personalised authoring prompts surfaced before next draft ("you've omitted the boundary case in 4 of last 6 lessons"); critic-rejection-rate trend visible to SME (SM8) | Ericsson 1993 (deliberate-practice feedback channel); deliberate-practice literature on feedback specificity |

#### Coverage assertion

Every problem in the catalogue maps to ≥ 1 specific feature; every
feature maps to ≥ 1 cited source. No problem is addressed by exhortation
alone (e.g., "remind learners to review") — every mitigation is a
shipped surface in the Phase-2 build.

The per-mechanic detail (LM1–LM8 implementation paths and SM1–SM8
elicitation tooling) lives in §§ D1–D2 below; outcome targets in § D4;
segment-specific variants in § D6.

### D1. Learner-absorption mechanics for Phase 2

Eight mechanics. Each tagged to research source, repo lever, and Phase-2
ticket bucket. Codes (LM1–LM8) are referenced from
`08-cheat-sheets/training-methodology.md` § "Learner-absorption mechanics"
and from the deck slides.

| Code | Mechanic | Cited evidence | Phase-2 repo lever | Ticket bucket |
|---|---|---|---|---|
| LM1 | Spaced retrieval (1/3/7/14/30d expanding interval; leech rule on 3+ misses) | Cepeda et al. 2008; Cepeda 2006 (254-study meta); Murre & Dros 2015 | Dashboard banner surfaces `09-progress-tracker/spaced-review.md` queue (or its server-side equivalent); `web/src/lib/spaced-review.ts` (new); `web/src/components/dashboard/SpacedReviewBanner.tsx` (new) | Phase 2 — review-scheduler |
| LM2 | Mid-lesson retrieval gate (1-Q recall before "next" unlocks) | Roediger & Karpicke 2006; Karpicke & Blunt 2011 (*Science*) | `web/src/components/concept/LessonView.tsx` adds gated reveal; new `RetrievalGate` primitive | Phase 2 — lesson-runner |
| LM3 | Generation effect (write-the-principle before reveal) | Slamecka & Graf 1978 | `web/src/components/quiz/QuizRunner.tsx` adds principle-write field before answer reveal | Phase 2 — quiz-runner |
| LM4 | Interleaving recommender (≥ 2 sub-areas / session) | Rohrer & Taylor 2007 (63% shuffled vs 20% blocked) | `web/src/lib/recommendation.ts` adds interleaving constraint to next-pick | Phase 2 — recommender |
| LM5 | Worked-example fading + expertise-reversal cutover at rung 3 | Sweller, van Merriënboer & Paas 2019; Kalyuga 2003 | Lesson-depth toggle gains a 4th rung "solo" that disables hints once mastery ≥ 3 | Phase 2 — depth-adapt |
| LM6 | Calibration capture (JOL pre-answer; Δ to skills-matrix) | Dunlosky & Bjork; Kruger & Dunning 1999 | Quiz runner captures JOL pre-answer; calibration-Δ surfaces in dashboard stats panel | Phase 2 — calibration |
| LM7 | Streak prompt with variable-ratio reinforcement | Eyal 2014 (Hook Model); Skinner; Duolingo (Mazal 2022): CURR +21%, DAU 4.5×, 10-day-streak threshold | Push-notification surface + email digest; bandit-optimised cadence | Phase 2 — re-engagement |
| LM8 | Cohort surface (peer + accountability) | Maven W1→W2 96% vs MOOC 16%; altMBA 96% completion; Reich & Ruipérez-Valiente 2019 (*Science*) | Per-cohort routes; peer-comparison and group-leaderboard primitives | Phase 2 — cohort |

**Composite expected outcome.** Each mechanic is independently effect-sized
in peer-reviewed work. We make no claim of additive stacking, but:
- D7 retention target ≥ 40% (vs mobile-app par 28%) — credibly hit by LM1 + LM7.
- D30 retention target ≥ 35% (vs mobile-app par 14%) — requires LM1 + LM7 + LM8.
- Course completion ≥ 60% (vs MOOC 3–10%) — primarily LM8, gated by LM1/LM2/LM3/LM4 quality.
- |Calibration Δ| → 0.5 — primarily LM2 + LM3 + LM6.
- Mock pass-rate trajectory positive at 95% confidence over 8-week window — composite.

### D2. SME-elicitation scaffolding (drafter-side)

Eight scaffolds. The premise: SMEs are not bad teachers — they have
specific cognitive artefacts that don't transfer without specific
elicitation tooling. Each scaffold fixes a known SME failure mode
documented in `08-cheat-sheets/decision-trees.md` § 6 (CTA-style
elicitation tree).

| Code | Scaffold | What it fixes | Cited evidence |
|---|---|---|---|
| SM1 | CTA-style 5-probe intake (novice-error / one-principle / worked-example pair / boundary case / nearest confusable) | The 70% expert-decision omission in self-narration | Clark, Feldon, van Merriënboer, Yates & Early; Lee 2004: +46% post-training learning gain, Cohen's d ≈ 1.72; Tofel-Grehl & Feldon 2013 |
| SM2 | Backward-design intake (write the assessment first, lesson second) | "Telling what I know" SME default | Wiggins & McTighe 1998 (*Understanding by Design*) |
| SM3 | Worked-example pair editor (worked + faded variant, mandatory field) | SMEs ship principle-only or example-only | Sweller 1988 / 2019; Renkl |
| SM4 | Expert-blind-spot probe ("what would a novice get wrong here?") | Curse of expertise; under-explained bridging steps | Nathan & Petrosino 2003; Hinds 1999 |
| SM5 | Principle-tag picker (closed taxonomy; rejection if free-typed and unmapped) | Free-text principle drift; learners can't accumulate a stable schema | Knowles andragogy; Bloom revised |
| SM6 | 4C/ID coverage gate (critic checks all four components present) | SMEs over-deliver supportive info, under-deliver tasks + part-task practice | van Merriënboer 1997 (4C/ID) |
| SM7 | Voice-first / camera-first authoring + auto-draft | Tacit knowledge unrecoverable from text-from-blank | Polanyi 1966; CTA-for-skilled-trades |
| SM8 | Per-SME blind-spot dashboard (critic-feedback aggregated, personalised authoring prompts) | Critic feedback is destination, not loop | Ericsson 1993 (deliberate-practice feedback channel) |

**Composite expected outcome for SMEs.**
- SME-to-publishable-lesson cycle time ≤ 1 hour (TTFV — see § D5).
- ~46% larger learner-side learning gain on SME-authored content vs
  unscaffolded baseline (Lee 2004 effect-size transferred).
- Critic-rejection rate trends down month-over-month per-SME (SM4 + SM6 + SM8).
- Bus-factor risk addressed for startup / SMB customers (SM7 captures
  tacit knowledge before SME leaves).
- Cultural fit unlocked in high-PDI / face-saving markets (SM4 framed as
  *probe*, SM8 anonymised, SM5 closed-taxonomy removes free-typed
  face-stake).

### D3. Critic prompt design (Phase-2 Opus critic)

The Phase-2 critic (Opus) is configured to check the 12 cognitive
failure modes (F1–F12 from `06-failure-analysis/error-log.md`) plus
4C/ID coverage (van Merriënboer 1997). Returns a structured object that
SM8 surfaces back to the SME as a personalised blind-spot dashboard:

```json
{
  "confidence": 0.0,
  "missing_components": ["learning_tasks" | "supportive_info" | "jit_info" | "part_task_practice"],
  "blind_spot_flags": ["expert_blind_spot" | "principle_unstated" | "no_worked_example" | "no_boundary_case" | ...],
  "fcode_risks": ["F1" | "F2" | ... | "F12"],
  "suggested_probes": ["..."]
}
```

**Refuse-to-publish gate** (cross-ref § C7): no knowledge-file span
justifies the marked answer ⇒ critic refuses to publish. Same gate
covers F5 (fabricated rule) and F12 (cue-bias).

### D4. Measurement plan — Kirkpatrick four levels

Every retention / effectiveness claim made in the decks must be
measurable against one of the four Kirkpatrick levels. No vanity
metrics on the dashboards.

| Level | What it measures | Our metric | Industry anchor |
|---|---|---|---|
| **L1 (reaction)** | Did learners like it? | NPS + CES post-section | NPS ≥ 40 (B2C), ≥ 50 (B2B) |
| **L2 (learning)** | Did they learn it? | Mock pass-rate trajectory + calibration Δ from skills-matrix | Phase-D exit gate: |Δ| ≤ 0.5 |
| **L3 (behaviour)** | Did they apply / return? | D1 / D7 / D30 cohort retention curves; CURR; course-completion rate; spaced-review surface engagement (target ≥ 60% same-session clearance) | D1 ≥ 55% (mobile par); D7 ≥ 28% par → target ≥ 40% (cohort); D30 ≥ 14% par → target ≥ 35% (cohort); completion ≥ 60% vs MOOC 3–10% (Reich 2019) |
| **L4 (results)** | Did the business benefit? | NRR, expansion revenue, gross margin | NRR Y1 ≥ 110% (median+, SaaS Capital 2025); Y2 ≥ 120% (top-quartile); margin > 95% as AI cost scales sub-linearly |

### D5. TTFV (time-to-first-value) commitments

- **Learner TTFV ≤ 5 minutes** from sign-up to first quiz pass.
  Anchors L1 + L3.
- **SME TTFV ≤ 1 hour** from CTA intake to publishable lesson. The
  entire elicitation pipeline (SM1 → SM2 → SM3 → SM4 → critic SM6 →
  publish) runs inside the hour.

These become Phase-2 acceptance criteria — additions to § C11
(Verification).

### D6. Segment-specific problem map (the wedge order)

Every segment has a *named* retention or sharing problem with a *named*
mechanism solving it. The plan does not pretend the mechanism set varies
by segment — it does not. The *surface* varies; the engine does not.
This is what makes the platform commercially seamless: the same
$0-marginal-cost research-backed engine sells into eight segments
without re-architecting.

#### Learner-side segments

| Vertical | Dominant retention failure mode | Anchor / source |
|---|---|---|
| Healthcare | High mandatory-completion (95–99% w/ deadlines) but low retention. Joint Commission / CME drives seat-time, not transfer. Deskless / shift-based. | Mordor — healthcare/life-sciences microlearning 15.22% CAGR. |
| Financial services | Self-paced compliance 18–25%; live interactive 85–95%. Re-test fatigue on annual recurrence. < 70% completion ⇒ 3.5× violation rate. | KPI Depot 2026; ATD avg 72%. |
| Tech / SaaS | Skill-obsolescence churn; learners abandon when content stales faster than the curriculum updates. | LinkedIn WLR 2025: 39% need reskilling by 2030. |
| Manufacturing / industrial | Deskless / shift-based; tacit / haptic knowledge dominant; literacy + bandwidth variability. | TalentCards: ~2.7B deskless workers, 80%+ of global workforce. |
| Retail / hospitality | Highest turnover; TTFV in days. Microlearning highest-adopting vertical (21.53% revenue share 2025). | Mordor; Absorb 2026 — microlearning completion +42% vs traditional. |
| Government / public sector | Procurement-bound; WCAG/Section 508; multi-language; top-down mandates. | LinkedIn WLR 2025 — public-sector mobility gap. |
| Professional services | Billable-hour conflict; nano-format only. | Industry consensus. |

| Geography | Distinct retention constraint |
|---|---|
| North America / W. Europe / ANZ | Push-fatigue is the dominant constraint. |
| India / SEA / China | Mobile-first; high credentialing value; lower mean session length. |
| MENA / SSA / LATAM | Bandwidth + offline-tolerance critical; SMS / WhatsApp delivery beats native push in some markets. |
| Japan / Korea | Face-saving cultures; peer-graded surfaces underperform unless anonymised. Long-term-orientation favours systematic spaced review. |

| Hofstede axis | Effect on absorption |
|---|---|
| **High UAI** | E-learning usability frustration highest; learners seek fixed habits, low ambiguity (deterministic next-step prompts). |
| **High PDI** | Heavy reliance on instructors and textbooks; leader-/manager-endorsed pathways unblock. |
| **High Collectivism (low IDV)** | Cohort surface drives persistence; solo self-paced underperforms. |
| **High LTO** | Spaced review beats short-burst gamification. |
| Hall high-context | Worked examples + analogies > rule statements alone. |
| Meyer feedback-direct vs indirect | Critic copy must adapt; direct cultures (NL, IL, DE) tolerate blunt rejection; indirect (JP, ID, CN) require softened framing. |

| Dreyfus rung | Dominant abandonment mode | Intervention |
|---|---|---|
| Novice | Cognitive overload | Fully-worked examples (Sweller); high scaffolding |
| Advanced beginner | Fluency illusion | Force generation-effect drill (Slamecka & Graf 1978) |
| Competent | Plateau after first quiz pass | Surfaced spaced-review queue (LM1) |
| Proficient | Expertise reversal | Faded worked examples; promote to interleaved transfer (LM4) |
| Expert | Boredom; needs deliberate-practice channel | Far-transfer scenarios; cohort/peer review surface (LM8) |

| Career stage | Motivation profile | Key lever |
|---|---|---|
| Early (0–3y) | Identity / credentialling | Streaks + badges (LM7); fragmented study time → nano-format |
| Mid (3–10y) | Mastery / promotion | Cohort surface (LM8) — Maven W1→W2 96% retention |
| Senior (10y+) | Teaching others / legacy | Best converted into SMEs |
| Career-changer | Anxiety; high uncertainty-avoidance | Deterministic next-step prompts; fixed pathways |

| Company size | Distinct retention problem | Implication |
|---|---|---|
| Solo / freelancer | No cohort; pure-B2C dynamics | LM7 carries 100% of return-visit load |
| Startup (1–50) | No L&D; SMEs = founders (no time) | Async + minimal-touch + ≤ 5-min nano-sessions |
| SMB (50–500) | "Completion-as-checkbox" culture | Manager-endorsed pathways + peer comparison drive engagement above the 12–15% self-paced floor |
| Mid-market (500–5000) | Has SCORM/xAPI LMS; completion ≠ competence | xAPI emit hooks + L2 dashboards close the gap |
| Enterprise (5000+) | Distributed SMEs / geos / languages; governance-heavy | Multi-language, audit-trail, version-pin, SSO |
| Public sector | Procurement; WCAG/Section 508; multi-language | Enterprise + accessibility certification |

#### SME-side segments

| Vertical | SME knowledge-sharing problem | Anchor / source |
|---|---|---|
| Clinical / healthcare | Medico-legal liability; schedule-poor (10-min between cases) | Clark/Feldon CTA-in-healthcare research |
| Financial services | Regulatory liability ⇒ "do not author" defaults | Industry consensus; FINRA / SEC review timelines |
| Tech / SaaS | Prefers code / README over prose; rejects cameras; content stales weekly | LinkedIn WLR 2025 |
| Manufacturing / industrial | Tacit / haptic — Polanyi's "we know more than we can tell"; voice-first or video-first authoring required | Polanyi 1966; CTA-for-skilled-trades |
| Government / clearance | Clearance-bound; review cycles long | Industry consensus; GAO L&D reports |

| Cultural axis | SME-side effect |
|---|---|
| High-PDI cultures (East Asia, LATAM, MENA, India) | Reluctant to expose uncertainty in public artefacts; leader-endorsement pathway required |
| Face-saving cultures (Japan, Korea, parts of China) | Avoid "I don't know"; critic copy framed as suggestion not finding; anonymised peer-review |
| Individualistic cultures (US, NL, UK, AU) | Knowledge as career currency; author-credit / citations / badges |
| Collectivist cultures (China, India, LATAM) | Share within group; defer authority decisions upward; group-attribution surfaces |
| Oral-tradition vs documentation cultures | Voice-to-text + auto-draft pipelines unblock the former |

| Skill / experience level | SME problem | Mitigation |
|---|---|---|
| Junior-as-SME | More relatable, less authoritative | Pair with senior SME for blind-spot probe |
| Mid-career SME | Best teachers per CTA literature | Default SME-grade for content authoring |
| Senior SME | Worst novice-empathy without scaffold | SM4 + SM2 mandatory |

| Company size | SME problem | Implication |
|---|---|---|
| Startup founder-as-SME | Knows everything, no time, won't author prose | Voice-to-camera + transcribe + auto-draft + founder approves diffs |
| SMB single-SME bottleneck | Bus-factor 1; no redundancy | Explicit succession-of-knowledge tooling — CTA + recorded interview + auto-draft |
| Mid-market SME pool | Committee authoring; slow consensus; LCD output | Per-SME draft + critic-mediated merge; conflict-surface UI |
| Enterprise SME network | Distributed across geos / time-zones / languages; governance gates | Role-based publish, multi-language critic, audit trail |
| Consultancies / service firms | SMEs are billable; authoring competes with revenue | ≤ 1-hour TTFV + nano-format |

#### Cross-segment patterns (the wedge-order argument)

1. **Deskless workforce convergence.** Manufacturing, retail/hospitality, healthcare-frontline, field-services all need: ≤ 3-min sessions, mobile-only, offline-capable, voice/visual over text. ~2.7B workers globally. Same product surface unlocks four verticals at once.
2. **High-PDI / face-saving cultures need a leader-endorsement layer** before SME authoring will land. Manager-pathway-publish pattern unlocks SME participation in East Asia, LATAM, MENA, India.
3. **Compliance-driven verticals (finance, healthcare, government) require an audit-trail / version-pin / role-based-publish stack** — different SME-approval shape than B2C. Same critic engine, different governance gates. < 70% completion ⇒ 3.5× compliance-violation rate (KPI Depot 2026) makes this an L4-Kirkpatrick monetisable outcome.
4. **Single-SME-bottleneck markets (startup, SMB, founder-led)** need explicit succession-of-knowledge tooling — CTA + recorded interview + auto-draft + reviewer pairing. Killer feature for the small-end of the SME-side TAM.

**Wedge order for go-to-market.**
1. Deskless verticals + single-SME-bottleneck SMBs first (lowest tooling competition).
2. Regulated enterprise second (highest ACV).
3. B2C cert-prep continuing (CCA-F flagship).

### D7. Why this works (mechanism walkthrough)

This subsection pre-empts the question every B2B prospect, every
investor, and every collaborator will ask: *why will any of this work?*
The answer for each mechanism: cited effect size + why retention or
sharing compounds + which Phase-2 component implements it. Same LM /
SM codes as § D1 / § D2.

**Learner-absorption — why retention compounds.** Each spaced-retrieval
session re-encodes the trace at a longer interval; long-term retention
grows as a function of *number of correctly-spaced retrievals*, not study
time. Retrieval gates (LM2) eliminate the fluency illusion (Bjork &
Bjork 2011) so calibration Δ closes toward zero. Generation (LM3) forces
active encoding and surfaces gaps the learner would not have noticed.
Interleaving (LM4) trains discrimination between concepts — what the
exam actually tests. Worked-example fading with expertise-reversal
cutover (LM5) avoids the LMS one-format-for-all failure: each Dreyfus
rung gets the right intervention. Calibration capture (LM6) closes the
"I felt I knew it" gap that drives F9 and F11. Streak prompts on
variable-ratio reinforcement (LM7) supply the Hook-Model trigger phase
without which the entire pipeline never fires. Cohort surface (LM8)
activates SDT-relatedness (Ryan & Deci) and goal-gradient (Kivetz,
Urminsky & Zheng 2006) simultaneously — the biggest single retention
multiplier in ed-tech (Maven 14× retention vs Coursera/Udemy).

**SME-elicitation — why sharing becomes seamless.** SMEs aren't bad
teachers; they have specific cognitive artefacts that don't transfer
without specific elicitation tooling. The CTA 5-probe intake (SM1)
inverts the SME's natural narrate-from-expertise impulse, surfacing the
70% of decisions otherwise omitted (Clark/Feldon — Lee 2004 +46%
learning gain, d ≈ 1.72). Backward design (SM2) forces "what's the
test?" before "what's the lesson?" (Wiggins & McTighe 1998), eliminating
unmeasurable lessons. The worked-example pair editor (SM3) yokes
Sweller's faded-example research to a mandatory authoring field. The
expert-blind-spot probe (SM4) addresses Nathan & Petrosino 2003 directly.
The principle-tag picker (SM5) eliminates free-text drift. The 4C/ID
coverage gate (SM6) catches the SME's tendency to over-deliver
supportive information (van Merriënboer 1997). Voice-first authoring
(SM7) addresses Polanyi's tacit-knowledge constraint. The blind-spot
dashboard (SM8) closes the deliberate-practice feedback loop (Ericsson
1993) — without which the SME doesn't improve over time.

**Why segmentation × mechanism = seamless.** The mechanism set is the
same regardless of segment; the *surface* varies. One critic engine,
one CTA-probe schema, one calibration-Δ column projected through
different UI affordances per segment (deskless mobile, enterprise
SCORM/xAPI, B2B audit-trail, B2C streak/cohort). That is what makes the
platform *commercially* seamless, not just pedagogically sound.

### D8. Business-case foundation

Five-line thesis the four decks must communicate:

1. **Self-paced corporate training completion is 12–15% on average; cohort-based is 75–96% (Maven, altMBA).** That is the prize we are competing for.
2. **The mechanisms that produce cohort-grade retention are 50 years of cognitive-science evidence** (LM1–LM8) **operationalised as product surface** — not new IP, but an unowned synthesis.
3. **The mechanisms that produce seamless SME sharing are CTA, backward design, expert-blind-spot probes, 4C/ID coverage gates, voice-first capture, and personalised blind-spot dashboards** (SM1–SM8) — all peer-reviewed, all tooled for the first time at the small-SME end of the market (the killer-feature gap).
4. **The 80% deskless and 39% reskilling-by-2030 numbers** (TalentCards; LinkedIn WLR 2025) **define the TAM**; the segmentation table in § D6 defines the wedge order: deskless verticals + single-SME-bottleneck SMBs first, regulated enterprise second, B2C cert-prep continuing.
5. **The proof is L1–L4 Kirkpatrick measurement built in from day one.** L2 calibration-Δ + L3 D7/D30 cohort curves + L4 NRR ≥ 110% Y1 / ≥ 120% Y2 (SaaS Capital 2025 top-quartile) make the claim falsifiable, which is what defensible B2B sales requires.

**Per-deck anchors** (the deck files implement these as slides):
- *Investor deck* — moat is the synthesis (LM1–LM8 + SM1–SM8 + Kirkpatrick L1–L4 measurement). Compares industry baselines (MOOC 3–10%, mobile-app D30 14%) to our targeted outcomes (cohort 60%+, mobile D30 35%+) using only published benchmarks.
- *B2B prospect deck* — commitment is Kirkpatrick L1–L4 + ≤ 1-hour SME-to-publishable-lesson; risk reduction is audit-trail + role-based publish + WCAG/Section 508; segmentation is "we already know your segment's failure mode".
- *Collaborator deck* — engineering thesis is one critic engine + one CTA-probe schema + one calibration-Δ column projected through segment-specific UI affordances. Mechanic-to-mechanism map is the wiring diagram.
- *Overview deck* — non-technical narrative: learners come back because of evidence; SMEs ship because of scaffolding; segments converge on one engine.

---

## Companion documents

End-to-end implementation runbook (the "how"):

- [`./IMPLEMENTATION.md`](./IMPLEMENTATION.md) — self-contained build guide for an AI agent + operator: P1–P12 phases with verbatim AI prompts, operator pre-tasks, verification clicks, and Definition of Done checklists. Hand this to a fresh project to start building.

Audience-specific deck versions of this strategy plan (the "why"):

- [`./deck-overview.md`](./deck-overview.md) — general non-technical overview (default for most stakeholders).
- [`./deck-investor.md`](./deck-investor.md) — investor / advisor brief: TAM, unit economics, capital-efficiency story, founder fit.
- [`./deck-b2b-prospect.md`](./deck-b2b-prospect.md) — B2B prospect brief: buyer-language pitch, pilot terms, security & compliance, comparison vs LMS / DIY.
- [`./deck-collaborator.md`](./deck-collaborator.md) — technical collaborator brief: architecture, hard problems, what you'd build in P1–P6, deliberate tech debt.
