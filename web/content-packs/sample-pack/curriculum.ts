/* ------------------------------------------------------------------
   Sample-pack curriculum — minimal example to prove the swap works.

   Shape is documented in `src/content/curriculum-types.ts`. To author
   a real pack, replace this file with your own sections / concepts /
   quizzes / mock exams (or copy the cca-f-prep curriculum and edit).
------------------------------------------------------------------ */

import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    {
      id: "s1-foundations",
      n: 1,
      title: "Foundations",
      blurb:
        "Two starter concepts that show how lessons + quizzes + section tests render with no exam-specific content.",
      concepts: [
        {
          id: "c1-1",
          code: "C1.1",
          title: "Hello, learner",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "This is a sample lesson. The app shell renders the same surface (table-of-contents, scroll-progress bar, mastery badge, simplify toggle, Ask-AI panel) regardless of which content pack is loaded.",
              "Replace this paragraph with your own teaching prose. Each `paragraphs[]` entry becomes a paragraph in the lesson body. Headings are inferred from `## Heading` lines.",
            ],
            keyPoints: [
              "Lessons are plain prose authored in the curriculum data file.",
              "Quizzes evidence learning; section tests gate the next section.",
              "All progress (lesson read, quiz attempts, section pass) lives in localStorage.",
            ],
            simplified: {
              oneLiner: "The app renders content; you author the content.",
              paragraphs: [
                "Pick a topic, write 2–3 paragraphs, list 2–3 key points, and add a 2–3 question quiz. The app handles the rest.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What lives in the content pack and what lives in the app shell?",
                options: {
                  A: "Both the lesson data and the React components live in the pack.",
                  B: "The lesson + quiz data lives in the pack; React components live in the shell.",
                  C: "Everything lives in the shell; the pack is just a logo.",
                  D: "The pack contains only the manifest and icon.",
                },
                correct: "B",
                explanations: {
                  A: "Components are part of the framework, not the content.",
                  B: "Correct — content (curriculum, branding, theme) is in the pack; framework (Next.js, components, primitives, hooks, progress engine) is the shell.",
                  C: "The pack contains the curriculum, branding, theme, and AskAI config.",
                  D: "The pack contains curriculum + branding + theme — much more than just an icon.",
                },
                principle:
                  "Pack = content + branding + theme. Shell = framework + components + engines.",
              },
            ],
          },
        },
        {
          id: "c1-2",
          code: "C1.2",
          title: "Swapping a content pack",
          bloom: "A",
          lesson: {
            status: "ready",
            paragraphs: [
              "To swap content, change a single import in `src/content/active-pack.ts`. Every dependent surface — dashboard, sections, concepts, quizzes, sitemap, llms.txt, manifest, icons — re-derives from the new pack.",
              "Storage keys are namespaced with the pack id, so different packs do not collide on a single browser. Switching packs preserves the previous pack's progress; switching back resumes where you left off.",
            ],
            keyPoints: [
              "One swap-point: `src/content/active-pack.ts`.",
              "Storage keys are namespaced: `<pack-id>:progress:v1`.",
              "Tests + e2e read pack metadata, not hardcoded brand strings.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "How do you switch the app to a different content pack?",
                options: {
                  A: "Re-author every component to use the new content.",
                  B: "Set an environment variable on the build.",
                  C: "Change a single import in `src/content/active-pack.ts`.",
                  D: "Fork the repo and delete the unused packs.",
                },
                correct: "C",
                explanations: {
                  A: "Components are content-agnostic — no rewrite needed.",
                  B: "Build env vars work too, but the canonical entry point is the static import.",
                  C: "Correct — one import. Tree-shaking eliminates the inactive packs from the bundle.",
                  D: "You can keep multiple packs co-located; only the import-pointer matters.",
                },
                principle: "Content swap is a single import change.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Which file is the single swap-point for changing the active content pack?",
            options: {
              A: "src/lib/site-config.ts",
              B: "src/content/active-pack.ts",
              C: "src/content/curriculum.ts",
              D: "next.config.ts",
            },
            correct: "B",
            principle: "Active-pack indirection: one import, one file.",
          },
          {
            n: 2,
            question: "Where is per-user progress stored?",
            options: {
              A: "On a server keyed by user account.",
              B: "In localStorage, keyed by `<pack-id>:progress:v1`.",
              C: "In sessionStorage so it resets each tab.",
              D: "In a cookie, expiring after 7 days.",
            },
            correct: "B",
            principle: "Per-pack localStorage namespace.",
          },
        ],
      },
    },
    {
      id: "s2-deeper",
      n: 2,
      title: "Going deeper",
      blurb:
        "A second section, locked until the first is passed — wires the section-unlock recommendation engine.",
      concepts: [
        {
          id: "c2-1",
          code: "C2.1",
          title: "Mock exams vs section tests",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Section tests gate the next section: passing one unlocks the next. Mock exams are independent — they do not gate progress, they are timed broad-coverage calibrations.",
              "Both reuse the same QuizRunner component. The difference is configuration in the curriculum, not code.",
            ],
            keyPoints: [
              "Section test = unlock gate.",
              "Mock exam = independent calibration.",
              "Same renderer; different curriculum-side config.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "What's the difference between a section test and a mock exam in this app?",
                options: {
                  A: "Section tests are timed; mock exams are not.",
                  B: "Section tests gate the next section; mock exams are independent calibrations.",
                  C: "Mock exams have explanations; section tests do not.",
                  D: "There is no difference — both are aliases.",
                },
                correct: "B",
                principle: "Section test gates progression; mock exam calibrates.",
              },
            ],
          },
        },
      ],
      sectionTest: null,
    },
  ],
  mockExams: [
    {
      id: "m1-sample",
      title: "Sample mock exam",
      blurb:
        "Three-question demo mock — replaced in production packs with a representative full-length exam.",
      timeMinutes: 5,
      passPct: 0.6,
      scoreBands: [
        { min: 0, max: 59, verdict: "Below pass-gate", message: "Keep practicing." },
        { min: 60, max: 100, verdict: "Pass", message: "On track." },
      ],
      questions: [
        {
          n: 1,
          question: "What is the active-pack indirection's purpose?",
          options: {
            A: "To make the app slower so caching matters.",
            B: "To make content swappable without changing components.",
            C: "To enforce a single curriculum format.",
            D: "To prevent users from forking the app.",
          },
          correct: "B",
          principle: "Swap content without touching the framework.",
        },
        {
          n: 2,
          question: "Which item belongs in the pack, not the shell?",
          options: {
            A: "Tailwind config.",
            B: "Brand name and tagline.",
            C: "Progress-store implementation.",
            D: "QuizRunner component.",
          },
          correct: "B",
          principle: "Branding is content; persistence + components are shell.",
        },
        {
          n: 3,
          question: "How are different packs isolated in the same browser?",
          options: {
            A: "They share storage and overwrite each other.",
            B: "Storage keys are namespaced by `pack.id`.",
            C: "They cannot coexist — only one pack at a time.",
            D: "Each pack writes to a separate IndexedDB database.",
          },
          correct: "B",
          principle: "Pack-id namespacing in localStorage.",
        },
      ],
    },
  ],
};
