# `web/` — CCA-F Prep Next.js app

Personal learning and development platform for the Anthropic
Claude Certified Architect — Foundations exam. Same content surface as
`docs/` (sections → concepts → lessons + quizzes → section tests +
mock exams), now on the lumivara-site stack so we can deploy on
Vercel and reuse component / tooling choices across both sites.

## Stack

| Layer       | Choice                                                             |
|-------------|--------------------------------------------------------------------|
| Framework   | Next.js 16.2 (App Router, RSC by default, Turbopack)               |
| Language    | TypeScript 5 (strict, bundler resolution, `@/*` → `./src/*`)       |
| Styling     | Tailwind v4 (PostCSS plugin, `@theme inline` tokens, no v3 config) |
| Primitives  | shadcn-style Button + Card on top of `@base-ui/react`              |
| Icons       | `lucide-react`                                                     |
| Fonts       | next/font/google — Fraunces / Inter / JetBrains Mono via CSS vars  |
| Persistence | `localStorage` (`cca-f-prep:progress:v1`) via `useSyncExternalStore` |
| Tests       | Vitest 4 (unit) + Playwright 1.59 + `@axe-core/playwright` (e2e)   |
| Lint/format | ESLint 9 flat (`eslint-config-next`), Prettier 3 + tailwind plugin |
| Deploy      | Vercel (`vercel.json` with `ignoreCommand`)                        |

## Run locally

```sh
cd web
npm install

# dev
npm run dev               # http://localhost:3000

# checks
npm run lint
npm run type-check
npm test                  # vitest
npm run test:e2e          # playwright (boots build + start)

# build
npm run build && npm start
```

## Layout

```
src/
  app/
    layout.tsx                       fonts, metadata, theme init
    page.tsx                         dashboard
    section/[sectionId]/             section detail
    section/[sectionId]/test/        section test runner
    concept/[sectionId]/[conceptId]/ lesson view
    concept/[sectionId]/[conceptId]/quiz/ concept quiz runner
    mock/                            mock-exam index
    mock/[mockId]/                   mock-exam runner
    mock/[mockId]/result/            last-attempt review
    sitemap.ts robots.ts llms.txt/route.ts not-found.tsx
    globals.css                      Tailwind v4 + tokens + .dark
  components/
    layout/   Header, Footer, SiteChrome
    primitives/ ThemeToggle, Breadcrumbs, MasteryBadge
    ui/       Button, Card (shadcn-style)
    dashboard/ RecommendationBanner, SectionList, MockExamPanel
    section/  SectionConceptList
    concept/  LessonView, LessonBody, AskClaudePanel
    quiz/     QuizRunner, QuizResult, ConceptQuizPage,
              SectionTestPage, MockExamPage, MockResult
  content/
    curriculum.ts                    verbatim copy of docs/curriculum.js
    curriculum-types.ts              shape interfaces
    curriculum-loader.ts             typed lookup helpers
  lib/
    site-config.ts progress-types.ts progress.ts progress-store.ts
    recommendation.ts utils.ts
  hooks/useProgress.ts
  __tests__/                         vitest (utils, site-config, progress, recommendation)
e2e/                                  playwright (smoke, a11y)
```

## Adding content

Same workflow as `docs/curriculum.js`. Edit `src/content/curriculum.ts`
(or, until `docs/` is deprecated, edit `docs/curriculum.js` and copy
the export over). Add a concept by pushing into `section.concepts`;
add a section by pushing into `CURRICULUM.sections`. Routes,
recommendation engine, dashboard cards, sitemap, and `llms.txt` all
re-derive automatically — no rendering changes needed.

## Deploy to Vercel

1. `vercel link` from `web/`.
2. Push to `main`. Vercel builds when anything under
   `src/`, `public/`, `package.json`, `next.config.ts`, or
   `postcss.config.mjs` changes — diffs that only touch the study
   notes (`01-…/`, `06-…/`, etc.) skip the build via the
   `ignoreCommand` in `vercel.json`.
3. No environment variables required (the original Resend / form
   plumbing was dropped — this is a learning platform, not a marketing
   site).
