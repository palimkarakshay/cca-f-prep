"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { QuizRunner } from "./QuizRunner";
import { getAdjacentSectionsFrom } from "@/content/curriculum-loader";
import { useCopy, usePackId } from "@/content/pack-hooks";
import { usePack } from "@/content/pack-context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section } from "@/content/curriculum-types";
import type { CurrentAttempt, QuizAttempt } from "@/lib/progress-types";

export function SectionTestPage({ section }: { section: Section }) {
  const {
    progress,
    hydrated,
    recordSectionTestAttempt,
    setSectionCurrentAttempt,
    sectionTestReady,
  } = useProgress();
  const pack = usePack();
  const packId = usePackId();
  const copy = useCopy();

  const onCheckpoint = useCallback(
    (attempt: CurrentAttempt | null) => {
      setSectionCurrentAttempt(section.id, attempt);
    },
    [section.id, setSectionCurrentAttempt]
  );

  const onComplete = useCallback(
    (attempt: QuizAttempt) => {
      recordSectionTestAttempt(section.id, attempt);
    },
    [section.id, recordSectionTestAttempt]
  );

  if (!hydrated) return <p className="text-sm text-(--muted)">Loading…</p>;
  if (!section.sectionTest) {
    return (
      <p className="rounded-r-md border-l-4 border-(--warn) bg-(--warn)/10 p-4 text-sm">
        {copy.sectionTestSingular} not yet authored for this module.
      </p>
    );
  }

  if (!sectionTestReady(section.id)) {
    return (
      <section
        aria-label={`${copy.sectionTestSingular} locked`}
        className="flex flex-col gap-3 rounded-r-md border-l-4 border-(--warn) bg-(--warn)/10 p-4"
      >
        <h1 className="flex items-center gap-2 text-base font-semibold text-(--ink)">
          <Lock aria-hidden className="h-4 w-4 text-(--warn)" />
          {copy.sectionTestSingular} locked
        </h1>
        <p className="text-sm text-(--ink)">
          Read every lesson in <strong>{section.title}</strong> first. The
          test unlocks once the conceptual material has been worked
          through — it isn't gated on the previous module.
        </p>
        <Link
          href={`/${packId}/section/${section.id}`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "self-start no-underline"
          )}
        >
          Back to module
        </Link>
      </section>
    );
  }

  const passPct = section.sectionTest.passPct ?? 0.7;
  const resume = progress.section[section.id]?.currentTestAttempt ?? null;
  const { prev, next } = getAdjacentSectionsFrom(pack.curriculum, section.id);

  return (
    <QuizRunner
      title={`${section.title} — ${copy.sectionTestSingular}`}
      subtitle={`Pass-gate ${Math.round(
        passPct * 100
      )}% · marks the module complete`}
      questions={section.sectionTest.questions}
      passPct={passPct}
      collectReasons={false}
      resumeFrom={resume}
      onCheckpoint={onCheckpoint}
      onComplete={onComplete}
      exitHref={`/${packId}/section/${section.id}`}
      exitLabel="Exit to section"
      prevHref={prev ? `/${packId}/section/${prev.id}` : undefined}
      prevLabel={prev ? prev.title : undefined}
      nextHref={next ? `/${packId}/section/${next.id}` : undefined}
      nextLabel={next ? next.title : undefined}
    />
  );
}
