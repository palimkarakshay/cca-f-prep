import nextCore from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCore,
  ...nextTs,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Pack-coupling guard: presentational primitives + game UIs + the new
  // section-tab panels must NOT import the cca-f-prep singletons. They
  // accept Section / Concept / Flashcard / SectionMeta / packId as props
  // from page-level loaders so the same components work for any pack.
  // The pack-aware helpers (`getSectionFrom`, `getFlashcards`, etc. from
  // curriculum-loader, plus everything under `pack-*`) are fine.
  {
    files: [
      "src/components/ui/**/*.{ts,tsx}",
      "src/components/primitives/**/*.{ts,tsx}",
      "src/components/games/**/*.{ts,tsx}",
      "src/components/section/SectionTabs.tsx",
      "src/components/section/GoalsPanel.tsx",
      "src/components/section/FlashcardsPanel.tsx",
      "src/components/section/GamesPanel.tsx",
      "src/components/section/QuizLauncherPanel.tsx",
      "src/components/section/MiniGameCard.tsx",
      "src/components/section/games-catalog.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/content/curriculum",
              message:
                "Pack-coupling: receive Section/Concept as props from a page-level loader (use getSectionFrom(pack.curriculum, id) on the page).",
            },
            {
              name: "@/content/section-meta",
              message:
                "Pack-coupling: receive SectionMeta as a prop. Page-level loader can still call getSectionMeta.",
            },
            {
              name: "@/content/domain-map",
              message:
                "Pack-coupling: receive `domain` as a prop or call getConceptDomain in a parent.",
            },
            {
              name: "@/content/domains",
              message:
                "Pack-coupling: receive CCAFDomainInfo as a prop from a parent that called getConceptDomain.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "e2e/**",
      "playwright-report/**",
      // Pack-authored curriculum files mark themselves with their own
      // /* eslint-disable */ header — no global ignore needed here.
    ],
  },
];

export default eslintConfig;
