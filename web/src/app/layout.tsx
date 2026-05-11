import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { siteConfig } from "@/lib/site-config";
import { BRAND } from "@/lib/brand";
import { THEME_STORAGE_KEY, PACK_ID } from "@/lib/storage-keys";
import { ACTIVE_PACK } from "@/content/active-pack";
import { initScript as displayPrefsInitScript } from "@/lib/display-prefs";
import { B2B_PACK_IDS } from "@/lib/brand-route";
import { BRAND_THEME_CSS } from "@/lib/brand-theme";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: BRAND.name,
  authors: siteConfig.author ? [{ name: siteConfig.author }] : undefined,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  appleWebApp: {
    capable: true,
    title: BRAND.shortName,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: BRAND.name,
    description: BRAND.description,
    images: [
      {
        url: "/images/og/final/curio-og.jpg",
        width: 1024,
        height: 576,
        alt: `${BRAND.name} — ${BRAND.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.description,
    images: ["/images/og/final/curio-og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: ACTIVE_PACK.config.theme?.light?.["--canvas"] ?? "#fafaf9",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: ACTIVE_PACK.config.theme?.dark?.["--canvas"] ?? "#0e0f12",
    },
  ],
};

// Set the theme class on <html> before paint to avoid a flash of the wrong
// theme. Reads the user's saved preference from localStorage; falls back to
// prefers-color-scheme. Pack id and storage key are inlined at build time.
//
// Also resolves the route's *brand* (curio vs adept) and *role* (learner
// vs expert) from the current URL so the brand-token <style> block below
// applies on first paint — no flash of the wrong accent. The B2B pack
// id list is inlined at build time and kept in sync with the registry
// via `B2B_PACK_IDS`.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
    document.documentElement.dataset.pack = ${JSON.stringify(PACK_ID)};
    var path = (window.location && window.location.pathname) || "/";
    var b2b = ${JSON.stringify(B2B_PACK_IDS)};
    var first = (path.split("/")[1] || "").toLowerCase();
    var brand = "curio";
    if (path === "/adept" || path.indexOf("/adept/") === 0) brand = "adept";
    else if (path === "/for-teams" || path.indexOf("/for-teams/") === 0) brand = "adept";
    else if (first && b2b.indexOf(first) !== -1) brand = "adept";
    document.documentElement.dataset.brand = brand;
    var role = "learner";
    if (path === "/adept" || path.indexOf("/adept/") === 0) role = "expert";
    else if (path === "/for-teams" || path.indexOf("/for-teams/") === 0) role = "expert";
    document.documentElement.dataset.role = role;
  } catch (_) {}
})();
`.trim();

// Per-pack theme token overrides — written as light :root vars and dark
// html.dark vars, scoped to the data-pack attribute so two packs in
// different browser tabs don't bleed into each other.
function buildPackThemeCSS(): string {
  const t = ACTIVE_PACK.config.theme;
  if (!t) return "";
  const toBlock = (vars: Record<string, string> | undefined): string => {
    if (!vars) return "";
    return Object.entries(vars)
      .map(([k, v]) => `${k}: ${v};`)
      .join("\n  ");
  };
  const light = toBlock(t.light);
  const dark = toBlock(t.dark);
  const out: string[] = [];
  if (light) out.push(`html[data-pack="${PACK_ID}"] {\n  ${light}\n}`);
  if (dark)
    out.push(`html[data-pack="${PACK_ID}"].dark {\n  ${dark}\n}`);
  return out.join("\n");
}

const packThemeCSS = buildPackThemeCSS();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: displayPrefsInitScript() }}
        />
        {packThemeCSS ? (
          <style dangerouslySetInnerHTML={{ __html: packThemeCSS }} />
        ) : null}
        {/* Brand + role tokens — emitted AFTER pack theme so the
            `data-brand` / `data-role` selectors win on equal specificity
            for surfaces classified as Adept or expert-mode. */}
        <style dangerouslySetInnerHTML={{ __html: BRAND_THEME_CSS }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
