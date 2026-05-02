# 09 — Progress Tracker

> Single source of truth for *what I know, how well I know it, and how I
> know I know it.* Three files; no others.

## Files

- [`skills-matrix.md`](skills-matrix.md) — current rating per B-skill
  (basics, 41 rows) and per architect sub-area, with calibration gap.
- [`history.md`](history.md) — weekly snapshot of the matrix.
  Append-only. Used to read trend/plateau/regression.
- [`spaced-review.md`](spaced-review.md) — when each weak skill is due
  for its next retrieval test (Bjork: 1d, 3d, 7d, 14d).

## Rubric (0–4)

| Level | Name | Behavior |
|---|---|---|
| 0 | Unaware | Never heard of it / can't define. |
| 1 | Aware | Can define in a sentence; can't apply unprompted. |
| 2 | Familiar | Can apply with notes / reference open. |
| 3 | Proficient | Apply from memory; can name edge cases & failure modes. |
| 4 | Mastered | Could teach it; can name what *misuse* looks like. |

## Calibration gap

Per row: `gap = self_rating − measured_rating`.

| Gap | Reading | Action |
|---|---|---|
| ≤ −1 | Underconfident | Take the win; promote self-rating to match. |
| 0 | Calibrated | No action. |
| +1 | Mildly overconfident | Watch; re-test in next session. |
| ≥ +2 | Significantly overconfident | Demote self-rating; log an `F-CAL` entry in `06-failure-analysis/error-log.md`; reschedule spaced-review. |

Pattern: if `F-CAL` repeats ≥3 times across topics, the *judgment of
confidence itself* is the issue, not the topic. Promote a counter-rule
to `08-cheat-sheets/decision-trees.md`.

## How `measured_rating` is computed

| Evidence type | Mapping |
|---|---|
| 5-Q topic quiz | 0/5→0, 1/5→1, 2/5→1, 3/5→2, 4/5→3, 5/5→4 |
| Full mock (per domain) | %correct × 4, rounded down: <30%→0, 30–49%→1, 50–69%→2, 70–84%→3, ≥85%→4 |
| `[no-ai]` challenge solved naming the principle | +1 to current measured (cap 4) |
| `[no-ai]` challenge solved without naming principle | does **not** count — return to drill |
| Open `error-log.md` entry tagged this B-skill | caps measured at 2 until cleared |

## Update cadence

- **End of every study session:** update any B-skills touched.
- **End of every week:** snapshot all rows into `history.md` with the
  date.
- **End of each mock:** recompute domain-level measured ratings;
  reconcile the matrix.

The trend, not the absolute rating, is the signal. A rating that
plateaus for two weeks is a flag — drop into Phase B (`bridge`) drilling
on that B-skill.
