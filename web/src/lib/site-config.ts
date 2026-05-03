/* ------------------------------------------------------------------
   Re-export of the active content pack's branding + resolved copy.

   The shape (`PackConfig`, `NavItem`, `NavIcon`, `AskAIConfig`,
   `PackTheme`, `PackCopy`) is defined in `src/content/pack-types.ts`.
   The actual values live in `web/content-packs/<pack-id>/pack.config.ts`.

   This file keeps `@/lib/site-config` stable so the header, footer,
   layout, sitemap, robots, llms.txt, and route metadata don't have to
   know which pack is active. It also resolves `copy` — the per-pack
   terminology overrides — against shell defaults so components can
   read `copy.X` without a fallback at every call-site.
------------------------------------------------------------------ */

import { ACTIVE_PACK } from "@/content/active-pack";
import type {
  NavIcon,
  NavItem,
  PackConfig,
  PackCopy,
} from "@/content/pack-types";

export type { NavIcon, NavItem, PackCopy };

/**
 * Default UI copy. Exam-coded — the original CCA-F-prep vocabulary.
 * Packs override individual keys via `pack.config.copy`. Resolved here
 * so components can do `copy.mockExamsHeading` safely.
 */
export const DEFAULT_COPY: Required<PackCopy> = {
  mockExamsHeading: "Mock exams",
  mockExamsBlurb: "Independent of section progress. Use for calibration.",
  mockExamsMetaDescription:
    "Independent calibration exams covering all sections. Use them to gauge readiness before the real assessment.",
  sectionTestSingular: "Section test",
  conceptsMasteredLabel: "Concepts mastered",
  sectionsCompleteLabel: "Sections complete",
  bestMockScoreLabel: "Best mock score",
  studyStreakLabel: "Study streak",
  recoDrillLabel: "Drill",
  recoDrillTitle: "Re-take a missed concept",
  recoSectionTestLabel: "Section test",
  recoSectionTestTitle: "Section test ready",
  recoLessonLabel: "Continue — read lesson",
  recoLessonTitle: "Read the next lesson",
  recoQuizLabel: "Continue — take quiz",
  recoQuizTitle: "Take the next quiz",
  recoDoneLabel: "All caught up",
  recoDoneTitle: "All authored content complete",
  recoDoneMessage:
    "Every authored concept is passing. New content lands as it's authored.",
  whatYoullLearnHeading: "What you'll learn",
  passLabel: "pass",
  belowPassGateLabel: "below pass-gate",
};

/**
 * Resolved copy — pack overrides merged onto defaults. Always
 * complete; components can use it without `??` fallbacks.
 */
export const copy: Required<PackCopy> = {
  ...DEFAULT_COPY,
  ...(ACTIVE_PACK.config.copy ?? {}),
};

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
