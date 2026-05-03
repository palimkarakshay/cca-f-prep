"use client";

/* ------------------------------------------------------------------
   Pack context — the request-scoped current pack for client code.

   Provided by `app/[packId]/layout.tsx` based on the URL segment.
   Client components consume via `usePack()`. When no provider is
   present (e.g. the picker page at `/`), the default pack from the
   registry is returned so module-level code paths never crash.
------------------------------------------------------------------ */

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_PACK_ID, getPack } from "./pack-registry";
import type { ContentPack } from "./pack-types";

const PackContext = createContext<ContentPack | null>(null);

export function PackProvider({
  pack,
  children,
}: {
  pack: ContentPack;
  children: ReactNode;
}) {
  return <PackContext.Provider value={pack}>{children}</PackContext.Provider>;
}

/**
 * Returns the current pack. Falls back to the default pack (env-var
 * or first registered) if no provider is present, so root-level
 * client code (the picker, etc.) doesn't crash.
 */
export function usePack(): ContentPack {
  const ctx = useContext(PackContext);
  if (ctx) return ctx;
  const fallback = getPack(DEFAULT_PACK_ID);
  if (fallback) return fallback;
  throw new Error(
    "PackProvider missing and no default pack registered. Check pack-registry.ts."
  );
}
