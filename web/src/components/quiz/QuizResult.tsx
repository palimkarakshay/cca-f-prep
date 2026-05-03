"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { Question, OptionLetter } from "@/content/curriculum-types";
import type { QuizAttempt } from "@/lib/progress-types";
import { buttonVariants } from "@/components/ui/button";
import { copy } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import {
  displayCanonicalAnswer,
  displayUserAnswer,
  isCorrect,
  isFillIn,
  isMCQ,
  isTrueFalse,
} from "./question-utils";

const LETTERS: OptionLetter[] = ["A", "B", "C", "D"];

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

export function QuizResult({
  title,
  questions,
  attempt,
  passPct,
  exitHref,
  exitLabel = "Back",
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
  learnedSummary,
}: {
  title: string;
  questions: Question[];
  attempt: QuizAttempt;
  passPct: number;
  exitHref: string;
  exitLabel?: string;
  prevHref?: string;
  prevLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  learnedSummary?: string[];
}) {
  const pct = attempt.total > 0 ? attempt.score / attempt.total : 0;
  const passed = pct >= passPct;
  const headingRef = useRef<HTMLHeadingElement>(null);

  // After submit unmounts the runner, the previously-focused Submit button
  // is gone — move focus to the result heading so screen readers re-anchor
  // and keyboard users land at the top of the new view.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <article>
      <header className="mb-3">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink) focus:outline-none"
        >
          {title}
        </h1>
      </header>

      <section
        aria-label="Score"
        className="mb-6 flex flex-wrap items-center gap-6 rounded-lg border border-(--border) bg-(--panel) p-5 shadow-sm"
      >
        <div
          className={cn(
            "rounded-md px-2",
            passed && "animate-pass-pulse"
          )}
        >
          <div className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-bold leading-none text-(--accent-2)">
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
            {passed ? capitalize(copy.passLabel) : capitalize(copy.belowPassGateLabel)}
          </div>
          <p className="mt-1 text-(--muted)">
            {passed
              ? "Locked in. Mastery updated."
              : "Re-read the lesson, name the principle, and re-take."}
          </p>
        </div>
      </section>

      {learnedSummary && learnedSummary.length > 0 ? (
        <section
          aria-label="What you learnt"
          className="mb-6 rounded-r-md border-l-4 border-(--accent) bg-(--accent)/5 p-4"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            What you learnt
          </h2>
          <ul className="ml-4 list-disc space-y-1 text-sm text-(--ink)">
            {learnedSummary.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <ul className="flex flex-col gap-3">
        {questions.map((q) => {
          const picked = attempt.answers[q.n] ?? null;
          const skipped = picked == null;
          const correct = !skipped && isCorrect(q, picked);
          const verdict = skipped ? "Skipped" : correct ? "Correct" : "Wrong";
          const verdictGlyph = skipped ? "○" : correct ? "✓" : "✗";
          return (
            <li
              key={q.n}
              className={cn(
                "rounded-lg border-l-4 border-(--border) bg-(--panel) p-4 shadow-sm",
                correct
                  ? "border-l-(--good)"
                  : skipped
                    ? "border-l-(--warn)"
                    : "border-l-(--bad)"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide",
                  correct
                    ? "text-(--good)"
                    : skipped
                      ? "text-(--warn)"
                      : "text-(--bad)"
                )}
              >
                <span aria-hidden className="font-mono text-sm leading-none">
                  {verdictGlyph}
                </span>
                {verdict}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-(--ink)">
                Q{q.n}. {q.question}
              </h3>

              <div className="mt-2 flex flex-wrap gap-4 text-xs">
                <span>
                  <span className="mr-1 text-(--muted)">Your answer:</span>
                  <code className="rounded-sm bg-(--panel-2) px-1.5 py-0.5 text-(--code)">
                    {displayUserAnswer(q, picked)}
                  </code>
                </span>
                <span>
                  <span className="mr-1 text-(--muted)">Correct:</span>
                  <code className="rounded-sm bg-(--panel-2) px-1.5 py-0.5 text-(--code)">
                    {displayCanonicalAnswer(q)}
                  </code>
                </span>
              </div>

              {/* Per-kind detail expansion. MCQ shows per-option
                  explanations; true/false + fill-in show the
                  applicable single explanation if present. */}
              {isMCQ(q) && q.explanations ? (
                <details
                  className="group mt-3 rounded-md border border-(--border) bg-(--panel-2) [&[open]>summary>svg]:rotate-180"
                  open={!correct}
                >
                  <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-(--muted) marker:hidden [&::-webkit-details-marker]:hidden">
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform"
                      aria-hidden
                    />
                    Why each option
                  </summary>
                  <ul className="flex flex-col gap-1 px-3 pb-3">
                    {LETTERS.map((L) => (
                      <li
                        key={L}
                        className={cn(
                          "text-xs",
                          L === q.correct && "text-(--good)"
                        )}
                      >
                        <code className="mr-2 font-mono font-semibold">
                          {L}.
                        </code>
                        {q.explanations?.[L]}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}

              {isTrueFalse(q) && (q.explanationTrue || q.explanationFalse) ? (
                <details
                  className="group mt-3 rounded-md border border-(--border) bg-(--panel-2) [&[open]>summary>svg]:rotate-180"
                  open={!correct}
                >
                  <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-(--muted) marker:hidden [&::-webkit-details-marker]:hidden">
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform"
                      aria-hidden
                    />
                    Why
                  </summary>
                  <p className="px-3 pb-3 text-xs">
                    {q.correct ? q.explanationTrue : q.explanationFalse}
                  </p>
                </details>
              ) : null}

              {isFillIn(q) ? (
                <>
                  {q.acceptedAnswers.length > 1 ? (
                    <p className="mt-2 text-xs text-(--muted)">
                      Also accepted:{" "}
                      {q.acceptedAnswers.slice(1).map((a, i, arr) => (
                        <span key={i}>
                          <code className="rounded-sm bg-(--panel-2) px-1 py-0.5">
                            {a}
                          </code>
                          {i < arr.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  ) : null}
                  {q.explanation ? (
                    <details
                      className="group mt-3 rounded-md border border-(--border) bg-(--panel-2) [&[open]>summary>svg]:rotate-180"
                      open={!correct}
                    >
                      <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-(--muted) marker:hidden [&::-webkit-details-marker]:hidden">
                        <ChevronDown
                          className="h-3.5 w-3.5 transition-transform"
                          aria-hidden
                        />
                        Why
                      </summary>
                      <p className="px-3 pb-3 text-xs">{q.explanation}</p>
                    </details>
                  ) : null}
                </>
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

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dashed border-(--border) pt-4">
        {prevHref ? (
          <Link
            href={prevHref}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "no-underline"
            )}
          >
            ← {prevLabel ?? "Previous lesson"}
          </Link>
        ) : null}
        <Link
          href={exitHref}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "no-underline"
          )}
        >
          {exitLabel}
        </Link>
        {nextHref ? (
          <Link
            href={nextHref}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "ml-auto no-underline"
            )}
          >
            {nextLabel ?? "Next lesson"} →
          </Link>
        ) : null}
      </div>
    </article>
  );
}
