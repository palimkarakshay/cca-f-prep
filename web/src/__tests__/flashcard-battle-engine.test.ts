import { describe, expect, it } from "vitest";
import {
  DEFAULT_BATTLE_CONFIG,
  bestStreak,
  buildDeck,
  maxPossibleScore,
  newBattleState,
  pointsForRating,
  reduce,
} from "@/components/games/flashcard-battle/engine";
import type { Flashcard } from "@/content/curriculum-types";

function seededRng(seed = 7): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fff_ffff;
    return s / 0x8000_0000;
  };
}

function fakeDeck(n: number): Flashcard[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}`,
    front: `Front ${i}`,
    back: `Back ${i}`,
  }));
}

describe("buildDeck", () => {
  it("caps the deck at `count` cards", () => {
    const out = buildDeck(fakeDeck(20), 5, seededRng());
    expect(out).toHaveLength(5);
  });

  it("returns all cards when count exceeds available", () => {
    const out = buildDeck(fakeDeck(3), 10, seededRng());
    expect(out).toHaveLength(3);
  });

  it("is deterministic with a seeded rng", () => {
    const a = buildDeck(fakeDeck(15), 8, seededRng());
    const b = buildDeck(fakeDeck(15), 8, seededRng());
    expect(a.map((c) => c.id)).toEqual(b.map((c) => c.id));
  });

  it("returns a copy (does not mutate the input)", () => {
    const input = fakeDeck(10);
    const before = input.map((c) => c.id);
    buildDeck(input, 5, seededRng());
    expect(input.map((c) => c.id)).toEqual(before);
  });
});

describe("pointsForRating + maxPossibleScore", () => {
  it("matches the default config", () => {
    expect(pointsForRating("hard", DEFAULT_BATTLE_CONFIG)).toBe(0);
    expect(pointsForRating("good", DEFAULT_BATTLE_CONFIG)).toBe(50);
    expect(pointsForRating("easy", DEFAULT_BATTLE_CONFIG)).toBe(100);
  });

  it("max = cards * easyPoints", () => {
    expect(maxPossibleScore(12, DEFAULT_BATTLE_CONFIG)).toBe(1200);
    expect(maxPossibleScore(0, DEFAULT_BATTLE_CONFIG)).toBe(0);
  });
});

describe("reduce — state machine", () => {
  function bootedState(deckSize = 5) {
    return reduce(
      newBattleState(fakeDeck(deckSize), DEFAULT_BATTLE_CONFIG),
      { type: "start" }
    );
  }

  it("idle -> front on start (with cards in the deck)", () => {
    const s = bootedState();
    expect(s.phase).toBe("front");
    expect(s.index).toBe(0);
  });

  it("idle -> done on start when the deck is empty", () => {
    const s = reduce(
      newBattleState([], DEFAULT_BATTLE_CONFIG),
      { type: "start" }
    );
    expect(s.phase).toBe("done");
  });

  it("front -> back on flip", () => {
    const s = reduce(bootedState(), { type: "flip" });
    expect(s.phase).toBe("back");
  });

  it("ignores flip when not in 'front'", () => {
    const fresh = newBattleState(fakeDeck(3), DEFAULT_BATTLE_CONFIG);
    expect(reduce(fresh, { type: "flip" })).toBe(fresh);
  });

  it("rate transitions back -> front on the next card", () => {
    let s = bootedState();
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "good" });
    expect(s.phase).toBe("front");
    expect(s.index).toBe(1);
    expect(s.score).toBe(DEFAULT_BATTLE_CONFIG.pointsGood);
  });

  it("rating Easy on the last card transitions to done", () => {
    let s = reduce(
      newBattleState(fakeDeck(1), DEFAULT_BATTLE_CONFIG),
      { type: "start" }
    );
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "easy" });
    expect(s.phase).toBe("done");
    expect(s.score).toBe(DEFAULT_BATTLE_CONFIG.pointsEasy);
  });

  it("Hard requeues the card hardRequeueOffset positions ahead", () => {
    const config = { ...DEFAULT_BATTLE_CONFIG, hardRequeueOffset: 2 };
    let s = newBattleState(fakeDeck(5), config);
    s = reduce(s, { type: "start" });
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "hard" });
    // Card c0 should now appear again at index 3 (current index 1 + 2).
    expect(s.queue.map((c) => c.id)).toEqual(["c0", "c1", "c2", "c0", "c3", "c4"]);
    expect(s.queue.length).toBe(6);
    expect(s.index).toBe(1);
  });

  it("a card can only be requeued maxRequeuesPerCard times — round always terminates (codex P1 #12)", () => {
    // With max=1 the user can rate the SAME card Hard twice; the
    // second time it drops from the queue. With offset 1 + max 1
    // we precisely chase the same card and verify the queue size
    // stops growing.
    const config = {
      ...DEFAULT_BATTLE_CONFIG,
      hardRequeueOffset: 1,
      maxRequeuesPerCard: 1,
    };
    let s = newBattleState(fakeDeck(2), config);
    s = reduce(s, { type: "start" });
    // First card: rate Hard. Queue grows to 3 (c0, c1, c0).
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "hard" });
    expect(s.queue.length).toBe(3);
    // Second card (c1): rate Hard. Queue grows to 4 (c0, c1, c0, c1).
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "hard" });
    expect(s.queue.length).toBe(4);
    // Third card (the requeued c0): rate Hard. Cap kicks in — queue
    // does NOT grow. State advances toward done.
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "hard" });
    expect(s.queue.length).toBe(4);
    expect(s.index).toBe(3);
    // Fourth card (the requeued c1): rate Hard. Same — cap holds.
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "hard" });
    expect(s.queue.length).toBe(4);
    expect(s.phase).toBe("done");
  });

  it("Hard with offset 0 does NOT requeue", () => {
    const config = { ...DEFAULT_BATTLE_CONFIG, hardRequeueOffset: 0 };
    let s = newBattleState(fakeDeck(3), config);
    s = reduce(s, { type: "start" });
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "rate", rating: "hard" });
    expect(s.queue.map((c) => c.id)).toEqual(["c0", "c1", "c2"]);
  });

  it("tick accumulates durationMs only during active phases", () => {
    const fresh = newBattleState(fakeDeck(3), DEFAULT_BATTLE_CONFIG);
    expect(reduce(fresh, { type: "tick", deltaMs: 100 }).durationMs).toBe(0);
    let s = reduce(fresh, { type: "start" });
    s = reduce(s, { type: "tick", deltaMs: 250 });
    expect(s.durationMs).toBe(250);
    s = reduce(s, { type: "flip" });
    s = reduce(s, { type: "tick", deltaMs: 100 });
    expect(s.durationMs).toBe(350);
  });

  it("ignores out-of-phase events", () => {
    const fresh = newBattleState(fakeDeck(3), DEFAULT_BATTLE_CONFIG);
    expect(reduce(fresh, { type: "rate", rating: "good" })).toBe(fresh);
    expect(reduce(fresh, { type: "flip" })).toBe(fresh);
  });
});

describe("bestStreak", () => {
  it("counts the longest run of good/easy ratings", () => {
    let s = reduce(
      newBattleState(fakeDeck(5), { ...DEFAULT_BATTLE_CONFIG, hardRequeueOffset: 0 }),
      { type: "start" }
    );
    const ratings: ("hard" | "good" | "easy")[] = [
      "good",
      "good",
      "hard",
      "easy",
      "good",
    ];
    for (const r of ratings) {
      s = reduce(s, { type: "flip" });
      s = reduce(s, { type: "rate", rating: r });
    }
    expect(bestStreak(s)).toBe(2); // good, good (then hard breaks the streak; final easy/good = 2)
  });
});
