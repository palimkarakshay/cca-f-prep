# CCA-F Prep

Study material and practice for the Anthropic Claude Certified Architect –
Foundations (CCA-F) exam.

## Layout

| Folder | Purpose | Exam weight |
|---|---|---|
| `00-academy-basics/` | foundation track from the 9 [Anthropic Academy](https://anthropic.skilljar.com/) courses — per-course notes, atomic B-skill checklist, basics diagnostic, transition plan | foundation |
| `01-agentic-architecture/` | agentic loops, coordinator-subagent, hook lifecycle, bounded loops & session budget | 27% |
| `02-claude-code/` | CLAUDE.md hygiene, settings.json, slash commands, hooks vs. memory vs. CLAUDE.md | 20% |
| `03-tool-design-mcp/` | tool descriptions, MCP transports (stdio / HTTP+SSE), schema design | 18% |
| `04-prompt-engineering/` | system vs. user, few-shot as turns, structured output / tool use | 20% |
| `05-context-reliability/` | context windows, prompt caching, batching, retries | 15% |
| `06-failure-analysis/` | running error log + F-code cognitive failure-mode taxonomy | — |
| `07-mock-exams/` | full-length practice exams (diagnostic-01 + parallel `solutions/`) | — |
| `08-cheat-sheets/` | When-to decision trees + training methodology (with phase model + interleaving) | — |
| `09-progress-tracker/` | skills matrix (B-skills + architect sub-areas with calibration gap), weekly history snapshots, spaced-review queue | — |
| `docs/` | single-file MCQ runner, served via GitHub Pages (`/docs` source) | — |

## How to use

Daily loop (60–90 min) — see [`08-cheat-sheets/training-methodology.md`](08-cheat-sheets/training-methodology.md):

1. **Concept compression** (15–20 min, **no AI**) — write 5 principles + 2 failure modes + 1 use case from memory.
2. **Challenge** (Claude-generated tradeoff scenario, no inline solution) — save under `0X-domain/challenges/`.
3. **Solve without Claude** (15–20 min, **no AI**) — write your design + explicit reasoning trail.
4. **Claude audit** — log gaps in [`06-failure-analysis/error-log.md`](06-failure-analysis/error-log.md) with F-codes.

Weekly: full mock exam (60 questions, 120 min) + 4-phase audit
(timed → self-grade → Claude audit → rewrite incorrect from scratch).

## Reference reading order

When a session needs context, start here:

1. [`CLAUDE.md`](CLAUDE.md) — repo charter, exam structure, authoring conventions.
2. [`00-academy-basics/transition-plan.md`](00-academy-basics/transition-plan.md) — Phase A→D pathway from basics to architect.
3. [`08-cheat-sheets/training-methodology.md`](08-cheat-sheets/training-methodology.md) — daily loop, mock phases, drills, interleaving rule.
4. [`08-cheat-sheets/decision-trees.md`](08-cheat-sheets/decision-trees.md) — When-to trees + running defaults.
5. [`09-progress-tracker/skills-matrix.md`](09-progress-tracker/skills-matrix.md) — current ratings + calibration gap.
6. [`06-failure-analysis/error-log.md`](06-failure-analysis/error-log.md) — open misses + F-code patterns.

## Status

- [x] Diagnostic-01 (architect-level) taken — scored 3/10 cold (2026-05-01)
- [ ] **Phase A — Basics intake** — 9 Anthropic Academy courses + per-course recall + skills-matrix seeding
- [ ] Basics diagnostic (15 Q) — first attempt, calibration seed
- [ ] **Phase B — Bridge** — worked-example fading on architect-shape MCQs, all B-skills measured ≥ 3
- [ ] Basics diagnostic re-take ≥ 12 / 15 (pass-gate to Phase C)
- [ ] **Phase C — Architect drilling** (Domains 1–5; daily loop; B-tagged challenges)
- [ ] **Phase D — Mock cycle** — Mock 1 + Mock 2, target ≥ 78%, calibration gap ≤ 0.5

## Real-world example bank

This repo treats [`palimkarakshay/lumivara-site`](https://github.com/palimkarakshay/lumivara-site)
as a production reference. Its `CLAUDE.md` + `AGENTS.md` are textbook
examples for:

- **Domain 1** — coordinator-subagent split (planner / executor workflows),
  session-budget watermarks (`BUDGET: 80%, exiting cleanly` and
  `BUDGET: 95%, hard exit`).
- **Domain 2** — CLAUDE.md hygiene (`@AGENTS.md` include + `docs/_deprecated/`
  archive), hooks vs. memory enforcement boundary, AI routing tables.
- **Domain 3** — tool description quality patterns and lane-aware tool
  carve-outs.
