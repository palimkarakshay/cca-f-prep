# Training Methodology

> The exam tests **judgment**, not recall. This file is the operating manual
> that turns study time into judgment. Don't skim — these patterns are how
> you compound.

---

## Phase model (basics → architect)

Before you run any of the daily-loop content below, place yourself in
the right phase. Defined in [`../00-academy-basics/transition-plan.md`](../00-academy-basics/transition-plan.md):

| Phase | What | Exit gate |
|---|---|---|
| **A — Intake** | Take Academy courses; read terse notes; recall prompts; generation drill | All B-skills self-rated ≥ 2; basics diagnostic seeded |
| **B — Bridge** | Worked-example fading (rung 1→2→3) on architect-shape MCQs, interleaved across B-skills | All B-skills measured ≥ 3; calibration gap ≤ 1; diagnostic re-take ≥ 12/15 |
| **C — Architect drill** | The daily loop below, with B-tagged challenges + predict-then-test | All sub-areas measured ≥ 3; calibration gap ≤ 1 |
| **D — Mock cycle** | Two full mocks + 4-phase audit | Mock ≥ 78%; calibration gap ≤ 0.5; no F-code repeating ≥ 3 in past 7d |

The daily-loop and weekly-structure sections below describe **Phase C**.
For Phases A and B, the cadence is in the transition-plan.

---

## Five learning principles in use

These names show up across the rest of the document. Reference, not
ornament.

- **Andragogy (Knowles 1973)** — self-directed, problem-centered, anchored
  to existing engineering experience.
- **Bloom (revised — Anderson & Krathwohl 2001)** — Remember → Understand →
  Apply → Analyze → Evaluate. The exam tests Analyze/Evaluate. Drill at
  one rung above current rating; don't drill MCQs at Apply when you're
  still at Understand on the underlying skill.
- **Cognitive Load Theory (Sweller, van Merriënboer & Paas 2019)** —
  *worked-example fading*: fully-worked → partial → solo, three rungs.
  Cutover to problem-solving once intermediate (expertise-reversal —
  Kalyuga 2003).
- **Desirable Difficulties (Bjork & Bjork 2011)** — *spaced retrieval*
  (1d, 3d, 7d, 14d) per Cepeda et al. 2008, *interleaving* across domains
  (Rohrer & Taylor 2007), *generation* before reading (Slamecka & Graf
  1978). Easy study feels productive and isn't.
- **Deliberate Practice (Ericsson 1993)** — every drill names a target
  B-skill, has a feedback channel (mock %, error-log, calibration gap),
  and forces revision.

---

## Learner-absorption mechanics (research → repo lever)

These are the six evidence-based mechanics this methodology operationalises.
Each maps a cited cognitive-psychology finding to the repo lever that
implements it. When in doubt about which intervention to apply, route
through this table.

| # | Mechanic | Repo lever | Cited evidence |
|---|---|---|---|
| LM1 | **Spaced retrieval** (expanding interval 1/3/7/14/30d, leech rule on 3+ misses) | Surface `09-progress-tracker/spaced-review.md` queue as a dashboard banner; "no new sub-area until queue clear" rule (see Weekly structure). | Cepeda et al. 2008 (*Psych Sci*); Cepeda 2006 (254-study meta); Murre & Dros 2015 (Ebbinghaus replication). |
| LM2 | **Retrieval > re-reading** (mid-lesson 1-Q recall before "next" unlocks) | Lesson-depth toggle is opt-out, not default; reveal gated on attempted recall. | Roediger & Karpicke 2006; Karpicke & Blunt 2011 (*Science*). |
| LM3 | **Generation effect** (write-the-principle before reveal) | Predict-then-test (Step 5 below) becomes a typed field, not a mental note. | Slamecka & Graf 1978. |
| LM4 | **Interleaving** (rotate ≥2 sub-areas per session) | Weekly-structure days 1–3 enforce interleaving; recommender prefers a *different* sub-area than the last one drilled. | Rohrer & Taylor 2007 (63% shuffled vs 20% blocked at 1-week delayed test). |
| LM5 | **Worked-example fading + expertise-reversal cutover** | Phase model (A → B → C → D); rung-3 (Proficient) triggers cutover from worked to solo. | Sweller, van Merriënboer & Paas 2019; Kalyuga 2003. |
| LM6 | **Calibration capture** (JOL pre-answer, Δ tracked in skills-matrix) | New "Calibration loop" section below; skills-matrix `Gap` column reused as calibration Δ. | Dunlosky & Bjork (handbook of metamemory); Kruger & Dunning 1999. |

Cohort-side mechanics (LM7 streak/variable-reward and LM8 cohort/SDT-
relatedness) live in the platform plan (`plans/content-pack-management-plan.md`
§ D1) — they are product surfaces, not solo-study mechanics. They appear
here only as a cross-reference: when a learner is part of a cohort, LM7/LM8
amplify the LM1–LM6 effect sizes.

---

## Calibration loop (predict-then-test, instrumented)

Step 5 below ("Predict-then-test") is the most exam-relevant feedback signal
in this methodology. The instrumented form turns the prediction into a
*captured metric* so calibration becomes trainable.

For each predict-then-test cycle:

1. Before reading the solution, write your **judgment-of-learning (JOL)**
   on a 1–5 scale: how confident are you in your pick, on a forced choice
   between *guess (1)* and *certain (5)*?
2. Read the solution. Record the outcome: pass / fail.
3. Compute **calibration Δ** = JOL_normalised − outcome_normalised, where
   both are scaled to the 0–4 mastery axis used in
   `09-progress-tracker/skills-matrix.md`. Write the value into the
   `Gap` column of the matrix (which IS the calibration Δ — see
   skills-matrix.md § "Calibration delta").
4. Trigger the remediation rule from skills-matrix: |Δ| > 1 forces a
   generation-effect drill (Slamecka & Graf 1978) at +1d, regardless of
   pass/fail. Δ > 1 is the classic Dunning-Kruger zone (Kruger & Dunning
   1999); Δ < −1 is an expertise-reversal candidate (Kalyuga 2003).

The calibration Δ is what the exam *actually* tests when it tests
"judgment". Closing it is the goal; pass-rate is the proxy.

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

Log the gaps in `06-failure-analysis/error-log.md` using the F-code
taxonomy **and the responsible B-code** (from `00-academy-basics/skills-checklist.md`).
A miss on a B-tagged challenge demotes that B-skill back to rung 2 in
`09-progress-tracker/skills-matrix.md` and reschedules a +1d
spaced-review entry.

If a new pattern emerges across ≥3 audits, promote it to
`08-cheat-sheets/decision-trees.md` § "How I default."

### Step 5 — Predict-then-test (before reading the solution)

Before reading the model solution, write down:

- Your pick + the **one-sentence principle** you used to pick it.
- For each distractor: the F-code or B-skill failure mode that makes it
  wrong.

*Then* read the solution. The gap between your prediction and the key
is the most exam-relevant feedback signal — predicting failure from
design alone is what the exam tests.

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
- MCP transport: `stdio` (local single-user) vs. `Streamable HTTP` (remote/multi-user; "HTTP+SSE" in older docs)

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
| 0 (start) | Run any due items from `09-progress-tracker/spaced-review.md`. **Hard rule:** if the queue has ≥1 item due, no new sub-area until the queue is cleared. Spacing precedes acquisition (Bjork). Update matrix. |
| 1–3 | New sub-areas: concept compression + challenge + solve + audit. **Interleave** — rotate 2 different sub-areas per day, don't single-track. |
| 4 | Failure review: re-read open entries in `error-log.md`; promote patterns to `decision-trees.md`; rebuild one challenge from scratch. |
| 5 | Full mock exam (60 questions, 120 min) + 4-phase audit. |
| 6 | Deep dive on the weakest sub-area surfaced by the mock — and on the lowest-rated **B-skills** feeding it. |
| 7 | Light review: skim `decision-trees.md`, consolidate `error-log.md` (archive resolved entries), update `README.md` status, **snapshot `09-progress-tracker/skills-matrix.md` to `history.md`**. |

**Interleaving rule (not optional).** Within any day, rotate at least
two non-adjacent sub-areas / B-skills. Blocked practice (one topic to
exhaustion) feels productive in the moment and transfers ~30% worse on
the exam — Bjork's desirable-difficulties effect. The deliberate
roughness *is* the practice.

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

## Final gap (architect blind spot)

Treat the over-engineering tendency below as a **calibration miscalibration
symptom** — a JOL > outcome pattern (see § Calibration loop above and
F9 in `06-failure-analysis/error-log.md`). The remediation is the same:
generation-effect drill + force re-derivation under the boring-answer
rule.



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
