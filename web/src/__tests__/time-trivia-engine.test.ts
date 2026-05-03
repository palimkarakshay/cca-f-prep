import { describe, expect, it } from "vitest";
import {
  DEFAULT_TRIVIA_CONFIG,
  buildQuestions,
  maxPossibleScore,
  newTriviaState,
  reduce,
  speedBonusFor,
} from "@/components/games/time-trivia/engine";
import { CURRICULUM } from "@/content/curriculum";
import { getSectionFrom } from "@/content/curriculum-loader";
import type {
  MCQQuestion,
  Section,
} from "@/content/curriculum-types";

function seededRng(): () => number {
  // Linear-congruential generator with a fixed seed so test results
  // are deterministic across runs without depending on Math.random.
  let s = 1234567;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fff_ffff;
    return s / 0x8000_0000;
  };
}

const SECTION = (() => {
  const s = getSectionFrom(CURRICULUM, "s1-claude-101");
  if (!s) throw new Error("section s1-claude-101 not in curriculum");
  return s;
})();

const SAMPLE_MCQS: MCQQuestion[] = (() => {
  const out: MCQQuestion[] = [];
  for (const c of SECTION.concepts) {
    if (!c.quiz) continue;
    for (const q of c.quiz.questions) {
      if (!q.kind || q.kind === "mcq") out.push(q as MCQQuestion);
    }
    if (out.length >= 5) break;
  }
  return out.slice(0, 5);
})();

describe("buildQuestions", () => {
  it("returns up to N MCQs from the section's concept quizzes", () => {
    const out = buildQuestions(SECTION, 10, seededRng());
    expect(out.length).toBeLessThanOrEqual(10);
    expect(out.length).toBeGreaterThan(0);
    for (const q of out) {
      expect(!q.kind || q.kind === "mcq").toBe(true);
    }
  });

  it("is deterministic when given a seeded rng", () => {
    const a = buildQuestions(SECTION, 8, seededRng());
    const b = buildQuestions(SECTION, 8, seededRng());
    expect(a.map((q) => q.n)).toEqual(b.map((q) => q.n));
  });

  it("excludes true-false / fill-in questions", () => {
    // Synthesize a section with mixed question kinds.
    const synthetic: Section = {
      id: "synth",
      n: 99,
      title: "Synth",
      blurb: "",
      concepts: [
        {
          id: "c1",
          code: "S1.1",
          title: "concept",
          lesson: null,
          quiz: {
            questions: [
              {
                n: 1,
                question: "mcq?",
                options: { A: "a", B: "b", C: "c", D: "d" },
                correct: "A",
              },
              {
                n: 2,
                kind: "true-false",
                question: "tf?",
                correct: true,
              },
              {
                n: 3,
                kind: "fill-in",
                question: "fill?",
                acceptedAnswers: ["yes"],
              },
            ],
          },
        },
      ],
      sectionTest: null,
    };
    const out = buildQuestions(synthetic, 10, seededRng());
    expect(out).toHaveLength(1);
    expect(out[0].n).toBe(1);
  });
});

describe("speedBonusFor", () => {
  it("is 0 when no time remains", () => {
    expect(speedBonusFor(0, DEFAULT_TRIVIA_CONFIG)).toBe(0);
    expect(speedBonusFor(-200, DEFAULT_TRIVIA_CONFIG)).toBe(0);
  });

  it("caps at speedBonusFullPoints when msLeft >= threshold", () => {
    expect(
      speedBonusFor(
        DEFAULT_TRIVIA_CONFIG.speedBonusFullThresholdMs,
        DEFAULT_TRIVIA_CONFIG
      )
    ).toBe(DEFAULT_TRIVIA_CONFIG.speedBonusFullPoints);
    expect(
      speedBonusFor(99_999, DEFAULT_TRIVIA_CONFIG)
    ).toBe(DEFAULT_TRIVIA_CONFIG.speedBonusFullPoints);
  });

  it("scales linearly between 0 and the full threshold", () => {
    const half = DEFAULT_TRIVIA_CONFIG.speedBonusFullThresholdMs / 2;
    expect(speedBonusFor(half, DEFAULT_TRIVIA_CONFIG)).toBe(
      Math.round(DEFAULT_TRIVIA_CONFIG.speedBonusFullPoints / 2)
    );
  });
});

describe("maxPossibleScore", () => {
  it("matches the expected formula for the default config", () => {
    // 10 Qs * (100 base + 50 speed) + floor(10/3) * 50 = 1500 + 150 = 1650
    expect(maxPossibleScore(DEFAULT_TRIVIA_CONFIG)).toBe(1650);
  });
});

describe("reduce — state machine", () => {
  function bootedState() {
    return reduce(
      newTriviaState(SAMPLE_MCQS, DEFAULT_TRIVIA_CONFIG),
      { type: "start" }
    );
  }

  it("idle -> playing on start", () => {
    const s = bootedState();
    expect(s.phase).toBe("playing");
    expect(s.msLeft).toBe(DEFAULT_TRIVIA_CONFIG.perQuestionMs);
  });

  it("tick reduces msLeft and accumulates durationMs", () => {
    const s = reduce(bootedState(), { type: "tick", deltaMs: 1500 });
    expect(s.phase).toBe("playing");
    expect(s.msLeft).toBe(DEFAULT_TRIVIA_CONFIG.perQuestionMs - 1500);
    expect(s.durationMs).toBe(1500);
  });

  it("clock-out auto-finalizes the current question", () => {
    const s = reduce(bootedState(), {
      type: "tick",
      deltaMs: DEFAULT_TRIVIA_CONFIG.perQuestionMs,
    });
    expect(s.phase).toBe("revealing");
    expect(s.outcomes).toHaveLength(1);
    expect(s.outcomes[0].selected).toBeNull();
    expect(s.outcomes[0].correct).toBe(false);
    expect(s.score).toBe(0);
  });

  it("a correct answer earns base + speed bonus + streak bonus", () => {
    const fast = reduce(bootedState(), { type: "tick", deltaMs: 1000 });
    const correct = SAMPLE_MCQS[0].correct;
    const s = reduce(fast, { type: "select", option: correct });
    expect(s.phase).toBe("revealing");
    expect(s.outcomes[0].correct).toBe(true);
    expect(s.score).toBeGreaterThan(DEFAULT_TRIVIA_CONFIG.basePerCorrect);
    expect(s.correctStreak).toBe(1);
  });

  it("a wrong answer resets the streak", () => {
    let s = bootedState();
    s = reduce(s, { type: "select", option: SAMPLE_MCQS[0].correct });
    s = reduce(s, { type: "next" });
    s = reduce(s, { type: "select", option: SAMPLE_MCQS[1].correct });
    s = reduce(s, { type: "next" });
    expect(s.correctStreak).toBe(2);
    // Wrong answer next.
    const wrong: "A" | "B" | "C" | "D" =
      SAMPLE_MCQS[2].correct === "A" ? "B" : "A";
    s = reduce(s, { type: "select", option: wrong });
    expect(s.correctStreak).toBe(0);
    expect(s.outcomes[2].correct).toBe(false);
  });

  it("transitions to done after the last question's reveal", () => {
    const small = newTriviaState(SAMPLE_MCQS.slice(0, 2), {
      ...DEFAULT_TRIVIA_CONFIG,
      questionCount: 2,
    });
    let s = reduce(small, { type: "start" });
    s = reduce(s, { type: "select", option: SAMPLE_MCQS[0].correct });
    s = reduce(s, { type: "next" });
    s = reduce(s, { type: "select", option: SAMPLE_MCQS[1].correct });
    s = reduce(s, { type: "next" });
    expect(s.phase).toBe("done");
  });

  it("ignores events outside the matching phase", () => {
    const fresh = newTriviaState(SAMPLE_MCQS, DEFAULT_TRIVIA_CONFIG);
    expect(reduce(fresh, { type: "select", option: "A" })).toBe(fresh);
    expect(reduce(fresh, { type: "next" })).toBe(fresh);
    expect(reduce(fresh, { type: "tick", deltaMs: 100 })).toBe(fresh);
  });
});
