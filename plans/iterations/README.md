# Iterative hostile-review loop — operator's log

## Purpose

This directory holds the running history of hostile-review iterations of
the AI-LMS business plan that lives in `plans/`. Each iteration is a
two-file pair:

- `iter-NN-critique.md` — harshest available adversarial pass over the
  current state of the plan. Written as if by an external skeptic with
  no loyalty to prior work.
- `iter-NN-mitigations.md` — the operator's response: for every finding,
  a mitigation classified tactical / structural / unmitigable, plus the
  resulting edit to the canonical plan documents.

A running `ledger.md` summarises each iteration in one line so a future
reader can scan the whole journey without reading every file.

## Loop rules

1. **No softening across iterations.** Each pass is fresh. If iteration
   3 already addressed P-foo, iteration 4 still re-checks whether the
   mitigation actually closed P-foo or just relabelled it.
2. **Promote findings to the canonical plan immediately.** When a
   mitigation requires a deck or implementation edit, do that edit in
   the same iteration commit, not "later."
3. **Commit per iteration.** Each iteration is at least one commit so
   the history is reviewable.
4. **5-pass clean-bill rule.** The final consolidated plan
   (`business-plan-v2.md`) is only declared finished when **5 consecutive**
   hostile-review passes find no new structurally-fatal flaws. Tactical
   nits don't reset the streak; structural findings do.
5. **Externalise where possible.** Use real 2026 web research per
   iteration to avoid groupthink with prior iterations.

## Files

- `ledger.md` — one-line summary per iteration.
- `iter-NN-critique.md` / `iter-NN-mitigations.md` — per-iteration pair.
- `final-business-plan-v2.md` — the consolidated post-iteration plan
  (created only after the 5-pass streak is achieved).
