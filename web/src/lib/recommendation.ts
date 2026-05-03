/* ------------------------------------------------------------------
   Adaptive recommendation — picks the highest-priority next action.

   Priority order:
     1. Drill: any unlocked-section concept currently at a level
        flagged `isUnderwhelm` (e.g. "Below 60%" by default).
     2. Section-test: an unlocked section where every authored concept
        is at a level flagged `countsAsMastered` AND a section-test
        exists AND it hasn't been passed yet.
     3. Continue: earliest unlocked-incomplete section's first authored,
        not-yet-mastered concept (lesson-read -> quiz, else read lesson).
     4. Done: every authored section is complete.

   Two entry points:
     - `recommendForPack(p, pack, copy, packId)` — pack-aware, returns
        URL hrefs prefixed with /<packId>/. Used by the picker-era
        client components.
     - `recommend(p)` — back-compat wrapper that uses the env-var
        default pack + module-level singletons.
------------------------------------------------------------------ */

import { CURRICULUM } from "@/content/curriculum";
import type { Section } from "@/content/curriculum-types";
import { copy as defaultCopy } from "@/lib/site-config";
import {
  countsAsMastered,
  ensureConcept,
  ensureSection,
  isSectionPassed,
  isUnderwhelm,
} from "./progress";
import type { Progress } from "./progress-types";
import type { ContentPack, PackCopy } from "@/content/pack-types";

export type Recommendation =
  | { kind: "drill"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "section-test"; section: Section; href: string; why: string }
  | { kind: "lesson"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "quiz"; section: Section; conceptId: string; href: string; why: string }
  | { kind: "done"; why: string };

export function recommendForPack(
  p: Progress,
  pack: ContentPack,
  copy: Required<PackCopy>,
  packId: string
): Recommendation {
  // 1. Drill — any unlocked concept landed on an "underwhelm" level.
  for (const section of pack.curriculum.sections) {
    if (!ensureSection(p, section.id).unlocked) continue;
    for (const c of section.concepts) {
      if (!c.lesson || !c.quiz) continue;
      const cp = ensureConcept(p, c.id);
      if (isUnderwhelm(cp.mastery)) {
        return {
          kind: "drill",
          section,
          conceptId: c.id,
          href: `/${packId}/concept/${section.id}/${c.id}`,
          why: `${c.code} ${c.title} is ${copy.belowPassGateLabel}. Re-read the lesson and re-take.`,
        };
      }
    }
  }

  // 2. Section-test ready — every authored concept counts as mastered.
  for (const section of pack.curriculum.sections) {
    const sp = ensureSection(p, section.id);
    if (!sp.unlocked || !section.sectionTest) continue;
    const authored = section.concepts.filter((c) => c.lesson && c.quiz);
    if (authored.length === 0) continue;
    const allMastered = authored.every((c) =>
      countsAsMastered(ensureConcept(p, c.id).mastery)
    );
    if (allMastered && !isSectionPassed(p, section.id)) {
      return {
        kind: "section-test",
        section,
        href: `/${packId}/section/${section.id}/test`,
        why: `Every authored concept in section ${section.n} is at a mastered level. Take the ${copy.sectionTestSingular.toLowerCase()} to lock it in.`,
      };
    }
  }

  // 3. Continue — earliest unlocked-incomplete section's first
  // not-yet-mastered authored concept.
  for (const section of pack.curriculum.sections) {
    const sp = ensureSection(p, section.id);
    if (!sp.unlocked || sp.complete) continue;
    for (const c of section.concepts) {
      if (!c.lesson || !c.quiz) continue;
      const cp = ensureConcept(p, c.id);
      if (countsAsMastered(cp.mastery)) continue;
      if (!cp.lessonRead) {
        return {
          kind: "lesson",
          section,
          conceptId: c.id,
          href: `/${packId}/concept/${section.id}/${c.id}`,
          why: `Read the next concept lesson: ${c.code} ${c.title}.`,
        };
      }
      return {
        kind: "quiz",
        section,
        conceptId: c.id,
        href: `/${packId}/concept/${section.id}/${c.id}/quiz`,
        why: `You've read ${c.code}. Take the quiz to lock it in.`,
      };
    }
  }

  return {
    kind: "done",
    why: copy.recoDoneMessage,
  };
}

/** Back-compat: env-var-default-pack scoped recommend(). */
export function recommend(p: Progress): Recommendation {
  // Lazily reconstruct a pack-shaped object from the env-var default
  // CURRICULUM. This wrapper exists so legacy single-pack callers and
  // tests don't break.
  const fakePack: ContentPack = {
    curriculum: CURRICULUM,
    // The recommend logic only uses pack.curriculum and packId for
    // hrefs; supply a minimal config to satisfy the type.
    config: { id: "" } as ContentPack["config"],
  };
  return recommendForPack(p, fakePack, defaultCopy, "");
}
