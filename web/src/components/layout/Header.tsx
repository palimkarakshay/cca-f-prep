"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/content/pack-hooks";
import type { NavItem } from "@/lib/site-config";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { cn } from "@/lib/utils";

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
  const siteConfig = useSiteConfig();
  const packId = packIdFromPathname(pathname);
  // Top header surfaces the actionable destinations on tablet+ where there
  // is no bottom nav. On mobile, the brand stays visible but the nav
  // collapses to the bottom-tab bar.
  const visibleNav = siteConfig.nav.filter((n) => n.href !== "/");
  const homeHref = packId ? `/${packId}` : "/";

  return (
    <header className="border-b border-(--border) mb-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <Link href={homeHref} className="flex flex-col gap-0.5 no-underline">
          <span className="font-[family-name:var(--font-display)] text-base font-semibold text-(--ink)">
            {siteConfig.name}
          </span>
          <span className="text-xs text-(--muted)">{siteConfig.tagline}</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 sm:gap-2 md:gap-4 text-sm"
        >
          <ul className="hidden items-center gap-1 md:flex">
            {visibleNav.map((item) => {
              const href = prefixWithPack(item.href, packId);
              const active = isActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm no-underline transition-colors",
                      active
                        ? "text-(--ink) bg-(--panel-2)"
                        : "text-(--muted) hover:bg-(--panel-2) hover:text-(--ink)"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {packId ? (
            <Link
              href="/"
              className="hidden md:inline-flex rounded-md border border-(--border) px-2 py-1 text-xs text-(--muted) no-underline transition-colors hover:border-(--accent) hover:text-(--ink)"
              title="Switch topic"
            >
              Switch topic
            </Link>
          ) : null}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
