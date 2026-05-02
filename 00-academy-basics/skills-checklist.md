# Basics — Atomic Skills Checklist

> Each row is one **observable, testable** competency derived from an
> Academy course. Self-rating, MCQ tagging, error-log entries, and
> calibration all use these B-codes as the canonical unit. If a skill
> can't be stated as "I can <verb> <object> given <input>", it doesn't
> belong here — rewrite it.

Code shape: `B<course>.<skill>` — e.g., `B5.2` is course 5 (MCP),
skill 2.

Bloom level marked per skill (R/U/A/An/E) so you can match drills to the
right rung:

- **R** = Remember (recall the fact)
- **U** = Understand (explain it)
- **A** = Apply (use it on a fresh case)
- **An** = Analyze (decompose / compare)
- **E** = Evaluate (judge between alternatives)

Architect-level MCQs live overwhelmingly at **An / E**. Basics drilling
should target **U / A** first, then promote.

---

## Course 1 — Claude 101

| Code | Skill (I can…) | Bloom | Maps to |
|---|---|---|---|
| **B1.1** | distinguish a Claude.ai *Project* (in-context file pile) from a *RAG corpus* (semantic retrieval) | U | D5 |
| **B1.2** | predict whether a given limit (msg cap, context, model choice) is product-tier or API-level | A | base |
| **B1.3** | choose Artifact vs. inline message for a long output, and justify | E | D5 |
| **B1.4** | estimate context cost of N file uploads in a Project | A | D5 |

## Course 2 — AI Fluency: Framework & Foundations

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B2.1** | classify a prompt failure into one of the 4 Ds | An | D4 |
| **B2.2** | identify a task that is mis-delegated (LLM-unsuited) | An | D4 |
| **B2.3** | write a description that explicitly names role, task, constraint, format | A | D4 |
| **B2.4** | run one description ↔ discernment iteration on a flawed output | A | D4 |
| **B2.5** | name the diligence concern in a deployment scenario (oversight, bias, misuse) | E | D5 |

## Course 3 — Building with the Claude API

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B3.1** | place an instruction in `system` vs. `user` and justify | E | D4 |
| **B3.2** | rewrite a few-shot bullet list as alternating user/assistant turns | A | D4 |
| **B3.3** | trace a tool-use loop given `stop_reason` transitions | An | D3 |
| **B3.4** | place a `cache_control` marker for max prefix-cache hit rate | E | D5 |
| **B3.5** | choose tool-schema vs. prompt-only for a given structured-output need | E | D4 |
| **B3.6** | identify a `system` field leak (volatile per-request data) | An | D5 |

## Course 4 — Introduction to MCP

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B4.1** | classify a capability as **tool / resource / prompt** | An | D3 |
| **B4.2** | choose `stdio` vs. `HTTP+SSE` given a deployment scenario | E | D3 |
| **B4.3** | reject non-MCP transport options (WebSockets, gRPC) on sight | R | D3 |
| **B4.4** | diagnose "model picks wrong tool" to a tool-description deficit | An | D3 |
| **B4.5** | choose server-per-capability vs. monolith server, with rationale | E | D3 |
| **B4.6** | place auth at the transport layer rather than in tool inputs | A | D3 |

## Course 5 — Claude Code 101

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B5.1** | place a hook on the correct lifecycle event for a given goal | A | D2 |
| **B5.2** | predict the outcome of a permission cascade (enterprise > project > local > user) | An | D2 |
| **B5.3** | route a rule to CLAUDE.md vs. `reference/` vs. Skill vs. slash command vs. hook | E | D2 |
| **B5.4** | author a slash-command file with correct frontmatter + body | A | D2 |

## Course 6 — Claude Code in Action

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B6.1** | order all hook lifecycle events from `SessionStart` to `SessionEnd` | R | D2 |
| **B6.2** | choose hook vs. CLAUDE.md instruction for a guardrail by trust requirement | E | D2 |
| **B6.3** | predict the failure mode of an agent loop without a watermark | An | D1+D5 |
| **B6.4** | decide subagent vs. inline given parallelism / isolation criteria | E | D1 |
| **B6.5** | reason about CI surface blast radius when running Claude Code as a GH Action | An | D2 |

## Course 7 — Introduction to Agent Skills

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B7.1** | distinguish Skill vs. slash command vs. CLAUDE.md vs. hook by *invocation model* | An | D2 |
| **B7.2** | critique a skill description for discoverability deficits | E | D2 |
| **B7.3** | place a skill correctly (project / user / plugin) given distribution requirements | A | D2 |
| **B7.4** | detect a kitchen-sink (multi-purpose) skill | An | D2 |

## Course 8 — Introduction to Subagents

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B8.1** | name the two and only two valid subagent-spawn triggers | R | D1 |
| **B8.2** | critique an underbriefed subagent prompt (no context, vague output) | E | D1 |
| **B8.3** | predict cost-blowup from unnecessary subagent splits | An | D1 |
| **B8.4** | identify what state the parent does *not* see from the subagent | U | D1 |

## Course 9 — Introduction to Claude Cowork

| Code | Skill | Bloom | Maps to |
|---|---|---|---|
| **B9.1** | distinguish Cowork plugin (capability) from skill (instructions) | U | D2 |
| **B9.2** | add appropriate human-checkpoint cadence to a long-running task plan | E | D5 |
| **B9.3** | identify a "set and forget" antipattern in a Cowork design | An | D5 |

---

## Total: 41 atomic B-skills.

### Distribution
- Bloom level: 3 R, 5 U, 11 A, 11 An, 11 E. The exam tests An/E most;
  the practice should drive each B-skill to its listed Bloom level
  before moving on, and then *one rung above* before pass-gate.
- Domain coverage: every CCA-F domain has at least 5 B-skills feeding it.

### How to use this checklist

1. Self-rate every B-skill at the start (0–4 rubric in
   [`../09-progress-tracker/skills-matrix.md`](../09-progress-tracker/skills-matrix.md)).
2. Tag every diagnostic / mock miss with the responsible B-code in
   `06-failure-analysis/error-log.md`. (Add a column.)
3. Tag every architect-level challenge in `01/`–`05/` with the B-codes
   it draws on. A miss promotes those B-codes back into active drill.
4. Promote a B-skill's rating only when there's *evidence* (mock score,
   `[no-ai]` challenge solved naming the principle, or 5/5 on a topic
   quiz). Self-rating without evidence is wishful.
