import { ACTIVE_PACK } from "@/content/active-pack";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return new Response(ACTIVE_PACK.config.iconSvg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
