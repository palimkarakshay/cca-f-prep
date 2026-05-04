"use client";

import { useSyncExternalStore } from "react";

// No-op subscribe — the snapshot transitions automatically when React
// flips from the server snapshot to the client snapshot post-hydration.
// We never need to fire any external change.
const subscribe = (): (() => void) => () => undefined;
const getClientSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

/**
 * Returns `false` during SSR and during the initial client render (which
 * still uses the server snapshot per React 19's `useSyncExternalStore`
 * contract), then `true` on the first post-hydration commit.
 *
 * Use to gate UI that depends on browser-only state (localStorage,
 * window, document) without triggering React #418 hydration mismatch
 * and without violating `react-hooks/set-state-in-effect`. The earlier
 * `useState(false) + useEffect(() => setHydrated(true), [])` pattern
 * achieves the same flip but trips the lint rule and silently merged
 * with red CI on PR #20.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
