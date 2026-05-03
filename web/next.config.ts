import type { NextConfig } from "next";
import path from "path";

/**
 * Content-pack selection.
 *
 * The active pack is resolved at build time via the
 * `NEXT_PUBLIC_CONTENT_PACK_ID` environment variable. The webpack
 * alias `@active-pack` points at `content-packs/<id>/`, so the
 * import in `src/content/active-pack.ts` resolves to the selected
 * pack and tree-shaking eliminates inactive packs from the bundle.
 *
 * Default (no env var): `cca-f-prep`. To run a parallel Vercel
 * deploy for a different pack, set
 * `NEXT_PUBLIC_CONTENT_PACK_ID=<pack-id>` in the project env vars.
 *
 * The id is also exposed to client code via the `NEXT_PUBLIC_*`
 * convention, which is how `src/content/active-pack.ts` selects
 * the right pack from the registry as a runtime safety net.
 */
const PACK_ID = process.env.NEXT_PUBLIC_CONTENT_PACK_ID || "cca-f-prep";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@active-pack": path.resolve(__dirname, `./content-packs/${PACK_ID}`),
    };
    return config;
  },
  // Turbopack uses a different config key but accepts the same alias shape.
  turbopack: {
    resolveAlias: {
      "@active-pack": `./content-packs/${PACK_ID}`,
    },
  },
};

export default nextConfig;
