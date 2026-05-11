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
import { pack as acmePack } from "../../content-packs/acme-onboarding";
import { pack as commsPack } from "../../content-packs/workplace-comms";
import { pack as securityPack } from "../../content-packs/security-awareness";
import { pack as managerPack } from "../../content-packs/new-manager-basics";
import { pack as pmbokPack } from "../../content-packs/pmbok-prep";
import type { ContentPack } from "./pack-types";

/*
  Order matters: `Object.values(PACK_REGISTRY)` preserves insertion
  order, and the consumer picker on `/` renders in that order.
  PMBOK 8e is the most discoverable / highest-intent topic right
  now, so it leads. The "first registered pack" fallback for
  DEFAULT_PACK_ID also flips to `pmbok-prep`, but every pack-aware
  surface ([packId]/* routes, useProgress() with PackContext) reads
  the URL pack — DEFAULT_PACK_ID is only used by the back-compat
  single-pack progressStore singleton.
*/
export const PACK_REGISTRY: Record<string, ContentPack> = {
  "pmbok-prep": pmbokPack,
  "cca-f-prep": ccaPack,
  "learn-french": frenchPack,
  "sample-pack": samplePack,
  "sewing-beginners": sewingPack,
  "acme-onboarding": acmePack,
  "workplace-comms": commsPack,
  "security-awareness": securityPack,
  "new-manager-basics": managerPack,
};

export const ALL_PACK_IDS: string[] = Object.keys(PACK_REGISTRY);

export const ALL_PACKS: ContentPack[] = Object.values(PACK_REGISTRY);

/**
 * Packs targeting individual learners. Surfaced on the public picker
 * at `/`. A pack with no `audience` field is treated as consumer so
 * existing packs don't need to declare it explicitly.
 */
export const CONSUMER_PACKS: ContentPack[] = ALL_PACKS.filter(
  (p) => (p.config.audience ?? "consumer") === "consumer"
);

/**
 * Packs authored for a company (SME-verified, company-approved
 * content). Surfaced only on the Adept area at `/adept`. Kept off
 * the consumer picker so the consumer pitch isn't muddied by
 * single-tenant demo content.
 */
export const B2B_PACKS: ContentPack[] = ALL_PACKS.filter(
  (p) => p.config.audience === "b2b"
);

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
