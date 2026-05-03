import { test, expect } from "@playwright/test";

const GAME_URL = "/cca-f-prep/section/s1-claude-101/games/time-trivia";

test.describe("games — Time Trivia", () => {
  test("Start screen renders the rules + a Start button", async ({ page }) => {
    await page.goto(GAME_URL);
    await expect(
      page.getByRole("heading", { name: /Section 1: Claude 101|Claude 101/i })
    ).toBeVisible();
    const startBtn = page.getByRole("button", { name: /Start round/i });
    await expect(startBtn).toBeVisible();
    // Rules summary mentions both perQuestion + speed bonus.
    await expect(page.getByText(/15 seconds per question/i)).toBeVisible();
    await expect(page.getByText(/Speed bonus/i)).toBeVisible();
  });

  test("Start -> playing transitions show countdown + 4 option buttons", async ({
    page,
  }) => {
    await page.goto(GAME_URL);
    await page.getByRole("button", { name: /Start round/i }).click();
    // Countdown progressbar is exposed with role="progressbar".
    const progress = page.getByRole("progressbar", { name: /Time left/i });
    await expect(progress).toBeVisible();
    // The 4 option buttons are the only aria-pressed controls on the
    // play screen — A/B/C/D, all start unpressed.
    const options = page.locator("button[aria-pressed]");
    await expect(options).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(options.nth(i)).toHaveAttribute("aria-pressed", "false");
    }
    // Score chip starts at 0 pts.
    await expect(page.getByText(/^0 pts$/)).toBeVisible();
  });

  test("Selecting an option locks it in + reveals correctness", async ({
    page,
  }) => {
    await page.goto(GAME_URL);
    await page.getByRole("button", { name: /Start round/i }).click();
    // Click the first option button (A) — exact answer text varies by
    // shuffled-question order, but option A is always first in the DOM.
    const firstOption = page.locator("button[aria-pressed]").first();
    await firstOption.click();
    // After selection the user is in the "revealing" phase: the chosen
    // option has aria-pressed=true and one of the four buttons has the
    // good or bad tone class. We assert aria-pressed flipped — that's
    // a stable signal regardless of correctness.
    await expect(firstOption).toHaveAttribute("aria-pressed", "true");
  });

  test("Keyboard 1/2/3/4 selects A/B/C/D during play", async ({ page }) => {
    await page.goto(GAME_URL);
    await page.getByRole("button", { name: /Start round/i }).click();
    await page.keyboard.press("2");
    // After the keypress option B (the second button) should be
    // aria-pressed=true.
    const optionB = page.locator("button[aria-pressed]").nth(1);
    await expect(optionB).toHaveAttribute("aria-pressed", "true");
  });
});
