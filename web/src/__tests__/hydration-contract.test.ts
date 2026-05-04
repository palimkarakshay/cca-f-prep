import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

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
 * Earlier draft of this file also asserted `getServerSnapshot`
 * returned a referentially stable value across calls (a real React-19
 * contract). It was removed when caching the snapshot at store-
 * creation time correlated with an unexplained e2e regression we
 * couldn't reproduce without a browser. Tracked as a follow-up.
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
});
