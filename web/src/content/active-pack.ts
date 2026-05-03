/* ------------------------------------------------------------------
   Active content pack — the single swap-point.

   The actual pack to load is chosen by the `@active-pack` webpack /
   vitest / TypeScript alias, which is configured per environment to
   point at one of the folders under `web/content-packs/`. The default
   is `cca-f-prep`; override per-deploy with the environment variable
   `NEXT_PUBLIC_CONTENT_PACK_ID=<pack-id>` (read by `next.config.ts`
   and `vitest.config.ts`).

   For parallel Vercel deploys: create one Vercel project per pack
   and set a different `NEXT_PUBLIC_CONTENT_PACK_ID` in each
   project's environment variables. Same shell, same code, different
   content per deploy.

   For local one-off swaps without env vars: change the alias's
   tsconfig paths default OR run with the env var prefixed:
     NEXT_PUBLIC_CONTENT_PACK_ID=sample-pack npm run dev

   The alias indirection lets webpack tree-shake — only the active
   pack lands in the bundle.
------------------------------------------------------------------ */

import { pack as activePack } from "@active-pack";
import type { ContentPack } from "./pack-types";

export const ACTIVE_PACK: ContentPack = activePack;
