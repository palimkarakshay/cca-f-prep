# CCA-F Prep

Study material and practice for the Anthropic Claude Certified Architect –
Foundations (CCA-F) exam.

## Layout
- `01-agentic-architecture/` — agentic loops, coordinator-subagent, hooks (27%)
- `02-claude-code/` — CLAUDE.md, slash commands, configuration (20%)
- `03-tool-design-mcp/` — tool descriptions, MCP servers (18%)
- `04-prompt-engineering/` — system prompts, structured output (20%)
- `05-context-reliability/` — context windows, batching, retries (15%)
- `full-mock-exams/` — 60-question practice exams
- `reference/` — glossary, cheatsheets, decision trees

## How to use
1. Read `notes.md` in a domain folder.
2. Attempt MCQs in `mcq-set-N.md` without peeking at solutions.
3. Try challenges under `challenges/` before checking `solutions/`.
4. Take a full mock exam from `full-mock-exams/` once per domain feels solid.

## Status
- [ ] Domain 1 notes
- [ ] Domain 2 notes
- [ ] Domain 3 notes
- [ ] Domain 4 notes
- [ ] Domain 5 notes
- [ ] Mock exam 1
- [ ] Mock exam 2

## Platform packages

This repo is also the source-of-truth for content delivered by a learning
platform. Markdown stays canonical; an importer projects it into a Postgres
schema for the web app.

- `packages/db/` — Supabase migrations (`@ccafp/db`).
- `packages/importer/` — markdown → JSON ingester (`@ccafp/importer`).

```sh
pnpm install
pnpm test                                 # run all package tests
pnpm ingest --root . --out import.json    # ingest this repo into JSON
```

See `packages/importer/README.md` for the expected MCQ / solution markdown
format (already what this repo uses) and `packages/db/README.md` for the
schema and free-launch entitlements posture.
