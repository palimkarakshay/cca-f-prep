"use client";

/* ------------------------------------------------------------------
   LearningGoalCapture — umbrella-level "what do you want to learn?"
   form, rendered above the topic-pack grid on `/`.

   Form structure follows backward design (Wiggins & McTighe,
   *Understanding by Design*):
     1. Topic         — the learner names the desired capability.
     2. Success       — the observable evidence of mastery (the
                        criterion that ends the loop).
     3. End-use       — the transfer context, i.e. the real-world
                        application that justifies the learning.
   Optional SMART-goal sharpeners (Doran 1981 + Locke & Latham
   goal-setting theory) live behind an "Add detail" disclosure so
   the primary form isn't overwhelming on first contact:
     - current level   — Vygotsky's zone of proximal development
                         starting point.
     - motivation      — self-determination theory autonomy cue.
     - validation      — formative assessment hook.
     - timeline        — temporal SMART anchor.

   Submitted goals persist in localStorage under
   `curio:learning-goals:v1`. They render below the form as a
   read-back list with delete affordance so the learner has a
   visible record of what they committed to.
------------------------------------------------------------------ */

import { useId, useState, useSyncExternalStore } from "react";
import { Sparkles, Target, Lightbulb, Trash2 } from "lucide-react";
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

const inputClass = cn(
  "w-full rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm",
  "text-(--ink) placeholder:text-(--muted)",
  "focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
);

const labelClass = "flex flex-col gap-1 text-sm font-medium text-(--ink)";
const helpClass = "text-xs font-normal text-(--muted)";

const REQUIRED_FIELDS: Array<keyof LearningGoalDraft> = [
  "topic",
  "success",
  "endUse",
];

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
  const [draft, setDraft] = useState<LearningGoalDraft>(emptyDraft);
  const [showDetail, setShowDetail] = useState(false);
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const hydrated = useHydrated();
  const goals = useSyncExternalStore<LearningGoal[]>(
    goalStore.subscribe,
    goalStore.get,
    goalStore.getServerSnapshot
  );

  function update<K extends keyof LearningGoalDraft>(
    key: K,
    value: LearningGoalDraft[K]
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed: LearningGoalDraft = {
      topic: draft.topic.trim(),
      success: draft.success.trim(),
      endUse: draft.endUse.trim(),
      currentLevel: draft.currentLevel,
      motivation: draft.motivation?.trim() || undefined,
      validation: draft.validation?.trim() || undefined,
      timeline: draft.timeline?.trim() || undefined,
    };
    if (REQUIRED_FIELDS.some((k) => !(trimmed[k] as string))) return;
    const goal = makeGoal(trimmed);
    goalStore.add(goal);
    setDraft(emptyDraft());
    setShowDetail(false);
    setJustSaved(goal.id);
    // Surface success transiently so screen readers don't keep
    // re-announcing the same status on subsequent renders.
    window.setTimeout(() => setJustSaved(null), 4000);
  }

  function handleDelete(id: string) {
    goalStore.remove(id);
  }

  const canSubmit =
    draft.topic.trim().length > 0 &&
    draft.success.trim().length > 0 &&
    draft.endUse.trim().length > 0;

  return (
    <Card tone="accent" className="flex flex-col gap-4">
      <header className="flex items-start gap-3">
        <Sparkles
          aria-hidden
          className="h-5 w-5 flex-none text-(--accent)"
        />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
            Shape a custom pack
          </h2>
          <p className="mt-0.5 text-sm text-(--muted)">
            Describe the capability you want and the evidence that proves
            you have it. We&apos;ll use this to author a pack matched to
            your goal — sectioned lessons, practice, and a way to verify
            mastery.
          </p>
        </div>
      </header>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
        aria-describedby={`${formId}-evidence`}
      >
        <label className={cn(labelClass, "md:col-span-2")}>
          What do you want to learn?
          <span className={helpClass}>
            Be concrete. &ldquo;Conversational French for a 2-week Paris
            trip&rdquo; beats &ldquo;French&rdquo;.
          </span>
          <input
            required
            type="text"
            name="topic"
            value={draft.topic}
            onChange={(e) => update("topic", e.target.value)}
            placeholder="e.g. SQL window functions for analytics dashboards"
            className={inputClass}
            autoComplete="off"
          />
        </label>

        <label className={labelClass}>
          What does success look like?
          <span className={helpClass}>
            Observable + specific. The criterion that ends the loop.
          </span>
          <textarea
            required
            name="success"
            value={draft.success}
            onChange={(e) => update("success", e.target.value)}
            placeholder="e.g. I can write a 5-step ROW_NUMBER query unaided in under 10 min"
            rows={3}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          How will you use it after you finish?
          <span className={helpClass}>
            The real-world context. Forces transfer, not just recall.
          </span>
          <textarea
            required
            name="endUse"
            value={draft.endUse}
            onChange={(e) => update("endUse", e.target.value)}
            placeholder="e.g. Rebuild the cohort-retention dashboard at work without a senior engineer"
            rows={3}
            className={inputClass}
          />
        </label>

        <div
          id={`${formId}-evidence`}
          className="md:col-span-2 flex items-start gap-2 rounded-md bg-(--panel-2) p-3 text-xs text-(--muted)"
        >
          <Target aria-hidden className="mt-0.5 h-4 w-4 flex-none" />
          <p>
            <strong className="text-(--ink)">Backward design.</strong>{" "}
            Naming the outcome and the use-case before you study makes the
            target self-correcting — every quiz, lesson, or drill can be
            judged against it. Add the optional details below to sharpen
            the goal further (SMART criteria).
          </p>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => setShowDetail((v) => !v)}
            aria-expanded={showDetail}
            aria-controls={`${formId}-detail`}
            className="inline-flex items-center gap-2 text-sm text-(--accent-2) underline-offset-4 hover:underline"
          >
            <Lightbulb aria-hidden className="h-4 w-4" />
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
              Why now?
              <span className={helpClass}>
                Motivation. Drives sustained effort more than ability.
              </span>
              <input
                type="text"
                name="motivation"
                value={draft.motivation ?? ""}
                onChange={(e) => update("motivation", e.target.value)}
                placeholder="e.g. Promotion review in October needs this"
                className={inputClass}
              />
            </label>

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
                placeholder="e.g. Ship the analytics dashboard + peer review"
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
                placeholder="e.g. By end of July"
                className={inputClass}
              />
            </label>
          </div>
        ) : null}

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!canSubmit}>
            Save my goal
          </Button>
          <span aria-live="polite" className="text-xs text-(--muted)">
            {justSaved
              ? "Goal saved locally. We'll use it to author your pack."
              : "Saved in this browser. No account required."}
          </span>
        </div>
      </form>

      {hydrated && goals.length > 0 ? (
        <section
          aria-label="Your saved learning goals"
          className="flex flex-col gap-2 border-t border-dashed border-(--border) pt-4"
        >
          <h3 className="text-sm font-semibold text-(--ink)">
            Your saved goals ({goals.length})
          </h3>
          <ul className="flex flex-col gap-2">
            {goals.map((g) => (
              <li
                key={g.id}
                className="flex items-start gap-3 rounded-md border border-(--border) bg-(--panel-2) p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--ink)">
                    {g.topic}
                  </p>
                  <p className="mt-0.5 text-xs text-(--muted)">
                    <strong>Success:</strong> {g.success}
                  </p>
                  <p className="mt-0.5 text-xs text-(--muted)">
                    <strong>End-use:</strong> {g.endUse}
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
                  aria-label={`Delete goal: ${g.topic}`}
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
