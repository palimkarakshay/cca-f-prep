/* ------------------------------------------------------------------
   Adaptive recommendation — picks the highest-priority next action.

   Mirrors the priority order from docs/app.js:
     1. Drill: any unlocked-section concept currently at mastery 2.
     2. Section-test: an unlocked section where every authored concept
        passes AND a section-test exists AND it hasn't been passed yet.
     3. Continue: earliest unlocked-incomplete section's first authored,
        not-yet-passed concept (lesson-read -> quiz, else read lesson).
     4. Done: every authored section is complete.
------------------------------------------------------------------ */

import { CURRICULUM } from "@/content/curriculum";
import type { Section } from "@/content/curriculum-types";
import { ensureConcept, ensureSection, isSectionPassed } from "./progress";
import type { Progress } from "./progress-types";

export type Recommendation =
  | { kind: "drill"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "section-test"; section: Section; href: string; why: string }
  | { kind: "lesson"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "quiz"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "done"; why: string };

export function recommend(p: Progress): Recommendation {
  // 1. Drill
  for (const section of CURRICULUM.sections) {
    if (!ensureSection(p, section.id).unlocked) continue;
    for (const c of section.concepts) {
      if (!c.lesson || !c.quiz) continue;
      const cp = ensureConcept(p, c.id);
      if (cp.mastery === 2) {
        return {
          kind: "drill",
          section,
          conceptId: c.id,
          href: `/concept/${section.id}/${c.id}`,
          why: `${c.code} ${c.title} is below the pass-gate. Re-read the lesson and re-take.`,
        };
      }
    }
  }

  // 2. Section-test ready
  for (const section of CURRICULUM.sections) {
    const sp = ensureSection(p, section.id);
    if (!sp.unlocked || !section.sectionTest) continue;
    const authored = section.concepts.filter((c) => c.lesson && c.quiz);
    if (authored.length === 0) continue;
    const allPassing = authored.every(
      (c) => ensureConcept(p, c.id).mastery >= 3
    );
    if (allPassing && !isSectionPassed(p, section.id)) {
      return {
        kind: "section-test",
        section,
        href: `/section/${section.id}/test`,
        why: `Every authored concept in section ${section.n} is passing. Take the section test to lock it in.`,
      };
    }
  }

  // 3. Continue
  for (const section of CURRICULUM.sections) {
    const sp = ensureSection(p, section.id);
    if (!sp.unlocked || sp.complete) continue;
    for (const c of section.concepts) {
      if (!c.lesson || !c.quiz) continue;
      const cp = ensureConcept(p, c.id);
      if (cp.mastery >= 3) continue;
      if (!cp.lessonRead) {
        return {
          kind: "lesson",
          section,
          conceptId: c.id,
          href: `/concept/${section.id}/${c.id}`,
          why: `Read the next concept lesson: ${c.code} ${c.title}.`,
        };
      }
      return {
        kind: "quiz",
        section,
        conceptId: c.id,
        href: `/concept/${section.id}/${c.id}/quiz`,
        why: `You've read ${c.code}. Take the quiz to lock it in.`,
      };
    }
  }

  return {
    kind: "done",
    why: "Every authored concept is passing. New content lands as it's authored.",
  };
}
