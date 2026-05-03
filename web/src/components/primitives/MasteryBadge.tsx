"use client";

import { cn } from "@/lib/utils";
import { masteryLabel } from "@/content/curriculum-loader";
import type { Mastery } from "@/lib/progress-types";

const TONE: Record<Mastery, string> = {
  0: "text-(--muted) border-(--border)",
  1: "text-(--warn) border-(--warn)/50",
  2: "text-(--bad) border-(--bad)/50",
  3: "text-(--good) border-(--good)/50",
  4: "text-(--good) border-(--good) bg-(--good)/10",
};

export function MasteryBadge({
  mastery,
  className,
}: {
  mastery: Mastery;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        TONE[mastery],
        className
      )}
      aria-label={`Mastery: ${masteryLabel(mastery)}`}
    >
      {masteryLabel(mastery)}
    </span>
  );
}
