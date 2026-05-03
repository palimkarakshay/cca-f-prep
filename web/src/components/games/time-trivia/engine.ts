/* ------------------------------------------------------------------
   Time Trivia engine (pure).

   This module owns the game's state machine + scoring. Zero React,
   zero DOM, zero curriculum-singleton imports — the host (the route
   page in PR3.3) supplies a `Section` and dispatches events; the
   engine returns the next state. Easy to test, easy to swap into
   any pack.
------------------------------------------------------------------ */

import type {
  MCQQuestion,
  OptionLetter,
  Section,
} from "@/content/curriculum-types";

export interface TriviaConfig {
  /** Wall-clock budget per question, in ms. */
  perQuestionMs: number;
  /** Base points for a correct answer (before bonuses). */
  basePerCorrect: number;
  /** Maximum speed bonus (added when the answer lands with at least
   *  speedBonusFullThresholdMs of clock left). */
  speedBonusFullPoints: number;
  /** Threshold on remaining ms above which the full bonus applies;
   *  below it the bonus scales linearly to 0. */
  speedBonusFullThresholdMs: number;
  /** Streak bonus is awarded on every Nth correct in a row. */
  streakEvery: number;
  streakBonusPoints: number;
  /** Number of questions in a round. */
  questionCount: number;
  /** Pause between questions while the user reads the right/wrong
   *  feedback. The host triggers `next` after this delay. */
  reviewMs: number;
}

export const DEFAULT_TRIVIA_CONFIG: TriviaConfig = {
  perQuestionMs: 15_000,
  basePerCorrect: 100,
  speedBonusFullPoints: 50,
  speedBonusFullThresholdMs: 8_000,
  streakEvery: 3,
  streakBonusPoints: 50,
  questionCount: 10,
  reviewMs: 1_500,
};

export type TriviaPhase = "idle" | "playing" | "revealing" | "done";

export interface TriviaQuestionOutcome {
  questionIndex: number;
  selected: OptionLetter | null;
  correct: boolean;
  msUsed: number;
  pointsEarned: number;
}

export interface TriviaState {
  phase: TriviaPhase;
  config: TriviaConfig;
  questions: MCQQuestion[];
  questionIdx: number;
  /** Remaining ms on the current question's countdown. */
  msLeft: number;
  /** Locked-in answer for the current question, or null if none yet. */
  selected: OptionLetter | null;
  score: number;
  correctStreak: number;
  outcomes: TriviaQuestionOutcome[];
  /** Cumulative wall-clock so the run's GameAttempt has a duration. */
  durationMs: number;
}

export type TriviaEvent =
  | { type: "start" }
  | { type: "tick"; deltaMs: number }
  | { type: "select"; option: OptionLetter }
  /** No selection — used when the host's countdown reaches zero or
   *  the user explicitly skips. */
  | { type: "submit" }
  | { type: "next" };

/**
 * Pull MCQ-only questions from a section's concept quizzes, shuffle,
 * and take the first `count`. true-false and fill-in are excluded —
 * the time-pressure flow assumes a 4-option pick. Use the optional
 * `rng` to seed-determine the order in tests.
 */
export function buildQuestions(
  section: Section,
  count: number,
  rng: () => number = Math.random
): MCQQuestion[] {
  const all: MCQQuestion[] = [];
  for (const concept of section.concepts) {
    if (!concept.quiz) continue;
    for (const q of concept.quiz.questions) {
      if (!q.kind || q.kind === "mcq") all.push(q as MCQQuestion);
    }
  }
  // Fisher-Yates shuffle.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
}

export function newTriviaState(
  questions: MCQQuestion[],
  config: TriviaConfig
): TriviaState {
  return {
    phase: "idle",
    config,
    questions,
    questionIdx: 0,
    msLeft: config.perQuestionMs,
    selected: null,
    score: 0,
    correctStreak: 0,
    outcomes: [],
    durationMs: 0,
  };
}

/** Speed bonus is linear from 0 (no time left) to
 *  speedBonusFullPoints (>= speedBonusFullThresholdMs left). */
export function speedBonusFor(
  msLeft: number,
  config: TriviaConfig
): number {
  if (msLeft <= 0) return 0;
  const capped = Math.min(msLeft, config.speedBonusFullThresholdMs);
  return Math.round(
    (capped / config.speedBonusFullThresholdMs) * config.speedBonusFullPoints
  );
}

/**
 * Theoretical max score for a round of `questionCount` questions.
 * Used for the GameAttempt `maxScore` field + the result screen's
 * % display. Assumes a perfect run: every Q correct, full speed
 * bonus, every Nth streak.
 *
 * `questionCount` is the actual deck length, NOT `config.questionCount`
 * — sparse sections (e.g. s9-cowork has only 9 MCQs) produce a
 * shorter deck and the denominator must match or the result %
 * is systematically too low even on a perfect play.
 */
export function maxPossibleScore(
  questionCount: number,
  config: TriviaConfig
): number {
  const perQ = config.basePerCorrect + config.speedBonusFullPoints;
  const streakBonuses =
    Math.floor(questionCount / config.streakEvery) *
    config.streakBonusPoints;
  return perQ * questionCount + streakBonuses;
}

function finalizeCurrentQuestion(state: TriviaState): TriviaState {
  const q = state.questions[state.questionIdx];
  const correct = state.selected !== null && state.selected === q.correct;
  const msUsed = state.config.perQuestionMs - state.msLeft;

  let pointsEarned = 0;
  let nextStreak = state.correctStreak;
  if (correct) {
    pointsEarned += state.config.basePerCorrect;
    pointsEarned += speedBonusFor(state.msLeft, state.config);
    nextStreak += 1;
    if (
      nextStreak >= state.config.streakEvery &&
      nextStreak % state.config.streakEvery === 0
    ) {
      pointsEarned += state.config.streakBonusPoints;
    }
  } else {
    nextStreak = 0;
  }

  const outcome: TriviaQuestionOutcome = {
    questionIndex: state.questionIdx,
    selected: state.selected,
    correct,
    msUsed,
    pointsEarned,
  };

  return {
    ...state,
    phase: "revealing",
    score: state.score + pointsEarned,
    correctStreak: nextStreak,
    outcomes: [...state.outcomes, outcome],
  };
}

export function reduce(
  state: TriviaState,
  event: TriviaEvent
): TriviaState {
  switch (event.type) {
    case "start": {
      if (state.phase !== "idle") return state;
      return {
        ...state,
        phase: "playing",
        msLeft: state.config.perQuestionMs,
      };
    }
    case "tick": {
      if (state.phase !== "playing") return state;
      const nextMsLeft = Math.max(0, state.msLeft - event.deltaMs);
      const nextDuration = state.durationMs + event.deltaMs;
      const advanced: TriviaState = {
        ...state,
        msLeft: nextMsLeft,
        durationMs: nextDuration,
      };
      // When the clock hits zero, finalize with whatever (if anything)
      // the user had selected — same flow as an explicit `submit`.
      return nextMsLeft === 0 ? finalizeCurrentQuestion(advanced) : advanced;
    }
    case "select": {
      if (state.phase !== "playing") return state;
      return finalizeCurrentQuestion({ ...state, selected: event.option });
    }
    case "submit": {
      if (state.phase !== "playing") return state;
      return finalizeCurrentQuestion(state);
    }
    case "next": {
      if (state.phase !== "revealing") return state;
      const nextIdx = state.questionIdx + 1;
      if (nextIdx >= state.questions.length) {
        return { ...state, phase: "done" };
      }
      return {
        ...state,
        phase: "playing",
        questionIdx: nextIdx,
        msLeft: state.config.perQuestionMs,
        selected: null,
      };
    }
  }
}
