# Runbook: Postgres restore from backup

## Triggers

- Bad migration in production.
- Neon account compromise / suspension / billing failure.
- Data corruption from validator pipeline bug.
- TOS dispute with Neon.

## Pre-emptive setup (launch-blocking)

1. Cron'd weekly `pg_dump` to operator's Cloudflare R2 bucket.
2. Versioned filenames: `db-YYYY-MM-DD-HHMM.sql.gz`.
3. 30-day retention on the bucket.
4. Restore tested manually quarterly (in §17b reviewer call,
   confirm last successful test date).

## Steps

1. Stop write traffic: feature flag `db_writes_paused = true` via
   admin route or env update.
2. Spin up a new Neon branch from latest known-good backup OR from
   R2 dump (`pg_restore` to a new Neon project).
3. Update `DATABASE_URL` env in Vercel/Cloudflare.
4. Replay differential since backup if available (Stripe webhooks
   in last N hours, transactional emails sent, etc.).
5. Resume writes; document RTO in incident log.

## RTO

- From Neon point-in-time (last 7 days): 5–15 minutes.
- From R2 backup: 30–90 minutes if practiced quarterly.
- Cold-start (untested setup): 4+ hours.

## Cost

R2 storage at <2 GB compressed = ~$0.03/mo (effectively free).
