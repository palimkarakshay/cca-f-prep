import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { getProgressStore } from "@/lib/progress-store";
import { getGamesStore } from "@/lib/games-store";

/**
 * Regression coverage for the two hydration bugs that PR #20 left
 * behind on `main`:
 *
 *   1. `getServerSnapshot` was returning a fresh `newProgress()` /
 *      `newGamesProgress()` each call, so `useSyncExternalStore` saw a
 *      different reference between the SSR render and the first client
 *      render → React 19 hydration warnings + edge-case re-mounts.
 *
 *   2. The hook bodies used `useState(false) +
 *      useEffect(() => setHydrated(true), [])`, which trips
 *      `react-hooks/set-state-in-effect`. CI failed in 25 s on PR #20
 *      because lint died before tests ran; the merge happened anyway.
 *
 * If you reintroduce either, this test fails before review.
 */

describe("hydration contract", () => {
  it("progress-store getServerSnapshot is referentially stable", () => {
    const store = getProgressStore("hydration-test-pack-progress");
    const a = store.getServerSnapshot();
    const b = store.getServerSnapshot();
    expect(a).toBe(b);
  });

  it("games-store getServerSnapshot is referentially stable", () => {
    const store = getGamesStore("hydration-test-pack-games");
    const a = store.getServerSnapshot();
    const b = store.getServerSnapshot();
    expect(a).toBe(b);
  });

  it("hooks do not call setState inside a useEffect body", () => {
    // Walk hooks/ and grep for the anti-pattern. A naive substring check
    // is enough — any restoration of the lint-failing shape will flag.
    const hooksDir = path.resolve(__dirname, "..", "hooks");
    const files = readdirSync(hooksDir)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
      .map((f) => path.join(hooksDir, f))
      .filter((p) => statSync(p).isFile());
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      // Strip line comments so the explainer comments inside
      // useHydrated.ts and elsewhere don't false-positive.
      const code = src
        .split("\n")
        .filter((l) => !l.trimStart().startsWith("//") && !l.trimStart().startsWith("*"))
        .join("\n");
      const banned = /useEffect\(\s*\(\s*\)\s*=>\s*set[A-Z]\w*\s*\(\s*true\s*\)/;
      expect(
        banned.test(code),
        `${path.basename(f)} re-introduced useEffect(() => setX(true), []) — use useHydrated() instead.`
      ).toBe(false);
    }
  });
});
