import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/**
 * Belt-and-suspenders for the ESLint `no-restricted-imports` rule in
 * `eslint.config.mjs`. ESLint enforces this at lint time; this test
 * also fails the build at unit-test time so a misconfigured eslint
 * project (or a `// eslint-disable` someone slipped in) doesn't let
 * a coupling regression land.
 *
 * Why this matters: components under these paths must work for ANY
 * content pack. They get Section / Concept / Flashcard / SectionMeta
 * passed in as props from page-level loaders. If they import the
 * cca-f-prep singleton CURRICULUM (or its singleton lookup tables)
 * directly, swapping packs no longer works — that's pack-coupling drift.
 */

const SRC_ROOT = resolve(__dirname, "..");

// Files that MUST NOT import any of the FORBIDDEN_IMPORTS below.
const GUARDED_GLOBS: RegExp[] = [
  /^components\/ui\/.*\.(ts|tsx)$/,
  /^components\/primitives\/.*\.(ts|tsx)$/,
  /^components\/games\/.*\.(ts|tsx)$/,
  /^components\/section\/(SectionTabs|GoalsPanel|FlashcardsPanel|GamesPanel|QuizLauncherPanel|MiniGameCard|games-catalog)\.(ts|tsx)$/,
];

const FORBIDDEN_IMPORTS = [
  "@/content/curriculum",
  "@/content/section-meta",
  "@/content/domain-map",
  "@/content/domains",
];

// Build a regex that matches any forbidden import on its own line. We
// match `from "<name>"` AND `import "<name>"` AND named-import variants
// like `import { x } from "<name>"`. We also allow trailing chars so
// `@/content/curriculum-loader` (which is allowed) is NOT confused with
// `@/content/curriculum` (forbidden).
function importRegexFor(modulePath: string): RegExp {
  const escaped = modulePath.replace(/[/\-]/g, "\\$&");
  return new RegExp(`from\\s+["']${escaped}["']|import\\s+["']${escaped}["']`);
}

function walk(dir: string, accum: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, accum);
    else if (/\.(ts|tsx)$/.test(entry)) accum.push(full);
  }
  return accum;
}

function isGuarded(relPath: string): boolean {
  const norm = relPath.replace(/\\/g, "/");
  return GUARDED_GLOBS.some((g) => g.test(norm));
}

describe("no curriculum coupling in pack-agnostic components", () => {
  const allFiles = walk(SRC_ROOT);

  it("guards at least one file from each protected directory", () => {
    // Sanity: if these dirs are empty, the test would silently pass.
    const guardedRels = allFiles
      .map((f) => relative(SRC_ROOT, f))
      .filter(isGuarded);
    expect(guardedRels.length, "no guarded files found — globs out of date").toBeGreaterThan(0);
    // Spot-check that the guarded set covers at least the ui + primitives dirs.
    expect(
      guardedRels.some((p) => p.startsWith("components/ui/")),
      "expected at least one components/ui/ file"
    ).toBe(true);
    expect(
      guardedRels.some((p) => p.startsWith("components/primitives/")),
      "expected at least one components/primitives/ file"
    ).toBe(true);
  });

  for (const forbidden of FORBIDDEN_IMPORTS) {
    it(`no guarded file imports ${forbidden}`, () => {
      const re = importRegexFor(forbidden);
      const offenders: string[] = [];
      for (const file of allFiles) {
        const rel = relative(SRC_ROOT, file);
        if (!isGuarded(rel)) continue;
        const src = readFileSync(file, "utf8");
        if (re.test(src)) offenders.push(rel);
      }
      expect(
        offenders,
        `pack-coupling drift — these files import ${forbidden}: ${offenders.join(", ")}`
      ).toEqual([]);
    });
  }
});
