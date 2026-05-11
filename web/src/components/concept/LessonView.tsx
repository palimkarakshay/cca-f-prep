"use client";

import Link from "next/link";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { LessonBody, SimplifiedBody, DeeperBody } from "./LessonBody";
import { LessonTOC } from "./LessonTOC";
import { AskClaudePanel } from "./AskClaudePanel";
import { ReadAloudButton } from "./ReadAloudButton";
import { MasteryBadge } from "@/components/primitives/MasteryBadge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdjacentConceptsFrom } from "@/content/curriculum-loader";
import { usePack } from "@/content/pack-context";
import { useCopy, usePackId } from "@/content/pack-hooks";
import {
  getLessonDepth,
  getServerSnapshot,
  setLessonDepth,
  subscribeLessonDepth,
} from "@/lib/lesson-depth";
import type {
  Concept,
  LessonDepth,
  Section,
} from "@/content/curriculum-types";

const DEPTH_LABEL: Record<LessonDepth, string> = {
  easy: "Easy",
  conceptual: "Conceptual",
  deeper: "Deeper",
};

const DEPTH_HELP: Record<LessonDepth, string> = {
  easy: "Plain-language take with an analogy. Use when first encountering the topic.",
  conceptual: "The canonical lesson — the default. Use to learn it the first time properly.",
  deeper: "Advanced detail, edge cases, source citations. Use after the canonical lesson lands.",
};

const DEPTH_SHORT_HELP: Record<LessonDepth, string> = {
  easy: "Plain take",
  conceptual: "Canonical",
  deeper: "Edge cases",
};

function DepthPicker({
  available,
  value,
  onChange,
}: {
  available: Record<LessonDepth, boolean>;
  value: LessonDepth;
  onChange: (next: LessonDepth) => void;
}) {
  const ORDER: LessonDepth[] = ["easy", "conceptual", "deeper"];
  return (
    <div
      role="radiogroup"
      aria-label="Lesson depth"
      className="flex w-full items-stretch gap-1 rounded-md border border-(--border) bg-(--panel-2) p-1 text-xs sm:inline-flex sm:w-auto"
    >
      {ORDER.map((depth) => {
        const enabled = available[depth];
        const active = value === depth;
        return (
          <button
            key={depth}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={!enabled}
            disabled={!enabled}
            title={
              enabled
                ? DEPTH_HELP[depth]
                : `${DEPTH_LABEL[depth]} not authored for this lesson`
            }
            onClick={() => enabled && onChange(depth)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded px-3 py-1.5 transition-colors sm:flex-none sm:flex-row sm:gap-1.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
              active
                ? "bg-(--accent) font-semibold text-(--panel) shadow-sm"
                : enabled
                  ? "text-(--ink) hover:bg-(--panel) hover:text-(--accent-2)"
                  : "cursor-not-allowed text-(--muted) opacity-60"
            )}
          >
            <span className="font-medium">{DEPTH_LABEL[depth]}</span>
            <span
              className={cn(
                "text-[10px] sm:hidden",
                active ? "text-(--panel)/85" : "text-(--muted)"
              )}
            >
              {DEPTH_SHORT_HELP[depth]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function LessonView({
  section,
  concept,
}: {
  section: Section;
  concept: Concept;
}) {
  const { hydrated, conceptMastery, markLessonRead } = useProgress();
  const pack = usePack();
  const packId = usePackId();
  const copy = useCopy();
  const ASK_AI_HEADING = pack.config.askAI.heading ?? "Ask AI";
  const lesson = concept.lesson;
  const scrollPct = useScrollProgress();

  // Per-lesson depth choice persists in localStorage (namespaced by
  // pack id). useSyncExternalStore reads on every commit so we stay
  // in sync with the storage event from other tabs and avoid the
  // setState-in-effect anti-pattern.
  const getSnapshot = useCallback(
    () => getLessonDepth(packId, concept.id),
    [packId, concept.id]
  );
  const depth = useSyncExternalStore(
    subscribeLessonDepth,
    getSnapshot,
    getServerSnapshot
  );

  const chooseDepth = useCallback(
    (next: LessonDepth) => setLessonDepth(packId, concept.id, next),
    [packId, concept.id]
  );

  useEffect(() => {
    if (lesson) markLessonRead(concept.id);
  }, [concept.id, lesson, markLessonRead]);

  const m = hydrated ? conceptMastery(concept.id) : 0;
  const { prev, next } = getAdjacentConceptsFrom(
    pack.curriculum,
    section.id,
    concept.id
  );

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

  const available: Record<LessonDepth, boolean> = {
    easy: Boolean(lesson.simplified),
    conceptual: true,
    deeper: Boolean(lesson.deeper),
  };
  // If the persisted choice is no longer available for this lesson,
  // fall back to conceptual silently.
  const effectiveDepth: LessonDepth = available[depth] ? depth : "conceptual";

  // The TOC rail only renders on the conceptual depth (its anchors
  // point at IDs that exist only in LessonBody). On Easy/Deeper, the
  // rail's grid column would still be reserved by the fixed
  // `grid-cols-[200px_minmax(0,1fr)]` and the article — being the
  // only child — would auto-place into the 200px column, producing
  // the "small mobile version on desktop" bug. Switch to a single-
  // column flow on those depths so the article gets the full width.
  const showTocColumn = effectiveDepth === "conceptual";

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

      <div
        className={cn(
          showTocColumn && "lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10"
        )}
      >
        {showTocColumn ? (
          <LessonTOC lesson={lesson} depth={effectiveDepth} />
        ) : null}

        <article className="min-w-0">
          <header className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-(--border) px-2 py-0.5 text-[11px] uppercase tracking-wide text-(--muted)">
              {concept.code}
            </span>
            {concept.bloom ? (
              <span className="rounded-full border border-(--border) px-2 py-0.5 text-[11px] uppercase tracking-wide text-(--muted)">
                Bloom · {concept.bloom}
              </span>
            ) : null}
            <MasteryBadge mastery={m} />
          </header>

          <h1 className="mb-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl xl:text-4xl font-semibold text-(--ink)">
            {concept.title}
          </h1>

          {/* Reading-depth picker on its own row so it lays out
              predictably on every viewport. Mobile gets a full-width
              segmented control; desktop keeps it inline with a label
              on the left. */}
          <div className="mb-4 mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-(--muted)">
              <span className="font-semibold uppercase tracking-wide text-(--accent-2)">
                Reading depth
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">
                {DEPTH_HELP[effectiveDepth]}
              </span>
            </div>
            <DepthPicker
              available={available}
              value={effectiveDepth}
              onChange={chooseDepth}
            />
          </div>

          {/* Read-aloud (TTS) — uses the browser's Web Speech API to
              speak the lesson body for audio-leaning learners. Falls
              back to invisible if the API isn't available. The parts
              array is the same content the visible body shows, so
              a user toggling between reading and listening hears
              exactly what the eye sees. */}
          {(() => {
            // Prefer a hand-authored narrator transcript when the
            // curriculum supplies one — it's written ear-first and
            // reads more naturally than the auto-concatenated visual
            // body. When absent, fall back to the visible content.
            const ttsParts: string[] = lesson.audioTranscript
              ? [concept.title, lesson.audioTranscript]
              : [
                  concept.title,
                  ...(lesson.paragraphs ?? []),
                  ...(lesson.keyPoints ?? []),
                  ...(lesson.examples?.flatMap((ex) => [ex.title, ex.body]) ?? []),
                  ...(lesson.pitfalls ?? []),
                ];
            return (
              <div className="mb-4">
                <ReadAloudButton
                  parts={ttsParts}
                  label={
                    lesson.audioTranscript
                      ? "Read aloud (narrator)"
                      : "Read aloud"
                  }
                />
              </div>
            );
          })()}

          {lesson.simplified?.oneLiner ||
          (lesson.keyPoints && lesson.keyPoints.length > 0) ? (
            <section
              aria-label={copy.whatYoullLearnHeading}
              className="mb-5 mt-3 rounded-r-md border-l-4 border-(--accent-2) bg-(--accent-2)/5 p-4"
            >
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                {copy.whatYoullLearnHeading}
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

          {effectiveDepth === "easy" && lesson.simplified ? (
            <>
              <p className="mb-3 rounded-md border border-dashed border-(--accent)/40 bg-(--accent)/5 p-2 text-xs text-(--muted)">
                <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-(--accent)">
                  Easy
                </span>
                Plain-language take. Switch to Conceptual for the canonical lesson.
              </p>
              <SimplifiedBody simplified={lesson.simplified} />
            </>
          ) : null}

          {effectiveDepth === "conceptual" ? <LessonBody lesson={lesson} /> : null}

          {effectiveDepth === "deeper" && lesson.deeper ? (
            <>
              <p className="mb-3 rounded-md border border-dashed border-(--accent-2)/40 bg-(--accent-2)/5 p-2 text-xs text-(--muted)">
                <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
                  Deeper
                </span>
                Advanced detail. Switch back to Conceptual for the canonical lesson.
              </p>
              <DeeperBody deeper={lesson.deeper} />
            </>
          ) : null}

          {/* If a depth was chosen but isn't authored, point at Ask-AI as the
              fallback for an on-demand version. */}
          {(depth === "easy" && !available.easy) ||
          (depth === "deeper" && !available.deeper) ? (
            <p className="mt-4 text-xs text-(--muted)">
              {DEPTH_LABEL[depth]} not authored for this lesson — use{" "}
              {ASK_AI_HEADING} below to request one.
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dashed border-(--border) pt-4">
            <Link
              href={`/${packId}/section/${section.id}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "no-underline"
              )}
            >
              ← Back to section
            </Link>
            {concept.quiz ? (
              <Link
                href={`/${packId}/concept/${section.id}/${concept.id}/quiz`}
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
                  href={`/${packId}/concept/${prev.section.id}/${prev.concept.id}`}
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
                  href={`/${packId}/concept/${next.section.id}/${next.concept.id}`}
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
