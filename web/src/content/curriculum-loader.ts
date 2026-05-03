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

export function getMockExam(id: string): MockExam | null {
  return getMockExams().find((m) => m.id === id) ?? null;
}

export function masteryLabel(m: number): string {
  return (
    ["Not started", "Lesson read", "Below 60%", "Passing", "Strong"][m] ??
    "Not started"
  );
}
