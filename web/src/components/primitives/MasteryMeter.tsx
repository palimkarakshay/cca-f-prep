"use client";

import { cn } from "@/lib/utils";
import { masteryLabel } from "@/content/curriculum-loader";
import type { Mastery } from "@/lib/progress-types";

const STEPS: Mastery[] = [1, 2, 3, 4];

const FILL_TONE: Record<Mastery, string> = {
  0: "bg-(--border)",
  1: "bg-(--warn)",
  2: "bg-(--bad)",
  3: "bg-(--good)",
  4: "bg-(--good)",
};

/**
 * 4-dot inline meter showing concept mastery 0..4. Pairs a textual label
 * (sr-only) with the visual meter so screen readers always read the level.
 */
export function MasteryMeter({
  mastery,
  className,
}: {
  mastery: Mastery;
  className?: string;
}) {
  const fillTone = FILL_TONE[mastery];
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`Mastery: ${masteryLabel(mastery)} (${mastery} of 4)`}
    >
      {STEPS.map((step) => (
        <span
          key={step}
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors",
            mastery >= step ? fillTone : "bg-(--border)"
          )}
        />
      ))}
    </span>
  );
}
