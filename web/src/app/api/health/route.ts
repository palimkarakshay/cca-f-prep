/* ------------------------------------------------------------------
   Health probe.

   GET /api/health → { ok, version, packId, time }

   Used by uptime monitors (BetterStack / Vercel) and the future
   status page. No auth, no caching, no persistence — pure
   liveness signal. Keep the response shape stable; consumers will
   pin on the fields.
------------------------------------------------------------------ */

import { NextResponse } from "next/server";
import packageJson from "../../../../package.json";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      version: packageJson.version,
      packId: process.env.NEXT_PUBLIC_CONTENT_PACK_ID ?? "cca-f-prep",
      time: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
