import { test, expect, type ConsoleMessage } from "@playwright/test";

// Pack metadata is read from the live PWA manifest so the smoke spec
// stays decoupled from the active-pack TypeScript alias (which lives
// in webpack / vitest config and isn't visible to Playwright's TS).

async function readManifest(request: { get: (url: string) => Promise<{ json: () => Promise<unknown> }> }) {
  const res = await request.get("/manifest.webmanifest");
  return (await res.json()) as { name: string; description: string };
}

test.describe("smoke", () => {
  test("picker at / renders without console errors", async ({ page }) => {
    const errors: ConsoleMessage[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg);
    });

    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /What do you want to learn/i })
    ).toBeVisible();

    expect(errors, errors.map((e) => e.text()).join("\n")).toEqual([]);
  });

  test("primary nav links from any pack route resolve (no 4xx)", async ({
    page,
    request,
  }) => {
    // Land on a pack via the picker so the chrome nav is pack-prefixed.
    await page.goto("/");
    const firstPackLink = page.locator("a[href^='/']:not([href='/'])").first();
    await firstPackLink.click();
    await expect(page).toHaveURL(/^.*\/[^/]+$/);

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

  test("from a pack, first section card links to its detail page", async ({
    page,
  }) => {
    await page.goto("/");
    // Enter the first pack
    await page.locator("a[href^='/']:not([href='/'])").first().click();
    // Click the first section link inside that pack
    const firstSectionLink = page
      .locator("a[href*='/section/']")
      .first();
    await firstSectionLink.click();
    await expect(page).toHaveURL(/\/section\//);
    await expect(
      page.getByRole("navigation", { name: /Breadcrumb/i })
    ).toBeVisible();
  });

  test("manifest reflects the active pack", async ({ request }) => {
    const { name, description } = await readManifest(request);
    expect(name.length).toBeGreaterThan(0);
    expect(description.length).toBeGreaterThan(0);
  });
});
