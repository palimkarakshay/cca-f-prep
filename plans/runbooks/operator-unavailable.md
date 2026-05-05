# Runbook: Operator unavailable (vacation, illness, emergency)

## Pre-emptive setup (do once before first paying customer; ~4 hours)

1. **Auto-responder on `support@`** during planned absences:
   *"We respond within 48 hours. During current operator absence
   ending {date}, expect a 5-day delay. Refunds processed
   automatically within 3 days regardless of operator status."*
2. **Stripe auto-refund flag:** enabled for refund requests via
   API webhook so customer-initiated in-app refund works without
   operator action.
3. **BetterStack alerts pause-on-vacation toggle.**
4. **Reviewer briefed.** §17b reviewer has emergency contact info
   and can pause new signups via feature flag if a critical
   incident occurs during operator absence.

## On entry to actual absence

1. Set out-of-office on `support@` with the date the operator
   returns.
2. Email reviewer: *"I'm out from {date} to {date}. Critical
   alerts go to ___."*
3. **Tighten cost circuit-breaker (§16.13)** for the duration:
   $5/day cap instead of $10/day default. Prevents a runaway bug
   from running while operator is away.
4. Move critical-priority email rules so urgent items sit at top
   of inbox on return.

## On return

1. Triage `support@` in chronological order. Apply the 30-day
   refund-no-questions policy generously to anything that
   accumulated.
2. Honor any chargebacks that fired during absence; document in
   `incidents/`.
3. Restore cost circuit-breaker to default cap.
4. Update `decisions.md` with the absence dates and any impact.
5. §17b reviewer call within one week of return — review what
   happened.

## Implicit cost

A full review-free week (per §11.8 + iter-07 N53) typically
generates 8–15 support emails on return. Budget ~3 hours of catch-
up triage per week of absence. Built-in to the sustainability
gates.
