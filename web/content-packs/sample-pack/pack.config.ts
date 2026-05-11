/* ------------------------------------------------------------------
   Sample-pack pack config — a minimal alternate pack used to verify
   the content-swap mechanism. Different name, palette, icon, and
   AskAI provider from the cca-f-prep pack so a swap is visibly real.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "sample-pack",
  name: "Sample Learning Pack",
  shortName: "Learn",
  tagline: "A demo pack for the learning shell",
  description:
    "Tiny example content pack used to demonstrate that the app shell is fully content-agnostic. Two sections, three concepts, one mock exam.",
  url: "https://example.com",
  author: "your-name",
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
    // Generic /new fallback only — replace with your own project URL.
    projectUrl: "",
    fallbackUrl: "https://claude.ai/new",
    heading: "Ask Claude",
    description:
      "Build a prompt with this lesson + your question and open a fresh Claude chat with it pre-filled.",
  },
  manifest: {
    backgroundColor: "#0b1f2a",
    themeColor: "#0b1f2a",
    categories: ["education"],
  },
  theme: {
    light: {
      "--canvas": "#f6fafa",
      "--panel": "#ffffff",
      "--panel-2": "#eef5f5",
      "--border": "#dde7e8",
      "--ink": "#0b1f2a",
      "--muted": "#5b6f78",
      "--accent": "#0f8a82",
      "--accent-2": "#36b3aa",
      "--good": "#2f7a4a",
      "--bad": "#b53a3a",
      "--warn": "#b58c1a",
    },
    dark: {
      "--canvas": "#0b1f2a",
      "--panel": "#102a36",
      "--panel-2": "#163644",
      "--border": "#26485a",
      "--ink": "#e6edf0",
      "--muted": "#9fb1bd",
      "--accent": "#36b3aa",
      "--accent-2": "#5cc8c2",
      "--good": "#5fb878",
      "--bad": "#d96565",
      "--warn": "#d9c265",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
  iconImagePath: "/images/packs/final/sample-pack.jpg",
};
