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
  /** SVG markup for the foreground icon. Used at /icon.svg and embedded in the manifest. */
  iconSvg: string;
  /** SVG markup for the maskable icon. Used at /icon-maskable.svg. */
  iconMaskableSvg: string;
}

export interface ContentPack {
  config: PackConfig;
  curriculum: Curriculum;
}
