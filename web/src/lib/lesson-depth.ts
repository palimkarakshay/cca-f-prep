/* ------------------------------------------------------------------
   Lesson-depth preference store — pack-aware.

   The learner picks their preferred depth ("Easy" / "Conceptual" /
   "Deeper") per lesson via the toggle in LessonView. Choice persists
   in localStorage, namespaced by pack id, so revisiting a lesson
   reopens at the same depth.

   Storage shape:
     <pack-id>:lesson-depth:v1 → { [conceptId]: LessonDepth }

   Falls back gracefully (no-op) when localStorage is unavailable.

   Implementation: delegates to a `local-only` StorageDriver per
   pack id. The public API is unchanged from the pre-driver
   implementation.
------------------------------------------------------------------ */

import type { LessonDepth } from "@/content/curriculum-types";
import type { StorageDriver } from "./storage/driver";
import { createLocalDriver } from "./storage/local-driver";

export const DEFAULT_DEPTH: LessonDepth = "conceptual";

type Store = Record<string, LessonDepth>;

function storageKey(packId: string): string {
  return `${packId}:lesson-depth:v1`;
}

function sanitize(raw: unknown): Store {
  if (!raw || typeof raw !== "object") return {};
  // Trust the shape — values that aren't a LessonDepth are filtered
  // implicitly at the read site (fall through to DEFAULT_DEPTH).
  return raw as Store;
}

const drivers = new Map<string, StorageDriver<Store>>();
const listeners = new Set<() => void>();

function driverFor(packId: string): StorageDriver<Store> {
  let d = drivers.get(packId);
  if (!d) {
    d = createLocalDriver<Store>({
      storageKey: storageKey(packId),
      initial: () => ({}),
      sanitize,
    });
    // Bubble per-pack driver notifications up to the global
    // subscriber set — consumers of subscribeLessonDepth listen
    // once and get notified for any pack that changes.
    d.subscribe(notify);
    drivers.set(packId, d);
  }
  return d;
}

function notify(): void {
  for (const l of listeners) l();
}

export function getLessonDepth(
  packId: string,
  conceptId: string
): LessonDepth {
  return driverFor(packId).getSnapshot()[conceptId] ?? DEFAULT_DEPTH;
}

export function setLessonDepth(
  packId: string,
  conceptId: string,
  depth: LessonDepth
): void {
  const d = driverFor(packId);
  d.setSnapshot({ ...d.getSnapshot(), [conceptId]: depth });
}

export function subscribeLessonDepth(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getServerSnapshot(): LessonDepth {
  return DEFAULT_DEPTH;
}
