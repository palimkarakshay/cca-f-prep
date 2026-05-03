import { CURRICULUM } from "@/content/curriculum";
import {
  PROGRESS_STORAGE_KEY,
  type ConceptProgress,
  type Mastery,
  type MockProgress,
  type Progress,
  type SectionProgress,
} from "./progress-types";

export function newProgress(): Progress {
  const first = CURRICULUM.sections[0];
  return {
    schemaVersion: 1,
    concept: {},
    section: first
      ? { [first.id]: { unlocked: true, testAttempts: [], complete: false } }
      : {},
    mock: {},
    location: { view: "dashboard", sectionId: null, conceptId: null, mockId: null },
  };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return newProgress();
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return newProgress();
    const obj = JSON.parse(raw) as Progress;
    if (!obj || obj.schemaVersion !== 1) return newProgress();
    if (!obj.mock) obj.mock = {};
    if (obj.location && !("mockId" in (obj.location as object))) {
      obj.location.mockId = null;
    }
    return obj;
  } catch {
    return newProgress();
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota / private mode — silently drop */
  }
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

export function masteryFromScore(score: number, total: number): Mastery {
  if (total <= 0) return 0;
  const pct = score / total;
  if (pct >= 0.9) return 4;
  if (pct >= 0.6) return 3;
  return 2;
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
