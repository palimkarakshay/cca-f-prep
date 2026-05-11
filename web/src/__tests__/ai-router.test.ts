/* ------------------------------------------------------------------
   AI router contract.

   Pins the "no key = no money" guarantee. Without OPENROUTER_API_KEY
   set, generate() must return a structured `not-configured` result —
   never throw, never make a network call. This is the safety the
   feature flags depend on (NEXT_PUBLIC_AI_DECODER_ENABLED can stay
   off and the surface code still reads cleanly via the disabled
   case).
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generate } from "../lib/ai/router";

describe("ai router", () => {
  const ORIGINAL_ENV = process.env.OPENROUTER_API_KEY;

  beforeEach(() => {
    delete process.env.OPENROUTER_API_KEY;
  });

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.OPENROUTER_API_KEY;
    } else {
      process.env.OPENROUTER_API_KEY = ORIGINAL_ENV;
    }
    vi.restoreAllMocks();
  });

  it("returns not-configured when no API key is set", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("should not be called", { status: 500 })
    );
    const res = await generate({ system: "S", user: "U" });
    expect(res).toEqual({ ok: false, reason: "not-configured" });
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not throw on upstream error", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("nope", { status: 502, statusText: "Bad Gateway" })
    );
    const res = await generate({ system: "S", user: "U" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe("upstream-error");
      expect(res.detail).toContain("502");
    }
  });

  it("returns ok with text + token counts on success", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "hello world" } }],
          usage: { prompt_tokens: 12, completion_tokens: 3 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const res = await generate({ system: "S", user: "U" });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.text).toBe("hello world");
      expect(res.promptTokens).toBe(12);
      expect(res.completionTokens).toBe(3);
      expect(res.model).toMatch(/anthropic\//);
    }
  });
});
