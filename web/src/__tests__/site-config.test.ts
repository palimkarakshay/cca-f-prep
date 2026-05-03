import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";

describe("siteConfig", () => {
  it("has the expected required fields", () => {
    expect(siteConfig.name).toBe("CCA-F Prep");
    expect(siteConfig.tagline).toMatch(/learning/i);
    expect(siteConfig.url).toMatch(/^https?:\/\//);
    expect(siteConfig.repoUrl).toMatch(/github\.com/);
  });

  it("nav items have label + href", () => {
    expect(siteConfig.nav.length).toBeGreaterThan(0);
    for (const item of siteConfig.nav) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("Claude project URL is set or empty (not malformed)", () => {
    if (siteConfig.claudeProjectUrl !== "") {
      expect(siteConfig.claudeProjectUrl).toMatch(/^https:\/\/claude\.ai\//);
    }
  });
});
