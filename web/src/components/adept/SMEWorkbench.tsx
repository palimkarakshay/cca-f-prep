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
  CalendarClock,
  FileUp,
  Trash2,
  Workflow,
  HelpCircle,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import {
  computeApprovalStats,
  getSMEStore,
  REVIEW_ROLE_DESCRIPTION,
  REVIEW_ROLE_LABEL,
  reviewHintsForConcept,
  type OptionLetter,
  type ReviewLevel,
  type ReviewRole,
  type SMEEdits,
  type SMEStatus,
  type SMEConceptOverlay,
  type SMENewConcept,
  type SourceDocument,
} from "@/lib/sme-edits";
import {
  computeLetterBiasWarnings,
  LETTER_BIAS_THRESHOLD,
} from "@/lib/sme-validation";
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
  const sourceConcepts = useMemo(
    () =>
      pack.curriculum.sections.flatMap((s) => s.concepts),
    [pack.curriculum]
  );
  const stats = useMemo(
    () => computeApprovalStats(conceptIds, edits),
    [conceptIds, edits]
  );
  const letterBiasWarnings = useMemo(
    () => computeLetterBiasWarnings(edits, sourceConcepts),
    [edits, sourceConcepts]
  );

  return (
    <div className="flex flex-col gap-6">
      <SMEHeader
        edits={edits}
        store={store}
        stats={stats}
        hydrated={hydrated}
        letterBiasWarnings={letterBiasWarnings}
      />

      <HowToReviewCard />

      <ApprovalChainCard edits={edits} store={store} hydrated={hydrated} />

      <LifecycleCard edits={edits} store={store} hydrated={hydrated} />

      <SourceDocumentsCard edits={edits} store={store} hydrated={hydrated} />

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

function HowToReviewCard() {
  return (
    <Card tone="accent">
      <header className="flex items-start gap-3">
        <HelpCircle aria-hidden className="h-5 w-5 flex-none text-(--accent)" />
        <div>
          <h3 className="text-base font-semibold text-(--ink)">
            How do I know what to edit and approve?
          </h3>
          <p className="mt-0.5 text-sm text-(--muted)">
            Every AI-drafted concept below carries a short list of
            review hints — short prompts pointing you at the part most
            worth scrutinising (lesson length, missing summaries,
            single-question quizzes, etc.). Use them as a checklist,
            not a finish line.
          </p>
        </div>
      </header>
      <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-(--muted) sm:grid-cols-2">
        <li className="flex items-start gap-2">
          <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-(--accent)" />
          <span>
            <strong className="text-(--ink)">Check facts against the
            source documents</strong> you uploaded — your signature
            means &ldquo;this matches that source today&rdquo;.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-(--accent)" />
          <span>
            <strong className="text-(--ink)">Edit before you approve</strong>
            — saved edits move a concept to &ldquo;edited — needs
            approval&rdquo;; an explicit Approve click signs and
            timestamps it.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-(--accent)" />
          <span>
            <strong className="text-(--ink)">Reject anything you
            can&apos;t validate</strong>. Rejected concepts don&apos;t
            ship in the next deploy.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-(--accent)" />
          <span>
            <strong className="text-(--ink)">Deploys reset signatures</strong>
            — every new deploy needs fresh sign-offs across the
            approval chain. Old signatures never apply to a new
            snapshot.
          </span>
        </li>
      </ul>
    </Card>
  );
}

const REVIEW_CHAIN: ReviewRole[] = ["sme", "ld-lead", "compliance"];

function ApprovalChainCard({
  edits,
  store,
  hydrated,
}: {
  edits: SMEEdits;
  store: ReturnType<typeof getSMEStore>;
  hydrated: boolean;
}) {
  const levels = edits.reviewLevels ?? [];
  function signed(role: ReviewRole): ReviewLevel | undefined {
    return levels.find((l) => l.role === role);
  }
  function handleSign(role: ReviewRole) {
    const who = window.prompt(
      `Sign off as ${REVIEW_ROLE_LABEL[role]} — your name?`,
      role === "sme" ? edits.smeName ?? "" : ""
    );
    if (!who || !who.trim()) return;
    store.signReviewLevel(role, who.trim());
  }
  function handleUnsign(role: ReviewRole) {
    if (
      !window.confirm(
        `Remove the ${REVIEW_ROLE_LABEL[role]} sign-off? This may invalidate later levels too.`
      )
    ) {
      return;
    }
    store.unsignReviewLevel(role);
  }
  return (
    <Card>
      <header className="flex items-start gap-3">
        <Workflow aria-hidden className="h-5 w-5 flex-none text-(--accent)" />
        <div>
          <h3 className="text-base font-semibold text-(--ink)">
            Approval chain
          </h3>
          <p className="mt-0.5 text-sm text-(--muted)">
            A demo of the multi-level sign-off a production rollout
            uses. Each level signs against what they own — content,
            structure, policy. Deploying clears every signature.
          </p>
        </div>
      </header>
      <ol className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {REVIEW_CHAIN.map((role, i) => {
          const sig = signed(role);
          const tone = sig ? "good" : "default";
          return (
            <li key={role}>
              <Card tone={tone} flat className="flex h-full flex-col gap-2">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-(--muted)">
                  <span
                    aria-hidden
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-(--panel-2) text-[10px] font-semibold text-(--accent-2)"
                  >
                    {i + 1}
                  </span>
                  {REVIEW_ROLE_LABEL[role]}
                </p>
                <p className="text-xs text-(--muted)">
                  {REVIEW_ROLE_DESCRIPTION[role]}
                </p>
                {sig ? (
                  <p className="mt-auto text-xs text-(--good)">
                    <ShieldCheck
                      aria-hidden
                      className="mr-1 inline h-3.5 w-3.5 align-text-bottom"
                    />
                    Signed by {sig.signedBy} ·{" "}
                    {hydrated && sig.signedAt
                      ? new Date(sig.signedAt).toLocaleString()
                      : "—"}
                  </p>
                ) : (
                  <p className="mt-auto text-xs text-(--muted)">
                    Not yet signed.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={sig ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleSign(role)}
                  >
                    <Check aria-hidden className="h-4 w-4" />
                    {sig ? "Re-sign" : "Sign off"}
                  </Button>
                  {sig ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnsign(role)}
                    >
                      <X aria-hidden className="h-4 w-4" /> Remove
                    </Button>
                  ) : null}
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function LifecycleCard({
  edits,
  store,
  hydrated,
}: {
  edits: SMEEdits;
  store: ReturnType<typeof getSMEStore>;
  hydrated: boolean;
}) {
  const liveSince = edits.liveSince;
  const expiresAt = edits.expiresAt;
  const expiryDays = edits.expiryDays;
  // We only show the expired badge after hydration so SSR + first
  // client render match. Date.now() is impure but its result only
  // gates a visual badge — gating on `hydrated` keeps the first
  // commit deterministic.
  // eslint-disable-next-line react-hooks/purity
  const expired = !!expiresAt && hydrated && new Date(expiresAt).getTime() < Date.now();
  return (
    <Card tone={expired ? "warn" : "default"}>
      <header className="flex items-start gap-3">
        <CalendarClock
          aria-hidden
          className="h-5 w-5 flex-none text-(--accent)"
        />
        <div>
          <h3 className="text-base font-semibold text-(--ink)">
            Live-since &amp; expiration
          </h3>
          <p className="mt-0.5 text-sm text-(--muted)">
            When did the current snapshot go live to learners — and
            when must it be refreshed? Compliance and certification
            journeys typically expire after a year; others stay
            live until the source material changes.
          </p>
        </div>
      </header>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Tile
          label="Live since"
          value={
            hydrated && liveSince
              ? new Date(liveSince).toLocaleDateString()
              : liveSince
                ? "—"
                : "Not deployed"
          }
          tone={liveSince ? "good" : "neutral"}
        />
        <Tile
          label="Expires"
          value={
            hydrated && expiresAt
              ? new Date(expiresAt).toLocaleDateString()
              : expiresAt
                ? "—"
                : expiryDays
                  ? "On next deploy"
                  : "No expiry set"
          }
          tone={expired ? "bad" : expiresAt ? "warn" : "neutral"}
        />
        <Tile
          label="Refresh window"
          value={
            expiryDays && expiryDays > 0
              ? `${expiryDays} days`
              : "—"
          }
          tone={expiryDays ? "neutral" : "neutral"}
        />
      </div>
      <fieldset className="mt-3 flex flex-wrap items-end gap-3 border-t border-dashed border-(--border) pt-3 text-sm">
        <legend className="sr-only">Set expiry policy</legend>
        <label className="flex flex-col gap-1 text-xs font-medium text-(--ink)">
          Set refresh window (days)
          <input
            type="number"
            min={0}
            step={30}
            defaultValue={expiryDays ?? ""}
            placeholder="365"
            className={cn(inputClass, "w-32")}
            onBlur={(e) => {
              const raw = e.currentTarget.value.trim();
              if (raw === "") {
                store.setExpiryDays(undefined);
                return;
              }
              const n = Number(raw);
              if (!Number.isFinite(n) || n < 0) return;
              store.setExpiryDays(n);
            }}
          />
        </label>
        <span className="text-xs text-(--muted)">
          Compliance / cert / tool-adoption packs: 90–365 days.
          Onboarding / language / domain: leave blank.
        </span>
      </fieldset>
      {expired ? (
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-(--warn)">
          <AlertCircle aria-hidden className="h-3.5 w-3.5" />
          This snapshot has expired. Re-verify source documents and
          deploy a fresh snapshot.
        </p>
      ) : null}
    </Card>
  );
}

function SourceDocumentsCard({
  edits,
  store,
  hydrated,
}: {
  edits: SMEEdits;
  store: ReturnType<typeof getSMEStore>;
  hydrated: boolean;
}) {
  const [name, setName] = useState("");
  const [audience, setAudience] = useState("");
  const [notes, setNotes] = useState("");
  const sources = edits.sources ?? [];

  function handleAdd() {
    const trimmedName = name.trim();
    const trimmedAudience = audience.trim();
    if (!trimmedName || !trimmedAudience) return;
    const source: SourceDocument = {
      id: `src-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`,
      name: trimmedName,
      audience: trimmedAudience,
      notes: notes.trim() || undefined,
      addedAt: new Date().toISOString(),
      addedBy: edits.smeName,
    };
    store.addSource(source);
    setName("");
    setAudience("");
    setNotes("");
  }

  return (
    <Card>
      <header className="flex items-start gap-3">
        <FileUp aria-hidden className="h-5 w-5 flex-none text-(--accent)" />
        <div>
          <h3 className="text-base font-semibold text-(--ink)">
            Source documents — what to upload, and for whom
          </h3>
          <p className="mt-0.5 text-sm text-(--muted)">
            The pack is only as accurate as the source material the
            SME signs against. Upload the documents that anchor each
            section, and tag the <em>audience</em> each one is for —
            the same word &ldquo;policy&rdquo; means different things
            to L1 support, to engineers, and to the compliance team.
          </p>
        </div>
      </header>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card tone="accent" flat>
          <p className="text-sm font-semibold text-(--ink)">
            <Users aria-hidden className="mr-1 inline h-4 w-4 align-text-bottom" />
            Pick the right document for the audience
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-xs text-(--muted)">
            <li>
              <strong className="text-(--ink)">Compliance/regulated</strong>
              {" — "}upload the *policy text + revision date*, plus your
              internal control mapping. Generic vendor whitepapers don&apos;t
              count as source-of-truth.
            </li>
            <li>
              <strong className="text-(--ink)">Role onboarding</strong>
              {" — "}upload SOPs the role actually uses, the runbooks they
              follow, and the 30/60/90-day checklist. Not the job-ad text.
            </li>
            <li>
              <strong className="text-(--ink)">Tool adoption</strong>
              {" — "}vendor docs <em>plus</em> your internal config
              decisions (which features are on/off in your tenant).
            </li>
            <li>
              <strong className="text-(--ink)">Coding skill</strong>
              {" — "}redacted production code samples, internal style guide,
              and review comments from real PRs.
            </li>
            <li>
              <strong className="text-(--ink)">Certification</strong>
              {" — "}official exam blueprint, past scenarios, and the
              vendor reference for the version learners will sit.
            </li>
          </ul>
        </Card>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-(--ink)">Add a source</p>
          <label className="flex flex-col gap-1 text-xs font-medium text-(--ink)">
            Document name / title
            <input
              type="text"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Refund policy v3 (2026-04-17)"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-(--ink)">
            Who is this for?
            <input
              type="text"
              className={inputClass}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. L1 support, NA + EMEA"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-(--ink)">
            Notes <span className="text-(--muted)">(optional)</span>
            <input
              type="text"
              className={inputClass}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. signed-off by Compliance 2026-04-18"
            />
          </label>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!name.trim() || !audience.trim()}
          >
            <Plus aria-hidden className="h-4 w-4" /> Add source
          </Button>
        </div>
      </div>

      {sources.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2 border-t border-dashed border-(--border) pt-3">
          {sources.map((s) => (
            <li
              key={s.id}
              className="flex items-start gap-3 rounded-md border border-(--border) bg-(--panel-2) p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-(--ink)">{s.name}</p>
                <p className="mt-0.5 text-xs text-(--muted)">
                  <Users
                    aria-hidden
                    className="mr-1 inline h-3 w-3 align-text-bottom"
                  />
                  Audience: {s.audience}
                </p>
                {s.notes ? (
                  <p className="mt-0.5 text-xs text-(--muted)">{s.notes}</p>
                ) : null}
                <p className="mt-0.5 text-[10px] text-(--muted)">
                  Added {hydrated ? new Date(s.addedAt).toLocaleDateString() : "—"}
                  {s.addedBy ? ` · by ${s.addedBy}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => store.removeSource(s.id)}
                aria-label={`Remove source ${s.name}`}
                className="flex-none rounded-md p-2 text-(--muted) hover:bg-(--panel) hover:text-(--bad)"
              >
                <Trash2 aria-hidden className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

function SMEHeader({
  edits,
  store,
  stats,
  hydrated,
  letterBiasWarnings,
}: {
  edits: SMEEdits;
  store: ReturnType<typeof getSMEStore>;
  stats: ReturnType<typeof computeApprovalStats>;
  hydrated: boolean;
  letterBiasWarnings: ReturnType<typeof computeLetterBiasWarnings>;
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
  const lifecycleLine = (() => {
    if (!edits.liveSince) return "";
    const parts: string[] = [];
    parts.push(
      `Live since ${new Date(edits.liveSince).toLocaleDateString()}`
    );
    if (edits.expiresAt) {
      const exp = new Date(edits.expiresAt);
      // Same pattern as LifecycleCard: gate the impure clock read on
      // `hydrated` so SSR + first client render render identically.
      // eslint-disable-next-line react-hooks/purity
      const expired = hydrated && exp.getTime() < Date.now();
      parts.push(
        `${expired ? "Expired" : "Expires"} ${exp.toLocaleDateString()}`
      );
    }
    return parts.join(" · ");
  })();

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
        <div className="ml-auto flex flex-col items-end gap-0.5 text-xs text-(--muted)">
          <span>{deployedLine}</span>
          {hydrated && lifecycleLine ? <span>{lifecycleLine}</span> : null}
        </div>
      </div>

      {letterBiasWarnings.length > 0 ? (
        <div
          className="flex items-start gap-2 rounded-md border border-(--warn) bg-(--panel-2) p-3 text-xs text-(--ink)"
          role="status"
        >
          <AlertCircle
            aria-hidden
            className="mt-0.5 h-4 w-4 flex-none text-(--warn)"
          />
          <div className="flex-1">
            <p className="font-semibold">
              Correct-answer letter is skewed on{" "}
              {letterBiasWarnings.length} concept
              {letterBiasWarnings.length === 1 ? "" : "s"}.
            </p>
            <p className="mt-0.5 text-(--muted)">
              Aim for the correct letter to land roughly evenly across
              A/B/C/D (threshold: {Math.round(LETTER_BIAS_THRESHOLD * 100)}
              % on a single letter). Non-blocking — you can still deploy.
            </p>
            <ul className="mt-1.5 list-disc pl-4">
              {letterBiasWarnings.map((w) => (
                <li key={w.conceptId}>
                  <code>{w.conceptId}</code>: {w.worstLetter} ={" "}
                  {w.counts[w.worstLetter]}/{w.total} (
                  {Math.round(w.worstPct * 100)}%)
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function Tile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
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
  const [showHints, setShowHints] = useState(false);
  const status = overlay?.status ?? "draft";
  const hints = useMemo(() => reviewHintsForConcept(concept), [concept]);

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
          <>
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
              <button
                type="button"
                onClick={() => setShowHints((v) => !v)}
                aria-expanded={showHints}
                aria-controls={`hints-${concept.id}`}
                className="ml-auto inline-flex items-center gap-1 text-xs text-(--accent-2) underline-offset-4 hover:underline"
              >
                <HelpCircle aria-hidden className="h-3.5 w-3.5" />
                {showHints
                  ? `Hide review hints (${hints.length})`
                  : `Show review hints (${hints.length})`}
              </button>
            </div>
            {showHints ? (
              <div
                id={`hints-${concept.id}`}
                className="mt-3 rounded-md border border-dashed border-(--border) bg-(--panel-2) p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
                  What to check before signing
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 text-xs text-(--muted)">
                  {hints.map((h) => (
                    <li key={h.label}>
                      <strong className="text-(--ink)">{h.label}.</strong>{" "}
                      {h.guidance}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
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
