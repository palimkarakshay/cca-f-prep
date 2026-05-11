# `web/content-packs/` — swappable content packs

The Next.js app shell under `web/src/` is content-agnostic. All
exam-/course-/topic-specific material lives in **content packs** under
this directory. Switching the active pack is a one-line change.

## What's a pack?

A pack is a directory under `web/content-packs/<pack-id>/` that
exports a `ContentPack` object. The shape is defined in
[`src/content/pack-types.ts`](../src/content/pack-types.ts):

```ts
export interface ContentPack {
  config: PackConfig; // branding, theme, nav, manifest, icons, AskAI URLs
  curriculum: Curriculum; // sections → concepts → lessons + quizzes,
                          // section tests, mock exams
}
```

Packs in this repo:

| Pack id            | Folder                  | What it contains                                                                  |
| ------------------ | ----------------------- | --------------------------------------------------------------------------------- |
| `cca-f-prep`       | `cca-f-prep/`           | Original — Anthropic CCA-F exam prep (9 sections, 41 concepts, 1 diagnostic mock) |
| `learn-french`     | `learn-french/`         | Practical beginner French for English speakers (5 modules, 15 concepts, 2 real-life scenarios) — France + Quebec aware |
| `sample-pack`      | `sample-pack/`          | Tiny demo (2 sections, 3 concepts, 1 mock) — proves the swap mechanism            |
| `sewing-beginners` | `sewing-beginners/`     | Non-exam topic pack (sewing 101) — proves `pack.copy` terminology overrides       |

## How to swap

Two ways. Both produce the same swap; the env-var path is the
canonical mechanism for parallel Vercel deploys.

### Option 1 — env var (recommended for deploys)

Set `NEXT_PUBLIC_CONTENT_PACK_ID=<pack-id>` in your shell or your
Vercel project's environment variables:

```sh
NEXT_PUBLIC_CONTENT_PACK_ID=sewing-beginners npm run dev
NEXT_PUBLIC_CONTENT_PACK_ID=sewing-beginners npm run build
```

The `next.config.ts` and `vitest.config.ts` resolve the
`@active-pack` alias to `content-packs/<that-id>/` at build time.
Tree-shaking eliminates inactive packs from the bundle.

### Option 2 — change the tsconfig default

Edit `tsconfig.json` to change the static fallback that TypeScript
uses for type-checking when no env var is set:

```json
"paths": {
  "@/*": ["./src/*"],
  "@active-pack": ["./content-packs/sewing-beginners"]
}
```

This is the right call only if you've permanently switched the repo's
default pack — for one-offs, prefer the env var.

After either swap, Every dependent surface
re-derives from the new pack:

- Header / footer brand name + tagline + repo link
- Bottom nav (mobile) and desktop nav items
- Dashboard sections, mock-exam (or "final projects") panel, recommendation banner
- Concept lesson pages, concept quiz pages, section/module test pages, mock/project runner
- Sitemap, robots, llms.txt
- PWA manifest (`/manifest.webmanifest`) — name, short_name, description, theme color, background color, categories
- Favicons (`/icon.svg`, `/icon-maskable.svg`) — served from the pack's inlined SVG
- Theme CSS tokens — light + dark — applied at the document root
- AskAI panel heading + description + chat hand-off URL
- Per-pack `localStorage` namespace (`<pack-id>:progress:v1`, `<pack-id>:theme`)
- All exam-coded UI copy (mock-exam heading, section-test label, concepts-mastered stat, recommendation labels, pass / below-pass-gate badges, "What you'll learn" callout) overridable via `pack.config.copy`. The shell falls back to defaults; packs only override the labels they need.
- Per-concept `bloom` taxonomy field is **optional**. Non-academic packs can omit it; the badge then doesn't render.

> **Storage isolation.** Storage keys are namespaced by `pack.id`, so
> different packs do **not** collide on a single browser. Switching
> packs preserves the previous pack's progress; switching back resumes
> where you left off.

## Authoring a new pack

Quickest path:

```sh
cp -r content-packs/sample-pack content-packs/my-course
```

Then edit, in order:

### 1. `pack.config.ts`

Set `id`, `name`, `tagline`, `description`, `url`. Update `theme.light`
+ `theme.dark` color tokens (the keys must match the CSS variables in
[`src/app/globals.css`](../src/app/globals.css) — the defaults are
inherited if you omit any). Drop in your `iconSvg` + `iconMaskableSvg`
strings (any 512×512 SVG works). Set `askAI.projectUrl` to your own
Claude Project URL if you want the "Ask Claude" panel to route to a
specific project (otherwise leave empty and it falls back to
`https://claude.ai/new`).

If your topic isn't an exam, override the exam-coded UI labels via
`copy`. The full overridable set (all optional) lives in `PackCopy`
(see [`src/content/pack-types.ts`](../src/content/pack-types.ts)).
For example, `sewing-beginners` overrides:

```ts
copy: {
  mockExamsHeading: "Final projects",          // dashboard panel + /mock heading
  sectionTestSingular: "Module check",         // section-test labels everywhere
  conceptsMasteredLabel: "Techniques learned", // stats panel
  bestMockScoreLabel: "Best project review",   // stats panel
  recoDrillLabel: "Practice",                  // recommendation banner
  recoLessonTitle: "Read the next lesson",     // recommendation banner
  whatYoullLearnHeading: "What you'll be able to do",
  passLabel: "got it",
  belowPassGateLabel: "needs more practice",
  // … see PackCopy for the full list; everything else inherits the
  // default exam-coded copy.
},
```

If `copy` is omitted entirely, the dashboard reads "Mock exams",
"Section test", "Concepts mastered", etc. — which is the right
default for academic / exam packs but reads strangely for a sewing
or cooking course.

For academic packs you can also set `concept.bloom` (`R | U | A | An
| E | C`) on each concept and a small Bloom badge renders next to
the title. **Omit `bloom` for non-academic packs** — the badge then
doesn't render at all (it's not displayed for the sewing pack).

### 2. `curriculum.ts`

Author one or more sections. Each section has concepts; each concept
has an optional lesson + an optional quiz. Sections may have a
`sectionTest` (gates the next section) and the curriculum may have
top-level `mockExams[]` (independent calibration assessments).

The full shape is documented in
[`src/content/curriculum-types.ts`](../src/content/curriculum-types.ts)
and at the top of
[`content-packs/cca-f-prep/curriculum.ts`](./cca-f-prep/curriculum.ts).
Highlights:

- **Lesson:** `paragraphs[]` (prose), optional `keyPoints[]`,
  `examples[]`, `pitfalls[]`, and `simplified.{oneLiner, paragraphs,
  keyPoints}` (drives the per-lesson "Simplify" toggle).
- **Quiz / SectionTest / MockExam questions:** four-option MCQ
  (`{A, B, C, D}`), one `correct` answer, optional per-option
  `explanations` and a `principle` summary surfaced after the answer.

### 3. `index.ts`

Already wired — re-exports `pack: ContentPack` built from
`pack.config.ts` + `curriculum.ts`. No edit needed unless you want to
co-locate other helpers.

### 4. Point the active-pack pointer at it

```ts
// src/content/active-pack.ts
import { pack as activePack } from "../../content-packs/my-course";
```

### 5. Run the verification loop

```sh
cd web
npm install
npm run lint
npm run type-check
npm test
npm run build
```

A successful build prints the section / concept / mock paths derived
from your curriculum.

## What stays in the shell (don't move into a pack)

- Next.js app router pages (`src/app/`)
- Components (`src/components/`)
- Hooks (`src/hooks/`)
- Progress engine + recommendation engine + streak (`src/lib/`)
- Curriculum loader helpers (`src/content/curriculum-loader.ts`)
- Curriculum + pack-config TypeScript types (`src/content/curriculum-types.ts`,
  `src/content/pack-types.ts`)
- Test runner config (`vitest.config.ts`, `playwright.config.ts`)
- Build / lint / format config (`next.config.ts`, `tsconfig.json`,
  `eslint.config.mjs`, `postcss.config.mjs`, `.prettierrc.json`)
- Vercel deploy config (`vercel.json`)
- Global CSS reset + token defaults + animation keyframes
  (`src/app/globals.css`)

These are framework / mechanism / infrastructure — they should not
need editing when you swap packs.

## Pack self-containment

Each pack folder is independent of the shell *except for one file*:
`<pack>/_types.ts` re-exports the contract types from
`@/content/pack-types` and `@/content/curriculum-types`. Every other
pack file (`pack.config.ts`, `curriculum.ts`, `index.ts`, `icons.ts`)
imports types via the local `./_types` path.

```
content-packs/cca-f-prep/
├── _types.ts        ← only file that touches the shell (@/* alias)
├── pack.config.ts   ← `import type { PackConfig } from "./_types"`
├── curriculum.ts    ← `import type { Curriculum } from "./_types"`
├── icons.ts         ← no imports
└── index.ts         ← `import type { ContentPack } from "./_types"`
```

This means the *whole pack folder* can be copied into another repo
and only `_types.ts` needs to change for it to type-check.

## Cross-repo extraction recipe

When you're ready to move a pack into its own git repo:

1. **Copy the pack folder** to a new repo:
   ```sh
   git init learning-content-cca-f-prep
   cp -r web/content-packs/cca-f-prep/* learning-content-cca-f-prep/
   ```

2. **Replace `_types.ts`** in the new repo. Pick one:

   - **Inlined** — copy the type declarations from
     `web/src/content/pack-types.ts` and
     `web/src/content/curriculum-types.ts` into a single
     `_types.ts` (or split into two files). Pros: zero deps, fully
     self-contained. Cons: schema drift if the shell type evolves —
     mitigated by the pack-contract test in the shell, which fails
     CI on the shell side if a pack stops satisfying the contract.

   - **Shared types package** — publish a tiny
     `@your-org/learning-content-types` npm package that exports the
     contract types. Have both shell and pack depend on it. Pros:
     one source of truth. Cons: third repo to maintain. Replace the
     `_types.ts` body with re-exports from the shared package.

3. **Add a minimal `package.json`** to the new pack repo:
   ```json
   {
     "name": "@your-org/learning-content-cca-f-prep",
     "version": "1.0.0",
     "main": "index.ts",
     "types": "index.ts",
     "files": ["*.ts", "_types.ts", "icons.ts"]
   }
   ```

4. **Wire it up in the shell.** In the shell repo, edit
   `src/content/active-pack.ts`:
   ```diff
   -import { pack as activePack } from "../../content-packs/cca-f-prep";
   +import { pack as activePack } from "@your-org/learning-content-cca-f-prep";
   ```
   And add to shell `package.json` dependencies (or use a git
   submodule, or use `npm link` for local dev).

5. **Verify the swap end-to-end:**
   ```sh
   cd web
   npm install
   npm run smoke:swap   # iterates every pack still in content-packs/
   npm run build        # builds with the externally-sourced pack
   ```

If you want a *no-build, copy-on-deploy* model instead, leave the
relative import in `active-pack.ts` and add a CI step that
`git clone`s the pack repo into `content-packs/<id>/` before `next
build` runs. The shell never needs to change.

## Parallel Vercel deploys (one shell, many packs)

You can deploy the same shell as multiple parallel Vercel projects,
each serving a different pack. The recipe:

1. **Push this repo once** to GitHub (or wherever Vercel pulls from).

2. **Create one Vercel project per pack** — each one points at the
   same repository / branch. In each project's *Settings →
   Environment Variables*, add:

   ```
   NEXT_PUBLIC_CONTENT_PACK_ID = <pack-id>
   ```

   Example projects:

   | Vercel project           | env var value             |
   | ------------------------ | ------------------------- |
   | cca-f-prep               | `cca-f-prep`              |
   | sewing-beginners         | `sewing-beginners`        |
   | learn-french             | `learn-french`            |
   | leadership-conflict      | `leadership-conflict`     |

3. **Push to the branch.** Each Vercel project rebuilds independently
   with its own env var, producing its own deployment URL. Same
   shell code, three (or however many) different content surfaces.

4. **Custom domains:** point a different domain at each Vercel
   project (`learn-sewing.example.com`, `cca-f-prep.example.com`,
   etc.). Vercel's per-project domain settings.

Why this works: `next.config.ts` reads the env var at build time
and resolves the `@active-pack` webpack alias to the matching pack
folder. Tree-shaking eliminates the other packs from each bundle.

> **Storage isolation across deploys.** `localStorage` is per-origin.
> If two packs are served from the *same* origin (e.g. via a
> hostname-based runtime switch — not what this recipe does), the
> per-pack storage-key namespace prevents progress collisions. With
> separate Vercel projects on separate domains, each pack already
> has its own localStorage scope.

## Multiple packs at runtime (advanced, not built in)

The build-time env var produces a single-pack bundle. If you want
*one* deployment to serve multiple packs at runtime (e.g. via
`?pack=<id>` query string or a hostname-based selector), extend
`src/content/active-pack.ts` to read the request and pick from a
registry of statically-imported packs. This trades bundle size
(all packs land in the bundle) for runtime flexibility.

The shell intentionally ships with the single-import / single env
var path — it covers the parallel-deploy case (which is what most
multi-content setups actually want), keeps bundle output small, and
needs zero per-request work.
