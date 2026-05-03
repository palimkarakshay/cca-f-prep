"use client";

import type { MockExam } from "@/content/curriculum-types";
import type { QuizAttempt } from "@/lib/progress-types";
import { QuizResult } from "./QuizResult";

function bandFor(mock: MockExam, score: number) {
  return mock.scoreBands.find((b) => score >= b.min && score <= b.max) ?? null;
}

export function MockResult({
  mock,
  attempt,
}: {
  mock: MockExam;
  attempt: QuizAttempt;
}) {
  const band = bandFor(mock, attempt.score);
  return (
    <div>
      {band ? (
        <section
          aria-label="Verdict"
          className="mb-5 rounded-lg border border-(--accent)/40 bg-(--accent)/5 p-4"
        >
          <h2 className="text-base font-semibold text-(--accent-2)">
            {band.verdict}
          </h2>
          <p className="mt-1 text-sm text-(--ink)">{band.message}</p>
        </section>
      ) : null}
      <QuizResult
        title={mock.title}
        questions={mock.questions}
        attempt={attempt}
        passPct={mock.passPct}
        exitHref="/"
        exitLabel="Back to dashboard"
      />
    </div>
  );
}
