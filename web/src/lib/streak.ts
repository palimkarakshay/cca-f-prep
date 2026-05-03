import type { Progress } from "./progress-types";

/**
 * Streak summary derived purely from existing `completedAt` timestamps in
 * the v1 progress schema. Read-only on schema — no migration required, no
 * new fields written.
 */
export interface StreakSummary {
  current: number;
  studiedToday: boolean;
  lastStudyDate: string | null;
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Use date math (not timestamp arithmetic) to avoid DST edge cases.
function decrementDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const prev = new Date(y, m - 1, d - 1);
  return dayKey(prev.getTime());
}

function collectAttemptTimestamps(progress: Progress): number[] {
  const out: number[] = [];
  for (const c of Object.values(progress.concept)) {
    for (const a of c.quizAttempts) out.push(a.completedAt);
  }
  for (const s of Object.values(progress.section)) {
    for (const a of s.testAttempts) out.push(a.completedAt);
  }
  for (const m of Object.values(progress.mock)) {
    for (const a of m.attempts) out.push(a.completedAt);
  }
  return out;
}

export function computeStreak(
  progress: Progress,
  now: number = Date.now()
): StreakSummary {
  const ts = collectAttemptTimestamps(progress);
  if (ts.length === 0) {
    return { current: 0, studiedToday: false, lastStudyDate: null };
  }
  const days = new Set(ts.map(dayKey));
  const today = dayKey(now);
  const studiedToday = days.has(today);
  const lastStudyDate = dayKey(Math.max(...ts));

  // Streak counts consecutive days back from today (or yesterday if the
  // user hasn't studied yet today, so the streak survives until midnight).
  let cursor = studiedToday ? today : decrementDay(today);
  if (!days.has(cursor)) {
    return { current: 0, studiedToday, lastStudyDate };
  }
  let count = 0;
  while (days.has(cursor)) {
    count++;
    cursor = decrementDay(cursor);
  }
  return { current: count, studiedToday, lastStudyDate };
}
