/* ------------------------------------------------------------------
   LRU cache contract.

   Pins: insertion order eviction, recency refresh on get, has(),
   size cap, clear, and the input-validation guard for `max < 1`.
------------------------------------------------------------------ */

import { describe, expect, it } from "vitest";
import { createLRU } from "../lib/lru-cache";

describe("createLRU", () => {
  it("returns undefined on miss, value on hit", () => {
    const c = createLRU<string, number>(3);
    expect(c.get("k")).toBeUndefined();
    c.set("k", 1);
    expect(c.get("k")).toBe(1);
    expect(c.has("k")).toBe(true);
  });

  it("evicts the oldest entry when the cap is hit", () => {
    const c = createLRU<string, number>(2);
    c.set("a", 1);
    c.set("b", 2);
    c.set("c", 3);
    expect(c.has("a")).toBe(false); // evicted
    expect(c.has("b")).toBe(true);
    expect(c.has("c")).toBe(true);
    expect(c.size).toBe(2);
  });

  it("refreshes recency on get — least-recently-used is evicted", () => {
    const c = createLRU<string, number>(2);
    c.set("a", 1);
    c.set("b", 2);
    // Touch "a" — now "b" is oldest.
    expect(c.get("a")).toBe(1);
    c.set("c", 3);
    expect(c.has("a")).toBe(true);
    expect(c.has("b")).toBe(false);
    expect(c.has("c")).toBe(true);
  });

  it("re-inserts on update without growing past the cap", () => {
    const c = createLRU<string, number>(2);
    c.set("a", 1);
    c.set("b", 2);
    c.set("a", 99); // update
    expect(c.size).toBe(2);
    expect(c.get("a")).toBe(99);
  });

  it("clear() drops every entry", () => {
    const c = createLRU<string, number>(3);
    c.set("a", 1);
    c.set("b", 2);
    c.clear();
    expect(c.size).toBe(0);
    expect(c.has("a")).toBe(false);
  });

  it("rejects non-positive caps", () => {
    expect(() => createLRU(0)).toThrow();
    expect(() => createLRU(-1)).toThrow();
    expect(() => createLRU(1.5)).toThrow();
  });
});
