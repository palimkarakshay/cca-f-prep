# Training Methodology

> The exam tests **judgment**, not recall. This file is the operating manual
> that turns study time into judgment. Don't skim — these patterns are how
> you compound.

---

## Daily training loop (60–90 min)

Four steps. Order matters. **AI is OFF for steps 1 and 3.**

### Step 1 — Concept compression (15–20 min, no AI)

Pick one sub-area. From memory and notes only, write:

- **5 bullet principles** — one sentence each, named, no fluff.
- **2 failure modes** — what breaks, when, how it surfaces.
- **1 real-world use case** — concrete, with the tradeoffs spelled out.

If you can't fill all 8 from memory, that's the diagnostic — re-read notes,
try again. **Don't ask Claude to fill in.** The point is forcing the gaps to
the surface.

### Step 2 — Challenge (Claude-generated)

Ask Claude:

> "Generate a `<sub-area>` scenario that forces tradeoffs, not a direct
> solution. Don't include the answer. The scenario should have at least two
> defensible approaches with different cost/latency/reliability profiles."

Save the challenge in `0X-<domain>/challenges/`. **Don't read the solution
yet.**

### Step 3 — Solve without Claude (15–20 min, no AI)

This is where most candidates fail. You must:

1. Design the prompt / system message / tool interface yourself, written out.
2. Write your reasoning explicitly — what tradeoff did you take, what did you reject, why?
3. Identify the failure mode if your design is wrong.

Save your attempt in the same `challenges/` file (or a sibling). The point
is having a *recorded* reasoning trail, not just an answer.

### Step 4 — Claude audit

Hand Claude both the challenge and your written attempt. Ask:

> "Where is my reasoning weak or incomplete? Where did I over-engineer?
> Where did I miss a tradeoff?"

Log the gaps in `06-failure-analysis/error-log.md` using the F-code taxonomy.
If a new pattern emerges across ≥3 audits, promote it to
`08-cheat-sheets/decision-trees.md` § "How I default."

---

## Mock exam strategy (60-min mock, ~3-hour total cycle)

Four phases. Skipping any one is wasted effort.

### Phase 1 — Timed exam (no AI, strict)

- 60 minutes, no notes, no Claude, no Google.
- Mark every answer; circle low-confidence ones.

### Phase 2 — Self-grading

- Score yourself.
- For every answer (including correct ones), write a one-sentence
  justification. **The justification matters more than the letter.** Many
  "right" answers are right by accident.

### Phase 3 — Claude audit

Hand Claude your answers + justifications. Ask:

> "For each justification, tell me whether it identifies the *correct
> principle*, or just lands on the right answer for the wrong reason. Be
> brutal."

The "right answer, wrong reason" cases are silent failures — they pass
today's exam but break on the next variation.

### Phase 4 — Rewrite incorrect answers

Don't just re-read solutions. **Rewrite each missed answer from scratch**:
the scenario, the four options, why the correct one wins, why each
distractor loses. Save in `0X-<domain>/challenges/`. The act of writing
hardens the principle.

---

## Topic mastery strategy

Domain-by-domain priority for someone with strong code background and weak
AI / architecture background. Spend the most time on A and B.

### A. Context Reliability *(critical)*

Focus:
- Context window management & degradation at >50% fill
- Retrieval vs. injection vs. summarization
- Instruction hierarchy (system > earlier user > later user)
- Prompt caching (`cache_control` placement)

Practice scenarios:
- Long context degradation (instructions buried at token 90k of 100k)
- Conflicting instructions across system and user
- Partial memory reconstruction after context truncation

### B. Prompt Architecture *(not just prompting — layering)*

Layered thinking:
```
       System prompt   (role, persistent rules, cached prefix)
            │
       Task prompt     (per-call instructions)
            │
       Tool interface  (schemas, descriptions)
            │
       Output schema   (constrained decoding)
```

Drill: design the **same task** three ways, compare:
1. Single prompt
2. Multi-stage pipeline (sequential calls)
3. Tool-assisted (tools + reasoning)

### C. Tool Design / MCP *(your code-architecture leverage)*

Go deep:
- When to call a tool vs. reason in-context
- Tool schema design (inputs, errors, side effects)
- Deterministic tool output vs. probabilistic model output
- MCP transport: `stdio` (local single-user) vs. `HTTP+SSE` (remote/multi-user)

Build:
- 3–5 realistic tool APIs (HR DB, budget tracker, code search) with full
  schemas
- Simulate failures: timeouts, malformed responses, partial results

### D. Failure Modes *(underrated; the exam tests these directly)*

Study explicitly:
- Hallucination triggers (no grounding, confident phrasing in prompt)
- Overconfidence (no "if uncertain say I don't know")
- Instruction drift (rules buried, long prompts)
- Format violations (soft prompt constraint, no schema)

### E. Evaluation Thinking *(grader mindset)*

For every question, ask:
- What is **most correct** vs. **acceptable but worse**?
- What tradeoff is being tested? (latency / accuracy / cost / safety)
- "Safe" vs. "optimal" — does the question reward conservatism or boldness?

---

## Real-world simulation layer

Build three running systems. Use them as your sandbox for drills 1–4 below.
Same systems, increasing depth over weeks.

### 1. HR Assistant

- **Lane:** Policy Q&A.
- **Tools:** employee DB lookup, leave calendar.
- **Challenge:** ambiguous questions + compliance constraints.

### 2. Budget Assistant *(if you already have a project, reuse it)*

- **Lane:** multi-turn financial reasoning.
- **Tools:** transaction store, category tagger.
- **Challenge:** context retention across long conversations.

### 3. Dev Assistant *(your ABAP angle)*

- **Lane:** code reasoning.
- **Tools:** repo search, run-tests, type-check.
- **Challenge:** when to call tools vs. reason from context.

---

## Weekly structure

| Day | Focus |
|---|---|
| 1–3 | New sub-areas: concept compression + challenge + solve + audit. One sub-area per day. |
| 4 | Failure review: re-read open entries in `error-log.md`; promote patterns to `decision-trees.md`; rebuild one challenge from scratch. |
| 5 | Full mock exam (60 questions, 120 min) + 4-phase audit. |
| 6 | Deep dive on the weakest sub-area surfaced by the mock. |
| 7 | Light review: skim `decision-trees.md`, consolidate `error-log.md` (archive resolved entries), update `README.md` status. |

---

## High-impact drills (run weekly, rotate)

### Drill 1 — Prompt minimalism

Solve the same problem with three budgets:
- 300 tokens (baseline)
- 150 tokens (forces priority)
- 75 tokens (forces ruthlessness)

What survives at 75 tokens is the actual instruction; everything else is
ornament.

### Drill 2 — Adversarial input

Break your own system intentionally:
- Conflicting instructions between system and user
- Missing context (a key constraint removed)
- Malicious-looking input that's actually legitimate

Document how the system fails. Fix the design, not the symptoms.

### Drill 3 — Determinism

Force structured outputs (JSON / tool-use). Eliminate ambiguity. Run 20
times. Measure inconsistency. Iterate the schema.

### Drill 4 — "Why this fails"

Take a known-good solution. Intentionally degrade it (worse prompt, weaker
tool, smaller context). Predict the failure mode in writing **before**
running it. Then run it and check.

The drill trains the most exam-relevant skill: predicting failure from
design alone.

---

## What will actually make you pass

Not:
- Number of questions practiced
- Hours logged
- Notes written

But:
- Ability to **explain why one approach is better** in one sentence
- Ability to **predict the failure mode** of a degraded design
- Ability to **pick the simplest correct solution** under time pressure

---

## Final gap (your tendency to watch out for)

Pattern observed: deep technical background → tendency to:

- Go deep when shallow is correct
- Over-engineer when configuration would do
- Optimize early when "good enough now" is the right answer

Counter-rule for this exam:

> **The simplest correct solution that respects the named constraints wins.**
> Elaborate constructions are a distractor signature.

When you find yourself reaching for an elegant elaborate answer, stop and
ask: *what would the boring answer be?* If it satisfies the constraints,
it's almost certainly the right pick.
