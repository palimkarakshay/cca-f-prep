"use client";

import Link from "next/link";
import type { Question, OptionLetter } from "@/content/curriculum-types";
import type { QuizAttempt } from "@/lib/progress-types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LETTERS: OptionLetter[] = ["A", "B", "C", "D"];

export function QuizResult({
  title,
  questions,
  attempt,
  passPct,
  exitHref,
  exitLabel = "Back",
}: {
  title: string;
  questions: Question[];
  attempt: QuizAttempt;
  passPct: number;
  exitHref: string;
  exitLabel?: string;
}) {
  const pct = attempt.total > 0 ? attempt.score / attempt.total : 0;
  const passed = pct >= passPct;

  return (
    <article>
      <header className="mb-3">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          {title}
        </h1>
      </header>

      <section
        aria-label="Score"
        className="mb-6 flex flex-wrap items-center gap-6 rounded-lg border border-(--border) bg-(--panel) p-5"
      >
        <div>
          <div className="font-[family-name:var(--font-display)] text-5xl font-bold leading-none text-(--accent-2)">
            {attempt.score}/{attempt.total}
          </div>
          <div className="mt-2 text-sm text-(--muted)">
            {Math.round(pct * 100)}% · pass-gate {Math.round(passPct * 100)}%
          </div>
        </div>
        <div
          className={cn(
            "ml-auto max-w-sm text-sm",
            passed ? "text-(--good)" : "text-(--bad)"
          )}
        >
          <div className="text-base font-semibold">
            {passed ? "Pass" : "Below pass-gate"}
          </div>
          <p className="mt-1 text-(--muted)">
            {passed
              ? "Locked in. Mastery updated."
              : "Re-read the lesson, name the principle, and re-take."}
          </p>
        </div>
      </section>

      <ul className="flex flex-col gap-3">
        {questions.map((q) => {
          const picked = attempt.answers[q.n] ?? null;
          const correct = picked === q.correct;
          const skipped = picked == null;
          const verdict = skipped ? "Skipped" : correct ? "Correct" : "Wrong";
          return (
            <li
              key={q.n}
              className={cn(
                "rounded-lg border-l-4 border-(--border) bg-(--panel) p-4",
                correct
                  ? "border-l-(--good)"
                  : skipped
                    ? "border-l-(--warn)"
                    : "border-l-(--bad)"
              )}
            >
              <div
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  correct
                    ? "text-(--good)"
                    : skipped
                      ? "text-(--warn)"
                      : "text-(--bad)"
                )}
              >
                {verdict}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-(--ink)">
                Q{q.n}. {q.question}
              </h3>

              <div className="mt-2 flex flex-wrap gap-4 text-xs">
                <span>
                  <span className="mr-1 text-(--muted)">Your answer:</span>
                  <code className="rounded-sm bg-(--panel-2) px-1.5 py-0.5 text-(--code)">
                    {picked ?? "—"}
                  </code>
                </span>
                <span>
                  <span className="mr-1 text-(--muted)">Correct:</span>
                  <code className="rounded-sm bg-(--panel-2) px-1.5 py-0.5 text-(--code)">
                    {q.correct}
                  </code>
                </span>
              </div>

              {q.explanations ? (
                <div className="mt-3 rounded-md border border-(--border) bg-(--panel-2) p-3">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--muted)">
                    Why each option
                  </h4>
                  <ul className="flex flex-col gap-1">
                    {LETTERS.map((L) => (
                      <li
                        key={L}
                        className={cn(
                          "text-xs",
                          L === q.correct && "text-(--good)"
                        )}
                      >
                        <code className="mr-2 font-mono font-semibold">{L}.</code>
                        {q.explanations?.[L]}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {q.principle ? (
                <p className="mt-3 rounded-r-md border-l-2 border-(--accent) bg-(--accent)/5 p-3 text-xs">
                  <span className="mr-1 font-semibold text-(--accent-2)">
                    Principle:
                  </span>
                  {q.principle}
                </p>
              ) : null}

              {attempt.reasons?.[q.n] ? (
                <div className="mt-3 rounded-md border border-dashed border-(--border) bg-(--panel-2)/40 p-3">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
                    Your reasoning
                  </span>
                  <p className="whitespace-pre-wrap text-xs text-(--code)">
                    {attempt.reasons[q.n]}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-6">
        <Link
          href={exitHref}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "no-underline"
          )}
        >
          {exitLabel}
        </Link>
      </div>
    </article>
  );
}
