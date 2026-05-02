# AI Fluency: Framework & Foundations — notes

**Course:** [AI Fluency: Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations) ·
**Length:** 3–4 hr · **Maps to:** Domain 4 — Prompt Engineering & Structured Output

## One-line summary

The 4D framework — **Delegation, Description, Discernment, Diligence** —
is Anthropic's named mental model for collaborating with an LLM. It's the
spine of every prompt-quality question on the exam.

## 5 principles

1. **Delegation = task-shape decision.** Decide *what* to ask the model
   to do, given its strengths (synthesis, transformation) and weaknesses
   (precise arithmetic, real-time data). Bad delegation is the single
   biggest source of "AI doesn't work."
2. **Description = the prompt itself.** Role, task, constraints, format,
   examples — explicit, unambiguous, layered. Vague descriptions produce
   vague output; the model is not psychic.
3. **Discernment = output evaluation.** Treat every response as a
   hypothesis. Check facts, check format, check edge cases. The model
   confidently fabricates when ungrounded.
4. **Diligence = the ethical/operational loop.** Ownership of outcome,
   appropriate human oversight, awareness of misuse, awareness of bias.
   Not optional; this is what gets tested under "responsible deployment"
   framing.
5. **Description ↔ Discernment is a loop, not a step.** When discernment
   fails (wrong format, hallucination), the fix is almost always to
   *re-describe*, not to retry. Iterate the prompt, not the temperature.

## 2 failure modes

- **F-overdelegate** — handing the model tasks it structurally can't do
  well (precise math without a tool, recency without retrieval). No
  prompt fixes this; only changing the delegation does.
- **F-skip-discernment** — accepting the first plausible-sounding output
  without verification. Hallucination is silent; you only catch it by
  checking.

## Maps to CCA-F

- **Domain 4** rationale layer: every "which prompt is better" MCQ
  resolves to one of the 4Ds. Name the D when you justify the answer.
- **Domain 5** ties in via diligence (oversight, error handling).

## Recall prompts

1. Name the 4 Ds and one failure mode per D.
2. A prompt produces wrong arithmetic. Which D failed?
3. Why is "iterate the prompt" usually correct over "retry"?
