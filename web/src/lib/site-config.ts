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

export const siteConfig = {
  name: "CCA-F Prep",
  tagline: "Personal learning and development platform",
  description:
    "Adaptive self-study platform for the Claude Certified Architect — Foundations exam. Sections, concept lessons, quizzes, section tests, and mock exams.",
  url: "https://cca-f-prep.vercel.app",
  repoUrl: "https://github.com/palimkarakshay/cca-f-prep",
  // Routes Ask-Claude prompts to a dedicated Project so the exam-prep
  // system prompt + project knowledge persist across questions. Empty
  // string falls back to a fresh claude.ai/new chat.
  claudeProjectUrl:
    "https://claude.ai/project/019deb60-3da7-7585-b1ef-97577eabe2ef",
  claudeFallbackUrl: "https://claude.ai/new",
  nav: [
    {
      label: "Home",
      href: "/",
      icon: "home",
      mobile: true,
      match: ["/"],
    },
    {
      label: "Sections",
      href: "/#sections",
      icon: "layers",
      mobile: true,
      match: ["/section"],
    },
    {
      label: "Mock",
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
  ] as NavItem[],
} as const;

export type SiteConfig = typeof siteConfig;
