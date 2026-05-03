"use client";

/* ------------------------------------------------------------------
   Client-side pack-aware hooks.

   Wrap the factories in `src/lib/pack-helpers.ts` against the pack
   from `usePack()`. Use these inside client components instead of
   importing module-level `siteConfig` / `copy` / `masteryLevels` so
   the rendered values track the URL pack (when inside `[packId]/...`
   routes) and not just the build-time default pack.
------------------------------------------------------------------ */

import { usePack } from "./pack-context";
import {
  copyFor,
  lessonDepthStorageKeyFor,
  masteryLevelsFor,
  progressStorageKeyFor,
  siteConfigFor,
  themeStorageKeyFor,
  type SiteConfigFor,
} from "@/lib/pack-helpers";
import type { MasteryLevel, PackCopy } from "./pack-types";

export function useSiteConfig(): SiteConfigFor {
  return siteConfigFor(usePack());
}

export function useCopy(): Required<PackCopy> {
  return copyFor(usePack());
}

export function useMasteryLevels(): MasteryLevel[] {
  return masteryLevelsFor(usePack());
}

export function usePackId(): string {
  return usePack().config.id;
}

export function useProgressStorageKey(): string {
  return progressStorageKeyFor(usePack());
}

export function useThemeStorageKey(): string {
  return themeStorageKeyFor(usePack());
}

export function useLessonDepthStorageKey(): string {
  return lessonDepthStorageKeyFor(usePack());
}
