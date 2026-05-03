# @ccafp/db

Supabase schema for the learning platform. Source-of-truth content lives in
Markdown in this repo and is ingested via `@ccafp/importer`.

## Migrations

Applied in order by `supabase db push` (or `supabase migration up`):

| File | Adds |
|---|---|
| `0001_content.sql` | `content_pack`, `domain`, `mcq`, `challenge`, `solution`, `mock_exam`, `mock_exam_question` |
| `0002_user_and_entitlements.sql` | `profile`, `entitlements`, `exam_attempt`, `response`, `flag`; auto-provision trigger |
| `0003_rls.sql` | Row-level security: published content is public, user-owned rows are private |

## Free-launch posture

`entitlements` and `profile.stripe_customer_id` ship from day one but are
**dormant**. Every new user is auto-provisioned with `plan = 'pro'` and all
caps `NULL` (unlimited). When pricing flips on (Phase 1.5):

1. Change the `plan` default in `0002_user_and_entitlements.sql` (or run a
   targeted `alter column ... set default 'free'`).
2. Backfill existing users with whatever grandfathering policy you choose.
3. Wire Stripe webhooks to update `entitlements` rows on subscription events.

The application's `requireEntitlement` middleware reads from `entitlements`
either way — no application change is required to flip pricing on.

## Local dev

```sh
supabase init           # if not done
supabase start          # spins up local Postgres
supabase db reset       # applies migrations from scratch
```
