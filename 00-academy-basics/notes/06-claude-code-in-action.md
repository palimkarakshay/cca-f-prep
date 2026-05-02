# Claude Code in Action — notes

**Course:** [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) ·
**Length:** ~1 hr · **Maps to:** Domains 1, 2, 5 (cross-domain)

## One-line summary

Operational Claude Code — hooks, CLAUDE.md discipline, session budget,
GitHub Actions, multi-agent (subagents), and the agent loop in practice.
This course is where the architect-level patterns first appear.

## 5 principles

1. **Hooks are deterministic guardrails.** They run shell commands at
   named lifecycle events. Order matters:
   `SessionStart → UserPromptSubmit → PreToolUse → [tool runs] → PostToolUse → Stop / SessionEnd`.
   `PreToolUse` is the only place you can *block* a tool call before it
   runs.
2. **Hooks > prompt instructions for hard rules.** "Don't run rm -rf"
   in CLAUDE.md is a soft rule the model can disobey. A `PreToolUse`
   hook that pattern-matches and exits non-zero is enforced. Pick the
   mechanism that matches the trust requirement.
3. **Session budget watermarks** — at ~80% context fill, *commit
   in-flight work and exit cleanly*; at ~95%, *hard exit*. Loops without
   watermarks are the canonical "runaway agent" failure.
4. **Subagents = parallelizable + isolation.** Spawn a subagent when
   either (a) work can run in parallel or (b) you need its scratch space
   out of the parent's context. There's no tool-count threshold; the
   trigger is the work shape.
5. **GitHub Actions integration runs Claude Code as a CI step.** Same
   permissions and CLAUDE.md, plus repo-level secrets. The CI surface is
   the same blast radius as a developer with the same ACL.

## 2 failure modes

- **F-soft-rule-for-hard-need** — using a CLAUDE.md instruction or
  system prompt for a security-critical guardrail. Use a hook.
- **F-runaway-loop** — agent burns context on retries because there's no
  watermark. Symptom: clipped final answer or summary loss.

## Maps to CCA-F

- **Domain 1** — agent loop, subagents, watermarks.
- **Domain 2** — hooks vs. memory vs. CLAUDE.md.
- **Domain 5** — context budget, clean exits.

## Real-world hook (lumivara)

Watermark messages `BUDGET: 80%, exiting cleanly` and `BUDGET: 95%, hard
exit` are the canonical wording. The pattern is "exit cleanly *is*
success."

## Recall prompts

1. Lifecycle order between `UserPromptSubmit` and `PostToolUse`?
2. When is a subagent the right answer?
3. Hook vs. CLAUDE.md instruction — which one to use for a *hard*
   guardrail?
