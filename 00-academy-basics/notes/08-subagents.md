# Introduction to Subagents — notes

**Course:** [Introduction to subagents](https://anthropic.skilljar.com/introduction-to-subagents) ·
**Length:** 30–60 min · **Maps to:** Domain 1 — Agentic Architecture & Orchestration

## One-line summary

A subagent is a fresh agent context spawned by a parent agent for an
isolated task. Parent gets back the subagent's final summary, not its
working scratch.

## 5 principles

1. **Subagent triggers — two and only two:** parallelism (independent
   work the parent can fan out) or isolation (work whose intermediate
   reasoning would pollute the parent context). No "threshold" rules.
2. **Context isolation is unidirectional.** The parent passes a task in;
   the subagent returns a summary. The parent never sees the subagent's
   tool-call trail unless the summary surfaces it.
3. **Briefing matters.** The subagent has *no* memory of the parent
   conversation. The prompt to it must be self-contained: goal, context,
   constraints, expected output shape.
4. **Coordinator pattern = parent dispatches, subagents execute.** Parent
   stays light: planning, integration, final synthesis. Subagents do the
   token-heavy work.
5. **Cost discipline.** Each subagent is its own model invocation chain.
   Spawn for value, not for tidiness. Three subagents that could be one
   sequential call burn 3× tokens.

## 2 failure modes

- **F-underbrief** — vague prompt to subagent ("based on findings, fix
  it"), no constraints; subagent guesses, returns plausible nonsense.
- **F-overspawn** — splitting trivially-sequential work across subagents
  for no isolation/parallelism gain.

## Maps to CCA-F

- **Domain 1** core. Expect tradeoff MCQs on "single agent vs. coordinator-
  subagent" framed by parallelism/isolation/cost.

## Recall prompts

1. The two valid triggers for spawning a subagent?
2. What does the parent see from the subagent's run?
3. A subagent gets "based on the analysis above, write the code." What's
   wrong?
