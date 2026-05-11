"use client";

import { useMemo } from "react";
import { useProgress } from "@/hooks/useProgress";
import { usePack } from "@/content/pack-context";
import { useCopy } from "@/content/pack-hooks";
import { countsAsMastered } from "@/lib/progress";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Target, Trophy, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

/* Rough per-concept time-on-task heuristic. The shell has no
   authored time estimates per concept, so we approximate from the
   reality of the average pack: ~12 minutes to read the canonical
   lesson, ~5 minutes per quiz attempt, ~10 minutes for a section
   test, ~30 minutes for a mock exam. Real PMP candidates often
   spend more — the chart is a *minimum credible* effort, not a cap. */
const MINUTES_PER_CONCEPT = 17; // lesson + first quiz attempt
const MINUTES_PER_SECTION_TEST = 10;
const MINUTES_PER_MOCK_EXAM = 30;

function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

/**
 * Renders three small charts that together answer the learner's
 * "how far in / how far to go?" question:
 *
 *   1. Donut chart of overall concept mastery (mastered vs touched
 *      vs untouched).
 *   2. Per-section horizontal stacked bars (mastered / in-progress /
 *      not started), so the learner can see which section is
 *      pulling the average down.
 *   3. Time-remaining estimate (sum of unstarted concepts +
 *      remaining section tests + remaining mocks) in human-readable
 *      hours. Calibrated as a credible minimum, not a cap.
 *
 * All visuals are inline SVG + CSS — no chart library — so the
 * bundle stays small and tokens flow through the pack theme.
 */
export function ProgressCharts({ className }: { className?: string }) {
  const { progress, hydrated, conceptMastery, sectionComplete } = useProgress();
  const pack = usePack();
  const copy = useCopy();
  const curriculum = pack.curriculum;

  const stats = useMemo(() => {
    const sections = curriculum.sections;
    const sectionStats = sections.map((s) => {
      const total = s.concepts.length;
      let mastered = 0;
      let touched = 0;
      for (const c of s.concepts) {
        const m = hydrated ? conceptMastery(c.id) : 0;
        if (countsAsMastered(m)) mastered++;
        else if (m > 0) touched++;
      }
      return {
        id: s.id,
        n: s.n,
        title: s.title,
        total,
        mastered,
        touched,
        notStarted: total - mastered - touched,
        complete: hydrated && sectionComplete(s.id),
      };
    });

    const totalConcepts = sectionStats.reduce((sum, s) => sum + s.total, 0);
    const totalMastered = sectionStats.reduce((sum, s) => sum + s.mastered, 0);
    const totalTouched = sectionStats.reduce((sum, s) => sum + s.touched, 0);
    const totalUntouched = totalConcepts - totalMastered - totalTouched;

    const mocks = curriculum.mockExams ?? [];
    const mocksAttempted = mocks.filter(
      (m) => (progress.mock[m.id]?.attempts ?? []).length > 0
    ).length;
    const mocksRemaining = mocks.length - mocksAttempted;

    const sectionTests = sections.filter((s) => s.sectionTest).length;
    const sectionTestsTaken = sections.filter(
      (s) => (progress.section[s.id]?.testAttempts ?? []).length > 0
    ).length;
    const sectionTestsRemaining = sectionTests - sectionTestsTaken;

    // Remaining time: each untouched concept costs the full estimate;
    // each touched-but-not-mastered concept costs half (we assume the
    // learner has done some work but needs to come back for mastery);
    // mastered concepts cost zero.
    const remainingMinutes =
      totalUntouched * MINUTES_PER_CONCEPT +
      Math.round(totalTouched * MINUTES_PER_CONCEPT * 0.5) +
      sectionTestsRemaining * MINUTES_PER_SECTION_TEST +
      mocksRemaining * MINUTES_PER_MOCK_EXAM;

    const elapsedMinutes =
      totalMastered * MINUTES_PER_CONCEPT +
      Math.round(totalTouched * MINUTES_PER_CONCEPT * 0.5) +
      sectionTestsTaken * MINUTES_PER_SECTION_TEST +
      mocksAttempted * MINUTES_PER_MOCK_EXAM;

    const totalMinutes = elapsedMinutes + remainingMinutes;
    const pctComplete =
      totalMinutes > 0
        ? Math.round((elapsedMinutes / totalMinutes) * 100)
        : 0;

    return {
      sections: sectionStats,
      totalConcepts,
      totalMastered,
      totalTouched,
      totalUntouched,
      sectionsComplete: sectionStats.filter((s) => s.complete).length,
      totalSections: sections.length,
      mocksAttempted,
      mocksRemaining,
      totalMocks: mocks.length,
      remainingMinutes,
      elapsedMinutes,
      pctComplete,
    };
  }, [curriculum, progress, hydrated, conceptMastery, sectionComplete]);

  return (
    <Card
      aria-label="Progress at a glance"
      className={cn("flex flex-col gap-5 p-5", className)}
    >
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--accent-2)">
          <BarChart3 className="h-4 w-4" aria-hidden />
          Progress at a glance
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        <MasteryDonut
          mastered={stats.totalMastered}
          touched={stats.totalTouched}
          untouched={stats.totalUntouched}
          conceptsMasteredLabel={copy.conceptsMasteredLabel}
        />
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
          <StatTile
            Icon={Target}
            label={copy.conceptsMasteredLabel}
            value={`${stats.totalMastered}/${stats.totalConcepts}`}
            sub={`${stats.totalTouched} in progress`}
          />
          <StatTile
            Icon={Trophy}
            label={copy.sectionsCompleteLabel}
            value={`${stats.sectionsComplete}/${stats.totalSections}`}
            sub={
              stats.totalMocks > 0
                ? `${stats.mocksAttempted}/${stats.totalMocks} ${copy.mockExamsHeading.toLowerCase()}`
                : undefined
            }
          />
          <StatTile
            Icon={Clock}
            label="Time remaining"
            value={formatMinutes(stats.remainingMinutes)}
            sub={
              stats.elapsedMinutes > 0
                ? `~${formatMinutes(stats.elapsedMinutes)} done · ${stats.pctComplete}%`
                : "credible minimum estimate"
            }
          />
        </dl>
      </div>

      <section aria-label="Per-section mastery">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--muted)">
          Per-section breakdown
        </h3>
        <ul className="flex flex-col gap-2">
          {stats.sections.map((s) => (
            <li key={s.id}>
              <SectionBar
                label={`Section ${s.n}: ${s.title}`}
                mastered={s.mastered}
                touched={s.touched}
                notStarted={s.notStarted}
                total={s.total}
              />
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-(--muted)">
        Time estimate is a credible minimum: ~{MINUTES_PER_CONCEPT} min per
        concept (lesson + first quiz), {MINUTES_PER_SECTION_TEST} min per
        section test, {MINUTES_PER_MOCK_EXAM} min per mock exam. Most learners
        end up at 1.5–2× this — budget headroom.
      </p>
    </Card>
  );
}

function MasteryDonut({
  mastered,
  touched,
  untouched,
  conceptsMasteredLabel,
}: {
  mastered: number;
  touched: number;
  untouched: number;
  conceptsMasteredLabel: string;
}) {
  const total = mastered + touched + untouched;
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  // Donut geometry — circumference 2πr with r=42 (in a 100×100 viewBox)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const masteredLen = total === 0 ? 0 : (mastered / total) * circumference;
  const touchedLen = total === 0 ? 0 : (touched / total) * circumference;
  return (
    <div className="flex items-center gap-4">
      <svg
        viewBox="0 0 100 100"
        className="h-32 w-32 flex-none -rotate-90"
        role="img"
        aria-label={`${pct}% ${conceptsMasteredLabel.toLowerCase()} (${mastered} of ${total})`}
      >
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--panel-2)"
          strokeWidth="12"
        />
        {/* Touched (lighter accent) — drawn first underneath mastered */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--accent-2)"
          strokeOpacity="0.45"
          strokeWidth="12"
          strokeLinecap="butt"
          strokeDasharray={`${touchedLen + masteredLen} ${circumference - touchedLen - masteredLen}`}
        />
        {/* Mastered */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="12"
          strokeLinecap="butt"
          strokeDasharray={`${masteredLen} ${circumference - masteredLen}`}
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-[family-name:var(--font-display)] text-3xl font-semibold text-(--ink)">
          {pct}%
        </span>
        <span className="text-xs text-(--muted)">
          {conceptsMasteredLabel.toLowerCase()}
        </span>
        <ul className="mt-2 flex flex-col gap-0.5 text-[11px] text-(--muted)">
          <Legend color="var(--accent)" label={`${mastered} mastered`} />
          <Legend
            color="var(--accent-2)"
            label={`${touched} in progress`}
            opacity={0.45}
          />
          <Legend color="var(--panel-2)" label={`${untouched} not started`} />
        </ul>
      </div>
    </div>
  );
}

function Legend({
  color,
  label,
  opacity = 1,
}: {
  color: string;
  label: string;
  opacity?: number;
}) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="inline-block h-2 w-2 flex-none rounded-sm"
        style={{ background: color, opacity }}
      />
      {label}
    </li>
  );
}

function StatTile({
  Icon,
  label,
  value,
  sub,
}: {
  Icon: typeof Target;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border border-(--border) bg-(--panel-2) p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-(--muted)">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <div className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)">
        {value}
      </div>
      {sub ? (
        <div className="mt-0.5 text-[11px] text-(--muted)">{sub}</div>
      ) : null}
    </div>
  );
}

function SectionBar({
  label,
  mastered,
  touched,
  notStarted,
  total,
}: {
  label: string;
  mastered: number;
  touched: number;
  notStarted: number;
  total: number;
}) {
  const masteredPct = total === 0 ? 0 : (mastered / total) * 100;
  const touchedPct = total === 0 ? 0 : (touched / total) * 100;
  const notStartedPct = 100 - masteredPct - touchedPct;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="truncate text-(--ink)">{label}</span>
        <span className="flex-none font-mono text-(--muted)">
          {mastered}/{total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={mastered}
        aria-label={`${label} mastery: ${mastered} of ${total} mastered, ${touched} in progress, ${notStarted} not started`}
        className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-(--panel-2)"
      >
        <span
          aria-hidden
          className="block h-full bg-(--accent)"
          style={{ width: `${masteredPct}%` }}
        />
        <span
          aria-hidden
          className="block h-full bg-(--accent-2)"
          style={{ width: `${touchedPct}%`, opacity: 0.45 }}
        />
        <span
          aria-hidden
          className="block h-full"
          style={{ width: `${notStartedPct}%` }}
        />
      </div>
    </div>
  );
}
