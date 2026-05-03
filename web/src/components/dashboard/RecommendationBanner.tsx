"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProgress } from "@/hooks/useProgress";
import { recommend } from "@/lib/recommendation";
import { Card } from "@/components/ui/card";

const KIND_LABEL: Record<string, string> = {
  drill: "Drill",
  "section-test": "Section test",
  lesson: "Continue — read lesson",
  quiz: "Continue — take quiz",
  done: "All caught up",
};

const KIND_TITLE: Record<string, string> = {
  drill: "Re-take a missed concept",
  "section-test": "Section test ready",
  lesson: "Read the next lesson",
  quiz: "Take the next quiz",
  done: "All authored content complete",
};

export function RecommendationBanner() {
  const { progress, hydrated } = useProgress();
  const reco = useMemo(() => recommend(progress), [progress]);

  if (!hydrated) {
    return (
      <Card className="border-l-4 border-l-(--accent) bg-(--panel-2)">
        <p className="text-sm text-(--muted)">Loading recommendation…</p>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-(--accent) bg-(--panel-2)">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
        Recommended next · {KIND_LABEL[reco.kind] ?? "Next"}
      </div>
      <div className="mt-1 text-base font-semibold text-(--ink)">
        {KIND_TITLE[reco.kind] ?? "Next step"}
      </div>
      <p className="mt-1 text-sm text-(--muted)">{reco.why}</p>
      {reco.kind !== "done" ? (
        <Link
          href={reco.href}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-(--accent) px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-(--accent-2)"
        >
          Go →
        </Link>
      ) : null}
    </Card>
  );
}
