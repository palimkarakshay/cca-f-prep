# Spaced Review Schedule

> When each B-skill / sub-area is due for its next retrieval test.
> Schedule per Bjork's expanding-interval pattern: **+1d, +3d, +7d,
> +14d, +30d.** Reset to +1d on any failed re-test; promote to +30d
> after a clean +14d re-test.

## Why this cadence

The expanding-interval (1/3/7/14/30d) defaults are derived from the
spacing-effect literature, not a folk heuristic:

- **Forgetting curve.** Without re-exposure, retention plateaus at
  ≈ 25% by day 6 (Murre & Dros 2015, *PLoS ONE*, replicating Ebbinghaus
  1885). The first review must land before that floor — hence +1d.
- **Optimal gap = 10–20% of the desired retention interval** (Cepeda
  et al. 2008, *Psych Sci*; Cepeda et al. 2006 254-study meta in
  *Psych Bulletin*). For a 30-day exam horizon, gaps in the 3–6d range
  are optimal; the 1/3/7d expansion brackets that ridgeline.
- **Promotion / demotion.** SuperMemo SM-2 / Anki convention: clean
  recall at the longer interval promotes, miss demotes one step. The
  asymmetry is desirable-difficulty doctrine (Bjork & Bjork 2011): a
  miss is more informative than a pass and pays a larger interval cost.

## How to use

1. When a B-skill first hits **rung 3** (Proficient with measured
   evidence), add a row.
2. At the start of each session, look at items "due today" or older.
   Run a 1–2 minute retrieval (one recall prompt or one MCQ tagged to
   that B-skill).
3. **Before** answering, write a 1–5 **JOL** (judgment-of-learning):
   how confident are you? Then attempt.
4. If you pass, advance to the next interval AND log the calibration Δ
   (JOL − outcome, both normalised to 0–4) into
   `09-progress-tracker/skills-matrix.md`. If you fail, drop back one
   rung in the matrix, reset the schedule to +1d, **and increment the
   leech counter** for this row.
5. After a +30d clean re-test, archive the row (move to bottom; it's
   stable) and clear the leech counter.

## Leech rule

Anki convention, applied here: any item missed **≥ 3 times** is a
**leech**. Demote to skills-matrix rung 1, route to
`06-failure-analysis/error-log.md` with a forced "rewrite the concept
from scratch" task, and do not return to the spaced-review queue until
the rewrite is logged. Re-exposure without re-construction is wasted
study time (Bjork desirable-difficulty doctrine). Wozniak's SM-2 leech
escalation is the prior art.

## Calibration capture

Every retrieval logs a **JOL pre-test** (1–5) and a **calibration Δ
post-test** (JOL − outcome, normalised to 0–4). Calibration Δ written
to skills-matrix `Gap` column (which IS the calibration Δ — see
skills-matrix.md § "Calibration delta — definition and remediation").

The point is to **train calibration**, not just track recall. Dunlosky &
Bjork meta-memory work (and Kruger & Dunning 1999) shows that
re-reading produces a *fluency illusion*: high JOL, low actual recall.
Capturing the JOL pre-test and the outcome post-test is the only way to
detect and close that gap.

## Schema

| B-code / sub-area | First-mastered | Last review | JOL (1–5) | Result | Calibration Δ | Leech count | Next due |
|---|---|---|---|---|---|---|---|

## Active

_(none yet)_

## Archived (stable; +30d clean re-test passed)

_(none yet)_
