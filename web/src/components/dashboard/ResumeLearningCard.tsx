"use client";

/* ------------------------------------------------------------------
   ResumeLearningCard — "pick up where you left off" on `/`.

   Rendered above the "What do you want to learn?" header on the home
   page. Reads two umbrella-scoped stores:

     - lastVisitStore (this file's source of truth) for which pack /
       section / concept the learner was last on, and the exact href
       to jump back to.
     - The per-pack progressStore for that pack — to surface a
       streak chip, mastery progress, and the next-up concept so the
       jump-back card feels alive rather than a static bookmark.

   Engagement scaffolding (the "addictive learning" requirement):
     - Streak chip with at-risk language if today is not yet logged.
     - Next-up preview: the very next concept the recommendation
       engine would surface, shown as a secondary CTA so the learner
       sees concrete forward motion.
     - Time-since label ("Yesterday", "2 days ago") to nudge dormant
       returners.
     - Comeback streak-shield message when the streak is about to
       break (studied yesterday, not today, returning now).
     - Dismiss control so a learner can still see the picker headers
       below without scrolling past a sticky banner.

   Hydration: server snapshot is null so the card never renders on
   the server (it depends on localStorage). Once the client mounts,
   it reads the saved record and renders.
------------------------------------------------------------------ */

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  X,
  Trophy,
  Clock,
  ShieldAlert,
  ListChecks,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { lastVisitStore, type LastVisit } from "@/lib/last-visit";
import { getProgressStore } from "@/lib/progress-store";
import { getPack } from "@/content/pack-registry";
import { computeStreak, type StreakSummary } from "@/lib/streak";
import { recommendForPack, type Recommendation } from "@/lib/recommendation";
import { copyFor } from "@/lib/pack-helpers";
import { countsAsMastered } from "@/lib/progress";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import type { ContentPack } from "@/content/pack-types";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function relativeDays(ts: number, now: number): string {
  const diff = now - ts;
  if (diff < 60_000) return "Just now";
  if (diff < ONE_DAY_MS) {
    const h = Math.max(1, Math.round(diff / (60 * 60 * 1000)));
    return `${h} hour${h === 1 ? "" : "s"} ago`;
  }
  const days = Math.round(diff / ONE_DAY_MS);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const w = Math.round(days / 7);
    return `${w} week${w === 1 ? "" : "s"} ago`;
  }
  return `${Math.round(days / 30)} month${days < 60 ? "" : "s"} ago`;
}

function progressSummary(
  pack: ContentPack,
  packProgress: ReturnType<ReturnType<typeof getProgressStore>["get"]>
): { mastered: number; total: number; pct: number } {
  const all = pack.curriculum.sections.flatMap((s) => s.concepts);
  const total = all.length;
  const mastered = all.filter((c) =>
    countsAsMastered(packProgress.concept[c.id]?.mastery ?? 0)
  ).length;
  return {
    mastered,
    total,
    pct: total > 0 ? Math.round((mastered / total) * 100) : 0,
  };
}

/**
 * Per-pack "next up" preview. The home page lives outside any
 * [packId] PackContext, so we feed the recommendation engine the
 * pack-shaped object we already loaded.
 */
function nextUpFor(
  pack: ContentPack,
  packProgress: ReturnType<ReturnType<typeof getProgressStore>["get"]>
): Recommendation {
  const copy = copyFor(pack);
  return recommendForPack(packProgress, pack, copy, pack.config.id);
}

function streakMessage(streak: StreakSummary): {
  tone: "good" | "warn" | "neutral";
  text: string;
  Icon: typeof Flame | typeof ShieldAlert;
} {
  if (streak.current === 0) {
    return {
      tone: "neutral",
      text: "Start a streak today — even 5 minutes counts.",
      Icon: Flame,
    };
  }
  if (streak.studiedToday) {
    return {
      tone: "good",
      text: `${streak.current}-day streak · today complete`,
      Icon: Flame,
    };
  }
  // Studied at some point recently but not today.
  return {
    tone: "warn",
    text: `${streak.current}-day streak at risk — log one quiz to save it.`,
    Icon: ShieldAlert,
  };
}

export function ResumeLearningCard() {
  const hydrated = useHydrated();
  const last = useSyncExternalStore<LastVisit | null>(
    lastVisitStore.subscribe,
    lastVisitStore.get,
    lastVisitStore.getServerSnapshot
  );

  // Resolve pack + per-pack progress only after we have a last-visit
  // record. Hooks must be called unconditionally though, so we
  // memoise on the (possibly null) packId.
  const packId = last?.packId ?? null;

  // Per-pack progressStore so we read the *correct* pack's stored
  // progress, not the env-var default pack. `useMemo` keeps the
  // identity stable per packId so useSyncExternalStore doesn't
  // resubscribe on every render.
  const store = useMemo(
    () => (packId ? getProgressStore(packId) : null),
    [packId]
  );
  const packProgress = useSyncExternalStore(
    store ? store.subscribe : noopSubscribe,
    store ? store.get : noopSnapshot,
    store ? store.getServerSnapshot : noopSnapshot
  );

  const pack = useMemo(
    () => (packId ? getPack(packId) : null),
    [packId]
  );

  const streak = useMemo(
    () => (packProgress ? computeStreak(packProgress) : null),
    [packProgress]
  );
  const summary = useMemo(
    () =>
      pack && packProgress ? progressSummary(pack, packProgress) : null,
    [pack, packProgress]
  );
  const nextUp = useMemo(
    () => (pack && packProgress ? nextUpFor(pack, packProgress) : null),
    [pack, packProgress]
  );

  // `now` is read inside an effect (not during render) so the "X
  // hours ago" label stays pure — see the
  // `react-hooks/purity` rule (Date.now is impure). We refresh every
  // 60s so the label moves from "Just now" to "1 minute ago" without
  // a route change.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  if (!hydrated || !last || !pack || now === null) return null;

  const visitedLabel = relativeDays(last.visitedAt, now);
  const isDeepLink = Boolean(last.conceptId || last.sectionId);
  // The exact label depends on how deep the learner was — "Continue
  // lesson" feels concrete, vs "Open journey" feels vague.
  const continueLabel = last.conceptTitle
    ? `Resume: ${last.conceptTitle}`
    : last.sectionTitle
      ? `Resume: ${last.sectionTitle}`
      : `Resume: ${last.packName}`;

  const streakUI = streak ? streakMessage(streak) : null;
  // Only surface the next-up CTA when it points somewhere *different*
  // from the resume target — otherwise we'd render the same href
  // twice and confuse the learner.
  const showNextUp =
    nextUp && nextUp.kind !== "done" && nextUp.href !== last.href;

  return (
    <Card
      tone="accent"
      aria-labelledby="resume-heading"
      className="flex flex-col gap-4 bg-(--panel-2)"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
            Welcome back
          </p>
          <h2
            id="resume-heading"
            className="mt-1 font-[family-name:var(--font-display)] text-xl md:text-2xl font-semibold text-(--ink)"
          >
            Pick up where you left off
          </h2>
          <p className="mt-1 text-sm text-(--muted)">
            <span className="font-medium text-(--ink)">{last.packName}</span>
            {last.sectionTitle ? (
              <>
                {" · "}
                <span>{last.sectionTitle}</span>
              </>
            ) : null}
            {last.conceptTitle ? (
              <>
                {" · "}
                <span className="italic">{last.conceptTitle}</span>
              </>
            ) : null}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-(--muted)">
            <Clock aria-hidden className="h-3 w-3" />
            <span>Last visit: {visitedLabel}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => lastVisitStore.clear()}
          aria-label="Dismiss resume card"
          className="rounded-md p-2 text-(--muted) hover:bg-(--panel) hover:text-(--ink)"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </header>

      {summary && summary.total > 0 ? (
        <div aria-label="Journey progress">
          <div className="mb-1 flex items-center justify-between text-xs text-(--muted)">
            <span>
              <strong className="text-(--ink)">
                {summary.mastered} of {summary.total}
              </strong>{" "}
              concepts mastered
            </span>
            <span className="font-mono">{summary.pct}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={summary.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 w-full overflow-hidden rounded-full bg-(--panel)"
          >
            <div
              className="h-full bg-(--accent) transition-[width] duration-300 ease-out"
              style={{ width: `${summary.pct}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={last.href}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "no-underline"
          )}
          aria-label={continueLabel}
        >
          {isDeepLink ? "Continue learning" : "Open journey"}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        {showNextUp ? (
          <Link
            href={nextUp.href}
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "no-underline"
            )}
            aria-label={`Next up: ${nextUp.why}`}
          >
            <ListChecks aria-hidden className="h-4 w-4" />
            Next up
          </Link>
        ) : null}
        <Link
          href={`/${pack.config.id}`}
          className="text-xs text-(--muted) underline-offset-4 hover:text-(--ink) hover:underline"
        >
          Journey overview
        </Link>
      </div>

      {streakUI ? (
        <div
          className={cn(
            "inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs",
            streakUI.tone === "good" &&
              "border-(--good)/40 bg-(--good)/10 text-(--good)",
            streakUI.tone === "warn" &&
              "border-(--warn)/40 bg-(--warn)/10 text-(--warn)",
            streakUI.tone === "neutral" &&
              "border-(--border) bg-(--panel) text-(--muted)"
          )}
        >
          <streakUI.Icon aria-hidden className="h-3.5 w-3.5" />
          <span>{streakUI.text}</span>
        </div>
      ) : null}

      {summary && summary.pct >= 80 && summary.pct < 100 ? (
        <p className="flex items-start gap-2 rounded-md bg-(--panel) p-3 text-xs text-(--muted)">
          <Trophy aria-hidden className="mt-0.5 h-4 w-4 flex-none text-(--accent-2)" />
          <span>
            You&apos;re{" "}
            <strong className="text-(--ink)">{100 - summary.pct}%</strong> from
            finishing this journey. Closing it out unlocks the badge.
          </span>
        </p>
      ) : null}
    </Card>
  );
}

// Stable no-op store callbacks used when there's no resolved
// per-pack store yet (last-visit hasn't loaded). Returning the same
// `null` snapshot every call keeps `useSyncExternalStore` happy in
// strict mode — a fresh literal each call trips React 19's "snapshot
// differed" warning that broke `useHydrated` in PR #20.
function noopSubscribe(): () => void {
  return () => {};
}
function noopSnapshot(): null {
  return null;
}
