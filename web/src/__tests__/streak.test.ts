import { describe, expect, it } from "vitest";
import { computeStreak } from "@/lib/streak";
import type { Progress, QuizAttempt } from "@/lib/progress-types";

function emptyProgress(): Progress {
  return {
    schemaVersion: 1,
    concept: {},
    section: {},
    mock: {},
    location: { view: "dashboard", sectionId: null, conceptId: null, mockId: null },
  };
}

function attemptAt(ts: number): QuizAttempt {
  return {
    startedAt: ts - 60_000,
    completedAt: ts,
    total: 5,
    score: 4,
    answers: {},
  };
}

function dayMs(year: number, month1: number, day: number): number {
  return new Date(year, month1 - 1, day, 12, 0, 0, 0).getTime();
}

describe("computeStreak", () => {
  it("returns 0 with no attempts", () => {
    const s = computeStreak(emptyProgress());
    expect(s.current).toBe(0);
    expect(s.studiedToday).toBe(false);
    expect(s.lastStudyDate).toBeNull();
  });

  it("counts a single attempt today as a 1-day streak", () => {
    const now = dayMs(2026, 5, 3);
    const p = emptyProgress();
    p.concept.x = {
      lessonRead: false,
      mastery: 2,
      currentAttempt: null,
      quizAttempts: [attemptAt(now)],
    };
    const s = computeStreak(p, now);
    expect(s.current).toBe(1);
    expect(s.studiedToday).toBe(true);
  });

  it("counts three consecutive days as 3", () => {
    const now = dayMs(2026, 5, 3);
    const p = emptyProgress();
    p.concept.a = {
      lessonRead: false,
      mastery: 2,
      currentAttempt: null,
      quizAttempts: [
        attemptAt(dayMs(2026, 5, 1)),
        attemptAt(dayMs(2026, 5, 2)),
        attemptAt(dayMs(2026, 5, 3)),
      ],
    };
    const s = computeStreak(p, now);
    expect(s.current).toBe(3);
  });

  it("breaks the streak on a missed day", () => {
    const now = dayMs(2026, 5, 5);
    const p = emptyProgress();
    p.concept.a = {
      lessonRead: false,
      mastery: 2,
      currentAttempt: null,
      quizAttempts: [
        attemptAt(dayMs(2026, 5, 1)),
        attemptAt(dayMs(2026, 5, 2)),
        // Missed May 3 + 4
        attemptAt(dayMs(2026, 5, 5)),
      ],
    };
    const s = computeStreak(p, now);
    expect(s.current).toBe(1);
    expect(s.studiedToday).toBe(true);
  });

  it("preserves yesterday's streak before the user studies today", () => {
    const now = dayMs(2026, 5, 3);
    const p = emptyProgress();
    p.concept.a = {
      lessonRead: false,
      mastery: 2,
      currentAttempt: null,
      quizAttempts: [
        attemptAt(dayMs(2026, 5, 1)),
        attemptAt(dayMs(2026, 5, 2)),
      ],
    };
    const s = computeStreak(p, now);
    expect(s.current).toBe(2);
    expect(s.studiedToday).toBe(false);
  });

  it("aggregates across concept, section, and mock attempts", () => {
    const now = dayMs(2026, 5, 3);
    const p = emptyProgress();
    p.concept.a = {
      lessonRead: false,
      mastery: 2,
      currentAttempt: null,
      quizAttempts: [attemptAt(dayMs(2026, 5, 1))],
    };
    p.section.s = {
      unlocked: true,
      complete: false,
      testAttempts: [attemptAt(dayMs(2026, 5, 2))],
      currentTestAttempt: null,
    };
    p.mock.m = {
      attempts: [attemptAt(dayMs(2026, 5, 3))],
      currentAttempt: null,
    };
    const s = computeStreak(p, now);
    expect(s.current).toBe(3);
  });
});
