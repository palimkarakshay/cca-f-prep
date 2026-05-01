# Diagnostic 01 — Solutions

> Stop here if you haven't taken `07-mock-exams/diagnostic-01.md` yet.

For each question: correct answer, why it's right, why each distractor is
wrong, the **principle** (what the question is actually testing), and where
it'll get covered in domain notes.

Where a real-world example exists in `palimkarakshay/lumivara-site`, I link to
it so the abstract idea has a concrete shape.

---

## Q1 — Coordinator-subagent vs. linear loop

**Correct: B**

- A — wrong axis. Subagents inherit the parent model unless explicitly configured otherwise; cost is not the canonical justification.
- **B — right.** The two real wins of coordinator-subagent are **parallel execution** of independent work and **context isolation** — the subagent's intermediate scratch never lands in the coordinator's window.
- C — false. Subagents don't get a bigger window; they get a *fresh* one.
- D — fabricated. There is no "10 tools" threshold.

**Principle:** Reach for coordinator-subagent when (a) work is independently parallelizable or (b) intermediate context would otherwise pollute the parent. Not for cost, not for window size.

**Lumivara-site analogy:** the planner / executor split in `.github/workflows/plan-issues.yml` and `execute*.yml` is exactly this pattern — the planner doesn't carry execution scratch into the plan output.

**Domain:** 5. Architecture → sub-area "Coordinator-subagent."

---

## Q2 — Hook event placement

**Correct: B**

- A — `SessionStart` runs once at boot with no per-tool-call context. Can't inspect commands.
- **B — right.** `PreToolUse` is the only event that fires *before* a tool call and can return a blocking decision. This is the canonical home for command guardrails.
- C — `PostToolUse` runs *after* the command. Too late to prevent harm.
- D — `Stop` runs once at session end. Same problem as C, only worse.

**Principle:** Pre-execution policy → `PreToolUse`. The blocking-decision capability is what makes it the right primitive for guardrails.

**Domain:** 5. Architecture → sub-area "Hooks." Also touches 1. Core Concepts (settings.json shape).

---

## Q3 — Runaway agentic loop

**Correct: B**

- A — confuses turn budget with token budget. `max_tokens` controls per-message generation, not loop count.
- **B — right.** Self-pacing watermarks (~80% commit + exit cleanly, ~95% hard exit) are the canonical defense against runaway loops. Partial progress is preserved; the next run resumes.
- C — escalating model mid-run is not a recognized pattern; adds complexity, doesn't solve loop dynamics.
- D — removes the feedback the agent needs to validate work.

**Principle:** Bounded loops with self-pacing watermarks. Exiting at 80% is a *success*, not a failure — partial work is recoverable.

**Lumivara-site analogy:** see [`AGENTS.md` § Session charter](https://github.com/palimkarakshay/lumivara-site/blob/main/AGENTS.md) — literally implements the 80%/95% pattern: `BUDGET: 80%, exiting cleanly after current unit` and `BUDGET: 95%, hard exit; resume next run`.

**Domain:** 5. Architecture → sub-area "Bounded loops & session budget."

---

## Q4 — CLAUDE.md hygiene

**Correct: B**

- A — wrong axis. The bottleneck is *context shape*, not per-token cost.
- **B — right.** `CLAUDE.md` is loaded into context every session — treat it like RAM, not a database. Move historical decisions to disk (`reference/`, `docs/`) and `@`-include or link only what is still binding.
- C — destroys durable behavior anchors that won't be reconstructed from a user prompt.
- D — LLM-summarizing loses fidelity, and the file will balloon again.

**Principle:** Lean charter, archive history. The same content can serve the agent equally well from `reference/` if it's referenced rather than inlined.

**Lumivara-site analogy:** their `CLAUDE.md` opens with `@AGENTS.md` to pull in the binding charter, then carries only the practical build/test layer. `docs/_deprecated/` and `docs/00-INDEX.md` exist precisely so historical material doesn't bloat the active charter.

**Domain:** 1. Core Concepts → sub-area "CLAUDE.md as evolving context."

---

## Q5 — Automated behavior trigger

**Correct: C**

- A — `CLAUDE.md` instructions are *advisory*. The model can interpret, prioritize, or even forget. Not an enforcement mechanism.
- B — same problem as A. Memories/preferences are read by the model, not executed by the harness.
- **C — right.** Hooks run in the harness layer, deterministically, regardless of what the model decides. "Every time X" → Stop hook (or PostToolUse, depending on event).
- D — slash commands require the user to invoke them. "Every time" is the user *not* having to remember.

**Principle:** Automated behaviors ("every time X", "from now on when X") need **hooks in `settings.json`**. The harness executes hooks; it does not execute CLAUDE.md or memory.

**Mental model:** ask "who runs this — the model, or the harness?" If you need a guarantee, the harness is the only one that can give one.

**Domain:** 1. Core Concepts → sub-area "Hooks vs. memory vs. CLAUDE.md."

---

## Q6 — MCP transport choice

**Correct: B**

- A — HTTP+SSE is for *remote* or *multi-user* MCP servers. Single dev, same machine? Overkill.
- **B — right.** `stdio` is the canonical local-machine transport. Claude Code spawns the server as a subprocess; lifecycle is bound to the Claude process; no port management; no auth surface.
- C — WebSockets is not a current MCP transport.
- D — gRPC is not a current MCP transport.

**Principle:** Match transport to deployment shape. Local single-user → `stdio`. Remote / multi-user → HTTP+SSE.

**Domain:** 4. Tooling / MCP → sub-area "MCP transports."

---

## Q7 — Tool description quality

**Correct: B**

- A — renaming is cosmetic. Doesn't tell the model what each tool *does*.
- **B — right.** Tool descriptions are the model's selection signal. Specify (1) what it operates on, (2) input shape, (3) ideal-use scenarios, (4) what it does **not** handle. Differentiation > naming > nudging.
- C — system-prompt nudges paper over the design problem and bias the model without informing it.
- D — merging into one tool with a `mode` param adds API surface complexity to dodge a description-quality issue.

**Principle:** When the model picks the wrong tool, the tool's description is the first thing to fix. Renames, system nudges, and tool merges are second-order.

**Domain:** 4. Tooling / MCP → sub-area "Tool descriptions and selection."

---

## Q8 — Structured output reliability

**Correct: B**

- A — soft constraint in the prompt. The model will still violate it ~3% of the time, exactly the rate the question describes.
- **B — right.** Structured-output / tool-use mode with a schema uses **constrained decoding** — the model literally cannot emit tokens that violate the schema for those fields. This is a platform-level guarantee.
- C — XML tags don't constrain the JSON inside. The same trailing-comma bug recurs.
- D — higher temperature increases variance, not reliability. (Counter-intuitive at first; the question is testing whether you know that.)

**Principle:** For machine-consumed output, prefer platform-level constraints over prompt-level requests. The model cannot violate a constraint that isn't sampled.

**Domain:** 2. Prompt Engineering → sub-area "Structured output / tool use as schema."

---

## Q9 — Few-shot placement

**Correct: B**

- A — works, but inline-text examples in a system prompt match the training distribution less well than conversational turns.
- **B — right.** Claude is trained on conversation patterns. Putting few-shots as `user` / `assistant` alternating turns lets the model pattern-match form *and* content. Consistency improves because the input→output shape is exemplified, not just described.
- C — temperature averaging is a workaround for poor structure, not a fix.
- D — compressing examples often removes the discriminating signal that makes them few-shots in the first place.

**Principle:** Few-shots work best in their natural form — conversation turns, not bulleted text. Match training distribution where possible.

**Domain:** 2. Prompt Engineering → sub-area "Few-shot prompting & message structure."

---

## Q10 — Prompt caching strategy

**Correct: B**

- A — truncation loses information; you'd ship a worse system prompt to save dollars.
- **B — right.** Static prefix + 500 calls/day is the *exact* shape prompt caching is built for. Cache reads are ~10% of the price of cache writes. With a 30k-token reused prefix, this is the largest available lever.
- C — Haiku trades quality for cost; doesn't address the underlying inefficiency (sending the same 30k tokens 500 times).
- D — batching helps amortize per-call overhead but doesn't help when the system prompt is the cost driver.

**Principle:** When a large stable prefix is reused across calls, prompt caching with `cache_control` is the highest-leverage cost lever. Place the cache breakpoint at the boundary between stable and dynamic content.

**Domain:** 3. Context & Reliability → sub-area "Prompt caching."

---

## How to read your score

| Score | Read |
|---|---|
| 9–10 | Strong baseline. We focus training on the **misses' sub-areas only**, plus one full mock per week to keep edges sharp. |
| 7–8 | Solid. Train the misses' domains in full (notes + 5–10 challenges + a per-domain MCQ set), skim the rest. |
| 5–6 | Sequence training by exam weight: D5 (Architecture, 27%) → D2 (Prompt Eng., 20%) → D1 (Core, 20%) → D4 (Tooling, 18%) → D3 (Context, 15%). |
| ≤ 4 | We slow down. Notes first, then 1 worked example per sub-area before any MCQs. |

When you've answered, post the 10 letters and we'll mark it together.
