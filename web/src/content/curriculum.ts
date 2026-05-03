/* ------------------------------------------------------------------
   Re-export of the active content pack's curriculum.

   The actual curriculum data lives in `web/content-packs/<pack-id>/
   curriculum.ts`. The single swap-point is `src/content/active-pack.ts`.

   This indirection keeps the import path stable so every dashboard,
   route, and helper that reads `CURRICULUM` keeps working unchanged
   when content is swapped.
------------------------------------------------------------------ */

import { ACTIVE_PACK } from "./active-pack";

export const CURRICULUM = ACTIVE_PACK.curriculum;
