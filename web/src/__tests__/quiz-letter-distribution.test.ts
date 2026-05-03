import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import type { MCQQuestion } from "@/content/curriculum-types";

/**
 * Content-drift guard. The CCA-F repo's own README + CLAUDE.md
 * (`letter-bias-2026-05`) flag the risk that auto-authored quizzes drift
 * toward correct-letter B. This test fails any MCQ-only quiz of ≥ 4
 * questions where a single letter exceeds 60% of the correct answers.
 *
 * True/false and fill-in questions are exempt — the rule is letter
 * specific. Quizzes shorter than 4 questions are exempt — the small
 * sample size makes the threshold meaningless.
 */

const MIN_QUESTIONS = 4;
const MAX_PROPORTION = 0.6;

interface Offender {
  ownerId: string;
  total: number;
  counts: Record<string, number>;
  worstLetter: string;
  worstPct: number;
}

function letterCounts(qs: MCQQuestion[]): Record<string, number> {
  const out: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) out[q.correct] = (out[q.correct] ?? 0) + 1;
  return out;
}

function findOffenders(): Offender[] {
  const offenders: Offender[] = [];
  for (const section of CURRICULUM.sections) {
    for (const concept of section.concepts) {
      const mcqs = (concept.quiz?.questions ?? []).filter(
        (q): q is MCQQuestion => !q.kind || q.kind === "mcq"
      );
      if (mcqs.length < MIN_QUESTIONS) continue;
      const counts = letterCounts(mcqs);
      let worstLetter = "A";
      let worstCount = 0;
      for (const [letter, count] of Object.entries(counts)) {
        if (count > worstCount) {
          worstLetter = letter;
          worstCount = count;
        }
      }
      const worstPct = worstCount / mcqs.length;
      if (worstPct > MAX_PROPORTION) {
        offenders.push({
          ownerId: `${section.id}/${concept.id}`,
          total: mcqs.length,
          counts,
          worstLetter,
          worstPct,
        });
      }
    }
    if (section.sectionTest) {
      const mcqs = section.sectionTest.questions.filter(
        (q): q is MCQQuestion => !q.kind || q.kind === "mcq"
      );
      if (mcqs.length >= MIN_QUESTIONS) {
        const counts = letterCounts(mcqs);
        let worstLetter = "A";
        let worstCount = 0;
        for (const [letter, count] of Object.entries(counts)) {
          if (count > worstCount) {
            worstLetter = letter;
            worstCount = count;
          }
        }
        const worstPct = worstCount / mcqs.length;
        if (worstPct > MAX_PROPORTION) {
          offenders.push({
            ownerId: `${section.id}/section-test`,
            total: mcqs.length,
            counts,
            worstLetter,
            worstPct,
          });
        }
      }
    }
  }
  return offenders;
}

describe("MCQ correct-letter distribution", () => {
  it("no MCQ quiz of >= 4 questions has any letter > 60%", () => {
    const offenders = findOffenders();
    const summary = offenders
      .map(
        (o) =>
          `${o.ownerId}: ${o.worstLetter}=${o.counts[o.worstLetter]}/${o.total} (${Math.round(o.worstPct * 100)}%)`
      )
      .join("\n  ");
    expect(
      offenders,
      offenders.length === 0
        ? ""
        : `letter-bias drift — rebalance these quizzes:\n  ${summary}`
    ).toEqual([]);
  });
});
