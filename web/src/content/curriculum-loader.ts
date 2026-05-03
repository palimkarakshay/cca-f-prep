import { CURRICULUM } from "./curriculum";
import type { Concept, MockExam, Section } from "./curriculum-types";

export function getSections(): Section[] {
  return CURRICULUM.sections;
}

export function getMockExams(): MockExam[] {
  return CURRICULUM.mockExams ?? [];
}

export function getSection(id: string): Section | null {
  return CURRICULUM.sections.find((s) => s.id === id) ?? null;
}

export function getConcept(
  sectionId: string,
  conceptId: string
): { section: Section; concept: Concept } | null {
  const section = getSection(sectionId);
  if (!section) return null;
  const concept = section.concepts.find((c) => c.id === conceptId);
  if (!concept) return null;
  return { section, concept };
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
  const sections = CURRICULUM.sections;
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

export function getAdjacentSections(sectionId: string): {
  prev: Section | null;
  next: Section | null;
} {
  const sections = CURRICULUM.sections;
  const idx = sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? sections[idx - 1] : null,
    next: idx < sections.length - 1 ? sections[idx + 1] : null,
  };
}

export function getMockExam(id: string): MockExam | null {
  return getMockExams().find((m) => m.id === id) ?? null;
}

export function masteryLabel(m: number): string {
  return (
    ["Not started", "Lesson read", "Below 60%", "Passing", "Strong"][m] ??
    "Not started"
  );
}
