"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Award, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSiteConfig } from "@/content/pack-hooks";
import type { NavIcon, NavItem } from "@/lib/site-config";
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
  if (href.startsWith("/#") || href.startsWith("#"))
    return `/${packId}${href.startsWith("/") ? href : `/${href}`}`;
  return href.startsWith(`/${packId}/`) || href === `/${packId}`
    ? href
    : `/${packId}${href}`;
}

export function BottomNav() {
  const pathname = usePathname();
  const siteConfig = useSiteConfig();
  const packId = packIdFromPathname(pathname);
  // On the picker (packId null), every nav item is pack-relative —
  // surfacing them un-prefixed leads to /mock 404s and anchor-only
  // dead links. Hide the bottom nav until the user has picked a pack.
  const items = packId ? siteConfig.nav.filter((n) => n.mobile) : [];

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Primary mobile"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-(--border) bg-(--panel)/95 backdrop-blur",
        "pb-[env(safe-area-inset-bottom)] md:hidden"
      )}
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around">
        {items.map((item) => {
          const Icon = item.icon ? ICONS[item.icon] : Home;
          const href = prefixWithPack(item.href, packId);
          const active = isActive(item, pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] no-underline transition-colors",
                  active
                    ? "text-(--accent-2)"
                    : "text-(--muted) hover:text-(--ink)"
                )}
              >
                <Icon
                  className={cn("h-5 w-5", active && "stroke-[2.25]")}
                  aria-hidden
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
