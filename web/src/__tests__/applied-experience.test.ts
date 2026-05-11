/* ------------------------------------------------------------------
   Applied-experience helper contract.

   `getAppliedExperiences(section)` must:
     - return the author-supplied list when section.appliedExperience
       is set + non-empty,
     - otherwise generate a deterministic spine (same input → same
       output) so the page renders the same prompts across reloads,
     - never return an empty list (the "Apply" tab would render as
       empty otherwise),
     - emit complete records (title + prompt + doneWhen + minutes).
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import type {
  AppliedExperience,
  Concept,
  Section,
} from "@/content/curriculum-types";
import { getAppliedExperiences } from "@/lib/applied-experience";

function concept(id: string, title: string): Concept {
  return {
    id,
    code: id.toUpperCase(),
    title,
    bloom: "A",
    lesson: null,
    quiz: null,
  };
}

function section(
  overrides: Partial<Section> = {}
): Section {
  return {
    id: "s-test",
    n: 1,
    title: "Test section",
    blurb: "Test blurb",
    concepts: [
      concept("c1", "First concept"),
      concept("c2", "Second concept"),
    ],
    sectionTest: null,
    ...overrides,
  };
}

describe("getAppliedExperiences", () => {
  it("returns the author-supplied list verbatim when present", () => {
    const authored: AppliedExperience[] = [
      {
        id: "x1",
        title: "Authored task",
        prompt: "Do it",
        doneWhen: "It's done",
        minutes: 30,
      },
    ];
    expect(
      getAppliedExperiences(section({ appliedExperience: authored }))
    ).toEqual(authored);
  });

  it("falls back to a generated spine when no appliedExperience is set", () => {
    const out = getAppliedExperiences(section());
    expect(out.length).toBeGreaterThanOrEqual(3);
    for (const item of out) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.prompt.length).toBeGreaterThan(0);
      expect(item.doneWhen.length).toBeGreaterThan(0);
      expect(item.minutes).toBeGreaterThan(0);
    }
  });

  it("is deterministic — same section id yields the same prompts", () => {
    const a = getAppliedExperiences(section({ id: "stable" }));
    const b = getAppliedExperiences(section({ id: "stable" }));
    expect(a).toEqual(b);
  });

  it("uses an empty author list as 'no author content' and falls back", () => {
    const out = getAppliedExperiences(section({ appliedExperience: [] }));
    expect(out.length).toBeGreaterThanOrEqual(3);
  });

  it("does not throw on a section with zero concepts", () => {
    const out = getAppliedExperiences(section({ concepts: [] }));
    expect(out.length).toBeGreaterThanOrEqual(3);
  });

  it("ties the recall + transfer prompts to the first / last concept ids when present", () => {
    const out = getAppliedExperiences(
      section({
        concepts: [
          concept("first", "First"),
          concept("middle", "Middle"),
          concept("last", "Last"),
        ],
      })
    );
    const recall = out.find((x) => x.id.endsWith("-applied-recall"));
    const transfer = out.find((x) => x.id.endsWith("-applied-transfer"));
    expect(recall?.conceptId).toBe("first");
    expect(transfer?.conceptId).toBe("last");
  });
});
