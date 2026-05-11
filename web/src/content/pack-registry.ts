/* ------------------------------------------------------------------
   Pack registry.

   Every pack ships a static export. The registry is the runtime
   index of all packs the app knows about. Add a new pack by:
     1. Authoring `web/content-packs/<your-pack>/`.
     2. Adding the import + entry below.

   Pack lookup happens at request time from the URL `[packId]`
   segment (see `app/[packId]/layout.tsx`). Build-time env-var
   single-pack mode (NEXT_PUBLIC_CONTENT_PACK_ID) is preserved as a
   backward-compat fallback for existing parallel-Vercel deploys.
------------------------------------------------------------------ */

import { pack as ccaPack } from "../../content-packs/cca-f-prep";
import { pack as frenchPack } from "../../content-packs/learn-french";
import { pack as samplePack } from "../../content-packs/sample-pack";
import { pack as sewingPack } from "../../content-packs/sewing-beginners";
import type { ContentPack } from "./pack-types";

export const PACK_REGISTRY: Record<string, ContentPack> = {
  "cca-f-prep": ccaPack,
  "learn-french": frenchPack,
  "sample-pack": samplePack,
  "sewing-beginners": sewingPack,
};

export const ALL_PACK_IDS: string[] = Object.keys(PACK_REGISTRY);

export const ALL_PACKS: ContentPack[] = Object.values(PACK_REGISTRY);

export function getPack(id: string): ContentPack | null {
  // Object.hasOwn guards against prototype-key leakage — route params
  // like "toString" or "__proto__" must return null, not Object.prototype
  // members. Same fix as SECTION_META / DOMAIN_MAP lookups.
  return Object.hasOwn(PACK_REGISTRY, id) ? PACK_REGISTRY[id] : null;
}

/**
 * Default pack id: env-var override if present, otherwise the first
 * registered pack. Used by layouts that want a sensible fallback.
 */
export const DEFAULT_PACK_ID: string =
  (process.env.NEXT_PUBLIC_CONTENT_PACK_ID &&
  PACK_REGISTRY[process.env.NEXT_PUBLIC_CONTENT_PACK_ID]
    ? process.env.NEXT_PUBLIC_CONTENT_PACK_ID
    : ALL_PACK_IDS[0]) ?? "cca-f-prep";
