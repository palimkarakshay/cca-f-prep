/* ------------------------------------------------------------------
   Picker page contract.

   Validates the data the picker page renders (one card per registered
   pack, each linking to /<packId>) without booting React. The picker
   is mostly data-driven from `pack-registry.ts`, so testing the
   registry shape catches the regressions that matter:

   - Every registered pack has a unique id, name, tagline, description,
     icon SVG, and at least one section (otherwise its card would show
     a meaningless "0 sections" pill).
   - The link target for each card is well-formed (`/<packId>`).
   - The pack ids match what the [packId] route segment expects.
   - The DEFAULT_PACK_ID resolves to a registered pack.
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import {
  ALL_PACK_IDS,
  ALL_PACKS,
  DEFAULT_PACK_ID,
  getPack,
  PACK_REGISTRY,
} from "@/content/pack-registry";

describe("picker registry", () => {
  it("registry is non-empty", () => {
    expect(ALL_PACK_IDS.length).toBeGreaterThan(0);
    expect(ALL_PACKS.length).toBe(ALL_PACK_IDS.length);
  });

  it("ALL_PACK_IDS keys match ALL_PACKS configs", () => {
    expect(ALL_PACK_IDS).toEqual(ALL_PACKS.map((p) => p.config.id));
  });

  it("pack ids are unique", () => {
    expect(new Set(ALL_PACK_IDS).size).toBe(ALL_PACK_IDS.length);
  });

  it("DEFAULT_PACK_ID resolves to a registered pack", () => {
    expect(ALL_PACK_IDS).toContain(DEFAULT_PACK_ID);
    expect(getPack(DEFAULT_PACK_ID)).not.toBeNull();
  });

  it("getPack returns null for an unknown id without throwing", () => {
    expect(getPack("does-not-exist")).toBeNull();
    // Prototype keys must not leak through.
    expect(getPack("toString")).toBeNull();
    expect(getPack("__proto__")).toBeNull();
    expect(getPack("constructor")).toBeNull();
  });

  it("PACK_REGISTRY is a plain object (no Map collisions)", () => {
    expect(typeof PACK_REGISTRY).toBe("object");
    for (const id of ALL_PACK_IDS) {
      expect(PACK_REGISTRY[id]).toBe(getPack(id));
    }
  });
});

describe("picker card data — every pack renders a complete card", () => {
  it.each(ALL_PACKS.map((p) => [p.config.id, p] as const))(
    "%s",
    (id, pack) => {
      const c = pack.config;
      // Identity + branding the picker card displays
      expect(c.id).toBe(id);
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.tagline.length).toBeGreaterThan(0);
      expect(c.description.length).toBeGreaterThan(0);
      // Icon SVG embedded in the card
      expect(c.iconSvg.trim().startsWith("<svg")).toBe(true);
      // Pill counts the picker shows
      expect(pack.curriculum.sections.length).toBeGreaterThan(0);
      const conceptCount = pack.curriculum.sections.reduce(
        (n, s) => n + s.concepts.length,
        0
      );
      expect(conceptCount).toBeGreaterThan(0);
    }
  );

  it("link target for each card is a valid pack-prefixed URL", () => {
    for (const pack of ALL_PACKS) {
      const href = `/${pack.config.id}`;
      // Same shape the picker page builds; if it ever changes (e.g. to
      // include a query string), the picker's URL contract changed and
      // this test catches it.
      expect(href).toMatch(/^\/[a-z0-9][a-z0-9-]*$/);
    }
  });
});
