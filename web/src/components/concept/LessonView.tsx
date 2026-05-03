"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { LessonBody, SimplifiedBody } from "./LessonBody";
import { LessonTOC } from "./LessonTOC";
import { AskClaudePanel } from "./AskClaudePanel";
import { MasteryBadge } from "@/components/primitives/MasteryBadge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdjacentConcepts } from "@/content/curriculum-loader";
import type { Concept, Section } from "@/content/curriculum-types";

export function LessonView({
  section,
  concept,
}: {
  section: Section;
  concept: Concept;
}) {
  const { hydrated, conceptMastery, markLessonRead } = useProgress();
  const [simplified, setSimplified] = useState(false);
  const lesson = concept.lesson;
  const scrollPct = useScrollProgress();

  useEffect(() => {
    if (lesson) markLessonRead(concept.id);
  }, [concept.id, lesson, markLessonRead]);

  const m = hydrated ? conceptMastery(concept.id) : 0;
  const hasSimplified = Boolean(lesson?.simplified);
  const showSimplified = simplified && hasSimplified;
  const { prev, next } = getAdjacentConcepts(section.id, concept.id);

  if (!lesson) {
    return (
      <section
        aria-label="Lesson stub"
        className="rounded-r-md border-l-4 border-(--warn) bg-(--warn)/10 p-4 text-sm text-(--ink)"
      >
        <strong className="text-(--warn)">Lesson coming.</strong> The notes
        for this concept exist in the repo but the in-app lesson hasn't been
        authored yet.
      </section>
    );
  }

  return (
    <>
      {/* Decorative scroll-progress bar across the top — duplicates browser
          progress for sighted users; aria-hidden so AT doesn't double-read. */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-30 h-0.5 bg-(--panel-2) md:h-1"
      >
        <div
          className="h-full bg-(--accent) transition-[width] duration-150 ease-out"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <LessonTOC lesson={lesson} />

        <article className="min-w-0">
          <header className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-(--border) px-2 py-0.5 text-[11px] uppercase tracking-wide text-(--muted)">
              {concept.code}
            </span>
            <span className="rounded-full border border-(--border) px-2 py-0.5 text-[11px] uppercase tracking-wide text-(--muted)">
              Bloom · {concept.bloom}
            </span>
            <MasteryBadge mastery={m} />
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => setSimplified((v) => !v)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  showSimplified
                    ? "border-(--accent) bg-(--accent) font-semibold text-white"
                    : "border-(--border) bg-(--panel-2) text-(--ink) hover:border-(--accent)"
                )}
                aria-pressed={showSimplified}
              >
                {showSimplified ? "Showing simplified" : "Simplify"}
              </button>
            </div>
          </header>

          <h1 className="mb-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl xl:text-4xl font-semibold text-(--ink)">
            {concept.title}
          </h1>

          {lesson.simplified?.oneLiner ||
          (lesson.keyPoints && lesson.keyPoints.length > 0) ? (
            <section
              aria-label="What you'll learn"
              className="mb-5 mt-3 rounded-r-md border-l-4 border-(--accent-2) bg-(--accent-2)/5 p-4"
            >
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                What you'll learn
              </h2>
              {lesson.simplified?.oneLiner ? (
                <p className="mb-2 text-sm text-(--ink)">
                  {lesson.simplified.oneLiner}
                </p>
              ) : null}
              {lesson.keyPoints && lesson.keyPoints.length > 0 ? (
                <ul className="ml-4 list-disc space-y-1 text-sm text-(--ink)">
                  {lesson.keyPoints.slice(0, 3).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {showSimplified && lesson.simplified ? (
            <>
              <p className="mb-3 rounded-md border border-dashed border-(--warn)/40 bg-(--warn)/5 p-2 text-xs text-(--muted)">
                <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-(--warn)">
                  Simplified
                </span>
                Toggle off to read the canonical lesson.
              </p>
              <SimplifiedBody simplified={lesson.simplified} />
            </>
          ) : (
            <LessonBody lesson={lesson} />
          )}

          {simplified && !hasSimplified ? (
            <p className="mt-4 text-xs text-(--muted)">
              No simplified version authored — use Ask Claude below to request one.
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dashed border-(--border) pt-4">
            <Link
              href={`/section/${section.id}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "no-underline"
              )}
            >
              ← Back to section
            </Link>
            {concept.quiz ? (
              <Link
                href={`/concept/${section.id}/${concept.id}/quiz`}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "ml-auto no-underline"
                )}
              >
                Take quiz →
              </Link>
            ) : (
              <span className="ml-auto text-xs text-(--muted)">
                Quiz not yet authored
              </span>
            )}
          </div>

          {prev || next ? (
            <nav
              aria-label="Lesson navigation"
              className="mt-3 flex flex-wrap items-stretch gap-2"
            >
              {prev ? (
                <Link
                  href={`/concept/${prev.section.id}/${prev.concept.id}`}
                  className="flex-1 rounded-md border border-(--border) bg-(--panel-2) p-3 text-sm no-underline shadow-sm transition-colors hover:border-(--accent)"
                >
                  <span className="block text-[11px] uppercase tracking-wide text-(--muted)">
                    ← Previous lesson
                  </span>
                  <span className="mt-0.5 block font-medium text-(--ink)">
                    {prev.concept.code} {prev.concept.title}
                  </span>
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/concept/${next.section.id}/${next.concept.id}`}
                  className="flex-1 rounded-md border border-(--border) bg-(--panel-2) p-3 text-right text-sm no-underline shadow-sm transition-colors hover:border-(--accent)"
                >
                  <span className="block text-[11px] uppercase tracking-wide text-(--muted)">
                    Next lesson →
                  </span>
                  <span className="mt-0.5 block font-medium text-(--ink)">
                    {next.concept.code} {next.concept.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          ) : null}

          <AskClaudePanel
            conceptCode={concept.code}
            conceptTitle={concept.title}
            lesson={lesson}
          />
        </article>
      </div>
    </>
  );
}
