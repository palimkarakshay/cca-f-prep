/* ------------------------------------------------------------------
   SME workbench validators.

   Quality checks the workbench runs over the SME overlay before
   surfacing warnings to the SME. These are non-blocking — the SME
   can deploy anyway — but they call out the most common authoring
   smells so they don't quietly land in production.

   Today: one validator, letter-bias on edited MCQs. The curriculum
   already has a build-time letter-distribution test
   (src/__tests__/quiz-letter-distribution.test.ts) for the static
   pack content; this module is the runtime equivalent for SME
   overlays.

   The validator is intentionally pure — no DOM, no storage, no
   side effects — so it's easy to unit-test and reusable when the
   future server-side draft pipeline performs the same check on
   AI-generated quizzes.
------------------------------------------------------------------ */

import type {
  Concept,
  MCQQuestion,
  OptionLetter,
} from "@/content/curriculum-types";
import type { SMEEdits } from "./sme-edits";

export interface LetterBiasWarning {
  /** Concept id where the bias surfaces. */
  conceptId: string;
  /** Total MCQ questions counted. */
  total: number;
  /** Per-letter correct-answer counts. */
  counts: Record<OptionLetter, number>;
  /** The letter with the highest share. */
  worstLetter: OptionLetter;
  /** Share of correct answers held by the worst letter (0..1). */
  worstPct: number;
}

const MIN_QUESTIONS = 4;
const MAX_PROPORTION = 0.6;

/**
 * Apply an SME overlay's question edits on top of the source
 * MCQs. Returns the post-overlay correct-letter array, or null
 * when the concept's quiz isn't MCQ-dominant.
 */
function applyOverlay(
  source: Concept,
  overlay: SMEEdits["concepts"][string] | undefined
): OptionLetter[] | null {
  const sourceMcqs = (source.quiz?.questions ?? []).filter(
    (q): q is MCQQuestion => !q.kind || q.kind === "mcq"
  );
  if (sourceMcqs.length < MIN_QUESTIONS) return null;

  const overlayQuestions = overlay?.questions ?? {};
  return sourceMcqs.map((q) => {
    const o = overlayQuestions[q.n];
    return (o?.correct ?? q.correct) as OptionLetter;
  });
}

function tally(letters: OptionLetter[]): {
  counts: Record<OptionLetter, number>;
  worstLetter: OptionLetter;
  worstPct: number;
} {
  const counts: Record<OptionLetter, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const l of letters) counts[l]++;
  let worstLetter: OptionLetter = "A";
  let worstCount = 0;
  for (const letter of ["A", "B", "C", "D"] as OptionLetter[]) {
    if (counts[letter] > worstCount) {
      worstLetter = letter;
      worstCount = counts[letter];
    }
  }
  return {
    counts,
    worstLetter,
    worstPct: worstCount / letters.length,
  };
}

/**
 * Inspect every edited / approved concept in `edits` and surface
 * the ones whose post-overlay MCQ letter distribution exceeds
 * 60% for a single letter. Concepts shorter than 4 MCQs are
 * exempt — the threshold is meaningless on small samples.
 */
export function computeLetterBiasWarnings(
  edits: SMEEdits,
  sourceConcepts: Concept[]
): LetterBiasWarning[] {
  const byId = new Map(sourceConcepts.map((c) => [c.id, c]));
  const warnings: LetterBiasWarning[] = [];
  for (const [conceptId, overlay] of Object.entries(edits.concepts ?? {})) {
    // Only flag concepts the SME has touched (edited / approved /
    // rejected). Draft (untouched) concepts are the static pack
    // content and are already covered by the build-time test.
    if (overlay.status === "draft") continue;
    if (overlay.status === "rejected") continue;
    const source = byId.get(conceptId);
    if (!source) continue;
    const letters = applyOverlay(source, overlay);
    if (!letters) continue;
    const { counts, worstLetter, worstPct } = tally(letters);
    if (worstPct > MAX_PROPORTION) {
      warnings.push({
        conceptId,
        total: letters.length,
        counts,
        worstLetter,
        worstPct,
      });
    }
  }
  return warnings;
}

export const LETTER_BIAS_THRESHOLD = MAX_PROPORTION;
export const LETTER_BIAS_MIN_QUESTIONS = MIN_QUESTIONS;
