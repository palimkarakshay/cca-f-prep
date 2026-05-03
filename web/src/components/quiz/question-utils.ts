/* ------------------------------------------------------------------
   Question helpers — per-kind dispatch for scoring + display.

   Adding a new question kind means: extend the discriminated union
   in `curriculum-types.ts`, add a case here for `isCorrect()` and
   `displayCanonicalAnswer()`, add a renderer in QuizRunner, and add
   a result renderer in QuizResult.
------------------------------------------------------------------ */

import type {
  Question,
  MCQQuestion,
  TrueFalseQuestion,
  FillInQuestion,
} from "@/content/curriculum-types";
import type { AnswerValue } from "@/lib/progress-types";

/** Return the question's `kind`, defaulting to "mcq" for back-compat. */
export function kindOf(q: Question): "mcq" | "true-false" | "fill-in" {
  return (q as { kind?: "mcq" | "true-false" | "fill-in" }).kind ?? "mcq";
}

export function isMCQ(q: Question): q is MCQQuestion {
  return kindOf(q) === "mcq";
}
export function isTrueFalse(q: Question): q is TrueFalseQuestion {
  return kindOf(q) === "true-false";
}
export function isFillIn(q: Question): q is FillInQuestion {
  return kindOf(q) === "fill-in";
}

function normalizeFillIn(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Whether the supplied answer counts as correct for this question.
 * Tolerant of nulls and missing kind (treated as MCQ).
 */
export function isCorrect(
  q: Question,
  answer: AnswerValue | null | undefined
): boolean {
  if (answer == null) return false;
  if (isMCQ(q)) {
    return answer === q.correct;
  }
  if (isTrueFalse(q)) {
    return answer === q.correct;
  }
  if (isFillIn(q)) {
    if (typeof answer !== "string") return false;
    const norm = normalizeFillIn(answer);
    return q.acceptedAnswers.some((a) => normalizeFillIn(a) === norm);
  }
  return false;
}

/**
 * Compute the score for a quiz attempt across all question kinds.
 */
export function scoreAttempt(
  questions: Question[],
  answers: Record<number, AnswerValue | null>
): number {
  let n = 0;
  for (const q of questions) {
    if (isCorrect(q, answers[q.n])) n++;
  }
  return n;
}

/**
 * Human-readable canonical answer for the result view, by kind.
 */
export function displayCanonicalAnswer(q: Question): string {
  if (isMCQ(q)) {
    return `${q.correct}. ${q.options[q.correct]}`;
  }
  if (isTrueFalse(q)) {
    return q.correct ? "True" : "False";
  }
  if (isFillIn(q)) {
    return q.acceptedAnswers[0] ?? "";
  }
  return "";
}

/**
 * Human-readable rendering of the user's answer for the result view.
 */
export function displayUserAnswer(
  q: Question,
  answer: AnswerValue | null | undefined
): string {
  if (answer == null) return "—";
  if (isMCQ(q)) {
    const letter = answer as MCQQuestion["correct"];
    return `${letter}. ${q.options[letter] ?? "(unknown option)"}`;
  }
  if (isTrueFalse(q)) {
    return answer ? "True" : "False";
  }
  if (isFillIn(q)) {
    return typeof answer === "string" ? answer || "(empty)" : "(unexpected type)";
  }
  return String(answer);
}
