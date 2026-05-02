# Building with the Claude API — notes

**Course:** [Building with the Claude API](https://anthropic.skilljar.com/claude-with-the-anthropic-api) ·
**Length:** 3–4 hr · **Maps to:** Domain 3 (Tool Design) + Domain 4 (Prompt Engineering)

## One-line summary

Messages API mechanics — `system` field, alternating `user`/`assistant`
turns, tool use, structured output, RAG patterns, batch, prompt caching.
This is the densest single course for the exam.

## 5 principles

1. **`system` is privileged context.** It sets role, persistent rules,
   and is the canonical location for the cached prefix. User-message
   instructions are demotable; system-message instructions are not.
2. **Few-shots belong as alternating turns**, not as bullet lists in a
   single prompt. The model was trained on `user → assistant → user →
   assistant`; matching that distribution gets cleaner imitation.
3. **Tool use is a loop, not a single call.** The model emits a
   `tool_use` block; you execute and return a `tool_result` block in the
   next user turn; repeat until the model emits text only. Stop reasons
   matter — `tool_use` ≠ `end_turn`.
4. **Structured output is enforced via tool-use, not via "JSON mode" hope.**
   Define a tool whose input schema *is* your output shape; the API
   validates against the schema. Soft prompt constraints ("respond in
   JSON") are unreliable and untested.
5. **Prompt caching is prefix-based and explicit.** `cache_control:
   {type: "ephemeral"}` markers create a cache breakpoint at that point;
   anything *before* the marker is cached, anything after is fresh. Cache
   hits cut input cost ~10× and latency materially. Place markers
   *after* stable content (system prompt, large doc), *before* the
   per-request part.

## 2 failure modes

- **F-system-leak** — putting volatile per-request data (current time,
  user name) in the `system` field. It busts caching and pollutes the
  privileged layer.
- **F-soft-json** — trusting "respond in JSON" prompt instructions
  instead of a tool-schema. Works 90% of the time and fails silently the
  10%.

## Maps to CCA-F

- **Domain 4**: system vs. user, few-shot turn structure, structured
  output via tools.
- **Domain 3**: tool schema design, tool-use loop control, error handling
  in `tool_result`.
- **Domain 5**: prompt caching placement, batch API for cost.

## Recall prompts

1. Where does the `cache_control` marker go for a long static doc + a
   short per-call question?
2. The model emits `stop_reason: tool_use`. What's the next message
   shape?
3. Why does "respond in JSON only" fail for production structured output?
