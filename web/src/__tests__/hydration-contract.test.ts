import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { getProgressStore } from "../lib/progress-store";
import { getGamesStore } from "../lib/games-store";

/**
 * Regression coverage for the lint footgun PR #20 left behind on
 * `main`: every consumer hook re-implemented
 *
 *   useState(false) + useEffect(() => setHydrated(true), [])
 *
 * That pattern is the one React's hydration docs recommend, but
 * eslint-plugin-react-hooks v6+ flags it as
 * `react-hooks/set-state-in-effect`. CI dies on lint before tests run
 * (PR #20 merged with red CI for exactly this reason).
 *
 * Fix: centralise the pattern in `useHydrated` with one narrow
 * `eslint-disable`, route every consumer through it, never repeat the
 * pattern inline again.
 *
 * If you reintroduce the inline pattern in any consumer, this test
 * fails before review.
 *
 * Also asserts the React-19 useSyncExternalStore contract: server
 * snapshots must be referentially stable across calls. A fresh
 * newProgress() per call trips React #418, which silently unmounts
 * gated subtrees on the client (quiz / mock / section-test all stuck
 * on "Loading…", and section-page tab panels never hydrate). PR #21
 * removed an earlier version of this assertion citing an unexplained
 * e2e regression — re-added because the contract violation was the
 * actual root cause and shipped to prod.
 */

// `useHydrated.ts` is the single sanctioned home for the pattern; every
// other hook must NOT re-introduce it.
const HYDRATION_HOOK_FILENAME = "useHydrated.ts";

describe("hydration contract", () => {
  it("only useHydrated.ts may setState inside a useEffect body", () => {
    // Walk hooks/ and grep for the anti-pattern. A naive substring check
    // is enough — any consumer that restores the lint-failing shape
    // will flag. useHydrated.ts itself is allowed because that's the
    // central place we deliberately keep the pattern (with a narrow
    // eslint-disable) so consumers don't repeat it.
    const hooksDir = path.resolve(__dirname, "..", "hooks");
    const files = readdirSync(hooksDir)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
      .filter((f) => f !== HYDRATION_HOOK_FILENAME)
      .map((f) => path.join(hooksDir, f))
      .filter((p) => statSync(p).isFile());
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      // Strip line comments so explainer prose doesn't false-positive.
      const code = src
        .split("\n")
        .filter((l) => !l.trimStart().startsWith("//") && !l.trimStart().startsWith("*"))
        .join("\n");
      const banned = /useEffect\(\s*\(\s*\)\s*=>\s*set[A-Z]\w*\s*\(\s*true\s*\)/;
      expect(
        banned.test(code),
        `${path.basename(f)} re-introduced useEffect(() => setX(true), []) — call useHydrated() instead.`
      ).toBe(false);
    }
  });

  it("progress store getServerSnapshot is referentially stable", () => {
    const store = getProgressStore("hydration-contract-test-progress");
    const a = store.getServerSnapshot();
    const b = store.getServerSnapshot();
    expect(a).toBe(b);
  });

  it("games store getServerSnapshot is referentially stable", () => {
    const store = getGamesStore("hydration-contract-test-games");
    const a = store.getServerSnapshot();
    const b = store.getServerSnapshot();
    expect(a).toBe(b);
  });
});
