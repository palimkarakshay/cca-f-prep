/* ------------------------------------------------------------------
   SME edits store — Adept workbench persistence.

   For each B2B pack, the SME workbench tracks an *overlay* on top of
   the AI-drafted curriculum: per-concept edits + approvals, optional
   new concepts the SME drafts from scratch, plus a pack-level
   deploy stamp. The original `ContentPack.curriculum` is the
   immutable source-of-truth draft; this overlay describes what the
   SME changed and approved.

   Storage shape (versioned via key suffix `:v1`):

     {
       smeName?:   string                // remembered between sessions
       concepts:   { [conceptId]: SMEConceptOverlay }
       newConcepts:{ [sectionId]: SMENewConcept[] } // SME-authored only
       deployedAt?:string                // last full-pack deploy ISO timestamp
       deployedBy?:string                // SME name at deploy time
     }

   Status semantics (per concept):
     - "draft"     — AI-drafted, untouched. Default for source concepts.
     - "edited"    — SME has saved overrides, hasn't approved yet.
     - "approved"  — SME has signed off; approval carries name + at.
     - "rejected"  — SME explicitly removed this concept from the deploy.
                     (Rejected concepts stay visible in the workbench
                     but don't roll into the deploy snapshot.)
------------------------------------------------------------------ */

export const SME_EDITS_VERSION = "v1";

export function smeEditsStorageKey(packId: string): string {
  return `adept:sme-edits:${packId}:${SME_EDITS_VERSION}`;
}

export type SMEStatus = "draft" | "edited" | "approved" | "rejected";

export type OptionLetter = "A" | "B" | "C" | "D";

/**
 * Minimal editable surface of a single MCQ question. The SME edits
 * the prompt text + the four options + which is correct. The
 * original question's `n` is preserved for re-merge.
 */
export interface SMEQuestionOverlay {
  n: number;
  question?: string;
  options?: Partial<Record<OptionLetter, string>>;
  correct?: OptionLetter;
}

/**
 * Per-concept overlay. Each field is optional — absent fields mean
 * "use the source-curriculum value unchanged".
 */
export interface SMEConceptOverlay {
  title?: string;
  /** Lesson body as one paragraph per array entry. */
  paragraphs?: string[];
  /** Quiz overrides indexed by question.n. */
  questions?: Record<number, SMEQuestionOverlay>;
  status: SMEStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectedReason?: string;
}

/**
 * SME-authored new concept that doesn't exist in the source pack.
 * Stored under the section id the SME added it to.
 */
export interface SMENewConcept {
  id: string;
  title: string;
  paragraphs: string[];
  status: SMEStatus;
  approvedBy?: string;
  approvedAt?: string;
}

/**
 * Approval-chain step. A real journey ships through multiple reviewers
 * — the SME signs the content, the L&D lead signs the structure, and
 * (for compliance journeys) a compliance reviewer signs the final
 * shape. Each step records who signed and when.
 */
export type ReviewRole = "sme" | "ld-lead" | "compliance";

export interface ReviewLevel {
  role: ReviewRole;
  signedBy?: string;
  signedAt?: string;
}

export const REVIEW_ROLE_LABEL: Record<ReviewRole, string> = {
  sme: "Subject-matter expert",
  "ld-lead": "L&D lead",
  compliance: "Compliance reviewer",
};

export const REVIEW_ROLE_DESCRIPTION: Record<ReviewRole, string> = {
  sme: "Signs that the content is factually accurate against the source documents.",
  "ld-lead":
    "Signs that the structure, success criteria, and applied practice are sound.",
  compliance:
    "Signs (for compliance / regulated journeys) that wording matches the controlling policy.",
};

/**
 * A single source document the SME uploaded as raw material for the
 * pack. We don't store the binary in the demo — just the metadata —
 * so the workbench can show "what was used" without server storage.
 */
export interface SourceDocument {
  id: string;
  /** Display name (file name or short title). */
  name: string;
  /** Free-form label of who this is for ("L1 support, NA + EMEA"). */
  audience: string;
  /** Free-form notes ("revision 2026-04-17, signed by Compliance"). */
  notes?: string;
  /** ISO timestamp it was added to the workbench. */
  addedAt: string;
  /** Who added it. */
  addedBy?: string;
}

export interface SMEEdits {
  smeName?: string;
  concepts: Record<string, SMEConceptOverlay>;
  newConcepts: Record<string, SMENewConcept[]>;
  deployedAt?: string;
  deployedBy?: string;
  /**
   * When the *current* deploy went live to learners. Set to the same
   * ISO as `deployedAt` on deploy; null before first deploy. Kept as a
   * separate field so a future "rollback" action can decouple
   * "deployed" (snapshot exists) from "live" (it's serving learners).
   */
  liveSince?: string;
  /**
   * ISO date the current live snapshot expires. Pack types with an
   * expiry recommendation (compliance, certification, tool adoption)
   * default to a year from `liveSince`; others stay undefined unless
   * the L&D lead sets one explicitly.
   */
  expiresAt?: string;
  /** Days-from-deploy used to compute the next `expiresAt`. */
  expiryDays?: number;
  /** Approval-chain steps (SME → L&D Lead → Compliance). */
  reviewLevels?: ReviewLevel[];
  /** Uploaded source documents with audience tagging. */
  sources?: SourceDocument[];
}

export function emptyEdits(): SMEEdits {
  return {
    concepts: {},
    newConcepts: {},
  };
}

function isOverlay(value: unknown): value is SMEConceptOverlay {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.status === "string" &&
    ["draft", "edited", "approved", "rejected"].includes(v.status as string)
  );
}

export function readEdits(packId: string): SMEEdits {
  if (typeof window === "undefined") return emptyEdits();
  try {
    const raw = window.localStorage.getItem(smeEditsStorageKey(packId));
    if (!raw) return emptyEdits();
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return emptyEdits();
    const concepts: Record<string, SMEConceptOverlay> = {};
    const rawConcepts = (parsed as { concepts?: unknown }).concepts;
    if (rawConcepts && typeof rawConcepts === "object") {
      for (const [k, v] of Object.entries(rawConcepts as object)) {
        if (isOverlay(v)) concepts[k] = v;
      }
    }
    const newConcepts: Record<string, SMENewConcept[]> = {};
    const rawNew = (parsed as { newConcepts?: unknown }).newConcepts;
    if (rawNew && typeof rawNew === "object") {
      for (const [k, v] of Object.entries(rawNew as object)) {
        if (Array.isArray(v)) {
          newConcepts[k] = v.filter(
            (n) =>
              typeof n === "object" &&
              n !== null &&
              typeof (n as Record<string, unknown>).id === "string"
          ) as SMENewConcept[];
        }
      }
    }
    const reviewLevelsRaw = (parsed as { reviewLevels?: unknown }).reviewLevels;
    const reviewLevels: ReviewLevel[] | undefined = Array.isArray(reviewLevelsRaw)
      ? reviewLevelsRaw
          .filter(
            (l): l is Record<string, unknown> =>
              typeof l === "object" && l !== null
          )
          .filter(
            (l) =>
              typeof l.role === "string" &&
              ["sme", "ld-lead", "compliance"].includes(l.role as string)
          )
          .map((l) => ({
            role: l.role as ReviewRole,
            signedBy:
              typeof l.signedBy === "string" ? l.signedBy : undefined,
            signedAt:
              typeof l.signedAt === "string" ? l.signedAt : undefined,
          }))
      : undefined;

    const sourcesRaw = (parsed as { sources?: unknown }).sources;
    const sources: SourceDocument[] | undefined = Array.isArray(sourcesRaw)
      ? sourcesRaw
          .filter(
            (s): s is Record<string, unknown> =>
              typeof s === "object" && s !== null
          )
          .filter(
            (s) =>
              typeof s.id === "string" &&
              typeof s.name === "string" &&
              typeof s.audience === "string" &&
              typeof s.addedAt === "string"
          )
          .map((s) => ({
            id: s.id as string,
            name: s.name as string,
            audience: s.audience as string,
            notes: typeof s.notes === "string" ? s.notes : undefined,
            addedAt: s.addedAt as string,
            addedBy:
              typeof s.addedBy === "string" ? s.addedBy : undefined,
          }))
      : undefined;

    const out: SMEEdits = {
      concepts,
      newConcepts,
      smeName:
        typeof (parsed as { smeName?: unknown }).smeName === "string"
          ? ((parsed as { smeName: string }).smeName)
          : undefined,
      deployedAt:
        typeof (parsed as { deployedAt?: unknown }).deployedAt === "string"
          ? ((parsed as { deployedAt: string }).deployedAt)
          : undefined,
      deployedBy:
        typeof (parsed as { deployedBy?: unknown }).deployedBy === "string"
          ? ((parsed as { deployedBy: string }).deployedBy)
          : undefined,
      liveSince:
        typeof (parsed as { liveSince?: unknown }).liveSince === "string"
          ? ((parsed as { liveSince: string }).liveSince)
          : undefined,
      expiresAt:
        typeof (parsed as { expiresAt?: unknown }).expiresAt === "string"
          ? ((parsed as { expiresAt: string }).expiresAt)
          : undefined,
      expiryDays:
        typeof (parsed as { expiryDays?: unknown }).expiryDays === "number"
          ? ((parsed as { expiryDays: number }).expiryDays)
          : undefined,
      reviewLevels,
      sources,
    };
    return out;
  } catch {
    return emptyEdits();
  }
}

export function writeEdits(packId: string, edits: SMEEdits): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      smeEditsStorageKey(packId),
      JSON.stringify(edits)
    );
  } catch {
    // Quota or disabled storage — swallow.
  }
}

/* ------------------------------------------------------------------
   useSyncExternalStore-compatible per-pack store factory.

   The workbench renders the same store via useSyncExternalStore so
   approvals + deploys propagate without setState-in-effect. The
   server snapshot is referentially stable + empty so React 19's
   hydration check doesn't complain (matches the pattern in
   learning-goals.ts).
------------------------------------------------------------------ */

type Listener = () => void;

const EMPTY_EDITS: Readonly<SMEEdits> = Object.freeze({
  concepts: {},
  newConcepts: {},
}) as SMEEdits;

type PerPackStore = {
  subscribe: (l: Listener) => () => void;
  get: () => SMEEdits;
  getServerSnapshot: () => SMEEdits;
  setName: (name: string) => void;
  upsertConcept: (
    conceptId: string,
    next: Partial<SMEConceptOverlay>
  ) => void;
  approveConcept: (conceptId: string, smeName: string) => void;
  rejectConcept: (
    conceptId: string,
    smeName: string,
    reason?: string
  ) => void;
  revertConcept: (conceptId: string) => void;
  addNewConcept: (sectionId: string, concept: SMENewConcept) => void;
  /**
   * Pack-level deploy. Stamps deployedAt + liveSince and, if
   * `expiryDays` is set, computes the next `expiresAt`. Wipes any
   * previously-signed review levels so the new snapshot has to be
   * re-signed top-to-bottom — fail-closed on chain-of-custody.
   */
  deploy: (smeName: string) => void;
  /** Set the expiry policy (days) — updates `expiresAt` if live. */
  setExpiryDays: (days: number | undefined) => void;
  /** Sign one level of the approval chain. */
  signReviewLevel: (role: ReviewRole, signerName: string) => void;
  /** Unwind a single level (e.g. when a higher-level rejects). */
  unsignReviewLevel: (role: ReviewRole) => void;
  /** Add a source document. */
  addSource: (source: SourceDocument) => void;
  /** Remove a source document by id. */
  removeSource: (id: string) => void;
  _resetForTests: () => void;
};

const STORES = new Map<string, PerPackStore>();

export function getSMEStore(packId: string): PerPackStore {
  const existing = STORES.get(packId);
  if (existing) return existing;

  let cached: SMEEdits | null = null;
  const listeners = new Set<Listener>();

  function snapshot(): SMEEdits {
    if (typeof window === "undefined") return EMPTY_EDITS;
    if (cached === null) cached = readEdits(packId);
    return cached;
  }

  function emit(next: SMEEdits): void {
    cached = next;
    writeEdits(packId, next);
    for (const l of listeners) l();
  }

  const store: PerPackStore = {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get: snapshot,
    getServerSnapshot() {
      return EMPTY_EDITS;
    },
    setName(name) {
      emit({ ...snapshot(), smeName: name });
    },
    upsertConcept(conceptId, next) {
      const current = snapshot();
      const prev: SMEConceptOverlay = current.concepts[conceptId] ?? {
        status: "draft",
      };
      // Any save bumps status from draft to edited; if it was already
      // approved we go back to "edited" so the SME has to re-sign.
      const status: SMEStatus =
        next.status ?? (prev.status === "approved" ? "edited" : "edited");
      const merged: SMEConceptOverlay = {
        ...prev,
        ...next,
        status,
      };
      // Wipe stale approval metadata when status drops below approved.
      if (status !== "approved") {
        delete merged.approvedAt;
        delete merged.approvedBy;
      }
      emit({
        ...current,
        concepts: { ...current.concepts, [conceptId]: merged },
      });
    },
    approveConcept(conceptId, smeName) {
      const current = snapshot();
      const prev: SMEConceptOverlay = current.concepts[conceptId] ?? {
        status: "draft",
      };
      emit({
        ...current,
        concepts: {
          ...current.concepts,
          [conceptId]: {
            ...prev,
            status: "approved",
            approvedBy: smeName,
            approvedAt: new Date().toISOString(),
            rejectedAt: undefined,
            rejectedReason: undefined,
          },
        },
      });
    },
    rejectConcept(conceptId, smeName, reason) {
      const current = snapshot();
      const prev: SMEConceptOverlay = current.concepts[conceptId] ?? {
        status: "draft",
      };
      emit({
        ...current,
        concepts: {
          ...current.concepts,
          [conceptId]: {
            ...prev,
            status: "rejected",
            rejectedAt: new Date().toISOString(),
            rejectedReason: reason,
            approvedAt: undefined,
            approvedBy: smeName,
          },
        },
      });
    },
    revertConcept(conceptId) {
      const current = snapshot();
      const concepts = { ...current.concepts };
      delete concepts[conceptId];
      emit({ ...current, concepts });
    },
    addNewConcept(sectionId, concept) {
      const current = snapshot();
      const list = current.newConcepts[sectionId] ?? [];
      emit({
        ...current,
        newConcepts: {
          ...current.newConcepts,
          [sectionId]: [...list, concept],
        },
      });
    },
    deploy(smeName) {
      const current = snapshot();
      const now = new Date();
      const nowIso = now.toISOString();
      const expiresAt =
        current.expiryDays && current.expiryDays > 0
          ? new Date(
              now.getTime() + current.expiryDays * 24 * 60 * 60 * 1000
            ).toISOString()
          : undefined;
      emit({
        ...current,
        deployedAt: nowIso,
        deployedBy: smeName,
        liveSince: nowIso,
        expiresAt,
        // Reset the review chain — every new deploy needs fresh
        // signatures so the audit trail never reuses an old sign-off
        // against a new snapshot.
        reviewLevels: undefined,
      });
    },
    setExpiryDays(days) {
      const current = snapshot();
      const next: SMEEdits = { ...current, expiryDays: days };
      if (current.liveSince && days && days > 0) {
        const live = new Date(current.liveSince);
        next.expiresAt = new Date(
          live.getTime() + days * 24 * 60 * 60 * 1000
        ).toISOString();
      } else if (!days || days <= 0) {
        next.expiresAt = undefined;
      }
      emit(next);
    },
    signReviewLevel(role, signerName) {
      const current = snapshot();
      const levels = current.reviewLevels ?? [];
      const next: ReviewLevel[] = [
        ...levels.filter((l) => l.role !== role),
        {
          role,
          signedBy: signerName,
          signedAt: new Date().toISOString(),
        },
      ];
      emit({ ...current, reviewLevels: next });
    },
    unsignReviewLevel(role) {
      const current = snapshot();
      const next = (current.reviewLevels ?? []).filter(
        (l) => l.role !== role
      );
      emit({ ...current, reviewLevels: next });
    },
    addSource(source) {
      const current = snapshot();
      const sources = current.sources ?? [];
      emit({ ...current, sources: [...sources, source] });
    },
    removeSource(id) {
      const current = snapshot();
      const sources = (current.sources ?? []).filter((s) => s.id !== id);
      emit({ ...current, sources });
    },
    _resetForTests() {
      cached = null;
      listeners.clear();
    },
  };

  STORES.set(packId, store);
  return store;
}

/** Test-only: clear every per-pack store instance + storage. */
export function _resetAllSMEStoresForTests(): void {
  for (const store of STORES.values()) store._resetForTests();
  STORES.clear();
}

/* ------------------------------------------------------------------
   Derived helpers for the workbench UI.
------------------------------------------------------------------ */

/**
 * Counts of approved / edited / draft / rejected concepts in the
 * pack, accounting for overlay state. Used in the workbench
 * header and the deploy-readiness banner.
 */
export interface ApprovalStats {
  total: number;
  approved: number;
  edited: number;
  draft: number;
  rejected: number;
  readyToDeploy: boolean;
}

/* ------------------------------------------------------------------
   Review hints — deterministic checks that point the SME at the
   parts of an AI-drafted concept most worth scrutinising. These are
   not warnings; they're prompts. The workbench surfaces them
   per-concept so the SME knows *what to look for*, instead of
   reading every lesson cold and hoping to spot issues.
------------------------------------------------------------------ */

export interface ReviewHint {
  /** Short hint label ("Verify against source"). */
  label: string;
  /** What the SME should actually check. */
  guidance: string;
}

/**
 * Yield review hints for an AI-drafted concept. The checks are
 * pure, deterministic, and content-free — they look at length,
 * presence/absence of key shapes, and the quiz structure. This is
 * what the workbench shows under "How to review this concept".
 */
export function reviewHintsForConcept(
  concept: {
    title: string;
    lesson?: { paragraphs?: string[]; simplified?: { oneLiner?: string } } | null;
    quiz?: { questions: Array<{ kind?: string }> } | null;
  }
): ReviewHint[] {
  const hints: ReviewHint[] = [];
  const paragraphs = concept.lesson?.paragraphs ?? [];
  const lessonChars = paragraphs.join(" ").length;

  if (lessonChars < 240) {
    hints.push({
      label: "Lesson body is short",
      guidance:
        "Under ~240 characters. Check whether enough context is given for a learner who's seeing this for the first time.",
    });
  }
  if (lessonChars > 1800) {
    hints.push({
      label: "Lesson body is long",
      guidance:
        "Over ~1800 characters. Look for paragraphs that can be split into a separate concept or trimmed to a single idea each.",
    });
  }
  if (!concept.lesson?.simplified?.oneLiner) {
    hints.push({
      label: "No one-line summary",
      guidance:
        "Add a one-line plain-English summary. It's the anchor the learner re-reads when they're stuck.",
    });
  }
  const questions = concept.quiz?.questions ?? [];
  if (questions.length === 0) {
    hints.push({
      label: "No quiz authored",
      guidance: "Add at least one MCQ that maps to the concept's principle, not just recall.",
    });
  } else if (questions.length < 2) {
    hints.push({
      label: "Only one quiz question",
      guidance:
        "Consider a second question that probes the *opposite* shape — e.g., when this concept does *not* apply.",
    });
  }

  hints.push({
    label: "Verify against source",
    guidance:
      "Read the matching paragraph in the source documents above. The SME signature on this concept means \"the lesson matches that source as of today\".",
  });

  return hints;
}

export function computeApprovalStats(
  conceptIds: string[],
  edits: SMEEdits
): ApprovalStats {
  let approved = 0;
  let edited = 0;
  let rejected = 0;
  for (const id of conceptIds) {
    const status: SMEStatus = edits.concepts[id]?.status ?? "draft";
    if (status === "approved") approved++;
    else if (status === "edited") edited++;
    else if (status === "rejected") rejected++;
  }
  const draft = conceptIds.length - approved - edited - rejected;
  // A pack is ready to deploy when at least one concept is approved
  // and there are no "edited" overlays awaiting sign-off. Draft
  // concepts are fine — they ship unchanged.
  const readyToDeploy = approved > 0 && edited === 0;
  return {
    total: conceptIds.length,
    approved,
    edited,
    draft,
    rejected,
    readyToDeploy,
  };
}
