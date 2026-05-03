/* ------------------------------------------------------------------
   Pack-local re-export of the contract types.

   Every other file in this pack imports types from THIS file (relative)
   instead of reaching into the shell via the `@/*` alias. That makes
   the pack folder self-contained: copying it into a different repo is
   one-line away from working — replace the re-export here with either
   (a) inlined type definitions or (b) imports from a published
   `@learning/content-types` package. No other pack file changes.

   See `web/content-packs/README.md` § "Cross-repo extraction recipe".
------------------------------------------------------------------ */

export type {
  ContentPack,
  PackConfig,
  PackCopy,
  MasteryLevel,
  NavIcon,
  NavItem,
  AskAIConfig,
  PackTheme,
} from "@/content/pack-types";

export type {
  Curriculum,
  Section,
  Concept,
  Lesson,
  LessonDeeper,
  LessonDepth,
  LessonExample,
  LessonSimplified,
  LessonStatus,
  Quiz,
  Question,
  SectionTest,
  MockExam,
  ScoreBand,
  Bloom,
  OptionLetter,
} from "@/content/curriculum-types";
