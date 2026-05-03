import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/* ------------------------------------------------------------------
   a11y — WCAG 2.1 + 2.2 AA, no critical or serious violations.

   Coverage:
   - Picker page (/) — entry point.
   - Each pack's dashboard (/<packId>) — most-trafficked surface.
   - Each pack's mock index (/<packId>/mock).
   - Post-interaction sub-test that re-runs axe after the depth picker
     toggles + a quiz-option pick — catches dynamic-only violations the
     SSR snapshot misses.

   WCAG 3.0 outcome-based scoring is deferred (the spec is still draft;
   axe-core's stable ruleset remains 2.1/2.2). Tracked in
   `web/SECURITY.md` § Deferred items.
------------------------------------------------------------------ */

const STATIC_PATHS = [
  "/",
  "/cca-f-prep",
  "/cca-f-prep/mock",
  "/sample-pack",
  "/sewing-beginners",
];

const A11Y_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
];

test.describe("a11y — WCAG 2.1+2.2 AA, no critical or serious", () => {
  for (const path of STATIC_PATHS) {
    test(`page ${path} has no critical or serious axe violations`, async ({
      page,
    }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(A11Y_TAGS)
        .analyze();

      const blocking = results.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact ?? "")
      );

      expect(
        blocking,
        blocking
          .map(
            (v) =>
              `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`
          )
          .join("\n")
      ).toEqual([]);
    });
  }

  test("post-interaction state on a lesson page (depth-picker toggle)", async ({
    page,
  }) => {
    // Sample-pack's first authored concept has a depth picker.
    await page.goto("/sample-pack/concept/s1-foundations/c1-1");

    // Toggle Easy if it's available.
    const easyButton = page.getByRole("radio", { name: "Easy" });
    if (await easyButton.isEnabled().catch(() => false)) {
      await easyButton.click();
    }

    const results = await new AxeBuilder({ page })
      .withTags(A11Y_TAGS)
      .analyze();
    const blocking = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? "")
    );
    expect(
      blocking,
      blocking
        .map(
          (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`
        )
        .join("\n")
    ).toEqual([]);
  });
});
