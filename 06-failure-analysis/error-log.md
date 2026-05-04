# Error Log

> Track every miss. The point isn't to feel bad — it's to make the same
> mistake **structurally impossible** next time.

## Schema

Every entry has four fields. Skip none. The Prevention rule is the only one
that does work for you next session.

| Field | What it answers |
|---|---|
| **Mistake** | What I picked, what was correct, where it happened |
| **Why it happened** | Cognitive failure mode (use a code from the taxonomy below) |
| **Correct principle** | The exam-grade rationale, named in one sentence |
| **Prevention rule** | A heuristic I will run *next* time before answering |

## Cognitive failure-mode taxonomy

| Code | Name | Looks like |
|---|---|---|
| F1 | **Distractor lure** | Picked the most creative-sounding option (often D). Felt clever. |
| F2 | **Compression reflex** | Reached for "summarize / shrink / compress" when the answer was restructure. |
| F3 | **Mechanism gap** | Knew the platform feature exists but missed *when* to use it. |
| F4 | **Rationale gap** | Knew the right *what* but couldn't explain *why* it dominated alternatives. |
| F5 | **Fabricated rule** | Picked an option asserting a non-existent rule, threshold, or guarantee. |
| F6 | **Closed-list miss** | Picked an option outside the protocol's actual options (WebSockets, gRPC for MCP, etc.). |
| F7 | **Misread scenario** | Did not extract the constraint that disambiguated the answer. |
| F8 | **Over-engineered** | Picked the elaborate option when the simplest correct answer was obvious. |
| F9 | **Calibration miss (JOL > outcome)** | "Felt I knew it; got it wrong." High judgment-of-learning, low actual recall. |
| F10 | **Transfer failure (near vs far)** | Knew the principle in the practice format; missed it in the scenario format. |
| F11 | **Fluency illusion** | Re-read it and felt fluent; couldn't recall it cold. |
| F12 | **Cue-bias / surface-feature bias** | Selected on a non-content cue (B-letter bias, option length, "all of the above" pattern). |

When a code repeats across ≥3 misses, **promote it** to a rule on the
[`08-cheat-sheets/decision-trees.md`](../08-cheat-sheets/decision-trees.md)
"how I default" section, append it to the calibration-Δ column in
[`09-progress-tracker/skills-matrix.md`](../09-progress-tracker/skills-matrix.md),
and wire it into the next mock exam's pre-flight.

## Mechanism × code crosswalk

Each failure mode has a known cognitive mechanism and a standard
remediation. Use this crosswalk when promoting a code to
`decision-trees.md` or when diagnosing a fresh miss.

| Code | Cognitive mechanism | Research source | Standard remediation |
|---|---|---|---|
| F1 | Salience / availability heuristic | Tversky & Kahneman 1973 | Boring beats clever — pick the most boundary-respecting option. |
| F2 | Lossy-summarisation default | Sweller cognitive-load (intrinsic vs extraneous) | Ask first whether *moving* with full fidelity solves the same problem. |
| F3 | Procedural-knowledge gap | Anderson ACT-R | Re-derive the lifecycle in the margin before answering. |
| F4 | Declarative-without-conditional knowledge | Anderson; Bloom revised (Apply ≠ Analyse) | Force a one-sentence "why this dominates the alternative" justification. |
| F5 | Plausibility heuristic without source check | Kahneman fast-thinking | Treat numeric thresholds as distractors unless the source spec is named. |
| F6 | Set-membership / closed-list error | — | Cross out non-canonical options on first read. |
| F7 | Reading-for-gist failure | Kintsch construction-integration | Underline the disambiguating constraint before considering options. |
| F8 | Confirmation / sunk-cost on first plausible elaborate answer | — | Default to the boring answer; ask what configuration / description change would solve. |
| F9 | Judgment-of-learning miscalibration | Dunlosky & Bjork; Kruger & Dunning 1999 | Reset spaced-review schedule; force re-derivation under no-rereading rule. |
| F10 | Encoding-specificity / transfer-appropriate-processing failure | Barnett & Ceci 2002; Tulving | Re-author the concept with a varied surface scenario; interleave on next session. |
| F11 | Stability-vs-fluency illusion | Bjork & Bjork 2011 | Ban re-read; force a write-from-blank session before next attempt. |
| F12 | Spurious cue-validity | — (closes `letter-bias-2026-05` as a committed code) | Rewrite the question's distractors to control surface features; do not re-show until rebalanced. |

---

## Entries

### 2026-05-01 — `07-mock-exams/diagnostic-01.md` — score 3/10

**Aggregate observations:**

- 5 of 7 misses chose option **D** → strong **F1 (distractor lure)**.
- 2 of 7 misses chose a **compression** answer (Q4, Q9) → **F2 (compression reflex)**.
- All 3 hits were **platform mechanisms** (hooks, schemas, caching). All 7 misses were **architectural rationale**. → systemic **F4 (rationale gap)**.

#### Q1 — Coordinator-subagent rationale
- **Mistake**: Picked D ("required when >10 tools"). Correct: B (parallelism + context isolation).
- **Why**: F5 (fabricated rule) + F1 (distractor lure). Locked onto an option that asserted a definite-sounding numeric threshold.
- **Correct principle**: Coordinator-subagent is triggered by (a) parallelizable independent work or (b) need to keep intermediate scratch out of the parent. There is no tool-count threshold.
- **Prevention rule**: When an option asserts a specific numeric threshold (`>N tools`, `≥M turns`, `at least K`), treat it as a distractor unless I can name the source spec.

#### Q2 — Hook event placement
- **Mistake**: Picked A (SessionStart). Correct: B (PreToolUse).
- **Why**: F3 (mechanism gap). Could not place the hook events on the lifecycle.
- **Correct principle**: PreToolUse is the only event that fires before each tool call and can return a blocking decision. SessionStart fires once at boot with no per-call context.
- **Prevention rule**: On any hook question, write the firing order in the margin first: `SessionStart → PreToolUse → [tool runs] → PostToolUse → Stop`. Then match the requirement to the right point.

#### Q3 — Runaway agentic loop
- **Mistake**: Picked D ("disable the test-running tool"). Correct: B (80%/95% watermark exit).
- **Why**: F1 (distractor lure) + F8 (over-engineered). The "disable a tool" answer felt clever; the watermark felt boring.
- **Correct principle**: Bounded loops with self-pacing watermarks (~80% commit + clean exit, ~95% hard exit). A clean exit is success, not failure.
- **Prevention rule**: For any "agent is stuck / looping / over budget" question, default to the watermark/exit answer. Removing tools or changing models mid-run is rarely the recognized pattern.

#### Q4 — CLAUDE.md hygiene
- **Mistake**: Picked D (LLM-summarize and overwrite). Correct: B (move to `reference/`, `@`-include only what is binding).
- **Why**: F2 (compression reflex). Defaulted to "shrink it" when the bug was structural.
- **Correct principle**: `CLAUDE.md` is RAM, not a database. Move historical content to disk; preserve fidelity by relocation, not summarization.
- **Prevention rule**: Before picking a "compress / summarize / shrink" answer, ask: *would moving the content to a different location with the same fidelity also solve this?* If yes, that's almost always the right answer.

#### Q6 — MCP transport choice
- **Mistake**: Picked C (WebSockets). Correct: B (`stdio`).
- **Why**: F6 (closed-list miss). MCP only supports `stdio` and `HTTP+SSE`. WebSockets/gRPC are not MCP transports.
- **Correct principle**: MCP transport = `stdio` for local single-user, `HTTP+SSE` for remote / multi-user. Closed list.
- **Prevention rule**: For MCP transport questions, only `stdio` and `HTTP+SSE` are valid answers. Cross out the others on first read.

#### Q7 — Tool description quality
- **Mistake**: Picked D ("merge into one tool with mode param"). Correct: B (rewrite descriptions with scope, input shape, ideal use).
- **Why**: F1 (distractor lure) + F8 (over-engineered). Reaching for an API redesign when the fix was a few lines of description.
- **Correct principle**: When the model picks the wrong tool, *the tool's description* is the first thing to fix. Renames, system-prompt nudges, and tool merges are second-order.
- **Prevention rule**: For any "model picks the wrong tool / wrong action" question, default to fixing the tool description first. Only escalate to API changes if the descriptions are already maximally differentiated.

#### Q9 — Few-shot placement
- **Mistake**: Picked D (compress examples with bullet points). Correct: B (alternating user/assistant turns).
- **Why**: F2 (compression reflex), again.
- **Correct principle**: Few-shots work best as alternating `user` / `assistant` turns because that matches Claude's training distribution. Inline text examples teach less.
- **Prevention rule**: For any "few-shot is inconsistent" question, the structural answer (turn shape) beats the size answer (compression). Default away from compression.

---

## How to use this log

1. **After every misses session** (diagnostic, mock, drill), add an entry per
   miss using the four-field schema. No skipping.
2. **Skim open entries before each next session.** Not the full log — just
   the Prevention rules. They prime your defaults.
3. **Promote repeating codes.** When the same F-code appears across ≥3
   misses, lift the pattern into
   [`08-cheat-sheets/decision-trees.md`](../08-cheat-sheets/decision-trees.md),
   append it to the calibration-Δ column in
   [`09-progress-tracker/skills-matrix.md`](../09-progress-tracker/skills-matrix.md),
   and add a pre-flight check to the next mock exam.
4. **Archive solved entries.** When a Prevention rule has held across 3
   consecutive sessions on that sub-area, move the entry into a
   `_resolved/` subsection (or strike it through). Don't delete — the trail
   is the diagnostic record.
5. **The log is yours, not Claude's.** Hand-write entries. The whole point
   is the deliberate noticing.
