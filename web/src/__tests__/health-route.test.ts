/* ------------------------------------------------------------------
   /api/health smoke test.

   Pins the response shape that uptime monitors and the future
   status page depend on. If the contract changes, the consumers
   must change with it — make this test the trip-wire.
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import { GET } from "../app/api/health/route";

describe("GET /api/health", () => {
  it("returns ok=true and a stable shape", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.version).toBe("string");
    expect(typeof body.packId).toBe("string");
    expect(typeof body.time).toBe("string");
    // ISO-8601 round-trip — parseable date.
    expect(new Date(body.time).toString()).not.toBe("Invalid Date");
  });

  it("disables caching", () => {
    const res = GET();
    expect(res.headers.get("cache-control")).toContain("no-store");
  });
});
