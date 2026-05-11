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

/**
 * Strict-ish CSP baseline.
 *
 * - `'unsafe-inline'` on script-src is required because Next.js injects
 *   inline hydration scripts. Tightening to per-request nonces is a
 *   deferred follow-up (needs middleware).
 * - `connect-src` allows claude.ai for the Ask-AI hand-off; expand only
 *   when a pack ships an additional outbound destination.
 * - `frame-ancestors 'none'` blocks clickjacking.
 * - `object-src 'none'` blocks Flash / Java / pdf-plugin abuse.
 * - `upgrade-insecure-requests` forces http subresources to https.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://claude.ai https://*.claude.ai",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Subresource Integrity was previously enabled via experimental.sri.
  // On Vercel the integrity attribute on the initial <script> chunks did
  // not match the bytes served from the CDN (likely compression-layer
  // differences vs. the build-time hash), so the browser blocked at
  // least one of those scripts, React never hydrated, and every
  // client-side interaction was inert — tabs didn't switch, the theme
  // toggle didn't flip. Disable until per-request CSP nonces land (the
  // tracked alternative in SECURITY.md). Re-enable only after a
  // matching-bytes verification step in CI.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
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
