import { test, expect } from "@playwright/test";

const GAME_URL = "/cca-f-prep/section/s1-claude-101/games/flashcard-battle";

test.describe("games — Flashcard Battle", () => {
  test("Start screen renders rules + a Start button", async ({ page }) => {
    await page.goto(GAME_URL);
    await expect(
      page.getByRole("heading", {
        name: /Section 1: Claude 101|Claude 101/i,
      })
    ).toBeVisible();
    const startBtn = page.getByRole("button", { name: /Start battle/i });
    await expect(startBtn).toBeVisible();
    // Rules summary mentions Hard / Good / Easy point amounts.
    await expect(page.getByText(/Hard \(0 pts\)/i)).toBeVisible();
    await expect(page.getByText(/Good \(50 pts\)/i)).toBeVisible();
    await expect(page.getByText(/Easy \(100 pts\)/i)).toBeVisible();
  });

  test("Start -> front shows the card with Reveal CTA + score chip", async ({
    page,
  }) => {
    await page.goto(GAME_URL);
    await page.getByRole("button", { name: /Start battle/i }).click();
    await expect(page.getByText(/^Question$/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Reveal answer/i })
    ).toBeVisible();
    // Score chip starts at 0 pts; rate group not visible yet.
    await expect(page.getByText(/^0 pts$/)).toBeVisible();
    await expect(
      page.getByRole("group", { name: /Rate this card/i })
    ).toHaveCount(0);
  });

  test("Reveal -> back shows the rate group with Hard / Good / Easy", async ({
    page,
  }) => {
    await page.goto(GAME_URL);
    await page.getByRole("button", { name: /Start battle/i }).click();
    await page.getByRole("button", { name: /Reveal answer/i }).click();
    await expect(page.getByText(/^Answer$/)).toBeVisible();
    const group = page.getByRole("group", { name: /Rate this card/i });
    await expect(group).toBeVisible();
    await expect(group.getByRole("button", { name: /^Hard/ })).toBeVisible();
    await expect(group.getByRole("button", { name: /^Good/ })).toBeVisible();
    await expect(group.getByRole("button", { name: /^Easy/ })).toBeVisible();
  });

  test("Rating Easy advances to the next card + bumps the score", async ({
    page,
  }) => {
    await page.goto(GAME_URL);
    await page.getByRole("button", { name: /Start battle/i }).click();
    await page.getByRole("button", { name: /Reveal answer/i }).click();
    await page
      .getByRole("group", { name: /Rate this card/i })
      .getByRole("button", { name: /^Easy/ })
      .click();
    // Now back on the front of card 2 with 100 pts on the chip.
    await expect(page.getByText(/^Question$/)).toBeVisible();
    await expect(page.getByText(/^100 pts$/)).toBeVisible();
  });

  test("Keyboard: Space reveals; 1/2/3 rate Hard/Good/Easy", async ({ page }) => {
    await page.goto(GAME_URL);
    await page.getByRole("button", { name: /Start battle/i }).click();
    await page.keyboard.press(" ");
    await expect(page.getByText(/^Answer$/)).toBeVisible();
    await page.keyboard.press("3"); // Easy
    await expect(page.getByText(/^Question$/)).toBeVisible();
    await expect(page.getByText(/^100 pts$/)).toBeVisible();
  });
});
