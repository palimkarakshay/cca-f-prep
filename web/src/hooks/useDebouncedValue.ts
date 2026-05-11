"use client";

/* ------------------------------------------------------------------
   useDebouncedValue — emits the latest value after `delayMs` of
   idle. Idiomatic shape: read the debounced value in a `useMemo`
   or `useEffect` dependency list to avoid firing on every
   keystroke.

   Used by the journey decoders today to defer the (cheap) regex
   pass until the user pauses typing. Critical when the same call
   sites swap to the AI router in v0.1 — `lib/ai/router.ts.generate`
   costs real money per token, and a per-keystroke debounce of
   800ms keeps that cost bounded.
------------------------------------------------------------------ */

import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
