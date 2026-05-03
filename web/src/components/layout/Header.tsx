import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-(--border) pb-4 mb-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/" className="flex flex-col gap-0.5 no-underline">
          <span className="font-[family-name:var(--font-display)] text-base font-semibold text-(--ink)">
            {siteConfig.name}
          </span>
          <span className="text-xs text-(--muted)">{siteConfig.tagline}</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-3 text-xs text-(--muted)"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-(--muted) no-underline hover:text-(--ink)"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
