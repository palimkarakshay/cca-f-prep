import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Numbered 1, 2, 3, … jump strip — a row of small square chips,
 * each linking to one item in an ordered list. The currently-active
 * index gets `aria-current="page"` and a stronger visual treatment.
 *
 * Used in two places:
 *   - The section-page nav: each chip jumps to a section by index.
 *   - The concept-page nav: each chip jumps to a concept within
 *     the currently-open section.
 *
 * Server-renderable: pure prop-driven. No client state.
 */
export interface NumberedJumperItem {
  href: string;
  label: string;
}

export function NumberedJumper({
  items,
  activeIndex,
  ariaLabel,
}: {
  /** Items in display order. Index 0 is rendered as "1". */
  items: NumberedJumperItem[];
  /** 0-based index of the currently-open item, or -1 if none active. */
  activeIndex: number;
  ariaLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-1.5"
    >
      {items.map((it, i) => {
        const active = i === activeIndex;
        return (
          <Link
            key={i}
            href={it.href}
            aria-label={`Jump to ${it.label}`}
            aria-current={active ? "page" : undefined}
            // Min 28x28 hit area still under the 44x44 button target —
            // these are dense secondary jump links beside the primary
            // prev/next, not the primary action. Visible focus ring
            // keeps keyboard nav usable.
            className={cn(
              "inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-1.5 font-mono text-[11px] no-underline transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
              active
                ? "border-(--accent) bg-(--accent) text-white hover:bg-(--accent-2)"
                : "border-(--border) bg-(--panel) text-(--ink) hover:border-(--accent) hover:text-(--accent-2)"
            )}
          >
            {i + 1}
          </Link>
        );
      })}
    </nav>
  );
}
