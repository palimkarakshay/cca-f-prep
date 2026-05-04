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

## 5. Learner re-engagement (when to nudge)

When a learner stops returning, run Fogg B = MAP (motivation × ability ×
prompt — Fogg 2009) before adding any new feature.

```
Has the learner failed to return for ≥ N days?
                │
        ┌───────┴────────┐
        │                │
       NO               YES — diagnose which factor is missing
        │                │
   No-op           ┌─────┼─────┐
                   │     │     │
                  M=lo  A=lo  P=lo
                   │     │     │
   Restore        Reduce       Add prompt — variable-ratio (Skinner)
   relatedness    friction     anchored to historical session-time.
   (cohort, peer  (one-tap     If ≥ 3 prompts ignored → BACK OFF
   accountability) "5-min       (avoid prompt-fatigue extinction).
   — SDT, Ryan    review";     Hook Model trigger phase (Eyal 2014).
   & Deci)        nano-format)  Duolingo precedent: CURR +21%, DAU 4.5×.
```

**Why each leaf is correct:**

- *Motivation* leaf — Self-Determination Theory (Ryan & Deci): autonomy /
  competence / relatedness drive intrinsic motivation. Cohort surface or
  goal-gradient progress (Kivetz, Urminsky & Zheng 2006) restores
  motivation. Loss-aversion via streak (Kahneman & Tversky 1979) is the
  retention lever for solo learners.
- *Ability* leaf — when the behaviour fails, prefer raising ability over
  motivation (Fogg). Reduce friction: ≤ 5-min sessions, one-tap resume,
  default to the spaced-review queue.
- *Prompt* leaf — variable-ratio reinforcement (Skinner) is the most
  extinction-resistant schedule. Anchor to historical session time
  (when the learner has previously studied) for highest pickup.

---

## 6. SME content-elicitation tree (CTA-style)

For each new concept the SME authors, the platform asks **in this order**.
Each is a required field in the drafter intake. The order matters: the
expert-blind-spot probe (a) primes the SME to think novice-first before
they start writing, which is the cognitive flip that closes the
70%-decision-omission gap (Clark, Feldon, van Merriënboer, Yates &
Early — Cognitive Task Analysis).

1. **(a) Expert-blind-spot probe.** "What would a *novice* get wrong here,
   and why?" *(Nathan & Petrosino 2003 — preservice-teacher expert blind
   spot; Hinds 1999 — curse of expertise.)*
2. **(b) Backward-design principle.** "What is the **one principle**, in
   one sentence, that the assessment will test?" *(Wiggins & McTighe 1998
   — Understanding by Design: write the assessment evidence first, then
   the lesson.)*
3. **(c) Worked-example pair.** Provide one fully-worked example AND one
   faded variant (gaps for the learner to fill). *(Sweller 1988; Sweller,
   van Merriënboer & Paas 2019; Renkl on faded worked examples.)*
4. **(d) Boundary / negative case.** "What is the boundary — when does
   this principle stop applying? Give a near-miss case where the wrong
   answer is plausible." *(CTA boundary probe — Clark / Feldon.)*
5. **(e) Nearest confusable concept.** "Which existing concept does this
   most easily get confused with, and on what surface feature?"
   *(Interleaving prep — Rohrer & Taylor 2007; learners need
   discrimination practice, which requires the SME to name the
   confusable.)*

**Hard rule:** principle (b) is selected from a closed taxonomy
(principle-tag picker) — not free-typed. Free-typed principle fields
drift across SMEs and break learners' ability to accumulate a stable
schema (Knowles andragogy / Bloom revised: taxonomic anchoring matters).

---

## 7. Segment-aware mechanism selection

When the operator (or a customer) is choosing which mechanism bundle to
prioritise for a cohort, branch on three inputs in this order: **vertical
→ company size → cultural axis (PDI / UAI / IDV)**.

| If the cohort is… | Then prioritise this bundle |
|---|---|
| Deskless vertical (manufacturing, retail/hospitality, healthcare-frontline, field-services) | LM1 (spaced retrieval) + LM7 (streak/variable-reward) + voice-first SM7 (tacit-knowledge capture); ≤ 3-min nano-format; offline-capable. ~2.7B workers globally — TalentCards / industry consensus. |
| Compliance-heavy vertical (finance, healthcare, government) | LM2 (retrieval gate) + LM6 (calibration capture) — calibration Δ is the "competence ≠ completion" proof; audit-trail / version-pin / role-based-publish governance. < 70% completion ⇒ 3.5× violation rate (KPI Depot 2026). |
| High-PDI / face-saving culture (East Asia, Latin America, MENA, India) | Leader-endorsed pathway gate before SME publish. Critic copy framed as *probe* not *test* (SM4); anonymised peer-review surfaces; SM8 dashboard private to SME. Hofstede–e-learning literature (high-UAI cohorts find e-learning usability frustrating without fixed structure). |
| Single-SME-bottleneck (startup founder-as-SME, SMB) | SM1 (CTA intake) + SM7 (voice/camera capture) + auto-draft + reviewer-pairing. Bus-factor 1 explicitly addressed. |
| Mid-market with SCORM/xAPI LMS | xAPI emit hooks; Kirkpatrick L2 dashboards exposed to L&D function. Closes the SCORM-completion / competence gap. |
| Enterprise distributed-SME (5000+, multi-geo, multi-language) | Role-based publish + multi-language critic + version-pin + audit-trail + WCAG 2.2 AA / Section 508. |

**Why this tree exists.** The mechanism set (LM1–LM8, SM1–SM8) is the
same regardless of segment — but the *surface* varies. One critic
engine, one CTA-probe schema, one calibration-Δ column projected
through different UI affordances per segment. Picking the right
projection up-front prevents shipping the wrong default.

---

## How I default (running list — promoted from `06-failure-analysis/error-log.md`)

When the same failure mode appears across ≥3 misses in `error-log.md`, lift
the prevention rule here. These are the running defaults to consult before
answering:

- **D-bias on misses** (F1, 5/7 misses on diagnostic-01): boring beats clever. The most boundary-respecting option is usually correct.
- **Compression reflex** (F2, 2/7 on diagnostic-01): when an answer says "shrink / summarize / compress," ask first whether *moving* the content with full fidelity solves the same problem. Almost always yes.
- **Over-engineered fix** (F8): when an option proposes API redesign, tool merging, or architectural change, check first whether a *configuration* or *description* change at the existing surface would do. It usually does.
- **Fluency illusion** (F11): re-reading is not retrieval. If I "feel I know it", that's the JOL trap (Bjork & Bjork 2011 stability-vs-fluency). Force a blank-page recall before claiming mastery.
- **Cue-bias / letter-bias** (F12, promotes `letter-bias-2026-05` from CLAUDE.md): when two distractors look identical in length and one is shorter, do not let length be the cue. Re-read both for a content distinction. The B-skewed correct-letter distribution in the auto-authored quizzes is the canonical example.

---

## Last-resort rule

If you're between two options and both feel right, pick the **simpler** one.
The exam rewards judgment, and judgment penalizes elaborate constructions
when a plain answer fits the constraints.
