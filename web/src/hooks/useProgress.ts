"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ensureConcept,
  ensureMock,
  ensureSection,
  isSectionPassed,
  loadProgress,
  masteryFromScore,
  newProgress,
  saveProgress,
  unlockNextSection,
} from "@/lib/progress";
import type {
  CurrentAttempt,
  Mastery,
  Progress,
  QuizAttempt,
} from "@/lib/progress-types";
import { PROGRESS_STORAGE_KEY } from "@/lib/progress-types";

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => newProgress());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  // Cross-tab sync.
  useEffect(() => {
    if (typeof window === "undefined") return;
    function onStorage(e: StorageEvent) {
      if (e.key === PROGRESS_STORAGE_KEY) setProgress(loadProgress());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((mutator: (p: Progress) => void) => {
    setProgress((prev) => {
      const next = structuredClone(prev);
      mutator(next);
      saveProgress(next);
      return next;
    });
  }, []);

  const markLessonRead = useCallback(
    (conceptId: string) => {
      update((p) => {
        const c = ensureConcept(p, conceptId);
        c.lessonRead = true;
        if (c.mastery < 1) c.mastery = 1;
      });
    },
    [update]
  );

  const recordQuizAttempt = useCallback(
    (conceptId: string, attempt: QuizAttempt) => {
      update((p) => {
        const c = ensureConcept(p, conceptId);
        c.quizAttempts.push(attempt);
        c.currentAttempt = null;
        const m = masteryFromScore(attempt.score, attempt.total);
        if (m > c.mastery) c.mastery = m;
        else if (m === 2 && c.mastery > 1) c.mastery = 2;
      });
    },
    [update]
  );

  const recordSectionTestAttempt = useCallback(
    (sectionId: string, attempt: QuizAttempt) => {
      update((p) => {
        const s = ensureSection(p, sectionId);
        s.testAttempts.push(attempt);
        s.currentTestAttempt = null;
        if (isSectionPassed(p, sectionId)) {
          s.complete = true;
          unlockNextSection(p, sectionId);
        }
      });
    },
    [update]
  );

  const recordMockAttempt = useCallback(
    (mockId: string, attempt: QuizAttempt) => {
      update((p) => {
        const m = ensureMock(p, mockId);
        m.attempts.push(attempt);
        m.currentAttempt = null;
      });
    },
    [update]
  );

  const setConceptCurrentAttempt = useCallback(
    (conceptId: string, attempt: CurrentAttempt | null) => {
      update((p) => {
        const c = ensureConcept(p, conceptId);
        c.currentAttempt = attempt;
      });
    },
    [update]
  );

  const setSectionCurrentAttempt = useCallback(
    (sectionId: string, attempt: CurrentAttempt | null) => {
      update((p) => {
        const s = ensureSection(p, sectionId);
        s.currentTestAttempt = attempt;
      });
    },
    [update]
  );

  const setMockCurrentAttempt = useCallback(
    (mockId: string, attempt: CurrentAttempt | null) => {
      update((p) => {
        const m = ensureMock(p, mockId);
        m.currentAttempt = attempt;
      });
    },
    [update]
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
