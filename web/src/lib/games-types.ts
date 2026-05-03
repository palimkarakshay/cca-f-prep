/* ------------------------------------------------------------------
   Mini-game progress types.

   Stored under the pack-derived key `${packId}:games:v1`. Schema
   version is bumped + a migrator added the moment we change the
   on-disk shape so existing localStorage doesn't crash the app.
------------------------------------------------------------------ */

import type { MiniGameId } from "@/components/section/games-catalog";

/**
 * Outcome of a single completed game session. We only persist
 * completed runs (abandoned runs are never written) so the store
 * stays small.
 */
export interface GameAttempt {
  /** Section id the game was scoped to. Sections decide which
   *  questions / cards / scenarios feed the run, so this is part
   *  of the per-attempt identity. */
  sectionId: string;
  /** Final cumulative score the engine produced. */
  score: number;
  /** Maximum possible score for this run. Lets the UI display
   *  "12 / 30" without recomputing the formula. */
  maxScore: number;
  /** Wall-clock duration of the run in milliseconds. */
  durationMs: number;
  /** Epoch ms when the run finished. */
  finishedAt: number;
}

/** Per-game roll-up bucket. `bestScorePct` is recomputed on every
 *  push so the dashboard tile + GamesPanel don't have to scan the
 *  whole attempts list. */
export interface GameRecord {
  attempts: GameAttempt[];
  /** 0..1 fraction. -1 means "no attempts yet". */
  bestScorePct: number;
  /** Most recent finishedAt, for the "Last played" tile copy. */
  lastPlayedAt: number;
}

export interface GamesProgress {
  schemaVersion: 1;
  byGame: Partial<Record<MiniGameId, GameRecord>>;
}

export const GAMES_SCHEMA_VERSION = 1 as const;

export function newGamesProgress(): GamesProgress {
  return { schemaVersion: GAMES_SCHEMA_VERSION, byGame: {} };
}

export function emptyGameRecord(): GameRecord {
  return { attempts: [], bestScorePct: -1, lastPlayedAt: 0 };
}

export function gamesStorageKey(packId: string): string {
  return `${packId}:games:v1`;
}
