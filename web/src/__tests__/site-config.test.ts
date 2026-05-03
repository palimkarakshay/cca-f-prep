import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/site-config";
import { ACTIVE_PACK } from "@/content/active-pack";

describe("siteConfig", () => {
  it("exposes the active pack's branding", () => {
    expect(siteConfig.id).toBe(ACTIVE_PACK.config.id);
    expect(siteConfig.name).toBe(ACTIVE_PACK.config.name);
    expect(siteConfig.tagline.length).toBeGreaterThan(0);
    expect(siteConfig.url).toMatch(/^https?:\/\//);
  });

  it("nav items have label + href", () => {
    expect(siteConfig.nav.length).toBeGreaterThan(0);
    for (const item of siteConfig.nav) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("AskAI fallback URL is a valid https URL", () => {
    const url: string = siteConfig.claudeProjectUrl;
    if (url.length > 0) {
      expect(url).toMatch(/^https?:\/\//);
    }
    expect(siteConfig.claudeFallbackUrl).toMatch(/^https?:\/\//);
  });
});
