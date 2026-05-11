"use client";

/* ------------------------------------------------------------------
   LastVisitTracker — server-rendered route metadata + a client effect.

   Mounted invisibly on `[packId]` routes so the umbrella "resume"
   record on the home page knows where the learner was. Each route
   passes only the strings it needs; the component writes a single
   localStorage record via `lastVisitStore`.

   Rendered with `display: none` so it never affects layout. The
   tracker is intentionally a no-op for SSR — the effect runs only
   on the client where localStorage exists.
------------------------------------------------------------------ */

import { useEffect } from "react";
import { lastVisitStore, type LastVisit } from "@/lib/last-visit";

export function LastVisitTracker(
  props: Omit<LastVisit, "visitedAt">
): null {
  const {
    packId,
    packName,
    sectionId,
    sectionTitle,
    conceptId,
    conceptTitle,
    href,
  } = props;
  useEffect(() => {
    lastVisitStore.record({
      packId,
      packName,
      sectionId,
      sectionTitle,
      conceptId,
      conceptTitle,
      href,
      visitedAt: Date.now(),
    });
  }, [
    packId,
    packName,
    sectionId,
    sectionTitle,
    conceptId,
    conceptTitle,
    href,
  ]);
  return null;
}
