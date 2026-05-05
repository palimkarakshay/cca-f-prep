# Runbook: Data breach notification (GDPR / CCPA / state)

## Trigger

Any of:
- Unauthorized access to user data (Stripe customer IDs, emails,
  lesson progress, calibration data) confirmed via Sentry
  exception, Cloudflare WAF log, or sub-processor breach
  notification (e.g., Stripe / Clerk / Neon / Anthropic notifies
  the operator).
- Exfiltration suspected: anomalous downloads, unfamiliar IPs in
  Postgres logs, GitHub secret-scanning alerts on operator
  credentials.
- A user reports their account was used without authorization.

## Steps (≤ 72 hours, GDPR clock)

### Hour 0–4 — Contain

1. Rotate all secrets: ANTHROPIC_API_KEY, STRIPE_API_KEY,
   CLERK_SECRET_KEY, NEON_DB_URL, RESEND_API_KEY. Push new env to
   Vercel.
2. If credential compromise suspected: invalidate all sessions
   via Clerk's session-revoke API.
3. Pause new signups: feature flag `signups_paused = true`.
4. Capture forensic evidence: screenshot Sentry / Cloudflare logs;
   `pg_dump` the audit log table to a separate bucket.

### Hour 4–24 — Assess

1. Determine scope: which users, which fields, when, by whom?
2. Determine if "personal data" was accessed (yes if email +
   anything else).
3. Determine geographic distribution of affected users (EU, UK,
   California, other).
4. Document timeline in `incidents/<date>-<id>.md`.

### Hour 24–72 — Notify

1. **EU / UK users** affected: notify the lead supervisory
   authority (typically Ireland's DPC if no EU establishment) within
   72 hours of becoming aware. Use the EU breach-notification
   template; include scope, affected categories of data, expected
   consequences, mitigations.
2. **California users** affected (>500): notify CA Attorney General
   per CCPA; notify users.
3. **Other US states** with breach laws (NY, MA, IL, etc.): check
   state-by-state thresholds.
4. **All affected users**: email notification within 30 days
   (CCPA) or "without undue delay" (GDPR). Use the
   `email-templates/breach-notification.md` (pre-drafted).

### Hour 72+ — Remediate

1. Root-cause analysis: what controls failed? What new control
   prevents recurrence?
2. Public post-mortem at `/security/incidents/<id>` (after legal
   review). Builds trust by demonstrating transparency.
3. Update privacy policy if scope changed.
4. Notify §17b reviewer; trigger an extra audit call.

## Pre-loaded templates

- EU/UK Article 33 notification template (drafted with attorney).
- CCPA AG notification template.
- User-facing email template — clear, contrite, factual.
- Public post-mortem outline.

## Cost estimate

- Forensic + legal time, even for small breaches: $5–15k.
- Insurance E&O / cyber coverage should backstop some of this if
  bought at first paying user (per §16.11).
