# 00 — Anthropic Academy Basics

> Foundation track. Goal: build a tested floor of competence on the
> [Anthropic Academy](https://anthropic.skilljar.com/) basics, then bridge
> upward into the architect-level domains (`01/`–`05/`) **without a
> cliff**.

## Two outputs of this folder

1. **Per-course notes** (`notes/`) — terse principle sheets you read for
   retention, not first-pass learning.
2. **An atomic skills checklist** ([`skills-checklist.md`](skills-checklist.md))
   — observable, testable B-skills (Bxx codes). Each B-skill is the unit
   of self-rating in [`../09-progress-tracker/skills-matrix.md`](../09-progress-tracker/skills-matrix.md)
   and the unit of failure-tagging in `06-failure-analysis/error-log.md`.

Notes are for *what to remember*. The checklist is for *what to be able
to do.* They live separately on purpose.

## Pedagogy in one paragraph

This track is built on five evidence-based adult-learning principles —
spelled out in [`transition-plan.md`](transition-plan.md):

- **Knowles' andragogy** — self-directed, problem-centered, anchored to
  your existing engineering experience.
- **Bloom (revised)** — climb Remember → Understand → Apply → Analyze →
  Evaluate; don't drill MCQs at the Apply level when you're still at
  Understand on the underlying skill.
- **Cognitive Load Theory** — worked-example fading: full example →
  partial → solo, three rungs.
- **Desirable Difficulties (Bjork)** — spaced retrieval, interleaving,
  generation. Easy study feels productive and isn't.
- **Deliberate Practice (Ericsson)** — every drill has a target B-skill
  and a feedback channel (mock score, error-log, calibration gap).

## Recommended order (Anthropic's published path)

| # | Course | Length | CCA-F Domain | Course taken | Notes read |
|---|---|---|---|---|---|
| 1 | [Claude 101](https://anthropic.skilljar.com/claude-101) | 30–60 min | base | [ ] | [ ] |
| 2 | [AI Fluency: Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations) | 3–4 hr | D4 | [ ] | [ ] |
| 3 | [Building with the Claude API](https://anthropic.skilljar.com/claude-with-the-anthropic-api) | 3–4 hr | D3 + D4 | [ ] | [ ] |
| 4 | [Introduction to MCP](https://anthropic.skilljar.com/introduction-to-model-context-protocol) | ~2 hr | D3 | [ ] | [ ] |
| 5 | [Claude Code 101](https://anthropic.skilljar.com/claude-code-101) | ~1 hr | D2 | [ ] | [ ] |
| 6 | [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) | ~1 hr | D1+D2+D5 | [ ] | [ ] |
| 7 | [Introduction to agent skills](https://anthropic.skilljar.com/introduction-to-agent-skills) | 30–60 min | D2 | [ ] | [ ] |
| 8 | [Introduction to subagents](https://anthropic.skilljar.com/introduction-to-subagents) | 30–60 min | D1 | [ ] | [ ] |
| 9 | [Introduction to Claude Cowork](https://anthropic.skilljar.com/introduction-to-claude-cowork) | ~1 hr | rec'd | [ ] | [ ] |

Total seat-time: ~12–15 hrs (course time only, not practice).

## Files

- `notes/0X-<course>.md` — principle sheet per course.
- `skills-checklist.md` — atomic B-skills (B1.x – B9.x), one per course.
- `transition-plan.md` — Phase A→D pathway from basics to architect, with
  the andragogy rationale.
- `basics-diagnostic.md` — 15 MCQs tagged to B-skills. Take twice: once
  before any course (calibration), once after the basics track (pass-gate).
- `solutions/basics-diagnostic-key.md` — answer key + B-skill mapping +
  named principle per question.

## Pass-gate to architect drilling (`01/`–`05/`)

You may move into heavy domain drilling when **all of**:

- Every B-skill ≥ **3 (Proficient)** in [`../09-progress-tracker/skills-matrix.md`](../09-progress-tracker/skills-matrix.md).
- Basics diagnostic (re-take) measured score ≥ **12 / 15**.
- Calibration gap |self − measured| ≤ **1** on average.

The third gate is the one most candidates skip. Knowing without knowing
that you know is unstable; the calibration gap is what tells you whether
your self-rating is trustworthy.
