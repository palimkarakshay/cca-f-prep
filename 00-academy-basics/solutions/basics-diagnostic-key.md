# Basics Diagnostic — Answer Key

> Don't read this until you've finished `../basics-diagnostic.md`.
> Per question: correct letter, **B-code**, the named principle, and a
> short trap analysis (which F-code each distractor exploits).

---

### Q1 — Correct: **B** · B1.1 (Project vs RAG)

**Principle.** A Claude.ai *Project* is **in-context** file storage —
all attached files are loaded into every chat as raw text up to context
limit. There is no semantic retrieval; there is no embeddings index.
This is not RAG.

**Traps.**
- A — F5 (fabricated mechanism): there is no embeddings index.
- C — F5: there is no retriever to re-index.
- D — F5: there is no vector store, hence no quota.

---

### Q2 — Correct: **C** · B2.1, B2.2 (4D classification, mis-delegation)

**Principle.** *Delegation* is the wrongness. The base model has no
knowledge of "yesterday." No prompt rewrite fixes a structural
information gap; the only fixes are tool use (web search), retrieval, or
not delegating the task.

**Traps.**
- A — F2 (compression / iterate-the-prompt reflex): rewriting won't
  inject knowledge that isn't there.
- B — partially valid but second-order; discernment catches the failure
  but doesn't prevent it.
- D — diligence is a process, not a fix to the structural delegation
  error.

---

### Q3 — Correct: **B** · B2.3 (Description quality)

**Principle.** Descriptions improve when they are **explicit on output
shape and decision categories**. "Be more X" tells the model nothing
new and is the canonical example of pseudo-improvement.

**Traps.**
- A, D — F8 (vague intensifier): no information gain.
- C — irrelevant; CoT improves reasoning depth, not verdict
  specificity, and may *increase* verbosity.

---

### Q4 — Correct: **A** · B3.1 (system vs user)

**Principle.** Both rules and persona are *durable for this caller* —
they don't change per request. Putting them in `system` (a) signals
privilege, (b) lets the prompt-cache prefix span both, (c) keeps the
`user` turn as just the volatile question.

**Traps.**
- B, C — split durable content across system/user, breaks caching
  cleanly.
- D — F1 (distractor lure): tool descriptions are not for persona.

---

### Q5 — Correct: **B** · B3.4 (cache_control placement)

**Principle.** Prompt caching is **prefix-based**. Everything before
the marker is cached; everything after is fresh. Place the marker after
the longest stable content (the doc), before the volatile per-call
content (the question). 4 000 cached + 200 fresh ≈ ~95% prefix-cache
hit on input cost.

**Traps.**
- A — caches nothing useful (prefix is empty).
- C — caches the volatile bit; misses the win.
- D — F5: in-line markers are how you place caching points.

---

### Q6 — Correct: **B** · B3.5 (structured output mechanism)

**Principle.** Schema-validated tool input is the *only* mechanism that
makes structurally-invalid output impossible. Soft prompt instructions
("respond in JSON") work most of the time and fail silently the rest.
For a job that runs 1 000 times, "most of the time" is many failures.

**Traps.**
- A — F1: feels modern, fails silently.
- C — equating I and II hides the validation difference.
- D — F8: temperature ≠ structure.

---

### Q7 — Correct: **C** · B4.1 (MCP primitive choice)

**Principle.** **Tool** = model-invoked, side-effecting, schema-required.
A SQL execution call is all three. Resources are read-only data
references; prompts are user-invoked templates.

**Traps.**
- A — F-conflate primitive boundary; data *source* ≠ data *action*.
- B — the trigger is the model's reasoning, not a user template.
- D — F5 / F6 (fabricated escape hatch): MCP transports are a closed
  list; this isn't a transport question.

---

### Q8 — Correct: **B** · B4.2, B4.3 (transport choice)

**Principle.** `stdio` is local-single-user. `HTTP+SSE` is the
remote/multi-tenant option, with auth at the transport layer. Anything
else (WebSockets, gRPC) is not an MCP transport.

**Traps.**
- A — F7 (misread): single-user only.
- C, D — F6 (closed-list miss).

---

### Q9 — Correct: **B** · B4.4 (wrong-tool-pick → description)

**Principle.** When the model picks the wrong tool, **the tool
description is the first thing to fix**. Renames, system-prompt
nudges, and tool merges are second-order.

**Traps.**
- A, D — F8 (over-engineered): API redesign before description fix.
- C — F8: long system prompts can't substitute for tool description; the
  model reads the description first when choosing.

---

### Q10 — Correct: **C** · B5.3, B6.2 (route a hard guardrail)

**Principle.** Hooks > prompt instructions for **hard rules**. A
CLAUDE.md note or system instruction is a soft rule the model can
override; a `PreToolUse` hook is enforced by the harness — non-zero
exit blocks the call.

**Traps.**
- A, B — F-soft-rule-for-hard-need. Pick the mechanism that matches the
  trust requirement.
- D — F1: relies on the user remembering, which is exactly what the
  security team can't accept.

---

### Q11 — Correct: **A** · B6.1 (lifecycle ordering)

**Principle.** `SessionStart` (boot) → `UserPromptSubmit` (each user
turn) → `PreToolUse` (per tool call) → tool runs → `PostToolUse` →
`Stop` (turn end) → eventually `SessionEnd`.

**Traps.**
- B — puts `PreToolUse` before `UserPromptSubmit` — but tools fire
  *because* of a user prompt.
- C — `SessionStart` always comes first.
- D — `UserPromptSubmit` after `PostToolUse` is reversed.

---

### Q12 — Correct: **B** · B6.3 (no-watermark loop)

**Principle.** Without a session-budget watermark, the harness has no
clean exit. The model truncates whatever's at context limit — typically
the most recent (un-cached) reasoning, including parts of the final
answer. **Watermarks (~80% commit, ~95% hard exit) make a clean exit
the success path.**

**Traps.**
- A — F5: there is no automatic typed-error path.
- C — F5: the model doesn't auto-shrink.
- D — F8: subagents aren't an emergency-rescue mechanism.

---

### Q13 — Correct: **B** · B7.1 (Skill vs CLAUDE.md by invocation)

**Principle.** **Skills are user-invoked.** They don't auto-load. Any
"always on" rule must live somewhere that auto-loads — CLAUDE.md or
(for hard guardrails) a hook. Size, project-scope, and code samples are
not the deciding factor; *invocation model* is.

**Traps.**
- A, C, D — F1 (distractor lure): plausible properties that don't
  decide the routing.

---

### Q14 — Correct: **C** · B8.1 (subagent spawn triggers)

**Principle.** Two and only two valid triggers: **parallelism** and
**context isolation**. Tool-count thresholds are not in any spec.

**Traps.**
- C — F5 (fabricated rule): "more than 10 tools" feels concrete and
  exam-like. It isn't.
- A, B — both genuinely valid; D combines them, also valid. C is the
  outlier.

---

### Q15 — Correct: **B** · B9.2, B9.3 (set-and-forget detection)

**Principle.** Long-running agentic work is designed to be *steered*,
not autonomous. Without intermediate artifacts you cannot diagnose,
correct, or roll back drift. The right design pattern: explicit
checkpoints with reviewable output every N hours.

**Traps.**
- A — F5: Cowork supports long tasks.
- C — F5: no such pricing rule.
- D — F8: splitting may help but doesn't address the *checkpoint*
  principle, which is the actual issue.

---

## Per-skill performance

After scoring, for each missed Q write a one-liner in
`06-failure-analysis/error-log.md` with the schema:

```
### YYYY-MM-DD — basics-diagnostic Q<N>
- Mistake: picked <X>; correct <Y>.
- Why: F-code (from the trap list above).
- B-code: <B-code from the key>.
- Correct principle: <one sentence from the key>.
- Prevention rule: <heuristic to run next time>.
```

Then update `09-progress-tracker/skills-matrix.md`: that B-skill's
*measured* rating is capped at the quiz mapping (5/5→4, 4/5→3, 3/5→2,
1–2/5→1, 0/5→0). Self-rating may not exceed measured + 1.
