/* ------------------------------------------------------------------
   Pack-scoped helpers.

   Companion to `src/lib/site-config.ts` (which is module-scoped via
   the env-var-resolved ACTIVE_PACK). These functions take a pack as
   input so they can be called per-request inside the [packId]/
   route segment without needing a singleton swap.

   The original `siteConfig`, `copy`, `masteryLevels` exports stay
   intact for back-compat with client components that haven't yet
   moved to usePack(); they just wrap these factories.
------------------------------------------------------------------ */

import type {
  ContentPack,
  MasteryLevel,
  PackConfig,
  PackCopy,
} from "@/content/pack-types";
import { DEFAULT_COPY, DEFAULT_MASTERY_LEVELS } from "./site-config";

export interface SiteConfigFor extends PackConfig {
  /** Alias of askAI.projectUrl. */
  claudeProjectUrl: string;
  /** Alias of askAI.fallbackUrl. */
  claudeFallbackUrl: string;
}

export function siteConfigFor(pack: ContentPack): SiteConfigFor {
  return {
    ...pack.config,
    claudeProjectUrl: pack.config.askAI.projectUrl,
    claudeFallbackUrl: pack.config.askAI.fallbackUrl,
  };
}

export function copyFor(pack: ContentPack): Required<PackCopy> {
  return { ...DEFAULT_COPY, ...(pack.config.copy ?? {}) };
}

export function masteryLevelsFor(pack: ContentPack): MasteryLevel[] {
  return pack.config.masteryLevels ?? DEFAULT_MASTERY_LEVELS;
}

export function progressStorageKeyFor(pack: ContentPack): string {
  return `${pack.config.id}:progress:v1`;
}

export function themeStorageKeyFor(pack: ContentPack): string {
  return `${pack.config.id}:theme`;
}

export function lessonDepthStorageKeyFor(pack: ContentPack): string {
  return `${pack.config.id}:lesson-depth:v1`;
}
