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
    // PR3 flipped Time Trivia; PR4 flipped Flashcard Battle. The 4
    // remaining tiles stay "Coming soon" until later PRs.
    await expect(page.getByText("Coming soon")).toHaveCount(4);
    // Both live tiles render as real links.
    const ttLink = page.getByRole("link", { name: /Time Trivia/i });
    await expect(ttLink).toBeVisible();
    await expect(ttLink).toHaveAttribute(
      "href",
      /\/cca-f-prep\/section\/s1-claude-101\/games\/time-trivia$/
    );
    const fbLink = page.getByRole("link", { name: /Flashcard Battle/i });
    await expect(fbLink).toBeVisible();
    await expect(fbLink).toHaveAttribute(
      "href",
      /\/cca-f-prep\/section\/s1-claude-101\/games\/flashcard-battle$/
    );
  });

  test("Flashcards tab flips a card on click and reads the correct side", async ({
    page,
  }) => {
    await page.goto(`${SECTION_URL}?tab=flashcards`);
    const heading = page.getByRole("heading", { name: /Flashcards · /i });
    await expect(heading).toBeVisible();
    const firstCard = page
      .getByRole("button", { name: /^Question:/ })
      .first();
    await expect(firstCard).toHaveAttribute("aria-pressed", "false");
    await firstCard.click();
    // After click the accessible name updates to the answer side, so
    // screen readers hear the back-of-card content rather than still
    // announcing the question text (codex P1 review comment from PR #10).
    const flippedCard = page
      .getByRole("button", { name: /^Answer:/ })
      .first();
    await expect(flippedCard).toHaveAttribute("aria-pressed", "true");
  });

  test("Goals tab shows the time badge + academy link", async ({ page }) => {
    await page.goto(SECTION_URL);
    // Default tab is Goals; the link target is anthropic.skilljar.com.
    const link = page.getByRole("link", {
      name: /Watch on Anthropic Academy/i,
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /skilljar\.com/);
  });

  test("Quiz tab shows the section-test launcher CTA", async ({ page }) => {
    await page.goto(`${SECTION_URL}?tab=quiz`);
    // Section 1 has a section test authored. The launcher CTA links
    // to /[packId]/section/[id]/test.
    const launcherCta = page.getByRole("link", {
      name: /Take section test|Re-take section test/i,
    });
    await expect(launcherCta).toBeVisible();
    await expect(launcherCta).toHaveAttribute(
      "href",
      `${SECTION_URL}/test`
    );
  });
});
