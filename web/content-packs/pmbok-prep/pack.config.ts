/* ------------------------------------------------------------------
   PMBOK 8th Edition Prep — pack config.

   A study pack for project managers preparing for the PMP exam (or
   any PMBOK 8e knowledge check). Tone is exam-prep, not aspirational
   leadership coaching: short principles, named processes, definite
   answers to scenario MCQs. Content is paraphrased from the 2025
   PMBOK® Guide and Standard for Project Management — PMI's wording
   is not reproduced. PMBOK and PMP are trademarks of PMI.
------------------------------------------------------------------ */

import type { PackConfig } from "./_types";
import { ICON_SVG, ICON_MASKABLE_SVG } from "./icons";

export const packConfig: PackConfig = {
  id: "pmbok-prep",
  name: "PMBOK 8e Prep",
  shortName: "PMBOK",
  tagline: "Six principles, five focus areas, seven domains — exam-ready",
  description:
    "Study pack for the PMBOK Guide 8th Edition (2025). Covers the six refined principles, the five focus areas (formerly Process Groups), the seven Performance Domains (Governance, Scope, Schedule, Finance, Stakeholders, Resources, Risk), tailoring, and exam strategy. Includes flashcards, quizzes, games, section tests, and a 30-question mock exam. Progress is saved locally in your browser.",
  url: "https://lms-hobby.vercel.app",
  author: "cca-f-prep",
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
      label: "Mock exam",
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
    heading: "Ask a PMBOK tutor",
    description:
      "Paste this lesson plus your question into a fresh chat. Claude is a strong PMP study coach — try asking for additional worked examples, a comparison across PMBOK editions (6e vs 7e vs 8e), or a tougher scenario.",
  },
  copy: {
    mockExamsHeading: "Mock exams",
    mockExamsBlurb:
      "Full-length, timed practice exams in the PMP scenario style. Each question explains the principle behind the right answer.",
    mockExamsMetaDescription:
      "30-question scenario-style mock exam covering all six PMBOK 8e principles, five focus areas, and seven performance domains.",
    sectionTestSingular: "Section test",
    conceptsMasteredLabel: "Concepts mastered",
    sectionsCompleteLabel: "Sections complete",
    bestMockScoreLabel: "Best mock score",
    studyStreakLabel: "Study streak",
    recoDrillLabel: "Practice",
    recoDrillTitle: "Re-try a tricky concept",
    recoSectionTestLabel: "Section test",
    recoSectionTestTitle: "Section test ready",
    recoLessonLabel: "Continue — next lesson",
    recoLessonTitle: "Read the next lesson",
    recoQuizLabel: "Continue — quick check",
    recoQuizTitle: "Quick concept check",
    recoDoneLabel: "All caught up",
    recoDoneTitle: "Mock-exam ready",
    recoDoneMessage:
      "You've worked through every concept. Sit a full mock exam under timed conditions and treat anything below 70% as a study gap.",
    whatYoullLearnHeading: "What you'll be able to do",
    passLabel: "pass",
    belowPassGateLabel: "below pass gate",
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
      minScorePct: 0.6,
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
    backgroundColor: "#0e1d3a",
    themeColor: "#0e1d3a",
    categories: ["education", "business", "productivity"],
  },
  theme: {
    light: {
      "--canvas": "#f6f8fc",
      "--panel": "#ffffff",
      "--panel-2": "#eaeef7",
      "--border": "#d3dbeb",
      "--ink": "#0e1d3a",
      "--muted": "#566481",
      "--accent": "#1a3e8f",
      "--accent-2": "#3f6dca",
      "--good": "#2f7a4a",
      "--bad": "#b53a3a",
      "--warn": "#a8862c",
    },
    dark: {
      "--canvas": "#0a142b",
      "--panel": "#11203f",
      "--panel-2": "#162a52",
      "--border": "#28406e",
      "--ink": "#e6ecf7",
      "--muted": "#a4b1cd",
      "--accent": "#7aa0e8",
      "--accent-2": "#f0b952",
      "--good": "#7ec48b",
      "--bad": "#dd8484",
      "--warn": "#e3c97a",
    },
  },
  iconSvg: ICON_SVG,
  iconMaskableSvg: ICON_MASKABLE_SVG,
  iconImagePath: "/images/packs/final/pmbok-prep.jpg",
};
