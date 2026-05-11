/* ------------------------------------------------------------------
   Edge middleware.

   Today's job: gate the Adept (designer-lane) routes behind the
   NEXT_PUBLIC_ADEPT_ENABLED feature flag. When the flag is "0",
   /adept/** and /for-teams return 404 so the v1 launch surface
   stays narrow (per plans/v2-scaled-b2b-plan.md §5). Anything
   other than "0" leaves the routes visible.

   The flag is inlined at build time, so a flip requires a Vercel
   re-deploy — fine for a marketing-level visibility switch.

   This file is also the future home for Clerk's auth gate when
   v0.1 lands.
------------------------------------------------------------------ */

import { NextRequest, NextResponse } from "next/server";

const GATED_PREFIXES = ["/adept", "/for-teams"];

function isAdeptEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADEPT_ENABLED !== "0";
}

function isGated(pathname: string): boolean {
  return GATED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function middleware(req: NextRequest): NextResponse {
  if (!isAdeptEnabled() && isGated(req.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  // Match only the gated prefixes so the middleware is a no-op for
  // every other route — avoids the per-request edge overhead.
  matcher: ["/adept", "/adept/:path*", "/for-teams", "/for-teams/:path*"],
};
