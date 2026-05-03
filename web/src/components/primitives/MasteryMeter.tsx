"use client";

import { cn } from "@/lib/utils";
import { masteryLabel, masteryTone } from "@/content/curriculum-loader";
import { masteryLevels } from "@/lib/site-config";
import type { Mastery } from "@/lib/progress-types";

const TONE_FILL: Record<"good" | "warn" | "bad" | "neutral", string> = {
  good: "bg-(--good)",
  warn: "bg-(--warn)",
  bad: "bg-(--bad)",
  neutral: "bg-(--border)",
};

/**
 * Inline N-dot meter where N = (number of mastery levels) - 1.
 * Pairs a textual label (sr-only) with the visual meter so screen
 * readers always read the level. Tone of filled dots is driven by
 * the active pack's mastery level definitions.
 */
export function MasteryMeter({
  mastery,
  className,
}: {
  mastery: Mastery;
  className?: string;
}) {
  const max = Math.max(0, masteryLevels.length - 1);
  const fillTone = TONE_FILL[masteryTone(mastery)];
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`Mastery: ${masteryLabel(mastery)} (${mastery} of ${max})`}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((step) => (
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
