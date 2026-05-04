"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getGamesStore } from "@/lib/games-store";
import { useHydrated } from "@/hooks/useHydrated";
import { usePackId } from "@/content/pack-hooks";
import type { GameAttempt } from "@/lib/games-types";
import type { MiniGameId } from "@/components/section/games-catalog";

/**
 * React hook over the per-pack games store. Mirrors useProgress(): the
 * URL packId picks the correct store instance, hydration is via
 * useSyncExternalStore (see hooks/useHydrated for why this isn't
 * useState+useEffect), mutators are stable callback references.
 */
export function useGamesStore() {
  const packId = usePackId();
  const store = useMemo(() => getGamesStore(packId), [packId]);

  const games = useSyncExternalStore(
    store.subscribe,
    store.get,
    store.getServerSnapshot
  );
  const hydrated = useHydrated();

  const recordAttempt = useCallback(
    (gameId: MiniGameId, attempt: GameAttempt) => {
      store.recordAttempt(gameId, attempt);
    },
    [store]
  );

  const bestScorePctFor = useCallback(
    (gameId: MiniGameId): number => store.bestScorePctFor(gameId),
    [store]
  );

  const lastPlayedAtFor = useCallback(
    (gameId: MiniGameId): number => store.lastPlayedAtFor(gameId),
    [store]
  );

  return { games, hydrated, recordAttempt, bestScorePctFor, lastPlayedAtFor };
}
