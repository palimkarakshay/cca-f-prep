# Iteration 07 — Mitigations

## Triage

| # | Finding | Triage | Closes in |
|---|---|---|---|
| N49 | Tax / VAT compliance unbudgeted | Structural (geo-fence + Stripe Tax) | this iter |
| N50 | WCAG / ADA exposure | Structural (component lib + axe-core CI) | this iter |
| N51 | US state privacy laws beyond CCPA | Tactical (template scope) | this iter |
| N52 | No operator-unavailable continuity | Structural (runbook + flags) | this iter |
| N53 | Review-free week unimplemented | Tactical (calendar + runbook) | this iter |

---

## N49 — Tax / VAT compliance

Append to §16.11:

> ### Tax / VAT compliance (added 2026-05-05, iter-07 N49)
>
> 1. **Geo-fence non-US, non-Canada traffic** at signup. Reduces
>    exposure to ~50 US states + 13 Canadian provinces. EU geo-fence
>    (per iter-04 N31) extended to all non-NA jurisdictions until
>    tax compliance capacity exists.
> 2. **Stripe Tax enabled from day 1** (~$5–15/mo at Y1 scale).
> 3. **Operator's home-state registration done before first sale**
>    if home state taxes SaaS. Cost: $0–$300.
> 4. **Quarterly nexus review** in §17b reviewer call: confirm no
>    state has tripped its threshold.
> 5. **Y2 escape valve:** at MRR > $5k, hire fractional bookkeeper
>    / tax accountant ($300–800/mo) to take this surface off the
>    operator.

Update §16.5 cost basis: add $10/mo Stripe Tax line.

## N50 — Accessibility

Append to §16.11:

> ### Accessibility (added 2026-05-05, iter-07 N50)
>
> 1. **WCAG-conformant component library** at build time (Radix
>    UI / shadcn/ui).
> 2. **axe-core in CI** scanning every PR. Free.
> 3. **One-time audit before launch:** $0–500 (free-tools route)
>    or $1k–3k (auditor route). 10–15 hours of operator
>    remediation either way.
> 4. **Public accessibility statement** at `/accessibility`.
> 5. **Quarterly axe-core regression run** in §17b reviewer call.

Add 10–15 operator hours to launch-blocking list (already trimmed in
iter-06; this offsets ~10 of the 20 hours saved by deferring spaced
review and retake mode to v1.1).

## N51 — Privacy template scope

Append to §16.11 privacy block:

> Privacy policy template covers: GDPR, UK GDPR, CCPA/CPRA,
> Virginia VCDPA, Colorado CPA, Connecticut CTDPA, Utah UCPA,
> Texas TDPSA, plus residual "all other US state laws" section.
> Reviewed annually by attorney.

## N52 — Operator-unavailable runbook

Add `plans/runbooks/operator-unavailable.md`. Pre-emptive setup is
launch-blocking (~4 hours).

## N53 — Review-free week implementation

Append to §11.8:

> **Implementation:**
> 1. Pre-schedule one calendar week per quarter as "review-free."
>    Mark in spouse's / reviewer's calendar.
> 2. Use the operator-unavailable runbook (iter-07 N52) for the
>    week.
> 3. The §17b reviewer call *before* the review-free week confirms
>    the operator is on track to take it.
> 4. Skipping a review-free week without a documented reason (in
>    `decisions.md`) counts as a stop signal.

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — N49, N50, N51,
   N53 inline.
2. `plans/runbooks/operator-unavailable.md` — created.
3. `plans/iterations/ledger.md` — append.

---

## Streak counter

**Iter 07: 3 structural + 2 tactical. Streak = 0/5.**
