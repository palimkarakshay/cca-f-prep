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

export interface SMEEdits {
  smeName?: string;
  concepts: Record<string, SMEConceptOverlay>;
  newConcepts: Record<string, SMENewConcept[]>;
  deployedAt?: string;
  deployedBy?: string;
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
  deploy: (smeName: string) => void;
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
      emit({
        ...snapshot(),
        deployedAt: new Date().toISOString(),
        deployedBy: smeName,
      });
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
