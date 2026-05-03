"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type NavItem } from "@/lib/site-config";
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

export function Header() {
  const pathname = usePathname();
  // Top header surfaces the actionable destinations on tablet+ where there
  // is no bottom nav. On mobile, the brand stays visible but the nav
  // collapses to the bottom-tab bar.
  const visibleNav = siteConfig.nav.filter((n) => n.href !== "/");

  return (
    <header className="border-b border-(--border) mb-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex flex-col gap-0.5 no-underline">
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
              const active = isActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
