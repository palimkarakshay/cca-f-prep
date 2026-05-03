"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Flame } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { recommend } from "@/lib/recommendation";
import { computeStreak } from "@/lib/streak";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/primitives/Skeleton";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = {
  drill: "Drill",
  "section-test": "Section test",
  lesson: "Continue — read lesson",
  quiz: "Continue — take quiz",
  done: "All caught up",
};

const KIND_TITLE: Record<string, string> = {
  drill: "Re-take a missed concept",
  "section-test": "Section test ready",
  lesson: "Read the next lesson",
  quiz: "Take the next quiz",
  done: "All authored content complete",
};

export function RecommendationBanner() {
  const { progress, hydrated } = useProgress();
  const reco = useMemo(() => recommend(progress), [progress]);
  const streak = useMemo(() => computeStreak(progress), [progress]);

  if (!hydrated) {
    return (
      <Card
        tone="accent"
        className="bg-(--panel-2) p-6 md:p-8"
        role="status"
        aria-busy="true"
        aria-label="Loading recommendation"
      >
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-7 w-3/4" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-5 h-12 w-32" />
      </Card>
    );
  }

  return (
    <Card tone="accent" className="bg-(--panel-2) p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
            Recommended next · {KIND_LABEL[reco.kind] ?? "Next"}
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
            {KIND_TITLE[reco.kind] ?? "Next step"}
          </h2>
          <p className="mt-2 max-w-prose text-sm md:text-base text-(--muted)">
            {reco.why}
          </p>
        </div>
        {reco.kind !== "done" ? (
          <Link
            href={reco.href}
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "no-underline w-full md:w-auto"
            )}
          >
            Continue
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        ) : null}
      </div>

      {streak.current > 0 ? (
        <div
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--panel) px-3 py-1.5 text-xs"
          aria-label={`Study streak: ${streak.current} day${streak.current === 1 ? "" : "s"}${streak.studiedToday ? ", today complete" : ", study today to keep it"}`}
        >
          <Flame className="h-3.5 w-3.5 text-(--accent-2)" aria-hidden />
          <span className="text-(--muted)">
            <strong className="font-semibold text-(--ink)">
              {streak.current}-day
            </strong>{" "}
            study streak
            {streak.studiedToday ? (
              <span className="text-(--good)"> · today complete</span>
            ) : (
              <span> · study today to keep it</span>
            )}
          </span>
        </div>
      ) : null}
    </Card>
  );
}
