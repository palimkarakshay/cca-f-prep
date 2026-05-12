# CCA-F Prep

Study material and practice for the Anthropic Claude Certified Architect –
Foundations (CCA-F) exam.

> **The repo also hosts a live learning-app shell under `web/`.** It is
> branded **Curio** for consumers and **Adept** for B2B (the designer
> lane). CCA-F is one of several content packs the shell delivers;
> others include `learn-french`, `sewing-beginners`, `acme-onboarding`,
> `workplace-comms`, `security-awareness`, and `new-manager-basics`.
> See [`web/README.md`](web/README.md) for the architecture, the
> two-lane home page, and the SME workbench. Vercel auto-deploys
> `web/` on every push to `main`.
>
> **Live product roadmap.** The commercialization plan for `web/` is
> [`plans/commercialization-readiness-plan.md`](plans/commercialization-readiness-plan.md)
> (the implementation lens — file paths, effort, immediate wins,
> v0.1→v0.5 sequencing). The business shape it implements is
> [`plans/v2-scaled-b2b-plan.md`](plans/v2-scaled-b2b-plan.md). The
> hostile review that produced both is in
> [`plans/business-viability-negative-study.md`](plans/business-viability-negative-study.md)
> with the response in
> [`plans/business-viability-mitigation-plan.md`](plans/business-viability-mitigation-plan.md).

## Layout

| Folder | Purpose | Exam weight |
|---|---|---|
| `00-academy-basics/` | foundation track from the 9 [Anthropic Academy](https://anthropic.skilljar.com/) courses — per-course notes, atomic B-skill checklist, basics diagnostic, transition plan | foundation |
| `01-agentic-architecture/` | agentic loops, coordinator-subagent, hook lifecycle, bounded loops & session budget | 27% |
| `02-claude-code/` | CLAUDE.md hygiene, settings.json, slash commands, hooks vs. memory vs. CLAUDE.md | 20% |
| `03-tool-design-mcp/` | tool descriptions, MCP transports (stdio / Streamable HTTP), schema design | 18% |
| `04-prompt-engineering/` | system vs. user, few-shot as turns, structured output / tool use | 20% |
| `05-context-reliability/` | context windows, prompt caching, batching, retries | 15% |
| `06-failure-analysis/` | running error log + F-code cognitive failure-mode taxonomy | — |
| `07-mock-exams/` | full-length practice exams (diagnostic-01 + parallel `solutions/`) | — |
| `08-cheat-sheets/` | When-to decision trees + training methodology (with phase model + interleaving) | — |
| `09-progress-tracker/` | skills matrix (B-skills + architect sub-areas with calibration gap), weekly history snapshots, spaced-review queue | — |
| `docs/` | single-file MCQ runner, served via GitHub Pages (`/docs` source) | — |
| `plans/` | commercialization roadmap (canonical: `commercialization-readiness-plan.md` + `v2-scaled-b2b-plan.md`), hostile review, mitigations, decision log; retired tracks under `archive-2026-05-04/` | — |
| `web/` | Curio / Adept Next.js learning-app shell + swappable content packs (the live product) | — |

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

**Active path: Path B — mastery-learning / gap-driven** (recommended for
this learner profile; rationale in [`00-academy-basics/transition-plan.md`](00-academy-basics/transition-plan.md)
§ "Two paths").

- [x] Diagnostic-01 (architect-level) taken — scored 3/10 cold (2026-05-01)
- [ ] Basics diagnostic (15 Q) — cold attempt, seeds B-skill ratings
- [ ] Skip courses where measured ≥ 3; remediate only the gaps
- [ ] Daily drill: 30% basics gap remediation + 70% architect-shape (B-tagged) — interleaved
- [ ] Basics diagnostic re-take ≥ 12 / 15 (sanity check, not a gate)
- [ ] Mock 1 + Mock 2 (Phase D), target ≥ 78%, calibration gap ≤ 0.5

### Content completeness — be honest

The layout table above describes the **target shape**. Today's reality
(self-audit, 2026-05-02):

| Area | Status |
|---|---|
| `00-academy-basics/` notes + skills checklist + diagnostic | **Complete and usable** |
| `06-failure-analysis/error-log.md` | One worked exemplar; pattern-promotion rule untriggered |
| `07-mock-exams/diagnostic-01.md` | Single 10-Q diagnostic; no full-length 60-Q mocks yet |
| `08-cheat-sheets/` | Decision trees, training methodology, external resources — complete |
| `01-agentic-architecture/` … `05-context-reliability/` | **Empty** (`.gitkeep` only). No `notes.md`, no `mcq-set-N.md`, no challenges, no solutions. To be authored. |
| `docs/` MCQ runner | Basics layer populated; architect-tier stubbed pending the above |

**Implication:** the daily-loop and Phase C/D gates in `training-methodology.md`
cannot run until the architect-tier domain folders are populated. The
foundation track (Phase A→B) *can* run today on the basics content alone.
Don't read the layout table as a claim that all of this exists; read it
as a contract for what gets authored next.

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
