import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { siteConfig } from "@/lib/site-config";
import { THEME_STORAGE_KEY, PACK_ID } from "@/lib/storage-keys";
import { ACTIVE_PACK } from "@/content/active-pack";
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
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: siteConfig.author ? [{ name: siteConfig.author }] : undefined,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName ?? siteConfig.name,
    statusBarStyle: "black-translucent",
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
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
    document.documentElement.dataset.pack = ${JSON.stringify(PACK_ID)};
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
        {packThemeCSS ? (
          <style dangerouslySetInnerHTML={{ __html: packThemeCSS }} />
        ) : null}
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
