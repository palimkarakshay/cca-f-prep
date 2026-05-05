# Iteration 09 — Mitigations (streak pass 1)

## Streak status

**1/5 clean structural passes.** No new structural findings in iter-09.
Tactical fixes applied below.

## Tactical fixes

### T-09.1 — Insurance line itemised

Update §16.5 cost-basis row:

> | Insurance bundle (iter-04 N32; itemised iter-09 T-09.1) | $200 (GL ~$50, cyber ~$50, E&O ~$100) |

### T-09.2 — Cert commitment scope

Update §16.10:

> Operator commits to passing **the chosen catalog's certification**
> within 90 days of project start as precondition for charging.
> Per §16.1 catalog logic: AI-103 OR Anthropic CCA-Developer,
> whichever is the launch catalog. Exam attempt: $165 (AI-103) /
> $99 (Anthropic, if launched) + ~30 hours focused study.

### T-09.3 — Archive remaining venture-shape docs

Move to `plans/archive-2026-05-04/`:
- `plans/IMPLEMENTATION.md` (1,797 lines, venture-shape technical
  plan).
- `plans/content-pack-management-plan.md` (981 lines, venture-shape
  content-management plan).
- `plans/expert-review-audit.md` (755 lines, comfort-blanket audit
  template per P13).

Add note to `plans/archive-2026-05-04/README.md` that these
contain technical-execution and content-management ideas which
might be partially salvaged for the §16 shape, but as written
they reflect the venture-shape plan and should not be referenced.

### T-09.4 — Hosting line reflects reorder

Update §16.5 cost-basis row:

> | Hosting (Render $19 default / Cloudflare free / Vercel Pro $20–80; iter-08 N55 reorder) | $0–35 |

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — T-09.1, T-09.2,
   T-09.4.
2. `git mv plans/IMPLEMENTATION.md plans/archive-2026-05-04/`
3. `git mv plans/content-pack-management-plan.md plans/archive-2026-05-04/`
4. `git mv plans/expert-review-audit.md plans/archive-2026-05-04/`
5. `plans/archive-2026-05-04/README.md` — add note about salvageable
   ideas.
6. `plans/iterations/ledger.md` — append.

---

## Streak counter

**Iter 09: 0 structural + 4 tactical. Streak = 1/5.**
