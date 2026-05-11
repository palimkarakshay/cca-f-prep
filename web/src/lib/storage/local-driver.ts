/* ------------------------------------------------------------------
   createLocalDriver<T> — local-only StorageDriver implementation.

   Mirrors the existing useSyncExternalStore pattern every store
   already uses:

     - lazy cache (filled on first browser-side read)
     - in-memory listener set
     - cross-tab sync via the `storage` event
     - tolerant read (malformed JSON → initial value)
     - SSR-safe (window-less environments return initial snapshot)

   Behaviour is byte-for-byte compatible with the bespoke
   implementations in display-prefs / lesson-depth / before-you-begin
   etc. — that is the contract the storage-key-discipline.test.ts
   and display-prefs.test.ts suites rely on. When those stores
   migrate to this driver (next commit), the existing tests must
   pass unchanged.
------------------------------------------------------------------ */

import type {
  CreateDriverOptions,
  StorageDriver,
  StoragePolicy,
} from "./driver";

const POLICY: StoragePolicy = "local-only";

function safeReadString(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteString(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota / disabled storage — swallow to keep the in-memory
    // cache live for the rest of the session.
  }
}

function safeRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function createLocalDriver<T>(
  opts: CreateDriverOptions<T>
): StorageDriver<T> {
  const { storageKey, initial, sanitize } = opts;

  let cache: T | null = null;
  const listeners = new Set<() => void>();
  let storageHandler: ((e: StorageEvent) => void) | null = null;

  function readFromStorage(): T {
    const raw = safeReadString(storageKey);
    if (raw === null) return initial();
    try {
      return sanitize(JSON.parse(raw));
    } catch {
      return initial();
    }
  }

  function snapshot(): T {
    if (typeof window === "undefined") return initial();
    if (cache === null) cache = readFromStorage();
    return cache;
  }

  function emit(next: T, opts?: { persist?: boolean }): void {
    cache = next;
    if (opts?.persist !== false) {
      safeWriteString(storageKey, JSON.stringify(next));
    }
    for (const l of listeners) l();
  }

  function ensureStorageHandler(): void {
    if (storageHandler || typeof window === "undefined") return;
    storageHandler = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      // Re-read so the in-memory cache picks up the cross-tab write.
      cache = readFromStorage();
      for (const l of listeners) l();
    };
    window.addEventListener("storage", storageHandler);
  }

  function dropStorageHandler(): void {
    if (!storageHandler || typeof window === "undefined") return;
    window.removeEventListener("storage", storageHandler);
    storageHandler = null;
  }

  return {
    storageKey,
    policy: POLICY,
    getSnapshot: snapshot,
    getServerSnapshot: initial,
    subscribe(listener) {
      listeners.add(listener);
      ensureStorageHandler();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) dropStorageHandler();
      };
    },
    setSnapshot(next) {
      emit(next);
    },
    reset() {
      const value = initial();
      cache = value;
      safeRemove(storageKey);
      for (const l of listeners) l();
    },
    _resetForTests() {
      cache = null;
      listeners.clear();
      dropStorageHandler();
    },
  };
}
