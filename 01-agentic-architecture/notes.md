# Domain 1 — Agentic Architecture & Orchestration

**Exam weight: 27%** (highest). Sub-areas tested: agent loop shape,
workflows vs. agents, coordinator-subagent, hook lifecycle, bounded
loops & session budget, multi-agent tradeoffs.

> Diagnostic-01 (cold) hit 0/3 in this domain. Failure pattern was
> *architectural rationale* (F4) — not platform mechanism. Read for
> tradeoff judgment, not feature lists.

## One-line summary

An agent is a loop: model → tool → result → model. Architectural choices
are about **when to add structure** (workflow), **when to add
parallelism / isolation** (subagent), and **when to bound it** (watermark
exits). All three are tradeoff calls, not defaults.

## 5 principles

1. **Workflow vs. agent — pick by predictability, not novelty.**
   Workflows orchestrate LLM calls along a known path (prompt chaining,
   routing, parallelization). Agents decide their own next step. Choose
   the **least-autonomous** option that solves the problem; agentic
   complexity is paid every turn. (Schluntz/Zhang, *Building effective
   agents*.)

2. **Coordinator-subagent has two and only two valid triggers:**
   (a) **parallelism** — independent units of work that can run
   concurrently, or (b) **context isolation** — intermediate scratch
   that would pollute the parent's window. There is **no tool-count
   threshold**; an "X tools means subagent" claim is a fabricated rule
   (F5). Cost is rarely the right axis — subagents inherit the parent
   model unless explicitly configured.

3. **Bounded loops with self-pacing watermarks.** ~80% context fill →
   commit in-flight work and exit cleanly; ~95% → hard exit, partial
   work preserved. A clean exit is **success**, not failure. Removing
   tools or escalating models mid-run is not a recognized pattern (F8).

4. **Hooks own deterministic guardrails.** `PreToolUse` is the only
   event that can *block* a tool call before execution. Order:
   `SessionStart → UserPromptSubmit → PreToolUse → [tool] → PostToolUse
   → Stop → SessionEnd` (plus `Notification`, `SubagentStop`,
   `PreCompact`/`PostCompact`). Match the hook event to the *moment*
   the policy needs to fire — not to vibes.

5. **Multi-agent is not free.** Token cost grows ~linearly with agent
   count; coordination overhead is real. Reach for it when (a) work is
   genuinely parallel, (b) intermediate context pollution is a real
   problem, or (c) breadth-first exploration dominates. Otherwise a
   single-agent loop with good context discipline wins.

## 2 failure modes

- **F-rationale-gap** — knows *what* the right pattern is but can't
  name *why* it dominates the alternatives. Triggers F1 (distractor
  lure) under exam pressure. Fix: for every pattern, write the one-
  sentence "this beats X because Y" before the next mock.
- **F-runaway-loop** — unbounded agent burns context on retries; final
  answer is clipped or summary is lost. Symptom of missing watermark.
  Fix: 80% / 95% pattern, baked into the harness, not the prompt.

## Maps to CCA-F sub-areas

- *Agent loop shape* — diagnostic-01 Q3
- *Coordinator-subagent rationale* — diagnostic-01 Q1
- *Hook event placement* — diagnostic-01 Q2 (cross-feeds D2)
- *Bounded loops & session budget* — diagnostic-01 Q3
- *Multi-agent tradeoffs* — *not yet tested in diagnostic-01*

## Real-world hook (lumivara)

`palimkarakshay/lumivara-site` implements the watermark literally:
`BUDGET: 80%, exiting cleanly after current unit` and `BUDGET: 95%,
hard exit; resume next run`. The planner / executor split in
`.github/workflows/plan-issues.yml` and `execute*.yml` is the canonical
coordinator-subagent pattern: planner doesn't carry execution scratch
into the plan output.

## External reading (see `08-cheat-sheets/external-resources.md`)

- *Building effective agents* — workflows vs. agents, the five patterns
- *How we built our multi-agent research system* — orchestrator-worker
- *When (and how) to use multi-agent systems* — the negative case
- *Effective harnesses for long-running agents* — initializer pattern
- ReAct (arXiv 2210.03629) — the loop primitive

## Recall prompts

1. Two valid triggers for spawning a subagent. Name both.
2. Watermark exits — at what context fill, and what action at each?
3. Hook event for blocking a `rm -rf` shell command — name and reason
   it's the only choice.
4. "Workflow or agent?" — what's the deciding question?
5. Why does the coordinator-subagent pattern *not* save tokens by
   default?
