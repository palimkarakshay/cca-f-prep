# Contributing to `web/`

Short conventions that have to hold across the codebase. Lint /
type-check / tests enforce most of them; the rest live here.

## Run the checks

```sh
cd web
npm install
npm run lint
npm run type-check
npm test              # vitest
npm run test:e2e      # playwright (chromium + webkit + firefox)
npm run build         # production build verification
```

Every PR needs lint + type-check + unit green. Playwright runs on
the nightly cron (`.github/workflows/ci-e2e.yml`) and on demand;
treat its result as advisory unless the change touches a flow
covered by `e2e/*.spec.ts`.

## Storage discipline

The app stores state in `localStorage` today, but every store
routes through `src/lib/storage/driver.ts`. **Do not call
`localStorage.getItem` / `setItem` directly in new code.** Use
`createLocalDriver` (or the future server-backed driver) so the
migration in `plans/v2-scaled-b2b-plan.md` §5–6 stays a one-file
swap rather than a codebase-wide rewrite.

Per-store policy is documented in
`plans/critically-review-entire-app-distributed-prism.md` §4
(see `/root/.claude/plans/`). The discipline test at
`src/__tests__/storage-key-discipline.test.ts` enforces that
storage-key literals only appear in their owning module.

## AI / LLM boundary

**All LLM calls go through `src/lib/ai/router.ts`.** Do not
import `@anthropic-ai/sdk`, `openai`, or any provider SDK
elsewhere in `src/`. The router is the single seam that holds:

- vendor neutrality (OpenRouter as the API surface),
- per-tenant cost / rate-limit / circuit-breaker enforcement
  (when v0.1 lands),
- the `not-configured` fallback that keeps the app honest when
  no API key is set.

Prompt templates live in `web/prompts/*.md`, imported as strings.
Do not inline system prompts in TypeScript.

## Feature flags

Runtime toggles live in `src/lib/feature-flags.ts`. The flag
helper is the only place that reads `process.env.NEXT_PUBLIC_*`
flag vars — components import the helper, not the env. Defaults
favour the operator's dogfood state; flips are documented in
`.env.example`.

## Content quality

- New MCQ quizzes must not skew the correct letter past 60% on a
  single letter (the build-time test in
  `src/__tests__/quiz-letter-distribution.test.ts` enforces this
  for the static pack content; `src/lib/sme-validation.ts`
  enforces the same rule on SME overlays at runtime).
- Distractors must be plausible — each one represents a specific
  misconception, not a random wrong fact.
- Every concept's quiz rationale must name the underlying
  principle, not just say "the text says so".

## Commit / PR style

- Small commits, each green on lint + type-check + unit.
- The codex-review workflow runs on every PR (see CLAUDE.md).
  Address `codex-blockers` findings before merge.
- Don't push to a feature branch with `--force` after a PR is
  open without a written reason — the review trail breaks.

## Privacy / terms

`/privacy` and `/terms` are placeholder pages today. If you
change anything user-data-related, update both pages and flag
the change in the PR description so the operator can decide
whether to involve a lawyer before merging.
