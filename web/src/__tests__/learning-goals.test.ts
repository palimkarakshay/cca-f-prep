/* ------------------------------------------------------------------
   Learning-goal store contract.

   The store is the single source of truth for umbrella-level
   "what do you want to learn?" submissions. The form on `/` reads
   from it via useSyncExternalStore, so the contract tested here
   is what the form depends on:

   - getServerSnapshot is always []. Required so the first SSR
     render matches the first client render before hydration.
   - readGoals / writeGoals round-trip through localStorage.
   - readGoals is tolerant of garbage in storage (no throw).
   - add() + remove() notify subscribers.
------------------------------------------------------------------ */

import { afterEach, describe, expect, it, beforeEach } from "vitest";
import {
  goalStore,
  LEARNING_GOAL_STORAGE_KEY,
  makeGoal,
  readGoals,
  writeGoals,
  type LearningGoal,
} from "@/lib/learning-goals";

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

function draft(extra: Partial<LearningGoal> = {}) {
  return makeGoal({
    topic: "SQL window functions",
    success: "Write a ROW_NUMBER query unaided in < 10 min",
    endUse: "Rebuild the cohort-retention dashboard at work",
    ...extra,
  });
}

beforeEach(() => {
  // learning-goals.ts gates on `typeof window !== "undefined"`. Stub
  // a minimal jsdom-shaped one with isolated storage per test.
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: new MemoryStorage(),
  };
  goalStore._resetForTests();
});

afterEach(() => {
  goalStore._resetForTests();
});

describe("learning-goals storage", () => {
  it("writeGoals/readGoals round-trip", () => {
    const g = draft();
    writeGoals([g]);
    const back = readGoals();
    expect(back).toEqual([g]);
  });

  it("readGoals returns [] for missing key", () => {
    expect(readGoals()).toEqual([]);
  });

  it("readGoals tolerates malformed JSON without throwing", () => {
    window.localStorage.setItem(LEARNING_GOAL_STORAGE_KEY, "{not json");
    expect(readGoals()).toEqual([]);
  });

  it("readGoals filters non-goal entries", () => {
    window.localStorage.setItem(
      LEARNING_GOAL_STORAGE_KEY,
      JSON.stringify([{ id: "x" }, draft()])
    );
    const back = readGoals();
    expect(back).toHaveLength(1);
    expect(back[0].topic).toMatch(/SQL/);
  });
});

describe("goalStore (useSyncExternalStore contract)", () => {
  it("getServerSnapshot is always empty", () => {
    expect(goalStore.getServerSnapshot()).toEqual([]);
  });

  it("getServerSnapshot is referentially stable across calls", () => {
    // useSyncExternalStore relies on a stable server snapshot to
    // avoid hydration warnings; if this regresses, every consumer
    // of the form would see a React 19 "snapshot differed" error.
    expect(goalStore.getServerSnapshot()).toBe(
      goalStore.getServerSnapshot()
    );
  });

  it("add() emits and prepends the new goal", () => {
    let calls = 0;
    const unsub = goalStore.subscribe(() => calls++);
    const g1 = draft({ topic: "first" });
    const g2 = draft({ topic: "second" });
    goalStore.add(g1);
    goalStore.add(g2);
    unsub();
    const snapshot = goalStore.get();
    expect(snapshot.map((g) => g.topic)).toEqual(["second", "first"]);
    expect(calls).toBe(2);
  });

  it("remove() emits and removes by id", () => {
    const g1 = draft({ topic: "first" });
    const g2 = draft({ topic: "second" });
    goalStore.add(g1);
    goalStore.add(g2);
    let calls = 0;
    const unsub = goalStore.subscribe(() => calls++);
    goalStore.remove(g1.id);
    unsub();
    expect(goalStore.get().map((g) => g.id)).toEqual([g2.id]);
    expect(calls).toBe(1);
  });

  it("unsubscribed listeners do not fire", () => {
    let calls = 0;
    const unsub = goalStore.subscribe(() => calls++);
    unsub();
    goalStore.add(draft());
    expect(calls).toBe(0);
  });
});

describe("makeGoal", () => {
  it("assigns id + createdAt", () => {
    const g = makeGoal({
      topic: "t",
      success: "s",
      endUse: "e",
    });
    expect(g.id.length).toBeGreaterThan(0);
    expect(g.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("assigns unique ids on consecutive calls", () => {
    const a = makeGoal({ topic: "t", success: "s", endUse: "e" });
    const b = makeGoal({ topic: "t", success: "s", endUse: "e" });
    expect(a.id).not.toBe(b.id);
  });
});
