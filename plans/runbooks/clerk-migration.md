# Runbook: Clerk migration to alternative auth

## Triggers

- Clerk free-tier cap hit (10k MAU; near-zero risk in Y1, possible Y2).
- Clerk Pro pricing change >30% YoY.
- Clerk service-quality drop (>2 outages in a quarter).
- Clerk-specific TOS shift incompatible with operator's use.

## Pre-emptive hardening (launch-blocking, ~4 hours)

1. Auth abstraction at `lib/auth.ts`. Never call `clerkClient`
   directly from route handlers; always go through the abstraction.
2. User_id is a UUID generated at signup, not the Clerk-specific ID.
   Foreign keys reference the UUID.
3. Sessions are stored in a Postgres `sessions` table, not just in
   Clerk's session store.
4. OAuth callback URLs are ours, not Clerk-defaulted.

## Migration steps (≤ 2 weeks part-time)

1. Stand up alternative (Auth0, Supabase Auth, Better-Auth) in
   parallel. ~6 hours.
2. Migrate user records: email + password-reset-link to alt
   provider. ~4 hours.
3. Switch the auth abstraction to alt provider; deploy with feature
   flag for 1 week of dual-mode running. ~4 hours.
4. Force user re-login (email blast: *"we're migrating auth; please
   log in with your existing email; new password reset link
   inbound"*). ~2 hours user-facing copy + monitoring.
5. Remove Clerk from codebase and the §16.11 DPA list. ~2 hours.

## RTO

- 2 weeks elapsed if pre-emptive hardening done.
- 4–6 weeks if not.

## User-facing impact

A forced re-login event typically loses ~30% of low-engagement users.
For a B2C subscription product, this is a one-time churn shock. Time
the migration during a slow period (post-launch, pre-busy season).
