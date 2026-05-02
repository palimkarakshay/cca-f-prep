# Basics → Architect Transition Plan

> A four-phase pathway that moves you from raw Academy intake to a
> real-exam-ready architect-level judgment. Built on five evidence-based
> adult-learning principles. ~6 weeks total at 60–90 min/day.

## Why phases at all

The naive plan — "do all the basics courses, then start drilling
architect MCQs" — has three known failure modes:

1. **Cliff effect.** Architect MCQs sit at Bloom Analyze/Evaluate. The
   basics intake leaves you at Remember/Understand. Without a bridge,
   the first architect mock misses massively (your 3/10 cold diagnostic
   is a textbook example).
2. **Forgetting curve.** Without spaced retrieval, ~60% of basics is
   gone in two weeks. Linear "course-then-test" is the worst possible
   structure for retention.
3. **Blocked practice illusion.** Drilling one domain to 90% feels
   productive but transfers poorly. Interleaved practice tests lower in
   the moment and higher on the exam.

The four phases below are designed to defeat all three.

## Foundational principles in use

| Principle | Source | What it changes |
|---|---|---|
| Andragogy | Knowles | Self-directed pace, problem-centered, anchored to your ABAP / engineering experience. Skip beginner framing in notes. |
| Bloom (revised) | Anderson & Krathwohl | Each B-skill is tagged R/U/A/An/E. Drill at *one rung above* current rating, not at the level the exam tests. |
| Cognitive Load Theory | Sweller | Worked-example fading: each architect challenge has a 3-rung version (worked → partial → solo). |
| Desirable Difficulties | Bjork | Spaced retrieval (1d, 3d, 7d, 14d). Interleaved domains. Generation effect (write before reading the answer). |
| Deliberate Practice | Ericsson | Every drill names a target B-skill, has a feedback channel, and forces revision. No passive re-reading. |

---

## Two paths — pick by profile, not preference

There are two defensible plans. The right one depends on your prior
knowledge calibration, not your taste.

### Path A — Linear (best for: net-new to LLM engineering)

Phases A → B → C → D, executed in order. Use when basics diagnostic
score < 8/15. Detailed below.

### Path B — Mastery-learning / gap-driven (RECOMMENDED for this learner)

Use when:

- you already build with LLMs in production, **or**
- basics diagnostic score ≥ 8/15, **or**
- the failure pattern is *judgment* (rationale gaps, distractor lures —
  see `06-failure-analysis/error-log.md`) rather than vocabulary.

The structure:

1. **Diagnose first.** Take `basics-diagnostic.md` cold. Score, then
   for each B-skill set the *measured rating* per the quiz mapping.
2. **Skip what you've measured ≥ 3 on.** Don't take those courses.
   Read only the per-course note for retention.
3. **Drill the gap, interleaved with architect from day one.** Daily
   split: 30% remediation on lowest-rated B-skills; 70% architect-shape
   challenges from `01/`–`05/`, B-tagged so misses pull you back into
   targeted basics drill. *Transfer-appropriate processing* — practising
   at the test level, not below it.
4. **Spaced retrieval keeps remediated skills sticky.** Each newly
   ≥3-rated B-skill enters `09-progress-tracker/spaced-review.md` at
   +1d / +3d / +7d / +14d / +30d. Failure resets to +1d.
5. **Mock cycle (Phase D) unchanged.** The pass-gates are the same.

Time budget: ~4–5 weeks at 60–90 min/day (vs. 6 weeks for Path A).

Why it dominates Path A *for this profile*:

| Mechanism | Path A | Path B |
|---|---|---|
| Working-memory load (intrinsic) | High — 9 courses front-loaded | Low — only studied gaps |
| Time on target task | Late (Phase C) | Daily, from week 1 |
| ZPD fit | Below ZPD on courses you already know | Forces ZPD-fit drilling on every session |
| Wasted hours | ~5–8 (already-known content) | ~0 |
| Risk | Boredom-induced disengagement | Frustration if gaps are larger than estimated — mitigated by spaced-review |

### Path A details below — read only if Path A applies to you

---

## Phase A — Course intake (Weeks 1–2) *— Path A only*

**Goal:** lift every B-skill to a self-rated **2 (Familiar)** with
evidence — i.e., you can apply it with the notes open.

**Per course (cycle):**

1. *Take the course.* Watch / read end-to-end. No tooling.
2. *Read the per-course note in `notes/`* (5 min) — principles + failure
   modes.
3. *Answer the 3 recall prompts in the note* (no peeking). If 3/3, B-skills
   for that course go to a self-rating of 2 *provisionally*. If <3/3,
   re-watch the relevant section and retry.
4. *Generation drill (10 min, no AI):* write a 6-line worked example of
   each B-skill being applied. The act of writing is what consolidates.
5. *Move on.* Do **not** re-read. Spaced retrieval will resurface it.

**Interleaving rule:** rotate courses, don't binge. Mon: course 1 + 2.
Tue: course 3. Wed: course 4 + a recall pass on courses 1–2. And so on.

**Phase A exit gate:** all B-skills self-rated ≥ 2; basics diagnostic
(first attempt) taken to seed the calibration gap.

---

## Phase B — Bridge (Week 3)

**Goal:** lift every B-skill to a measured **3 (Proficient)**, and force
the jump from Apply → Analyze/Evaluate.

**Practice:** **worked-example fading**, on architect-shape MCQs.

For each B-skill:

1. **Rung 1 — Worked example.** Read a fully-solved scenario where the
   B-skill is the deciding principle. Highlight the principle sentence.
2. **Rung 2 — Partial.** Same scenario template, distractors named, but
   the *justification* line is blank. You write it in one sentence
   naming the principle.
3. **Rung 3 — Solo.** New scenario, blank everything. Pick + justify
   from scratch. Score against the key.

A B-skill is rung-3 ready only when you can produce the principle
sentence verbatim *before* checking.

**Interleaving:** mix B-skills from non-adjacent courses in the same
session. Don't drill all of B4.x in one block; mix with B6.x and B8.x.
Cross-domain mixing is what builds the Analyze rung.

**Spaced retrieval log** (`../09-progress-tracker/spaced-review.md`):
each B-skill that hits rung 3 schedules a re-test at +1d, +3d, +7d,
+14d. If any re-test fails, the B-skill drops back to rung 2 and you
retry the cycle.

**Phase B exit gate:** all B-skills measured ≥ 3 on a topic quiz;
calibration gap |self − measured| ≤ 1; basics diagnostic re-take ≥
12/15.

---

## Phase C — Architect domain drilling (Weeks 4–5)

**Goal:** apply the existing daily loop in `08-cheat-sheets/training-methodology.md`,
but with two upgrades.

**Upgrade 1 — every challenge tagged with B-codes.** Each challenge in
`01-`–`05-/challenges/` lists in its frontmatter the B-skills it draws
on. A miss demotes those B-skills back to rung 2 and triggers a
spaced-review reschedule. This is the basics ↔ architect feedback loop.

**Upgrade 2 — predict-then-test.** Before reading any model solution or
answer key, write down (in 1–2 sentences) what you predict the *failure
mode* of each distractor will be. Compare your prediction to the key.
This trains the highest-leverage exam skill: predicting failure from
design alone (already Drill 4 in training-methodology; promoted to a
default).

**Domain order:** weakest first, by mock score. Currently:

1. Domain 1 — Agentic Architecture (27%, hardest weight)
2. Domain 4 — Prompt Engineering (20%)
3. Domain 2 — Claude Code (20%)
4. Domain 3 — Tool Design / MCP (18%)
5. Domain 5 — Context Reliability (15%)

Within each domain: still interleave. Don't finish 1 before starting 4.

**Phase C exit gate:** all CCA-F sub-areas self-rated ≥ 3 in
`../09-progress-tracker/skills-matrix.md`, with calibration gap ≤ 1 on
the architect side.

---

## Phase D — Mock cycle (Week 6)

**Goal:** convert proficiency to exam performance under time pressure.

Two full mocks, 60 Q × 120 min, with the existing 4-phase audit
(timed → self-grade with 1-line justification → Claude audit → rewrite
each miss from scratch).

**Pass-gate to sit the real exam:**

- Mock score ≥ **78%** (= ~720/1000 scaled, with margin).
- Calibration gap ≤ **0.5** on the architect side. (You know what you
  know.)
- Zero open `error-log.md` entries with the same F-code repeating ≥3
  times in the past 7 days.

If any gate fails, return to Phase B for the responsible B-skills. Do
not push to the next mock until gates clear.

---

## Anti-patterns (things I will not do)

- **Re-reading notes** as a substitute for retrieval practice.
- **Watching course videos again** when a B-skill is shaky. Generate
  before re-consuming.
- **AI-assisted `[no-ai]` challenges.** Invalidates the practice.
- **Goal-shift mid-week** ("oh, I should also study X"). Park it in
  `08-cheat-sheets/parking-lot.md` (create as needed).
- **Self-rating without evidence.** Ratings move only on documented
  measurement.

---

## Visual summary

```
Phase A (Wk 1–2)        Phase B (Wk 3)         Phase C (Wk 4–5)        Phase D (Wk 6)
intake → notes →        worked-example         daily loop +            mocks +
recall → generate       fading (3 rungs)       B-tagged challenges     4-phase audit
                                                                       
B-skills → 2            B-skills → 3           Architect → 3           Architect → ≥3.5
calibration: seed       calibration: ≤1        calibration: ≤1         calibration: ≤0.5
```
