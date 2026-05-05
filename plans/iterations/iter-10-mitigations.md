# Iteration 10 — Mitigations (streak reset)

## N59 — Day-job employment-agreement risk

Add §11.9 to canonical plan + D-006 to decisions.md.

### §11.9 (canonical plan)

> ### 11.9 Day-job employment-agreement compatibility (added 2026-05-05, iter-10 N59)
>
> Operator commits to:
> 1. **Read employment agreement** for moonlighting / IP / non-
>    compete clauses before D-002 in `decisions.md`.
> 2. **File required disclosures** with employer if moonlighting
>    review is required.
> 3. **All side-bet work on personal hardware in personal hours.**
> 4. **Side-bet IP registered to operator personally**, separate
>    from any day-job systems.
> 5. **If employment agreement is incompatible** (broad
>    non-compete, broad IP assignment), the §16 plan is the
>    wrong fit — consider §17.2 of negative study (consulting
>    day rates with disclosure to employer).

### D-006 (decisions.md)

Add to decisions.md:

> ## D-006 — Day-job employment agreement compatibility
>
> - **Date.** *(operator to fill in by 2026-05-19)*
> - **Signer.** Operator
> - **Decision.** Side-bet is/is not compatible with day-job
>   employment agreement.
> - **Evidence.** Employment-agreement section reference / clauses
>   reviewed.
> - **Disclosure status.** Filed with employer / not required.
> - **Action if incompatible.** Stop the §16 plan; consider §17.2
>   of negative study (consulting with explicit disclosure).

---

## Tactical fixes

### T-10.1 — Quarterly link-rot scan

Append to §17b checklist:

> Quarterly link-rot scan: automated check that all
> `derived_from_public_doc_url` links in the lesson catalog
> resolve. Use `lychee` or similar. Failures → operator
> updates/replaces citations within 30 days.

### T-10.2 — Quarterly content-freshness audit

Append to §17b checklist:

> Quarterly content-freshness audit: diff current Microsoft Learn
> AI-103 (or chosen catalog) Skills Measured outline against the
> last-known-good outline. Any new objectives → schedule lesson
> creation; any retired objectives → archive lessons. ~2 hours.

### T-10.3 — Support@ infrastructure

Update §16.5 cost basis line:

> | Domain email (Fastmail / Workspace **personal account, not day-job**) | $6 |

Add note in §16.11 brand-first identity:

> Support@ is a personal-account-backed inbox (Fastmail or
> Workspace) on the brand domain. **Never forwarded to day-job
> mail systems.** Iter-10 T-10.3.

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — §11.9, T-10.1,
   T-10.2, T-10.3.
2. `plans/decisions.md` — D-006.
3. `plans/iterations/ledger.md` — append.

---

## Streak counter

**Iter 10: 1 structural (N59) + 3 tactical. Streak = 0/5 (RESET).**
