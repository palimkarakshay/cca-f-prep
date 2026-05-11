/* ------------------------------------------------------------------
   last-visit store contract.

   The home page's ResumeLearningCard reads from this store via
   useSyncExternalStore. The contract tested here is what the card
   depends on:

   - getServerSnapshot is always null (so SSR matches first client
     render before hydration; without this, the resume card would
     hydrate-flicker into existence).
   - readLastVisit / writeLastVisit round-trip through localStorage.
   - readLastVisit tolerates garbage in storage.
   - record() emits and de-bounces identical hrefs within 10s.
   - clear() emits and wipes the record.
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  LAST_VISIT_STORAGE_KEY,
  lastVisitStore,
  readLastVisit,
  writeLastVisit,
  type LastVisit,
} from "@/lib/last-visit";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  key(i: number): string | null {
    return Array.from(this.map.keys())[i] ?? null;
  }
  getItem(k: string): string | null {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.map.set(k, v);
  }
  removeItem(k: string): void {
    this.map.delete(k);
  }
  clear(): void {
    this.map.clear();
  }
}

function visit(extra: Partial<LastVisit> = {}): LastVisit {
  return {
    packId: "pmbok-prep",
    packName: "PMBOK Prep",
    sectionId: "01-foundations",
    sectionTitle: "Foundations",
    conceptId: "B1.1",
    conceptTitle: "What is a project?",
    href: "/pmbok-prep/concept/01-foundations/B1.1",
    visitedAt: Date.now(),
    ...extra,
  };
}

beforeEach(() => {
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: new MemoryStorage(),
  };
  lastVisitStore._resetForTests();
});

afterEach(() => {
  lastVisitStore._resetForTests();
});

describe("last-visit storage", () => {
  it("writeLastVisit/readLastVisit round-trips", () => {
    const v = visit();
    writeLastVisit(v);
    expect(readLastVisit()).toEqual(v);
  });

  it("readLastVisit returns null for missing key", () => {
    expect(readLastVisit()).toBeNull();
  });

  it("readLastVisit tolerates malformed JSON", () => {
    window.localStorage.setItem(LAST_VISIT_STORAGE_KEY, "{not json");
    expect(readLastVisit()).toBeNull();
  });

  it("readLastVisit rejects records missing required fields", () => {
    window.localStorage.setItem(
      LAST_VISIT_STORAGE_KEY,
      JSON.stringify({ packId: "x" })
    );
    expect(readLastVisit()).toBeNull();
  });
});

describe("lastVisitStore (useSyncExternalStore contract)", () => {
  it("getServerSnapshot is always null", () => {
    expect(lastVisitStore.getServerSnapshot()).toBeNull();
  });

  it("record() emits and stores the new visit", () => {
    let calls = 0;
    const unsub = lastVisitStore.subscribe(() => calls++);
    const v = visit();
    lastVisitStore.record(v);
    unsub();
    expect(lastVisitStore.get()).toEqual(v);
    expect(calls).toBe(1);
    expect(readLastVisit()).toEqual(v);
  });

  it("record() debounces identical hrefs within a 10s window", () => {
    const first = visit({ visitedAt: 1_000_000 });
    lastVisitStore.record(first);
    let calls = 0;
    const unsub = lastVisitStore.subscribe(() => calls++);
    // Second record within 10s on the same href → no-op.
    lastVisitStore.record({ ...first, visitedAt: 1_005_000 });
    expect(calls).toBe(0);
    expect(lastVisitStore.get()?.visitedAt).toBe(1_000_000);
    // After 10s the record refreshes.
    lastVisitStore.record({ ...first, visitedAt: 1_011_000 });
    expect(calls).toBe(1);
    expect(lastVisitStore.get()?.visitedAt).toBe(1_011_000);
    unsub();
  });

  it("record() does not debounce a different href", () => {
    lastVisitStore.record(visit({ href: "/a", visitedAt: 1_000_000 }));
    let calls = 0;
    const unsub = lastVisitStore.subscribe(() => calls++);
    lastVisitStore.record(visit({ href: "/b", visitedAt: 1_001_000 }));
    expect(calls).toBe(1);
    expect(lastVisitStore.get()?.href).toBe("/b");
    unsub();
  });

  it("clear() emits and wipes the record", () => {
    lastVisitStore.record(visit());
    let calls = 0;
    const unsub = lastVisitStore.subscribe(() => calls++);
    lastVisitStore.clear();
    unsub();
    expect(lastVisitStore.get()).toBeNull();
    expect(calls).toBe(1);
    expect(readLastVisit()).toBeNull();
  });

  it("unsubscribed listeners do not fire", () => {
    let calls = 0;
    const unsub = lastVisitStore.subscribe(() => calls++);
    unsub();
    lastVisitStore.record(visit());
    expect(calls).toBe(0);
  });
});
