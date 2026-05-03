"use client";

import { useCallback } from "react";
import { useProgress } from "@/hooks/useProgress";
import { QuizRunner } from "./QuizRunner";
import { getAdjacentConcepts } from "@/content/curriculum-loader";
import type { Concept, Section } from "@/content/curriculum-types";
import type { CurrentAttempt, QuizAttempt } from "@/lib/progress-types";

const CONCEPT_QUIZ_PASS_PCT = 0.6;

export function ConceptQuizPage({
  section,
  concept,
}: {
  section: Section;
  concept: Concept;
}) {
  const { progress, hydrated, recordQuizAttempt, setConceptCurrentAttempt } =
    useProgress();

  const onCheckpoint = useCallback(
    (attempt: CurrentAttempt | null) => {
      setConceptCurrentAttempt(concept.id, attempt);
    },
    [concept.id, setConceptCurrentAttempt]
  );

  const onComplete = useCallback(
    (attempt: QuizAttempt) => {
      recordQuizAttempt(concept.id, attempt);
    },
    [concept.id, recordQuizAttempt]
  );

  if (!hydrated) {
    return <p className="text-sm text-(--muted)">Loading…</p>;
  }
  if (!concept.quiz) {
    return (
      <p className="rounded-r-md border-l-4 border-(--warn) bg-(--warn)/10 p-4 text-sm">
        Quiz not yet authored for this concept.
      </p>
    );
  }

  const resume = progress.concept[concept.id]?.currentAttempt ?? null;
  const { prev, next } = getAdjacentConcepts(section.id, concept.id);
  const learnedSummary = concept.lesson?.keyPoints;

  return (
    <QuizRunner
      title={`${concept.code} — ${concept.title}`}
      subtitle={`Concept quiz · pass-gate ${Math.round(CONCEPT_QUIZ_PASS_PCT * 100)}%`}
      questions={concept.quiz.questions}
      passPct={CONCEPT_QUIZ_PASS_PCT}
      collectReasons={false}
      resumeFrom={resume}
      onCheckpoint={onCheckpoint}
      onComplete={onComplete}
      exitHref={`/concept/${section.id}/${concept.id}`}
      exitLabel="Exit to lesson"
      prevHref={
        prev ? `/concept/${prev.section.id}/${prev.concept.id}` : undefined
      }
      prevLabel={prev ? `${prev.concept.code} ${prev.concept.title}` : undefined}
      nextHref={
        next ? `/concept/${next.section.id}/${next.concept.id}` : undefined
      }
      nextLabel={next ? `${next.concept.code} ${next.concept.title}` : undefined}
      learnedSummary={learnedSummary}
    />
  );
}
