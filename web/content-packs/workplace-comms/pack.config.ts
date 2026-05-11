/* ------------------------------------------------------------------
   Workplace Communication — general B2B pack.

   Universal soft skills: async vs sync, status updates, productive
   1:1s, giving feedback. Pre-approved by Curio L&D as a baseline
   library entry — customers swap any concept via the SME workbench
   without rewriting from scratch.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "workplace-comms",
  name: "Effective workplace communication",
  shortName: "Comms",
  tagline: "Async writing, status updates, 1:1s, feedback.",
  description:
    "General B2B pack — pre-approved baseline content on async writing, status updates, productive 1:1s, and feedback that lands. Customers swap any concept via the SME workbench.",
  url: "https://example.com/workplace-comms",
  author: "Curio L&D (general library)",
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
    heading: "Ask your L&D team",
    description:
      "In a real Adept rollout this routes to your company's L&D Claude project; in the demo it opens a fresh Claude chat.",
  },
  manifest: {
    backgroundColor: "#1e1b4b",
    themeColor: "#1e1b4b",
    categories: ["productivity", "education"],
  },
  theme: {
    light: {
      "--canvas": "#fafafa",
      "--panel": "#ffffff",
      "--panel-2": "#f1f5f9",
      "--border": "#e2e8f0",
      "--ink": "#1e1b4b",
      "--muted": "#475569",
      "--accent": "#4338ca",
      "--accent-2": "#312e81",
      "--good": "#1f6b3f",
      "--bad": "#a32f2f",
      "--warn": "#8a6a10",
    },
    dark: {
      "--canvas": "#1e1b4b",
      "--panel": "#272560",
      "--panel-2": "#312e81",
      "--border": "#4338ca",
      "--ink": "#e0e7ff",
      "--muted": "#a5b4fc",
      "--accent": "#a5b4fc",
      "--accent-2": "#c7d2fe",
      "--good": "#5fb878",
      "--bad": "#d96565",
      "--warn": "#d9c265",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
  iconImagePath: "/images/packs/final/workplace-comms.jpg",
  audience: "b2b",
};
