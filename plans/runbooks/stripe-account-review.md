# Runbook: Stripe account review or chargeback-ratio warning

## Trigger

- Stripe email: *"Your account is under review"* or *"Chargeback
  ratio exceeded threshold."*
- Chargeback ratio crosses 0.75% (warning) or 1.5% (termination
  risk).

## Steps (≤ 4 hours)

1. Pause new sign-ups in the app: feature flag `signups_paused = true`.
2. Reply to Stripe email within 24 hours with: business model
   summary, refund policy, dispute-handling process, links to
   customer satisfaction evidence (Reddit, reviews).
3. For each open chargeback, file Stripe evidence with: signup
   timestamp, IP, email confirmation timestamp, lesson access logs,
   refund-policy disclosure on checkout.
4. Lower chargeback ratio: issue 30-day proactive refunds to any
   user with <2 sessions in the last 30 days (catch the dormant-
   subscriber chargebacks before they happen).
5. Update billing flow: enforce double-confirmation on annual plan
   *"you are about to be charged $149"*; send 7-day-before-renewal
   reminders.

## Backup payment processor

- Pre-register a Paddle / Lemon Squeezy account before launch.
- If Stripe terminates, migrate active subscribers via Paddle's
  one-click migration tool. Estimated migration: 12–18 hours,
  including DNS / webhook reconfiguration.

## Pre-launch hardening

- 30-day money-back policy clearly visible on checkout AND in the
  emailed receipt.
- 3D Secure enforced on annual plans.
- Decline list for high-risk countries (configurable per Stripe
  recommendations).

## Pre-emptive monitoring

- Weekly Stripe dashboard review: chargeback ratio, dispute count,
  failed-payment retry rate. Owned by operator, included in §17b
  quarterly reviewer call.
