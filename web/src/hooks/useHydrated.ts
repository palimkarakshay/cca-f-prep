"use client";

import { useEffect, useState } from "react";

/**
 * Returns `false` during SSR and on the initial client render (so the
 * first commit matches the server output), then flips to `true` on the
 * first post-hydration effect.
 *
 * Implementation note: the body uses `useEffect(() => setHydrated(true),
 * [])`. eslint-plugin-react-hooks v6+ flags that as
 * `react-hooks/set-state-in-effect` because the rule's recommended
 * alternative is `useSyncExternalStore` with a no-op subscribe.
 *
 * The `useSyncExternalStore` variant was tried first (see commit
 * b41953a + the failed e2e on PR #21) and trips React 19's
 * "useSyncExternalStore returned a different snapshot during hydration"
 * console warning, which `e2e/smoke.spec.ts` and `e2e/picker.spec.ts`
 * fail on (`expect(errors).toEqual([])`). The setState-in-effect
 * pattern is what React's official hydration docs recommend; only the
 * lint rule disagrees, so we narrowly suppress it here. Centralising
 * the suppression in this one file keeps it out of every consumer.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
