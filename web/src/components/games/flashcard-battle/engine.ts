/* ------------------------------------------------------------------
   Flashcard Battle engine (pure).

   Self-paced flip-and-rate run through a section's flashcards. For v1
   the rating is per-session only — Hard/Good/Easy maps to a points
   value and to whether the card returns to the back of the queue.
   PR5+ can promote rating to persistent spaced-repetition state.

   Zero React, zero curriculum-singleton imports.
------------------------------------------------------------------ */

import type { Flashcard } from "@/content/curriculum-types";

export type BattleRating = "hard" | "good" | "easy";

export interface BattleConfig {
  /** Maximum cards drawn per round. If the section has fewer, the
   *  round runs that many. */
  cardsPerRound: number;
  pointsHard: number;
  pointsGood: number;
  pointsEasy: number;
  /** When rated Hard, push the card back this many positions so the
   *  user sees it again later in the run. 0 means it doesn't repeat. */
  hardRequeueOffset: number;
  /** Hard requeues are capped per card so a user who keeps rating
   *  Hard cannot stretch the queue indefinitely (codex P1 #12). After
   *  a card has been requeued this many times, further Hard ratings
   *  drop it from the queue and let the round finish. Default 1. */
  maxRequeuesPerCard: number;
}

export const DEFAULT_BATTLE_CONFIG: BattleConfig = {
  cardsPerRound: 12,
  pointsHard: 0,
  pointsGood: 50,
  pointsEasy: 100,
  hardRequeueOffset: 3,
  maxRequeuesPerCard: 1,
};

export type BattlePhase = "idle" | "front" | "back" | "done";

export interface CardOutcome {
  cardId: string;
  rating: BattleRating;
  pointsEarned: number;
}

export interface BattleState {
  phase: BattlePhase;
  config: BattleConfig;
  /** Live queue — Hard ratings can re-add to the tail. */
  queue: Flashcard[];
  /** Pointer into queue. Phase transitions advance it. */
  index: number;
  score: number;
  outcomes: CardOutcome[];
  durationMs: number;
}

export type BattleEvent =
  | { type: "start" }
  | { type: "flip" }
  | { type: "rate"; rating: BattleRating }
  | { type: "tick"; deltaMs: number };

/**
 * Pull all of a section's flashcards into a shuffled deck capped at
 * `count`. Pass a seeded rng for deterministic tests.
 */
export function buildDeck(
  cards: Flashcard[],
  count: number,
  rng: () => number = Math.random
): Flashcard[] {
  const shuffled = cards.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function newBattleState(
  cards: Flashcard[],
  config: BattleConfig
): BattleState {
  return {
    phase: "idle",
    config,
    queue: cards,
    index: 0,
    score: 0,
    outcomes: [],
    durationMs: 0,
  };
}

export function pointsForRating(
  rating: BattleRating,
  config: BattleConfig
): number {
  switch (rating) {
    case "hard":
      return config.pointsHard;
    case "good":
      return config.pointsGood;
    case "easy":
      return config.pointsEasy;
  }
}

/** Theoretical perfect-run total = every card rated Easy. Used as
 *  GameAttempt.maxScore so the result screen can show a percentage. */
export function maxPossibleScore(
  cardCount: number,
  config: BattleConfig
): number {
  return cardCount * config.pointsEasy;
}

function applyRating(
  state: BattleState,
  rating: BattleRating
): BattleState {
  const card = state.queue[state.index];
  const pointsEarned = pointsForRating(rating, state.config);
  const outcome: CardOutcome = {
    cardId: card.id,
    rating,
    pointsEarned,
  };

  let nextQueue = state.queue;
  // Count prior Hard ratings on this exact card. A user cycling Hard
  // forever would otherwise keep growing the queue and the round
  // would never reach `done` (codex P1 review on PR #12). We cap the
  // requeues at `maxRequeuesPerCard`; once exceeded the card drops
  // out of the queue on the next Hard.
  const priorHardOnThisCard = state.outcomes.filter(
    (o) => o.cardId === card.id && o.rating === "hard"
  ).length;
  const canRequeue =
    rating === "hard" &&
    state.config.hardRequeueOffset > 0 &&
    priorHardOnThisCard < state.config.maxRequeuesPerCard;
  if (canRequeue) {
    // Re-insert the card N positions ahead of the current pointer.
    // If the offset overshoots the tail, append.
    const insertAt = Math.min(
      state.index + 1 + state.config.hardRequeueOffset,
      nextQueue.length
    );
    nextQueue = [
      ...nextQueue.slice(0, insertAt),
      card,
      ...nextQueue.slice(insertAt),
    ];
  }

  const nextIndex = state.index + 1;
  const phase: BattlePhase = nextIndex >= nextQueue.length ? "done" : "front";

  return {
    ...state,
    phase,
    queue: nextQueue,
    index: nextIndex,
    score: state.score + pointsEarned,
    outcomes: [...state.outcomes, outcome],
  };
}

export function reduce(
  state: BattleState,
  event: BattleEvent
): BattleState {
  switch (event.type) {
    case "start": {
      if (state.phase !== "idle") return state;
      if (state.queue.length === 0) return { ...state, phase: "done" };
      return { ...state, phase: "front" };
    }
    case "flip": {
      if (state.phase !== "front") return state;
      return { ...state, phase: "back" };
    }
    case "rate": {
      if (state.phase !== "back") return state;
      return applyRating(state, event.rating);
    }
    case "tick": {
      // Only meaningful while a card is in front of the user.
      if (state.phase !== "front" && state.phase !== "back") return state;
      return { ...state, durationMs: state.durationMs + event.deltaMs };
    }
  }
}

export function bestStreak(state: BattleState): number {
  let best = 0;
  let cur = 0;
  for (const o of state.outcomes) {
    if (o.rating === "easy" || o.rating === "good") {
      cur += 1;
      if (cur > best) best = cur;
    } else {
      cur = 0;
    }
  }
  return best;
}
