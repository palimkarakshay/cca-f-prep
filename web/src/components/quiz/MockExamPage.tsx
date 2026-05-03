"use client";

import { useCallback } from "react";
import { useProgress } from "@/hooks/useProgress";
import { QuizRunner } from "./QuizRunner";
import { MockResult } from "./MockResult";
import { copy } from "@/lib/site-config";
import type { MockExam } from "@/content/curriculum-types";
import type { CurrentAttempt, QuizAttempt } from "@/lib/progress-types";

export function MockExamPage({ mock }: { mock: MockExam }) {
  const { progress, hydrated, recordMockAttempt, setMockCurrentAttempt } =
    useProgress();

  const onCheckpoint = useCallback(
    (attempt: CurrentAttempt | null) => {
      setMockCurrentAttempt(mock.id, attempt);
    },
    [mock.id, setMockCurrentAttempt]
  );

  const onComplete = useCallback(
    (attempt: QuizAttempt) => {
      recordMockAttempt(mock.id, attempt);
    },
    [mock.id, recordMockAttempt]
  );

  if (!hydrated) return <p className="text-sm text-(--muted)">Loading…</p>;

  const resume = progress.mock[mock.id]?.currentAttempt ?? null;

  return (
    <QuizRunner
      title={mock.title}
      subtitle={`${mock.questions.length} Q · ${mock.timeMinutes}m suggested · pass-gate ${Math.round(mock.passPct * 100)}%`}
      questions={mock.questions}
      passPct={mock.passPct}
      collectReasons
      resumeFrom={resume}
      onCheckpoint={onCheckpoint}
      onComplete={onComplete}
      exitHref="/"
      exitLabel="Exit to dashboard"
    />
  );
}

export function MockResultPage({ mock }: { mock: MockExam }) {
  const { progress, hydrated } = useProgress();
  if (!hydrated) return <p className="text-sm text-(--muted)">Loading…</p>;
  const last = progress.mock[mock.id]?.attempts.slice(-1)[0] ?? null;
  if (!last) {
    return (
      <p className="rounded-r-md border-l-4 border-(--warn) bg-(--warn)/10 p-4 text-sm">
        No attempts recorded yet for this {copy.mockExamsHeading.toLowerCase().replace(/s$/, "")}.
      </p>
    );
  }
  return <MockResult mock={mock} attempt={last} />;
}
