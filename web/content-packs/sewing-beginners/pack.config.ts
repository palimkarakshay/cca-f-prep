/* ------------------------------------------------------------------
   Sewing for Beginners pack config.

   A non-exam pack used to prove that the shell handles arbitrary
   topic content. Overrides exam-coded UI copy ("Mock exams" -> "Final
   projects", "Section test" -> "Module check", etc.) and omits Bloom
   taxonomy on its concepts.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "sewing-beginners",
  name: "Sewing for Beginners",
  shortName: "Sew",
  tagline: "Hand-stitching to first machine seam, in eight short lessons",
  description:
    "A friendly self-paced course covering threading a needle, four foundational hand stitches, machine setup, and a finished tote-bag project.",
  url: "https://example.com/sewing-beginners",
  author: "your-name",
  nav: [
    { label: "Home", href: "/", icon: "home", mobile: true, match: ["/"] },
    {
      label: "Modules",
      href: "/#sections",
      icon: "layers",
      mobile: true,
      match: ["/section"],
    },
    {
      label: "Projects",
      href: "/mock",
      icon: "award",
      mobile: true,
      match: ["/mock"],
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
    heading: "Ask a tutor",
    description:
      "Paste this lesson into a chat with your question. Claude makes a friendly tutor for technique troubleshooting.",
  },
  copy: {
    mockExamsHeading: "Final projects",
    mockExamsBlurb:
      "Hands-on capstones — you'll make a finished item using the techniques you've learned.",
    mockExamsMetaDescription:
      "Capstone projects to apply what you've learned. Each project pairs a written brief with a self-checked review.",
    sectionTestSingular: "Module check",
    conceptsMasteredLabel: "Techniques learned",
    sectionsCompleteLabel: "Modules complete",
    bestMockScoreLabel: "Best project review",
    studyStreakLabel: "Practice streak",
    recoDrillLabel: "Practice",
    recoDrillTitle: "Re-try a tricky technique",
    recoSectionTestLabel: "Module check",
    recoSectionTestTitle: "Module check ready",
    recoLessonLabel: "Continue — read the next lesson",
    recoLessonTitle: "Read the next lesson",
    recoQuizLabel: "Continue — quick check",
    recoQuizTitle: "Quick technique check",
    recoDoneLabel: "All caught up",
    recoDoneTitle: "You've got the basics",
    recoDoneMessage:
      "You've learned every technique. Try a final project, or come back for advanced modules.",
    whatYoullLearnHeading: "What you'll be able to do",
    passLabel: "got it",
    belowPassGateLabel: "needs more practice",
  },
  manifest: {
    backgroundColor: "#3a2418",
    themeColor: "#3a2418",
    categories: ["education", "lifestyle"],
  },
  theme: {
    light: {
      "--canvas": "#fbf6ee",
      "--panel": "#ffffff",
      "--panel-2": "#f3ead9",
      "--border": "#e2d5bb",
      "--ink": "#3a2418",
      "--muted": "#7a6857",
      "--accent": "#b35d2c",
      "--accent-2": "#d28b5e",
      "--good": "#3f7f4a",
      "--bad": "#a34646",
      "--warn": "#a8862c",
    },
    dark: {
      "--canvas": "#241510",
      "--panel": "#321e16",
      "--panel-2": "#3f261b",
      "--border": "#5a3a2a",
      "--ink": "#f3e7d4",
      "--muted": "#b39c84",
      "--accent": "#d28b5e",
      "--accent-2": "#f0a37b",
      "--good": "#7ec48b",
      "--bad": "#dd8484",
      "--warn": "#e3c97a",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
};
