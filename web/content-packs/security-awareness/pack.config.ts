/* ------------------------------------------------------------------
   Security Awareness — general B2B pack.

   Compliance-baseline content: phishing recognition, password
   hygiene + MFA, data tiers, incident reporting. Common ask
   across customers; the workbench is where each company swaps
   the policy specifics (data tier names, IR channel, MFA tool).
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "security-awareness",
  name: "Security awareness fundamentals",
  shortName: "Security",
  tagline: "Phishing, passwords, data tiers, incident reporting.",
  description:
    "Compliance-baseline B2B pack — phishing in 30 seconds, password + MFA hygiene, data classification, incident reporting. SMEs swap in your company's policy specifics.",
  url: "https://example.com/security-awareness",
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
    heading: "Ask your security team",
    description:
      "In a real Adept rollout this routes to your company's security Claude project; in the demo it opens a fresh Claude chat.",
  },
  manifest: {
    backgroundColor: "#064e3b",
    themeColor: "#064e3b",
    categories: ["productivity", "education"],
  },
  theme: {
    light: {
      "--canvas": "#f0fdf4",
      "--panel": "#ffffff",
      "--panel-2": "#dcfce7",
      "--border": "#bbf7d0",
      "--ink": "#064e3b",
      "--muted": "#365314",
      "--accent": "#047857",
      "--accent-2": "#065f46",
      "--good": "#15803d",
      "--bad": "#a32f2f",
      "--warn": "#8a6a10",
    },
    dark: {
      "--canvas": "#022c22",
      "--panel": "#064e3b",
      "--panel-2": "#065f46",
      "--border": "#047857",
      "--ink": "#d1fae5",
      "--muted": "#6ee7b7",
      "--accent": "#34d399",
      "--accent-2": "#6ee7b7",
      "--good": "#5fb878",
      "--bad": "#d96565",
      "--warn": "#d9c265",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
  audience: "b2b",
};
