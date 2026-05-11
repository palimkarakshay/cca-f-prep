/* ------------------------------------------------------------------
   New-manager basics — general B2B pack.

   First-90-days content for newly promoted engineering / ops
   managers: delegation, status updates, hiring loops, coaching
   vs course-correcting. Higher-stakes than the comms pack —
   typically the customer's L&D team co-authors with internal
   leadership before deploy.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "new-manager-basics",
  name: "New-manager basics",
  shortName: "Manager",
  tagline: "First 90 days as a new manager.",
  description:
    "B2B pack for newly-promoted managers: delegation, status updates upward, running a hiring loop, coaching vs course-correcting. SMEs swap in your company's leadership principles.",
  url: "https://example.com/new-manager-basics",
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
    heading: "Ask your skip-level",
    description:
      "In a real Adept rollout this routes to your company's leadership Claude project; in the demo it opens a fresh Claude chat.",
  },
  manifest: {
    backgroundColor: "#451a03",
    themeColor: "#451a03",
    categories: ["productivity", "education"],
  },
  theme: {
    light: {
      "--canvas": "#fff7ed",
      "--panel": "#ffffff",
      "--panel-2": "#ffedd5",
      "--border": "#fed7aa",
      "--ink": "#431407",
      "--muted": "#7c2d12",
      "--accent": "#c2410c",
      "--accent-2": "#9a3412",
      "--good": "#1f6b3f",
      "--bad": "#a32f2f",
      "--warn": "#8a6a10",
    },
    dark: {
      "--canvas": "#1c0d05",
      "--panel": "#451a03",
      "--panel-2": "#7c2d12",
      "--border": "#9a3412",
      "--ink": "#ffedd5",
      "--muted": "#fdba74",
      "--accent": "#fb923c",
      "--accent-2": "#fdba74",
      "--good": "#5fb878",
      "--bad": "#d96565",
      "--warn": "#d9c265",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
  audience: "b2b",
};
