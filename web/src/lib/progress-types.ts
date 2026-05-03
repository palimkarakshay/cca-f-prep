/* ------------------------------------------------------------------
   Progress shape — schema-versioned localStorage state.

   Mirrors docs/app.js so users migrating from the static site keep
   their existing progress when the new shell ships at the same origin.
------------------------------------------------------------------ */

import type { OptionLetter } from "@/content/curriculum-types";

export type Mastery = 0 | 1 | 2 | 3 | 4;

export interface QuizAttempt {
  startedAt: number;
  completedAt: number;
  total: number;
  score: number;
  answers: Record<number, OptionLetter | null>;
  reasons?: Record<number, string>;
}

export interface CurrentAttempt {
  startedAt: number;
  cursor: number;
  answers: Record<number, OptionLetter | null>;
  reasons?: Record<number, string>;
}

export interface ConceptProgress {
  lessonRead: boolean;
  quizAttempts: QuizAttempt[];
  mastery: Mastery;
  currentAttempt: CurrentAttempt | null;
}

export interface SectionProgress {
  unlocked: boolean;
  testAttempts: QuizAttempt[];
  complete: boolean;
  currentTestAttempt?: CurrentAttempt | null;
}

export interface MockProgress {
  attempts: QuizAttempt[];
  currentAttempt: CurrentAttempt | null;
}

export interface Progress {
  schemaVersion: 1;
  concept: Record<string, ConceptProgress>;
  section: Record<string, SectionProgress>;
  mock: Record<string, MockProgress>;
  location: {
    view: string;
    sectionId: string | null;
    conceptId: string | null;
    mockId: string | null;
  };
}

export const PROGRESS_STORAGE_KEY = "cca-f-prep:progress:v1";
