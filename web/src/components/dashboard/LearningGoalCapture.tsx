"use client";

/* ------------------------------------------------------------------
   LearningGoalCapture — learner-lane "shape my journey" form on `/`.

   Two simple questions only:
     1. What do you want to learn?
     2. Why do you want to learn it?

   Once the learner answers both, we run `decodeJourney` locally and
   render their shaped *learning journey* — outcomes, the section
   spine they'll see, applied-experience prompts per section, and an
   estimated time-on-task. Submitting saves the goal to
   localStorage (the read-back list is preserved from the previous
   iteration so a returning learner sees what they committed to).

   This component intentionally pares back the previous SMART-goal
   sharpeners (current level, motivation, validation, timeline)
   into the optional `details` disclosure to keep the home page
   uncluttered. The optional fields still persist on the saved
   goal — they're just not the first thing the learner sees.
------------------------------------------------------------------ */

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import {
  Sparkles,
  Compass,
  Trash2,
  Lightbulb,
  Target,
  CheckCircle2,
  Clock,
  Hammer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import {
  CURRENT_LEVEL_LABELS,
  goalStore,
  makeGoal,
  type CurrentLevel,
  type LearningGoal,
  type LearningGoalDraft,
} from "@/lib/learning-goals";
import {
  decodeJourney,
  JOURNEY_KIND_LABEL,
  type DecodedJourney,
} from "@/lib/journey-decoder";

const inputClass = cn(
  "w-full rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm",
  "text-(--ink) placeholder:text-(--muted)",
  "focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
);

const labelClass = "flex flex-col gap-1 text-sm font-medium text-(--ink)";
const helpClass = "text-xs font-normal text-(--muted)";

function emptyDraft(): LearningGoalDraft {
  return {
    topic: "",
    success: "",
    endUse: "",
    currentLevel: undefined,
    motivation: "",
    validation: "",
    timeline: "",
  };
}

export function LearningGoalCapture() {
  const formId = useId();
  const [what, setWhat] = useState("");
  const [why, setWhy] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [draft, setDraft] = useState<LearningGoalDraft>(emptyDraft);
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const hydrated = useHydrated();
  const goals = useSyncExternalStore<LearningGoal[]>(
    goalStore.subscribe,
    goalStore.get,
    goalStore.getServerSnapshot
  );

  const decoded: DecodedJourney | null = useMemo(() => {
    if (what.trim().length < 3 && why.trim().length < 3) return null;
    return decodeJourney({ what, why });
  }, [what, why]);

  function update<K extends keyof LearningGoalDraft>(
    key: K,
    value: LearningGoalDraft[K]
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!what.trim() || !why.trim()) return;
    const goal = makeGoal({
      topic: what.trim(),
      // We re-use `success` to capture the first decoded success signal
      // so the saved goal stays useful even when the learner doesn't
      // open the optional details. Falls back to the why if the
      // decoder hasn't run yet.
      success:
        draft.success.trim() ||
        decoded?.successSignals[0] ||
        `Can demonstrate "${what.trim()}" in real use`,
      endUse: why.trim(),
      currentLevel: draft.currentLevel,
      motivation: draft.motivation?.trim() || undefined,
      validation: draft.validation?.trim() || undefined,
      timeline: draft.timeline?.trim() || undefined,
    });
    goalStore.add(goal);
    setWhat("");
    setWhy("");
    setDraft(emptyDraft());
    setShowDetail(false);
    setJustSaved(goal.id);
    window.setTimeout(() => setJustSaved(null), 4000);
  }

  function handleDelete(id: string) {
    goalStore.remove(id);
  }

  const canSubmit = what.trim().length > 0 && why.trim().length > 0;

  return (
    <Card tone="accent" className="flex flex-col gap-4">
      <header className="flex items-start gap-3">
        <Compass aria-hidden className="h-5 w-5 flex-none text-(--accent)" />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
            Shape your learning journey
          </h2>
          <p className="mt-0.5 text-sm text-(--muted)">
            Two questions. We&apos;ll sketch a journey for you — sections,
            applied practice, and a way to verify you got there.
          </p>
        </div>
      </header>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
        aria-describedby={`${formId}-explain`}
      >
        <label className={labelClass}>
          What do you want to learn?
          <span className={helpClass}>
            Be concrete. &ldquo;SQL window functions for analytics
            dashboards&rdquo; beats &ldquo;SQL&rdquo;.
          </span>
          <input
            required
            type="text"
            name="what"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="e.g. Conversational French for a Paris trip"
            className={inputClass}
            autoComplete="off"
          />
        </label>

        <label className={labelClass}>
          Why do you want to learn it?
          <span className={helpClass}>
            The real-world end-use. This is the criterion that ends the loop.
          </span>
          <input
            required
            type="text"
            name="why"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="e.g. Two-week trip in October — I want to order, ask, and chat"
            className={inputClass}
          />
        </label>

        <p
          id={`${formId}-explain`}
          className="md:col-span-2 flex items-start gap-2 rounded-md bg-(--panel-2) p-3 text-xs text-(--muted)"
        >
          <Lightbulb aria-hidden className="mt-0.5 h-4 w-4 flex-none" />
          <span>
            Naming <strong className="text-(--ink)">what</strong> and{" "}
            <strong className="text-(--ink)">why</strong> before you start
            keeps every lesson and quiz pointed at the real outcome —
            not at content for its own sake.
          </span>
        </p>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => setShowDetail((v) => !v)}
            aria-expanded={showDetail}
            aria-controls={`${formId}-detail`}
            className="inline-flex items-center gap-2 text-sm text-(--accent-2) underline-offset-4 hover:underline"
          >
            <Sparkles aria-hidden className="h-4 w-4" />
            {showDetail ? "Hide detail" : "Add detail (optional)"}
          </button>
        </div>

        {showDetail ? (
          <div
            id={`${formId}-detail`}
            className="md:col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2 rounded-md border border-dashed border-(--border) p-3"
          >
            <fieldset className="md:col-span-2 flex flex-col gap-2">
              <legend className="text-sm font-medium text-(--ink)">
                Current level
              </legend>
              <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                {(
                  Object.entries(CURRENT_LEVEL_LABELS) as Array<
                    [CurrentLevel, string]
                  >
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1 text-(--muted) hover:bg-(--panel-2) hover:text-(--ink)"
                  >
                    <input
                      type="radio"
                      name="currentLevel"
                      value={value}
                      checked={draft.currentLevel === value}
                      onChange={() => update("currentLevel", value)}
                      className="mt-1"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className={labelClass}>
              How will you verify mastery?
              <span className={helpClass}>
                Project, certificate, teach-back, code review…
              </span>
              <input
                type="text"
                name="validation"
                value={draft.validation ?? ""}
                onChange={(e) => update("validation", e.target.value)}
                placeholder="e.g. Hold a 5-min French conversation"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Target timeline
              <span className={helpClass}>
                A date or a window. Time-bound goals close faster.
              </span>
              <input
                type="text"
                name="timeline"
                value={draft.timeline ?? ""}
                onChange={(e) => update("timeline", e.target.value)}
                placeholder="e.g. By October 15"
                className={inputClass}
              />
            </label>
          </div>
        ) : null}

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!canSubmit}>
            Save my journey
          </Button>
          <span aria-live="polite" className="text-xs text-(--muted)">
            {justSaved
              ? "Journey saved locally. Pick a ready-made course below to start now, or wait for us to author yours."
              : "Saved in this browser. No account required."}
          </span>
        </div>
      </form>

      {decoded ? <DecodedJourneyPreview decoded={decoded} /> : null}

      {hydrated && goals.length > 0 ? (
        <section
          aria-label="Your saved learning journeys"
          className="flex flex-col gap-2 border-t border-dashed border-(--border) pt-4"
        >
          <h3 className="text-sm font-semibold text-(--ink)">
            Your saved journeys ({goals.length})
          </h3>
          <ul className="flex flex-col gap-2">
            {goals.map((g) => (
              <li
                key={g.id}
                className="flex items-start gap-3 rounded-md border border-(--border) bg-(--panel-2) p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--ink)">{g.topic}</p>
                  <p className="mt-0.5 text-xs text-(--muted)">
                    <strong>Why:</strong> {g.endUse}
                  </p>
                  <p className="mt-0.5 text-xs text-(--muted)">
                    <strong>Done when:</strong> {g.success}
                  </p>
                  {g.currentLevel ? (
                    <p className="mt-0.5 text-xs text-(--muted)">
                      <strong>Starting from:</strong>{" "}
                      {CURRENT_LEVEL_LABELS[g.currentLevel]}
                    </p>
                  ) : null}
                  {g.timeline ? (
                    <p className="mt-0.5 text-xs text-(--muted)">
                      <strong>By:</strong> {g.timeline}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(g.id)}
                  aria-label={`Delete journey: ${g.topic}`}
                  className="flex-none rounded-md p-2 text-(--muted) hover:bg-(--panel) hover:text-(--bad)"
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Card>
  );
}

function DecodedJourneyPreview({ decoded }: { decoded: DecodedJourney }) {
  return (
    <section
      aria-label="Your journey, decoded"
      className="rounded-md border border-(--border) bg-(--panel-2) p-4"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-(--ink)">
          Your journey, decoded
        </h3>
        <span className="rounded-full border border-(--accent)/40 bg-(--accent)/10 px-2 py-0.5 text-xs font-medium text-(--accent-2)">
          {JOURNEY_KIND_LABEL[decoded.kind]}
        </span>
      </header>
      <p className="mt-2 text-sm text-(--ink)">{decoded.headline}</p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <CheckCircle2 aria-hidden className="h-3.5 w-3.5" />
            You&apos;ll know you&apos;re there when
          </p>
          <ul className="mt-1 flex flex-col gap-1 text-xs text-(--muted)">
            {decoded.successSignals.map((s) => (
              <li key={s} className="flex items-start gap-1.5">
                <Target aria-hidden className="mt-0.5 h-3 w-3 flex-none text-(--accent)" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            Rough time on task
          </p>
          <p className="mt-1 text-xs text-(--muted)">
            ~{decoded.estimatedHours.low}–{decoded.estimatedHours.high} hours,
            split across roughly {decoded.sectionSpine.length} sections.
          </p>
          {decoded.recommendsExpiry ? (
            <p className="mt-2 text-xs text-(--warn)">
              This kind of journey usually expires — plan a refresh date.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          <Hammer aria-hidden className="h-3.5 w-3.5" />
          Sections you&apos;ll move through (each ends with applied practice)
        </p>
        <ol className="mt-1 flex flex-col gap-1 text-xs text-(--muted)">
          {decoded.sectionSpine.map((s, i) => (
            <li key={s.title} className="flex items-start gap-2">
              <span className="mt-0.5 font-mono text-[10px] text-(--accent-2)">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span>
                <span className="font-medium text-(--ink)">{s.title}</span> —{" "}
                <span className="italic">{s.applied}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
