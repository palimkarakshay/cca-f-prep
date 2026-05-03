import type { MetadataRoute } from "next";
import { ACTIVE_PACK } from "@/content/active-pack";

// PWA manifest derived from the active content pack. Replaces the
// hand-edited `public/manifest.webmanifest` so swapping packs swaps
// the install card without a manual file copy.

export default function manifest(): MetadataRoute.Manifest {
  const c = ACTIVE_PACK.config;
  return {
    name: c.name,
    short_name: c.shortName ?? c.name,
    description: c.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: c.manifest.backgroundColor,
    theme_color: c.manifest.themeColor,
    categories: c.manifest.categories ?? [],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
