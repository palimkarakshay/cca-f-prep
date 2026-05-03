import { test, expect, type ConsoleMessage } from "@playwright/test";

test.describe("smoke", () => {
  test("home renders without console errors", async ({ page }) => {
    const errors: ConsoleMessage[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg);
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "CCA-F Prep" })).toBeVisible();
    await expect(
      page.getByText("Personal learning and development platform")
    ).toBeVisible();

    expect(errors, errors.map((e) => e.text()).join("\n")).toEqual([]);
  });

  test("primary nav links resolve (no 4xx)", async ({ page, request }) => {
    await page.goto("/");
    const links = page.locator("nav a[href^='/']");
    const count = await links.count();
    const seen = new Set<string>();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      if (!href || seen.has(href)) continue;
      seen.add(href);
      const res = await request.get(href);
      expect(res.status(), `GET ${href}`).toBeLessThan(400);
    }
  });

  test("first section card links to its detail page", async ({ page }) => {
    await page.goto("/");
    const firstSectionLink = page
      .locator("a[href^='/section/']")
      .first();
    await firstSectionLink.click();
    await expect(page).toHaveURL(/\/section\//);
    await expect(page.getByRole("navigation", { name: /Breadcrumb/i })).toBeVisible();
  });
});
