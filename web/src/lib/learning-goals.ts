/* ------------------------------------------------------------------
   Learning goals — umbrella-level (brand-namespaced, not pack-scoped).

   A "learning goal" captures what a visitor said they want to learn,
   before any content pack exists for it. It is the raw signal the
   product later uses to (a) prioritise pack authoring and (b) seed
   AI-generated draft packs. Stored in localStorage as a plain JSON
   array; no server round-trip yet.

   Schema (versioned via STORAGE_KEY suffix):
     - id               opaque string, stable across edits
     - createdAt        ISO timestamp
     - topic            "What do you want to learn?" (required)
     - success          "What does success look like?" (required)
     - endUse           "How will you use it once you've learned it?" (required)
     - currentLevel     self-rated starting point (optional)
     - motivation       "Why now?" (optional)
     - validation       "How will you verify mastery?" (optional)
     - timeline         target completion (optional)

   Required fields are the three Wiggins/McTighe "backward-design"
   anchors — outcome (success), transfer (endUse), and topic. The
   rest are SMART-goal sharpeners surfaced behind an "Add detail"
   disclosure so the form doesn't bury the lede.
------------------------------------------------------------------ */

export const LEARNING_GOAL_STORAGE_KEY = "curio:learning-goals:v1";

export type CurrentLevel =
  | "brand-new"
  | "some-exposure"
  | "working-knowledge"
  | "intermediate"
  | "refresh";

export const CURRENT_LEVEL_LABELS: Record<CurrentLevel, string> = {
  "brand-new": "Brand new — never touched it",
  "some-exposure": "Some exposure — read about it, dabbled",
  "working-knowledge": "Working knowledge — can use it with guidance",
  intermediate: "Intermediate — independent on routine tasks",
  refresh: "Returning to refresh",
};

export interface LearningGoal {
  id: string;
  createdAt: string;
  topic: string;
  success: string;
  endUse: string;
  currentLevel?: CurrentLevel;
  motivation?: string;
  validation?: string;
  timeline?: string;
}

export type LearningGoalDraft = Omit<LearningGoal, "id" | "createdAt">;

/**
 * Read goals from localStorage. Returns [] on parse failure rather
 * than throwing — the form should still render if storage is poisoned.
 */
export function readGoals(): LearningGoal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEARNING_GOAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLearningGoal);
  } catch {
    return [];
  }
}

export function writeGoals(goals: LearningGoal[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LEARNING_GOAL_STORAGE_KEY,
      JSON.stringify(goals)
    );
  } catch {
    // Storage quota / disabled storage — swallow; the in-memory state
    // still reflects the user's submission for the current session.
  }
}

export function makeGoal(draft: LearningGoalDraft): LearningGoal {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...draft,
  };
}

function isLearningGoal(value: unknown): value is LearningGoal {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.createdAt === "string" &&
    typeof v.topic === "string" &&
    typeof v.success === "string" &&
    typeof v.endUse === "string"
  );
}

/* ------------------------------------------------------------------
   External store — for useSyncExternalStore consumers.

   Project convention (see hooks/useHydrated.ts) is to read browser-
   only state through useSyncExternalStore rather than
   useState+useEffect, so the lint rule
   `react-hooks/set-state-in-effect` stays satisfied without
   per-call-site suppressions. The store keeps a single in-memory
   array and reflects every mutation back to localStorage; SSR sees
   the empty server snapshot, and hydration flips in via
   `useHydrated()` so the first client render matches the server.
------------------------------------------------------------------ */

type Listener = () => void;

const EMPTY_GOALS: ReadonlyArray<LearningGoal> = Object.freeze([]);

let cached: LearningGoal[] | null = null;
const listeners = new Set<Listener>();

function getSnapshot(): LearningGoal[] {
  if (typeof window === "undefined") return EMPTY_GOALS as LearningGoal[];
  if (cached === null) cached = readGoals();
  return cached;
}

function emit(next: LearningGoal[]): void {
  cached = next;
  writeGoals(next);
  for (const l of listeners) l();
}

export const goalStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: getSnapshot,
  getServerSnapshot(): LearningGoal[] {
    return EMPTY_GOALS as LearningGoal[];
  },
  add(goal: LearningGoal): void {
    emit([goal, ...getSnapshot()]);
  },
  remove(id: string): void {
    emit(getSnapshot().filter((g) => g.id !== id));
  },
  /** Test-only — reset cache so each test starts from a clean slate. */
  _resetForTests(): void {
    cached = null;
    listeners.clear();
  },
};
