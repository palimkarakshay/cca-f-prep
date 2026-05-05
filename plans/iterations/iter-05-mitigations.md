# Iteration 05 — Mitigations

## Triage

| # | Finding | Triage | Closes in |
|---|---|---|---|
| N36 | Vercel Pro no longer the default | Structural (re-pick host) | this iter |
| N37 | Model deprecation cycle faster than plan | Structural (pinned versions + regression) | this iter |
| N38 | No DB backup strategy | Tactical (R2 + cron) | this iter |
| N39 | No CI/CD or test strategy | Tactical (GH Actions) | this iter |
| N40 | Stripe checkout-display gap | Tactical (one-line edit to §16.11) | this iter |
| N41 | Clerk migration unwritten | Tactical (runbook) | this iter |
| N42 | Cost circuit-breaker missing | Structural (hard cap) | this iter |

---

## N36 — Hosting re-pick

Update §16.1:

> **Hosting (revised iter-05 N36):** Default = **Cloudflare Pages +
> Workers** (free, commercial-permissible). Postgres on Neon free
> tier. Object storage on Cloudflare R2 (10 GB free, $0.015/GB above).
> If Postgres-bundled hosting is preferred for ops simplicity:
> **Render Professional ($19/mo, includes PostgreSQL)** is the
> alternative; replaces Vercel + Neon at lower combined cost.
> **Vercel Pro is *not* the recommended default** as of the September
> 2025 pricing restructure (bandwidth at $0.40/GB, image-opt overage).
> Vercel Pro remains an option if the operator already has a paid
> Vercel team and wants the DX, but cost expectation is $20–80/mo,
> not $20/mo flat.

Update §16.5 cost basis: replace "Vercel Pro $20" with one of:
- "Cloudflare Pages free / Render Professional $19".

## N37 — Model migration discipline

Add §16.12 (or extend §16.11):

> ### 16.12 Model migration discipline (added 2026-05-05, iter-05 N37)
>
> 1. **Pin exact model versions** in API calls:
>    `claude-sonnet-4-6-20251015`, `claude-haiku-4-5-20251001`. Avoid
>    auto-upgrades through alias names.
> 2. **Validator regression suite** in repo at `tests/validators/`:
>    50–100 prompt + expected-output pairs. Runs on every model
>    swap. Failures block rollout.
> 3. **Per-swap runbook** at `plans/runbooks/model-deprecation.md`:
>    pinned-model swap procedure, validator regression, content-pack
>    revalidation. ~4–8 operator hours per swap.

Add `plans/runbooks/model-deprecation.md`.

## N38 — DB backup strategy

Add `plans/runbooks/db-restore.md` (per the iter-05 critique
content). Add ~$5/mo R2-storage line to §16.5 cost basis.

## N39 — CI/CD

§16.4 adjust: CI/CD is launch-blocking (not deferred to Y2).

Specifics:
- GitHub Actions: lint + typecheck + unit-test on every PR.
- Validator regression on every PR touching `validators/` or
  `prompts/`.
- Migration apply+revert on every PR touching `db/migrations/`.
- Cost: $0/mo (GitHub Actions free tier).
- Operator setup time: 6–10 hours.

## N40 — Stripe checkout discipline

Append to §16.11:

> Stripe checkout must display the 30-day refund policy at the
> moment of payment. Email receipts must include the same language.
> No "guaranteed pass" or "X% pass rate" claims — both FTC truth-in-
> advertising and Stripe's high-risk merchant review enforce
> against these.

## N41 — Clerk migration runbook

Add `plans/runbooks/clerk-migration.md` (per critique content).

Pre-emptive launch-blocking work:
- Auth abstraction at `lib/auth.ts`; never call `clerkClient`
  directly from route handlers. ~4 hours.

## N42 — Cost circuit-breaker

Add to §16:

> ### 16.13 Cost circuit-breaker (added 2026-05-05, iter-05 N42)
>
> 1. **Per-tenant daily AI spend cap.** Postgres `daily_spend_log`
>    tracks Anthropic API cost in cents per tenant per day. LLM-
>    call wrapper checks cap before each request; rejects if cap
>    hit.
> 2. **Global daily AI spend cap.** $10/day default, escalating
>    by published schedule as MRR grows.
> 3. **Cost-spike alert.** When global daily spend > 2× the rolling
>    7-day average, page the operator (Resend transactional email).
> 4. **Implementation cost.** ~6 hours; one-time. Saves a potential
>    runaway-loop $1k+ invoice.
> 5. **Operator action on alert.** Pause LLM-call wrapper via
>    feature flag; investigate; resume only after root cause
>    identified.

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — apply N36, N37,
   N42 inline.
2. `plans/runbooks/db-restore.md`, `plans/runbooks/clerk-migration.md`,
   `plans/runbooks/model-deprecation.md` — created.
3. `plans/iterations/ledger.md` — append.

---

## Streak counter

**Iter 05: 3 new structural + 4 tactical. Streak = 0/5.**
