/* ------------------------------------------------------------------
   Acme Onboarding — B2B demo pack.

   Shows what a company-specific workflow pack looks like in the
   Adept (B2B) stream: a short, single-section pack teaching a
   real internal process (logging hours to your manager). The
   content is fictional but its shape mirrors what an SME-verified
   production pack would carry — concrete steps, a single tool,
   one edge-case lesson, and a summary lesson.

   Pair this pack with the /for-teams page: it is the demo the
   sales conversation points at to show "this is what a verified
   company pack looks like — yours would use your tool and your
   policy".
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "acme-onboarding",
  name: "Acme Onboarding",
  shortName: "Acme",
  tagline: "How new employees log hours at Acme Co.",
  description:
    "A demo B2B pack: 4 concepts teaching a fictional company's hour-logging workflow. Shows what an SME-verified, company-approved Adept pack looks like end-to-end.",
  url: "https://example.com/acme-onboarding",
  author: "Acme L&D (demo)",
  nav: [
    { label: "Home", href: "/", icon: "home", mobile: true, match: ["/"] },
    {
      label: "Sections",
      href: "/#sections",
      icon: "layers",
      mobile: true,
      match: ["/section"],
    },
    {
      label: "Progress",
      href: "/#progress",
      icon: "trending-up",
      mobile: true,
      match: [],
    },
  ],
  askAI: {
    projectUrl: "",
    fallbackUrl: "https://claude.ai/new",
    heading: "Ask the L&D team",
    description:
      "Stuck on the workflow? In a real Adept deployment this routes to your company's L&D Claude project; in the demo it opens a fresh Claude chat.",
  },
  manifest: {
    backgroundColor: "#1e293b",
    themeColor: "#1e293b",
    categories: ["productivity", "education"],
  },
  // Warm-corporate palette — slate ink + amber accent. Tested for AA
  // contrast at small text sizes (white-on-accent button ≥ 4.5:1).
  theme: {
    light: {
      "--canvas": "#f8fafc",
      "--panel": "#ffffff",
      "--panel-2": "#f1f5f9",
      "--border": "#e2e8f0",
      "--ink": "#0f172a",
      "--muted": "#475569",
      "--accent": "#b45309",
      "--accent-2": "#92400e",
      "--good": "#1f6b3f",
      "--bad": "#a32f2f",
      "--warn": "#8a6a10",
    },
    dark: {
      "--canvas": "#0f172a",
      "--panel": "#1e293b",
      "--panel-2": "#273449",
      "--border": "#334155",
      "--ink": "#e2e8f0",
      "--muted": "#94a3b8",
      "--accent": "#fbbf24",
      "--accent-2": "#fcd34d",
      "--good": "#5fb878",
      "--bad": "#d96565",
      "--warn": "#d9c265",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
};
