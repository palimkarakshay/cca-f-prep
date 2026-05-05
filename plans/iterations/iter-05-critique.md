# Iteration 05 — Hostile Review (Technical execution / vendor-deprecation)

> **Date.** 2026-05-05
> **Stance.** Attacks the **technical and vendor-stability** assumptions
> of the post-iter-04 plan. Cost-basis line items, model deprecations,
> Vercel pricing changes since 2025, Stripe / Clerk migrations.
> **Output.** New findings (N36+).

---

## N36 — Vercel Pro $20/mo claim is now wrong; real Pro plan with realistic traffic is $30–80/mo.

Vercel restructured pricing in September 2025: bandwidth overage
went from $0.15/GB to **$40 per 100 GB** ($0.40/GB), and the Pro plan
moved to a $20/mo *seat* + credit-based billing where overage adds
fast.

**Cost-basis check at the §16 Y1 traffic shape:**
- 50–200 paying users + likely 5–10× free-tier visitors via SEO =
  ~500–1,500 monthly unique visitors at peak Y1.
- Average page weight (Next.js hybrid SSR): ~600 KB.
- Bandwidth: ~1–3 GB/mo. Comfortably under the 1 TB Pro allowance.
- **Function invocations.** Each lesson page with a quiz triggers
  6–10 server actions for spaced-review state, calibration-Δ store,
  Stripe webhook, etc. At 1k visitors × 8 invocations = 8k
  invocations/mo. Pro allowance is 1M; safe.

**However** Vercel's 2025 restructure introduced:
- **Credit-based billing**: $20/mo includes flexible credit, but
  edge-runtime ms / image-optimization counts against it.
- **Seat-based pricing** kicks in if a second person logs into the
  Vercel team — at $20/seat. Operator alone = OK.
- **Image optimization** at 5,000 ops/mo on Pro; with 100 lessons
  × cover image + thumbnails = 200+ ops per visitor pageload, easily
  blowing through the credit at 1k visitors.

**Realistic Vercel Pro Y1 cost: $20–35/mo** (not $20). The earlier
estimate is correct only if image optimization is disabled or
self-hosted.

**Y2 cost** (200–800 paying users, 10k MAU, 50k pageviews/mo):
$50–80/mo Vercel Pro after image-opt overage.

**Migration alternatives** (now better-than-Vercel for the §16 use
case):
- **Cloudflare Pages + Workers**: free for commercial use; static-
  first; costs ~$0–10/mo even at Y2 traffic.
- **Render**: $19/mo Professional tier *including* PostgreSQL —
  actually replaces Vercel + Neon; net Y1 cost $19 vs ~$45 Vercel +
  Neon.
- **Self-host on Hetzner/DigitalOcean** ($5–10/mo): per the original
  P7 mitigation Option 2.

**Recommended edit.** Mitigation plan §16: re-evaluate hosting at
project start. **Default: Cloudflare Pages + Workers** for commercial-
permissible free hosting, OR **Render at $19/mo** if Postgres is
needed at launch. **Vercel Pro is no longer the recommended
default** as of the 2025 pricing change.

---

## N37 — Anthropic model deprecation cycle is faster than the plan models.

**Public Claude deprecation timeline as of May 2026:**
- Claude Sonnet 4 / Opus 4: deprecated, **retire June 15, 2026** (41
  days from today).
- Migration target: Sonnet 4.6 / Opus 4.6 / Opus 4.7 (released April
  16, 2026).
- Claude Haiku 4.5 is current, no announced retirement.
- Anthropic provides "at least 60 days notice" for retirement.

**Implications for the §16 plan:**

1. **Validator suite was likely written against Sonnet 4 or Opus 4
   prompt formats.** Anthropic's prompt-handling has changed
   between 4.x and 4.6 in ways that affect:
   - Tool-use schema (4.6 introduced new strict-mode constraints).
   - Caching behavior (cache breakpoint heuristics changed).
   - Output structure for structured generation.
2. **Validator regression is likely on every model migration.** The
   "23 documented failure modes" set was tuned for one model's
   failure profile. New models have new failures.
3. **The plan's §16.1 "Haiku 4.5 for content drafts"** is currently
   safe but Haiku 4.5 will deprecate. Without a validator regression
   test suite, every model swap risks degraded output.

**Recommended edit.** Add to §16:

> **Model migration discipline (added iter-05 N37):**
> 1. **Pin exact model versions** in the API call: `claude-sonnet-4-6-20251015` not `claude-sonnet-4-6`. Avoid auto-upgrades.
> 2. **Validator regression suite** — a fixed corpus of 50–100
>    prompt + expected-output pairs that runs on every model swap.
>    Failures block rollout.
> 3. **Migration runbook** at `plans/runbooks/model-deprecation.md`
>    with: pinned-model swap procedure, validator regression
>    procedure, content-pack revalidation steps. Estimate per
>    model swap: 4–8 hours of operator time.

The mitigation plan already had P11 §3 listing migration runbooks;
this adds the model-specific one.

---

## N38 — Cost basis still doesn't include backup / disaster recovery.

The §16 plan says "Postgres on Neon free tier" → "Scale at >250 MB."

**What the plan doesn't have:**
- **Postgres backup off-Neon.** Neon's free tier has 7-day point-in-
  time-recovery; if the operator's account is deleted (compromise,
  TOS dispute, billing failure), data is gone. Recommended: weekly
  `pg_dump` to Cloudflare R2 or Backblaze B2.
- **Object storage for content.** Lesson markdown + images. Plan
  has no storage tier specified.
- **Application-level rollback.** Vercel deploy-rollback on web
  app, but no DB-state rollback. A bad migration is one
  CI-run away.

**Cost overhead:**
- Cloudflare R2 free tier (10 GB free, $0.015/GB/mo above): $0–5/mo.
- Backup automation script: 2–4 hours one-time.
- Migration testing in staging: implicit in any CI/CD; should be
  part of the §16 build budget.

**Recommended edit.** Add a runbook
`plans/runbooks/db-restore.md`:

```
# Runbook: Postgres restore from backup

## Triggers
- Bad migration in production.
- Neon account compromise / suspension.
- Data corruption from validator pipeline bug.

## Pre-emptive setup
1. Cron'd weekly `pg_dump` to R2 bucket (operator's R2 account).
2. Versioned filenames; 30-day retention.
3. Restore tested manually quarterly.

## Steps
1. Stop write traffic: feature flag `db_writes_paused = true`.
2. Spin up new Neon branch from latest known-good backup.
3. Update DATABASE_URL env in Vercel.
4. Replay differential since backup if available.
5. Resume writes; document RTO in incident log.

## RTO
- From R2 backup: 30–90 minutes if practiced.
- From Neon point-in-time: 5–15 minutes.
```

Add ~$5/mo to §16.5 cost basis for R2 backup storage.

---

## N39 — The §16 plan still doesn't have a CI/CD or test strategy.

The validator suite is the moat (per iter-01 N9). The §16 plan
deferred most testing to "Y2." But unguarded validator changes risk:
- Regressions in the validator suite that ship to paying customers.
- Unguarded prompt template changes that break content generation.
- Database migrations that lose user progress.

**Minimum viable CI/CD for the §16 shape:**
- GitHub Actions: lint + typecheck + unit-test on every PR.
- Validator regression test on every PR that touches the
  `validators/` or `prompts/` directory.
- Migration test (apply, then revert) on every PR that touches
  `db/migrations/`.

**Cost:** GitHub Actions free tier covers this comfortably ($0/mo).
Operator time to set up: 6–10 hours.

**Recommended edit.** §16.4 ("what you don't build") removes "ops
hygiene" implicit defer. CI/CD is launch-blocking; budget the 6–10
hours.

---

## N40 — Stripe TOS for "exam prep" and digital-goods restrictions.

Stripe accepts education and digital-goods, but their terms include:
- A "high-risk merchant" review cycle for any merchant with
  chargeback ratio >0.75% (covered in iter-02 N17).
- A specific clause on "guarantee of certification pass" claims —
  language that promises a certification result triggers Stripe's
  enforcement of FTC truth-in-advertising.
- Stripe's TOS forbid "predatory" tutoring claims; the framing
  "guaranteed pass or refund" is on the edge.

**The §16.2 "30-day money-back, no questions asked" is fine.** But
the implementation must show the policy in checkout *and* receipt;
otherwise chargebacks are Stripe's call, not the operator's.

**Recommended edit.** §16.11 already covers NDA / marketing
discipline; add a one-liner:

> Stripe checkout must display the 30-day refund policy at the
> moment of payment. Email receipts must include the same
> language. Marketing copy avoids any "guaranteed pass" or
> "X% pass rate" claims (also ban under FTC truth-in-advertising
> and Stripe's high-risk merchant review).

This is largely already covered by §16.11 N29; just sharpen the
checkout-display requirement.

---

## N41 — Clerk migration runbook is absent.

Iter-01 mentioned Clerk → Auth0 as a P11 migration runbook. **The
runbook doesn't exist yet.** Clerk is the auth substrate; if Clerk
deprecates the free tier or raises pricing (Clerk has historically
been stable but raised pricing in 2024 by 30%), the migration
needs to happen quickly.

**Realistic cost of a Clerk-to-Auth0 migration**:
- Code: ~16–24 hours of operator time (auth-flow rewrite,
  middleware swap, session-validation).
- DB schema: ~4 hours (user_id mapping, session table changes).
- DNS / OAuth callback: ~2 hours.
- User-facing impact: forced re-login window. ~30% of users will
  bounce on the re-login prompt.

**Recommended edit.** Add `plans/runbooks/clerk-migration.md`:

```
# Runbook: Clerk migration to alternative auth

## Triggers
- Clerk free tier cap hit (10k MAU; ~$0/mo currently).
- Clerk Pro pricing change >30% YoY.
- Clerk service quality drops (>2 outages in a quarter).

## Pre-emptive hardening
1. Auth abstraction at `lib/auth.ts`; never call `clerkClient`
   directly from route handlers.
2. User_id stays a UUID, not a Clerk-specific ID.
3. Sessions stored in DB, not just Clerk.

## Migration steps (≤ 2 weeks part-time)
1. Stand up alternative (Auth0, Supabase Auth, Better-Auth) in
   parallel. ~6 hours.
2. Migrate user records: email + password-reset-link to alt
   provider. ~4 hours.
3. Switch auth abstraction to alt provider; deploy with feature
   flag for 1 week of dual-mode running. ~4 hours.
4. Force user re-login (email blast: "we're migrating auth; please
   log in with your existing email; new password reset emailed").
   ~2 hours user-facing copy + monitoring.
5. Remove Clerk from codebase and DPA list. ~2 hours.

## RTO
- 2 weeks elapsed if pre-emptive hardening done.
- 4–6 weeks if not.
```

The runbook only matters if the pre-emptive hardening is done.
That's a launch-blocking 4 hours of work.

---

## N42 — The plan has no observability stack beyond "Sentry free tier."

For a production B2C SaaS handling payments, the minimum viable
observability is:
- **Error tracking** — Sentry free tier: covered.
- **Uptime monitoring** — BetterStack at $25/mo: covered.
- **Logs** — Vercel logs (or Cloudflare Workers Tail) work for
  ad-hoc debugging.
- **Performance / metrics** — *missing*. No P50/P95 latency tracking
  for /study/[slug] page loads or Stripe webhooks.
- **Alerting** — *missing*. BetterStack only alerts on uptime
  failure, not on Stripe webhook failure or AI cost spike.
- **Cost monitoring** — *missing*. No alert when Anthropic cost
  crosses $X/day or Stripe chargeback ratio crosses threshold.

**The blind spot is cost.** AI cost is the largest variable expense
and the one most likely to surprise the operator. A single
runaway-loop bug could 10× the monthly Anthropic bill in a day,
and the operator won't notice until the credit card declines.

**Recommended edit.** Add to §16:

> **Cost-circuit-breaker (added iter-05 N42):** Server-enforced
> per-tenant + global daily Anthropic spend cap. When global
> spend > $10/day (or 2× rolling 7-day average), the content-
> generation pipeline pauses and emails the operator. Implementation:
> a Postgres `daily_spend_log` table, a cron-checked rollup, and a
> feature flag on the LLM-call wrapper. ~6 hours of work; saves a
> potential $1k+ runaway invoice.
>
> **Performance baseline:** Capture P50/P95 page-load and webhook
> latency in PostHog event metadata. Surface in §17b dashboard. No
> alerting in Y1; just visibility.

---

## Iteration 05 verdict

**New structural findings:** N36 (Vercel default no longer), N37
(model deprecation cycle), N42 (cost circuit-breaker).

**3 new structural findings.**

**Tactical findings:** N38 (DB backups), N39 (CI/CD), N40 (Stripe
checkout display), N41 (Clerk migration runbook).

**Streak counter: still 0/5.**

**Plan-level state of progress.** After 5 iterations the plan has
gone from "venture-shape AI-LMS" through "B2C cert-prep micro-SaaS"
to a *substantially harder* shape:
- Pricing: $29 one-time + $19/mo + $149/yr.
- Catalog: AI-103 (Microsoft Azure AI Engineer App/Agent Developer).
- Distribution: SEO-only, 12–18 month ramp.
- Cost basis: $337–522/mo Y1.
- Compliance: LLC, insurance, EU geo-fence, NDA discipline.
- Migration: pinned model versions, validator regression suite.

The plan is now realistic-shaped but **operator-hour-budget over-
subscribed**. Iter-06 should attack that.
