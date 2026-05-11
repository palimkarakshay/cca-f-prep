/* ------------------------------------------------------------------
   Before-you-begin self-check store — pack-aware.

   Tracks which prerequisite items the learner has self-checked and
   whether the card is in expanded or collapsed state. Storage shape:

     <pack-id>:before-you-begin:v1
       → { items: Record<string, boolean>, open: boolean }

   Uses the same useSyncExternalStore plumbing as lesson-depth so the
   shell stays free of setState-in-effect patterns.
------------------------------------------------------------------ */

export interface BeforeYouBeginState {
  items: Record<string, boolean>;
  open: boolean;
}

const DEFAULT_STATE: BeforeYouBeginState = { items: {}, open: true };

function storageKey(packId: string): string {
  return `${packId}:before-you-begin:v1`;
}

function load(packId: string): BeforeYouBeginState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(storageKey(packId));
    if (!raw) return DEFAULT_STATE;
    const obj = JSON.parse(raw) as Partial<BeforeYouBeginState> | null;
    if (!obj || typeof obj !== "object") return DEFAULT_STATE;
    return {
      items:
        obj.items && typeof obj.items === "object"
          ? (obj.items as Record<string, boolean>)
          : {},
      open: typeof obj.open === "boolean" ? obj.open : true,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function save(packId: string, state: BeforeYouBeginState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(packId), JSON.stringify(state));
  } catch {
    /* quota / private mode — silently drop */
  }
}

const cache: Map<string, BeforeYouBeginState> = new Map();

function readCached(packId: string): BeforeYouBeginState {
  const cached = cache.get(packId);
  if (cached) return cached;
  const fresh = load(packId);
  cache.set(packId, fresh);
  return fresh;
}

export function getBeforeYouBeginState(packId: string): BeforeYouBeginState {
  return readCached(packId);
}

export function toggleBeforeYouBeginItem(
  packId: string,
  key: string
): void {
  const current = readCached(packId);
  const next: BeforeYouBeginState = {
    open: current.open,
    items: { ...current.items, [key]: !current.items[key] },
  };
  cache.set(packId, next);
  save(packId, next);
  notify();
}

export function setBeforeYouBeginOpen(packId: string, open: boolean): void {
  const current = readCached(packId);
  const next: BeforeYouBeginState = { items: current.items, open };
  cache.set(packId, next);
  save(packId, next);
  notify();
}

const listeners = new Set<() => void>();
let storageWired = false;

function notify(): void {
  for (const l of listeners) l();
}

function wireStorageOnce(): void {
  if (storageWired || typeof window === "undefined") return;
  storageWired = true;
  window.addEventListener("storage", (e) => {
    if (e.key && /:before-you-begin:v1$/.test(e.key)) {
      // Invalidate the cache for the affected pack so the next read
      // reloads from storage. The pack id is everything before the
      // suffix.
      const packId = e.key.replace(/:before-you-begin:v1$/, "");
      cache.delete(packId);
      notify();
    }
  });
}

export function subscribeBeforeYouBegin(cb: () => void): () => void {
  wireStorageOnce();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getServerSnapshot(): BeforeYouBeginState {
  return DEFAULT_STATE;
}
