/* ------------------------------------------------------------------
   Storage keys — derived from the active pack id so different content
   packs don't collide in the same browser.

     <pack-id>:progress:v1   — quiz / section / mock progress
     <pack-id>:theme         — user-chosen theme override
------------------------------------------------------------------ */

import { ACTIVE_PACK } from "@/content/active-pack";

export const PACK_ID = ACTIVE_PACK.config.id;
export const THEME_STORAGE_KEY = `${PACK_ID}:theme`;
