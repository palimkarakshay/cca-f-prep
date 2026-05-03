import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/**
 * Schema-drift guard. The app uses pack-derived localStorage keys:
 *   `${packId}:progress:v1`
 *   `${packId}:theme`
 *   `${packId}:lesson-depth:v1`
 *   `${packId}:games:v1`            (lands with PR3)
 *
 * Only these files may construct or reference the literal key suffixes:
 *   src/lib/storage-keys.ts        — derives THEME_STORAGE_KEY at build
 *   src/lib/pack-helpers.ts        — pack-aware factory functions
 *   src/lib/progress-store.ts      — owns reads/writes of :progress:v1
 *   src/lib/games-store.ts         — owns reads/writes of :games:v1 (PR3)
 *   src/lib/lesson-depth.ts        — owns reads/writes of :lesson-depth:v1
 *   src/__tests__/                 — tests can hard-code expected keys
 *
 * Anything else writing those literals is a schema-drift smell.
 */

const SRC_ROOT = resolve(__dirname, "..");

const KEY_SUFFIXES = [
  ":progress:v1",
  ":theme",
  ":lesson-depth:v1",
  ":games:v1",
];

const ALLOWED_FILES = new Set(
  [
    "lib/storage-keys.ts",
    "lib/pack-helpers.ts",
    "lib/progress-store.ts",
    "lib/progress-types.ts", // exports PROGRESS_STORAGE_KEY constant
    "lib/games-store.ts",
    "lib/games-types.ts", // owns gamesStorageKey() factory + emits the suffix
    "lib/lesson-depth.ts",
  ].map((p) => p.replace(/\\/g, "/"))
);

function walk(dir: string, accum: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, accum);
    else if (/\.(ts|tsx)$/.test(entry)) accum.push(full);
  }
  return accum;
}

describe("storage-key discipline", () => {
  const allFiles = walk(SRC_ROOT);

  for (const suffix of KEY_SUFFIXES) {
    it(`only owner files reference "${suffix}"`, () => {
      const offenders: string[] = [];
      for (const file of allFiles) {
        const rel = relative(SRC_ROOT, file).replace(/\\/g, "/");
        if (rel.startsWith("__tests__/")) continue; // tests can hard-code
        if (ALLOWED_FILES.has(rel)) continue;
        const src = readFileSync(file, "utf8");
        if (src.includes(suffix)) offenders.push(rel);
      }
      expect(
        offenders,
        `schema-drift — ${suffix} appears outside owner files: ${offenders.join(", ")}`
      ).toEqual([]);
    });
  }
});
