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
import { usePack } from "@/content/pack-context";
import { usePackId } from "@/content/pack-hooks";
import type {
  CurrentAttempt,
  Mastery,
  QuizAttempt,
} from "@/lib/progress-types";

export function useProgress() {
  const packId = usePackId();
  const pack = usePack();
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

  // All sections are now always navigable — the previous behaviour of
  // gating concept access on a prior section's test pass produced
  // confusing "Section 2 locked" states even for learners who had
  // completed everything. Open-by-default lets learners preview,
  // re-read, or skip around at will. The gate now sits only on the
  // section test (see `sectionTestReady`).
  const sectionUnlocked = useCallback((_sectionId: string): boolean => {
    return true;
  }, []);

  const sectionComplete = useCallback(
    (sectionId: string): boolean =>
      progress.section[sectionId]?.complete ?? false,
    [progress]
  );

  /**
   * `sectionStatus` — coarse status for visual signalling.
   *
   *   - "complete"    → section test passed (mirrors `sectionComplete`).
   *   - "in-progress" → at least one concept has been touched
   *                     (lesson read or quiz attempted).
   *   - "upcoming"    → nothing touched yet.
   *
   * Used by the dashboard list, JourneyJumper, and SectionConceptMap
   * to render distinct colours per state. Unlike the old binary
   * unlocked/locked, this never blocks navigation.
   */
  const sectionStatus = useCallback(
    (sectionId: string): "complete" | "in-progress" | "upcoming" => {
      if (progress.section[sectionId]?.complete) return "complete";
      const section = pack.curriculum.sections.find((s) => s.id === sectionId);
      if (!section) return "upcoming";
      const anyTouched = section.concepts.some((c) => {
        const cp = progress.concept[c.id];
        return cp && (cp.lessonRead || cp.quizAttempts.length > 0);
      });
      const testAttempted =
        (progress.section[sectionId]?.testAttempts ?? []).length > 0;
      return anyTouched || testAttempted ? "in-progress" : "upcoming";
    },
    [pack, progress]
  );

  /**
   * Is the section's test eligible to take? True when every authored
   * concept in the section has been read (lesson visited) — i.e. the
   * "conceptual part" of the section is complete. Stub concepts (no
   * lesson + no quiz) are skipped so a partially authored section
   * can still gate on the work that actually exists.
   *
   * This is the *new* lock — sections themselves never lock, but the
   * end-of-section test does until the conceptual material has been
   * worked through. Returns true while not hydrated so SSR renders
   * the link rather than the "complete the concepts first" hint.
   */
  const sectionTestReady = useCallback(
    (sectionId: string): boolean => {
      if (!hydrated) return true;
      const section = pack.curriculum.sections.find((s) => s.id === sectionId);
      if (!section) return false;
      const authored = section.concepts.filter(
        (c) => c.lesson && c.quiz
      );
      if (authored.length === 0) return true;
      return authored.every((c) => {
        const cp = progress.concept[c.id];
        return Boolean(cp?.lessonRead || (cp?.quizAttempts.length ?? 0) > 0);
      });
    },
    [pack, progress, hydrated]
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
    sectionStatus,
    sectionTestReady,
  };
}
