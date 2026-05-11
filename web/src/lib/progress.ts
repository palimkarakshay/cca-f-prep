import { CURRICULUM } from "@/content/curriculum";
import { masteryLevels } from "@/lib/site-config";
import {
  PROGRESS_STORAGE_KEY,
  type ConceptProgress,
  type Mastery,
  type MockProgress,
  type Progress,
  type SectionProgress,
} from "./progress-types";

/**
 * Build an empty Progress shape. If `firstSectionId` is supplied, seed
 * that section as unlocked so its concepts render as Links instead of
 * the disabled (no-link) "Stub/Locked" state. The zero-arg call seeds
 * the active pack's first section — used by tests and the back-compat
 * single-pack path. Per-pack stores call this with the *URL pack's*
 * first section id, which fixes the cross-pack "concepts don't load"
 * bug where every non-default pack had its real first section left
 * locked because the default pack's id was seeded instead.
 */
export function newProgress(firstSectionId?: string): Progress {
  const firstId = firstSectionId ?? CURRICULUM.sections[0]?.id;
  return {
    schemaVersion: 1,
    concept: {},
    section: firstId
      ? { [firstId]: { unlocked: true, testAttempts: [], complete: false } }
      : {},
    mock: {},
    location: { view: "dashboard", sectionId: null, conceptId: null, mockId: null },
  };
}

export function loadProgressFor(
  storageKey: string,
  firstSectionId?: string
): Progress {
  if (typeof window === "undefined") return newProgress(firstSectionId);
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return newProgress(firstSectionId);
    const obj = JSON.parse(raw) as Progress;
    if (!obj || obj.schemaVersion !== 1) return newProgress(firstSectionId);
    if (!obj.mock) obj.mock = {};
    if (obj.location && !("mockId" in (obj.location as object))) {
      obj.location.mockId = null;
    }
    // Self-heal: an older persisted shape may pre-date the pack-aware
    // newProgress() fix and still carry only the *default* pack's
    // first-section id as unlocked. If the caller knows this pack's
    // real first-section id and it isn't present, unlock it here so
    // the user can actually start the journey.
    if (firstSectionId && !obj.section[firstSectionId]) {
      obj.section[firstSectionId] = {
        unlocked: true,
        testAttempts: [],
        complete: false,
      };
    }
    return obj;
  } catch {
    return newProgress(firstSectionId);
  }
}

export function saveProgressFor(storageKey: string, p: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(p));
  } catch {
    /* quota / private mode — silently drop */
  }
}

/** Back-compat: env-var-default-pack scoped wrappers. */
export function loadProgress(): Progress {
  return loadProgressFor(PROGRESS_STORAGE_KEY);
}
export function saveProgress(p: Progress): void {
  saveProgressFor(PROGRESS_STORAGE_KEY, p);
}

export function ensureSection(p: Progress, id: string): SectionProgress {
  if (!p.section[id]) {
    p.section[id] = { unlocked: false, testAttempts: [], complete: false };
  }
  return p.section[id];
}

export function ensureConcept(p: Progress, id: string): ConceptProgress {
  if (!p.concept[id]) {
    p.concept[id] = {
      lessonRead: false,
      quizAttempts: [],
      mastery: 0,
      currentAttempt: null,
    };
  }
  return p.concept[id];
}

export function ensureMock(p: Progress, id: string): MockProgress {
  if (!p.mock[id]) {
    p.mock[id] = { attempts: [], currentAttempt: null };
  }
  return p.mock[id];
}

/**
 * Map a quiz attempt score to a mastery-ladder index.
 *
 * Walks the resolved `masteryLevels` array (default 5-level system,
 * pack-overridable). Levels at index 0 ("not started") and index 1
 * ("lesson read") are skipped — those are set by other code paths,
 * not by a quiz attempt. Among score-driven levels (index >= 2), we
 * pick the highest one whose `minScorePct` is satisfied.
 *
 * Falls back to index 2 ("underwhelm" by default) when total is 0
 * or no level matches.
 */
export function masteryFromScore(score: number, total: number): Mastery {
  if (total <= 0) return 0;
  const pct = score / total;
  let landed = -1;
  for (let i = 2; i < masteryLevels.length; i++) {
    const min = masteryLevels[i].minScorePct ?? 0;
    if (pct >= min) landed = i;
  }
  return landed >= 0 ? landed : 2;
}

export function isUnderwhelm(mastery: Mastery): boolean {
  return Boolean(masteryLevels[mastery]?.isUnderwhelm);
}

export function countsAsMastered(mastery: Mastery): boolean {
  return Boolean(masteryLevels[mastery]?.countsAsMastered);
}

export function isSectionPassed(p: Progress, sectionId: string): boolean {
  const s = ensureSection(p, sectionId);
  const last = s.testAttempts[s.testAttempts.length - 1];
  if (!last) return false;
  const sec = CURRICULUM.sections.find((x) => x.id === sectionId);
  const passPct = sec?.sectionTest?.passPct ?? 0.7;
  return last.total > 0 && last.score / last.total >= passPct;
}

export function unlockNextSection(p: Progress, sectionId: string): void {
  const idx = CURRICULUM.sections.findIndex((s) => s.id === sectionId);
  const next = CURRICULUM.sections[idx + 1];
  if (next) ensureSection(p, next.id).unlocked = true;
}
