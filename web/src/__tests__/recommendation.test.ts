import { describe, expect, it } from "vitest";
import { recommend } from "@/lib/recommendation";
import { ensureConcept, ensureSection, newProgress } from "@/lib/progress";
import { CURRICULUM } from "@/content/curriculum";

const firstAuthored = (() => {
  for (const s of CURRICULUM.sections) {
    const c = s.concepts.find((x) => x.lesson && x.quiz);
    if (c) return { section: s, concept: c };
  }
  return null;
})();

describe("recommend()", () => {
  it("on a fresh progress, returns lesson or done", () => {
    const p = newProgress();
    const r = recommend(p);
    if (firstAuthored) {
      expect(["lesson", "quiz"]).toContain(r.kind);
    } else {
      expect(r.kind).toBe("done");
    }
  });

  it("prioritizes drill (mastery=2) over continue", () => {
    if (!firstAuthored) return;
    const p = newProgress();
    ensureSection(p, firstAuthored.section.id).unlocked = true;
    const cp = ensureConcept(p, firstAuthored.concept.id);
    cp.lessonRead = true;
    cp.mastery = 2;
    const r = recommend(p);
    expect(r.kind).toBe("drill");
  });

  it("offers section-test when every authored concept passes", () => {
    const sec = CURRICULUM.sections.find(
      (s) => s.sectionTest && s.concepts.some((c) => c.lesson && c.quiz)
    );
    if (!sec) return;
    const p = newProgress();
    ensureSection(p, sec.id).unlocked = true;
    for (const c of sec.concepts) {
      if (!c.lesson || !c.quiz) continue;
      const cp = ensureConcept(p, c.id);
      cp.lessonRead = true;
      cp.mastery = 3;
    }
    const r = recommend(p);
    expect(r.kind).toBe("section-test");
  });

  it("returns done when every authored concept passes everywhere and section-tests pass", () => {
    const p = newProgress();
    for (const s of CURRICULUM.sections) {
      ensureSection(p, s.id).unlocked = true;
      for (const c of s.concepts) {
        if (!c.lesson || !c.quiz) continue;
        const cp = ensureConcept(p, c.id);
        cp.lessonRead = true;
        cp.mastery = 4;
      }
      // simulate section-test passed by recording an attempt that meets gate
      if (s.sectionTest) {
        const total = s.sectionTest.questions.length;
        const pass = Math.ceil((s.sectionTest.passPct ?? 0.7) * total);
        ensureSection(p, s.id).testAttempts.push({
          startedAt: 0,
          completedAt: 0,
          total,
          score: pass,
          answers: {},
        });
        ensureSection(p, s.id).complete = true;
      }
    }
    const r = recommend(p);
    expect(r.kind).toBe("done");
  });
});
