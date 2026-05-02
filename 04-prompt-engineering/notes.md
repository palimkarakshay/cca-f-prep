# Domain 4 — Prompt Engineering & Structured Output

**Exam weight: 20%.** Sub-areas: system vs. user, few-shot placement,
structured output / tool use as schema, message structure, output
contract design.

## One-line summary

Prompt engineering on Claude is mostly about **placing the right
content in the right slot**: durable rules in `system`, examples as
alternating turns, machine-consumed output via schema (tool-use), not
soft prompt requests. Most "the model violates JSON" bugs are
violations of this structural discipline.

## 5 principles

1. **System vs. user — durable vs. volatile.** `system` carries the
   role, durable rules, persona, and stable reference content (this
   is what gets cached). `user` carries the current request. A
   per-request value (e.g., user ID, today's date) in `system` is a
   *system-field leak* — kills cache and pollutes the durable layer.

2. **Few-shot examples belong as alternating `user`/`assistant`
   turns**, not as bulleted text inside a single message. Claude is
   trained on conversation; matching that shape teaches both *form*
   and *content*. Inline-text bullets compress the discriminating
   signal that makes them few-shots in the first place.

3. **Structured output via tool-use / schema is a platform-level
   guarantee** (constrained decoding). The model literally cannot emit
   tokens that violate the schema for those fields. Soft prompt
   requests ("return valid JSON, no trailing commas") fail at exactly
   the rate the question describes — 1 in 30, 1 in 100 — because they
   are advisory.

4. **Hierarchy of structure-enforcement strength**, strongest first:
   tool-use / function calling (typed records, multi-field) > JSON
   mode / response_format (single object) > XML tags (lower
   guarantee, useful as fallback) > few-shot examples in target form
   (adjunct). Pick the strongest mechanism the use case allows.

5. **Output contract before output style.** Decide who reads the
   output (machine / human / both) before deciding format. Machine →
   enforce. Human-only → readability beats rigidity. Both → enforce
   (humans can read JSON, parsers can't read prose).

## 2 failure modes

- **F-soft-format-request** — adding "Return valid JSON" to the system
  prompt and assuming it's enforced. It isn't. Constrained decoding
  via tool-use is the fix.
- **F-bulleted-fewshot** — compressing few-shots into bullets to "fit
  more in." Loses the turn-shape signal; consistency drops. Use turns,
  fewer of them, in their natural form.

## Maps to CCA-F sub-areas

- *Structured output reliability* — diagnostic-01 Q8
- *Few-shot placement* — diagnostic-01 Q9
- *System vs. user placement* — basics-checklist B3.1
- *Tool-schema vs. prompt-only* — basics-checklist B3.5
- *System field leak* — basics-checklist B3.6

## 4D framing (from AI Fluency)

When a prompt fails, classify before iterating:

- **Description** — role/task/constraint/format unclear → rewrite
  prompt
- **Discernment** — output not being verified → add a check step
- **Delegation** — task is structurally LLM-unsuited (e.g., needs
  fresh data) → tool / retrieval, not prompt
- **Diligence** — no human-review gate where one is needed → add
  oversight

The delegation D is where most "iterate the prompt" instincts fail —
some tasks should not be prompts at all.

## External reading (see `08-cheat-sheets/external-resources.md`)

- Claude prompting best practices (official) — XML tags, prefill,
  role-play, chain-of-thought
- anthropic-cookbook `tool_use/` — JSON-schema validation + retry
  loops in code
- *Advanced tool use* — structured outputs section

## Recall prompts

1. JSON output fails 1 in 30 calls. What is the **highest-leverage**
   fix, and which weaker fix sounds right but isn't?
2. Few-shot accuracy varies wildly between runs. What restructure?
3. A persona — `system` or `user`? Why?
4. Order the structure-enforcement mechanisms from strongest to
   weakest.
5. The 4D framing — which D is most often mis-routed?
