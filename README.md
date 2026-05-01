# CCA-F Prep

Study material and practice for the Anthropic Claude Certified Architect –
Foundations (CCA-F) exam.

## Layout

| Folder | Purpose | Exam weight |
|---|---|---|
| `01-agentic-architecture/` | agentic loops, coordinator-subagent, hook lifecycle, bounded loops & session budget | 27% |
| `02-claude-code/` | CLAUDE.md hygiene, settings.json, slash commands, hooks vs. memory vs. CLAUDE.md | 20% |
| `03-tool-design-mcp/` | tool descriptions, MCP transports (stdio / HTTP+SSE), schema design | 18% |
| `04-prompt-engineering/` | system vs. user, few-shot as turns, structured output / tool use | 20% |
| `05-context-reliability/` | context windows, prompt caching, batching, retries | 15% |
| `06-failure-analysis/` | running error log + F-code cognitive failure-mode taxonomy | — |
| `07-mock-exams/` | full-length practice exams (diagnostic-01 + parallel `solutions/`) | — |
| `08-cheat-sheets/` | When-to decision trees + training methodology | — |
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
2. [`08-cheat-sheets/decision-trees.md`](08-cheat-sheets/decision-trees.md) — When-to trees + running defaults.
3. [`08-cheat-sheets/training-methodology.md`](08-cheat-sheets/training-methodology.md) — daily loop, mock phases, drills.
4. [`06-failure-analysis/error-log.md`](06-failure-analysis/error-log.md) — open misses + F-code patterns.

## Status

- [x] Diagnostic-01 taken — scored 3/10 on cold attempt (2026-05-01)
- [ ] Domain 1 (Agentic Architecture, 27%) — notes, then `[no-ai]` challenge, then MCQ set
- [ ] Domain 2 (Claude Code, 20%) — same loop
- [ ] Domain 3 (Tool Design / MCP, 18%) — same loop
- [ ] Domain 4 (Prompt Engineering, 20%) — same loop
- [ ] Domain 5 (Context Reliability, 15%) — same loop
- [ ] Mock exam 1 (60-question, full-length)
- [ ] Mock exam 2 (60-question, full-length)

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
