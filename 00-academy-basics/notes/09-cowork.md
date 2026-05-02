# Introduction to Claude Cowork — notes

**Course:** [Introduction to Claude Cowork](https://anthropic.skilljar.com/introduction-to-claude-cowork) ·
**Length:** ~1 hr · **Maps to:** recommended (newest, April 2026); cross-feeds D1 + D2

## One-line summary

Cowork is the persistent, multi-step task workspace — a managed agent
that keeps state across hours/days, runs file work, and exposes plugins
and skills. Think "managed agent surface" rather than "chat surface."

## 5 principles

1. **Cowork is task-scoped, not chat-scoped.** State persists across
   sessions. Useful for research, file workflows, multi-step coding —
   anything that doesn't fit a single chat turn budget.
2. **Plugins and Skills both attach.** Skills steer instructions;
   plugins extend capabilities (file system, web, tools). The
   distinction is the same as elsewhere — instructions vs. capabilities.
3. **Cowork uses the same agent-loop primitives** the API does — tools,
   subagents, hooks, watermarks. It's an opinionated wrapper, not a new
   protocol.
4. **Steering is the user's lever.** Mid-task corrections ("revise
   plan", "skip step 3") are first-class. Designing for steering means
   exposing intermediate state.
5. **Cowork ≠ autonomous.** Even multi-day tasks have human checkpoints
   by design. "Set and forget" is an antipattern; "set and steer" is the
   intended shape.

## 2 failure modes

- **F-set-and-forget** — long-running cowork task with no review
  cadence. Drifts from intent silently.
- **F-no-checkpoint-output** — task runs for hours but produces no
  intermediate artifact you can inspect or roll back to.

## Maps to CCA-F

- Indirect. The exam isn't Cowork-specific, but the patterns
  (long-running agents, steering, checkpoints) generalize to D1
  (orchestration) and D5 (reliability).

## Recall prompts

1. Cowork plugin vs. Cowork skill — what's the difference in one
   sentence?
2. Why is "set and forget" wrong for Cowork?
3. Cowork shares which primitives with the API agent loop?
