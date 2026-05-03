/* ------------------------------------------------------------------
   Lesson-depth preference store.

   The learner picks their preferred depth ("Easy" / "Conceptual" /
   "Deeper") per lesson via the toggle in LessonView. Choice persists
   in localStorage, namespaced by pack id, so revisiting a lesson
   reopens at the same depth.

   Storage shape:
     <pack-id>:lesson-depth:v1 → { [conceptId]: LessonDepth }

   Falls back gracefully (no-op) when localStorage is unavailable.
------------------------------------------------------------------ */

import type { LessonDepth } from "@/content/curriculum-types";
import { PACK_ID } from "./storage-keys";

const STORAGE_KEY = `${PACK_ID}:lesson-depth:v1`;

export const DEFAULT_DEPTH: LessonDepth = "conceptual";

type Store = Record<string, LessonDepth>;

function load(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw) as unknown;
    if (!obj || typeof obj !== "object") return {};
    return obj as Store;
  } catch {
    return {};
  }
}

function save(store: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* quota / private mode — silently drop */
  }
}

export function getLessonDepth(conceptId: string): LessonDepth {
  return load()[conceptId] ?? DEFAULT_DEPTH;
}

export function setLessonDepth(conceptId: string, depth: LessonDepth): void {
  const store = load();
  store[conceptId] = depth;
  save(store);
  notify();
}

// useSyncExternalStore plumbing — keeps LessonView in sync with
// localStorage updates (including from other tabs via the storage
// event) without needing a setState-in-effect.
const listeners = new Set<() => void>();
let storageWired = false;

function notify(): void {
  for (const l of listeners) l();
}

function wireStorageOnce(): void {
  if (storageWired || typeof window === "undefined") return;
  storageWired = true;
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) notify();
  });
}

export function subscribeLessonDepth(cb: () => void): () => void {
  wireStorageOnce();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getServerSnapshot(): LessonDepth {
  return DEFAULT_DEPTH;
}
