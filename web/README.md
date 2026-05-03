# `web/` — content-agnostic learning-app shell + content packs

Reusable Next.js app shell that delivers any "sections → concepts →
lessons + quizzes → section tests + mock exams" curriculum. Out of the
box this repo ships two content packs:

- **`cca-f-prep`** — Anthropic Claude Certified Architect — Foundations
  exam prep (the original content surface).
- **`sample-pack`** — minimal demo pack (proves the swap mechanism).

Switching the active pack is one line in
[`src/content/active-pack.ts`](src/content/active-pack.ts) — see
[`content-packs/README.md`](content-packs/README.md) for the full swap
procedure and authoring guide.

## Stack

| Layer       | Choice                                                              |
| ----------- | ------------------------------------------------------------------- |
| Framework   | Next.js 16.2 (App Router, RSC by default, Turbopack)                |
| Language    | TypeScript 5 (strict, bundler resolution, `@/*` → `./src/*`)        |
| Styling     | Tailwind v4 (PostCSS plugin, `@theme inline` tokens, no v3 config)  |
| Primitives  | shadcn-style Button + Card on top of `@base-ui/react`               |
| Icons       | `lucide-react`                                                      |
| Fonts       | `next/font/google` — Fraunces / Inter / JetBrains Mono via CSS vars |
| Persistence | `localStorage`, namespaced by `<pack-id>:` prefix                   |
| Tests       | Vitest 4 (unit) + Playwright 1.59 + `@axe-core/playwright` (e2e)    |
| Lint/format | ESLint 9 flat (`eslint-config-next`), Prettier 3 + tailwind plugin  |
| Deploy      | Vercel (`vercel.json`, `next build`, framework auto-detect)         |

## Run locally

```sh
cd web
npm install

# dev
npm run dev               # http://localhost:3000

# checks
npm run lint
npm run type-check
npm test                  # vitest (includes pack-contract suite)
npm run test:e2e          # playwright (boots build + start)
npm run smoke:swap        # build every pack in content-packs/ end-to-end

# build
npm run build && npm start
```

`npm run smoke:swap` rotates the active-pack pointer through every
folder under `content-packs/`, runs `type-check` + `test` + `build`
for each, and restores the original pointer on exit. Use it after
authoring a new pack or before merging changes that touch the
contract.

## Architecture — shell vs. content pack

```
web/
  content-packs/               ← swappable content
    cca-f-prep/                  exam-prep content (original)
      pack.config.ts             branding, theme, nav, manifest, AskAI URL
      curriculum.ts              sections + concepts + quizzes + mocks
      icons.ts                   foreground + maskable SVG markup
      index.ts                   ContentPack export
    sample-pack/                 minimal demo
      ... (same shape)
    README.md                    authoring + swap guide

  src/
    app/                         ← Next.js routes (content-agnostic)
      layout.tsx                   fonts, metadata, theme init, pack tokens
      page.tsx                     dashboard
      section/[sectionId]/         section detail
      section/[sectionId]/test/    section test runner
      concept/[sectionId]/[conceptId]/        lesson view
      concept/[sectionId]/[conceptId]/quiz/   concept quiz runner
      mock/                        mock-exam index
      mock/[mockId]/               mock-exam runner
      mock/[mockId]/result/        last-attempt review
      manifest.ts                  PWA manifest (derived from active pack)
      icon.svg/route.ts            served from pack.config.iconSvg
      icon-maskable.svg/route.ts   served from pack.config.iconMaskableSvg
      sitemap.ts robots.ts llms.txt/route.ts not-found.tsx
      globals.css                  Tailwind v4 + token defaults + .dark

    components/                  ← UI primitives + features (content-agnostic)
      layout/    Header, Footer, BottomNav, SiteChrome
      primitives/ ThemeToggle, Breadcrumbs, MasteryBadge, MasteryMeter, Skeleton
      ui/        Button, Card, Container (shadcn-style)
      dashboard/ RecommendationBanner, SectionList, MockExamPanel, StatsPanel
      section/   SectionConceptList
      concept/   LessonView, LessonBody, LessonTOC, AskClaudePanel
      quiz/      QuizRunner, QuizResult, ConceptQuizPage,
                 SectionTestPage, MockExamPage, MockResult

    content/                     ← contracts + active-pack indirection
      pack-types.ts                PackConfig + ContentPack
      curriculum-types.ts          Lesson, Quiz, Concept, Section, MockExam, …
      active-pack.ts               ★ single swap-point — change this import
      curriculum.ts                re-export of ACTIVE_PACK.curriculum
      curriculum-loader.ts         typed lookup helpers (getSection, …)

    lib/                         ← engines + helpers (content-agnostic)
      site-config.ts               re-export of ACTIVE_PACK.config + AskAI aliases
      storage-keys.ts              `<pack-id>:theme`, `PACK_ID`
      progress-types.ts progress.ts progress-store.ts
      recommendation.ts streak.ts utils.ts

    hooks/useProgress.ts useScrollProgress.ts
    __tests__/                   vitest (utils, site-config, progress, recommendation, streak)
  e2e/                           playwright (smoke, a11y) — reads PACK_NAME from active pack
```

### What's in a pack

- Branding: `name`, `shortName`, `tagline`, `description`, `url`,
  `repoUrl`, `author`
- Navigation: `nav[]` (label, href, optional icon, mobile flag)
- AskAI hand-off: `askAI.projectUrl`, `fallbackUrl`, `heading`, `description`
- PWA manifest: `manifest.backgroundColor`, `themeColor`, `categories`
- Theme tokens: `theme.light` + `theme.dark` (CSS custom-property
  overrides, scoped to `html[data-pack="<id>"]`)
- Icons: `iconSvg`, `iconMaskableSvg` (raw SVG markup)
- Curriculum: full `Curriculum` shape — sections, concepts, lessons,
  quizzes, section tests, mock exams

### What's in the shell (and shouldn't be edited per pack)

- Next.js framework + build config + Vercel config
- All React components, primitives, and layout chrome
- Progress engine (per-pack localStorage), recommendation engine,
  streak engine
- Theme toggle, route metadata, sitemap, robots, llms.txt, manifest
  generator, icon route handlers
- Tests + e2e — they read from the active pack, not from hardcoded
  brand strings

## Available features (today)

- **Topic picker at `/`** — visit the root URL to choose between any
  installed content pack. Each pack has its own URL prefix
  (`/cca-f-prep/...`, `/sewing-beginners/...`, etc.), its own
  progress storage, its own theme, and its own brand. The header
  shows a "Switch topic" link when inside a pack.
- **Lesson delivery** — TOC, scroll-progress bar, mastery badge,
  3-way Easy / Conceptual / Deeper depth picker (per-lesson choice
  persists), prev/next nav, "What you'll learn" callout
- **Concept quiz** — multiple question kinds (4-option MCQ + true/
  false + fill-in-the-blank), keyboard shortcuts adapt per kind,
  per-option / per-kind explanations after submit, mastery update
- **Section test** — gates the next section behind a configurable pass
  percentage
- **Mock exam** — independent of section progress, timed, with
  customizable score bands
- **Custom mastery taxonomies** — packs define their own mastery
  levels (label, score threshold, "drill"/"mastered" flags, tone).
  Default is the original 5-level system.
- **Progress tracker** — counts that respect each pack's mastery
  taxonomy, study streak, best mock score
- **Adaptive recommendation banner** — drill / section-test / next
  lesson / next quiz / done, in priority order, using each pack's
  vocabulary
- **Concept explainer hand-off** — "Ask Claude" panel that builds a
  prompt from the current lesson + your question and opens a Claude
  chat (project URL + fallback are pack-configurable)
- **Theming** — light/dark with per-pack token overrides, persisted
  per-pack in `localStorage`
- **PWA** — installable, offline-tolerant cache headers, theme color
  matched to the active pack

> **Not implemented (yet):** flashcard mechanism, mini-games. The
> curriculum schema (`Lesson`, `Question`, `Concept`) doesn't model
> spaced-repetition cards or game state. If/when these features are
> added, the shape extension stays in `pack-types.ts` /
> `curriculum-types.ts` and the renderers go in `src/components/`,
> keeping packs free of UI code.

## Adding content (within a pack)

Edit the active pack's `curriculum.ts`. Add a concept by pushing into
`section.concepts`; add a section by pushing into
`CURRICULUM.sections`. Routes, recommendation engine, dashboard cards,
sitemap, llms.txt, and the manifest re-derive automatically — no
component changes needed.

## Deploy to Vercel

### Single deploy

1. `vercel link` from `web/`.
2. Push to `main`. Vercel rebuilds on changes under `src/`,
   `content-packs/`, `public/`, `package.json`, `next.config.ts`, or
   `postcss.config.mjs`.
3. No environment variables required if you're shipping the default
   pack (`cca-f-prep`).

### Parallel deploys (one shell, many packs)

Same repo, multiple Vercel projects, one pack per project.

1. Create one Vercel project per pack — all pointing at the same
   GitHub repository / branch.
2. In each project's *Settings → Environment Variables*, add:

   ```
   NEXT_PUBLIC_CONTENT_PACK_ID = <pack-id>
   ```

   For example: `cca-f-prep`, `sewing-beginners`, `learn-french`,
   `leadership-conflict`. The id must match a folder under
   `content-packs/<pack-id>/`.
3. Push to the branch. Each project rebuilds independently with its
   own pack. Different deployment URLs; bind your own domains as
   you like.

The shell tree-shakes — only the env-var-selected pack lands in
each bundle.

See [`content-packs/README.md`](content-packs/README.md) for the
full authoring guide, the cross-repo extraction recipe, and the
list of overridable UI labels (`pack.copy`).

## Switching the active pack locally

```sh
# default — cca-f-prep
npm run dev

# pick a different pack for this run
NEXT_PUBLIC_CONTENT_PACK_ID=sewing-beginners npm run dev
NEXT_PUBLIC_CONTENT_PACK_ID=sample-pack npm run dev

# permanently change the default (edits tsconfig path)
# see content-packs/README.md § "How to swap" for details
```

Every dependent surface — dashboard, sections, concepts, quizzes,
mocks, sitemap, llms.txt, manifest, icons, theme tokens, AskAI
heading — re-derives from the env-var-selected pack. No code change.
