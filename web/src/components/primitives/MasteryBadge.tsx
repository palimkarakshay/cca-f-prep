"use client";

import { cn } from "@/lib/utils";
import { masteryLabel, masteryTone } from "@/content/curriculum-loader";
import type { Mastery } from "@/lib/progress-types";

// Tone → tailwind class. The four tones are pack-overridable via
// `MasteryLevel.tone`. Unknown / missing tones fall back to neutral.
const TONE_CLASS: Record<"good" | "warn" | "bad" | "neutral", string> = {
  good: "text-(--good) border-(--good)/50",
  warn: "text-(--warn) border-(--warn)/50",
  bad: "text-(--bad) border-(--bad)/50",
  neutral: "text-(--muted) border-(--border)",
};

export function MasteryBadge({
  mastery,
  className,
}: {
  mastery: Mastery;
  className?: string;
}) {
  const label = masteryLabel(mastery);
  const tone = masteryTone(mastery);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        TONE_CLASS[tone],
        className
      )}
      aria-label={`Mastery: ${label}`}
    >
      {label}
    </span>
  );
}
