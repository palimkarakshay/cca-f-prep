/* ------------------------------------------------------------------
   Feature-flag contract.

   isAdeptEnabled() must default to true when the env var is unset
   (operator dogfood state) and disable only on the literal "0".
   Anything else — "1", "true", "yes", "anything-else", undefined —
   resolves to enabled. This shape keeps a future co-author from
   accidentally hiding the surface with NEXT_PUBLIC_ADEPT_ENABLED="false".
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdeptEnabled, isAdeptEnabledServer } from "../lib/feature-flags";

const ORIG = process.env.NEXT_PUBLIC_ADEPT_ENABLED;

describe("feature-flags", () => {
  afterEach(() => {
    if (ORIG === undefined) delete process.env.NEXT_PUBLIC_ADEPT_ENABLED;
    else process.env.NEXT_PUBLIC_ADEPT_ENABLED = ORIG;
  });

  describe("isAdeptEnabled", () => {
    it("defaults to true when unset", () => {
      delete process.env.NEXT_PUBLIC_ADEPT_ENABLED;
      expect(isAdeptEnabled()).toBe(true);
    });

    it("is false only on the literal '0'", () => {
      process.env.NEXT_PUBLIC_ADEPT_ENABLED = "0";
      expect(isAdeptEnabled()).toBe(false);
    });

    it("treats 'false' / 'no' / anything-else as enabled", () => {
      for (const v of ["1", "true", "false", "no", "yes", "anything"]) {
        process.env.NEXT_PUBLIC_ADEPT_ENABLED = v;
        expect(isAdeptEnabled(), v).toBe(v !== "0");
      }
    });
  });

  it("server variant returns the same value", () => {
    delete process.env.NEXT_PUBLIC_ADEPT_ENABLED;
    expect(isAdeptEnabledServer()).toBe(true);
    process.env.NEXT_PUBLIC_ADEPT_ENABLED = "0";
    expect(isAdeptEnabledServer()).toBe(false);
  });
});

// `beforeEach` is reserved for the next round of flags; keep the
// import live to avoid an eslint unused-import nit when adding more.
beforeEach(() => undefined);
