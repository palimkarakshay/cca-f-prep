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
  /** Visible heading for the panel — defaults to "Ask Claude" if omitted. */
  heading?: string;
  /** Sub-copy under the heading. */
  description?: string;
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
  /** Configures the AskAIPanel ("Ask Claude" by default). */
  askAI: AskAIConfig;
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
