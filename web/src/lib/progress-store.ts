/* ------------------------------------------------------------------
   Tiny vanilla store backing useSyncExternalStore. One snapshot per
   tab, kept in sync with localStorage and across tabs via storage
   events. Mutators take a draft and notify subscribers after save.
------------------------------------------------------------------ */

import { loadProgress, newProgress, saveProgress } from "./progress";
import { PROGRESS_STORAGE_KEY, type Progress } from "./progress-types";

let current: Progress | null = null;
const listeners = new Set<() => void>();
let storageWired = false;

function ensure(): Progress {
  if (current === null) current = loadProgress();
  return current;
}

function notify() {
  for (const l of listeners) l();
}

function wireStorageOnce() {
  if (storageWired || typeof window === "undefined") return;
  storageWired = true;
  window.addEventListener("storage", (e) => {
    if (e.key !== PROGRESS_STORAGE_KEY) return;
    current = loadProgress();
    notify();
  });
}

export const progressStore = {
  get(): Progress {
    return ensure();
  },
  getServerSnapshot(): Progress {
    return newProgress();
  },
  subscribe(cb: () => void): () => void {
    wireStorageOnce();
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  mutate(mutator: (draft: Progress) => void): void {
    const prev = ensure();
    const next = structuredClone(prev);
    mutator(next);
    current = next;
    saveProgress(next);
    notify();
  },
};
