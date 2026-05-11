"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { usePackId } from "@/content/pack-hooks";
import { cn } from "@/lib/utils";

/**
 * Compact "Jump to section" strip rendered at the top of the pack
 * home page. Complements the rich <SectionList> cards below by
 * giving the learner a one-click teleport to any section without
 * scrolling — useful once the journey starts to fill out.
 *
 * Each chip carries the section number, the short title (truncated
 * on narrow viewports), a status icon (complete / unlocked /
 * locked), and an aria-label so screen readers hear the full title
 * + status.
 */
export function JourneyJumper() {
  const pack = usePack();
  const packId = usePackId();
  const { hydrated, sectionComplete, sectionUnlocked } = useProgress();
  const sections = pack.curriculum.sections;

  return (
    <nav
      aria-label="Jump to section"
      className="rounded-md border border-(--border) bg-(--panel-2) p-2"
    >
      <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
        Journey at a glance — jump to any section
      </p>
      <ol className="flex flex-wrap items-center gap-1.5">
        {sections.map((s) => {
          const complete = hydrated && sectionComplete(s.id);
          const unlocked = !hydrated || sectionUnlocked(s.id);
          const Icon = complete ? CheckCircle2 : unlocked ? Circle : Lock;
          return (
            <li key={s.id}>
              <Link
                href={`/${packId}/section/${s.id}`}
                aria-label={`Section ${s.n}: ${s.title} — ${
                  complete ? "complete" : unlocked ? "in progress" : "locked"
                }`}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs no-underline transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                  complete
                    ? "border-(--good)/40 bg-(--good)/8 text-(--ink) hover:border-(--good)"
                    : unlocked
                      ? "border-(--border) bg-(--panel) text-(--ink) hover:border-(--accent) hover:text-(--accent-2)"
                      : "cursor-not-allowed border-(--border) bg-(--panel) text-(--muted)"
                )}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    "h-3.5 w-3.5 flex-none",
                    complete
                      ? "text-(--good)"
                      : unlocked
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
