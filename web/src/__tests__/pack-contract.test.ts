/* ------------------------------------------------------------------
   Pack-contract smoke test.

   Validates EVERY content pack in `web/content-packs/` against the
   shape and invariants the shell relies on. Catches authoring bugs
   (typo in `correct: "E"`, missing iconSvg, malformed pack id,
   non-unique section/concept ids) at CI time — before swap.

   To register a new pack: add it to the PACKS list below.
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import { pack as ccaPack } from "../../content-packs/cca-f-prep";
import { pack as samplePack } from "../../content-packs/sample-pack";
import { pack as sewingPack } from "../../content-packs/sewing-beginners";
import type { ContentPack } from "@/content/pack-types";

const PACKS: Array<[string, ContentPack]> = [
  ["cca-f-prep", ccaPack],
  ["sample-pack", samplePack],
  ["sewing-beginners", sewingPack],
];

describe.each(PACKS)("pack %s satisfies the contract", (id, pack) => {
  it("id matches folder convention", () => {
    expect(pack.config.id).toBe(id);
    expect(pack.config.id).toMatch(/^[a-z0-9][a-z0-9-]*$/);
  });

  it("has non-empty branding", () => {
    expect(pack.config.name).toBeTruthy();
    expect(pack.config.tagline).toBeTruthy();
    expect(pack.config.description).toBeTruthy();
    expect(pack.config.url).toMatch(/^https?:\/\//);
  });

  it("manifest has hex colors", () => {
    expect(pack.config.manifest.backgroundColor).toMatch(
      /^#[0-9a-fA-F]{3,8}$/
    );
    expect(pack.config.manifest.themeColor).toMatch(/^#[0-9a-fA-F]{3,8}$/);
  });

  it("icons are svg markup", () => {
    expect(pack.config.iconSvg.trim().startsWith("<svg")).toBe(true);
    expect(pack.config.iconMaskableSvg.trim().startsWith("<svg")).toBe(true);
  });

  it("askAI fallback URL is well-formed", () => {
    expect(pack.config.askAI.fallbackUrl).toMatch(/^https?:\/\//);
    if (pack.config.askAI.projectUrl) {
      expect(pack.config.askAI.projectUrl).toMatch(/^https?:\/\//);
    }
  });

  it("nav has at least one item with a home anchor", () => {
    expect(pack.config.nav.length).toBeGreaterThan(0);
    expect(pack.config.nav.some((n) => n.href === "/")).toBe(true);
  });

  it("curriculum has at least one section", () => {
    expect(pack.curriculum.sections.length).toBeGreaterThan(0);
  });

  it("section ids are unique", () => {
    const ids = pack.curriculum.sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("concept ids are unique pack-wide", () => {
    const ids = pack.curriculum.sections.flatMap((s) =>
      s.concepts.map((c) => c.id)
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every authored question is well-formed for its kind", () => {
    const allQs = pack.curriculum.sections.flatMap((s) =>
      s.concepts.flatMap((c) => c.quiz?.questions ?? [])
    );
    for (const q of allQs) {
      const kind = (q as { kind?: string }).kind ?? "mcq";
      if (kind === "mcq") {
        const mcq = q as { options: Record<string, string>; correct: string };
        expect(Object.keys(mcq.options).sort()).toEqual(["A", "B", "C", "D"]);
        expect(["A", "B", "C", "D"]).toContain(mcq.correct);
      } else if (kind === "true-false") {
        const tf = q as { correct: boolean };
        expect(typeof tf.correct).toBe("boolean");
      } else if (kind === "fill-in") {
        const fi = q as { acceptedAnswers: string[] };
        expect(Array.isArray(fi.acceptedAnswers)).toBe(true);
        expect(fi.acceptedAnswers.length).toBeGreaterThan(0);
        expect(fi.acceptedAnswers.every((a) => a.length > 0)).toBe(true);
      } else {
        throw new Error(`Unknown question kind: ${kind}`);
      }
    }
  });

  it("every section test (if present) has questions and a sane passPct", () => {
    for (const s of pack.curriculum.sections) {
      if (!s.sectionTest) continue;
      expect(s.sectionTest.questions.length).toBeGreaterThan(0);
      const pp = s.sectionTest.passPct;
      if (pp !== undefined) {
        expect(pp).toBeGreaterThan(0);
        expect(pp).toBeLessThanOrEqual(1);
      }
    }
  });

  it("every mock exam (if present) has questions, timeMinutes, and passPct", () => {
    for (const m of pack.curriculum.mockExams ?? []) {
      expect(m.questions.length).toBeGreaterThan(0);
      expect(m.timeMinutes).toBeGreaterThan(0);
      expect(m.passPct).toBeGreaterThan(0);
      expect(m.passPct).toBeLessThanOrEqual(1);
    }
  });

  it("first section has at least one authored concept (recommendation engine)", () => {
    const first = pack.curriculum.sections[0];
    expect(first.concepts.some((c) => c.lesson && c.quiz)).toBe(true);
  });

  it("MCQ correct-letter distribution is not silently skewed", () => {
    // Smoke check rather than strict — flags packs where >85% of
    // correct MCQ answers are a single letter (likely an authoring
    // bias). Non-MCQ questions are excluded from the count.
    const correct = pack.curriculum.sections
      .flatMap((s) => s.concepts.flatMap((c) => c.quiz?.questions ?? []))
      .filter((q) => ((q as { kind?: string }).kind ?? "mcq") === "mcq")
      .map((q) => (q as { correct: string }).correct);
    if (correct.length < 10) return;
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    for (const c of correct) counts[c]++;
    const max = Math.max(...Object.values(counts));
    expect(
      max / correct.length,
      `MCQ correct-letter distribution: ${JSON.stringify(counts)}`
    ).toBeLessThan(0.85);
  });
});
