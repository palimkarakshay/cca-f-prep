"use client";

/* ------------------------------------------------------------------
   DesignerJourneyDecoder — L&D-expert lane on the home page.

   Mirrors the learner's two-question form but asks the same
   questions from the *designer's* point of view:
     1. What capability does the audience need? (the gap)
     2. Why does the audience need it now? (the business driver)

   The decoder runs locally and returns a structured brief — section
   spine, success signals, audience cues, suggested source documents
   to upload, an estimated time-on-task, and a flag for whether the
   journey should carry an expiration date. Designers get the
   decoded brief inline so they can scope the SME engagement before
   ever opening the workbench.

   The decoded brief is *not* persisted — designers iterate on it
   live. There's a "Continue in the SME workbench" CTA at the bottom
   that funnels into /adept once they're happy with the shape.
------------------------------------------------------------------ */

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Target,
  Users,
  FileUp,
  Clock,
  CalendarClock,
  ArrowRight,
  Hammer,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  decodeJourney,
  JOURNEY_KIND_LABEL,
  type DecodedJourney,
} from "@/lib/journey-decoder";
import { BRAND } from "@/lib/brand";

const inputClass = cn(
  "w-full rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm",
  "text-(--ink) placeholder:text-(--muted)",
  "focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
);

const labelClass = "flex flex-col gap-1 text-sm font-medium text-(--ink)";
const helpClass = "text-xs font-normal text-(--muted)";

export function DesignerJourneyDecoder() {
  const formId = useId();
  const [what, setWhat] = useState("");
  const [why, setWhy] = useState("");
  const [audience, setAudience] = useState("");
  const decoded: DecodedJourney | null = useMemo(() => {
    if (what.trim().length < 3 && why.trim().length < 3) return null;
    return decodeJourney({ what, why });
  }, [what, why]);

  return (
    <Card tone="accent" className="flex flex-col gap-4">
      <header className="flex items-start gap-3">
        <Briefcase aria-hidden className="h-5 w-5 flex-none text-(--accent)" />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
            Designing a journey for someone else?
          </h2>
          <p className="mt-0.5 text-sm text-(--muted)">
            For L&amp;D leads, instructional designers, and SMEs. Tell us the
            capability gap and the business reason — we&apos;ll decode it
            into a structured brief you can take into the SME workbench.
          </p>
        </div>
      </header>

      <form
        id={formId}
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
      >
        <label className={cn(labelClass, "md:col-span-2")}>
          What capability does the audience need?
          <span className={helpClass}>
            Stated as the gap, not the content. &ldquo;L1 support agents need
            to resolve refund tickets unaided in 90 days&rdquo; beats
            &ldquo;Refund policy training&rdquo;.
          </span>
          <input
            type="text"
            name="what"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="e.g. New L1 support agents resolve refund tickets unaided"
            className={inputClass}
            autoComplete="off"
          />
        </label>

        <label className={labelClass}>
          Why does the business need this now?
          <span className={helpClass}>
            The driver. Audit, hiring wave, new tool, regulator, deadline.
          </span>
          <input
            type="text"
            name="why"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="e.g. Hiring wave of 40 agents in Q3 — current ramp is 6 months"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Who, more specifically? <span className="text-(--muted)">(optional)</span>
          <span className={helpClass}>
            Used to scope audience cues — not stored.
          </span>
          <input
            type="text"
            name="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. Remote L1 agents, NA + EMEA, no prior support experience"
            className={inputClass}
          />
        </label>
      </form>

      {decoded ? (
        <DesignerBrief decoded={decoded} audience={audience} />
      ) : (
        <p className="rounded-md bg-(--panel-2) p-3 text-xs text-(--muted)">
          Fill in the capability gap + business driver above. We&apos;ll
          decode them into a section spine, success signals, source
          documents your SME should upload, and a recommended
          time-on-task — live, as you type.
        </p>
      )}
    </Card>
  );
}

function DesignerBrief({
  decoded,
  audience,
}: {
  decoded: DecodedJourney;
  audience: string;
}) {
  return (
    <section
      aria-label="Designer brief"
      className="flex flex-col gap-4 rounded-md border border-(--border) bg-(--panel-2) p-4"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-(--ink)">
          <ClipboardList aria-hidden className="h-4 w-4 text-(--accent)" />
          Designer brief — auto-decoded
        </h3>
        <span className="rounded-full border border-(--accent)/40 bg-(--accent)/10 px-2 py-0.5 text-xs font-medium text-(--accent-2)">
          {JOURNEY_KIND_LABEL[decoded.kind]}
        </span>
      </header>

      <p className="text-sm text-(--ink)">{decoded.designerBrief}</p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Target aria-hidden className="h-3.5 w-3.5" /> Success signals
          </p>
          <ul className="mt-1 flex flex-col gap-1 text-xs text-(--muted)">
            {decoded.successSignals.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
            <Users aria-hidden className="h-3.5 w-3.5" /> Audience cues to pin
          </p>
          <ul className="mt-1 flex flex-col gap-1 text-xs text-(--muted)">
            {audience.trim() ? (
              <li className="text-(--ink)">
                You said: <em>{audience.trim()}</em>
              </li>
            ) : null}
            {decoded.audienceCues.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          <Hammer aria-hidden className="h-3.5 w-3.5" /> Section spine + applied
          experience
        </p>
        <ol className="mt-1 flex flex-col gap-1.5 text-xs text-(--muted)">
          {decoded.sectionSpine.map((s, i) => (
            <li key={s.title} className="flex items-start gap-2">
              <span className="mt-0.5 font-mono text-[10px] text-(--accent-2)">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span>
                <span className="font-medium text-(--ink)">{s.title}</span>
                <br />
                <span className="italic">Applied: {s.applied}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
          <FileUp aria-hidden className="h-3.5 w-3.5" /> Source documents to
          gather from the SME
        </p>
        <ul className="mt-1 flex flex-col gap-1.5 text-xs text-(--muted)">
          {decoded.suggestedSources.map((s) => (
            <li key={s.label} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 inline-flex h-4 flex-none items-center rounded-full border px-1.5 text-[10px] font-semibold",
                  s.required
                    ? "border-(--warn)/40 bg-(--warn)/10 text-(--warn)"
                    : "border-(--border) text-(--muted)"
                )}
              >
                {s.required ? "Required" : "Optional"}
              </span>
              <span>
                <span className="font-medium text-(--ink)">{s.label}</span> —{" "}
                {s.rationale}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2 text-xs text-(--muted)">
          <Clock aria-hidden className="mt-0.5 h-3.5 w-3.5 text-(--accent)" />
          <span>
            <span className="font-medium text-(--ink)">Time on task:</span>{" "}
            ~{decoded.estimatedHours.low}–{decoded.estimatedHours.high} hours
            per learner. Plan SME-author + verify ≈ 1.5× that.
          </span>
        </div>
        <div className="flex items-start gap-2 text-xs text-(--muted)">
          <CalendarClock
            aria-hidden
            className="mt-0.5 h-3.5 w-3.5 text-(--accent)"
          />
          <span>
            <span className="font-medium text-(--ink)">Expiration:</span>{" "}
            {decoded.recommendsExpiry
              ? "Set an expiration date — content goes stale and learners must refresh."
              : "Not typically time-bound. Refresh when source material changes."}
          </span>
        </div>
      </div>

      <footer className="flex flex-wrap items-center gap-3 border-t border-dashed border-(--border) pt-3">
        <Link
          href="/adept"
          className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-(--accent-2)"
        >
          <Sparkles aria-hidden className="h-4 w-4" />
          Continue in the {BRAND.b2bName} workbench
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        <span className="text-xs text-(--muted)">
          You&apos;ll land on the demo packs and the SME edit/approve/deploy
          surface.
        </span>
      </footer>
    </section>
  );
}
