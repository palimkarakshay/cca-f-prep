# Implementation plan — `validate-pack.ts` static analyzer

> Strategy reference: [`b2b-viability-2026-05.md`](./b2b-viability-2026-05.md) §5
> "Content validation," intervention §5.S. This plan turns that bullet list
> into a buildable PR.
>
> Date: 2026-05-03. Branch (TBD): `claude/validate-pack-static-analyzer`.
> Effort tag: S (one PR, no backend, no schema migration). Estimated
> diff: ~700–1,000 LOC across ~10 new files + 2 modified files.

## Goal

Ship a static analyzer that runs over every content pack in
[`web/content-packs/`](../web/content-packs/) and catches the canonical
quality bugs already observed in the repo (`letter-bias-2026-05`,
`diagnostic-01` spoiler regression in [`CLAUDE.md`](../CLAUDE.md))
plus four adjacent classes of bugs. Wired into CI via a new
`npm run validate:packs` step in [`web/scripts/swap-smoke.sh`](../web/scripts/swap-smoke.sh).
Hard-fails the build on ERROR-severity findings; surfaces WARN/INFO
findings as a human-readable report.

## Scope

### In v1
- Six checks, one rule per check (specs below).
- Iterates every pack under `web/content-packs/` that has an `index.ts`.
- Imports the `ContentPack` object directly (same path the Next.js app
  uses), so checks operate on typed `Curriculum` data, not parsed source.
- Two output modes:
  - **Default:** human-readable report grouped by pack → quiz → finding.
  - **`--json`:** machine-readable for downstream tooling.
- Severity ladder: `ERROR` (exits 1), `WARN` (exits 0, surfaces in
  report), `INFO` (always reported, never affects exit).
- Baseline allowlist: a checked-in `validate-baseline.json` lets us
  ratchet down known violations without blocking unrelated PRs. Mirrors
  how typecheck/lint migrations are typically rolled out.
- Vitest unit tests for each check, using synthetic minimal packs.
- New `npm run validate:packs` script + a tail step in `swap-smoke.sh`.

### Out of v1 (follow-ups)
- Codex rubric extension for review-time pedagogical checks (§5.M
  in the strategy doc — that's a separate PR adding
  `.github/codex-rubric-learning.md`).
- Per-question user-correct-rate telemetry (§5.M, requires backend).
- Validation-report route in the web app (§5.L, requires auth).
- Reading-level / Flesch-Kincaid drift detection (mentioned in the
  strategy as a candidate; deferred — it's noisy without per-pack
  calibration).
- Auto-fix mode. Detection only in v1.

## Architecture decisions

1. **Standalone `tsx` script, not a vitest suite.**
   The strategy doc proposes `scripts/validate-pack.ts` +
   `npm run validate:packs`, and that's the right shape for two
   reasons. (a) It produces a *report* (e.g. letter-distribution
   stats per quiz) that is informational even when checks pass —
   vitest only emits pass/fail. (b) It runs once across all packs,
   not per-test; `swap-smoke.sh` already invokes `npm test` inside
   its per-pack loop, and we don't want to N-multiply the work.
   Adds `tsx` (~3 MB, MIT-licensed, well-maintained) to devDeps.
   Vitest still owns the unit-test layer for the *check functions
   themselves*.

2. **One file per check.**
   Each check function is its own module under
   `web/scripts/checks/<rule>.ts`. Each file exports a pure
   `(pack: ContentPack) => Finding[]` function. Easy to test in
   isolation, easy to add new checks later without touching the
   runner.

3. **Lives in `web/scripts/`, not `web/src/lib/`.**
   Tooling, not runtime. Stays out of the Next.js bundle.

4. **Baseline file checked in, not regenerated on every run.**
   `web/scripts/validate-baseline.json` lists known violations
   (pack-id → finding-key) that are explicitly allowed. The CLI
   reads this and downgrades matching findings from ERROR to INFO
   ("baselined"). A new `--update-baseline` flag rewrites the file —
   used intentionally when an authoring change introduces a known,
   accepted regression.

5. **Findings are structured, not just strings.**
   Every finding carries `{rule, severity, packId, location, message,
   fixHint?}`. Lets us emit JSON and serialize a stable signature
   for the baseline file.

## The six checks — specs

### Check 1: `letter-bias`
Detect over-concentration of the correct MCQ answer on a single letter
within a single quiz / section-test / mock exam. The
`letter-bias-2026-05` entry in `CLAUDE.md` is the canonical example:
"~76% B across 41 concept quizzes."

| Field | Value |
| --- | --- |
| Granularity | Per quiz, per section-test, per mock exam (separately). |
| Trigger | Within a single quiz of `n` MCQs (`n >= 4`), any letter holds > **70%** of the correct answers. |
| Severity | `WARN` (recommend ratcheting to `ERROR` after the next pack-rebalance pass). |
| Skip | Quizzes with `n < 4` MCQs (distribution meaningless). True/false and fill-in questions are excluded from the count. |
| Fix hint | "Rebalance correct-answer letters; aim for [25%, 50%] per letter within a quiz." |

The check also emits one **`INFO`** finding per pack with the *overall*
letter distribution (counts + percentages, all MCQs in the pack). Useful
even when no quiz fails — helps spot pack-wide drift early.

### Check 2: `spoiler-leak`
Detect any answer-format example string in a question's prose that
mirrors the actual answer key. The `diagnostic-01` regression
(`1B 2B 3B 4B 5C 6B 7B 8B 9B 10B`) is the canonical case.

| Field | Value |
| --- | --- |
| Granularity | Per pack — scans all `Question.question` text plus `MockExam.blurb` and `Section.blurb`. |
| Trigger | Regex `/\b\d+[A-D]\b(\s+\d+[A-D]\b){2,}/` finds a >=3-token answer-format string. The check then extracts the letter sequence and compares to the answer key for that quiz/exam (matched by exam id; fallback: matched by length). |
| Severity | `ERROR` if the extracted sequence matches the answer key. `INFO` otherwise (pattern looks like an answer-format example; verify neutrality). |
| Skip | None. |
| Fix hint | "Replace the answer-format example with neutral placeholders, e.g. `1X 2X … 10X`." |

The pack data does not include the markdown source for prompts, but
the regex-style hardening is also worth running against
[`07-mock-exams/`](../07-mock-exams/) markdown files in a follow-up
(noted in §"Out of v1").

### Check 3: `principle-presence`
Per CLAUDE.md authoring conventions: "Each MCQ explanation must name
the principle, not just the answer."

| Field | Value |
| --- | --- |
| Granularity | Per question, MCQ only. |
| Trigger | An MCQ has no `principle` field, or `principle.trim() === ""`. |
| Severity | `WARN` (start permissive — many existing questions might be missing this; ratchet later). |
| Skip | True/false and fill-in questions (no `principle` requirement in the spec). |
| Fix hint | "Add a one-line `principle` summarising the takeaway, not just the right answer." |

### Check 4: `duplicate-questions`
Same question text appearing more than once in a single pack is almost
always a copy/paste authoring bug.

| Field | Value |
| --- | --- |
| Granularity | Per pack — collects all `Question.question` strings, normalises (lowercase, trim, collapse whitespace), groups. |
| Trigger | Any two questions in the same pack share an identical normalised question text. |
| Severity | `ERROR` for exact-after-normalisation duplicates. `WARN` for near-duplicates (Levenshtein distance ≤ 5 on strings of length ≥ 30). |
| Skip | If both occurrences live inside `MockExam.questions` arrays AND a per-pack flag `pack.config.allowMockReuse` is set (not in v1; deferred). |
| Fix hint | "Rewrite one of the duplicates so they probe different aspects of the concept." |

The Levenshtein leg uses a small inline implementation (~30 LOC) — no
new dep. Capped at `n^2/2 = 169^2/2 ≈ 14k` comparisons for the
cca-f-prep pack, runs in well under a second.

### Check 5: `option-length-bias`
Test-writing leak: when the correct option is significantly longer
than its distractors, learners can guess from length without reading.

| Field | Value |
| --- | --- |
| Granularity | Per MCQ. |
| Trigger | `len(options[correct]) > 1.5 * mean(len(options[other 3]))` AND `len(options[correct]) > 60` chars (avoid false positives on short questions). |
| Severity | `WARN`. |
| Skip | True/false and fill-in. |
| Fix hint | "Pad distractors with comparable detail, or trim the correct option, so length is not a tell." |

### Check 6: `bloom-distribution`
For academic packs that opt into the Bloom taxonomy on `Concept.bloom`:
ensure all concepts are tagged (consistency) and that the pack uses
≥2 different levels (variety).

| Field | Value |
| --- | --- |
| Granularity | Per pack. |
| Trigger | A pack has *some* concepts with `bloom` set and *some* without → `WARN` (inconsistent). A pack has all concepts at the same `bloom` level → `WARN` (single-level). |
| Severity | `WARN`. |
| Skip | If **no** concepts have `bloom` set, the pack is non-academic; skip the check entirely. The `sewing-beginners` pack qualifies. |
| Fix hint | "Tag every concept with `bloom`, or remove all `bloom` tags. Spread tags across at least two Bloom levels." |

The Bloom taxonomy values come from `curriculum-types.ts:7` —
`"R" | "U" | "A" | "An" | "E" | "C"`.

## Files to create / modify

### New files (under `web/scripts/`)
- `scripts/validate-pack.ts` — CLI entry point. Parses argv (`--json`,
  `--update-baseline`, `--pack=<id>`), iterates packs, calls each
  check, formats the report, sets exit code.
- `scripts/checks/index.ts` — exports the check registry
  (`{rule, fn, defaultSeverity}[]`).
- `scripts/checks/letter-bias.ts`
- `scripts/checks/spoiler-leak.ts`
- `scripts/checks/principle-presence.ts`
- `scripts/checks/duplicate-questions.ts`
- `scripts/checks/option-length-bias.ts`
- `scripts/checks/bloom-distribution.ts`
- `scripts/checks/_types.ts` — shared `Finding` interface, `Severity`
  enum, `CheckFn` type.
- `scripts/checks/_helpers.ts` — `iterateMcqs(pack)`, `normaliseText`,
  `levenshtein` (inline, no dep), `loadPack(packId)`.
- `scripts/validate-baseline.json` — `{}` initially; populated after
  first real run as the baseline allowlist.
- `scripts/__tests__/letter-bias.test.ts`,
  `spoiler-leak.test.ts`, `principle-presence.test.ts`,
  `duplicate-questions.test.ts`, `option-length-bias.test.ts`,
  `bloom-distribution.test.ts` — vitest unit tests for each check.
- `scripts/__tests__/_synthetic-packs.ts` — minimal `ContentPack`
  fixtures used by the unit tests (one good pack, one bad pack per
  check).
- `scripts/README.md` — short doc describing the validator, how to add
  a new check, how the baseline works.

### Modified files
- `web/package.json`:
  - Add `"validate:packs": "tsx scripts/validate-pack.ts"` to scripts.
  - Add `"tsx": "^4.x"` to devDependencies.
- `web/scripts/swap-smoke.sh`:
  - After the per-pack loop completes, add `npm run validate:packs`
    as a final tail step. If validator exits non-zero, smoke fails.

### Files **not** modified
- No changes to `web/src/content/curriculum-types.ts` or
  `pack-types.ts` — the validator reads existing fields only.
- No changes to any pack's `curriculum.ts` in this PR. Fixing actual
  bias / spoiler findings is a separate follow-up PR per pack.

## Implementation order (within the PR)

Sequenced so each step is independently runnable and testable:

1. **Scaffold + `Finding` type.** Create `_types.ts`,
   `_helpers.ts`, `validate-pack.ts` skeleton that loads all packs and
   prints "no checks yet." Verify `tsx scripts/validate-pack.ts` runs
   end-to-end and lists the three packs.
2. **Check 1 — letter-bias.** Implement check function + vitest
   tests against synthetic packs. Wire into the runner. Verify it
   produces an INFO line with the cca-f-prep pack's letter distribution.
3. **Check 2 — spoiler-leak.** Implement + tests. Run against all
   packs; expect zero ERROR-level findings (the `1X 2X … 10X` neutral
   placeholder fix in `07-mock-exams/diagnostic-01.md` already
   landed; pack data should be clean).
4. **Check 3 — principle-presence.** Implement + tests. Expect a
   nonzero WARN count on existing packs; record the count for the
   PR description.
5. **Check 4 — duplicate-questions.** Implement + tests (incl.
   Levenshtein helper). Run; expect zero ERROR.
6. **Check 5 — option-length-bias.** Implement + tests. Run; record
   WARN count.
7. **Check 6 — bloom-distribution.** Implement + tests. Run; expect
   `sewing-beginners` to be skipped (no `bloom` tags) and
   `cca-f-prep` to pass (the Academy-content scrub note in CLAUDE.md
   confirms all concepts got Bloom tags).
8. **Baseline mechanism.** Add `--update-baseline` flag; populate
   `validate-baseline.json` from the current run. Verify a fresh run
   passes with the baseline applied.
9. **CI wiring.** Add `validate:packs` script. Add tail step to
   `swap-smoke.sh`. Run `npm run smoke:swap` end-to-end locally.
10. **`scripts/README.md`** — short doc explaining how to add new
    checks, the baseline workflow, and severity semantics.

## Test plan

### Unit tests (vitest, runs under `npm test`)
- One test file per check, each with **at least four cases**:
  - Empty pack (no questions) → no findings.
  - Clean pack (no violations) → no findings.
  - Pack with one violation → exactly one finding, correct
    severity + location.
  - Pack with multiple violations → all surfaced, deterministic
    ordering.
- Helper tests: `normaliseText`, `levenshtein`, `iterateMcqs`.

### Integration tests (vitest, runs under `npm test`)
- Load each of the three real packs via the same loader the validator
  uses, run all checks, snapshot the finding count per
  `(pack, check, severity)` tuple. Snapshot file checked in. Future
  pack changes that drift the count will flag the snapshot diff —
  which is exactly the signal we want.
- Snapshot lives at
  `scripts/__tests__/__snapshots__/integration.test.ts.snap`.

### Manual / acceptance
- Run `npm run validate:packs` locally; confirm the report is
  human-readable and complete.
- Run `npm run smoke:swap`; confirm the new tail step fires after
  the per-pack loop.
- Trigger an intentional violation in a synthetic pack file
  temporarily and confirm exit code is 1.

## CI wiring details

The validator is invoked **once per CI run**, not per pack. The
`swap-smoke.sh` script already iterates packs internally; the
validator iterates them in TypeScript. Running the validator inside
the per-pack loop would N-multiply work without value.

Recommended `swap-smoke.sh` patch (conceptual):

```diff
   for dir in content-packs/*/; do
     pack=$(basename "$dir")
     # ... existing per-pack lint/test/build ...
   done

+  echo "================================================================"
+  echo "  Pack validation (all packs, single pass)"
+  echo "================================================================"
+  npm run validate:packs
```

The new step inherits `set -euo pipefail`, so a non-zero exit halts
the whole smoke. Codex review (`.github/workflows/codex-review.yml`)
already runs on every PR, so the validator's report becomes review
context automatically.

## Verification

End-to-end check that this PR landed correctly:

1. **Locally:** `cd web && npm install && npm run validate:packs`
   prints a structured report for all three packs. Exit code is 0
   (after baseline applied).
2. **CI:** `npm run smoke:swap` succeeds. The PR's GitHub Actions
   workflow shows the validator step in green.
3. **Synthetic regression:** Manually flip one MCQ in
   `content-packs/sample-pack/curriculum.ts` to introduce a
   letter-bias violation; run the validator; confirm it fires the
   correct finding and exits non-zero. Revert before merge.
4. **Codex review:** open the PR; codex should pass without
   `codex-blockers`. If codex flags a finding, address it before
   requesting merge.
5. **Baseline sanity:** `git log -p web/scripts/validate-baseline.json`
   shows the file was populated *intentionally* in this PR (one
   commit, with a description in the commit message of which existing
   violations were grandfathered).

## Out of scope (follow-ups)

Each is a separate PR; do not roll into this PR.

- **Fixing actual findings.** This PR detects; it does not fix the
  underlying letter-bias or principle-presence violations. Each
  pack's fix is its own focused PR (e.g. `cca-f-prep(quiz):
  rebalance B-skewed concept quizzes`).
- **Codex rubric extension.** §5.M in the strategy. Adds
  `.github/codex-rubric-learning.md` and modifies
  `.github/workflows/codex-review.yml` to feed the rubric in.
- **Markdown content scanning.** Run the spoiler-leak regex against
  `07-mock-exams/*.md` source files (not just pack data). Catches
  spoilers in instructional prose.
- **Reading-level drift.** Flesch-Kincaid or similar across lessons.
  Needs per-pack calibration to be useful.
- **Validation report in the web app.** §5.L; needs auth.
- **Pre-commit hook.** A `lefthook` / `husky` integration that runs
  `validate:packs --pack=<changed>` before commit. Nice to have;
  separate PR.

## Open questions

Decisions a human (not Claude) should make before merge:

1. **`tsx` vs `vitest`-only.** Strongest argument for `tsx`: the
   report is informational even when checks pass, and that's a CLI
   shape, not a test shape. If you'd rather avoid the new devDep,
   fold the runner into a vitest test file (`web/src/__tests__/pack-
   validation.test.ts`) and accept the loss of the
   informational-report mode. **Recommendation: ship with `tsx`.**
2. **Severity of `principle-presence`.** Start as `WARN` (current
   plan) or go straight to `ERROR`? The strict reading of CLAUDE.md
   ("must name the principle") supports `ERROR`, but if existing
   packs have many violations, ERROR blocks unrelated PRs until
   every pack is fixed. **Recommendation: WARN + baseline; ratchet
   to ERROR in a follow-up PR after backfill.**
3. **Letter-bias threshold.** 70%? 60%? CLAUDE.md doesn't give a
   number. The current cca-f-prep distribution
   (A 41 / B 48 / C 40 / D 40, total 169 = 24/28/24/24%) is fine;
   a per-quiz threshold of 70% catches outlier quizzes without
   tripping on natural variance. **Recommendation: 70% per-quiz,
   `n >= 4` minimum.**
4. **Should the validator also check `00-academy-basics/notes/*.md`
   and `07-mock-exams/*.md` content?** Today these are
   markdown-source-of-truth that gets converted into pack data.
   Validating them too closes a loophole — but it doubles the
   parser surface area. **Recommendation: out of v1; address as a
   follow-up if a regression escapes the pack-side checks.**

## Commit shape (proposed)

The PR ships as a single commit (or 2–3 if the build sequence above
warrants splitting). Message:

```
strategy(validate-pack): static analyzer for content-pack quality

Six checks: letter-bias, spoiler-leak, principle-presence,
duplicate-questions, option-length-bias, bloom-distribution. Runs
once per CI via npm run validate:packs; tail step in swap-smoke.sh.
Detects only — fixing existing findings is per-pack follow-ups.

Closes the strategy doc §5.S intervention. Adds tsx as devDep.
```

PR title: `strategy(validate-pack): static analyzer for content-pack quality`.
PR body links to `b2b-viability-2026-05.md` §5 + this plan file.
