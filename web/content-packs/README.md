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

| Pack id        | Folder                | What it contains                                  |
| -------------- | --------------------- | ------------------------------------------------- |
| `cca-f-prep`   | `cca-f-prep/`         | Original — Anthropic CCA-F exam prep (9 sections, 41 concepts, 1 diagnostic mock) |
| `sample-pack`  | `sample-pack/`        | Tiny demo (2 sections, 3 concepts, 1 mock) — proves the swap mechanism |

## How to swap

Edit one import in [`src/content/active-pack.ts`](../src/content/active-pack.ts):

```ts
// before
import { pack as activePack } from "../../content-packs/cca-f-prep";

// after
import { pack as activePack } from "../../content-packs/sample-pack";
```

That's it. Re-run `npm run dev` (or rebuild). Every dependent surface
re-derives from the new pack:

- Header / footer brand name + tagline + repo link
- Bottom nav (mobile) and desktop nav items
- Dashboard sections, mock exam panel, recommendation banner
- Concept lesson pages, concept quiz pages, section test pages, mock exam runner
- Sitemap, robots, llms.txt
- PWA manifest (`/manifest.webmanifest`) — name, short_name, description, theme color, background color, categories
- Favicons (`/icon.svg`, `/icon-maskable.svg`) — served from the pack's inlined SVG
- Theme CSS tokens — light + dark — applied at the document root
- AskAI panel heading + description + chat hand-off URL
- Per-pack `localStorage` namespace (`<pack-id>:progress:v1`, `<pack-id>:theme`)

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

## Multiple packs at runtime

The current swap is build-time (one import). If you want runtime
multi-pack switching, the typical extension is:

1. Add a `?pack=<id>` (or hostname-based) selector that picks the
   pack at the request boundary in `src/content/active-pack.ts`.
2. Read the active pack from a server component / middleware so SSR
   sees the right pack per request.

This is intentionally not built in — keeping a single import keeps
build output small (tree-shaking eliminates inactive packs from the
bundle).
