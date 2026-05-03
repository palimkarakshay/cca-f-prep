"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  FillInQuestion,
  MCQQuestion,
  Question,
  TrueFalseQuestion,
} from "@/content/curriculum-types";
import type {
  AnswerValue,
  CurrentAttempt,
  QuizAttempt,
} from "@/lib/progress-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuizResult } from "./QuizResult";
import {
  isFillIn,
  isMCQ,
  isTrueFalse,
  kindOf,
  scoreAttempt,
} from "./question-utils";

const MCQ_LETTERS: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
const MCQ_KEY_TO_LETTER: Record<string, "A" | "B" | "C" | "D"> = {
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
};
const MCQ_NUM_FOR_LETTER: Record<"A" | "B" | "C" | "D", string> = {
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
  answers: Record<number, AnswerValue | null>;
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

// ------------------------------------------------------------------
// Per-kind input renderers
// ------------------------------------------------------------------

function MCQInput({
  question,
  selected,
  onPick,
}: {
  question: MCQQuestion;
  selected: AnswerValue | null;
  onPick: (letter: "A" | "B" | "C" | "D") => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">Answer choices</legend>
      {MCQ_LETTERS.map((L) => (
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
            name={`q-${question.n}`}
            value={L}
            checked={selected === L}
            onChange={() => onPick(L)}
            className="absolute h-0 w-0 opacity-0"
          />
          <span
            aria-hidden
            className="mt-0.5 w-6 font-mono text-sm font-bold text-(--accent-2)"
          >
            {L}.
          </span>
          <span className="flex-1 text-sm md:text-base">
            {question.options[L]}
          </span>
          <kbd
            aria-hidden
            className="hidden md:inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-(--border) bg-(--panel) px-1 font-mono text-[10px] text-(--muted)"
          >
            {MCQ_NUM_FOR_LETTER[L]}
          </kbd>
        </label>
      ))}
    </fieldset>
  );
}

function TrueFalseInput({
  question,
  selected,
  onPick,
}: {
  question: TrueFalseQuestion;
  selected: AnswerValue | null;
  onPick: (value: boolean) => void;
}) {
  const isSelectedTrue = selected === true;
  const isSelectedFalse = selected === false;
  return (
    <fieldset className="flex flex-col gap-2 sm:flex-row">
      <legend className="sr-only">True or false</legend>
      <label
        className={cn(
          "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border bg-(--panel-2) p-4 text-base font-semibold transition-colors min-h-[64px]",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--accent)",
          isSelectedTrue
            ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
            : "border-(--border) hover:border-(--accent)/50"
        )}
      >
        <input
          type="radio"
          name={`q-${question.n}`}
          value="true"
          checked={isSelectedTrue}
          onChange={() => onPick(true)}
          className="absolute h-0 w-0 opacity-0"
        />
        <span>True</span>
        <kbd
          aria-hidden
          className="hidden md:inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-(--border) bg-(--panel) px-1 font-mono text-[10px] text-(--muted)"
        >
          T
        </kbd>
      </label>
      <label
        className={cn(
          "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border bg-(--panel-2) p-4 text-base font-semibold transition-colors min-h-[64px]",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--accent)",
          isSelectedFalse
            ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
            : "border-(--border) hover:border-(--accent)/50"
        )}
      >
        <input
          type="radio"
          name={`q-${question.n}`}
          value="false"
          checked={isSelectedFalse}
          onChange={() => onPick(false)}
          className="absolute h-0 w-0 opacity-0"
        />
        <span>False</span>
        <kbd
          aria-hidden
          className="hidden md:inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-(--border) bg-(--panel) px-1 font-mono text-[10px] text-(--muted)"
        >
          F
        </kbd>
      </label>
    </fieldset>
  );
}

function FillInInput({
  question,
  selected,
  onPick,
}: {
  question: FillInQuestion;
  selected: AnswerValue | null;
  onPick: (value: string) => void;
}) {
  const value = typeof selected === "string" ? selected : "";
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`q-${question.n}-fillin`} className="sr-only">
        Type your answer
      </label>
      <input
        id={`q-${question.n}-fillin`}
        type="text"
        value={value}
        placeholder={question.placeholder ?? "Type your answer…"}
        onChange={(e) => onPick(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "w-full rounded-md border bg-(--panel-2) p-3 text-base transition-colors min-h-[44px]",
          "focus:border-(--accent) focus:outline-none",
          value.trim().length > 0
            ? "border-(--accent)"
            : "border-(--border)"
        )}
      />
      <p className="text-xs text-(--muted)">
        Case- and whitespace-insensitive. Multiple spellings may be accepted.
      </p>
    </div>
  );
}

// ------------------------------------------------------------------
// Main runner
// ------------------------------------------------------------------

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
        (Object.keys(state.answers).filter(
          (k) => state.answers[Number(k)] != null
        ).length /
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
  function pickAtCursor(value: AnswerValue) {
    setState((s) => {
      const n = questions[s.cursor].n;
      return { ...s, answers: { ...s.answers, [n]: value } };
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

  // Keyboard shortcuts vary by question kind. Fill-in questions
  // disable shortcuts entirely (the input would intercept anyway).
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

      const cur = questions[state.cursor];
      const upper = e.key.length === 1 ? e.key.toUpperCase() : e.key;

      if (isMCQ(cur)) {
        const letter = MCQ_KEY_TO_LETTER[upper];
        if (letter) {
          e.preventDefault();
          pickAtCursor(letter);
          return;
        }
      } else if (isTrueFalse(cur)) {
        if (upper === "T") {
          e.preventDefault();
          pickAtCursor(true);
          return;
        }
        if (upper === "F") {
          e.preventDefault();
          pickAtCursor(false);
          return;
        }
      }
      // fill-in: keyboard shortcuts intentionally disabled (would
      // hijack typing once the input loses then regains focus).

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
  }, [submitted, state.cursor]);

  function submit() {
    const sc = scoreAttempt(questions, state.answers);
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
  const kind = kindOf(current);

  // Keyboard hint adapts to the current kind.
  const kbHint =
    kind === "mcq"
      ? "Tip: 1–4 / A–D to pick, ←/→ to navigate."
      : kind === "true-false"
        ? "Tip: T / F to pick, ←/→ to navigate."
        : "Tip: type your answer, ←/→ to navigate.";

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
        <span className="ml-2 rounded-full border border-(--border) px-2 py-0.5 text-[10px] uppercase tracking-wide">
          {kind === "true-false"
            ? "True / False"
            : kind === "fill-in"
              ? "Fill in"
              : "Multiple choice"}
        </span>
      </p>
      <h2 className="mb-3 text-lg md:text-xl font-semibold text-(--ink)">
        {current.question}
      </h2>

      {isMCQ(current) ? (
        <MCQInput
          question={current}
          selected={selected}
          onPick={(letter) => pickAtCursor(letter)}
        />
      ) : isTrueFalse(current) ? (
        <TrueFalseInput
          question={current}
          selected={selected}
          onPick={(value) => pickAtCursor(value)}
        />
      ) : isFillIn(current) ? (
        <FillInInput
          question={current}
          selected={selected}
          onPick={(value) => pickAtCursor(value)}
        />
      ) : null}

      <p className="mt-2 hidden text-xs text-(--muted) md:block">{kbHint}</p>

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
