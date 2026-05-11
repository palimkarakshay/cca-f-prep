/* ------------------------------------------------------------------
   Brand + role classifier contract.

   The classifier maps a pathname to a brand (curio | adept) and a
   role (learner | expert). The chrome reads these to drive the
   `html[data-brand]` / `html[data-role]` token overrides — getting
   the routing wrong here means the wrong accent on the wrong
   surface, so the table is locked down with a test.
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import {
  B2B_PACK_IDS,
  brandForPath,
  roleForPath,
} from "@/lib/brand-route";

describe("brand-route classifier", () => {
  describe("brandForPath", () => {
    it("defaults to curio for unknown / empty paths", () => {
      expect(brandForPath("/")).toBe("curio");
      expect(brandForPath("")).toBe("curio");
      expect(brandForPath(null)).toBe("curio");
      expect(brandForPath(undefined)).toBe("curio");
    });

    it("returns adept for /adept and nested /adept/*", () => {
      expect(brandForPath("/adept")).toBe("adept");
      expect(brandForPath("/adept/sme/acme-onboarding")).toBe("adept");
      expect(brandForPath("/adept/onboarding")).toBe("adept");
    });

    it("returns adept for /for-teams and nested /for-teams/*", () => {
      expect(brandForPath("/for-teams")).toBe("adept");
      expect(brandForPath("/for-teams/pricing")).toBe("adept");
    });

    it("returns adept for any registered B2B pack URL", () => {
      for (const id of B2B_PACK_IDS) {
        expect(brandForPath(`/${id}`)).toBe("adept");
        expect(brandForPath(`/${id}/section/1`)).toBe("adept");
      }
    });

    it("returns curio for consumer pack URLs (e.g. /cca-f-prep, /learn-french)", () => {
      expect(brandForPath("/cca-f-prep")).toBe("curio");
      expect(brandForPath("/learn-french/section/1")).toBe("curio");
    });

    it("does not treat /adeptish or /for-teams-thing as adept (prefix discipline)", () => {
      // /adept2 should not be matched as adept — the route classifier
      // only recognises exact `/adept` and `/adept/` prefixes.
      expect(brandForPath("/adept2")).toBe("curio");
      expect(brandForPath("/adeptest")).toBe("curio");
      expect(brandForPath("/for-teams-thing")).toBe("curio");
    });
  });

  describe("roleForPath", () => {
    it("defaults to learner for /, picker, and consumer packs", () => {
      expect(roleForPath("/")).toBe("learner");
      expect(roleForPath("/cca-f-prep")).toBe("learner");
      expect(roleForPath("/learn-french/section/1")).toBe("learner");
    });

    it("returns expert on Adept marketing + workbench pages", () => {
      expect(roleForPath("/adept")).toBe("expert");
      expect(roleForPath("/adept/sme/acme-onboarding")).toBe("expert");
      expect(roleForPath("/adept/onboarding")).toBe("expert");
      expect(roleForPath("/for-teams")).toBe("expert");
    });

    it("returns learner when an SME previews a B2B pack as a learner", () => {
      // /<b2b-pack-id> is the learner view; SMEs jump in via the
      // workbench at /adept/sme/<id>. The role classifier mirrors
      // that split so the workbench gets the expert tint and the
      // preview-as-learner does not.
      expect(roleForPath("/acme-onboarding")).toBe("learner");
      expect(roleForPath("/acme-onboarding/section/1")).toBe("learner");
    });
  });
});
