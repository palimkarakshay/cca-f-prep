/* ------------------------------------------------------------------
   StorageDriver<T> — single seam between every store and its
   underlying persistence backend.

   Why this exists
   ---------------
   The app's stores (display-prefs, learning-goals, progress, games,
   sme-edits, …) each implement the same shape today:
     - getSnapshot()  — synchronous read of the in-memory cache
     - subscribe()    — useSyncExternalStore listener
     - writes that persist + notify
     - tolerance for malformed storage + SSR-safe defaults

   Every one of those will eventually need to optionally sync to a
   server (per `plans/v2-scaled-b2b-plan.md` §5–6, week 7–8 of
   Phase 1). The driver abstraction lets us swap the backend
   without touching consumers: a store keeps its typed mutators,
   delegates the snapshot/notify/persist mechanics to a driver,
   and only the driver changes when "local" becomes
   "local-first-server-sync" or "server-of-record".

   v1 ships only `createLocalDriver`. The other two policies will
   land alongside Clerk + Neon in v0.1.
------------------------------------------------------------------ */

export type StoragePolicy =
  | "local-only" // never leaves the device
  | "local-first-server-sync" // optimistic local, async push, last-write-wins
  | "server-of-record"; // server is truth; local is a cache

/**
 * Schema version of the driver contract itself (not of any
 * particular store's payload). Bumped only when the driver
 * interface shape changes in a way that forces every consumer to
 * re-read. Store-payload schema versions live in `:vN` suffixes
 * on their storage keys, independent of this constant.
 */
export const STORE_SCHEMA_VERSION = 2;

export type { SyncMeta, WithSyncMeta } from "./sync-meta";

export interface StorageDriver<T> {
  /** Synchronous snapshot for useSyncExternalStore. */
  getSnapshot(): T;
  /** SSR-stable snapshot (no window access). */
  getServerSnapshot(): T;
  /** Subscribe to local + (future) remote changes. Returns unsubscribe. */
  subscribe(listener: () => void): () => void;
  /** Replace the cached value, persist, and notify. */
  setSnapshot(next: T): void;
  /** Reset to the factory `initial`. */
  reset(): void;
  /** Storage key, for debugging / discipline tests. */
  readonly storageKey: string;
  /** Policy this driver implements. */
  readonly policy: StoragePolicy;
  /** Test-only — drop cache + listeners. */
  _resetForTests?: () => void;
}

export interface CreateDriverOptions<T> {
  /** localStorage / future server-keyed identifier. */
  storageKey: string;
  /** Factory for the initial / fallback value. Called on SSR + reset. */
  initial: () => T;
  /**
   * Sanitize a JSON-decoded value into a valid T. Tolerant readers
   * MUST never throw — return the initial value when the raw shape
   * is unrecognised. Existing stores ship this logic already; the
   * driver just calls it on read.
   */
  sanitize: (raw: unknown) => T;
}
