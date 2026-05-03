/* ------------------------------------------------------------------
   Shared types + helpers for SectionTabs.

   Lives in its own (non-"use client") module so the server-rendered
   section page can call resolveTab() against the URL search-param
   while the client SectionTabs component stays in a "use client"
   file. Next.js forbids server -> client function calls; pulling
   resolveTab here means both layers can import it.
------------------------------------------------------------------ */

export type TabId = "goals" | "concepts" | "flashcards" | "quiz" | "games";

export const TAB_IDS: readonly TabId[] = [
  "goals",
  "concepts",
  "flashcards",
  "quiz",
  "games",
] as const;

/**
 * Validate the `?tab=` search-param value at server-side. Anything
 * that isn't a known tab id falls back to "goals" so URL fuzzing /
 * stale links can't crash the page.
 */
export function resolveTab(value: unknown): TabId {
  if (typeof value === "string" && (TAB_IDS as readonly string[]).includes(value)) {
    return value as TabId;
  }
  return "goals";
}
