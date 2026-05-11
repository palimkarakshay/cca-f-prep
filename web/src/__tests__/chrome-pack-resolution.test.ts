/* ------------------------------------------------------------------
   Chrome (Header + BottomNav) pack-resolution contract.

   The chrome lives in the root layout, *outside* the [packId]
   PackProvider, so calling `useSiteConfig()` from inside Header /
   BottomNav resolves to the *default* pack — which makes the chrome
   render the default pack's nav (e.g. "Mock") on every route, even
   when the route is `/acme-onboarding/...` (which has no mock
   exams). The chrome instead reads the pack from the URL via
   `getPack(packIdFromPathname(pathname))`.

   This test locks the two invariants that make that work:
     1. getPack(<registered pack id>) is non-null and exposes the
        pack's own nav (so the chrome can render *this pack's*
        items).
     2. getPack(<non-pack first segment, e.g. "for-teams">) is null
        (so the chrome falls back to picker-style — no nav, no
        Switch-topic button — instead of pretending the segment is
        a pack).
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";

// Same regex Header / BottomNav use for URL → first-segment.
function packIdFromPathname(pathname: string): string | null {
  const m = pathname.match(/^\/([^/]+)/);
  return m ? m[1] : null;
}

describe("chrome pack-resolution", () => {
  it.each(ALL_PACK_IDS)(
    "resolves /%s/... to that pack and exposes its nav",
    (id) => {
      const seg = packIdFromPathname(`/${id}`);
      expect(seg).toBe(id);
      const pack = getPack(seg!);
      expect(pack).not.toBeNull();
      expect(pack!.config.id).toBe(id);
      // Pack-level nav is the source of truth — chrome must read this,
      // not a fallback config from a different pack.
      expect(Array.isArray(pack!.config.nav)).toBe(true);
      expect(pack!.config.nav.length).toBeGreaterThan(0);
    }
  );

  it.each([
    ["/for-teams"],
    ["/foo-bar-baz"],
    ["/__proto__"],
    ["/constructor"],
  ])(
    "%s resolves to null pack (chrome falls back to picker style)",
    (pathname) => {
      const seg = packIdFromPathname(pathname);
      expect(seg).not.toBeNull();
      // The first-segment exists, but getPack returns null because
      // it isn't a registered pack — chrome treats this as "no pack
      // context" and hides nav + Switch-topic.
      expect(getPack(seg!)).toBeNull();
    }
  );

  it("the picker route / has no first segment and no pack", () => {
    expect(packIdFromPathname("/")).toBeNull();
  });

  it("each pack's nav has at least one mobile-eligible item", () => {
    // BottomNav filters to `n.mobile` and hides itself if the result
    // is empty. If a pack ships with no mobile items, mobile users
    // lose their primary nav silently. Catch that at test time.
    for (const id of ALL_PACK_IDS) {
      const pack = getPack(id);
      const mobileItems = (pack?.config.nav ?? []).filter((n) => n.mobile);
      expect(
        mobileItems.length,
        `pack "${id}" has no mobile nav items — BottomNav would render empty`
      ).toBeGreaterThan(0);
    }
  });
});
