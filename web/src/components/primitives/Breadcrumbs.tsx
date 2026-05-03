import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-3 flex flex-wrap items-center gap-2 text-xs text-(--muted)"
    >
      {trail.map((c, i) => {
        const isLast = i === trail.length - 1;
        return (
          <Fragment key={`${c.label}-${i}`}>
            {c.href && !isLast ? (
              <Link
                href={c.href}
                className="text-(--muted) no-underline hover:text-(--ink)"
              >
                {c.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{c.label}</span>
            )}
            {!isLast ? <span className="opacity-50">/</span> : null}
          </Fragment>
        );
      })}
    </nav>
  );
}
