/* ------------------------------------------------------------------
   Per-pack mini-game progress store.

   Mirrors the shape of progress-store.ts: useSyncExternalStore-friendly
   getter + subscribe + mutator, hydrated from localStorage at the
   pack-derived key `${packId}:games:v1`. Each pack id gets its own
   cached store instance so two browser tabs on different packs don't
   stomp on each other.
------------------------------------------------------------------ */

import { DEFAULT_PACK_ID } from "@/content/pack-registry";
import {
  GAMES_SCHEMA_VERSION,
  emptyGameRecord,
  gamesStorageKey,
  newGamesProgress,
} from "./games-types";
import type { GameAttempt, GameRecord, GamesProgress } from "./games-types";
import type { MiniGameId } from "@/components/section/games-catalog";

function safeParse(raw: string | null): GamesProgress | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<GamesProgress>;
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.schemaVersion === GAMES_SCHEMA_VERSION &&
      parsed.byGame &&
      typeof parsed.byGame === "object"
    ) {
      return parsed as GamesProgress;
    }
    return null;
  } catch {
    return null;
  }
}

export function loadGamesProgressFor(storageKey: string): GamesProgress {
  if (typeof window === "undefined") return newGamesProgress();
  return safeParse(window.localStorage.getItem(storageKey)) ?? newGamesProgress();
}

export function saveGamesProgressFor(
  storageKey: string,
  next: GamesProgress
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

export interface GamesStore {
  get(): GamesProgress;
  getServerSnapshot(): GamesProgress;
  subscribe(cb: () => void): () => void;
  mutate(mutator: (draft: GamesProgress) => void): void;
  recordAttempt(gameId: MiniGameId, attempt: GameAttempt): void;
  bestScorePctFor(gameId: MiniGameId): number;
  lastPlayedAtFor(gameId: MiniGameId): number;
}

function createStore(packId: string): GamesStore {
  const storageKey = gamesStorageKey(packId);
  let current: GamesProgress | null = null;
  const listeners = new Set<() => void>();
  let storageWired = false;

  function ensure(): GamesProgress {
    if (current === null) current = loadGamesProgressFor(storageKey);
    return current;
  }

  function notify(): void {
    for (const l of listeners) l();
  }

  function wireStorageOnce(): void {
    if (storageWired || typeof window === "undefined") return;
    storageWired = true;
    window.addEventListener("storage", (e) => {
      if (e.key !== storageKey) return;
      current = loadGamesProgressFor(storageKey);
      notify();
    });
  }

  function mutate(mutator: (draft: GamesProgress) => void): void {
    const prev = ensure();
    const next = structuredClone(prev);
    mutator(next);
    current = next;
    saveGamesProgressFor(storageKey, next);
    notify();
  }

  return {
    get: () => ensure(),
    getServerSnapshot: () => newGamesProgress(),
    subscribe: (cb) => {
      wireStorageOnce();
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    mutate,
    recordAttempt: (gameId, attempt) => {
      mutate((p) => {
        const rec: GameRecord = p.byGame[gameId] ?? emptyGameRecord();
        rec.attempts.push(attempt);
        const pct = attempt.maxScore > 0 ? attempt.score / attempt.maxScore : 0;
        if (pct > rec.bestScorePct) rec.bestScorePct = pct;
        rec.lastPlayedAt = attempt.finishedAt;
        p.byGame[gameId] = rec;
      });
    },
    bestScorePctFor: (gameId) => ensure().byGame[gameId]?.bestScorePct ?? -1,
    lastPlayedAtFor: (gameId) => ensure().byGame[gameId]?.lastPlayedAt ?? 0,
  };
}

const STORE_CACHE = new Map<string, GamesStore>();

export function getGamesStore(packId: string): GamesStore {
  let s = STORE_CACHE.get(packId);
  if (!s) {
    s = createStore(packId);
    STORE_CACHE.set(packId, s);
  }
  return s;
}

/** Back-compat default-pack store (env-var-resolved at module load). */
export const gamesStore: GamesStore = getGamesStore(DEFAULT_PACK_ID);
