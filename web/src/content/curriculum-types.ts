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
  bloom: Bloom;
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

/* ------------------------------------------------------------------
   LMS extension types — surfaced via lookup tables (section-meta.ts,
   domain-map.ts) and helpers (curriculum-loader.ts). The core
   Section/Concept/Lesson types above stay clean; new metadata is
   merged in at read time so curriculum.ts doesn't need to be rewritten.
------------------------------------------------------------------ */

/**
 * The five CCA-F exam domains. Weights from CLAUDE.md:
 * - agentic-architecture (27%)
 * - claude-code (20%)
 * - tool-design-mcp (18%)
 * - prompt-engineering (20%)
 * - context-reliability (15%)
 */
export type CCAFDomain =
  | "agentic-architecture"
  | "claude-code"
  | "tool-design-mcp"
  | "prompt-engineering"
  | "context-reliability";

/** Rich metadata about a single CCA-F domain — surfaced in Domain Rush
 *  and the section landing's domain badge. */
export interface CCAFDomainInfo {
  id: CCAFDomain;
  /** Display number per the official CCA-F exam guide. */
  n: 1 | 2 | 3 | 4 | 5;
  /** Full title used in mock-exam Question.domain (e.g., "1. Agentic Architecture"). */
  title: string;
  /** Short label for compact UI (chips, game tiles). */
  shortLabel: string;
  /** Weight as a 0..1 fraction. */
  weight: number;
}

/** A single flashcard. Front = exam term / question; back = explanation.
 *  English-only for v1; bilingual deferred. */
export interface Flashcard {
  /** Stable id so spaced-repetition state can be keyed across sessions. */
  id: string;
  front: string;
  back: string;
}

/** Per-section metadata not stored in curriculum.ts. */
export interface SectionMeta {
  /** Anthropic Academy course URL (research link for deep readers). */
  academyUrl: string;
  /** Total minutes the source course takes end-to-end. */
  timeMinutes: number;
  /** Optional video URL — original course video, YouTube embed, etc. */
  videoUrl?: string;
  /** 3–5 learning objectives shown above the concept list. */
  learningObjectives: string[];
  /** Track / category label (e.g., "Product Training", "Foundation"). */
  track?: string;
  /** Optional rich key-concept cards above the concepts list. */
  keyConcepts?: KeyConcept[];
}

/** A "card" on the section landing summarising one major idea — richer
 *  than a concept title. Optional; we render concept tiles if absent. */
export interface KeyConcept {
  title: string;
  blurb: string;
  /** Lucide icon name resolved by the renderer (e.g., "lightbulb"). */
  icon?: string;
}
