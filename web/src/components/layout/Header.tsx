"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Award,
  TrendingUp,
  Grid3X3,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { getPack } from "@/content/pack-registry";
import type { NavIcon, NavItem } from "@/lib/site-config";
import { BRAND } from "@/lib/brand";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { cn } from "@/lib/utils";

const ICONS: Record<NavIcon, LucideIcon> = {
  home: Home,
  layers: Layers,
  award: Award,
  "trending-up": TrendingUp,
};

function isActive(item: NavItem, pathname: string | null): boolean {
  if (!pathname) return false;
  const matches = item.match ?? [];
  for (const m of matches) {
    if (m === "/") {
      if (pathname === "/") return true;
    } else if (pathname === m || pathname.startsWith(`${m}/`)) {
      return true;
    }
  }
  return false;
}

function packIdFromPathname(pathname: string | null): string | null {
  if (!pathname) return null;
  const m = pathname.match(/^\/([^/]+)/);
  return m ? m[1] : null;
}

function prefixWithPack(href: string, packId: string | null): string {
  if (!packId) return href;
  if (href === "/") return `/${packId}`;
  if (href.startsWith("/#") || href.startsWith("#")) return `/${packId}${href.startsWith("/") ? href : `/${href}`}`;
  // already-prefixed absolute paths (e.g. "/picker") stay as-is
  return href.startsWith(`/${packId}/`) || href === `/${packId}` ? href : `/${packId}${href}`;
}

export function Header() {
  const pathname = usePathname();
  const firstSegment = packIdFromPathname(pathname);
  // The chrome lives in the root layout, *outside* the [packId]
  // PackProvider, so `usePack()`/`useSiteConfig()` falls back to the
  // default pack and the chrome's nav would lock to that pack's
  // items regardless of which pack the URL points at (e.g. showing
  // "Mock" on /acme-onboarding/... even though Acme has no mock
  // exams). Resolving the pack from the URL keeps the chrome's nav
  // in sync with the route. Non-pack routes (e.g. /for-teams) return
  // null from getPack and fall through to the picker-style chrome
  // (no nav, no Switch-topic button) so the chrome doesn't pretend
  // you're inside a pack.
  const pack = firstSegment ? getPack(firstSegment) : null;
  const packId = pack ? firstSegment : null;
  // Top header surfaces the actionable destinations on tablet+ where there
  // is no bottom nav. On mobile, the brand stays visible but the nav
  // collapses to the bottom-tab bar.
  //
  // On the picker (packId null), every nav item is pack-relative (the
  // pack.config.nav hrefs assume a pack context — e.g. "/mock" really
  // means "/<active pack>/mock"). Surfacing them un-prefixed leads
  // visitors to 404s like /mock or anchor-only pages. Hide the inline
  // nav until the user has picked a pack; the brand + ThemeToggle stay.
  //
  // Brand-line discipline: the second line always reads `BRAND.tagline`
  // ("Learn anything."), never the pack name. Pack identity surfaces
  // on the page H1 + the Switch-topic affordance, so the top chrome
  // doesn't accidentally surface a single pack's identity (e.g. "CCA-F
  // Prep") to a visitor who is exploring multiple topics.
  const visibleNav = pack
    ? pack.config.nav.filter((n) => n.href !== "/")
    : [];
  const homeHref = packId ? `/${packId}` : "/";

  return (
    <header className="border-b border-(--border) mb-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href={homeHref}
          aria-label={`${BRAND.name} home`}
          className="flex min-h-11 flex-col justify-center gap-0.5 no-underline"
        >
          <span className="font-[family-name:var(--font-display)] text-base font-semibold text-(--ink)">
            {BRAND.name}
          </span>
          <span className="text-xs text-(--muted)">{BRAND.tagline}</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 sm:gap-2 md:gap-3 text-sm"
        >
          <ul className="hidden items-center gap-1 md:flex">
            {visibleNav.map((item) => {
              const href = prefixWithPack(item.href, packId);
              const active = isActive(item, pathname);
              const Icon = item.icon ? ICONS[item.icon] : null;
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm no-underline transition-colors",
                      active
                        ? "text-(--ink) bg-(--panel-2)"
                        : "text-(--muted) hover:bg-(--panel-2) hover:text-(--ink)"
                    )}
                  >
                    {Icon ? <Icon aria-hidden className="h-4 w-4" /> : null}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {packId ? (
            <Link
              href="/"
              aria-label="Switch topic — back to all topics"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-xs font-medium text-(--ink) no-underline shadow-sm",
                "transition-colors hover:border-(--accent) hover:text-(--accent-2)",
                "min-h-9"
              )}
            >
              <Grid3X3 aria-hidden className="h-4 w-4" />
              <span className="hidden sm:inline">Switch topic</span>
              <span className="sm:hidden">Topics</span>
            </Link>
          ) : null}
          {/* Persistent For-teams CTA — visible on every route so a B2B
              prospect can find the Adept demo from anywhere in the
              consumer surface. We surface this even *inside* a pack
              because pack browsing is also part of the sales journey
              (prospect tries the consumer experience, then asks "can
              we have this for our team?"). */}
          <Link
            href="/adept"
            aria-label={`${BRAND.b2bName} — ${BRAND.name} for teams`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-(--accent)/40 bg-(--accent)/10 px-3 py-2 text-xs font-semibold text-(--accent-2) no-underline shadow-sm",
              "transition-colors hover:border-(--accent) hover:bg-(--accent)/15",
              "min-h-9"
            )}
          >
            <Briefcase aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">{BRAND.b2bName} (teams)</span>
            <span className="sm:hidden">{BRAND.b2bName}</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
