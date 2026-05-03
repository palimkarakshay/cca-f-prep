/* ------------------------------------------------------------------
   Pack-local re-export of the contract types.

   See `web/content-packs/cca-f-prep/_types.ts` for the rationale and
   `web/content-packs/README.md` § "Cross-repo extraction recipe" for
   the swap procedure.
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
