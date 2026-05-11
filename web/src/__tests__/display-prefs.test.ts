/* ------------------------------------------------------------------
   Display preferences store contract.

   Locks the surface the DisplayPrefsMenu + the inline init script
   in app/layout.tsx depend on:
     - storage-key namespacing
     - read/write round-trip
     - tolerant of malformed storage (no throw, fallback to defaults)
     - clamps unknown values back to the legal enum
     - useSyncExternalStore server snapshot empty + stable
     - each setter updates exactly that dial
     - reset() restores all defaults
------------------------------------------------------------------ */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_PREFS,
  DISPLAY_PREFS_STORAGE_KEY,
  initScript,
  prefsStore,
  readPrefs,
  writePrefs,
} from "@/lib/display-prefs";

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

beforeEach(() => {
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: new MemoryStorage(),
  };
  prefsStore._resetForTests();
});

afterEach(() => {
  prefsStore._resetForTests();
});

describe("readPrefs / writePrefs", () => {
  it("returns defaults for missing key", () => {
    expect(readPrefs()).toEqual(DEFAULT_PREFS);
  });

  it("round-trips a populated prefs object", () => {
    writePrefs({ textSize: "large", contrast: "high", motion: "reduced" });
    expect(readPrefs()).toEqual({
      textSize: "large",
      contrast: "high",
      motion: "reduced",
    });
  });

  it("storage key is namespaced (not pack-scoped)", () => {
    expect(DISPLAY_PREFS_STORAGE_KEY).toBe("curio:display-prefs:v1");
  });

  it("tolerates malformed JSON without throwing", () => {
    window.localStorage.setItem(DISPLAY_PREFS_STORAGE_KEY, "not-json");
    expect(readPrefs()).toEqual(DEFAULT_PREFS);
  });

  it("clamps unknown values back to defaults", () => {
    window.localStorage.setItem(
      DISPLAY_PREFS_STORAGE_KEY,
      JSON.stringify({
        textSize: "huge", // illegal
        contrast: "high",
        motion: "off", // illegal
      })
    );
    const out = readPrefs();
    expect(out.textSize).toBe("normal");
    expect(out.contrast).toBe("high");
    expect(out.motion).toBe("normal");
  });
});

describe("prefsStore", () => {
  it("getServerSnapshot returns frozen defaults + is referentially stable", () => {
    const a = prefsStore.getServerSnapshot();
    const b = prefsStore.getServerSnapshot();
    expect(a).toBe(b);
    expect(a).toEqual(DEFAULT_PREFS);
    expect(Object.isFrozen(a)).toBe(true);
  });

  it("each setter updates exactly that dial", () => {
    prefsStore.setTextSize("large");
    expect(prefsStore.get().textSize).toBe("large");
    expect(prefsStore.get().contrast).toBe("normal");
    prefsStore.setContrast("high");
    expect(prefsStore.get().contrast).toBe("high");
    prefsStore.setMotion("reduced");
    expect(prefsStore.get().motion).toBe("reduced");
  });

  it("reset() restores defaults", () => {
    prefsStore.setTextSize("xlarge");
    prefsStore.setContrast("high");
    prefsStore.setMotion("reduced");
    prefsStore.reset();
    expect(prefsStore.get()).toEqual(DEFAULT_PREFS);
  });

  it("notifies subscribers on every change", () => {
    let calls = 0;
    const unsub = prefsStore.subscribe(() => calls++);
    prefsStore.setTextSize("large");
    prefsStore.setContrast("high");
    prefsStore.setMotion("reduced");
    prefsStore.reset();
    unsub();
    expect(calls).toBe(4);
  });
});

describe("initScript", () => {
  it("returns a self-contained IIFE referencing the storage key", () => {
    const script = initScript();
    expect(script).toContain(DISPLAY_PREFS_STORAGE_KEY);
    expect(script).toContain("document.documentElement");
    expect(script).toMatch(/^\(function/);
  });
});
