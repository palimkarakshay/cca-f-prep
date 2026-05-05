# Runbook: public quality complaint on generated content

## Trigger

Public post (Reddit, Twitter / X, Hacker News, in-app feedback)
alleging a factual error in generated content with > 50 upvotes /
engagement, OR the post coming from an account with > 5k
followers, OR a complaint reaching the operator's support inbox
that mentions "I will demand a chargeback / I posted publicly."

## Steps (≤ 24 hours)

1. **Acknowledge publicly within 4 hours.** *"Thanks for flagging.
   We're investigating; refund issued unconditionally regardless of
   what we find."* The unconditional refund kills the chargeback
   path and de-escalates the public thread.
2. **Issue refund within 4 hours via Stripe.** If the user is on the
   one-time $29 SKU, full refund. If subscription, full refund of
   the most recent charge.
3. **Investigate within 24 hours.** Re-run the question through the
   validator suite, the critic LLM, and an external check (a second
   model or a web-search verification). Write the findings to a
   `public-quality-log/<incident-id>.md` file.
4. **If validated as a real error:** post the corrected lesson +
   write-up of "what we changed in the validator suite to prevent
   this class of error." Tag the original poster.
5. **If not validated** (user error, out-of-date question due to
   exam-vendor change): acknowledge publicly the mismatch, but keep
   the refund. Update the lesson to reflect any exam-vendor change
   even if not strictly an error.
6. **If the cycle hits ≥ 3 incidents in a quarter, stop new content
   generation** until the validator suite addresses the root cause
   class. Keep the catalog static during the freeze.

## Pre-loaded responses (before launch)

- Stripe refund template URL — bookmarked.
- Public apology template — written, signed off.
- Validator-suite changelog format — README'd in the public repo.
- A `public-quality-log/` directory in the open-source validator repo
  so corrections are auditable.

## Long-term defense

- Pre-publish disclaimers on every lesson page: *"Generated with
  AI-assisted authoring + validator suite. Spot an error? Email
  support@; we refund unconditionally on verified errors."* Inverts
  the framing — errors become a *user-facing pact*, not a
  hidden flaw.
- Public bug-bounty: *"We pay $25 per verified content error
  reported."* Cheap insurance; turns hostile critics into paid
  testers.

## Owned by

Operator. Reviewed quarterly in the §17b reviewer call.
