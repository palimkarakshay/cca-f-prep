# Skills Matrix

> Single source of truth. Update at the end of every study session.
> Rubric and calibration rules in [`README.md`](README.md).

Last full snapshot to `history.md`: _(none yet)_

Legend: `–` = not yet rated. Evidence column links to a mock,
challenge, or error-log entry. **Gap is the calibration Δ — see
§ "Calibration delta" below.** Computed as `self − measured`, normalised
to the 0–4 mastery axis. Not free-typed.

---

## Calibration delta — definition and remediation

**Definition.** Calibration Δ = (avg self-rating, 0–4) − (measured
pass-rate normalised to 0–4). The existing `Gap` column in every section
table below IS the calibration Δ; the column heading is left as `Gap`
for backward compatibility, but every reference downstream
(`08-cheat-sheets/training-methodology.md`, `09-progress-tracker/spaced-review.md`,
`06-failure-analysis/error-log.md`) calls it calibration Δ.

**Why this matters.** Re-reading produces a *fluency illusion*:
high judgment-of-learning, low actual recall (Bjork & Bjork 2011;
Dunlosky & Bjork). The classic Dunning-Kruger result (Kruger & Dunning
1999) is that low performers over-estimate competence; the
expertise-reversal effect (Kalyuga 2003) is that high performers
under-estimate it once they've internalised the schema. The exam tests
*judgment*, which is calibration. Closing |Δ| is the goal; pass-rate is
the proxy.

**Remediation rules** (|Δ| > 1 triggers; |Δ| ≤ 0.5 is the Phase-D exit
gate per `training-methodology.md`):

- **Δ > 1 (over-confident, classic Dunning-Kruger zone)** — force a
  generation-effect drill (Slamecka & Graf 1978): blank-page recall
  + one-sentence principle naming; repeat at +1d via spaced-review
  queue. F-codes typically firing: F9 (calibration miss),
  F11 (fluency illusion). The calibration miss alone — independent
  of pass/fail — triggers this remediation.
- **Δ < −1 (under-confident, expertise-reversal candidate)** — promote
  to next Bloom rung and run mock at higher difficulty (Kalyuga 2003);
  remove worked-example scaffolding; switch to far-transfer items
  (Barnett & Ceci 2002). Continued under-confidence at the higher rung
  signals the SME-pipeline candidate (consider promoting this learner
  into a content-author seat per `08-cheat-sheets/training-methodology.md`
  § "L-Experience").

**Phase-D exit gate.** All sub-areas measured ≥ 3 with `|Avg gap| ≤ 0.5`
(see Architect summary at the bottom). This is a bidirectional gate —
both Δ > 0.5 (over-confident) and Δ < −0.5 (under-confident) block exit.

---

## Snapshot rule for `history.md`

Every weekly snapshot (per `training-methodology.md` § Weekly structure
day 7) writes the full skills-matrix to `history.md`, **including the
calibration-Δ column**. The point is to track whether deliberate practice
(Ericsson 1993) is closing the gap over time. A flat or widening
calibration-Δ trend is itself a diagnostic signal: the learner is
practising recall but not calibrating against outcomes — which means the
predict-then-test step (`training-methodology.md` Step 5 / Calibration
loop) is being skipped or rushed.



---

## Section 1 — Basics (Anthropic Academy)

### Course 1 — Claude 101

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B1.1 | Project vs RAG corpus | U | – | – | – | – | – |
| B1.2 | Product-tier vs API-level limit | A | – | – | – | – | – |
| B1.3 | Artifact vs inline message | E | – | – | – | – | – |
| B1.4 | Context cost of N file uploads | A | – | – | – | – | – |

### Course 2 — AI Fluency: Framework & Foundations

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B2.1 | Classify failure into a 4D | An | – | – | – | – | – |
| B2.2 | Identify mis-delegation | An | – | – | – | – | – |
| B2.3 | Write a structured description | A | – | – | – | – | – |
| B2.4 | Run description↔discernment iteration | A | – | – | – | – | – |
| B2.5 | Name the diligence concern | E | – | – | – | – | – |

### Course 3 — Building with the Claude API

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B3.1 | Place instruction in system vs user | E | – | – | – | – | – |
| B3.2 | Few-shots as alternating turns | A | – | – | – | – | – |
| B3.3 | Trace tool-use loop / stop_reason | An | – | – | – | – | – |
| B3.4 | Place cache_control marker | E | – | – | – | – | – |
| B3.5 | Tool-schema vs prompt-only structured output | E | – | – | – | – | – |
| B3.6 | Detect system-field leak | An | – | – | – | – | – |

### Course 4 — Introduction to MCP

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B4.1 | Classify tool / resource / prompt | An | – | – | – | – | – |
| B4.2 | stdio vs Streamable HTTP | E | – | – | – | – | – |
| B4.3 | Reject non-MCP transports | R | – | – | – | – | – |
| B4.4 | Diagnose wrong-tool-pick to description | An | – | – | – | – | – |
| B4.5 | Server-per-capability vs monolith | E | – | – | – | – | – |
| B4.6 | Auth at transport, not in tool input | A | – | – | – | – | – |

### Course 5 — Claude Code 101

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B5.1 | Place hook on correct event | A | – | – | – | – | – |
| B5.2 | Predict permission cascade | An | – | – | – | – | – |
| B5.3 | Route rule (CLAUDE.md/skill/hook/etc) | E | – | – | – | – | – |
| B5.4 | Author slash command | A | – | – | – | – | – |

### Course 6 — Claude Code in Action

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B6.1 | Order all hook events | R | – | – | – | – | – |
| B6.2 | Hook vs CLAUDE.md by trust level | E | – | – | – | – | – |
| B6.3 | Predict no-watermark loop failure | An | – | – | – | – | – |
| B6.4 | Subagent vs inline | E | – | – | – | – | – |
| B6.5 | CI surface blast radius | An | – | – | – | – | – |

### Course 7 — Introduction to Agent Skills

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B7.1 | Skill vs slash vs CLAUDE.md vs hook | An | – | – | – | – | – |
| B7.2 | Critique skill description | E | – | – | – | – | – |
| B7.3 | Place skill (project/user/plugin) | A | – | – | – | – | – |
| B7.4 | Detect kitchen-sink skill | An | – | – | – | – | – |

### Course 8 — Introduction to Subagents

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B8.1 | Two valid spawn triggers | R | – | – | – | – | – |
| B8.2 | Critique underbriefed prompt | E | – | – | – | – | – |
| B8.3 | Cost of unnecessary splits | An | – | – | – | – | – |
| B8.4 | What parent does NOT see | U | – | – | – | – | – |

### Course 9 — Introduction to Claude Cowork

| Code | Skill | Bloom | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|---|
| B9.1 | Plugin vs skill | U | – | – | – | – | – |
| B9.2 | Add checkpoint cadence | E | – | – | – | – | – |
| B9.3 | Detect set-and-forget | An | – | – | – | – | – |

### Basics summary

| Block | Avg self | Avg measured | Avg gap |
|---|---|---|---|
| Course 1 | – | – | – |
| Course 2 | – | – | – |
| Course 3 | – | – | – |
| Course 4 | – | – | – |
| Course 5 | – | – | – |
| Course 6 | – | – | – |
| Course 7 | – | – | – |
| Course 8 | – | – | – |
| Course 9 | – | – | – |
| **All basics** | – | – | – |

---

## Section 2 — Architect (CCA-F)

Sub-areas mirror the official domain breakdown. Each row links the
relevant B-skills; if any of those are < 3, this row's *measured* is
capped at 2 regardless of mock performance.

### Domain 1 — Agentic Architecture & Orchestration (27%)

| Sub-area | Feeds from | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|
| Agent loop semantics | B5.1, B6.1 | – | – | – | – | – |
| Coordinator-subagent pattern | B6.4, B8.1, B8.2, B8.3, B8.4 | – | – | – | – | – |
| Bounded loops & session budget | B6.3 | – | – | – | – | – |
| Subagent cost & isolation tradeoffs | B8.3, B8.4 | – | – | – | – | – |

### Domain 2 — Claude Code Configuration & Workflows (20%)

| Sub-area | Feeds from | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|
| CLAUDE.md hygiene | B5.3, B7.1 | – | – | – | – | – |
| Hook lifecycle & placement | B5.1, B6.1, B6.2 | – | – | – | – | – |
| Permission cascade | B5.2 | – | – | – | – | – |
| Skills / slash commands / plugins | B7.1, B7.2, B7.3, B7.4, B9.1 | – | – | – | – | – |
| CI / GH Actions surface | B6.5 | – | – | – | – | – |

### Domain 3 — Tool Design & MCP (18%)

| Sub-area | Feeds from | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|
| Tool description quality | B4.4 | – | – | – | – | – |
| MCP transport choice | B4.2, B4.3 | – | – | – | – | – |
| MCP primitive choice | B4.1 | – | – | – | – | – |
| Schema design / structured output | B3.5 | – | – | – | – | – |
| Tool-use loop / stop_reason | B3.3 | – | – | – | – | – |
| Auth boundary | B4.6 | – | – | – | – | – |

### Domain 4 — Prompt Engineering & Structured Output (20%)

| Sub-area | Feeds from | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|
| 4D framework application | B2.1, B2.2 | – | – | – | – | – |
| System vs user role | B3.1 | – | – | – | – | – |
| Few-shot turn structure | B3.2 | – | – | – | – | – |
| Structured output mechanism | B3.5 | – | – | – | – | – |
| Description quality / iteration | B2.3, B2.4 | – | – | – | – | – |

### Domain 5 — Context Management & Reliability (15%)

| Sub-area | Feeds from | Self | Date | Evidence | Measured | Gap |
|---|---|---|---|---|---|---|
| Context window management | B1.1, B1.4 | – | – | – | – | – |
| Prompt caching placement | B3.4 | – | – | – | – | – |
| System leak / cache busting | B3.6 | – | – | – | – | – |
| Watermarks / clean exit | B6.3 | – | – | – | – | – |
| Diligence / oversight cadence | B2.5, B9.2, B9.3 | – | – | – | – | – |

### Architect summary

| Domain | Weight | Avg self | Avg measured | Avg gap |
|---|---|---|---|---|
| D1 Agentic | 27% | – | – | – |
| D2 Claude Code | 20% | – | – | – |
| D3 Tool / MCP | 18% | – | – | – |
| D4 Prompt | 20% | – | – | – |
| D5 Context | 15% | – | – | – |
| **Weighted overall** | 100% | – | – | – |
