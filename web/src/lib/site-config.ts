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
  MasteryLevel,
  NavIcon,
  NavItem,
  PackConfig,
  PackCopy,
} from "@/content/pack-types";

export type { MasteryLevel, NavIcon, NavItem, PackCopy };

/**
 * Default UI copy. Exam-coded — the original CCA-F-prep vocabulary.
 * Packs override individual keys via `pack.config.copy`. Resolved here
 * so components can do `copy.mockExamsHeading` safely.
 */
/* ------------------------------------------------------------------
   Default UI copy. The curriculum unit terminology defaults to the
   industry-standard learner ladder used by Coursera / edX / Khan
   Academy / LinkedIn Learning / Skilljar (Anthropic Academy's CMS):

       Course  ⊇  Module  ⊇  Lesson  ⊇  Quiz

   Packs that prefer exam-coded vocabulary ("Section test", "Concepts
   mastered") override only the keys that don't fit them. The shell
   reads from `copy` so each component stays terminology-agnostic.
------------------------------------------------------------------ */
export const DEFAULT_COPY: Required<PackCopy> = {
  mockExamsHeading: "Practice exams",
  mockExamsBlurb: "Independent of module progress. Use for calibration.",
  mockExamsMetaDescription:
    "Independent calibration exams covering all modules. Use them to gauge readiness before the real assessment.",
  sectionTestSingular: "Module quiz",
  conceptsMasteredLabel: "Lessons mastered",
  sectionsCompleteLabel: "Modules complete",
  bestMockScoreLabel: "Best practice exam score",
  studyStreakLabel: "Study streak",
  recoDrillLabel: "Drill",
  recoDrillTitle: "Re-take a missed lesson",
  recoSectionTestLabel: "Module quiz",
  recoSectionTestTitle: "Module quiz ready",
  recoLessonLabel: "Continue — read lesson",
  recoLessonTitle: "Read the next lesson",
  recoQuizLabel: "Continue — take quiz",
  recoQuizTitle: "Take the next quiz",
  recoDoneLabel: "All caught up",
  recoDoneTitle: "All authored content complete",
  recoDoneMessage:
    "Every authored lesson is passing. New content lands as it's authored.",
  whatYoullLearnHeading: "What you'll learn",
  passLabel: "pass",
  belowPassGateLabel: "below pass-gate",
  courseSingular: "Course",
  coursePlural: "Courses",
  moduleSingular: "Module",
  modulePlural: "Modules",
  lessonSingular: "Lesson",
  lessonPlural: "Lessons",
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
 * Default 5-level mastery taxonomy — the original CCA-F vocabulary.
 * Packs override the whole array via `pack.config.masteryLevels`.
 *
 * Conventions baked into the engine (see `progress.ts`):
 *   - Index 0 = "not started" (no progress yet).
 *   - Index 1 = "lesson read" (set by markLessonRead, not by score).
 *   - Indices 2..N = score-driven; engine picks the highest level
 *     whose `minScorePct` <= the attempt's score / total.
 *   - Underwhelm (drill trigger) = the level where `isUnderwhelm`
 *     is true. Recommendation engine uses this instead of a literal
 *     mastery=2 check.
 *   - Mastered count = sum of concepts whose level has
 *     `countsAsMastered`. Stats panel + section-test eligibility
 *     read this.
 */
export const DEFAULT_MASTERY_LEVELS: MasteryLevel[] = [
  { label: "Not started", tone: "neutral" },
  { label: "Lesson read", tone: "neutral" },
  { label: "Below 60%", minScorePct: 0, isUnderwhelm: true, tone: "bad" },
  {
    label: "Passing",
    minScorePct: 0.6,
    countsAsMastered: true,
    tone: "good",
  },
  {
    label: "Strong",
    minScorePct: 0.9,
    countsAsMastered: true,
    tone: "good",
  },
];

/**
 * Resolved mastery ladder. If the pack supplies `masteryLevels`,
 * the array is used as-is. Otherwise the default 5-level system
 * applies. Engine code reads this instead of hardcoding.
 */
export const masteryLevels: MasteryLevel[] =
  ACTIVE_PACK.config.masteryLevels ?? DEFAULT_MASTERY_LEVELS;

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
