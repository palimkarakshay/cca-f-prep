/* ------------------------------------------------------------------
   ConceptHeaderNav — contextual top-of-page nav for lessons.

   Lessons are the deepest leaf in the journey. The original page
   only had breadcrumbs at the top and prev/next pills at the
   bottom; on a long lesson the learner had to scroll back to the
   top to navigate away. This component sits *above the fold* on
   every concept page and surfaces:

     - "← Back to <section title>"
     - "Section N · Concept i of M" position indicator
     - Compact prev / next pills (same destinations as the
       bottom-of-page nav, mirrored here so the learner doesn't
       need to scroll)
     - "Up to <Journey>" jump to the pack overview

   Server-rendered: takes pack + section + concept as props,
   doesn't read any client state.
------------------------------------------------------------------ */

"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, ChevronUp } from "lucide-react";
import { getAdjacentConceptsFrom } from "@/content/curriculum-loader";
import { NumberedJumper } from "@/components/primitives/NumberedJumper";
import { useCopy } from "@/content/pack-hooks";
import type { ContentPack } from "@/content/pack-types";
import type { Concept, Section } from "@/content/curriculum-types";

export function ConceptHeaderNav({
  pack,
  section,
  concept,
}: {
  pack: ContentPack;
  section: Section;
  concept: Concept;
}) {
  const copy = useCopy();
  const conceptIndex =
    section.concepts.findIndex((c) => c.id === concept.id) + 1;
  const total = section.concepts.length;
  const { prev, next } = getAdjacentConceptsFrom(
    pack.curriculum,
    section.id,
    concept.id
  );
  const packId = pack.config.id;
  return (
    <nav
      aria-label={`${copy.lessonSingular} navigation`}
      className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-(--border) bg-(--panel-2) p-3 text-xs"
    >
      <Link
        href={`/${packId}/section/${section.id}`}
        className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 py-1 text-(--ink) no-underline hover:bg-(--panel) hover:text-(--accent-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
      >
        <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Back to</span>{" "}
        <span className="font-medium">{copy.moduleSingular} {section.n}: {section.title}</span>
      </Link>

      <span aria-hidden className="text-(--muted)">·</span>

      <span className="text-(--muted)">
        {copy.lessonSingular} <span className="font-mono">{conceptIndex}</span> of{" "}
        <span className="font-mono">{total}</span>
      </span>

      <NumberedJumper
        ariaLabel={`Jump to ${copy.lessonSingular.toLowerCase()}`}
        activeIndex={conceptIndex - 1}
        items={section.concepts.map((c) => ({
          href: `/${packId}/concept/${section.id}/${c.id}`,
          label: `${c.code} ${c.title}`,
        }))}
      />

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {prev ? (
          <Link
            href={`/${packId}/concept/${prev.section.id}/${prev.concept.id}`}
            aria-label={`Previous ${copy.lessonSingular.toLowerCase()}: ${prev.concept.title}`}
            className="inline-flex min-h-9 items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2 py-1 text-(--ink) no-underline hover:border-(--accent) hover:text-(--accent-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            <ArrowLeft aria-hidden className="h-3 w-3" />
            Prev
          </Link>
        ) : null}
        {next ? (
          <Link
            href={`/${packId}/concept/${next.section.id}/${next.concept.id}`}
            aria-label={`Next ${copy.lessonSingular.toLowerCase()}: ${next.concept.title}`}
            className="inline-flex min-h-9 items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2 py-1 text-(--ink) no-underline hover:border-(--accent) hover:text-(--accent-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            Next
            <ArrowRight aria-hidden className="h-3 w-3" />
          </Link>
        ) : null}
        <Link
          href={`/${packId}`}
          aria-label={`Course overview: ${pack.config.name}`}
          className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2 py-1 text-(--ink) no-underline hover:border-(--accent) hover:text-(--accent-2)"
        >
          <ChevronUp aria-hidden className="h-3 w-3" />
          {copy.courseSingular}
        </Link>
        <Link
          href="/"
          aria-label={`All ${copy.coursePlural.toLowerCase()}`}
          className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2 py-1 text-(--ink) no-underline hover:border-(--accent) hover:text-(--accent-2)"
        >
          <Home aria-hidden className="h-3 w-3" />
          <span className="hidden sm:inline">All {copy.coursePlural.toLowerCase()}</span>
          <span className="sm:hidden">Home</span>
        </Link>
      </div>
    </nav>
  );
}
