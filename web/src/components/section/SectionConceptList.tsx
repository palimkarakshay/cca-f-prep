"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { MasteryBadge } from "@/components/primitives/MasteryBadge";
import type { Section } from "@/content/curriculum-types";
import { cn } from "@/lib/utils";

export function SectionConceptList({ section }: { section: Section }) {
  const { hydrated, conceptMastery, sectionUnlocked } = useProgress();
  const unlocked = !hydrated || sectionUnlocked(section.id);

  return (
    <ul className="flex flex-col gap-1">
      {section.concepts.map((c) => {
        const authored = Boolean(c.lesson && c.quiz);
        const m = hydrated ? conceptMastery(c.id) : 0;
        const disabled = !unlocked || !authored;
        const inner = (
          <span className="flex w-full items-center gap-3">
            <span className="w-12 font-mono text-[11px] text-(--accent-2)">
              {c.code}
            </span>
            <span className="flex-1 text-sm">{c.title}</span>
            {c.bloom ? (
              <span className="rounded-full border border-(--border) px-2 py-0.5 text-[10px] text-(--muted)">
                {c.bloom}
              </span>
            ) : null}
            <MasteryBadge mastery={m} />
            {!authored ? (
              <span className="rounded-full border border-(--warn)/40 px-2 py-0.5 text-[10px] text-(--warn)">
                Stub
              </span>
            ) : null}
          </span>
        );
        if (disabled) {
          return (
            <li
              key={c.id}
              className={cn(
                "flex items-center gap-3 rounded-md border border-transparent px-2 py-2 opacity-55",
                "cursor-not-allowed"
              )}
            >
              {inner}
            </li>
          );
        }
        return (
          <li key={c.id}>
            <Link
              href={`/concept/${section.id}/${c.id}`}
              className="flex items-center gap-3 rounded-md border border-transparent px-2 py-2 no-underline hover:border-(--border) hover:bg-(--panel-2)"
            >
              {inner}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
