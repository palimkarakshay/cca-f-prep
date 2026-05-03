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

/**
 * Easier-than-canonical version of a lesson. Renders when the learner
 * picks "Easy" on the depth toggle in LessonView. The historical name
 * is `simplified`; "Easy" is the user-facing label.
 */
export interface LessonSimplified {
  oneLiner?: string;
  analogy?: string;
  paragraphs?: string[];
  keyPoints?: string[];
}

/**
 * Deeper-than-canonical version of a lesson. Renders when the learner
 * picks "Deeper" on the depth toggle. Use this for advanced detail,
 * extra examples, edge cases, citations to source material, "going
 * further" reading suggestions — anything an experienced learner
 * would want that would slow down a beginner.
 */
export interface LessonDeeper {
  oneLiner?: string;
  paragraphs?: string[];
  keyPoints?: string[];
  examples?: LessonExample[];
  pitfalls?: string[];
  furtherReading?: { title: string; href: string }[];
}

export interface Lesson {
  status: LessonStatus;
  /** Canonical "Conceptual" body — the default depth. */
  paragraphs: string[];
  keyPoints?: string[];
  examples?: LessonExample[];
  pitfalls?: string[];
  notesRef?: string;
  /** Easier rendering of the same lesson. Picker disables "Easy" if absent. */
  simplified?: LessonSimplified;
  /** Deeper / advanced take on the same lesson. Picker disables "Deeper" if absent. */
  deeper?: LessonDeeper;
}

/** Three-way depth selector backing the LessonView toggle. */
export type LessonDepth = "easy" | "conceptual" | "deeper";

export type OptionLetter = "A" | "B" | "C" | "D";

/**
 * Fields shared by every question kind. Concrete shapes
 * (MCQQuestion, TrueFalseQuestion, FillInQuestion) extend this.
 */
export interface QuestionBase {
  /** 1-based question number, stable per-quiz identifier for storage. */
  n: number;
  question: string;
  /** One-line takeaway shown after the answer is submitted. */
  principle?: string;
  /** Optional CCA-F-specific skill tags (B-codes). Other packs ignore. */
  bSkills?: string[];
  /** Optional CCA-F-specific exam-domain tag. Other packs ignore. */
  domain?: string;
  /** Optional CCA-F-specific sub-area tag. */
  subArea?: string;
}

/**
 * 4-option multiple-choice — the original (and default) question
 * format. `kind` is optional for backward compatibility: any question
 * without a `kind` is treated as MCQ.
 */
export interface MCQQuestion extends QuestionBase {
  kind?: "mcq";
  options: Record<OptionLetter, string>;
  correct: OptionLetter;
  explanations?: Record<OptionLetter, string>;
}

/**
 * Boolean-answer question. Picks render as two large buttons.
 */
export interface TrueFalseQuestion extends QuestionBase {
  kind: "true-false";
  correct: boolean;
  /** Explanation shown after submit when the answer is true. */
  explanationTrue?: string;
  /** Explanation shown after submit when the answer is false. */
  explanationFalse?: string;
}

/**
 * Free-text answer question. Comparison is case-insensitive after
 * trim. The first entry of `acceptedAnswers` is treated as the
 * canonical answer for display in the result view; subsequent
 * entries are alternates that also count as correct.
 */
export interface FillInQuestion extends QuestionBase {
  kind: "fill-in";
  acceptedAnswers: string[];
  placeholder?: string;
  /** Optional explanation shown after submit. */
  explanation?: string;
}

export type Question = MCQQuestion | TrueFalseQuestion | FillInQuestion;

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
