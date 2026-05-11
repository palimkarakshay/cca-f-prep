"use client";

/* ------------------------------------------------------------------
   SectionConceptMap — a small visual diagram of the section's
   concepts as nodes (one per concept), connected by arrows, and
   coloured by mastery level. Pairs with SectionConceptList for
   visual-leaning learners who want a spatial sense of the section
   before diving into the linear list.

   Each node:
     - Renders as a clickable <a> linking to the concept lesson.
     - Carries an aria-label with the concept code + title + a
       human-readable mastery summary, so screen-reader users get
       the same wayfinding as sighted users.
     - Colours: derived from the resolved mastery-level tone of the
       pack (good / warn / bad / neutral).

   Locked-section behaviour: if section is locked (per progress
   engine), nodes render dimmed and disabled-style; titles still
   appear so users can preview the journey.
------------------------------------------------------------------ */

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { masteryLevels } from "@/lib/site-config";
import { usePackId } from "@/content/pack-hooks";
import type { Section } from "@/content/curriculum-types";

const NODE_RADIUS = 18;
const NODE_GAP = 96;
const PADDING_X = 24;
const HEIGHT = 80;

function toneFill(tone: "good" | "warn" | "bad" | "neutral" | undefined): string {
  switch (tone) {
    case "good":
      return "var(--good)";
    case "warn":
      return "var(--warn)";
    case "bad":
      return "var(--bad)";
    default:
      return "var(--panel-2)";
  }
}

function toneStroke(
  tone: "good" | "warn" | "bad" | "neutral" | undefined
): string {
  switch (tone) {
    case "good":
    case "warn":
    case "bad":
      return "var(--ink)";
    default:
      return "var(--border)";
  }
}

export function SectionConceptMap({
  section,
  packId: packIdProp,
}: {
  section: Section;
  packId?: string;
}) {
  const { hydrated, conceptMastery } = useProgress();
  const ctxPackId = usePackId();
  const packId = packIdProp ?? ctxPackId;

  const n = section.concepts.length;
  if (n === 0) return null;
  const width = PADDING_X * 2 + (n - 1) * NODE_GAP + NODE_RADIUS * 2;
  const centerY = HEIGHT / 2;

  return (
    <section
      aria-labelledby={`section-map-${section.id}-h`}
      className="flex flex-col gap-2 rounded-lg border border-(--border) bg-(--panel) p-4 shadow-sm"
    >
      <header className="flex items-baseline justify-between gap-2">
        <h2
          id={`section-map-${section.id}-h`}
          className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
        >
          Lesson map
        </h2>
        <p className="text-xs text-(--muted)">
          {hydrated ? "Coloured by your current mastery" : "Mastery loads after hydration"}
        </p>
      </header>
      <div className="overflow-x-auto">
        <svg
          role="img"
          aria-label={`Visual map of ${n} lesson${n === 1 ? "" : "s"} in ${section.title}`}
          viewBox={`0 0 ${width} ${HEIGHT + 22}`}
          width={width}
          height={HEIGHT + 22}
          className="block"
        >
          {/* Connector line behind nodes. */}
          <line
            x1={PADDING_X + NODE_RADIUS}
            y1={centerY}
            x2={width - PADDING_X - NODE_RADIUS}
            y2={centerY}
            stroke="var(--border)"
            strokeWidth={2}
          />
          {section.concepts.map((c, i) => {
            const cx = PADDING_X + NODE_RADIUS + i * NODE_GAP;
            const m = hydrated ? conceptMastery(c.id) : 0;
            const level = masteryLevels[m];
            const tone = level?.tone;
            const authored = Boolean(c.lesson && c.quiz);
            const disabled = !authored;
            const fill = disabled ? "var(--panel-2)" : toneFill(tone);
            const stroke = disabled ? "var(--border)" : toneStroke(tone);
            const labelLines = c.title.split(/\s+/);
            const short =
              labelLines.length > 2
                ? `${labelLines.slice(0, 2).join(" ")}…`
                : c.title;
            const ariaLabel = `${c.code}: ${c.title}. ${
              hydrated
                ? `Mastery: ${level?.label ?? "Not started"}.`
                : ""
            } ${disabled ? "Lesson not yet authored." : "Open lesson."}`.trim();
            const node = (
              <g key={c.id} aria-label={ariaLabel}>
                <circle
                  cx={cx}
                  cy={centerY}
                  r={NODE_RADIUS}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  x={cx}
                  y={centerY + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="ui-monospace, 'SF Mono', monospace"
                  fontWeight={700}
                  fill={tone && !disabled ? "white" : "var(--ink)"}
                >
                  {i + 1}
                </text>
                <text
                  x={cx}
                  y={centerY + NODE_RADIUS + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--muted)"
                >
                  {short}
                </text>
              </g>
            );
            if (disabled) return <g key={c.id}>{node}</g>;
            return (
              <Link
                key={c.id}
                href={`/${packId}/concept/${section.id}/${c.id}`}
                aria-label={ariaLabel}
              >
                {node}
              </Link>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-(--muted)">
        Click a node to jump to that lesson. Colours track your mastery
        — neutral · below 60% · passing · strong.
      </p>
    </section>
  );
}
