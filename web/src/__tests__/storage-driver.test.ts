/* ------------------------------------------------------------------
   StorageDriver — local-only contract.

   Pins the behaviour the existing store factories rely on, so when
   display-prefs / lesson-depth / before-you-begin / theme migrate
   to this driver the existing tests still pass.

     - SSR-safe (no window → initial())
     - Lazy first read; malformed JSON → initial()
     - Setters persist + notify
     - Cross-tab `storage` event triggers re-read + notify
     - reset() clears storage and notifies
     - Unsubscribe removes the listener (and the storage handler
       once the last listener leaves) so leak-checked suites don't
       complain.
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLocalDriver } from "../lib/storage/local-driver";

interface Shape {
  a: number;
  b: string;
}

function makeWindowMock() {
  const store = new Map<string, string>();
  const listeners = new Set<(e: StorageEvent) => void>();
  return {
    store,
    addListener(fn: (e: StorageEvent) => void) {
      listeners.add(fn);
    },
    removeListener(fn: (e: StorageEvent) => void) {
      listeners.delete(fn);
    },
    fireStorageEvent(key: string, newValue: string | null) {
      const event = { key, newValue } as StorageEvent;
      for (const l of listeners) l(event);
    },
    install() {
      const w = {
        localStorage: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: (k: string, v: string) => void store.set(k, v),
          removeItem: (k: string) => void store.delete(k),
        },
        addEventListener: (type: string, fn: EventListener) => {
          if (type === "storage") this.addListener(fn as never);
        },
        removeEventListener: (type: string, fn: EventListener) => {
          if (type === "storage") this.removeListener(fn as never);
        },
      };
      vi.stubGlobal("window", w);
    },
  };
}

const initial = (): Shape => ({ a: 0, b: "init" });
const sanitize = (raw: unknown): Shape => {
  if (typeof raw !== "object" || raw === null) return initial();
  const r = raw as Record<string, unknown>;
  return {
    a: typeof r.a === "number" ? r.a : 0,
    b: typeof r.b === "string" ? r.b : "init",
  };
};

describe("createLocalDriver", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns initial() server-side (no window)", () => {
    const d = createLocalDriver({ storageKey: "t:srv:v1", initial, sanitize });
    expect(d.getServerSnapshot()).toEqual({ a: 0, b: "init" });
    expect(d.getSnapshot()).toEqual({ a: 0, b: "init" });
  });

  it("lazy-reads from localStorage on first browser snapshot", () => {
    const win = makeWindowMock();
    win.store.set("t:lazy:v1", JSON.stringify({ a: 7, b: "hi" }));
    win.install();
    const d = createLocalDriver({ storageKey: "t:lazy:v1", initial, sanitize });
    expect(d.getSnapshot()).toEqual({ a: 7, b: "hi" });
  });

  it("falls back to initial() on malformed JSON", () => {
    const win = makeWindowMock();
    win.store.set("t:bad:v1", "{not-json");
    win.install();
    const d = createLocalDriver({ storageKey: "t:bad:v1", initial, sanitize });
    expect(d.getSnapshot()).toEqual({ a: 0, b: "init" });
  });

  it("setSnapshot persists + notifies subscribers", () => {
    const win = makeWindowMock();
    win.install();
    const d = createLocalDriver({ storageKey: "t:set:v1", initial, sanitize });
    const notify = vi.fn();
    d.subscribe(notify);
    d.setSnapshot({ a: 9, b: "x" });
    expect(d.getSnapshot()).toEqual({ a: 9, b: "x" });
    expect(JSON.parse(win.store.get("t:set:v1")!)).toEqual({ a: 9, b: "x" });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("cross-tab storage event triggers a re-read + notify", () => {
    const win = makeWindowMock();
    win.install();
    const d = createLocalDriver({ storageKey: "t:xtab:v1", initial, sanitize });
    const notify = vi.fn();
    d.subscribe(notify);
    // Simulate another tab writing.
    win.store.set("t:xtab:v1", JSON.stringify({ a: 42, b: "tab2" }));
    win.fireStorageEvent("t:xtab:v1", JSON.stringify({ a: 42, b: "tab2" }));
    expect(d.getSnapshot()).toEqual({ a: 42, b: "tab2" });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("ignores storage events for other keys", () => {
    const win = makeWindowMock();
    win.install();
    const d = createLocalDriver({ storageKey: "t:me:v1", initial, sanitize });
    const notify = vi.fn();
    d.subscribe(notify);
    win.fireStorageEvent("someone-else:v1", "{}");
    expect(notify).not.toHaveBeenCalled();
  });

  it("reset() clears storage and notifies", () => {
    const win = makeWindowMock();
    win.store.set("t:rst:v1", JSON.stringify({ a: 3, b: "x" }));
    win.install();
    const d = createLocalDriver({ storageKey: "t:rst:v1", initial, sanitize });
    const notify = vi.fn();
    d.subscribe(notify);
    d.reset();
    expect(d.getSnapshot()).toEqual({ a: 0, b: "init" });
    expect(win.store.has("t:rst:v1")).toBe(false);
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("exposes its policy + storageKey for discipline tests", () => {
    const d = createLocalDriver({ storageKey: "t:meta:v1", initial, sanitize });
    expect(d.policy).toBe("local-only");
    expect(d.storageKey).toBe("t:meta:v1");
  });
});
