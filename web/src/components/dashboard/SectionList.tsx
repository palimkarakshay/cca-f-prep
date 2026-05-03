"use client";

import Link from "next/link";
import { CURRICULUM } from "@/content/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { MasteryBadge } from "@/components/primitives/MasteryBadge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SectionList() {
  const { progress, hydrated, conceptMastery, sectionUnlocked, sectionComplete } =
    useProgress();

  return (
    <div className="flex flex-col gap-4">
      {CURRICULUM.sections.map((section) => {
        const unlocked = !hydrated || sectionUnlocked(section.id);
        const complete = hydrated && sectionComplete(section.id);
        const lastTest =
          progress.section[section.id]?.testAttempts.slice(-1)[0] ?? null;

        return (
          <Card
            key={section.id}
            className={cn("p-5", !unlocked && "opacity-55")}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-(--muted)">
                {String(section.n).padStart(2, "0")}.
              </span>
              <Link
                href={`/section/${section.id}`}
                className="text-base font-semibold text-(--ink) no-underline hover:underline"
              >
                {section.title}
              </Link>
              <span
                className={cn(
                  "ml-auto text-[11px] uppercase tracking-wide",
                  complete
                    ? "text-(--good)"
                    : unlocked
                      ? "text-(--muted)"
                      : "text-(--warn)"
                )}
              >
                {complete ? "Complete" : unlocked ? "In progress" : "Locked"}
              </span>
            </div>
            <p className="mt-1 text-sm text-(--muted)">{section.blurb}</p>

            <ul className="mt-3 flex flex-col gap-1">
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
                    <span className="rounded-full border border-(--border) px-2 py-0.5 text-[10px] text-(--muted)">
                      {c.bloom}
                    </span>
                    <MasteryBadge mastery={m} />
                  </span>
                );
                if (disabled) {
                  return (
                    <li
                      key={c.id}
                      aria-disabled
                      className="flex cursor-not-allowed items-center gap-3 rounded-md border border-transparent px-2 py-2 opacity-55"
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

            {section.sectionTest ? (
              <div
                className={cn(
                  "mt-3 rounded-md border border-dashed px-3 py-2 text-sm",
                  unlocked && hydrated
                    ? "border-(--accent)/50 text-(--ink)"
                    : "border-(--border) text-(--muted)"
                )}
              >
                Section test ·{" "}
                {section.sectionTest.questions.length} questions ·{" "}
                {Math.round((section.sectionTest.passPct ?? 0.7) * 100)}% pass
                {lastTest ? (
                  <>
                    {" "}
                    · last attempt {lastTest.score}/{lastTest.total}
                  </>
                ) : null}
              </div>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2 border-t border-dashed border-(--border) pt-3">
              <Link
                href={`/section/${section.id}`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "no-underline"
                )}
              >
                Open section
              </Link>
              {section.sectionTest && unlocked ? (
                <Link
                  href={`/section/${section.id}/test`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "no-underline"
                  )}
                >
                  {lastTest ? "Re-take section test" : "Take section test"}
                </Link>
              ) : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
