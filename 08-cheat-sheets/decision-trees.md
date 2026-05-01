# Decision Trees

> Condensed cheat sheets for the four decisions that come up most on the exam.
> When in doubt, run the relevant tree top-to-bottom and pick the first leaf
> that matches.

---

## 1. Tools vs. pure prompt

```
Does the answer require fresh data,                   ┌── YES ──> TOOL
deterministic computation, or a side effect?  ────────┤
                                                       └── NO ──┐
                                                                │
Does the answer involve judgment, generation,                   │
or summarization of given context?                              │
                ┌── YES ──> PROMPT (no tool) ◄───────────────────┘
                │
                └── NO ──> RE-READ THE QUESTION; you missed a constraint.
```

**Use a tool when:**
- External data (DB, API, file system, web)
- Side effect (write, send, deploy)
- Deterministic computation (math, parsing, regex)
- Repeated identical transform across many calls

**Use pure prompt when:**
- Judgment / classification / ranking with given context
- Generation (writing, summarizing, rewriting)
- Reasoning over inputs already in the context
- One-shot, no IO, no fresh data

**Borderline cases:**
- "Calculate" with small numbers in-context → prompt is fine; tool only adds latency.
- "Summarize this 200k-word document" → tool (chunked retrieval) before the prompt, never raw.

---

## 2. When to chunk context

```
Is the input larger than                          ┌── NO ──> SEND WHOLE
~50% of the context window?  ─────────────────────┤
                                                   └── YES ──┐
                                                             │
Are the items independent (each chunk      ┌── YES ──> CHUNK + summarize per-chunk +
answerable on its own without the others)? ┤            combine summaries
                                            └── NO ──> RETRIEVAL (search/embed) +
                                                       inject only relevant slices
```

**Chunk-and-summarize:** logs, transcripts, document indexing, batch classification.
**Retrieval (RAG):** Q&A over knowledge bases, support deflection, code search.
**Send whole:** anything cross-referencing multiple parts at once (proof reading, contract review, full-codebase refactor brief).

**Anti-pattern**: "I'll just send the whole thing and hope" when input is >70% of window. Quality degrades sharply past ~50%.

---

## 3. When to enforce structure

```
Who reads the output?
       │
       ├─ Machine (parser, DB, downstream pipeline) ──> ENFORCE (schema/tool-use)
       │
       ├─ Human reading once ──> DON'T enforce; readability > rigidity
       │
       └─ Human reading + downstream parsing ──> ENFORCE; humans can read JSON,
                                                  parsers can't read prose
```

**Enforce with:**
- **Tool use / function calling** — best for typed records, multi-field extraction.
- **JSON mode / response_format** — best when output is a single JSON object.
- **XML tags** — fallback when neither tool-use nor JSON mode applies; lower guarantee.
- **Few-shot examples in the structured form** — adjunct, not primary.

**Don't enforce when:**
- Single-shot conversational answer
- Exploratory / brainstorming
- Output is creative writing, code review prose, explanation

**Trap on the exam:** "Just add 'return valid JSON' to the prompt" is always
wrong when the question describes a non-zero failure rate. Soft prompts lose
to platform-level constraints every time.

---

## 4. When Claude fails (and what to reach for)

| Symptom | Most likely cause | First fix to try |
|---|---|---|
| **Hallucinated fact** | No grounding context | Retrieval / tool that returns facts; cite sources; lower temperature |
| **Format violation** (bad JSON, missing field) | Soft constraint in prompt | Schema-enforced output (tool-use / JSON mode), not prompt |
| **Instruction drift** (forgets earlier rules) | Long prompt, rules buried | Lift rules to system; shorten prompt; re-assert at message boundary |
| **Refusal that is wrong** | Safety classifier on benign input | Restate legitimate use case; add domain context; if persistent, escalate |
| **Loop / runaway** | Unbounded agentic loop | Bound the loop; ~80% watermark exit; commit partial work |
| **Inconsistent output** across runs | Wrong few-shot shape | Move few-shots to alternating user/assistant turns; lower temperature |
| **Confidence without evidence** | Open-ended question, no grounding | Ask for citations; "if uncertain, say I don't know" instruction; tool-grounded answers |
| **Wrong tool selected** | Weak tool descriptions | Rewrite descriptions: scope, input shape, ideal-use; differentiate from siblings |
| **Slow / expensive** | Repeated large prefix on every call | `cache_control` on stable prefix; cache reads = ~10% of write cost |
| **Context overflow** | Whole-document approach when chunked is correct | Switch to retrieval or chunk-and-summarize |

---

## How I default (running list — promoted from `06-failure-analysis/error-log.md`)

When the same failure mode appears across ≥3 misses in `error-log.md`, lift
the prevention rule here. These are the running defaults to consult before
answering:

- **D-bias on misses** (F1, 5/7 misses on diagnostic-01): boring beats clever. The most boundary-respecting option is usually correct.
- **Compression reflex** (F2, 2/7 on diagnostic-01): when an answer says "shrink / summarize / compress," ask first whether *moving* the content with full fidelity solves the same problem. Almost always yes.
- **Over-engineered fix** (F8): when an option proposes API redesign, tool merging, or architectural change, check first whether a *configuration* or *description* change at the existing surface would do. It usually does.

---

## Last-resort rule

If you're between two options and both feel right, pick the **simpler** one.
The exam rewards judgment, and judgment penalizes elaborate constructions
when a plain answer fits the constraints.
