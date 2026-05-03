import { Clock, ExternalLink, Lightbulb } from "lucide-react";
import type { Section, SectionMeta } from "@/content/curriculum-types";

interface GoalsPanelProps {
  section: Section;
  /** Pack-supplied metadata. May be null for sections without a meta entry. */
  meta: SectionMeta | null;
  /** Pack-aware time formatter (e.g., "1 hr 30 min"). Passed in so this
   *  component stays free of the curriculum-loader singleton. */
  formatMinutes: (n: number) => string;
}

/**
 * Section-landing "Goals" tab content. Pack-agnostic — receives the
 * section and its meta as props plus the formatter helper. Renders
 * gracefully when meta is null (just shows the header + blurb).
 */
export function GoalsPanel({ section, meta, formatMinutes }: GoalsPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="font-mono text-xs text-(--muted)">
          Section {String(section.n).padStart(2, "0")}
          {section.sourceCourse ? ` · ${section.sourceCourse}` : null}
          {meta?.track ? ` · ${meta.track}` : null}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {section.title}
        </h1>
        <p className="mt-2 max-w-prose text-sm md:text-base text-(--muted)">
          {section.blurb}
        </p>
      </header>

      {meta ? (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--panel-2) px-3 py-1 text-(--ink)">
            <Clock className="h-3.5 w-3.5 text-(--accent-2)" aria-hidden />
            {formatMinutes(meta.timeMinutes)}
          </span>
          <a
            href={meta.academyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--panel) px-3 py-1 text-(--accent-2) hover:border-(--accent)/50"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            Watch on Anthropic Academy
          </a>
        </div>
      ) : null}

      {meta && meta.learningObjectives.length > 0 ? (
        <section
          aria-labelledby="goals-objectives-heading"
          className="rounded-r-md border-l-4 border-(--accent-2) bg-(--accent-2)/5 p-4"
        >
          <h2
            id="goals-objectives-heading"
            className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
          >
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Learning objectives
          </h2>
          <ul className="ml-4 list-disc space-y-1 text-sm text-(--ink)">
            {meta.learningObjectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {meta?.keyConcepts && meta.keyConcepts.length > 0 ? (
        <section aria-labelledby="goals-keyconcepts-heading">
          <h2
            id="goals-keyconcepts-heading"
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
          >
            Key concepts
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {meta.keyConcepts.map((kc, i) => (
              <div
                key={i}
                className="rounded-lg border border-(--border) bg-(--panel) p-3 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-(--ink)">
                  {kc.title}
                </h3>
                <p className="mt-1 text-xs text-(--muted)">{kc.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
