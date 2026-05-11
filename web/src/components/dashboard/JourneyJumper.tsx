"use client";

import Link from "next/link";
import { CheckCircle2, CircleDot, Circle } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { usePackId } from "@/content/pack-hooks";
import { cn } from "@/lib/utils";

/**
 * Compact "Jump to module" strip rendered at the top of the pack
 * home page. Three-state visual: complete (green), in-progress
 * (terracotta accent), upcoming (neutral). No locked state — every
 * module is always navigable now.
 */
export function JourneyJumper() {
  const pack = usePack();
  const packId = usePackId();
  const { hydrated, sectionStatus } = useProgress();
  const sections = pack.curriculum.sections;

  return (
    <nav
      aria-label="Jump to module"
      className="rounded-md border border-(--border) bg-(--panel-2) p-2"
    >
      <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
        Course at a glance — jump to any module
      </p>
      <ol className="flex flex-wrap items-center gap-1.5">
        {sections.map((s) => {
          const status = hydrated ? sectionStatus(s.id) : "upcoming";
          const Icon =
            status === "complete"
              ? CheckCircle2
              : status === "in-progress"
                ? CircleDot
                : Circle;
          return (
            <li key={s.id}>
              <Link
                href={`/${packId}/section/${s.id}`}
                aria-label={`Module ${s.n}: ${s.title} — ${
                  status === "complete"
                    ? "complete"
                    : status === "in-progress"
                      ? "in progress"
                      : "not started"
                }`}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs no-underline transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                  status === "complete"
                    ? "border-(--good)/40 bg-(--good)/8 text-(--ink) hover:border-(--good)"
                    : status === "in-progress"
                      ? "border-(--accent)/40 bg-(--accent)/8 text-(--ink) hover:border-(--accent)"
                      : "border-(--border) bg-(--panel) text-(--ink) hover:border-(--accent-2) hover:text-(--accent-2)"
                )}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    "h-3.5 w-3.5 flex-none",
                    status === "complete"
                      ? "text-(--good)"
                      : status === "in-progress"
                        ? "text-(--accent-2)"
                        : "text-(--muted)"
                  )}
                />
                <span className="font-mono text-[11px] text-(--accent-2)">
                  {s.n}
                </span>
                <span className="max-w-[12rem] truncate">{s.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
