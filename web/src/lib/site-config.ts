/* ------------------------------------------------------------------
   Re-export of the active content pack's branding.

   The shape (`PackConfig`, `NavItem`, `NavIcon`, `AskAIConfig`,
   `PackTheme`) is defined in `src/content/pack-types.ts`. The actual
   values live in `web/content-packs/<pack-id>/pack.config.ts`.

   This file keeps the import path `@/lib/site-config` stable so the
   header, footer, layout, sitemap, robots, llms.txt, and route
   metadata don't have to know which pack is active.
------------------------------------------------------------------ */

import { ACTIVE_PACK } from "@/content/active-pack";
import type { NavIcon, NavItem, PackConfig } from "@/content/pack-types";

export type { NavIcon, NavItem };

/**
 * Branding for the active pack. Compatibility shim — surfaces the
 * fields older call-sites used (`claudeProjectUrl`, `claudeFallbackUrl`)
 * by aliasing them onto the pack's `askAI` block.
 */
export interface SiteConfig extends PackConfig {
  /** Alias of askAI.projectUrl. */
  claudeProjectUrl: string;
  /** Alias of askAI.fallbackUrl. */
  claudeFallbackUrl: string;
}

export const siteConfig: SiteConfig = {
  ...ACTIVE_PACK.config,
  claudeProjectUrl: ACTIVE_PACK.config.askAI.projectUrl,
  claudeFallbackUrl: ACTIVE_PACK.config.askAI.fallbackUrl,
};
