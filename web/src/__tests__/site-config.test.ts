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

  it("Claude project URL points at claude.ai", () => {
    const url: string = siteConfig.claudeProjectUrl;
    if (url.length > 0) {
      expect(url).toMatch(/^https:\/\/claude\.ai\//);
    }
    expect(siteConfig.claudeFallbackUrl).toMatch(/^https:\/\/claude\.ai\//);
  });
});
