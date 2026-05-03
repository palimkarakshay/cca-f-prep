import { describe, expect, it } from "vitest";
import {
  countsAsMastered,
  ensureConcept,
  ensureSection,
  isSectionPassed,
  isUnderwhelm,
  masteryFromScore,
  newProgress,
  unlockNextSection,
} from "@/lib/progress";
import { CURRICULUM } from "@/content/curriculum";
import { masteryLevels } from "@/lib/site-config";
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

describe("masteryFromScore (pack-agnostic, against active masteryLevels)", () => {
  it("returns 0 when total is 0", () => {
    expect(masteryFromScore(0, 0)).toBe(0);
  });

  it("walks the ladder: 0% lands at the first score-driven level (the underwhelm rung)", () => {
    const idx = masteryFromScore(0, 10);
    expect(idx).toBeGreaterThanOrEqual(2);
    expect(masteryLevels[idx]).toBeDefined();
  });

  it("a perfect score lands at the highest score-driven level", () => {
    const idx = masteryFromScore(10, 10);
    expect(idx).toBe(masteryLevels.length - 1);
  });

  it("monotonically increasing score → monotonically non-decreasing level", () => {
    let prev = -1;
    for (let s = 0; s <= 10; s++) {
      const idx = masteryFromScore(s, 10);
      expect(idx).toBeGreaterThanOrEqual(prev);
      prev = idx;
    }
  });

  it("score at exactly each level's minScorePct lands at that level (or higher)", () => {
    for (let i = 2; i < masteryLevels.length; i++) {
      const min = masteryLevels[i].minScorePct;
      if (min === undefined) continue;
      // Pick a total + score that produces exactly `min`
      const total = 100;
      const score = Math.ceil(min * total);
      const landed = masteryFromScore(score, total);
      expect(landed).toBeGreaterThanOrEqual(i);
    }
  });

  it("the underwhelm level (if any) is reachable at score 0", () => {
    const underwhelmIdx = masteryLevels.findIndex((lvl) => lvl.isUnderwhelm);
    if (underwhelmIdx === -1) return; // pack has no underwhelm
    const landed = masteryFromScore(0, 10);
    expect(isUnderwhelm(landed) || landed > underwhelmIdx).toBe(true);
  });

  it("the highest mastered level (if any) is reachable at score 100%", () => {
    const lastMasteredIdx = [...masteryLevels]
      .map((lvl, i) => ({ lvl, i }))
      .filter(({ lvl }) => lvl.countsAsMastered)
      .pop()?.i;
    if (lastMasteredIdx === undefined) return;
    const landed = masteryFromScore(10, 10);
    expect(countsAsMastered(landed)).toBe(true);
    expect(landed).toBeGreaterThanOrEqual(lastMasteredIdx);
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
