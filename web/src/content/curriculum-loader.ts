import { CURRICULUM } from "./curriculum";
import { DOMAINS } from "./domains";
import { DOMAIN_MAP } from "./domain-map";
import { SECTION_META } from "./section-meta";
import { deriveFlashcards } from "@/lib/flashcard-derive";
import type {
  CCAFDomain,
  CCAFDomainInfo,
  Concept,
  Flashcard,
  MockExam,
  Section,
  SectionMeta,
} from "./curriculum-types";

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

/* ------------------------------------------------------------------
   LMS extensions — section meta, per-concept domain, flashcards.
   These read from sibling lookup tables (section-meta.ts,
   domain-map.ts) so curriculum.ts stays focused on lessons + quizzes.
------------------------------------------------------------------ */

export function getSectionMeta(sectionId: string): SectionMeta | null {
  return SECTION_META[sectionId] ?? null;
}

/** Convenience for components that want the time as a formatted string. */
export function formatMinutes(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
  }
  return `${minutes} min`;
}

export function getConceptDomain(conceptId: string): CCAFDomainInfo | null {
  const id = DOMAIN_MAP[conceptId];
  return id ? DOMAINS[id] : null;
}

/**
 * Flashcards for a concept. We derive at read time so curriculum.ts
 * doesn't need to grow a parallel `flashcards: []` array for every
 * concept — keyPoints + simplified.oneLiner already encode the
 * material. When/if we hand-author flashcards in the future, add a
 * `concept.flashcards` slot and prefer it over the derivation.
 */
export function getFlashcards(concept: Concept): Flashcard[] {
  return deriveFlashcards(concept);
}

/** All flashcards across an entire section, useful for the section
 *  Flashcards tab + Flashcard Battle deck. */
export function getSectionFlashcards(section: Section): Flashcard[] {
  return section.concepts.flatMap((c) => getFlashcards(c));
}

/** Group concepts by their domain — used by Domain Rush tile counts
 *  and the dashboard StatsPanel domain breakdown. */
export function groupConceptsByDomain(): Record<CCAFDomain, Concept[]> {
  const out: Record<CCAFDomain, Concept[]> = {
    "agentic-architecture": [],
    "claude-code": [],
    "tool-design-mcp": [],
    "prompt-engineering": [],
    "context-reliability": [],
  };
  for (const section of CURRICULUM.sections) {
    for (const concept of section.concepts) {
      const id = DOMAIN_MAP[concept.id];
      if (id) out[id].push(concept);
    }
  }
  return out;
}
