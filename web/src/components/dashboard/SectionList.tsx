"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { MasteryMeter } from "@/components/primitives/MasteryMeter";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useCopy, usePackId } from "@/content/pack-hooks";
import { usePack } from "@/content/pack-context";
import { countsAsMastered } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function SectionList() {
  const { progress, hydrated, conceptMastery, sectionUnlocked, sectionComplete } =
    useProgress();
  const pack = usePack();
  const packId = usePackId();
  const copy = useCopy();
  const CURRICULUM = pack.curriculum;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {CURRICULUM.sections.map((section) => {
        const unlocked = !hydrated || sectionUnlocked(section.id);
        const complete = hydrated && sectionComplete(section.id);
        const lastTest =
          progress.section[section.id]?.testAttempts.slice(-1)[0] ?? null;

        const total = section.concepts.length;
        const mastered = hydrated
          ? section.concepts.filter((c) => countsAsMastered(conceptMastery(c.id))).length
          : 0;
        const masteredPct = total === 0 ? 0 : Math.round((mastered / total) * 100);

        return (
          <Card
            key={section.id}
            tone={complete ? "good" : unlocked ? "default" : "warn"}
            // Locked state: warn-tone left border + faded panel background
            // (no opacity — opacity-60 nukes WCAG AA text contrast on the
            // text inside the locked card; the warn tone + "Locked" badge
            // communicates state visually without sacrificing contrast).
            className={cn(
              "flex flex-col gap-3 p-5",
              !unlocked && "bg-(--panel-2)"
            )}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-(--muted)">
                {String(section.n).padStart(2, "0")}.
              </span>
              <Link
                href={`/${packId}/section/${section.id}`}
                className="text-base font-semibold text-(--ink) no-underline hover:underline"
              >
                {section.title}
              </Link>
              <span
                className={cn(
                  "ml-auto rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  complete
                    ? "border-(--good)/40 bg-(--good)/10 text-(--good)"
                    : unlocked
                      ? "border-(--border) text-(--muted)"
                      : "border-(--warn)/40 text-(--warn)"
                )}
              >
                {complete ? "Complete" : unlocked ? "In progress" : "Locked"}
              </span>
            </div>
            <p className="text-sm text-(--muted)">{section.blurb}</p>

            {/* Aggregate progress bar — uses copy.conceptsMasteredLabel. */}
            <div>
              <div className="flex items-baseline justify-between text-xs text-(--muted)">
                <span>
                  {hydrated ? mastered : 0} / {total}{" "}
                  {copy.conceptsMasteredLabel.toLowerCase()}
                </span>
                <span>{hydrated ? `${masteredPct}%` : ""}</span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={hydrated ? mastered : 0}
                aria-label={`${section.title} ${copy.conceptsMasteredLabel.toLowerCase()}`}
                className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-(--panel-2)"
              >
                <div
                  className="h-full bg-(--accent) transition-all"
                  style={{ width: `${masteredPct}%` }}
                />
              </div>
            </div>

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
                    <span className="flex-1 truncate text-sm">{c.title}</span>
                    {c.bloom ? (
                      <span className="rounded-full border border-(--border) px-2 py-0.5 text-[10px] text-(--muted)">
                        {c.bloom}
                      </span>
                    ) : null}
                    <MasteryMeter mastery={m} />
                  </span>
                );
                if (disabled) {
                  return (
                    <li
                      key={c.id}
                      // No opacity — kills text contrast. The locked Card
                      // tone + "Locked" status badge already convey state.
                      className="flex cursor-not-allowed items-center gap-3 rounded-md border border-transparent px-2 py-2"
                    >
                      {inner}
                    </li>
                  );
                }
                return (
                  <li key={c.id}>
                    <Link
                      href={`/${packId}/concept/${section.id}/${c.id}`}
                      className="flex items-center gap-3 rounded-md border border-transparent px-2 py-2 no-underline hover:border-(--border) hover:bg-(--panel-2)"
                    >
                      {inner}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {section.sectionTest ? (
              <div
                className={cn(
                  "rounded-md border border-dashed px-3 py-2 text-xs",
                  unlocked && hydrated
                    ? "border-(--accent)/50 text-(--ink)"
                    : "border-(--border) text-(--muted)"
                )}
              >
                {copy.sectionTestSingular} ·{" "}
                {section.sectionTest.questions.length} questions ·{" "}
                {Math.round((section.sectionTest.passPct ?? 0.7) * 100)}% {copy.passLabel}
                {lastTest ? (
                  <>
                    {" "}
                    · last attempt {lastTest.score}/{lastTest.total}
                  </>
                ) : null}
              </div>
            ) : null}

            <div className="mt-auto flex flex-wrap gap-2 border-t border-dashed border-(--border) pt-3">
              <Link
                href={`/${packId}/section/${section.id}`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "no-underline"
                )}
              >
                Open section
              </Link>
              {section.sectionTest && unlocked ? (
                <Link
                  href={`/${packId}/section/${section.id}/test`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "no-underline"
                  )}
                >
                  {lastTest
                    ? `Re-take ${copy.sectionTestSingular.toLowerCase()}`
                    : `Take ${copy.sectionTestSingular.toLowerCase()}`}
                </Link>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
