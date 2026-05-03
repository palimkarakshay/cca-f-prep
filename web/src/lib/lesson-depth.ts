/* ------------------------------------------------------------------
   Lesson-depth preference store — pack-aware.

   The learner picks their preferred depth ("Easy" / "Conceptual" /
   "Deeper") per lesson via the toggle in LessonView. Choice persists
   in localStorage, namespaced by pack id, so revisiting a lesson
   reopens at the same depth.

   Storage shape:
     <pack-id>:lesson-depth:v1 → { [conceptId]: LessonDepth }

   Falls back gracefully (no-op) when localStorage is unavailable.
------------------------------------------------------------------ */

import type { LessonDepth } from "@/content/curriculum-types";

export const DEFAULT_DEPTH: LessonDepth = "conceptual";

type Store = Record<string, LessonDepth>;

function storageKey(packId: string): string {
  return `${packId}:lesson-depth:v1`;
}

function load(packId: string): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(packId));
    if (!raw) return {};
    const obj = JSON.parse(raw) as unknown;
    if (!obj || typeof obj !== "object") return {};
    return obj as Store;
  } catch {
    return {};
  }
}

function save(packId: string, store: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(packId), JSON.stringify(store));
  } catch {
    /* quota / private mode — silently drop */
  }
}

export function getLessonDepth(
  packId: string,
  conceptId: string
): LessonDepth {
  return load(packId)[conceptId] ?? DEFAULT_DEPTH;
}

export function setLessonDepth(
  packId: string,
  conceptId: string,
  depth: LessonDepth
): void {
  const store = load(packId);
  store[conceptId] = depth;
  save(packId, store);
  notify();
}

// useSyncExternalStore plumbing. Listeners are dispatched on ANY pack's
// storage event since most apps render only one pack at a time; if the
// rare cross-tab cross-pack edit happens, all subscribers re-read.
const listeners = new Set<() => void>();
let storageWired = false;

function notify(): void {
  for (const l of listeners) l();
}

function wireStorageOnce(): void {
  if (storageWired || typeof window === "undefined") return;
  storageWired = true;
  window.addEventListener("storage", (e) => {
    if (e.key && /:lesson-depth:v1$/.test(e.key)) notify();
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
