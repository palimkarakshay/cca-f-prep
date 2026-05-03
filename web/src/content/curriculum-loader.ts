import { CURRICULUM } from "./curriculum";
import { masteryLevels } from "@/lib/site-config";
import { masteryLevelsFor } from "@/lib/pack-helpers";
import type {
  Concept,
  Curriculum,
  MockExam,
  Section,
} from "./curriculum-types";
import type { ContentPack } from "./pack-types";

// ---------- Pack-aware accessors (preferred for picker / [packId] routes)

export function getSectionsFrom(curriculum: Curriculum): Section[] {
  return curriculum.sections;
}

export function getMockExamsFrom(curriculum: Curriculum): MockExam[] {
  return curriculum.mockExams ?? [];
}

export function getSectionFrom(
  curriculum: Curriculum,
  id: string
): Section | null {
  return curriculum.sections.find((s) => s.id === id) ?? null;
}

export function getConceptFrom(
  curriculum: Curriculum,
  sectionId: string,
  conceptId: string
): { section: Section; concept: Concept } | null {
  const section = getSectionFrom(curriculum, sectionId);
  if (!section) return null;
  const concept = section.concepts.find((c) => c.id === conceptId);
  if (!concept) return null;
  return { section, concept };
}

export function getMockExamFrom(
  curriculum: Curriculum,
  id: string
): MockExam | null {
  return getMockExamsFrom(curriculum).find((m) => m.id === id) ?? null;
}

export function getAdjacentConceptsFrom(
  curriculum: Curriculum,
  sectionId: string,
  conceptId: string
): {
  prev: { section: Section; concept: Concept } | null;
  next: { section: Section; concept: Concept } | null;
} {
  const sections = curriculum.sections;
  const sIdx = sections.findIndex((s) => s.id === sectionId);
  if (sIdx === -1) return { prev: null, next: null };
  const section = sections[sIdx];
  const cIdx = section.concepts.findIndex((c) => c.id === conceptId);
  if (cIdx === -1) return { prev: null, next: null };

  const prev =
    cIdx > 0
      ? { section, concept: section.concepts[cIdx - 1] }
      : sIdx > 0
        ? (() => {
            const prevSection = sections[sIdx - 1];
            const last = prevSection.concepts[prevSection.concepts.length - 1];
            return last ? { section: prevSection, concept: last } : null;
          })()
        : null;

  const next =
    cIdx < section.concepts.length - 1
      ? { section, concept: section.concepts[cIdx + 1] }
      : sIdx < sections.length - 1
        ? (() => {
            const nextSection = sections[sIdx + 1];
            const first = nextSection.concepts[0];
            return first ? { section: nextSection, concept: first } : null;
          })()
        : null;

  return { prev, next };
}

export function getAdjacentSectionsFrom(
  curriculum: Curriculum,
  sectionId: string
): { prev: Section | null; next: Section | null } {
  const sections = curriculum.sections;
  const idx = sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? sections[idx - 1] : null,
    next: idx < sections.length - 1 ? sections[idx + 1] : null,
  };
}

export function masteryLabelFor(pack: ContentPack, m: number): string {
  const levels = masteryLevelsFor(pack);
  return levels[m]?.label ?? levels[0]?.label ?? "Not started";
}

export function masteryToneFor(
  pack: ContentPack,
  m: number
): "good" | "warn" | "bad" | "neutral" {
  return masteryLevelsFor(pack)[m]?.tone ?? "neutral";
}

// ---------- Back-compat singletons (env-var-default-pack scoped)

export function getSections(): Section[] {
  return getSectionsFrom(CURRICULUM);
}

export function getMockExams(): MockExam[] {
  return getMockExamsFrom(CURRICULUM);
}

export function getSection(id: string): Section | null {
  return getSectionFrom(CURRICULUM, id);
}

export function getConcept(
  sectionId: string,
  conceptId: string
): { section: Section; concept: Concept } | null {
  return getConceptFrom(CURRICULUM, sectionId, conceptId);
}

export function findConcept(
  conceptId: string
): { section: Section; concept: Concept } | null {
  for (const section of CURRICULUM.sections) {
    const concept = section.concepts.find((c) => c.id === conceptId);
    if (concept) return { section, concept };
  }
  return null;
}

export function getAdjacentConcepts(
  sectionId: string,
  conceptId: string
): {
  prev: { section: Section; concept: Concept } | null;
  next: { section: Section; concept: Concept } | null;
} {
  return getAdjacentConceptsFrom(CURRICULUM, sectionId, conceptId);
}

export function getAdjacentSections(sectionId: string): {
  prev: Section | null;
  next: Section | null;
} {
  return getAdjacentSectionsFrom(CURRICULUM, sectionId);
}

export function getMockExam(id: string): MockExam | null {
  return getMockExamFrom(CURRICULUM, id);
}

export function masteryLabel(m: number): string {
  return masteryLevels[m]?.label ?? masteryLevels[0]?.label ?? "Not started";
}

export function masteryTone(m: number): "good" | "warn" | "bad" | "neutral" {
  return masteryLevels[m]?.tone ?? "neutral";
}
