/* ------------------------------------------------------------------
   Observability shim contract.

   Today the surface is a no-op until a DSN is set + the Sentry
   SDK lands. Pin the behaviour so the future wire-up doesn't
   silently regress:

     - `captureException` does NOT throw on weird inputs.
     - `initObservability` is idempotent.
     - `addBreadcrumb` accepts the documented shape.
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetObservabilityForTests,
  addBreadcrumb,
  captureException,
  initObservability,
} from "@/lib/observability";

describe("observability shim", () => {
  beforeEach(() => {
    __resetObservabilityForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initObservability is idempotent", () => {
    expect(() => {
      initObservability();
      initObservability();
      initObservability();
    }).not.toThrow();
  });

  it("captureException does not throw on a plain error", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => captureException(new Error("boom"))).not.toThrow();
  });

  it("captureException tolerates a string / undefined / object", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => captureException("plain string")).not.toThrow();
    expect(() => captureException(undefined)).not.toThrow();
    expect(() => captureException({ shape: "unknown" })).not.toThrow();
  });

  it("addBreadcrumb accepts the documented shape without throwing", () => {
    expect(() =>
      addBreadcrumb({
        category: "ui",
        message: "user clicked deploy",
        level: "info",
        data: { count: 1 },
      })
    ).not.toThrow();
  });
});
