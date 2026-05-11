"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  ClipboardCheck,
  ChevronDown,
  CheckSquare,
  Square,
  ExternalLink,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getBeforeYouBeginState,
  getServerSnapshot,
  setBeforeYouBeginDismissed,
  setBeforeYouBeginOpen,
  subscribeBeforeYouBegin,
  toggleBeforeYouBeginItem,
} from "@/lib/before-you-begin";
import type { PackPrerequisites } from "@/content/pack-types";

/**
 * Pre-flight self-check card surfaced on the pack home page above
 * the section list. Renders only when the pack supplies a
 * `prerequisites` block.
 *
 * Items render as a checklist the learner can tick. Both the check
 * state and the open/closed state persist per-pack in localStorage,
 * read via useSyncExternalStore so the shell stays free of
 * setState-in-effect patterns.
 */
export function BeforeYouBegin({
  packId,
  prerequisites,
}: {
  packId: string;
  prerequisites: PackPrerequisites;
}) {
  const getSnapshot = useCallback(
    () => getBeforeYouBeginState(packId),
    [packId]
  );
  const state = useSyncExternalStore(
    subscribeBeforeYouBegin,
    getSnapshot,
    getServerSnapshot
  );
  const { items: checked, open, dismissed } = state;

  const toggleItem = useCallback(
    (key: string) => toggleBeforeYouBeginItem(packId, key),
    [packId]
  );

  const toggleOpen = useCallback(
    () => setBeforeYouBeginOpen(packId, !open),
    [packId, open]
  );

  const dismiss = useCallback(
    () => setBeforeYouBeginDismissed(packId, true),
    [packId]
  );

  const reopen = useCallback(() => {
    setBeforeYouBeginDismissed(packId, false);
    setBeforeYouBeginOpen(packId, true);
  }, [packId]);

  const total = prerequisites.requirements.length;
  const done = prerequisites.requirements.filter(
    (r) => checked[`req:${r.label}`]
  ).length;
  const allDone = done === total;

  // Once the self-check is complete and dismissed, collapse into a
  // single-line confirmation that the learner can re-expand to see
  // what they ticked. This satisfies the "one-time only" requirement
  // without losing the audit trail of which items were confirmed.
  if (allDone && dismissed) {
    return (
      <button
        type="button"
        onClick={reopen}
        aria-label="Show prerequisites I confirmed"
        className={cn(
          "flex w-full items-center gap-2 rounded-md border border-(--good)/30 bg-(--good)/8 px-3 py-2 text-left text-xs text-(--ink)",
          "hover:border-(--good)/50 hover:bg-(--good)/12",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
        )}
      >
        <Check
          aria-hidden
          className="h-3.5 w-3.5 flex-none text-(--good)"
        />
        <span className="flex-1">
          Pre-flight self-check complete — {total}/{total} confirmed
        </span>
        <span className="text-[11px] text-(--muted)">Show</span>
      </button>
    );
  }

  return (
    <Card
      tone={allDone ? "good" : "default"}
      className="flex flex-col gap-3 p-5"
    >
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-controls="before-you-begin-body"
        className={cn(
          "flex w-full items-start gap-3 rounded text-left",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-md",
            allDone
              ? "bg-(--good)/15 text-(--good)"
              : "bg-(--accent)/15 text-(--accent)"
          )}
        >
          <ClipboardCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
            {prerequisites.heading}
          </h2>
          <p className="mt-0.5 text-xs text-(--muted)">
            Self-check {done}/{total} ·{" "}
            {allDone
              ? "Ready to start"
              : "Confirm before committing time to this journey"}
          </p>
        </div>
        <ChevronDown
          aria-hidden
          className={cn(
            "h-5 w-5 flex-none text-(--muted) transition-transform",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {open ? (
        <div id="before-you-begin-body" className="flex flex-col gap-4">
          <p className="text-sm text-(--ink)">{prerequisites.intro}</p>

          <section aria-label="Prerequisites">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
              Prerequisites — check before starting
            </h3>
            <ul className="flex flex-col gap-2">
              {prerequisites.requirements.map((r) => {
                const key = `req:${r.label}`;
                const isChecked = Boolean(checked[key]);
                return (
                  <li key={r.label}>
                    <button
                      type="button"
                      onClick={() => toggleItem(key)}
                      aria-pressed={isChecked}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                        isChecked
                          ? "border-(--good)/40 bg-(--good)/8"
                          : "border-(--border) bg-(--panel-2) hover:border-(--accent) hover:bg-(--panel)"
                      )}
                    >
                      {isChecked ? (
                        <CheckSquare
                          aria-hidden
                          className="mt-0.5 h-5 w-5 flex-none text-(--good)"
                        />
                      ) : (
                        <Square
                          aria-hidden
                          className="mt-0.5 h-5 w-5 flex-none text-(--muted)"
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-sm font-medium text-(--ink)",
                            isChecked && "line-through decoration-(--muted)/60"
                          )}
                        >
                          {r.label}
                        </span>
                        {r.detail ? (
                          <span className="mt-1 block text-xs text-(--muted)">
                            {r.detail}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {prerequisites.assumptions && prerequisites.assumptions.length > 0 ? (
            <section aria-label="What this journey assumes">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                What this journey assumes
              </h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {prerequisites.assumptions.map((a) => (
                  <li
                    key={a.label}
                    className="rounded-md border border-(--border) bg-(--panel-2) p-3 text-sm"
                  >
                    <span className="block font-medium text-(--ink)">
                      {a.label}
                    </span>
                    {a.detail ? (
                      <span className="mt-1 block text-xs text-(--muted)">
                        {a.detail}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {prerequisites.notForYouIf &&
          prerequisites.notForYouIf.length > 0 ? (
            <section
              aria-label="When this journey isn't a fit"
              className="rounded-r-md border-l-4 border-(--warn) bg-(--warn)/8 p-3"
            >
              <h3 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-(--warn)">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                This may not be the right journey if…
              </h3>
              <ul className="ml-4 list-disc space-y-1 text-sm text-(--ink)">
                {prerequisites.notForYouIf.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {prerequisites.externalLinks &&
          prerequisites.externalLinks.length > 0 ? (
            <section
              aria-label="Official sources"
              className="flex flex-wrap gap-2 border-t border-dashed border-(--border) pt-3 text-xs"
            >
              <span className="text-(--muted)">Official sources:</span>
              {prerequisites.externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-(--accent-2) underline-offset-2 hover:underline"
                >
                  {link.label}
                  <ExternalLink aria-hidden className="h-3 w-3" />
                </a>
              ))}
            </section>
          ) : null}

          {allDone ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-(--good)/8 px-3 py-2 text-xs">
              <span className="inline-flex items-center gap-1.5 text-(--good)">
                <Check aria-hidden className="h-3.5 w-3.5" />
                All {total} confirmed — you're ready to begin.
              </span>
              <button
                type="button"
                onClick={dismiss}
                className={cn(
                  "rounded-md border border-(--good)/40 bg-(--panel) px-2 py-1 text-[11px] font-medium text-(--good)",
                  "hover:bg-(--good)/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                )}
              >
                Hide this for good
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
