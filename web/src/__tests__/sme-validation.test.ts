/* ------------------------------------------------------------------
   SME workbench letter-bias validator.

   Pins the trip-wire that warns SMEs when their edits skew the
   correct-answer letters past 60% on a single letter. Complements
   the build-time test on the static curriculum
   (quiz-letter-distribution.test.ts).
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import type {
  Concept,
  MCQQuestion,
  OptionLetter,
} from "@/content/curriculum-types";
import {
  LETTER_BIAS_MIN_QUESTIONS,
  computeLetterBiasWarnings,
} from "@/lib/sme-validation";
import type { SMEEdits } from "@/lib/sme-edits";

function makeMcq(n: number, correct: OptionLetter): MCQQuestion {
  return {
    n,
    question: `Q${n}`,
    options: { A: "a", B: "b", C: "c", D: "d" },
    correct,
  };
}

function makeConcept(id: string, letters: OptionLetter[]): Concept {
  return {
    id,
    title: id,
    lesson: { paragraphs: [] },
    quiz: {
      questions: letters.map((l, i) => makeMcq(i + 1, l)),
    },
  } as unknown as Concept;
}

function emptyEdits(): SMEEdits {
  return { concepts: {}, newConcepts: {} };
}

describe("computeLetterBiasWarnings", () => {
  it("flags an edited concept with all-B answers", () => {
    const source = makeConcept("c1", ["A", "B", "C", "D"]);
    const edits: SMEEdits = {
      ...emptyEdits(),
      concepts: {
        c1: {
          status: "edited",
          questions: {
            1: { n: 1, correct: "B" },
            2: { n: 2, correct: "B" },
            3: { n: 3, correct: "B" },
            4: { n: 4, correct: "B" },
          },
        },
      },
    };
    const out = computeLetterBiasWarnings(edits, [source]);
    expect(out).toHaveLength(1);
    expect(out[0].conceptId).toBe("c1");
    expect(out[0].worstLetter).toBe("B");
    expect(out[0].worstPct).toBe(1);
  });

  it("does not flag an untouched (draft) concept even if biased", () => {
    // The static pack has its own build-time letter-bias test;
    // this validator only inspects what the SME has touched.
    const source = makeConcept("c1", ["B", "B", "B", "B"]);
    const edits: SMEEdits = emptyEdits(); // no overlay
    expect(computeLetterBiasWarnings(edits, [source])).toEqual([]);
  });

  it("skips concepts with fewer than the minimum MCQ count", () => {
    const source = makeConcept("c1", ["B", "B"]);
    expect(LETTER_BIAS_MIN_QUESTIONS).toBeGreaterThan(2);
    const edits: SMEEdits = {
      ...emptyEdits(),
      concepts: { c1: { status: "edited" } },
    };
    expect(computeLetterBiasWarnings(edits, [source])).toEqual([]);
  });

  it("ignores rejected concepts", () => {
    const source = makeConcept("c1", ["A", "B", "C", "D"]);
    const edits: SMEEdits = {
      ...emptyEdits(),
      concepts: {
        c1: {
          status: "rejected",
          questions: {
            1: { n: 1, correct: "B" },
            2: { n: 2, correct: "B" },
            3: { n: 3, correct: "B" },
            4: { n: 4, correct: "B" },
          },
        },
      },
    };
    expect(computeLetterBiasWarnings(edits, [source])).toEqual([]);
  });

  it("respects approved status (still flagged so the SME sees the smell)", () => {
    const source = makeConcept("c1", ["A", "B", "C", "D"]);
    const edits: SMEEdits = {
      ...emptyEdits(),
      concepts: {
        c1: {
          status: "approved",
          approvedBy: "Sam",
          approvedAt: new Date().toISOString(),
          questions: {
            1: { n: 1, correct: "B" },
            2: { n: 2, correct: "B" },
            3: { n: 3, correct: "B" },
            4: { n: 4, correct: "B" },
          },
        },
      },
    };
    const out = computeLetterBiasWarnings(edits, [source]);
    expect(out).toHaveLength(1);
    expect(out[0].worstLetter).toBe("B");
  });

  it("does not flag healthy distributions", () => {
    const source = makeConcept("c1", ["A", "B", "C", "D"]);
    const edits: SMEEdits = {
      ...emptyEdits(),
      concepts: {
        c1: { status: "edited" }, // no overrides → keeps source letters
      },
    };
    expect(computeLetterBiasWarnings(edits, [source])).toEqual([]);
  });
});
