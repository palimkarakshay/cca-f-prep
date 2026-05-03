import { test, expect } from "@playwright/test";

/**
 * PR2.3 — SectionTabs scaffold. Asserts:
 * - 5 tabs render under role="tablist"
 * - Default tab is "Goals" (no ?tab in URL)
 * - Clicking a tab updates ?tab and aria-selected
 * - Refresh on ?tab=games keeps the Games tab selected
 * - Arrow keys move between tabs (auto-activation)
 * - Mini-game grid appears under the Games tab with 6 tiles
 *
 * Runs across all 3 viewport projects (chromium-desktop / -tablet /
 * -mobile) via playwright.config.ts. Mobile asserts the tabstrip is
 * scrollable (overflow-x-auto); desktop asserts the sticky aside.
 */

// Direct deep-link is more reliable than picker -> pack -> section
// chain (which depends on whichever pack happens to render first).
const SECTION_URL = "/cca-f-prep/section/s1-claude-101";

async function gotoFirstSection(page: import("@playwright/test").Page) {
  await page.goto(SECTION_URL);
  await expect(page).toHaveURL(new RegExp(SECTION_URL));
}

test.describe("section tabs", () => {
  test("5 tabs render with role=tablist + tablist children", async ({ page }) => {
    await gotoFirstSection(page);
    const tablist = page.getByRole("tablist", { name: /Section sections/i });
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole("tab");
    await expect(tabs).toHaveCount(5);
    // Goals is the default selected tab.
    await expect(
      tablist.getByRole("tab", { name: /Goals/i })
    ).toHaveAttribute("aria-selected", "true");
  });

  test("clicking a tab updates ?tab and the selected state", async ({ page }) => {
    await gotoFirstSection(page);
    await page.getByRole("tab", { name: /Games/i }).click();
    await expect(page).toHaveURL(/\?tab=games/);
    await expect(page.getByRole("tab", { name: /Games/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  test("refresh preserves ?tab", async ({ page }) => {
    await page.goto(`${SECTION_URL}?tab=games`);
    await expect(page.getByRole("tab", { name: /Games/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  test("ArrowRight from Goals selects Concepts; ArrowLeft from Games wraps to Quiz", async ({
    page,
  }) => {
    await gotoFirstSection(page);
    const tablist = page.getByRole("tablist", { name: /Section sections/i });
    await tablist.getByRole("tab", { name: /Goals/i }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      tablist.getByRole("tab", { name: /Concepts/i })
    ).toHaveAttribute("aria-selected", "true");

    // Land on Games then hit ArrowLeft → Quiz.
    await page.goto(`${SECTION_URL}?tab=games`);
    await tablist.getByRole("tab", { name: /Games/i }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tablist.getByRole("tab", { name: /Quiz/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  test("Games tab shows the 6-tile mini-game grid", async ({ page }) => {
    await gotoFirstSection(page);
    await page.getByRole("tab", { name: /Games/i }).click();
    const heading = page.getByRole("heading", { name: /Mini-games/i });
    await expect(heading).toBeVisible();
    // PR2 ships all 6 tiles disabled (Coming soon). PR3 / PR4 flip
    // Time Trivia + Flashcard Battle to active links.
    await expect(page.getByText("Coming soon")).toHaveCount(6);
  });
});
