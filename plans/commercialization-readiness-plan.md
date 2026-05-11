# Commercialization Readiness Plan — `cca-f-prep/web/`

> **Status.** Applies the canonical `v2-scaled-b2b-plan.md` to the
> actual code in `web/`. v2 wins where it conflicts with this
> document; this document is the *implementation lens* — what the
> app needs in order, with file paths and effort estimates.
>
> **Created** 2026-05-11 alongside PR #46 (the immediate-wins
> landing). Phase 1 / Phase 2 sequencing and stop-signals come
> from `v2-scaled-b2b-plan.md` §6–11.

## Context

The web app under `/home/user/cca-f-prep/web/` is a Next.js 16 + React 19 learning shell with two lanes: a learner lane (Curio) and a designer lane (Adept + SME workbench). Today it is **fully client-only** — 9 distinct localStorage stores, zero API routes, no auth, no DB, no multi-tenancy, no billing. The intake forms (`LearningGoalCapture`, `DesignerJourneyDecoder`) and the SME workbench expose ~12 text-input surfaces that the operator wants to back with LLM calls; today the journey decoder is a pure regex heuristic and "Ask Claude" is a link-out.

The canonical business shape is `plans/v2-scaled-b2b-plan.md` (post-hostile-review). v2 prescribes: Vercel Pro + Clerk + Neon Postgres + Drizzle + Cloudflare R2 + OpenRouter + Stripe + Resend, single-tenant in v1 with `tenant_id` added week 7–8, all AI through `lib/ai/router.ts`, 6-vendor cap, no prompt caching or Anthropic-specific features in core paths (Phase-2 isolation). v2 ships 6 surfaces; the current code has Adept + SME workbench already built, which v2 explicitly **defers to Phase 2 (revenue-gated)**.

This plan reconciles the as-built code with v2 and answers the operator's four questions: (1) critical review, (2) multi-tenant + role readiness, (3) localStorage → server-side pathway, (4) what else is needed to commercialize — with immediate wins and a versioned roadmap.

---

## 1. Critical review — current state in one page

**Architecture strengths**
- Clean separation of concerns: `content-packs/*` are decoupled from runtime; `useSyncExternalStore` factory pattern makes the storage layer swappable behind one interface.
- Strong type model: `Curriculum`, `ContentPack`, `Progress`, `SMEEdits`, `ReviewLevel`, `SourceDocument` already cover the data shapes a real multi-tenant SaaS will need.
- Role enums **already drafted** (`ReviewRole = "sme" | "ld-lead" | "compliance"`, `RouteRole = "learner" | "expert"`) — just no auth to enforce them.
- Vitest + Playwright suites exist (~27 unit files, 5 E2E specs) — gives a migration safety net.
- CSP headers, SRI awareness, prompt-injection notes in `SECURITY.md` — defensive baseline is in place.
- Single env-var (`NEXT_PUBLIC_CONTENT_PACK_ID`) for pack selection — extensible to runtime tenant resolution.

**Architecture gaps (blockers for commerce)**
- **No auth, no DB, no API routes.** Everything is browser-local.
- **CI is disabled** (`.github/workflows/ci.yml` toggled off 2026-05-06). Production discipline gap.
- **No billing, no observability, no email, no rate limiting, no privacy/terms pages.**
- **decodeJourney runs on every keystroke** — if naively swapped to an LLM call, cost + latency are unsustainable. Needs debounce + cache.
- **SME workbench is single-actor.** No optimistic concurrency, no locking, no audit trail server-side — concurrent SMEs will silently fight.
- **Static curriculum lives in TS code** (`content-packs/*/curriculum.ts`). Moving to DB requires a loader rewrite + SSR cache strategy.
- **Drift from v2:** Adept + SME workbench surfaces are built but v2 defers them to Phase 2. Either ship them or hide them behind a flag in v1.

---

## 2. Multi-tenant + role-based readiness

**Role matrix the app must eventually support:**

| Role | Lane | Scope | Auth source | Status today |
|---|---|---|---|---|
| Anonymous trial | Learner | None (3-lesson cap) | none | ✅ works today |
| B2C paid learner | Learner | self | Clerk personal | ❌ no auth |
| B2B end user | Learner | self × tenant | Clerk org member | ❌ no auth |
| SME | Designer | tenant × packs they own | Clerk org `sme` role | ⚠️ UI built, no enforcement |
| L&D lead (tenant admin) | Designer | tenant-wide | Clerk org `admin` | ⚠️ enum exists, no UI |
| Compliance reviewer | Designer | tenant + read-only audit | Clerk org `compliance` | ⚠️ enum exists, no UI |
| Platform admin | Cross-cutting | all tenants | Clerk impersonation | ❌ not modeled |

**Tenancy model (matches v2 §6 week 7–8):** add a nullable `tenant_id` column to every table from day 1; v1 enforces tenancy at the application layer (`WHERE user_id = $auth.userId AND (tenant_id IS NULL OR tenant_id = $auth.tenantId)`). Postgres RLS deferred to Phase 2 per v2 §5. General-library packs have `tenant_id = NULL` (cross-tenant readable); company-specific packs have `tenant_id` set.

**Pack scoping:** `pack-registry.ts` becomes `pack_registry` table with `kind: "general-library" | "company-specific"` and `tenant_id` for the latter. `sme_edit` and `pack_deploy` rows are always tenant-scoped.

**RBAC enforcement points:** middleware checks `role` for `/team`, `/adept/**`, `/api/sme-edits/**`. Reads on `general-library` packs bypass the tenant check. SME mutation calls verify `role IN ('sme', 'ld-lead')`. Deploy verifies `role IN ('ld-lead')`.

---

## 3. LLM integration — textboxes → API calls

**Provider strategy:** per v2 §9, all AI goes through `web/src/lib/ai/router.ts` — single `generate({ system, user, model })` function, OpenRouter as the API surface, vendor-neutral. **No `@anthropic-ai/sdk` import outside this file.** Prompt templates live in `web/prompts/` as markdown.

**Model routing matrix:**

| Surface | File:line | Volume | Model | Why |
|---|---|---|---|---|
| `LearningGoalCapture` decode | `dashboard/LearningGoalCapture.tsx:74-343` | high (per-keystroke today) | **Haiku 4.5** | cheap, fast, low-stakes structured output; debounce 800ms + result cache keyed on `(what, why)` hash |
| `DesignerJourneyDecoder` brief | `dashboard/DesignerJourneyDecoder.tsx:55-149` | medium | **Haiku 4.5** | same — produces a structured `DecodedJourney` shape; existing heuristic stays as fallback when offline / over budget |
| `AskClaudePanel` Q&A | `concept/AskClaudePanel.tsx` | medium | **Sonnet 4.6** | grounded on the lesson context the user is reading; needs reasoning, not raw drafting |
| SME concept lesson draft | `adept/SMEWorkbench.tsx:1052` (lesson textarea) | low, high-stakes | **Sonnet 4.6** | draft-from-sources path; output must be SME-editable |
| SME quiz draft | `adept/SMEWorkbench.tsx:1067-1105` | low, high-stakes | **Sonnet 4.6** | structured MCQ generation; tied to letter-distribution validator |
| Sampled quality critic | (new) | ≤ 5% of drafts | **Opus / Sonnet** | per v2 §9: spot-check, not the default path |
| Pack drafting from `SourceDocument[]` | (new endpoint) | low | **Sonnet 4.6** with map-reduce | only after Phase 2 revenue gate |

**Cost defenses (must ship before any LLM call goes live):**
- Server-side per-user rate limit (Upstash Ratelimit, 5 req/min for decoder, 1/min for SME drafts).
- Per-tenant token-budget circuit breaker — server-enforced ledger; reaching cap **stops generation** (v2 §9 ¶5).
- Result cache keyed on `(prompt_hash, model)` — TTL 24h. Hit rate target ≥ 40% for the decoders (most goal phrasings recur).
- Debounce on every keystroke-bound input — minimum 800ms idle before fire.
- Hard daily $ cap per tenant; soft 80% / hard 95% watermarks (mirrors `lumivara-site` discipline already adopted in CLAUDE.md).

**v1 vs v2 isolation:** in v1 the decoder LLM is **optional** — the existing local heuristic stays as the default; LLM upgrade is behind a `NEXT_PUBLIC_AI_DECODER_ENABLED` flag. This preserves the offline / unit-test behaviour and avoids paying for Haiku tokens until a paying user is on the other end.

---

## 4. localStorage → server-side migration pathway

**Driver abstraction.** Introduce `web/src/lib/storage/driver.ts` with a `StorageDriver<T>` interface that preserves the existing `getSnapshot/subscribe` shape. Every store factory delegates to a driver; consumers don't change. Three policies: `local-only`, `local-first-server-sync`, `server-of-record`.

**Per-store policy:**

| Store | File | Policy | Endpoint |
|---|---|---|---|
| display-prefs | `lib/display-prefs.ts` | `local-only` | — |
| theme | `lib/storage-keys.ts` | `local-only` | — |
| last-visit | `lib/last-visit.ts` | `local-only` v1 → server later | — |
| lesson-depth | `lib/lesson-depth.ts` | `local-only` | — |
| before-you-begin | `lib/before-you-begin.ts` | `local-only` | — |
| **learning-goals** | `lib/learning-goals.ts` | `local-first-server-sync` | `/api/goals` |
| **progress** | `lib/progress-store.ts` | `local-first-server-sync` | `/api/progress/[packId]` |
| **games** | `lib/games-store.ts` | `local-first-server-sync` | `/api/games/[packId]` |
| **sme-edits** | `lib/sme-edits.ts` | `server-of-record` | `/api/sme-edits/[packId]` + SSE |

**Migration sequence (low-risk → high-stakes):**

1. Driver scaffold + `local-only` rewrites (no behaviour change; canary).
2. `learning-goals` (smallest payload, append-only, validates the path end-to-end).
3. `progress` (the product; debounced push, cross-device pull on focus + visibility-change).
4. `games` (same shape, smaller blast radius; ships after progress reconciliation is proven).
5. `sme-edits` (last — multi-user, audit trail, optimistic concurrency via `version` column, SSE for cross-tab fanout, advisory lock around deploy).

**Drizzle schema (v1):** tables `user`, `progress`, `attempt`, `learning_goal`, `sme_edit`, `pack_deploy`. All carry a nullable `tenant_id` (indexed). `progress.state` and `sme_edit.payload` are JSONB blobs in v1 (shapes churn). `attempt` is split off as append-only (analytics + rate-limit signal). `pack_deploy.snapshot` is immutable (audit trail; never cascade-deleted).

**Anonymous → signed-in handover.** A one-time idempotent `POST /api/auth/adopt` runs on first sign-in: uploads all `local-first-server-sync` blobs, server merges with `ON CONFLICT DO NOTHING` on natural keys (goal id, attempt id, `(user_id, pack_id)` for progress). Driver then `hydrate()`s the merged remote into the local cache.

**Cross-tab + cross-device sync.** `window.storage` event no longer fires for server-sourced writes. v1 fallback: short-poll on `visibilitychange` + `focus`. `sme-edits` only: SSE channel per `(tenantId, packId)` so two SMEs see each other's state.

**Migration-specific risks** (covered in detail in plan-agent output):
1. `sme_edit.expiresAt` retention up to a year; `pack_deploy.snapshot` must survive GDPR erasure as tombstoned audit row.
2. Schema-version drift on existing browsers — `adoptLocalIntoServer` must run the same self-healing as `loadProgressFor` does today (force-unlock first section, backfill `mock`, backfill `location.mockId`).
3. Concurrent SME deploys — advisory lock + "deploy in flight by X" SSE banner.
4. Cross-tab silence for server-sourced writes (already addressed above).

---

## 5. Commercialization checklist — what else is needed

In rough dependency order (each depends roughly on the previous):

1. **Auth** — Clerk (per v2 §5). Personal accounts in v1; Organizations enabled at week 7–8 for B2B.
2. **DB + ORM** — Neon free → Scale; Drizzle + drizzle-kit migrations.
3. **API surface** — Next.js route handlers, Clerk middleware on `/api/**` except `/api/health` and `/api/public/**`.
4. **LLM proxy** — `lib/ai/router.ts`, prompt files in `prompts/`, OpenRouter key in Vercel env, server-side rate-limit, per-tenant token ledger.
5. **Billing** — Stripe Checkout + Customer Portal, webhook handler at `/api/stripe/webhook`, `entitlement` table joining `user`/`tenant` → tier.
6. **Email** — Resend free tier for magic-link + deploy notifications + SME approval requests.
7. **Observability** — Sentry (free) for errors; PostHog (free, sampled) for product analytics; pino structured logs to Vercel logs.
8. **Rate limit / abuse** — Upstash Ratelimit per user + per tenant; hCaptcha on `/sign-up` if abuse appears.
9. **Privacy & compliance scaffolding** — `/privacy`, `/terms`, cookie consent (essential vs analytics), `/api/data-export` and `/api/data-delete` endpoints. SOC2 explicitly **out** in v1 per v2 §12.
10. **CI re-enable** — flip `.github/workflows/ci.yml` back on; require green lint + typecheck + Vitest on every PR; Playwright on a nightly cron to control flake.
11. **Vendor runbooks** — `plans/runbooks/runbook-{vercel-to-cloudflare,clerk-to-betterauth,neon-to-supabase,anthropic-to-openai,stripe-to-paddle}.md` (one page each per v2 §9 ¶4).
12. **Status page** — BetterStack ($25/mo when first paying B2B lands).
13. **Backup / export** — daily Neon snapshot retention 7 days (free tier covers it); per-user export endpoint.
14. **Content provenance** — every SME-deployed pack carries a `pack_deploy.snapshot` JSONB row that includes prompt hashes + model IDs used to draft, for buyer trust and future audit.

---

## 6. Immediate wins (this week / next two weeks)

Pure code wins that ship value or remove risk **without** waiting on auth or DB:

| # | Win | Effort | File(s) |
|---|---|---|---|
| 1 | Re-enable CI (lint + typecheck + Vitest) on every PR | 30 min | `.github/workflows/ci.yml` |
| 2 | Add `.env.example` + secrets policy to README | 30 min | `web/.env.example`, `web/README.md` |
| 3 | Carve a single `web/src/lib/ai/router.ts` stub (returns `Promise.reject('not configured')` until keys exist) + `web/prompts/decoder.md`, `web/prompts/sme-draft.md` | half-day | new files |
| 4 | Add `web/src/lib/storage/driver.ts` interface + rewrite `display-prefs`, `theme`, `lesson-depth`, `before-you-begin` to use `local-only` driver (no behaviour change; canary) | 1 day | `lib/storage/`, listed stores |
| 5 | Bump every store to `schemaVersion: 2` with optional `tenantId` / `serverSyncedAt` fields (forward-compatible; today they stay `undefined`) | half-day | each store file |
| 6 | Debounce `decodeJourney` to 800ms idle + LRU result cache keyed on `(what, why)` hash — prepares for LLM swap, also reduces React re-renders today | half-day | `lib/journey-decoder.ts`, `dashboard/LearningGoalCapture.tsx`, `dashboard/DesignerJourneyDecoder.tsx` |
| 7 | Add `web/src/app/api/health/route.ts` returning `{ok: true, sha, version}` — unblocks future status-page wiring | 15 min | new |
| 8 | Privacy + Terms placeholder pages at `/privacy` and `/terms` (lawyer-untouched but committed) | half-day | `app/privacy/page.tsx`, `app/terms/page.tsx` |
| 9 | Feature-flag the Adept / SME / for-teams routes behind `NEXT_PUBLIC_ADEPT_ENABLED` — keep code, hide from v2 v1 surface area | 1 hour | `middleware.ts` (new), affected route files |
| 10 | Letter-bias validator on SME workbench saves (warn if a quiz has all-B answers — addresses the 2026-05-02 letter-bias finding) | 2 hours | `lib/sme-edits.ts`, workbench UI |
| 11 | `web/CONTRIBUTING.md` + `web/SECURITY.md` updates documenting the storage-driver pattern + the LLM router rule ("no `@anthropic-ai/sdk` outside `lib/ai/router.ts`") | half-day | docs |
| 12 | Sentry SDK install + minimal `instrumentation.ts` (no DSN required to start; logs locally) | 1 hour | `web/instrumentation.ts`, `package.json` |

All twelve are independent. Items 1, 2, 4, 5, 6, 7, 9 are the highest-value-per-hour and would land in week 1 without prerequisites.

---

## 7. Future planned releases (versioned roadmap)

Aligned to v2's Phase 1 (weeks 1–12) and Phase 2 (revenue-gated):

**v0.1 — Auth + sync (weeks 1–4 per v2 §6).**
Clerk personal accounts + Neon + Drizzle three tables (`user`, `progress`, `attempt`) + `/api/progress` + `/api/auth/adopt` + Vercel Pro project. Anonymous trial preserved. Adept hidden by flag.

**v0.2 — Billing (weeks 5–6).**
Stripe Checkout + Customer Portal + `entitlement` table + free / Pro ($15/mo) tiers + 3-lesson free-tier gate enforced server-side.

**v0.3 — Quality + content loop (weeks 5–6 in parallel).**
Local validator suite (17 currently stubbed), `cca-content-quality` open-source package, `pnpm lint:content` script.

**v0.4 — Team mode (weeks 7–8).**
Add `tenant_id` columns, Clerk Organizations, `/team` route, weekly digest email via Resend, Stripe seat-based pricing ($20/$25, $300/$750 platform minimums).

**v0.5 — Polish + launch (weeks 9–12).**
Lighthouse ≥ 90, axe-core sweep WCAG 2.1 AA, status page, Sentry alerts, Show-HN/Reddit/dev.to launch.

**Phase-2 gate (triggers when MRR ≥ $3k for 8 weeks AND ≥ 1 B2B paying tenant AND operator ≤ 25 hr/wk for 8 weeks).**

**v0.6 — In-app AI generation pipeline.** Inngest queue, Sonnet drafter on operator-supplied knowledge files. `lib/ai/router.ts` now hot.

**v0.7 — Custom team catalog drafting** from a buyer's PDF/runbook upload (highest-priced upgrade path).

**v0.8 — Sampled Opus critic** at ≤ 5% of generations.

**v0.9 — Per-tenant token-budget circuit breaker** (server-enforced).

**v0.10 — B2B audit log** (append-only event ledger; needed for SOC2 later, useful for buyer trust now).

**v0.11 — Suggestion / topic-request loop** for B2C learners.

**v0.12 — Voice-first authoring** for the operator (not for buyers).

**Cadence cap (v2 §7):** two features per quarter, no more. Each behind a feature flag.

**Out of v1 / v2 explicitly (per v2 §5):** SCORM / xAPI export, SAML / SCIM, SOC2 audit trail, cohort routes, multi-tenant RLS hardening (deferred until tenant count justifies the audit), peer-comparison, leaderboard, embedding-based dedup, per-SME blind-spot dashboard.

---

## 8. Opportunities

1. **Existing factory pattern is already swappable.** `useSyncExternalStore` is the same shape as a server-backed driver — refactor is interface-not-rewrite.
2. **Role enums already drafted** (`ReviewRole`, `RouteRole`, status enums on `SMEConceptOverlay`) — RBAC has a head start.
3. **Content-pack abstraction was designed for multi-tenant from day 1** — `pack-registry.ts` just needs a DB-backed loader.
4. **The CCA-F study repo IS the seed catalog.** Zero content-acquisition cost for the wedge product per v2 §1.
5. **Codex review workflow is already in place** (`.github/workflows/codex-review.yml`) — every PR gets external review before merge.
6. **Two-lane home page already discriminates B2C vs B2B intent** — pricing page can branch on the lane the user came from.
7. **`SourceDocument[]` type already exists** in `sme-edits.ts` — the data model for "buyer uploads PDF/runbook → drafts custom catalog" is ready for v0.7.
8. **Adept / SME workbench already built** — even though v2 defers them, the code exists; v0.4+ can light them up faster than expected.
9. **Single env var for pack selection** (`NEXT_PUBLIC_CONTENT_PACK_ID`) — easy to extend to runtime tenant resolution via subdomain or path prefix.
10. **No legacy users to migrate.** No paying customers means no backward-compat tax — the storage-driver swap can be additive (new schemaVersion: 2) without rollback complexity.
11. **B-bias letter-distribution finding from 2026-05-02** is a ready-made content-quality validator that doubles as a buyer-trust talking point.
12. **`SECURITY.md` already documents CSP + prompt-injection defenses** — uncommon maturity for a Phase-1 SaaS.

---

## 9. Challenges

1. **decodeJourney runs on every keystroke** — naive LLM swap is unaffordable. Mitigation: debounce + cache + keep local heuristic as fallback (immediate-win #6).
2. **Static curriculum in TypeScript** (`content-packs/*/curriculum.ts`) — moving to DB requires a loader rewrite + SSR cache strategy + Vercel ISR considerations. Recommend keeping content in code for v0.1–v0.3 (just deploy on commit); move to DB only in v0.6 when AI generation lands.
3. **Cross-tab sync via `storage` event won't survive server-sourced writes.** v1 mitigation: short-poll on `visibilitychange`. v2 mitigation for `sme-edits`: SSE channel.
4. **Concurrent SME deploys.** Today's `sme-edits.ts deploy()` clears `reviewLevels` and stamps a single ISO — two simultaneous deploys silently overwrite. Needs advisory lock + SSE banner in v0.4.
5. **`schemaVersion: 1` blobs already on user devices** must be self-healed on upload to server (the on-read healer in `progress-store.ts` runs today; the upload path must invoke the same logic).
6. **GDPR erasure vs immutable audit trail conflict** — `pack_deploy.snapshot` cannot be deleted, but the actor's name can be tombstoned. Needs explicit policy + endpoint design.
7. **CI is disabled.** Production discipline gap that compounds — re-enable in week 1 (immediate win #1).
8. **The Adept / SME / for-teams routes are built but v2 defers them.** Decision needed: ship them in v1 (against v2 advice) or hide them behind a feature flag (recommended; preserves option value, removes the "what's this for?" confusion on the v1 marketing surface).
9. **LLM-cost runaway risk.** Every textbox becoming an API call is a per-keystroke billing surface. Hard cap, per-tenant ledger, cache, debounce are all required **before** any production LLM call.
10. **Vendor lock-in disguised as convenience.** Clerk + Neon + OpenRouter + Stripe + Vercel + R2 is a 6-vendor blast radius. v2 §9 ¶4 prescribes one-page runbooks per vendor — these need to exist *before* a paying customer, not after a vendor outage.
11. **`SourceDocument` today stores metadata only** ("we don't store the binary in the demo"). Real file upload to R2 + virus-scan + retention policy is unbuilt — Phase 2 work, but `SECURITY.md` should call it out as deferred.
12. **No CSRF protection today** (no server endpoints to need it). Adding auth introduces this — Next.js route handlers with the SameSite=Lax cookie default + Clerk's CSRF helper cover it, but the rule needs to be written in `CONTRIBUTING.md`.
13. **Anonymous → signed-in merge is non-trivial.** Two devices, two anonymous identities, sign in to the same Clerk account: which device wins which row? Needs explicit per-store merge function (e.g., progress = max(mastery), goals = union by id, attempts = union by id) — covered in driver design but flagged here as a real implementation snare.
14. **CSP currently allows `claude.ai` for the Ask-Claude hand-off.** When `AskClaudePanel` becomes an in-app API call, CSP can be tightened — don't forget to remove the allowance.
15. **B-bias regression** (76% of auto-authored quizzes had answer B) is now in CI's responsibility, not just CLAUDE.md's. Validator must fail PRs that introduce it (immediate win #10).
16. **The operator is the only contributor.** v2 §11 stop-signals apply: > 30 hr/wk for 2 consecutive months → stop or quit day job consciously. The roadmap above is sized for operator-time CAC, not founder-burnout.

---

## 10. Critical files to modify / create

Existing files touched in v0.1 (in addition to the immediate-win list):

- `web/src/lib/progress-store.ts` — delegate to `StorageDriver<Progress>`
- `web/src/lib/learning-goals.ts` — delegate to `StorageDriver<LearningGoal[]>`
- `web/src/lib/games-store.ts` — delegate to `StorageDriver<GamesProgress>`
- `web/src/lib/sme-edits.ts` — delegate to `StorageDriver<SMEEdits>` (v0.4)
- `web/src/lib/progress.ts` — `loadProgressFor` self-healing logic invoked from `adoptLocalIntoServer`
- `web/src/components/dashboard/LearningGoalCapture.tsx` — debounce + AI router call (behind flag)
- `web/src/components/dashboard/DesignerJourneyDecoder.tsx` — debounce + AI router call (behind flag)
- `web/src/components/concept/AskClaudePanel.tsx` — replace link-out with in-app Sonnet call (v0.6)
- `web/src/components/adept/SMEWorkbench.tsx` — server-of-record save path, SSE listener, optimistic concurrency UI (v0.4)
- `web/next.config.ts` — CSP tightening once `claude.ai` link-out is removed
- `web/middleware.ts` (new) — Clerk auth gate + role checks on `/team`, `/adept`, `/api/sme-edits`
- `.github/workflows/ci.yml` — re-enable

New files in v0.1:

- `web/src/lib/storage/driver.ts` — `StorageDriver<T>` interface + factory
- `web/src/lib/storage/local-driver.ts` — `local-only` implementation
- `web/src/lib/storage/server-sync-driver.ts` — `local-first-server-sync`
- `web/src/lib/storage/server-of-record-driver.ts` — `server-of-record` + SSE
- `web/src/lib/ai/router.ts` — single `generate({ system, user, model })` function
- `web/src/server/db/schema.ts` — Drizzle schema
- `web/src/server/db/client.ts` — Neon client
- `web/src/app/api/health/route.ts` — health probe
- `web/src/app/api/progress/[packId]/route.ts` — GET / PUT
- `web/src/app/api/progress/[packId]/attempt/route.ts` — POST (append-only)
- `web/src/app/api/goals/route.ts` — GET / POST / DELETE
- `web/src/app/api/auth/adopt/route.ts` — one-time merge on first signin
- `web/prompts/decoder.md`, `web/prompts/sme-draft.md` — markdown prompt templates
- `web/.env.example` — every variable the app reads
- `plans/runbooks/runbook-{vercel-to-cloudflare,clerk-to-betterauth,neon-to-supabase,anthropic-to-openai,stripe-to-paddle}.md`

---

## 11. Verification (end-to-end test plan)

**Per-feature gates:**

1. **Storage driver canary (v0.1 step 1).** Run `pnpm vitest run lib/storage` — all 4 `local-only` rewrites pass with zero behaviour change vs the prior commit. Run `pnpm playwright test e2e/learner-journey.spec.ts` — full learner happy-path unaffected.
2. **Auth gate (v0.1).** Anonymous user can reach `/`, `/[packId]/section/...`, hits Clerk wall on 4th lesson per free-tier rule. Playwright spec: `e2e/free-tier-gate.spec.ts`.
3. **Merge-on-signin (v0.1).** Vitest integration: populate localStorage with 3 goals + 2 progress packs, mock Clerk signin, assert single POST to `/api/auth/adopt`, assert idempotent on second call. Playwright: guest completes 2 lessons → signs in → second browser context signs in → progress materialises within 2s.
4. **LLM router smoke (v0.1, behind flag).** Hit `lib/ai/router.ts` with a fixture prompt, assert response shape matches expected `DecodedJourney` for a known input, assert circuit-breaker rejects when token-ledger over cap.
5. **Stripe checkout (v0.2).** Playwright: free-tier user clicks upgrade → Stripe Checkout (test mode) → webhook updates `entitlement` → 4th lesson now unlocked.
6. **Team mode (v0.4).** Two Clerk-org members sign in; admin invites; invitee accepts; both see tenant-scoped progress; weekly digest email lands in Resend dev inbox.
7. **SME concurrency (v0.4).** Two browser contexts under same tenant edit the same concept; second save returns 409; refresh merges latest; deploy is blocked until conflict resolved. SSE banner shows other SME active.
8. **Pack deploy audit (v0.4).** Deploy a pack; verify `pack_deploy` row is immutable (DELETE returns 403); verify `snapshot` JSONB contains prompt hashes + model IDs; verify SSE notifies all tenant SMEs.
9. **Daily cost cap (v0.9 / Phase 2).** Stub the LLM router to consume tokens against a per-tenant ledger; assert generation halts at 95% cap; assert next-day reset.

**Non-functional gates per v2 §6 weeks 9–10:**

- Lighthouse mobile ≥ 90 on the 6 v2 surfaces (`/`, `/sign-in`, `/dashboard`, `/study/[slug]`, `/account`, `/team`).
- axe-core sweep — WCAG 2.1 AA on the same 6.
- Sentry alert on unhandled errors; status page (BetterStack) green for 7 days pre-launch.
- Codex review (`codex-review.yml`) passes with no `codex-blockers` label on the launch PR.

**Stop-signals to monitor in production (v2 §11):**

- MRR < $1k by Month 6 → stop, pivot to OSS + consulting.
- AI cost > 30% of MRR for 2 months → raise prices or stop.
- Operator > 30 hr/wk for 2 months → stop or quit day job consciously.
- 3 B2B pilots fail their pre-defined success criteria → stop the B2B motion.

---

## Appendix — alignment with v2 plan

This plan honours v2 in full:

- 6-surface v1, no SOC2, no SAML, no SCIM, no mid-market.
- Single-tenant + `tenant_id` column ready for Phase 2; no RLS in v1.
- All AI through `lib/ai/router.ts`; no `@anthropic-ai/sdk` outside; no Anthropic-specific features in core paths; OpenRouter as the API surface; Haiku 4.5 as default drafter.
- 6-vendor cap: Vercel, Clerk, Neon, R2, Stripe, OpenRouter.
- 8–12 week part-time Phase 1; Phase 2 revenue-gated.
- $15 B2C, $20–25 B2B with $300/$750 platform minimums, $10k non-credited pilot.
- Stop-signals enforced as production-monitoring gates, not advisory text.

Where this plan extends v2: the broader role matrix (§2), the LLM model-routing matrix (§3), the per-store driver policy table (§4), and the v0.6+ roadmap are net-new specificity layered on v2's framework — they don't contradict v2, they apply it to the actual code in `/web/`.
