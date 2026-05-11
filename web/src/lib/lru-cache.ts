/* ------------------------------------------------------------------
   Tiny LRU cache. Insertion-ordered Map under the hood — when the
   size cap is hit, the oldest entry (first key) is evicted.

   Used as the memoization layer in front of the journey decoder
   today and in front of the AI router tomorrow. The cache key is
   the caller's responsibility — typically a hash of the inputs.
------------------------------------------------------------------ */

export interface LRUCache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  clear(): void;
  readonly size: number;
}

export function createLRU<K, V>(max: number): LRUCache<K, V> {
  if (!Number.isInteger(max) || max < 1) {
    throw new Error(`LRU max must be a positive integer; got ${max}`);
  }
  const map = new Map<K, V>();
  return {
    get(key) {
      if (!map.has(key)) return undefined;
      const value = map.get(key) as V;
      // Refresh recency by re-inserting.
      map.delete(key);
      map.set(key, value);
      return value;
    },
    set(key, value) {
      if (map.has(key)) map.delete(key);
      map.set(key, value);
      if (map.size > max) {
        const oldest = map.keys().next().value as K | undefined;
        if (oldest !== undefined) map.delete(oldest);
      }
    },
    has(key) {
      return map.has(key);
    },
    clear() {
      map.clear();
    },
    get size() {
      return map.size;
    },
  };
}
