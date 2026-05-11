/* ------------------------------------------------------------------
   Last-visit — umbrella-level resume state.

   Curio packs each keep their own per-pack progress (see
   `progress-store.ts`). That's enough to know *where* a learner is
   inside one journey, but not enough to answer "which journey were
   you in last?" when the learner lands back on `/`. This file owns
   that single umbrella record so the home page can show a
   "Pick up where you left off" affordance before the
   "What do you want to learn?" form.

   Schema (versioned via the storage-key suffix):
     - packId        which content pack
     - packName      cached display name (so the resume card renders
                     without re-loading the pack)
     - sectionId?    which section (set on section + concept pages)
     - sectionTitle?
     - conceptId?    which concept (set on concept pages only)
     - conceptTitle?
     - href          the exact route to jump back to
     - visitedAt     unix ms timestamp

   Cached display strings let the home-page banner render fully on
   first paint without depending on pack-registry imports — useful
   because the registry is several hundred KB of curriculum data and
   the home banner just needs three strings.
------------------------------------------------------------------ */

export const LAST_VISIT_STORAGE_KEY = "curio:last-visit:v1";

export interface LastVisit {
  packId: string;
  packName: string;
  sectionId?: string;
  sectionTitle?: string;
  conceptId?: string;
  conceptTitle?: string;
  href: string;
  visitedAt: number;
}

function isLastVisit(value: unknown): value is LastVisit {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.packId === "string" &&
    typeof v.packName === "string" &&
    typeof v.href === "string" &&
    typeof v.visitedAt === "number"
  );
}

export function readLastVisit(): LastVisit | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_VISIT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isLastVisit(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeLastVisit(v: LastVisit): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_VISIT_STORAGE_KEY, JSON.stringify(v));
  } catch {
    // quota / private mode — drop silently
  }
}

export function clearLastVisit(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LAST_VISIT_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------
   External store — useSyncExternalStore consumers.

   Same pattern as goalStore in `learning-goals.ts`: a single in-memory
   cache + listener set, mutations reflect to localStorage, SSR sees a
   stable empty snapshot.
------------------------------------------------------------------ */

type Listener = () => void;

let cached: LastVisit | null | undefined = undefined;
const listeners = new Set<Listener>();

function getSnapshot(): LastVisit | null {
  if (typeof window === "undefined") return null;
  if (cached === undefined) cached = readLastVisit();
  return cached;
}

function emit(next: LastVisit | null): void {
  cached = next;
  if (next) writeLastVisit(next);
  else clearLastVisit();
  for (const l of listeners) l();
}

export const lastVisitStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: getSnapshot,
  getServerSnapshot(): LastVisit | null {
    return null;
  },
  record(v: LastVisit): void {
    // Skip a re-write if nothing meaningful changed (same href within
    // a 10s window). Avoids hammering localStorage when the learner
    // scrolls on the same page and a future hook re-fires the effect.
    const prev = getSnapshot();
    if (
      prev &&
      prev.href === v.href &&
      v.visitedAt - prev.visitedAt < 10_000
    ) {
      return;
    }
    emit(v);
  },
  clear(): void {
    emit(null);
  },
  /** Test-only — wipe in-memory cache + listeners. */
  _resetForTests(): void {
    cached = undefined;
    listeners.clear();
  },
};
