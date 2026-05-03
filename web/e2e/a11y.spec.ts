import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("a11y — WCAG 2.1 AA, no critical or serious", () => {
  for (const path of ["/", "/mock"]) {
    test(`page ${path} has no critical or serious axe violations`, async ({
      page,
    }) => {
      await page.goto(path);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
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
});
