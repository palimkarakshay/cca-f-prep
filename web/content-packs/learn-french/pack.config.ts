/* ------------------------------------------------------------------
   French for English speakers — pack config.

   A practical "get by in French" pack for absolute beginners. The
   target use case is everyday life in France or Quebec — greeting
   people, ordering food, reading signs — not academic study. The
   shell's exam-coded copy is overridden to match a language-course
   tone ("Final scenario" instead of "Mock exam", "Module check"
   instead of "Section test", etc.).
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "learn-french",
  name: "French for English Speakers",
  shortName: "French",
  tagline: "Greet, order, read signs — get by in France or Quebec",
  description:
    "A practical beginner's course for English speakers with zero French. Greetings, café and restaurant phrases, asking for directions, reading street signs and notices — enough to navigate everyday life in France or Quebec.",
  url: "https://example.com/learn-french",
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
      label: "Scenarios",
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
      "Paste this lesson into a chat with your question. Claude is a patient French tutor — try asking for extra examples, pronunciation tips, or a Quebec-vs-France comparison.",
  },
  copy: {
    mockExamsHeading: "Real-life scenarios",
    mockExamsBlurb:
      "End-to-end role-plays — order a coffee, ask for directions, read a notice. Apply everything you've learned in a realistic situation.",
    mockExamsMetaDescription:
      "Real-world French scenarios — café, restaurant, street signs, asking for directions. Each pairs a short brief with a multi-question check.",
    sectionTestSingular: "Module check",
    conceptsMasteredLabel: "Phrases mastered",
    sectionsCompleteLabel: "Modules complete",
    bestMockScoreLabel: "Best scenario score",
    studyStreakLabel: "Practice streak",
    recoDrillLabel: "Practice",
    recoDrillTitle: "Re-try a tricky phrase",
    recoSectionTestLabel: "Module check",
    recoSectionTestTitle: "Module check ready",
    recoLessonLabel: "Continue — next lesson",
    recoLessonTitle: "Read the next lesson",
    recoQuizLabel: "Continue — quick check",
    recoQuizTitle: "Quick phrase check",
    recoDoneLabel: "All caught up",
    recoDoneTitle: "You can get by in French",
    recoDoneMessage:
      "You've learned every survival phrase in this course. Try a real-life scenario, or come back for the intermediate module.",
    whatYoullLearnHeading: "What you'll be able to do",
    passLabel: "got it",
    belowPassGateLabel: "needs more practice",
  },
  masteryLevels: [
    { label: "Not started", tone: "neutral" },
    { label: "Read the lesson", tone: "neutral" },
    {
      label: "Try again",
      minScorePct: 0,
      isUnderwhelm: true,
      tone: "warn",
    },
    {
      label: "Practiced",
      minScorePct: 0.5,
      countsAsMastered: true,
      tone: "good",
    },
    {
      label: "Mastered",
      minScorePct: 0.9,
      countsAsMastered: true,
      tone: "good",
    },
  ],
  manifest: {
    backgroundColor: "#0a2a66",
    themeColor: "#0a2a66",
    categories: ["education", "lifestyle"],
  },
  theme: {
    light: {
      "--canvas": "#f7f8fc",
      "--panel": "#ffffff",
      "--panel-2": "#eaeef7",
      "--border": "#d5dcec",
      "--ink": "#0a2a66",
      "--muted": "#5c6a8a",
      "--accent": "#0055a4",
      "--accent-2": "#3a7dc8",
      "--good": "#2f7a4a",
      "--bad": "#ef4135",
      "--warn": "#b58c1a",
    },
    dark: {
      "--canvas": "#091633",
      "--panel": "#102046",
      "--panel-2": "#162b5a",
      "--border": "#2a3e74",
      "--ink": "#e8ecf7",
      "--muted": "#a5b1cf",
      "--accent": "#3a7dc8",
      "--accent-2": "#6aa1de",
      "--good": "#7ec48b",
      "--bad": "#f5746a",
      "--warn": "#e3c97a",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
  iconImagePath: "/images/packs/final/learn-french.jpg",
};
