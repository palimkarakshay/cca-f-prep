import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  // Collapse to "… / parent / current" on narrow screens once we exceed
  // 3 crumbs. Renders the full trail on sm+ and the truncated trail on
  // base. Both are present in the DOM so screen readers always read the
  // full breadcrumb (only the visual presentation changes).
  const collapsed: Crumb[] =
    trail.length > 3
      ? [{ label: "…", href: trail[0]?.href }, ...trail.slice(-2)]
      : trail;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-3 text-xs text-(--muted)"
    >
      <ol className="hidden flex-wrap items-center gap-2 sm:flex">
        {trail.map((c, i) => (
          <CrumbItem
            key={`full-${c.label}-${i}`}
            crumb={c}
            isLast={i === trail.length - 1}
          />
        ))}
      </ol>
      <ol className="flex flex-wrap items-center gap-2 sm:hidden">
        {collapsed.map((c, i) => (
          <CrumbItem
            key={`compact-${c.label}-${i}`}
            crumb={c}
            isLast={i === collapsed.length - 1}
          />
        ))}
      </ol>
    </nav>
  );
}

function CrumbItem({ crumb, isLast }: { crumb: Crumb; isLast: boolean }) {
  return (
    <Fragment>
      <li>
        {crumb.href && !isLast ? (
          <Link
            href={crumb.href}
            className="text-(--muted) no-underline hover:text-(--ink)"
          >
            {crumb.label}
          </Link>
        ) : (
          <span aria-current={isLast ? "page" : undefined}>{crumb.label}</span>
        )}
      </li>
      {!isLast ? (
        <li aria-hidden className="opacity-50">
          /
        </li>
      ) : null}
    </Fragment>
  );
}
