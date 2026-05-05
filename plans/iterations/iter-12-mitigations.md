# Iteration 12 — Mitigations (streak 2/5)

## Tactical fixes

### T-12.1 — 2FA on all accounts

Add to §16.1 launch checklist:

> **Pre-launch security checklist:**
> - 2FA / TOTP enforced on: Clerk, Stripe, Anthropic, GitHub,
>   domain registrar, hosting (Render/Vercel/Cloudflare), Neon,
>   personal email, X / LinkedIn brand accounts.
> - One-time setup, ~30 minutes total. Eliminates the most common
>   account-takeover attack class.

### T-12.2 — Supply-chain hardening

Append to §16.12 model-migration discipline OR new §16.17:

> ### 16.17 Supply-chain hardening (added 2026-05-05, iter-12 T-12.2)
>
> 1. **`pnpm audit`** runs in CI on every PR; failures block merge.
> 2. **Dependabot PRs** reviewed weekly; auto-merge denied for any
>    package crossing a major version.
> 3. **Lockfile pinning:** no caret (`^`) in dependencies; use
>    exact versions (`pnpm install --save-exact`).
> 4. **Quarterly `npm-audit-resolver` review** in §17b.

### T-12.3 — Secret rotation

Append to §17b checklist:

> Quarterly secret rotation: ANTHROPIC_API_KEY, STRIPE_API_KEY,
> CLERK_SECRET_KEY at minimum. Use Vercel/Render env-var versioning
> for zero-downtime rotation.

### T-12.4 — Registrar specification

Update §16.1 hosting block:

> **Domain registrar:** Porkbun or Cloudflare Registrar.
> Transfer-locked, 2FA on, contact info masked, auto-renew enabled
> with backup payment method.

## Streak counter

**Iter 12: 0 structural + 4 tactical. Streak = 2/5.**
