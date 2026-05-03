"use client";

import Link from "next/link";
import { CURRICULUM } from "@/content/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MockExamPanel() {
  const { progress, hydrated } = useProgress();
  const mocks = CURRICULUM.mockExams ?? [];
  if (mocks.length === 0) return null;

  return (
    <section aria-labelledby="mock-heading" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2
          id="mock-heading"
          className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
        >
          Mock exams
        </h2>
        <p className="text-sm text-(--muted)">
          Independent of section progress. Use for calibration.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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

          const tone =
            status === "pass" ? "good" : status === "fail" ? "bad" : "default";

          const statusLabel =
            status === "in-progress"
              ? "In progress"
              : status === "pass"
                ? `Last attempt: ${last!.score}/${last!.total} — pass`
                : status === "fail"
                  ? `Last attempt: ${last!.score}/${last!.total} — below pass-gate`
                  : null;

          return (
            <li key={mock.id}>
              <Card tone={tone} className="flex h-full flex-col gap-2 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-(--ink)">
                    {mock.title}
                  </h3>
                  <span className="text-xs text-(--muted)">
                    {mock.questions.length} Q · {mock.timeMinutes}m ·{" "}
                    {Math.round(mock.passPct * 100)}% pass
                  </span>
                </div>
                <p className="text-sm text-(--muted)">{mock.blurb}</p>
                {statusLabel ? (
                  <p
                    className={cn(
                      "inline-block self-start rounded-md border px-2 py-1 text-xs",
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
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
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
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
