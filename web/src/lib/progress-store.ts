/* ------------------------------------------------------------------
   Per-pack progress store factory.

   Each pack id has its own store instance, cached so multiple
   useProgress() calls within a render share state. The store backs
   useSyncExternalStore: one snapshot per tab, kept in sync with
   localStorage and across tabs via storage events. Mutators take a
   draft and notify subscribers after save.

   Pre-picker (single-pack era), this file exported a single
   `progressStore` singleton. That export is preserved for back-compat
   — it points at the env-var-resolved DEFAULT_PACK_ID. Components
   inside `[packId]/...` routes should use `useProgress()` instead,
   which picks up the URL pack via PackContext.
------------------------------------------------------------------ */

import { DEFAULT_PACK_ID, getPack } from "@/content/pack-registry";
import { loadProgressFor, newProgress, saveProgressFor } from "./progress";
import type { Progress } from "./progress-types";

/**
 * Resolve the first-section id for a given pack. Used to seed
 * progress so the *URL pack's* first section is the one unlocked —
 * not the default pack's. Returns undefined if the pack id is
 * unknown (caller falls back to the default-pack behaviour in
 * newProgress, which is fine for tests and the back-compat path).
 */
function firstSectionIdFor(packId: string): string | undefined {
  return getPack(packId)?.curriculum.sections[0]?.id;
}

export interface ProgressStore {
  get(): Progress;
  getServerSnapshot(): Progress;
  subscribe(cb: () => void): () => void;
  mutate(mutator: (draft: Progress) => void): void;
}

function createStore(packId: string): ProgressStore {
  const storageKey = `${packId}:progress:v1`;
  const firstId = firstSectionIdFor(packId);
  let current: Progress | null = null;
  // React 19 requires getServerSnapshot to return a referentially stable
  // value across calls; a fresh newProgress() per call trips React #418
  // (hydration mismatch) and the gated subtree never remounts — quizzes,
  // mock-exam runner, and section-test stay on "Loading…", and the
  // section-page tab panels never hydrate.
  const serverSnapshot: Progress = newProgress(firstId);
  const listeners = new Set<() => void>();
  let storageWired = false;

  function ensure(): Progress {
    if (current === null) current = loadProgressFor(storageKey, firstId);
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
      current = loadProgressFor(storageKey, firstId);
      notify();
    });
  }

  return {
    get: () => ensure(),
    getServerSnapshot: () => serverSnapshot,
    subscribe: (cb) => {
      wireStorageOnce();
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    mutate: (mutator) => {
      const prev = ensure();
      const next = structuredClone(prev);
      mutator(next);
      current = next;
      saveProgressFor(storageKey, next);
      notify();
    },
  };
}

const STORE_CACHE = new Map<string, ProgressStore>();

export function getProgressStore(packId: string): ProgressStore {
  let s = STORE_CACHE.get(packId);
  if (!s) {
    s = createStore(packId);
    STORE_CACHE.set(packId, s);
  }
  return s;
}

/** Back-compat default-pack store (env-var-resolved at module load). */
export const progressStore: ProgressStore = getProgressStore(DEFAULT_PACK_ID);
