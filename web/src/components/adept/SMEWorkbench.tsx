"use client";

/* ------------------------------------------------------------------
   SME workbench — the create / edit / validate / deploy surface
   for a single B2B pack.

   Reads the source curriculum from `props.pack` and overlays the
   per-pack SME edits store. Renders:

   - SME identity (name) input — saved across sessions so approvals
     can be signed without re-typing.
   - Approval summary + Deploy button.
   - Per-section concept list with status badge, inline editor,
     approve / revert actions, and "add new concept" affordance.

   All state changes route through `getSMEStore(packId)` so the
   data is persisted to localStorage and other consumers (e.g.
   the pack-side "this concept is SME-approved" badge, future
   addition) can subscribe.
------------------------------------------------------------------ */

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import {
  Check,
  PencilLine,
  Plus,
  RotateCcw,
  Rocket,
  Sparkles,
  ShieldCheck,
  X,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import {
  computeApprovalStats,
  getSMEStore,
  type OptionLetter,
  type SMEEdits,
  type SMEStatus,
  type SMEConceptOverlay,
  type SMENewConcept,
} from "@/lib/sme-edits";
import type { ContentPack } from "@/content/pack-types";
import type {
  Concept,
  MCQQuestion,
  Question,
  Section,
} from "@/content/curriculum-types";

const inputClass = cn(
  "w-full rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm",
  "text-(--ink) placeholder:text-(--muted)",
  "focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)"
);

function isMCQ(q: Question | undefined): q is MCQQuestion {
  return !!q && (q.kind === "mcq" || q.kind === undefined);
}

function effectiveTitle(c: Concept, overlay: SMEConceptOverlay | undefined) {
  return overlay?.title ?? c.title;
}

function effectiveParagraphs(
  c: Concept,
  overlay: SMEConceptOverlay | undefined
): string[] {
  return overlay?.paragraphs ?? c.lesson?.paragraphs ?? [];
}

function effectiveFirstMCQ(
  c: Concept,
  overlay: SMEConceptOverlay | undefined
): {
  source: MCQQuestion | undefined;
  question: string;
  options: Record<OptionLetter, string>;
  correct: OptionLetter;
} | null {
  const source = c.quiz?.questions.find((q) => isMCQ(q)) as
    | MCQQuestion
    | undefined;
  if (!source) return null;
  const override = overlay?.questions?.[source.n];
  return {
    source,
    question: override?.question ?? source.question,
    options: {
      A: override?.options?.A ?? source.options.A,
      B: override?.options?.B ?? source.options.B,
      C: override?.options?.C ?? source.options.C,
      D: override?.options?.D ?? source.options.D,
    },
    correct: override?.correct ?? source.correct,
  };
}

type ConceptTone = "good" | "warn" | "bad" | "default";

function STATUS_TONE(status: SMEStatus): ConceptTone {
  switch (status) {
    case "approved":
      return "good";
    case "edited":
      return "warn";
    case "rejected":
      return "bad";
    default:
      return "default";
  }
}

const STATUS_BADGE_TONE_CLASSES: Record<ConceptTone, string> = {
  good: "border-(--good) text-(--good) bg-(--good)/10",
  warn: "border-(--warn) text-(--warn) bg-(--warn)/10",
  bad: "border-(--bad) text-(--bad) bg-(--bad)/10",
  default: "border-(--border) text-(--muted) bg-(--panel-2)",
};

const STATUS_LABEL: Record<SMEStatus, string> = {
  draft: "AI draft",
  edited: "Edited — needs approval",
  approved: "Approved",
  rejected: "Rejected",
};

function StatusBadge({ status }: { status: SMEStatus }) {
  const tone = STATUS_TONE(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        STATUS_BADGE_TONE_CLASSES[tone]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SMEWorkbench({ pack }: { pack: ContentPack }) {
  const store = useMemo(() => getSMEStore(pack.config.id), [pack.config.id]);
  const edits = useSyncExternalStore<SMEEdits>(
    store.subscribe,
    store.get,
    store.getServerSnapshot
  );
  const hydrated = useHydrated();

  const conceptIds = useMemo(
    () =>
      pack.curriculum.sections.flatMap((s) => s.concepts.map((c) => c.id)),
    [pack.curriculum]
  );
  const stats = useMemo(
    () => computeApprovalStats(conceptIds, edits),
    [conceptIds, edits]
  );

  return (
    <div className="flex flex-col gap-6">
      <SMEHeader
        edits={edits}
        store={store}
        stats={stats}
        hydrated={hydrated}
      />

      <div className="flex flex-col gap-6">
        {pack.curriculum.sections.map((section) => (
          <SectionGroup
            key={section.id}
            section={section}
            edits={edits}
            store={store}
          />
        ))}
      </div>
    </div>
  );
}

function SMEHeader({
  edits,
  store,
  stats,
  hydrated,
}: {
  edits: SMEEdits;
  store: ReturnType<typeof getSMEStore>;
  stats: ReturnType<typeof computeApprovalStats>;
  hydrated: boolean;
}) {
  const nameId = useId();
  const smeName = edits.smeName ?? "";

  function handleDeploy() {
    if (!smeName.trim()) {
      alert("Add your SME name before deploying.");
      return;
    }
    if (
      !window.confirm(
        `Deploy the current approved content as ${smeName.trim()}? Learners will see this snapshot.`
      )
    ) {
      return;
    }
    store.deploy(smeName.trim());
  }

  const deployedLine = edits.deployedAt
    ? `Deployed ${new Date(edits.deployedAt).toLocaleString()} by ${edits.deployedBy ?? "unknown"}.`
    : "Not yet deployed.";

  return (
    <Card tone="accent" className="flex flex-col gap-4">
      <header className="flex items-start gap-3">
        <Sparkles aria-hidden className="h-5 w-5 flex-none text-(--accent)" />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
            SME workbench
          </h2>
          <p className="mt-0.5 text-sm text-(--muted)">
            Edit AI-drafted concepts, sign each as approved, then deploy
            the verified snapshot to learners. Changes save automatically
            in this browser.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-(--ink)">
          SME name (signed onto every approval + deploy)
          <input
            id={nameId}
            type="text"
            className={inputClass}
            value={smeName}
            onChange={(e) => store.setName(e.target.value)}
            placeholder="e.g. Anita Singh, L&D Lead"
            autoComplete="off"
          />
        </label>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <Tile label="Total" value={stats.total} tone="neutral" />
          <Tile label="Approved" value={stats.approved} tone="good" />
          <Tile label="Edited" value={stats.edited} tone="warn" />
          <Tile label="Rejected" value={stats.rejected} tone="bad" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-(--border) pt-3">
        <Button
          onClick={handleDeploy}
          disabled={!hydrated || stats.approved === 0}
          aria-disabled={!hydrated || stats.approved === 0}
        >
          <Rocket aria-hidden className="h-4 w-4" />
          Deploy approved content
        </Button>
        {stats.edited > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs text-(--warn)">
            <AlertCircle aria-hidden className="h-3.5 w-3.5" />
            {stats.edited} concept{stats.edited === 1 ? "" : "s"} edited
            but not yet approved — deploy will skip them.
          </span>
        ) : null}
        <span className="ml-auto text-xs text-(--muted)">{deployedLine}</span>
      </div>
    </Card>
  );
}

function Tile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "good" | "warn" | "bad";
}) {
  const toneClasses: Record<typeof tone, string> = {
    good: "text-(--good)",
    warn: "text-(--warn)",
    bad: "text-(--bad)",
    neutral: "text-(--ink)",
  };
  return (
    <div className="flex flex-col items-start rounded-md border border-(--border) bg-(--panel-2) px-2 py-2">
      <span className="text-[10px] uppercase tracking-wide text-(--muted)">
        {label}
      </span>
      <span className={cn("text-base font-semibold", toneClasses[tone])}>
        {value}
      </span>
    </div>
  );
}

function SectionGroup({
  section,
  edits,
  store,
}: {
  section: Section;
  edits: SMEEdits;
  store: ReturnType<typeof getSMEStore>;
}) {
  const newConcepts = edits.newConcepts[section.id] ?? [];
  return (
    <section
      aria-labelledby={`sme-${section.id}`}
      className="flex flex-col gap-3"
    >
      <header>
        <h3
          id={`sme-${section.id}`}
          className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)"
        >
          Section {section.n}: {section.title}
        </h3>
        <p className="text-sm text-(--muted)">{section.blurb}</p>
      </header>
      <ul className="flex flex-col gap-3">
        {section.concepts.map((concept) => (
          <ConceptRow
            key={concept.id}
            concept={concept}
            overlay={edits.concepts[concept.id]}
            smeName={edits.smeName ?? ""}
            store={store}
          />
        ))}
        {newConcepts.map((nc) => (
          <NewConceptRow key={nc.id} concept={nc} />
        ))}
      </ul>
      <AddConceptButton sectionId={section.id} store={store} />
    </section>
  );
}

function ConceptRow({
  concept,
  overlay,
  smeName,
  store,
}: {
  concept: Concept;
  overlay: SMEConceptOverlay | undefined;
  smeName: string;
  store: ReturnType<typeof getSMEStore>;
}) {
  const [editing, setEditing] = useState(false);
  const status = overlay?.status ?? "draft";

  function handleApprove() {
    if (!smeName.trim()) {
      alert("Add your SME name (top of page) before approving.");
      return;
    }
    store.approveConcept(concept.id, smeName.trim());
  }

  function handleReject() {
    if (!smeName.trim()) {
      alert("Add your SME name before rejecting.");
      return;
    }
    const reason = window.prompt("Reason for rejection? (optional)") ?? "";
    store.rejectConcept(concept.id, smeName.trim(), reason || undefined);
  }

  function handleRevert() {
    if (
      !window.confirm(
        "Revert all edits and approval state for this concept?"
      )
    ) {
      return;
    }
    store.revertConcept(concept.id);
  }

  return (
    <li>
      <Card tone={STATUS_TONE(status)}>
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-(--muted)">{concept.code}</p>
            <h4 className="text-base font-semibold text-(--ink)">
              {effectiveTitle(concept, overlay)}
            </h4>
            {overlay?.status === "approved" && overlay.approvedAt ? (
              <p className="mt-0.5 text-xs text-(--good)">
                <ShieldCheck
                  aria-hidden
                  className="mr-1 inline h-3.5 w-3.5 align-text-bottom"
                />
                Approved by {overlay.approvedBy} ·{" "}
                {new Date(overlay.approvedAt).toLocaleString()}
              </p>
            ) : null}
            {overlay?.status === "rejected" ? (
              <p className="mt-0.5 text-xs text-(--bad)">
                Rejected
                {overlay.rejectedReason ? ` — ${overlay.rejectedReason}` : null}
              </p>
            ) : null}
          </div>
          <StatusBadge status={status} />
        </header>

        {!editing ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditing(true)}
            >
              <PencilLine aria-hidden className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApprove}
              disabled={status === "approved"}
            >
              <Check aria-hidden className="h-4 w-4" />
              {status === "approved" ? "Approved" : "Approve"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReject}>
              <X aria-hidden className="h-4 w-4" /> Reject
            </Button>
            {overlay ? (
              <Button variant="ghost" size="sm" onClick={handleRevert}>
                <RotateCcw aria-hidden className="h-4 w-4" /> Revert
              </Button>
            ) : null}
          </div>
        ) : (
          <ConceptEditor
            concept={concept}
            overlay={overlay}
            store={store}
            onDone={() => setEditing(false)}
          />
        )}
      </Card>
    </li>
  );
}

function ConceptEditor({
  concept,
  overlay,
  store,
  onDone,
}: {
  concept: Concept;
  overlay: SMEConceptOverlay | undefined;
  store: ReturnType<typeof getSMEStore>;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(effectiveTitle(concept, overlay));
  const [paragraphsText, setParagraphsText] = useState(
    effectiveParagraphs(concept, overlay).join("\n\n")
  );
  const mcq = effectiveFirstMCQ(concept, overlay);
  const [qText, setQText] = useState(mcq?.question ?? "");
  const [optA, setOptA] = useState(mcq?.options.A ?? "");
  const [optB, setOptB] = useState(mcq?.options.B ?? "");
  const [optC, setOptC] = useState(mcq?.options.C ?? "");
  const [optD, setOptD] = useState(mcq?.options.D ?? "");
  const [correct, setCorrect] = useState<OptionLetter>(mcq?.correct ?? "A");

  function handleSave() {
    const paragraphs = paragraphsText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const update: Partial<SMEConceptOverlay> = {
      title: title.trim() || undefined,
      paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
    };

    if (mcq) {
      update.questions = {
        ...(overlay?.questions ?? {}),
        [mcq.source!.n]: {
          n: mcq.source!.n,
          question: qText.trim() || undefined,
          options: { A: optA, B: optB, C: optC, D: optD },
          correct,
        },
      };
    }

    store.upsertConcept(concept.id, update);
    onDone();
  }

  return (
    <div className="mt-3 flex flex-col gap-3 border-t border-dashed border-(--border) pt-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-(--ink)">
        Title
        <input
          type="text"
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-(--ink)">
        Lesson paragraphs
        <span className="text-xs font-normal text-(--muted)">
          One paragraph per block. Separate blocks with a blank line.
        </span>
        <textarea
          className={inputClass}
          rows={6}
          value={paragraphsText}
          onChange={(e) => setParagraphsText(e.target.value)}
        />
      </label>

      {mcq ? (
        <fieldset className="flex flex-col gap-2 rounded-md border border-dashed border-(--border) p-3">
          <legend className="text-sm font-medium text-(--ink)">
            First quiz question
          </legend>
          <label className="flex flex-col gap-1 text-xs font-medium text-(--ink)">
            Question
            <input
              type="text"
              className={inputClass}
              value={qText}
              onChange={(e) => setQText(e.target.value)}
            />
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(
              [
                ["A", optA, setOptA],
                ["B", optB, setOptB],
                ["C", optC, setOptC],
                ["D", optD, setOptD],
              ] as Array<
                [OptionLetter, string, (v: string) => void]
              >
            ).map(([letter, value, setter]) => (
              <label
                key={letter}
                className="flex items-start gap-2 text-xs text-(--ink)"
              >
                <input
                  type="radio"
                  name={`correct-${concept.id}`}
                  className="mt-2"
                  checked={correct === letter}
                  onChange={() => setCorrect(letter)}
                  aria-label={`Mark ${letter} correct`}
                />
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="font-semibold">{letter}</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave}>Save changes</Button>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function NewConceptRow({ concept }: { concept: SMENewConcept }) {
  return (
    <li>
      <Card tone={STATUS_TONE(concept.status)}>
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-(--muted)">SME-authored</p>
            <h4 className="text-base font-semibold text-(--ink)">
              {concept.title}
            </h4>
          </div>
          <StatusBadge status={concept.status} />
        </header>
        {concept.paragraphs.length > 0 ? (
          <p className="mt-2 text-sm text-(--muted)">
            {concept.paragraphs[0]}
          </p>
        ) : null}
      </Card>
    </li>
  );
}

function AddConceptButton({
  sectionId,
  store,
}: {
  sectionId: string;
  store: ReturnType<typeof getSMEStore>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function handleAdd() {
    if (!title.trim()) return;
    store.addNewConcept(sectionId, {
      id: `sme-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`,
      title: title.trim(),
      paragraphs: body.trim() ? [body.trim()] : [],
      status: "draft",
    });
    setTitle("");
    setBody("");
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="h-4 w-4" />
        Add a new concept (SME-authored)
      </Button>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-(--ink)">
          New concept title
          <input
            type="text"
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Escalation paths for L1 staff"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-(--ink)">
          One-paragraph lesson body (you can expand later)
          <textarea
            className={inputClass}
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAdd} disabled={!title.trim()}>
            Add concept
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}
