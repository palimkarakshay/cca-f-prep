/* ------------------------------------------------------------------
   ContentPack contract.

   A *content pack* is a self-contained learning surface — its branding,
   navigation, curriculum (sections → concepts → lessons + quizzes →
   section tests + mock exams), PWA manifest, theme tokens, and the
   external links the app uses for "Ask AI" hand-offs.

   The app-shell (Next.js app, components, primitives, hooks, progress
   engine, recommendation engine, theme toggle) is content-agnostic.
   To swap content: change the import in `src/content/active-pack.ts`
   to point at a different pack under `content-packs/<pack-id>/`.

   The contract here is the public surface every pack must export.
------------------------------------------------------------------ */

import type { Curriculum } from "./curriculum-types";

export type NavIcon = "home" | "layers" | "award" | "trending-up";

export interface NavItem {
  label: string;
  href: string;
  /** Icon keyword resolved by BottomNav and Header. */
  icon?: NavIcon;
  /** Surface this item in the mobile bottom nav. Top header always shows it. */
  mobile?: boolean;
  /** Pathname prefixes that should mark this item active. */
  match?: string[];
}

export interface AskAIConfig {
  /** Long-lived chat URL (e.g. claude.ai project) used for prompt hand-off. Empty → use fallback. */
  projectUrl: string;
  /** Fresh-chat fallback URL for the same provider. */
  fallbackUrl: string;
  /** Visible heading for the panel — defaults to "Ask AI" if omitted. The "Open in X" button label is derived from this (drops a leading "Ask " prefix). */
  heading?: string;
  /** Sub-copy under the heading. */
  description?: string;
  /** Cap on inline prompt characters appended to the chat URL. Different providers / proxies have different URL limits; the rest still lands on the clipboard. Defaults to 6000. */
  maxPromptChars?: number;
}

/**
 * One step in the mastery progression. Packs override the default
 * 5-level system (Not started → Lesson read → Below 60% → Passing →
 * Strong) by supplying a custom array on `PackConfig.masteryLevels`.
 *
 * Order matters: the array is the ordered ladder from "no progress"
 * upward. Index 0 is "not started" and is always implicit (a learner
 * starts here regardless of how packs define the rest).
 */
export interface MasteryLevel {
  /** Visible label on the badge / meter / stats. */
  label: string;
  /** Minimum quiz score percentage (0–1) to land at this level. Omit for index 0 ("not started") and index 1 ("lesson read"); the engine never assigns these from a quiz score. */
  minScorePct?: number;
  /** Landing here triggers the "Drill" recommendation kind (i.e. the learner needs to re-read + retake before progressing). */
  isUnderwhelm?: boolean;
  /** Counts toward the "X concepts mastered" stat + dashboard progress bar + section-test eligibility. */
  countsAsMastered?: boolean;
  /** Visual hint for badges/meters. Defaults to "neutral". */
  tone?: "good" | "warn" | "bad" | "neutral";
}

/**
 * CSS custom-property tokens applied at the document root for this pack.
 * Light + dark variants. Values are CSS color strings or any other
 * legal CSS value. Keys must match the `:root` / `html.dark` shape in
 * `src/app/globals.css`. Optional — packs that omit a key inherit the
 * default in `globals.css`.
 */
export interface PackTheme {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

/**
 * Pack-overridable UI strings for surfaces whose default copy is
 * exam-coded ("Mock exams", "Section test", "below pass-gate"). A
 * non-exam pack (sewing, cooking, leadership coaching) overrides only
 * the labels that don't fit its domain; everything else inherits the
 * default. Resolved via `resolveCopy()` in `src/lib/site-config.ts`.
 */
export interface PackCopy {
  // Mock-exam surface — heading on dashboard panel + meta description
  // on /mock + the panel blurb. Default uses the word "Mock".
  mockExamsHeading?: string;
  mockExamsBlurb?: string;
  mockExamsMetaDescription?: string;

  // Section-test labels surfaced on dashboard cards + section detail
  // page + section-test runner.
  sectionTestSingular?: string;

  // Stats-panel + dashboard labels.
  conceptsMasteredLabel?: string;
  sectionsCompleteLabel?: string;
  bestMockScoreLabel?: string;
  studyStreakLabel?: string;

  // Recommendation banner kind labels (small uppercase eyebrow + big
  // headline). Defaults are exam-flavored.
  recoDrillLabel?: string;
  recoDrillTitle?: string;
  recoSectionTestLabel?: string;
  recoSectionTestTitle?: string;
  recoLessonLabel?: string;
  recoLessonTitle?: string;
  recoQuizLabel?: string;
  recoQuizTitle?: string;
  recoDoneLabel?: string;
  recoDoneTitle?: string;
  recoDoneMessage?: string;

  // Lesson-view callout heading.
  whatYoullLearnHeading?: string;

  // Quiz / mock pass-gate language.
  passLabel?: string;
  belowPassGateLabel?: string;
}

export interface PackConfig {
  /** Stable id, used in storage keys and manifest. Lowercase, kebab-case. */
  id: string;
  name: string;
  shortName?: string;
  tagline: string;
  description: string;
  /** Public URL of the deployed site for this pack. */
  url: string;
  /** Optional repo URL surfaced in the footer. */
  repoUrl?: string;
  /** Author / owner attribution surfaced in <meta name="author">. */
  author?: string;
  /** Primary nav. Item with href "/" is the home anchor and is hidden in the desktop header. */
  nav: NavItem[];
  /** Configures the AskAIPanel (heading defaults to "Ask AI"). */
  askAI: AskAIConfig;
  /** Optional terminology overrides for exam-coded UI strings. See PackCopy. */
  copy?: PackCopy;
  /** PWA manifest payload. The icons resolve to /icon.svg and /icon-maskable.svg, served from the active pack. */
  manifest: {
    backgroundColor: string;
    themeColor: string;
    categories?: string[];
  };
  /** Optional theme tokens. Inlined into the document <head> at request time. */
  theme?: PackTheme;
  /** Override the default 5-level mastery taxonomy. See MasteryLevel. */
  masteryLevels?: MasteryLevel[];
  /** SVG markup for the foreground icon. Used at /icon.svg and embedded in the manifest. */
  iconSvg: string;
  /** SVG markup for the maskable icon. Used at /icon-maskable.svg. */
  iconMaskableSvg: string;
  /**
   * Optional public path to a raster icon (PNG/JPG) generated by the
   * fal.ai workflow at `.github/workflows/generate-images.yml`. When set,
   * the picker renders this instead of `iconSvg`. Fall-back semantics:
   * a pack with no `iconImagePath` still works — the picker reads
   * `iconSvg` exactly as before.
   */
  iconImagePath?: string;
  /**
   * Audience this pack targets. `consumer` packs surface on the
   * public picker at `/`. `b2b` packs surface only on the Adept
   * area at `/adept` (company-approved, SME-verified content with
   * its own create/edit/validate/deploy workbench). Omitting the
   * field defaults to `consumer` so existing packs don't need to
   * declare it explicitly.
   */
  audience?: "consumer" | "b2b";
  /**
   * Optional pre-flight gate surfaced on the pack home page above
   * the section list. Use for packs that lead to a real-world
   * certification or step with hard prerequisites (the PMP exam's
   * 35 contact hours + work-experience requirement, for example).
   * The card is a self-check, not a hard block — but it lets a
   * learner discover early that this journey isn't yet a fit.
   * Omit the field entirely to skip the card.
   */
  prerequisites?: PackPrerequisites;
}

export interface PackPrerequisiteItem {
  /** Short label shown in the checklist. */
  label: string;
  /** Optional supporting note rendered under the label in muted text. */
  detail?: string;
}

export interface PackPrerequisites {
  /** Heading on the card (e.g. "Before you begin"). */
  heading: string;
  /** One-paragraph framing of who this journey is for. */
  intro: string;
  /** Items the learner should self-check before starting. */
  requirements: PackPrerequisiteItem[];
  /** Optional list of practical assumptions (cost, time, environment). */
  assumptions?: PackPrerequisiteItem[];
  /** Optional links to authoritative sources (official exam page, registration). */
  externalLinks?: { label: string; href: string; }[];
  /** Optional disclaimer / "this is not a fit if…" copy. */
  notForYouIf?: string[];
}

export interface ContentPack {
  config: PackConfig;
  curriculum: Curriculum;
}
