/* ------------------------------------------------------------------
   Curriculum types — mirror the shape documented in docs/README.md.
   The data itself lives in curriculum.ts; these types make consumers
   type-safe without changing the source-of-truth content.
------------------------------------------------------------------ */

export type Bloom = "R" | "U" | "A" | "An" | "E" | "C";

export type LessonStatus = "draft" | "ready";

export interface LessonExample {
  title: string;
  body: string;
}

export interface LessonSimplified {
  oneLiner?: string;
  analogy?: string;
  paragraphs?: string[];
  keyPoints?: string[];
}

export interface Lesson {
  status: LessonStatus;
  paragraphs: string[];
  keyPoints?: string[];
  examples?: LessonExample[];
  pitfalls?: string[];
  notesRef?: string;
  simplified?: LessonSimplified;
}

export type OptionLetter = "A" | "B" | "C" | "D";

export interface Question {
  n: number;
  question: string;
  options: Record<OptionLetter, string>;
  correct: OptionLetter;
  explanations?: Record<OptionLetter, string>;
  principle?: string;
  bSkills?: string[];
  domain?: string;
  subArea?: string;
}

export interface Quiz {
  questions: Question[];
}

export interface SectionTest extends Quiz {
  passPct?: number;
}

export interface Concept {
  id: string;
  code: string;
  title: string;
  /** Bloom-taxonomy level for educational packs. Optional — non-academic
   *  packs can omit it; the badge then doesn't render. */
  bloom?: Bloom;
  lesson: Lesson | null;
  quiz: Quiz | null;
}

export interface Section {
  id: string;
  n: number;
  title: string;
  sourceCourse?: string;
  blurb: string;
  concepts: Concept[];
  sectionTest: SectionTest | null;
}

export interface ScoreBand {
  min: number;
  max: number;
  verdict: string;
  message: string;
}

export interface MockExam {
  id: string;
  title: string;
  blurb: string;
  sourceFile?: string;
  timeMinutes: number;
  passPct: number;
  scoreBands: ScoreBand[];
  questions: Question[];
}

export interface Curriculum {
  schemaVersion: number;
  sections: Section[];
  mockExams?: MockExam[];
}
