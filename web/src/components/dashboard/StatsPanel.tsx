"use client";

import { useMemo } from "react";
import { Flame, Target, BookOpenCheck, Trophy } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { computeStreak } from "@/lib/streak";
import { useCopy } from "@/content/pack-hooks";
import { usePack } from "@/content/pack-context";
import { countsAsMastered } from "@/lib/progress";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Curriculum } from "@/content/curriculum-types";
import type { PackCopy } from "@/content/pack-types";

interface Stat {
  label: string;
  value: string;
  sub?: string;
  Icon: LucideIcon;
}

function buildStats(
  progress: ReturnType<typeof useProgress>["progress"],
  curriculum: Curriculum,
  copy: Required<PackCopy>
): Stat[] {
  const allConcepts = curriculum.sections.flatMap((s) => s.concepts);
  const totalConcepts = allConcepts.length;
  const mastered = allConcepts.filter((c) =>
    countsAsMastered(progress.concept[c.id]?.mastery ?? 0)
  ).length;

  const totalSections = curriculum.sections.length;
  const completeSections = curriculum.sections.filter(
    (s) => progress.section[s.id]?.complete
  ).length;

  const mocks = curriculum.mockExams ?? [];
  let bestMockPct = 0;
  for (const m of mocks) {
    const attempts = progress.mock[m.id]?.attempts ?? [];
    for (const a of attempts) {
      const pct = a.total > 0 ? a.score / a.total : 0;
      if (pct > bestMockPct) bestMockPct = pct;
    }
  }

  const streak = computeStreak(progress);

  return [
    {
      label: copy.studyStreakLabel,
      value:
        streak.current > 0 ? `${streak.current} day${streak.current === 1 ? "" : "s"}` : "—",
      sub: streak.studiedToday
        ? "today complete"
        : streak.current > 0
          ? "study today to keep it"
          : "start a new streak today",
      Icon: Flame,
    },
    {
      label: copy.conceptsMasteredLabel,
      value: `${mastered} / ${totalConcepts}`,
      sub: totalConcepts > 0 ? `${Math.round((mastered / totalConcepts) * 100)}%` : undefined,
      Icon: Target,
    },
    {
      label: copy.sectionsCompleteLabel,
      value: `${completeSections} / ${totalSections}`,
      Icon: BookOpenCheck,
    },
    {
      label: copy.bestMockScoreLabel,
      value: bestMockPct > 0 ? `${Math.round(bestMockPct * 100)}%` : "—",
      sub:
        mocks.length === 0
          ? "none authored"
          : bestMockPct === 0
            ? "not yet attempted"
            : undefined,
      Icon: Trophy,
    },
  ];
}

export function StatsPanel({ className }: { className?: string }) {
  const { progress, hydrated } = useProgress();
  const pack = usePack();
  const copy = useCopy();
  const stats = useMemo(
    () => buildStats(progress, pack.curriculum, copy),
    [progress, pack, copy]
  );

  return (
    <Card
      id="progress"
      aria-label="Your progress"
      className={cn("scroll-mt-24", className)}
    >
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-(--accent-2)">
          Your progress
        </CardTitle>
      </CardHeader>
      <ul className="flex flex-col gap-4">
        {stats.map((s) => (
          <li key={s.label} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-md bg-(--panel-2) text-(--accent-2)"
            >
              <s.Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs uppercase tracking-wide text-(--muted)">
                {s.label}
              </div>
              <div className="mt-0.5 text-lg font-semibold text-(--ink)">
                {hydrated ? s.value : "—"}
              </div>
              {s.sub ? (
                <div className="mt-0.5 text-xs text-(--muted)">{s.sub}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
