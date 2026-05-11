/* ------------------------------------------------------------------
   AppliedPanel — renders the "Apply" tab on every section.

   Every section closes with one or more *applied-experience*
   prompts (read or generated via `getAppliedExperiences`). The
   point is that learners don't just stack more MCQs; they leave a
   section with something real they've tried in their own context.
------------------------------------------------------------------ */

import Link from "next/link";
import {
  Hammer,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Section } from "@/content/curriculum-types";
import {
  APPLIED_LEVEL_LABEL,
  getAppliedExperiences,
} from "@/lib/applied-experience";

export function AppliedPanel({
  section,
  packId,
}: {
  section: Section;
  packId: string;
}) {
  const items = getAppliedExperiences(section);
  return (
    <section
      aria-labelledby="applied-heading"
      className="flex flex-col gap-4"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="applied-heading"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)"
        >
          <Hammer aria-hidden className="h-5 w-5 text-(--accent)" />
          Apply this section
        </h2>
        <p className="text-sm text-(--muted)">
          Real-world tasks that close the loop between reading and doing.
          A section isn&apos;t complete until you&apos;ve tried at least
          one of these in your own context.
        </p>
      </header>

      <ol className="flex flex-col gap-3">
        {items.map((item, i) => {
          const conceptHref = item.conceptId
            ? `/${packId}/concept/${section.id}/${item.conceptId}`
            : null;
          return (
            <li key={item.id}>
              <Card>
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-(--ink)">
                    <span
                      aria-hidden
                      className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-(--panel-2) text-xs font-semibold text-(--accent-2)"
                    >
                      {i + 1}
                    </span>
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-(--muted)">
                    {item.level ? (
                      <span className="rounded-full border border-(--border) px-2 py-0.5">
                        {APPLIED_LEVEL_LABEL[item.level]}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <Clock aria-hidden className="h-3 w-3" />
                      ~{item.minutes} min
                    </span>
                  </div>
                </header>
                <p className="mt-2 text-sm text-(--ink)">{item.prompt}</p>
                <p className="mt-2 inline-flex items-start gap-1.5 text-xs text-(--good)">
                  <CheckCircle2
                    aria-hidden
                    className="mt-0.5 h-3.5 w-3.5 flex-none"
                  />
                  <span>
                    <span className="font-semibold">Done when:</span>{" "}
                    {item.doneWhen}
                  </span>
                </p>
                {conceptHref ? (
                  <div className="mt-3 border-t border-dashed border-(--border) pt-3">
                    <Link
                      href={conceptHref}
                      className="inline-flex items-center gap-1 text-xs text-(--accent-2) underline-offset-4 hover:underline"
                    >
                      <BookOpen aria-hidden className="h-3.5 w-3.5" />
                      Re-read the source concept
                      <ArrowRight aria-hidden className="h-3 w-3" />
                    </Link>
                  </div>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ol>

      <p className="rounded-md bg-(--panel-2) p-3 text-xs text-(--muted)">
        <strong className="text-(--ink)">Why this matters.</strong> Reading
        + quizzing prove recall; applying it in a real situation is the
        only evidence of transfer. Treat at least one of these as
        non-negotiable before you move on.
      </p>
    </section>
  );
}
