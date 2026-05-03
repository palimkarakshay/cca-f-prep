import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/content/curriculum";
import { formatMinutes, getSectionMeta } from "@/content/curriculum-loader";

/**
 * Spec drift guard for the GoalsPanel time-to-complete badge. Locks
 * down the formatted "Xh Ymin" / "Z min" output for every section so
 * a future timeMinutes change (or a formatMinutes regression) requires
 * an explicit snapshot update.
 */

describe("section meta render", () => {
  it("formatMinutes renders human-readable time for every section", () => {
    const formatted: Record<string, string> = {};
    for (const s of CURRICULUM.sections) {
      const meta = getSectionMeta(s.id);
      formatted[s.id] = meta ? formatMinutes(meta.timeMinutes) : "(no meta)";
    }
    expect(formatted).toMatchSnapshot();
  });

  it("formatMinutes handles boundary cases", () => {
    expect(formatMinutes(0)).toBe("0 min");
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(60)).toBe("1 hr");
    expect(formatMinutes(75)).toBe("1 hr 15 min");
    expect(formatMinutes(120)).toBe("2 hr");
    expect(formatMinutes(210)).toBe("3 hr 30 min");
  });

  it("every section's meta has at least 2 learning objectives", () => {
    for (const s of CURRICULUM.sections) {
      const meta = getSectionMeta(s.id);
      if (!meta) continue;
      expect(
        meta.learningObjectives.length,
        `${s.id} learning objectives`
      ).toBeGreaterThanOrEqual(2);
    }
  });
});
