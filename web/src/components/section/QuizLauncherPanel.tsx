"use client";

import Link from "next/link";
import { Award, Lock } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section } from "@/content/curriculum-types";

interface QuizLauncherPanelProps {
  section: Section;
  packId: string;
  /** Pack-overridable label, e.g., "Section test" / "Quiz" / "Checkpoint". */
  sectionTestLabel: string;
}

/**
 * Section-landing "Quiz" tab content. Surfaces the section test
 * launcher + the user's last attempt (if any) — uses `useProgress`
 * so it has to be a client component. Pack-agnostic — accepts
 * section + packId + a copy label as props.
 */
export function QuizLauncherPanel({
  section,
  packId,
  sectionTestLabel,
}: QuizLauncherPanelProps) {
  const { progress, hydrated, sectionTestReady } = useProgress();

  if (!section.sectionTest) {
    return (
      <p className="text-sm text-(--muted)">
        No {sectionTestLabel.toLowerCase()} authored for this module yet.
      </p>
    );
  }

  const lastTest =
    progress.section[section.id]?.testAttempts.slice(-1)[0] ?? null;
  const passPct = section.sectionTest.passPct ?? 0.7;
  const passed = lastTest && lastTest.score / lastTest.total >= passPct;
  const ready = sectionTestReady(section.id);

  return (
    <Card tone="accent" className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-md bg-(--panel-2) text-(--accent-2)"
        >
          <Award className="h-4 w-4" />
        </span>
        <h2 className="text-base font-semibold text-(--ink)">
          {sectionTestLabel}
        </h2>
      </div>
      <p className="text-sm text-(--muted)">
        {section.sectionTest.questions.length} questions ·{" "}
        {Math.round(passPct * 100)}% pass-gate marks this module complete.
      </p>
      {hydrated && lastTest ? (
        <p className="text-xs">
          <span className="text-(--muted)">Last attempt:</span>{" "}
          <strong className={passed ? "text-(--good)" : "text-(--bad)"}>
            {lastTest.score} / {lastTest.total}
          </strong>{" "}
          <span className={passed ? "text-(--good)" : "text-(--bad)"}>
            ({passed ? "pass" : "below pass-gate"})
          </span>
        </p>
      ) : null}
      {ready ? (
        <Link
          href={`/${packId}/section/${section.id}/test`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "self-start no-underline"
          )}
        >
          {lastTest ? `Re-take ${sectionTestLabel.toLowerCase()}` : `Take ${sectionTestLabel.toLowerCase()}`}
        </Link>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-md border border-dashed border-(--warn)/50 bg-(--warn)/8 p-3 text-xs text-(--ink)">
          <span className="inline-flex items-center gap-1.5 font-medium text-(--warn)">
            <Lock aria-hidden className="h-3 w-3" />
            {sectionTestLabel} locked
          </span>
          <span className="text-(--muted)">
            Read every lesson in this module first — then the test unlocks.
          </span>
        </div>
      )}
    </Card>
  );
}
