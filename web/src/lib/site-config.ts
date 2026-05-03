export const siteConfig = {
  name: "CCA-F Prep",
  tagline: "Personal learning and development platform",
  description:
    "Adaptive self-study platform for the Claude Certified Architect — Foundations exam. Sections, concept lessons, quizzes, section tests, and mock exams.",
  url: "https://cca-f-prep.vercel.app",
  repoUrl: "https://github.com/palimkarakshay/cca-f-prep",
  nav: [
    { label: "Dashboard", href: "/" },
    { label: "Mock exams", href: "/mock" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
