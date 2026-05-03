import { describe, expect, it, beforeEach } from "vitest";
import {
  loadGamesProgressFor,
  saveGamesProgressFor,
} from "@/lib/games-store";
import {
  GAMES_SCHEMA_VERSION,
  emptyGameRecord,
  gamesStorageKey,
  newGamesProgress,
} from "@/lib/games-types";
import { gamesStorageKeyFor } from "@/lib/pack-helpers";
import type { ContentPack } from "@/content/pack-types";

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
  // games-store.ts touches `window`; stub a minimal jsdom-shaped one.
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: new MemoryStorage(),
  };
});

describe("games storage key", () => {
  it("derives ${packId}:games:v1 from a packId", () => {
    expect(gamesStorageKey("cca-f-prep")).toBe("cca-f-prep:games:v1");
    expect(gamesStorageKey("sample-pack")).toBe("sample-pack:games:v1");
  });

  it("gamesStorageKeyFor + gamesStorageKey agree for any pack", () => {
    const fakePack = { config: { id: "demo-pack" } } as unknown as ContentPack;
    expect(gamesStorageKeyFor(fakePack)).toBe(gamesStorageKey("demo-pack"));
  });
});

describe("games progress load / save", () => {
  it("returns a fresh progress when storage is empty", () => {
    const out = loadGamesProgressFor("cca-f-prep:games:v1");
    expect(out.schemaVersion).toBe(GAMES_SCHEMA_VERSION);
    expect(out.byGame).toEqual({});
  });

  it("rehydrates round-tripped JSON", () => {
    const fresh = newGamesProgress();
    fresh.byGame["time-trivia"] = emptyGameRecord();
    fresh.byGame["time-trivia"]!.attempts.push({
      sectionId: "s1-claude-101",
      score: 18,
      maxScore: 30,
      durationMs: 90_000,
      finishedAt: 1_700_000_000_000,
    });
    fresh.byGame["time-trivia"]!.bestScorePct = 0.6;
    fresh.byGame["time-trivia"]!.lastPlayedAt = 1_700_000_000_000;

    saveGamesProgressFor("cca-f-prep:games:v1", fresh);
    const out = loadGamesProgressFor("cca-f-prep:games:v1");
    expect(out).toEqual(fresh);
  });

  it("falls back to a fresh progress when stored JSON is malformed", () => {
    window.localStorage.setItem("cca-f-prep:games:v1", "{not json");
    const out = loadGamesProgressFor("cca-f-prep:games:v1");
    expect(out.byGame).toEqual({});
  });

  it("falls back to a fresh progress on stale schemaVersion", () => {
    window.localStorage.setItem(
      "cca-f-prep:games:v1",
      JSON.stringify({ schemaVersion: 99, byGame: { "time-trivia": {} } })
    );
    const out = loadGamesProgressFor("cca-f-prep:games:v1");
    expect(out.byGame).toEqual({});
  });
});
