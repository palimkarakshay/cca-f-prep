/* ------------------------------------------------------------------
   CCA-F Prep pack config.

   This is the original content surface for the app — everything that
   is specific to the Anthropic Claude Certified Architect — Foundations
   exam (branding, copy, theme palette, icon, Claude.ai project URL).
   The app shell consumes this via `src/content/active-pack.ts`.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "cca-f-prep",
  name: "CCA-F Prep",
  shortName: "CCA-F Prep",
  tagline: "Personal learning and development platform",
  description:
    "Adaptive self-study platform for the Claude Certified Architect — Foundations exam. Sections, concept lessons, quizzes, section tests, and mock exams.",
  url: "https://cca-f-prep.vercel.app",
  repoUrl: "https://github.com/palimkarakshay/cca-f-prep",
  author: "palimkarakshay",
  nav: [
    { label: "Home", href: "/", icon: "home", mobile: true, match: ["/"] },
    {
      label: "Sections",
      href: "/#sections",
      icon: "layers",
      mobile: true,
      match: ["/section"],
    },
    { label: "Mock", href: "/mock", icon: "award", mobile: true, match: ["/mock"] },
    {
      label: "Progress",
      href: "/#progress",
      icon: "trending-up",
      mobile: true,
      match: [],
    },
  ],
  askAI: {
    // Routes Ask-Claude prompts to a dedicated Project so the exam-prep
    // system prompt + project knowledge persist across questions. Empty
    // string falls back to a fresh claude.ai/new chat.
    projectUrl: "https://claude.ai/project/019deb60-3da7-7585-b1ef-97577eabe2ef",
    fallbackUrl: "https://claude.ai/new",
    heading: "Ask Claude",
    description:
      "Build a prompt with this lesson + your question, copy it, and open the Claude Project in a new tab.",
  },
  manifest: {
    backgroundColor: "#0e0f12",
    themeColor: "#0e0f12",
    categories: ["education", "productivity"],
  },
  theme: {
    // Light values are tightened for WCAG AA at small text sizes —
    // see PR #9 commit c0e0c33 (web/src/app/globals.css) for the
    // contrast math. Re-introducing the brand-leaning #c45a36 /
    // #d97757 here regresses axe: white-on-accent button drops to
    // 4.31:1 against AA's 4.5 threshold; text-(--accent-2) on canvas
    // drops to ~2.5:1.
    light: {
      "--canvas": "#fafaf9",
      "--panel": "#ffffff",
      "--panel-2": "#f4f4f3",
      "--border": "#e5e5e3",
      "--ink": "#1a1a1a",
      "--muted": "#5a5a5a",
      "--accent": "#b04829",
      "--accent-2": "#913a1d",
      "--good": "#1f6b3f",
      "--bad": "#a32f2f",
      "--warn": "#8a6a10",
    },
    dark: {
      "--canvas": "#0e0f12",
      "--panel": "#15171c",
      "--panel-2": "#1b1e25",
      "--border": "#2a2e38",
      "--ink": "#e6e8ee",
      "--muted": "#8a92a3",
      "--accent": "#d97757",
      "--accent-2": "#f0a37b",
      "--good": "#5fb878",
      "--bad": "#d96565",
      "--warn": "#d9c265",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
};
