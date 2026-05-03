// Shape of importer output. Mirrors the SQL schema in @ccafp/db one-to-one
// so the apply step is a straight INSERT (Phase 0.2 work).

export type ContentStatus = 'draft' | 'published' | 'disputed' | 'retired';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ContentPack {
  slug: string;
  title: string;
  locale: string;
  passing_score: number | null;
  version: number;
  status: ContentStatus;
  source_ref: string;
}

export interface Domain {
  pack_slug: string;
  slug: string;
  title: string;
  weight_pct: number | null;
  position: number;
  notes_md: string | null;
}

export interface McqOption {
  letter: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Mcq {
  domain_pack_slug: string;
  domain_slug: string;
  external_ref: string;
  stem_md: string;
  options: McqOption[];
  correct_idx: number;
  principle: string | null;
  distractor_rationales: string[] | null;
  difficulty: Difficulty;
  source_ref: string;
  status: ContentStatus;
}

export interface Challenge {
  domain_pack_slug: string;
  domain_slug: string;
  slug: string;
  title: string;
  prompt_md: string;
  difficulty: Difficulty;
  tags: string[];
  status: ContentStatus;
}

export interface Solution {
  challenge_pack_slug: string;
  challenge_domain_slug: string;
  challenge_slug: string;
  body_md: string;
  principle: string | null;
}

export interface MockExam {
  pack_slug: string;
  slug: string;
  title: string;
  duration_min: number | null;
  question_count: number;
  status: ContentStatus;
}

export interface MockExamQuestion {
  mock_exam_pack_slug: string;
  mock_exam_slug: string;
  position: number;
  mcq_external_ref: string;
}

export interface ImportPayload {
  packs: ContentPack[];
  domains: Domain[];
  mcqs: Mcq[];
  challenges: Challenge[];
  solutions: Solution[];
  mock_exams: MockExam[];
  mock_exam_questions: MockExamQuestion[];
}

export const EMPTY_PAYLOAD: ImportPayload = {
  packs: [],
  domains: [],
  mcqs: [],
  challenges: [],
  solutions: [],
  mock_exams: [],
  mock_exam_questions: [],
};
