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

## Companion document

A slide-deck version of this plan, designed for sharing with non-technical stakeholders, is in [`./content-pack-management-deck.md`](./content-pack-management-deck.md).
