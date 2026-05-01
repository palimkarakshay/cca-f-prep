# Diagnostic 01 — Mixed Domain (10 questions, ~20 min)

Take this cold. No notes, no peeking at `solutions/diagnostic-01.md`. Mark your
answer next to each question, then we'll score it together.

Coverage:

| Q | Domain | Sub-area |
|---|---|---|
| 1 | 1. Agentic Architecture | Coordinator-subagent vs. linear loop |
| 2 | 1. Agentic Architecture | Hook event placement |
| 3 | 1. Agentic Architecture | Bounded loops / session budget |
| 4 | 2. Claude Code Config | CLAUDE.md hygiene |
| 5 | 2. Claude Code Config | Hooks vs. memory for automation |
| 6 | 3. Tool Design / MCP | MCP transport choice |
| 7 | 3. Tool Design / MCP | Tool description quality |
| 8 | 4. Prompt Engineering | Structured output reliability |
| 9 | 4. Prompt Engineering | Few-shot placement |
| 10 | 5. Context & Reliability | Prompt caching strategy |

---

## Q1 — Coordinator-subagent vs. linear loop

A team is building a research assistant that must (a) search across 12 internal
knowledge bases, (b) cross-check facts across the results, and (c) write a final
report. The current implementation runs as a single agentic loop calling tools
sequentially. Median latency is 90 seconds and the assistant occasionally drops
sources mid-report when the context grows long.

What is the **strongest** reason to refactor to a coordinator-subagent pattern?

- A. Subagents will reduce per-turn token cost because they run on cheaper models.
- B. Independent searches can run in parallel, and each subagent's intermediate context is isolated from the coordinator's.
- C. Subagents have access to a longer context window than the coordinator.
- D. The coordinator-subagent pattern is required when more than 10 tools are registered.

**My answer:** _______

---

## Q2 — Hook event placement

A developer wants Claude Code to refuse to run any shell command containing
`rm -rf` or `--no-verify`, regardless of the user's permission mode.

Which hook event should this rule live in?

- A. `SessionStart` — block at session boot before any tool call happens.
- B. `PreToolUse` — inspect and reject the tool call before it executes.
- C. `PostToolUse` — inspect the result and warn if a dangerous command ran.
- D. `Stop` — analyze the full transcript at the end of the session.

**My answer:** _______

---

## Q3 — Runaway agentic loop

An agent is implementing a complex feature. It has been going for 47 turns,
looping between editing the same file, running tests, and re-editing. The tests
still fail.

Which mitigation is **most aligned** with agentic-architecture best practices?

- A. Increase `max_tokens` so the agent has more room to think.
- B. Add a soft watermark at ~80% of max-turns: finish current unit, commit, exit cleanly, resume next run.
- C. Switch the agent to a more powerful model mid-run when retries exceed 5.
- D. Disable the test-running tool until the agent commits to a written plan.

**My answer:** _______

---

## Q4 — CLAUDE.md hygiene

A repo's `CLAUDE.md` has grown to 12,000 tokens over six months. Sessions feel
slower to start, and the operator notices Claude sometimes parrots instructions
back rather than acting on them.

What is the **most appropriate** action?

- A. Switch the model to a smaller one to reduce per-token cost.
- B. Move historical sections into `docs/reference/` and `@`-include only the parts that are still actively binding.
- C. Delete the file and re-derive context from each new session's user prompt.
- D. Compress the file with an LLM-based summarizer and overwrite it in place.

**My answer:** _______

---

## Q5 — Automated behavior trigger

The user says: _"From now on, every time you finish a task, run `npm run lint`
and post the output in the chat."_

Which mechanism implements this **reliably**?

- A. Add a sentence to `CLAUDE.md` describing the desired behavior.
- B. Save it as a memory / preference for future sessions.
- C. Configure a `Stop` hook in `settings.json` that runs `npm run lint` and prints the result.
- D. Create a slash command that runs lint, and tell the user to invoke it after each task.

**My answer:** _______

---

## Q6 — MCP transport choice

A team is building an MCP server that exposes a 50ms-latency internal database.
The server will be used by a single developer's Claude Code instance, running
on the same machine.

Which transport should they use?

- A. HTTP + Server-Sent Events, because it is the future-proof default.
- B. `stdio`, because the server runs on the same machine and its lifecycle is bound to the Claude Code process.
- C. WebSockets, for full-duplex streaming.
- D. gRPC, for strongly-typed schemas.

**My answer:** _______

---

## Q7 — Tool description quality

Two tools are registered: `search_documents` and `find_files`. Both currently
have one-line descriptions: "Search the system for documents" and "Find files."
The model keeps picking the wrong one.

Which fix has the **highest leverage**?

- A. Rename the tools to `search_documents_v2` and `find_files_v2`.
- B. Rewrite both descriptions to specify what each tool searches (e.g., "search indexed PDFs by content" vs. "list filenames in working directory by glob"), the input shape, and the kind of question each is right for.
- C. Add a system-prompt rule: "When in doubt, prefer `search_documents`."
- D. Merge both tools into one `search` tool with a `mode` parameter.

**My answer:** _______

---

## Q8 — Structured output reliability

An agent must return a list of `{name, email, score}` records to be inserted
into a database. About 1 in 30 responses has a trailing comma or unescaped
quote that breaks `JSON.parse`.

What is the **most reliable** fix?

- A. Add "Return valid JSON, no trailing commas" to the system prompt.
- B. Use the API's structured-output / tool-use mode with a JSON schema for the records.
- C. Wrap the response in `<json>` XML tags and parse the inner content.
- D. Increase temperature so the model takes more care.

**My answer:** _______

---

## Q9 — Few-shot placement

A classification prompt has 5 few-shot examples. The role definition is in the
system prompt, the examples sit inline as text inside the user message before
the actual input, and the input itself follows. Classification accuracy varies
wildly between runs.

Which restructure is **most likely to improve consistency**?

- A. Move all examples into the system prompt as a long bulleted list.
- B. Use alternating `user` / `assistant` turns for the few-shot examples, then send the actual input as the final `user` message.
- C. Increase temperature to add diversity, then average over multiple runs.
- D. Compress the examples with bullet points to fit more into context.

**My answer:** _______

---

## Q10 — Prompt caching strategy

A team calls Claude with a 30,000-token system prompt (instructions + reference
docs) and 200-token user messages. They make ~500 calls per day and want to
reduce cost.

Which strategy delivers the **biggest win**?

- A. Truncate the system prompt to 10,000 tokens.
- B. Add `cache_control` to the static reference-docs portion of the system prompt.
- C. Switch from Sonnet to Haiku.
- D. Batch 10 user messages per call.

**My answer:** _______

---

## When done

Post your 10 answers (e.g., `1B 2B 3B 4B 5C 6B 7B 8B 9B 10B`) and we'll score
together. Then I'll open `solutions/diagnostic-01.md` and we'll go question by
question on the misses to figure out which domain to train first.
