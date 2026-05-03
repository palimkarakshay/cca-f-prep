# @ccafp/importer

Ingests the markdown study repo into a JSON payload that mirrors the
`@ccafp/db` schema row-for-row. The Phase 0.2 web app (or a `db:apply` script)
turns the JSON into `INSERT … ON CONFLICT` SQL.

## Why JSON, not direct DB writes

- Same artifact reviewable in PRs.
- Deterministic: parser bug = visible diff.
- Decouples the markdown → row mapping from any specific DB driver.
- Lets us swap Supabase for anything else later without touching the parser.

## Run

```sh
pnpm --filter @ccafp/importer cli -- --root ../.. --out import.json
# or, from repo root:
pnpm import -- --root . --out import.json
```

## What it parses

| Source | Mapped to |
|---|---|
| `README.md` H1 | `content_pack.title` |
| `README.md` "## Layout" bullets | `domain.slug`, `domain.title`, `domain.weight_pct` |
| `CLAUDE.md` "Passing scaled score: N" | `content_pack.passing_score` |
| `<domain>/notes.md` | `domain.notes_md` |
| `<domain>/challenges/*.md` | `challenge` rows |
| `<domain>/solutions/<file>.md` | `solution` rows (paired by filename) |
| `full-mock-exams/*.md` | `mock_exam` row + linked `mcq` rows |
| `full-mock-exams/solutions/*.md` | merged into the corresponding `mcq` rows |

## Format the importer expects

MCQ block (`full-mock-exams/<slug>.md`):
```
## Q1 — <title>

<stem paragraphs>

<question line ending with ?>

- A. <option text>
- B. <option text>
- C. <option text>
- D. <option text>

**My answer:** _______
```

Solution block (`full-mock-exams/solutions/<slug>.md`):
```
## Q1 — <title>

**Correct: B**

- A — <rationale>
- **B — <rationale>**
- C — <rationale>
- D — <rationale>

**Principle:** <text>

**Domain:** 1 — <Domain Title> → sub-area "<sub-area>."
```

## Tests

```sh
pnpm --filter @ccafp/importer test
```

Two suites:
- `parser.test.ts` — fixture-based unit tests for each parser function.
- `importer.test.ts` — runs the importer against the real repo and asserts the
  shape (1 pack, 5 domains, 1 mock exam, 10 MCQs, every MCQ resolved).
