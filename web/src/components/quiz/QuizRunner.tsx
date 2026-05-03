"use client";

import { useEffect, useMemo, useState } from "react";
import type { Question, OptionLetter } from "@/content/curriculum-types";
import type { CurrentAttempt, QuizAttempt } from "@/lib/progress-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuizResult } from "./QuizResult";

const LETTERS: OptionLetter[] = ["A", "B", "C", "D"];
const KEY_TO_LETTER: Record<string, OptionLetter> = {
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
};
const NUM_FOR_LETTER: Record<OptionLetter, string> = {
  A: "1",
  B: "2",
  C: "3",
  D: "4",
};

export interface QuizRunnerProps {
  title: string;
  subtitle?: string;
  questions: Question[];
  passPct: number;
  collectReasons?: boolean;
  resumeFrom?: CurrentAttempt | null;
  onCheckpoint?: (attempt: CurrentAttempt | null) => void;
  onComplete: (attempt: QuizAttempt) => void;
  exitHref: string;
  exitLabel?: string;
  prevHref?: string;
  prevLabel?: string;
  nextHref?: string;
  nextLabel?: string;
  learnedSummary?: string[];
}

interface RunningState {
  startedAt: number;
  cursor: number;
  answers: Record<number, OptionLetter | null>;
  reasons: Record<number, string>;
}

function initialState(
  questions: Question[],
  resume?: CurrentAttempt | null
): RunningState {
  if (resume) {
    return {
      startedAt: resume.startedAt,
      cursor: Math.min(resume.cursor, questions.length - 1),
      answers: { ...resume.answers },
      reasons: { ...(resume.reasons ?? {}) },
    };
  }
  return {
    startedAt: Date.now(),
    cursor: 0,
    answers: {},
    reasons: {},
  };
}

function score(
  questions: Question[],
  answers: Record<number, OptionLetter | null>
): number {
  let n = 0;
  for (const q of questions) {
    if (answers[q.n] === q.correct) n++;
  }
  return n;
}

export function QuizRunner({
  title,
  subtitle,
  questions,
  passPct,
  collectReasons = false,
  resumeFrom,
  onCheckpoint,
  onComplete,
  exitHref,
  exitLabel = "Exit",
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
  learnedSummary,
}: QuizRunnerProps) {
  const [state, setState] = useState<RunningState>(() =>
    initialState(questions, resumeFrom)
  );
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  const total = questions.length;
  const current = questions[state.cursor];
  const progress = useMemo(
    () =>
      Math.round(
        ((Object.keys(state.answers).filter(
          (k) => state.answers[Number(k)] != null
        ).length) /
          total) *
          100
      ),
    [state.answers, total]
  );

  // Checkpoint on every change so resume works.
  useEffect(() => {
    if (submitted || !onCheckpoint) return;
    onCheckpoint({
      startedAt: state.startedAt,
      cursor: state.cursor,
      answers: state.answers,
      reasons: state.reasons,
    });
  }, [state, submitted, onCheckpoint]);

  // Functional setState patterns avoid stale closures so the keyboard
  // handler can be wired once and still see the latest cursor.
  function pickAtCursor(letter: OptionLetter) {
    setState((s) => {
      const n = questions[s.cursor].n;
      return { ...s, answers: { ...s.answers, [n]: letter } };
    });
  }
  function setReasonAtCursor(text: string) {
    setState((s) => {
      const n = questions[s.cursor].n;
      return { ...s, reasons: { ...s.reasons, [n]: text } };
    });
  }
  function next() {
    setState((s) => ({ ...s, cursor: Math.min(s.cursor + 1, total - 1) }));
  }
  function prev() {
    setState((s) => ({ ...s, cursor: Math.max(s.cursor - 1, 0) }));
  }

  // Keyboard shortcuts: 1-4 / A-D pick an answer; ←/→ navigate.
  // Disabled while focus is in the reasoning textarea so typing isn't
  // hijacked.
  useEffect(() => {
    if (submitted) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLInputElement
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const upper = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      const letter = KEY_TO_LETTER[upper];
      if (letter) {
        e.preventDefault();
        pickAtCursor(letter);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // pickAtCursor / next / prev capture functional updates so no deps needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  function submit() {
    const sc = score(questions, state.answers);
    const finished: QuizAttempt = {
      startedAt: state.startedAt,
      completedAt: Date.now(),
      total,
      score: sc,
      answers: state.answers,
      reasons: collectReasons ? state.reasons : undefined,
    };
    setAttempt(finished);
    setSubmitted(true);
    onCheckpoint?.(null);
    onComplete(finished);
  }

  if (submitted && attempt) {
    return (
      <QuizResult
        title={title}
        questions={questions}
        attempt={attempt}
        passPct={passPct}
        exitHref={exitHref}
        exitLabel={exitLabel}
        prevHref={prevHref}
        prevLabel={prevLabel}
        nextHref={nextHref}
        nextLabel={nextLabel}
        learnedSummary={learnedSummary}
      />
    );
  }

  const selected = state.answers[current.n] ?? null;
  const isLast = state.cursor === total - 1;

  return (
    <article>
      <header className="mb-3">
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-(--muted)">{subtitle}</p>
        ) : null}
      </header>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-(--panel-2)"
      >
        <div
          className="h-full bg-(--accent) transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mb-2 text-xs text-(--muted)">
        Question {state.cursor + 1} of {total}
      </p>
      <h2 className="mb-3 text-lg md:text-xl font-semibold text-(--ink)">
        {current.question}
      </h2>

      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Answer choices</legend>
        {LETTERS.map((L) => (
          <label
            key={L}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-md border bg-(--panel-2) p-3 transition-colors min-h-[44px]",
              "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--accent)",
              selected === L
                ? "border-(--accent) bg-(--accent)/10"
                : "border-(--border) hover:border-(--accent)/50"
            )}
          >
            <input
              type="radio"
              name={`q-${current.n}`}
              value={L}
              checked={selected === L}
              onChange={() => pickAtCursor(L)}
              className="absolute h-0 w-0 opacity-0"
            />
            <span
              aria-hidden
              className="mt-0.5 w-6 font-mono text-sm font-bold text-(--accent-2)"
            >
              {L}.
            </span>
            <span className="flex-1 text-sm md:text-base">
              {current.options[L]}
            </span>
            <kbd
              aria-hidden
              className="hidden md:inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-(--border) bg-(--panel) px-1 font-mono text-[10px] text-(--muted)"
            >
              {NUM_FOR_LETTER[L]}
            </kbd>
          </label>
        ))}
      </fieldset>

      <p className="mt-2 hidden text-xs text-(--muted) md:block">
        Tip: press <kbd className="rounded border border-(--border) bg-(--panel-2) px-1 font-mono">1</kbd>–<kbd className="rounded border border-(--border) bg-(--panel-2) px-1 font-mono">4</kbd>{" "}or{" "}
        <kbd className="rounded border border-(--border) bg-(--panel-2) px-1 font-mono">A</kbd>–<kbd className="rounded border border-(--border) bg-(--panel-2) px-1 font-mono">D</kbd>{" "}to pick.{" "}
        Use <kbd className="rounded border border-(--border) bg-(--panel-2) px-1 font-mono">←</kbd>{" "}/{" "}<kbd className="rounded border border-(--border) bg-(--panel-2) px-1 font-mono">→</kbd>{" "}to navigate.
      </p>

      {collectReasons ? (
        <div className="mt-4">
          <label
            htmlFor={`reason-${current.n}`}
            className="mb-1 block text-xs text-(--muted)"
          >
            Why this answer? (your reasoning — saved with the attempt)
          </label>
          <textarea
            id={`reason-${current.n}`}
            value={state.reasons[current.n] ?? ""}
            onChange={(e) => setReasonAtCursor(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border border-(--border) bg-(--panel-2) p-2 text-sm leading-relaxed focus:border-(--accent) focus:outline-none"
          />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dashed border-(--border) pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prev}
          disabled={state.cursor === 0}
        >
          ← Previous
        </Button>
        <a href={exitHref} className="text-xs text-(--muted) hover:text-(--ink)">
          {exitLabel}
        </a>
        <div className="ml-auto flex gap-2">
          {!isLast ? (
            <Button variant="default" size="sm" onClick={next}>
              Next →
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={submit}
              disabled={Object.keys(state.answers).length === 0}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
