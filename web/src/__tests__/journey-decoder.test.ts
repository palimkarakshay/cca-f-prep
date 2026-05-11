/* ------------------------------------------------------------------
   Journey-decoder contract.

   The decoder is a pure function the home page uses to turn the two
   plain-English answers ("what" + "why") into a structured brief
   that the L&D designer (and the engine) can act on. The contract
   below pins:

   - Detection: known keywords map to the right JourneyKind, unknown
     inputs fall back to "general" (never throw).
   - Decoded shape is complete for every JourneyKind (the home page
     reads every field unconditionally).
   - Empty / whitespace input still returns a valid brief — the page
     renders a "tell us more" hint, not a stack trace.
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import {
  decodeJourney,
  detectKind,
  JOURNEY_KIND_LABEL,
  type JourneyKind,
} from "@/lib/journey-decoder";

const ALL_KINDS: JourneyKind[] = [
  "certification",
  "role-onboarding",
  "compliance",
  "language",
  "coding-skill",
  "tool-adoption",
  "domain-knowledge",
  "general",
];

describe("detectKind", () => {
  it.each([
    ["I want to pass the CCA-F exam", "certification"],
    ["AWS certification prep", "certification"],
    ["GDPR compliance refresh", "compliance"],
    ["onboarding for L1 support hires", "role-onboarding"],
    ["conversational French for a Paris trip", "language"],
    ["SQL window functions for dashboards", "coding-skill"],
    ["Salesforce admin tooling", "tool-adoption"],
    ["product-management leadership skills", "domain-knowledge"],
    ["something completely vague", "general"],
  ] as Array<[string, JourneyKind]>)(
    "what=%j → %s",
    (what, expected) => {
      expect(detectKind({ what, why: "" })).toBe(expected);
    }
  );

  it("falls back to general when both inputs are empty", () => {
    expect(detectKind({ what: "", why: "" })).toBe("general");
  });

  it("recognises compliance via the why field when what is vague", () => {
    expect(
      detectKind({
        what: "policy refresh",
        why: "audit is in October",
      })
    ).toBe("compliance");
  });
});

describe("decodeJourney shape", () => {
  it.each(ALL_KINDS)("returns a complete brief for kind %s", (kind) => {
    // Seed a deterministic input that the kind detector will hit.
    const seed: Record<JourneyKind, string> = {
      certification: "AWS solutions-architect cert",
      "role-onboarding": "onboarding for new hire L1",
      compliance: "GDPR compliance",
      language: "Conversational Spanish",
      "coding-skill": "Python algorithms",
      "tool-adoption": "Salesforce config",
      "domain-knowledge": "Product management",
      general: "the meaning of life",
    };
    const out = decodeJourney({ what: seed[kind], why: "for my work" });
    expect(out.kind).toBe(kind);
    expect(out.headline.length).toBeGreaterThan(0);
    expect(out.endUse.length).toBeGreaterThan(0);
    expect(out.successSignals.length).toBeGreaterThanOrEqual(3);
    expect(out.sectionSpine.length).toBeGreaterThanOrEqual(3);
    for (const s of out.sectionSpine) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.applied.length).toBeGreaterThan(0);
    }
    expect(out.audienceCues.length).toBeGreaterThanOrEqual(2);
    expect(out.suggestedSources.length).toBeGreaterThanOrEqual(1);
    // Most kinds need at least one anchor source. Language is the
    // exception — it can run entirely from a learner-supplied
    // scenario, so all source hints stay optional there.
    if (kind !== "language") {
      expect(out.suggestedSources.some((s) => s.required)).toBe(true);
    }
    expect(out.estimatedHours.low).toBeGreaterThan(0);
    expect(out.estimatedHours.high).toBeGreaterThanOrEqual(out.estimatedHours.low);
    expect(typeof out.recommendsExpiry).toBe("boolean");
    expect(out.designerBrief.length).toBeGreaterThan(40);
  });

  it("does not throw on empty input and returns a general brief", () => {
    const out = decodeJourney({ what: "", why: "" });
    expect(out.kind).toBe("general");
    expect(out.designerBrief.toLowerCase()).toContain("journey");
  });

  it("certification + compliance default to recommending expiry", () => {
    expect(
      decodeJourney({ what: "AWS cert", why: "" }).recommendsExpiry
    ).toBe(true);
    expect(
      decodeJourney({ what: "HIPAA training", why: "" }).recommendsExpiry
    ).toBe(true);
  });

  it("language + onboarding default to no expiry", () => {
    expect(
      decodeJourney({ what: "Spanish", why: "" }).recommendsExpiry
    ).toBe(false);
    expect(
      decodeJourney({ what: "new-hire onboarding", why: "" }).recommendsExpiry
    ).toBe(false);
  });
});

describe("JOURNEY_KIND_LABEL", () => {
  it("has a label for every kind", () => {
    for (const k of ALL_KINDS) {
      expect(JOURNEY_KIND_LABEL[k].length).toBeGreaterThan(0);
    }
  });
});
