"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Award, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { siteConfig, type NavIcon, type NavItem } from "@/lib/site-config";
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

export function BottomNav() {
  const pathname = usePathname();
  const items = siteConfig.nav.filter((n) => n.mobile);

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
          const active = isActive(item, pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
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
