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

import { DEFAULT_PACK_ID } from "@/content/pack-registry";
import { loadProgressFor, newProgress, saveProgressFor } from "./progress";
import type { Progress } from "./progress-types";

export interface ProgressStore {
  get(): Progress;
  getServerSnapshot(): Progress;
  subscribe(cb: () => void): () => void;
  mutate(mutator: (draft: Progress) => void): void;
}

function createStore(packId: string): ProgressStore {
  const storageKey = `${packId}:progress:v1`;
  let current: Progress | null = null;
  const listeners = new Set<() => void>();
  let storageWired = false;

  function ensure(): Progress {
    if (current === null) current = loadProgressFor(storageKey);
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
      current = loadProgressFor(storageKey);
      notify();
    });
  }

  return {
    get: () => ensure(),
    getServerSnapshot: () => newProgress(),
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
