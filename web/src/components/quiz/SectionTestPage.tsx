"use client";

import { useCallback } from "react";
import { useProgress } from "@/hooks/useProgress";
import { QuizRunner } from "./QuizRunner";
import type { Section } from "@/content/curriculum-types";
import type { CurrentAttempt, QuizAttempt } from "@/lib/progress-types";

export function SectionTestPage({ section }: { section: Section }) {
  const {
    progress,
    hydrated,
    recordSectionTestAttempt,
    setSectionCurrentAttempt,
  } = useProgress();

  const onCheckpoint = useCallback(
    (attempt: CurrentAttempt | null) => {
      setSectionCurrentAttempt(section.id, attempt);
    },
    [section.id, setSectionCurrentAttempt]
  );

  const onComplete = useCallback(
    (attempt: QuizAttempt) => {
      recordSectionTestAttempt(section.id, attempt);
    },
    [section.id, recordSectionTestAttempt]
  );

  if (!hydrated) return <p className="text-sm text-(--muted)">Loading…</p>;
  if (!section.sectionTest) {
    return (
      <p className="rounded-r-md border-l-4 border-(--warn) bg-(--warn)/10 p-4 text-sm">
        Section test not yet authored for this section.
      </p>
    );
  }

  const passPct = section.sectionTest.passPct ?? 0.7;
  const resume = progress.section[section.id]?.currentTestAttempt ?? null;

  return (
    <QuizRunner
      title={`${section.title} — Section test`}
      subtitle={`Pass-gate ${Math.round(
        passPct * 100
      )}% · passing unlocks the next section`}
      questions={section.sectionTest.questions}
      passPct={passPct}
      collectReasons={false}
      resumeFrom={resume}
      onCheckpoint={onCheckpoint}
      onComplete={onComplete}
      exitHref={`/section/${section.id}`}
      exitLabel="Exit to section"
    />
  );
}
