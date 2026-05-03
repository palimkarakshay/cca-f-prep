import { CURRICULUM } from "./curriculum";
import { masteryLevels } from "@/lib/site-config";
import { masteryLevelsFor } from "@/lib/pack-helpers";
import { DOMAINS } from "./domains";
import { DOMAIN_MAP } from "./domain-map";
import { SECTION_META } from "./section-meta";
import { deriveFlashcards } from "@/lib/flashcard-derive";
import type {
  CCAFDomain,
  CCAFDomainInfo,
  Concept,
  Curriculum,
  Flashcard,
  MockExam,
  Section,
  SectionMeta,
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

/* ------------------------------------------------------------------
   LMS extensions — section meta, per-concept domain, flashcards.
   These read from sibling lookup tables (section-meta.ts,
   domain-map.ts) so curriculum.ts stays focused on lessons + quizzes.

   Lookup helpers use Object.hasOwn so inherited keys like "toString"
   or "__proto__" can never satisfy a missing-id query — the contract
   is `null` for unknown ids.
------------------------------------------------------------------ */

export function getSectionMeta(sectionId: string): SectionMeta | null {
  return Object.hasOwn(SECTION_META, sectionId)
    ? SECTION_META[sectionId]
    : null;
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
  if (!Object.hasOwn(DOMAIN_MAP, conceptId)) return null;
  const id = DOMAIN_MAP[conceptId];
  return DOMAINS[id] ?? null;
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
