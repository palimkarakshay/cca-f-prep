"use client";

import Link from "next/link";
import { CURRICULUM } from "@/content/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MockExamPanel() {
  const { progress, hydrated } = useProgress();
  const mocks = CURRICULUM.mockExams ?? [];
  if (mocks.length === 0) return null;

  return (
    <section className="mt-8 border-t border-(--border) pt-6">
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          Mock exams
        </h2>
        <p className="text-sm text-(--muted)">
          Independent of section progress. Use for calibration.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {mocks.map((mock) => {
          const mp = progress.mock[mock.id];
          const last = mp?.attempts.slice(-1)[0] ?? null;
          const inProgress = Boolean(mp?.currentAttempt);
          const status = !hydrated
            ? null
            : inProgress
              ? "in-progress"
              : last
                ? last.score / last.total >= mock.passPct
                  ? "pass"
                  : "fail"
                : null;

          const statusLabel =
            status === "in-progress"
              ? "In progress"
              : status === "pass"
                ? `Last attempt: ${last!.score}/${last!.total} — pass`
                : status === "fail"
                  ? `Last attempt: ${last!.score}/${last!.total} — below pass-gate`
                  : null;

          return (
            <li
              key={mock.id}
              className="rounded-lg border border-(--border) bg-(--panel) p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold text-(--ink)">
                  {mock.title}
                </h3>
                <span className="text-xs text-(--muted)">
                  {mock.questions.length} Q · {mock.timeMinutes}m ·{" "}
                  {Math.round(mock.passPct * 100)}% pass
                </span>
              </div>
              <p className="mt-1 text-sm text-(--muted)">{mock.blurb}</p>
              {statusLabel ? (
                <p
                  className={cn(
                    "mt-2 inline-block rounded-md border px-2 py-1 text-xs",
                    status === "pass"
                      ? "border-(--good)/40 text-(--good)"
                      : status === "fail"
                        ? "border-(--bad)/40 text-(--bad)"
                        : "border-(--accent-2)/40 text-(--accent-2)"
                  )}
                >
                  {statusLabel}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/mock/${mock.id}`}
                  className={cn(
                    buttonVariants({
                      variant: inProgress ? "default" : "secondary",
                      size: "sm",
                    }),
                    "no-underline"
                  )}
                >
                  {inProgress ? "Resume" : last ? "Re-take" : "Start"}
                </Link>
                {last ? (
                  <Link
                    href={`/mock/${mock.id}/result`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "no-underline"
                    )}
                  >
                    Review last
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
