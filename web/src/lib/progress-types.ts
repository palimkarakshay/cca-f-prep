/* ------------------------------------------------------------------
   Progress shape — schema-versioned localStorage state.

   Mirrors docs/app.js so users migrating from the static site keep
   their existing progress when the new shell ships at the same origin.
------------------------------------------------------------------ */

import { ACTIVE_PACK } from "@/content/active-pack";
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

/**
 * Progress storage key — namespaced by the active pack id so different
 * content packs do not collide on a single browser. Switching packs
 * preserves the previous pack's progress; switching back resumes where
 * you left off.
 */
export const PROGRESS_STORAGE_KEY = `${ACTIVE_PACK.config.id}:progress:v1`;
