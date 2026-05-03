import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { DOMAINS, DOMAIN_LIST } from "@/content/domains";
import { DOMAIN_MAP } from "@/content/domain-map";
import { SECTION_META } from "@/content/section-meta";
import {
  getConceptDomain,
  getFlashcards,
  getSectionFlashcards,
  getSectionMeta,
  groupConceptsByDomain,
} from "@/content/curriculum-loader";

describe("LMS extension data", () => {
  it("has metadata for every section", () => {
    for (const section of CURRICULUM.sections) {
      const meta = getSectionMeta(section.id);
      expect(meta, `missing SECTION_META for ${section.id}`).not.toBeNull();
      if (!meta) continue;
      expect(meta.academyUrl).toMatch(/^https:\/\//);
      expect(meta.timeMinutes).toBeGreaterThan(0);
      expect(meta.learningObjectives.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has a domain mapping for every concept", () => {
    const unmapped: string[] = [];
    for (const section of CURRICULUM.sections) {
      for (const concept of section.concepts) {
        if (!(concept.id in DOMAIN_MAP)) unmapped.push(concept.id);
      }
    }
    expect(unmapped, `unmapped concepts: ${unmapped.join(", ")}`).toEqual([]);
  });

  it("DOMAIN_MAP only references valid CCAFDomain ids", () => {
    const valid = Object.keys(DOMAINS);
    for (const [conceptId, domainId] of Object.entries(DOMAIN_MAP)) {
      expect(
        valid,
        `concept ${conceptId} → unknown domain ${domainId}`
      ).toContain(domainId);
    }
  });

  it("getConceptDomain returns the same info object for matching ids", () => {
    const sample = CURRICULUM.sections[0]?.concepts[0];
    if (!sample) return;
    const info = getConceptDomain(sample.id);
    expect(info).not.toBeNull();
    if (!info) return;
    expect(info.id).toBe(DOMAIN_MAP[sample.id]);
    expect(info.title).toMatch(/^[1-5]\. /);
  });

  it("DOMAIN_LIST has all 5 domains in 1..5 order with weights summing to 1.0", () => {
    expect(DOMAIN_LIST.length).toBe(5);
    expect(DOMAIN_LIST.map((d) => d.n)).toEqual([1, 2, 3, 4, 5]);
    const total = DOMAIN_LIST.reduce((acc, d) => acc + d.weight, 0);
    expect(total).toBeCloseTo(1.0, 5);
  });

  it("derives at least one flashcard for every concept that has a lesson", () => {
    const empty: string[] = [];
    for (const section of CURRICULUM.sections) {
      for (const concept of section.concepts) {
        if (!concept.lesson) continue;
        const cards = getFlashcards(concept);
        if (cards.length === 0) empty.push(concept.id);
      }
    }
    expect(
      empty,
      `concepts without derivable flashcards: ${empty.join(", ")}`
    ).toEqual([]);
  });

  it("flashcard deck size never exceeds 6 per concept", () => {
    for (const section of CURRICULUM.sections) {
      for (const concept of section.concepts) {
        const cards = getFlashcards(concept);
        expect(
          cards.length,
          `${concept.id} produced ${cards.length} flashcards`
        ).toBeLessThanOrEqual(6);
      }
    }
  });

  it("flashcard ids are stable + unique within a section", () => {
    for (const section of CURRICULUM.sections) {
      const cards = getSectionFlashcards(section);
      const ids = new Set(cards.map((c) => c.id));
      expect(ids.size, `${section.id} has duplicate card ids`).toBe(
        cards.length
      );
    }
  });

  it("all five domains are populated by at least one concept", () => {
    const grouped = groupConceptsByDomain();
    for (const domain of Object.keys(grouped) as Array<
      keyof typeof grouped
    >) {
      expect(
        grouped[domain].length,
        `domain ${domain} has no concepts`
      ).toBeGreaterThan(0);
    }
  });

  it("every section has a SECTION_META entry that matches the section id", () => {
    const sectionIds = new Set(CURRICULUM.sections.map((s) => s.id));
    const metaIds = new Set(Object.keys(SECTION_META));
    for (const id of sectionIds) {
      expect(metaIds.has(id), `missing SECTION_META[${id}]`).toBe(true);
    }
    for (const id of metaIds) {
      expect(sectionIds.has(id), `stale SECTION_META[${id}]`).toBe(true);
    }
  });

  it("getSectionMeta + getConceptDomain reject inherited prototype keys", () => {
    // A user-controlled section/concept id from a route param could be the
    // string "toString" or "__proto__"; the lookup must return null, not
    // the inherited Object.prototype value.
    for (const proto of ["toString", "hasOwnProperty", "__proto__", "constructor"]) {
      expect(
        getSectionMeta(proto),
        `getSectionMeta("${proto}") should be null`
      ).toBeNull();
      expect(
        getConceptDomain(proto),
        `getConceptDomain("${proto}") should be null`
      ).toBeNull();
    }
  });
});
