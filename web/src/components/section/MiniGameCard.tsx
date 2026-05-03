import Link from "next/link";
import {
  Timer,
  Layers,
  Puzzle,
  Target,
  Code,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MiniGameIcon, MiniGameStatus } from "./games-catalog";

const ICONS: Record<MiniGameIcon, LucideIcon> = {
  timer: Timer,
  layers: Layers,
  puzzle: Puzzle,
  target: Target,
  code: Code,
  "git-branch": GitBranch,
};

export interface MiniGameCardProps {
  title: string;
  blurb: string;
  category: string;
  icon: MiniGameIcon;
  status: MiniGameStatus;
  /** Required when status === "live"; ignored when "soon". */
  href?: string;
  className?: string;
}

/**
 * Single game tile inside MiniGameGrid. Pure presentational — accepts
 * everything as props so the same component renders for any pack.
 *
 * Disabled state uses warn-tone Card + "Coming soon" pill rather than
 * opacity: opacity strips kill text contrast (see SectionConceptList:51-53
 * for the same a11y reasoning).
 */
export function MiniGameCard({
  title,
  blurb,
  category,
  icon,
  status,
  href,
  className,
}: MiniGameCardProps) {
  const Icon = ICONS[icon];
  const live = status === "live";
  const inner = (
    <Card
      tone={live ? "default" : "warn"}
      className={cn(
        "flex h-full flex-col gap-2 p-5 transition-colors",
        live
          ? "hover:border-(--accent)"
          : "cursor-not-allowed bg-(--panel-2)",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "inline-flex h-8 w-8 flex-none items-center justify-center rounded-md",
            live
              ? "bg-(--panel-2) text-(--accent-2)"
              : "bg-(--panel) text-(--muted)"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
          {category}
        </span>
        {!live ? (
          <span className="ml-auto rounded-full border border-(--warn)/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-(--warn)">
            Coming soon
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-(--ink)">{title}</h3>
      <p className="text-sm text-(--muted)">{blurb}</p>
      {live ? (
        <p className="mt-auto pt-2 text-sm font-semibold text-(--accent-2)">
          Play →
        </p>
      ) : null}
    </Card>
  );

  if (live && href) {
    return (
      <Link href={href} className="no-underline">
        {inner}
      </Link>
    );
  }
  return (
    <div aria-disabled className="block">
      {inner}
    </div>
  );
}
