/* ------------------------------------------------------------------
   Feature flags — single seam for runtime toggles.

   Why this exists
   ---------------
   The Adept (designer-lane) + SME workbench + /for-teams marketing
   surface are built today but deferred to Phase 2 by the v2 plan
   (plans/v2-scaled-b2b-plan.md §5). Rather than rip the code out,
   we hide it behind a single flag so the v1 launch can stay narrow
   without forking the codebase.

   NEXT_PUBLIC_ADEPT_ENABLED
   -------------------------
   - default ENABLED — the operator wants the dogfood surface visible
     today, and there are no paying users to confuse with it.
   - flip to "0" in the production Vercel env when v2's Phase 1
     launch goes live.
   - middleware.ts 404s /adept/** and /for-teams when disabled.
   - home page hides the designer lane tile + decoder when disabled.

   Inline boolean coercion is intentional: an unset env var (during
   local dev, in tests) reads as `undefined` and defaults to enabled.
   Only the literal string "0" disables.
------------------------------------------------------------------ */

export function isAdeptEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADEPT_ENABLED !== "0";
}

/**
 * Server-side variant — identical contract today, but exposed
 * separately so future flags that *must* be server-only (anything
 * not prefixed NEXT_PUBLIC_*) read distinctly from client-readable
 * ones.
 */
export function isAdeptEnabledServer(): boolean {
  return process.env.NEXT_PUBLIC_ADEPT_ENABLED !== "0";
}
