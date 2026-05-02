# Basics Diagnostic — 15 Questions

> Calibration MCQ across the 9 Anthropic Academy foundation courses.
> Take twice:
>
> - **First**: cold, before doing the courses. Seeds your initial
>   measured ratings in `09-progress-tracker/skills-matrix.md`.
> - **Second**: after Phase B (Bridge) is complete. Pass-gate to architect
>   drilling is **≥ 12 / 15**.
>
> One correct answer per question. Three plausible distractors. Each
> question is tagged in the answer key (`solutions/basics-diagnostic-key.md`)
> to a specific B-code and exam principle. Do **not** read the key
> before scoring.
>
> No AI assist on this diagnostic. Note your low-confidence answers — they
> matter as much as the wrong ones.

---

### Q1
A team uploads 40 PDFs to a Claude.ai Project so the assistant can answer
across the corpus. As more PDFs are added, answer quality degrades —
irrelevant content keeps surfacing. What is happening?

- **A.** The model's context window is too small to hold the
  embeddings index.
- **B.** Project files are loaded into context, not retrieved by
  similarity — so all of them compete for attention.
- **C.** Claude.ai's project retriever needs an explicit re-index call
  after each upload.
- **D.** The Project's vector store has hit its quota and is silently
  dropping older files.

---

### Q2
A chatbot built on the Claude API keeps producing confidently-wrong
dates when asked about *yesterday's news*. The team's first instinct is
"iterate the prompt." Inside the AI Fluency 4D framework, which D is
actually broken?

- **A.** Description — the prompt is unclear about what counts as news.
- **B.** Discernment — the team isn't verifying the dates after the fact.
- **C.** Delegation — Claude has no real-time data or retrieval; the
  task is structurally mis-delegated.
- **D.** Diligence — there's no human review step in the pipeline.

---

### Q3
You're tightening a flagging prompt that produces vague verdicts.
Which single addition is the strongest one-line fix?

- **A.** "Be more thorough."
- **B.** "Output a verdict of OK, WARN, or BLOCK followed by one
  sentence of justification."
- **C.** "Use chain-of-thought reasoning before answering."
- **D.** "Be careful and check your work."

---

### Q4
A customer-service bot has three pieces of context per call:
(i) durable policy rules ("never quote prices"),
(ii) a persona ("You are Aria, friendly and brief"),
(iii) the customer's current question.
Which placement gives both maximum clarity and best prompt-cache hit
rate?

- **A.** `system`: rules + persona. `user`: current question.
- **B.** `system`: rules. `user`: persona + current question.
- **C.** `system`: empty. `user`: rules + persona + current question.
- **D.** `system`: rules. `user`: current question. Tool description:
  persona.

---

### Q5
A request includes a 4 000-token reference doc that is identical across
all users, then a 200-token per-user question. Where do you place a
`cache_control: {type: "ephemeral"}` marker for maximum cost savings?

- **A.** At the very start of the request.
- **B.** Immediately after the reference doc, before the user question.
- **C.** After the user question.
- **D.** Only on the `system` field; in-line markers are ignored.

---

### Q6
A scheduled job needs Claude to emit strict JSON for downstream
parsing. Two candidate designs:

- (I) `system` instruction: "Reply only as JSON with this schema: {…}."
- (II) Define a tool whose input schema is exactly the desired output;
  invoke with `tool_choice` forcing that tool.

Which holds up reliably across 1 000 invocations?

- **A.** (I) — modern Claude follows JSON instructions reliably enough.
- **B.** (II) — the API validates the shape against the schema, so
  malformed output is structurally impossible.
- **C.** Both, equally; choose by latency.
- **D.** Neither; lower temperature instead.

---

### Q7
A team wants Claude to execute SQL queries against their analytics DB
on the user's request. Which MCP primitive fits?

- **A.** Resource — the DB is a data source.
- **B.** Prompt — the query is a templated user request.
- **C.** Tool — the action is model-invoked, side-effecting, and needs
  a schema.
- **D.** None of the above; this requires a custom MCP transport.

---

### Q8
A SaaS vendor wants its MCP server to be used by thousands of customer
Claude Code installations, with per-tenant authentication. Which
transport?

- **A.** `stdio`
- **B.** `HTTP+SSE`
- **C.** WebSockets
- **D.** gRPC

---

### Q9
The model has two tools: `search_logs` and `query_logs`. It consistently
calls `query_logs` when it should call `search_logs`. First fix?

- **A.** Merge them into one tool with a `mode` parameter.
- **B.** Rewrite both tool descriptions to spell out scope, expected
  input shape, and ideal use cases.
- **C.** Add a long `system` prompt block listing which tool to use
  when.
- **D.** Drop `query_logs` and reimplement everything inside
  `search_logs`.

---

### Q10
A security team requires: any shell command containing `rm -rf` is
blocked before execution, with zero exceptions. Where does the
enforcement live?

- **A.** A CLAUDE.md instruction telling Claude not to run `rm -rf`.
- **B.** A system-prompt rule.
- **C.** A `PreToolUse` hook that pattern-matches the bash command and
  exits non-zero.
- **D.** A Skill called "safe-bash" the user must invoke before
  destructive operations.

---

### Q11
Order these Claude Code lifecycle events from earliest to latest:

- (i) `PostToolUse`
- (ii) `UserPromptSubmit`
- (iii) `SessionStart`
- (iv) `PreToolUse`
- (v) `Stop`

- **A.** iii → ii → iv → i → v
- **B.** iii → iv → ii → i → v
- **C.** ii → iii → iv → i → v
- **D.** iii → iv → i → ii → v

---

### Q12
An agent loop has tools but no session-budget watermark. The token
budget hits 100% mid-summary. Most likely failure mode?

- **A.** The model raises a typed error and exits cleanly.
- **B.** The model returns a truncated final answer, sometimes losing
  the most recent reasoning.
- **C.** The model silently retries with a shorter context window.
- **D.** The model spawns a subagent to free up parent context.

---

### Q13
Which property is the strongest signal that a rule belongs in
**CLAUDE.md**, not in a **Skill**?

- **A.** The rule is large (200+ lines).
- **B.** The rule must apply *automatically every session* without the
  user invoking anything.
- **C.** The rule is specific to this project.
- **D.** The rule contains code examples.

---

### Q14
Both of the following are valid reasons to spawn a subagent. Which is
**not**?

- **A.** The work is parallelizable across two independent files.
- **B.** The work would generate scratch reasoning that would pollute
  the parent context.
- **C.** The agent has more than 10 tools available.
- **D.** Both A and B simultaneously apply.

---

### Q15
A team designs a 6-hour Cowork research task that runs overnight with
no intermediate artifact or human checkpoint. Best objection?

- **A.** Cowork doesn't support 6-hour-long tasks.
- **B.** There is no checkpoint to inspect, course-correct, or roll
  back; the task is unrecoverable if it drifts.
- **C.** Cowork bills overnight tasks at a 6× premium.
- **D.** The task should be split into six one-hour Cowork tasks.

---

## Scoring & next step

| Score | Action |
|---|---|
| 0 – 5 | Phase A from scratch. Take all 9 courses, no skipping. |
| 6 – 9 | Phase A; pre-rate B-skills at **2** rather than **0** for the courses you scored well in, but still take them. |
| 10 – 11 | Phase A light (skim courses, do notes & recall prompts), straight into Phase B. |
| 12 – 15 | Phase B / C eligible. Re-take after 3 weeks to confirm the score is stable, not a fluke. |

Log each missed Q in `06-failure-analysis/error-log.md` with both the
F-code and the responsible **B-code** (new column).
