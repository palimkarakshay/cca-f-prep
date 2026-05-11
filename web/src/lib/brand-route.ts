/* ------------------------------------------------------------------
   Route-to-brand + role classifier.

   Maps the current pathname to:
     - a *brand* — "curio" (B2C, default) or "adept" (B2B) — driving the
       accent palette in `globals.css` via `html[data-brand="<brand>"]`.
     - a *role* — "learner" (default) or "expert" (L&D / SME) — driving
       the surface-tint overrides for the workbench + scoping pages.

   Pure, side-effect free, and importable from both the SSR layout
   (for the inline init script) and the client (for SPA route changes
   in `BrandSync`).
------------------------------------------------------------------ */

import { B2B_PACKS } from "@/content/pack-registry";

export const B2B_PACK_IDS: readonly string[] = B2B_PACKS.map(
  (p) => p.config.id
);

export type RouteBrand = "curio" | "adept";
export type RouteRole = "learner" | "expert";

function firstSegment(pathname: string): string {
  return (pathname.split("/").filter(Boolean)[0] ?? "").toLowerCase();
}

export function brandForPath(
  pathname: string | null | undefined,
  b2bIds: readonly string[] = B2B_PACK_IDS
): RouteBrand {
  if (!pathname) return "curio";
  if (pathname === "/adept" || pathname.startsWith("/adept/")) return "adept";
  if (pathname === "/for-teams" || pathname.startsWith("/for-teams/"))
    return "adept";
  const seg = firstSegment(pathname);
  if (seg && b2bIds.includes(seg)) return "adept";
  return "curio";
}

export function roleForPath(
  pathname: string | null | undefined
): RouteRole {
  if (!pathname) return "learner";
  if (pathname === "/adept" || pathname.startsWith("/adept/")) return "expert";
  if (pathname === "/for-teams" || pathname.startsWith("/for-teams/"))
    return "expert";
  return "learner";
}
