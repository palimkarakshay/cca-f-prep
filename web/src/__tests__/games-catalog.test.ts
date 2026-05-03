import { describe, expect, it } from "vitest";
import {
  GAMES_CATALOG,
  gameHrefFor,
  type MiniGameId,
} from "@/components/section/games-catalog";

describe("GAMES_CATALOG", () => {
  it("has exactly 6 entries (the planned mini-game roster)", () => {
    expect(GAMES_CATALOG).toHaveLength(6);
  });

  it("ids are unique", () => {
    const ids = GAMES_CATALOG.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids match the MiniGameId union", () => {
    const expected: MiniGameId[] = [
      "time-trivia",
      "flashcard-battle",
      "concept-match",
      "domain-rush",
      "complete-the-code",
      "interactive-scenarios",
    ];
    expect(GAMES_CATALOG.map((g) => g.id).sort()).toEqual(expected.sort());
  });

  it("every entry has non-empty title + blurb + category + icon", () => {
    for (const g of GAMES_CATALOG) {
      expect(g.title.length, `${g.id} title`).toBeGreaterThan(0);
      expect(g.blurb.length, `${g.id} blurb`).toBeGreaterThan(20);
      expect(g.category.length, `${g.id} category`).toBeGreaterThan(0);
      expect(g.icon, `${g.id} icon`).toBeDefined();
    }
  });

  it("every entry is currently 'soon' (PR3/PR4 flip Time Trivia + Flashcard Battle)", () => {
    for (const g of GAMES_CATALOG) {
      expect(g.status, `${g.id} status`).toBe("soon");
    }
  });
});

describe("gameHrefFor", () => {
  it("returns the expected per-pack-per-section URL", () => {
    expect(gameHrefFor("cca-f-prep", "s1-claude-101", "time-trivia")).toBe(
      "/cca-f-prep/section/s1-claude-101/games/time-trivia"
    );
  });
});
