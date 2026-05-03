"use client";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Timer, RotateCcw, Check, X, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGamesStore } from "@/hooks/useGamesStore";
import {
  DEFAULT_TRIVIA_CONFIG,
  buildQuestions,
  maxPossibleScore,
  newTriviaState,
  reduce,
  type TriviaConfig,
  type TriviaState,
} from "./engine";
import type { OptionLetter, Section } from "@/content/curriculum-types";

const TICK_MS = 100;

interface TimeTriviaGameProps {
  section: Section;
  packId: string;
  /** Optional config override; tests pass a tighter timeline. */
  config?: TriviaConfig;
  /** Seedable rng for tests + storybook so the question order
   *  isn't random. The default uses Math.random. */
  rng?: () => number;
}

export function TimeTriviaGame({
  section,
  packId,
  config = DEFAULT_TRIVIA_CONFIG,
  rng,
}: TimeTriviaGameProps) {
  const { recordAttempt } = useGamesStore();

  const initialState = useState<TriviaState>(() =>
    newTriviaState(buildQuestions(section, config.questionCount, rng), config)
  )[0];

  const [state, dispatch] = useReducer(reduce, initialState);
  const recordedAt = useRef<number | null>(null);

  // Drive the countdown while playing. Stop on phase change.
  useEffect(() => {
    if (state.phase !== "playing") return;
    const id = window.setInterval(() => {
      dispatch({ type: "tick", deltaMs: TICK_MS });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [state.phase]);

  // Auto-advance from "revealing" back to "playing" after the
  // configured pause so the user has time to read the feedback.
  useEffect(() => {
    if (state.phase !== "revealing") return;
    const id = window.setTimeout(
      () => dispatch({ type: "next" }),
      state.config.reviewMs
    );
    return () => window.clearTimeout(id);
  }, [state.phase, state.config.reviewMs]);

  // Persist the run's outcome once. Re-renders post-completion mustn't
  // double-record, so we gate on recordedAt.current.
  useEffect(() => {
    if (state.phase !== "done") return;
    if (recordedAt.current !== null) return;
    const now = Date.now();
    recordedAt.current = now;
    recordAttempt("time-trivia", {
      sectionId: section.id,
      score: state.score,
      maxScore: maxPossibleScore(state.questions.length, state.config),
      durationMs: state.durationMs,
      finishedAt: now,
    });
  }, [
    state.phase,
    state.score,
    state.durationMs,
    state.config,
    state.questions.length,
    section.id,
    recordAttempt,
  ]);

  const handleSelect = useCallback(
    (option: OptionLetter) => {
      if (state.phase !== "playing") return;
      dispatch({ type: "select", option });
    },
    [state.phase]
  );

  // Keyboard shortcuts: 1/2/3/4 -> A/B/C/D. Only active during play.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (state.phase !== "playing") return;
      const map: Record<string, OptionLetter> = {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
      };
      const opt = map[e.key];
      if (opt) {
        e.preventDefault();
        handleSelect(opt);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, handleSelect]);

  if (state.questions.length === 0) {
    return <EmptyState packId={packId} sectionId={section.id} />;
  }

  if (state.phase === "idle") {
    return (
      <StartScreen
        section={section}
        config={state.config}
        questionCount={state.questions.length}
        onStart={() => dispatch({ type: "start" })}
      />
    );
  }

  if (state.phase === "done") {
    return (
      <ResultScreen
        state={state}
        section={section}
        packId={packId}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <PlayScreen state={state} onSelect={handleSelect} />;
}

function EmptyState({ packId, sectionId }: { packId: string; sectionId: string }) {
  return (
    <Card tone="warn" className="p-6">
      <h2 className="text-base font-semibold text-(--ink)">No questions yet</h2>
      <p className="mt-2 text-sm text-(--muted)">
        This section's concept quizzes don't have any MCQs to draw from. Try
        another section.
      </p>
      <Link
        href={`/${packId}/section/${sectionId}?tab=games`}
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "mt-4 no-underline"
        )}
      >
        Back to games
      </Link>
    </Card>
  );
}

function StartScreen({
  section,
  config,
  questionCount,
  onStart,
}: {
  section: Section;
  config: TriviaConfig;
  questionCount: number;
  onStart: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3 p-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
          Time Trivia
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          {section.title}
        </h1>
      </header>
      <ul className="ml-4 list-disc space-y-1 text-sm text-(--muted)">
        <li>{questionCount} questions, drawn from the section's concept quizzes</li>
        <li>{config.perQuestionMs / 1000} seconds per question</li>
        <li>
          Speed bonus up to {config.speedBonusFullPoints} pts when you answer
          with {config.speedBonusFullThresholdMs / 1000}+ seconds left
        </li>
        <li>
          Streak bonus of {config.streakBonusPoints} pts every {config.streakEvery}
          {" "}correct in a row
        </li>
      </ul>
      <button
        type="button"
        onClick={onStart}
        className={cn(
          buttonVariants({ variant: "default", size: "default" }),
          "self-start"
        )}
      >
        Start round
      </button>
    </Card>
  );
}

function PlayScreen({
  state,
  onSelect,
}: {
  state: TriviaState;
  onSelect: (o: OptionLetter) => void;
}) {
  const q = state.questions[state.questionIdx];
  const total = state.questions.length;
  const progressPct = (state.msLeft / state.config.perQuestionMs) * 100;
  const tone = state.phase === "revealing" ? "stale" : "live";
  const lastOutcome =
    state.phase === "revealing"
      ? state.outcomes[state.outcomes.length - 1]
      : null;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between text-xs">
        <span className="font-mono text-(--muted)">
          Question {state.questionIdx + 1} of {total}
        </span>
        <span className="flex items-center gap-2">
          <span className="rounded-full border border-(--border) bg-(--panel-2) px-2 py-0.5 font-mono text-(--ink)">
            {state.score} pts
          </span>
          {state.correctStreak >= state.config.streakEvery ? (
            <span className="rounded-full border border-(--good)/40 bg-(--good)/10 px-2 py-0.5 font-mono text-(--good)">
              {state.correctStreak}× streak
            </span>
          ) : null}
        </span>
      </header>

      {/* Countdown bar — shrinks as msLeft drains. role=timer for SR. */}
      <div
        role="progressbar"
        aria-label="Time left"
        aria-valuemin={0}
        aria-valuemax={state.config.perQuestionMs}
        aria-valuenow={state.msLeft}
        className="h-1.5 overflow-hidden rounded-full bg-(--panel-2)"
      >
        <div
          className={cn(
            "h-full transition-[width] duration-100 ease-linear",
            progressPct > 50
              ? "bg-(--accent-2)"
              : progressPct > 25
                ? "bg-(--warn)"
                : "bg-(--bad)"
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <Card
        tone={tone === "live" ? "default" : lastOutcome?.correct ? "good" : "bad"}
        className="flex flex-col gap-3 p-5"
      >
        <p className="flex items-start gap-2 text-base font-semibold text-(--ink)">
          <Timer className="h-4 w-4 flex-none text-(--accent-2) mt-1" aria-hidden />
          <span>{q.question}</span>
        </p>
        <ul className="flex flex-col gap-2">
          {(["A", "B", "C", "D"] as const).map((letter) => {
            const text = q.options[letter];
            const isPicked = state.selected === letter;
            const isCorrect = q.correct === letter;
            const showAsCorrect = state.phase === "revealing" && isCorrect;
            const showAsWrong =
              state.phase === "revealing" && isPicked && !isCorrect;
            return (
              <li key={letter}>
                <button
                  type="button"
                  onClick={() => onSelect(letter)}
                  disabled={state.phase !== "playing"}
                  aria-pressed={isPicked}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left text-sm transition-colors",
                    "min-h-12", // tap target >= 48px on touch
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                    showAsCorrect
                      ? "border-(--good) bg-(--good)/15 text-(--ink)"
                      : showAsWrong
                        ? "border-(--bad) bg-(--bad)/15 text-(--ink)"
                        : isPicked
                          ? "border-(--accent) bg-(--panel-2) text-(--ink)"
                          : "border-(--border) bg-(--panel) text-(--ink) hover:border-(--accent)/60 hover:bg-(--panel-2)"
                  )}
                >
                  <span
                    aria-hidden
                    className="font-mono text-[11px] text-(--accent-2)"
                  >
                    {letter}
                  </span>
                  <span className="flex-1">{text}</span>
                  {showAsCorrect ? (
                    <Check className="h-4 w-4 text-(--good)" aria-hidden />
                  ) : showAsWrong ? (
                    <X className="h-4 w-4 text-(--bad)" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        {lastOutcome && q.principle ? (
          <p className="text-xs text-(--muted)">
            <span className="font-semibold text-(--accent-2)">Principle.</span>{" "}
            {q.principle}
          </p>
        ) : null}
      </Card>

      <p className="text-[11px] text-(--muted)">
        Tip: press <kbd className="rounded bg-(--panel-2) px-1">1</kbd>–
        <kbd className="rounded bg-(--panel-2) px-1">4</kbd> to pick A–D.
      </p>
    </div>
  );
}

function ResultScreen({
  state,
  section,
  packId,
  onRetry,
}: {
  state: TriviaState;
  section: Section;
  packId: string;
  onRetry: () => void;
}) {
  const max = maxPossibleScore(state.questions.length, state.config);
  const pct = max > 0 ? Math.round((state.score / max) * 100) : 0;
  const correctCount = state.outcomes.filter((o) => o.correct).length;
  const totalSecs = Math.round(state.durationMs / 1000);

  return (
    <Card tone="accent" className="flex flex-col gap-4 p-6">
      <header className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-(--panel-2) text-(--accent-2)"
        >
          <Trophy className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)">
            Round complete
          </h2>
          <p className="text-xs text-(--muted)">
            {section.title} · {totalSecs}s
          </p>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="Score" value={`${state.score}`} sub={`/ ${max}`} />
        <Stat label="Accuracy" value={`${pct}%`} sub={`${correctCount}/${state.questions.length}`} />
        <Stat label="Time" value={`${totalSecs}s`} sub={`${Math.round(state.durationMs / state.questions.length / 1000)}s avg`} />
        <Stat label="Best streak" value={`${maxStreak(state)}×`} sub="in a row" />
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRetry}
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-2")}
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Play again
        </button>
        <Link
          href={`/${packId}/section/${section.id}?tab=games`}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "no-underline"
          )}
        >
          Back to games
        </Link>
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border border-(--border) bg-(--panel) p-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-(--accent-2)">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-lg text-(--ink)">{value}</dd>
      {sub ? <dd className="text-[11px] text-(--muted)">{sub}</dd> : null}
    </div>
  );
}

function maxStreak(state: TriviaState): number {
  let best = 0;
  let cur = 0;
  for (const o of state.outcomes) {
    if (o.correct) {
      cur += 1;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  return best;
}
