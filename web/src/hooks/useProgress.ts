"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  ensureConcept,
  ensureMock,
  ensureSection,
  isSectionPassed,
  isUnderwhelm,
  masteryFromScore,
  unlockNextSection,
} from "@/lib/progress";
import { getProgressStore } from "@/lib/progress-store";
import { useHydrated } from "@/hooks/useHydrated";
import { usePackId } from "@/content/pack-hooks";
import type {
  CurrentAttempt,
  Mastery,
  QuizAttempt,
} from "@/lib/progress-types";

export function useProgress() {
  const packId = usePackId();
  const progressStore = useMemo(() => getProgressStore(packId), [packId]);

  const progress = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.get,
    progressStore.getServerSnapshot
  );
  // `false` during SSR + initial client render; flips on the first
  // post-hydration commit. Routed through `useHydrated` so the flip is
  // driven by `useSyncExternalStore` rather than setState-in-effect —
  // PR #20 used the latter and shipped with red CI (eslint
  // react-hooks/set-state-in-effect).
  const hydrated = useHydrated();

  const markLessonRead = useCallback(
    (conceptId: string) => {
      progressStore.mutate((p) => {
        const c = ensureConcept(p, conceptId);
        c.lessonRead = true;
        if (c.mastery < 1) c.mastery = 1;
      });
    },
    [progressStore]
  );

  const recordQuizAttempt = useCallback(
    (conceptId: string, attempt: QuizAttempt) => {
      progressStore.mutate((p) => {
        const c = ensureConcept(p, conceptId);
        c.quizAttempts.push(attempt);
        c.currentAttempt = null;
        const m = masteryFromScore(attempt.score, attempt.total);
        if (m > c.mastery) c.mastery = m;
        else if (isUnderwhelm(m) && c.mastery > 1) c.mastery = m;
      });
    },
    [progressStore]
  );

  const recordSectionTestAttempt = useCallback(
    (sectionId: string, attempt: QuizAttempt) => {
      progressStore.mutate((p) => {
        const s = ensureSection(p, sectionId);
        s.testAttempts.push(attempt);
        s.currentTestAttempt = null;
        if (isSectionPassed(p, sectionId)) {
          s.complete = true;
          unlockNextSection(p, sectionId);
        }
      });
    },
    [progressStore]
  );

  const recordMockAttempt = useCallback(
    (mockId: string, attempt: QuizAttempt) => {
      progressStore.mutate((p) => {
        const m = ensureMock(p, mockId);
        m.attempts.push(attempt);
        m.currentAttempt = null;
      });
    },
    [progressStore]
  );

  const setConceptCurrentAttempt = useCallback(
    (conceptId: string, attempt: CurrentAttempt | null) => {
      progressStore.mutate((p) => {
        const c = ensureConcept(p, conceptId);
        c.currentAttempt = attempt;
      });
    },
    [progressStore]
  );

  const setSectionCurrentAttempt = useCallback(
    (sectionId: string, attempt: CurrentAttempt | null) => {
      progressStore.mutate((p) => {
        const s = ensureSection(p, sectionId);
        s.currentTestAttempt = attempt;
      });
    },
    [progressStore]
  );

  const setMockCurrentAttempt = useCallback(
    (mockId: string, attempt: CurrentAttempt | null) => {
      progressStore.mutate((p) => {
        const m = ensureMock(p, mockId);
        m.currentAttempt = attempt;
      });
    },
    [progressStore]
  );

  const conceptMastery = useCallback(
    (conceptId: string): Mastery =>
      progress.concept[conceptId]?.mastery ?? 0,
    [progress]
  );

  const sectionUnlocked = useCallback(
    (sectionId: string): boolean =>
      progress.section[sectionId]?.unlocked ?? false,
    [progress]
  );

  const sectionComplete = useCallback(
    (sectionId: string): boolean =>
      progress.section[sectionId]?.complete ?? false,
    [progress]
  );

  return {
    progress,
    hydrated,
    markLessonRead,
    recordQuizAttempt,
    recordSectionTestAttempt,
    recordMockAttempt,
    setConceptCurrentAttempt,
    setSectionCurrentAttempt,
    setMockCurrentAttempt,
    conceptMastery,
    sectionUnlocked,
    sectionComplete,
  };
}
