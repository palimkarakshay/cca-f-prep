import { describe, expect, it } from "vitest";
import {
  ensureConcept,
  ensureSection,
  isSectionPassed,
  masteryFromScore,
  newProgress,
  unlockNextSection,
} from "@/lib/progress";
import { CURRICULUM } from "@/content/curriculum";
import type { QuizAttempt } from "@/lib/progress-types";

function attempt(score: number, total: number): QuizAttempt {
  return {
    startedAt: 0,
    completedAt: 0,
    total,
    score,
    answers: {},
  };
}

describe("masteryFromScore", () => {
  it("0 when total is 0", () => {
    expect(masteryFromScore(0, 0)).toBe(0);
  });
  it("2 below 60%", () => {
    expect(masteryFromScore(5, 10)).toBe(2);
    expect(masteryFromScore(0, 10)).toBe(2);
  });
  it("3 at or above 60% and below 90%", () => {
    expect(masteryFromScore(6, 10)).toBe(3);
    expect(masteryFromScore(8, 10)).toBe(3);
  });
  it("4 at or above 90%", () => {
    expect(masteryFromScore(9, 10)).toBe(4);
    expect(masteryFromScore(10, 10)).toBe(4);
  });
});

describe("newProgress", () => {
  it("seeds the first section as unlocked", () => {
    const p = newProgress();
    const first = CURRICULUM.sections[0];
    expect(p.section[first.id]?.unlocked).toBe(true);
  });

  it("starts with empty concept and mock state", () => {
    const p = newProgress();
    expect(Object.keys(p.concept).length).toBe(0);
    expect(Object.keys(p.mock).length).toBe(0);
  });
});

describe("ensure helpers are idempotent", () => {
  it("ensureSection creates once and reuses", () => {
    const p = newProgress();
    const id = "x-not-real";
    const a = ensureSection(p, id);
    const b = ensureSection(p, id);
    expect(a).toBe(b);
    expect(a.unlocked).toBe(false);
  });

  it("ensureConcept creates a fresh shape", () => {
    const p = newProgress();
    const c = ensureConcept(p, "c-x");
    expect(c).toMatchObject({ lessonRead: false, mastery: 0, currentAttempt: null });
    expect(c.quizAttempts).toEqual([]);
  });
});

describe("section pass + unlock", () => {
  it("isSectionPassed false when no attempts", () => {
    const p = newProgress();
    expect(isSectionPassed(p, CURRICULUM.sections[0].id)).toBe(false);
  });

  it("isSectionPassed honors per-section pass-pct (or default 0.7)", () => {
    const sec = CURRICULUM.sections.find((s) => s.sectionTest);
    if (!sec) return; // no section test in fixture
    const passPct = sec.sectionTest!.passPct ?? 0.7;
    const total = sec.sectionTest!.questions.length;
    const passingScore = Math.ceil(passPct * total);

    const p = newProgress();
    ensureSection(p, sec.id).testAttempts.push(attempt(passingScore, total));
    expect(isSectionPassed(p, sec.id)).toBe(true);

    const failing = newProgress();
    ensureSection(failing, sec.id).testAttempts.push(
      attempt(Math.max(0, passingScore - 1), total)
    );
    expect(isSectionPassed(failing, sec.id)).toBe(false);
  });

  it("unlockNextSection unlocks the immediately following section", () => {
    if (CURRICULUM.sections.length < 2) return;
    const first = CURRICULUM.sections[0];
    const second = CURRICULUM.sections[1];
    const p = newProgress();
    expect(p.section[second.id]?.unlocked ?? false).toBe(false);
    unlockNextSection(p, first.id);
    expect(p.section[second.id]?.unlocked).toBe(true);
  });

  it("unlockNextSection is a noop on the last section", () => {
    const last = CURRICULUM.sections[CURRICULUM.sections.length - 1];
    const p = newProgress();
    expect(() => unlockNextSection(p, last.id)).not.toThrow();
  });
});
