/* ------------------------------------------------------------------
   Audience filter contract.

   Packs declare an `audience` ("consumer" | "b2b"). The consumer
   picker at `/` reads CONSUMER_PACKS; the Adept demo workspace at
   `/adept` reads B2B_PACKS. The two arrays must:

     - partition ALL_PACKS (no overlap, no missing pack)
     - default to "consumer" when audience is omitted
     - have at least one entry each (so neither picker renders empty)
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import {
  ALL_PACKS,
  B2B_PACKS,
  CONSUMER_PACKS,
} from "@/content/pack-registry";

describe("audience filter", () => {
  it("CONSUMER_PACKS + B2B_PACKS partition ALL_PACKS", () => {
    const consumerIds = CONSUMER_PACKS.map((p) => p.config.id).sort();
    const b2bIds = B2B_PACKS.map((p) => p.config.id).sort();
    const unionIds = [...consumerIds, ...b2bIds].sort();
    expect(unionIds).toEqual(ALL_PACKS.map((p) => p.config.id).sort());
    // No overlap.
    for (const id of consumerIds) {
      expect(b2bIds).not.toContain(id);
    }
  });

  it("every consumer pack has audience consumer or omitted", () => {
    for (const pack of CONSUMER_PACKS) {
      const a = pack.config.audience;
      expect(
        a === undefined || a === "consumer",
        `pack ${pack.config.id} is in CONSUMER_PACKS but audience = ${a}`
      ).toBe(true);
    }
  });

  it("every b2b pack has audience b2b explicitly", () => {
    for (const pack of B2B_PACKS) {
      expect(pack.config.audience).toBe("b2b");
    }
  });

  it("acme-onboarding is the canonical B2B demo pack", () => {
    expect(B2B_PACKS.some((p) => p.config.id === "acme-onboarding")).toBe(
      true
    );
    expect(
      CONSUMER_PACKS.some((p) => p.config.id === "acme-onboarding")
    ).toBe(false);
  });

  it("CONSUMER_PACKS + B2B_PACKS are both non-empty", () => {
    expect(CONSUMER_PACKS.length).toBeGreaterThan(0);
    expect(B2B_PACKS.length).toBeGreaterThan(0);
  });
});
