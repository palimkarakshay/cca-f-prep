/* ------------------------------------------------------------------
   Active content pack — the single swap-point.

   To run this app with a different curriculum / branding:
     1. Add or copy a pack under `web/content-packs/<your-pack-id>/`
        following the shape exported by the existing packs (see
        `web/content-packs/README.md`).
     2. Change the import below from `cca-f-prep` to your pack id.
     3. Run `npm install && npm run dev` — every dependent surface
        (dashboard, sections, concepts, quizzes, mocks, sitemap,
        llms.txt, manifest, icons, OG tags, tests) re-derives from
        the new pack with no other code changes.

   The indirection is a single import so build-time tree-shaking still
   eliminates the inactive packs from the bundle.
------------------------------------------------------------------ */

import { pack as activePack } from "../../content-packs/cca-f-prep";
import type { ContentPack } from "./pack-types";

export const ACTIVE_PACK: ContentPack = activePack;
