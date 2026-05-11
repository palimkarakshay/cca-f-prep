/* ------------------------------------------------------------------
   Display preferences — learner-level (umbrella, not pack-scoped).

   Three independent dials that adapt the shell for different
   learners:

     - textSize    "normal" | "large" | "xlarge"    — bumps body
                                                      font size + line
                                                      height. Helps
                                                      low-vision and
                                                      ESL learners.
     - contrast    "normal" | "high"                — overrides muted
                                                      text + borders to
                                                      stronger ink so
                                                      every text passes
                                                      WCAG AAA.
     - motion      "normal" | "reduced"             — disables shell
                                                      transitions /
                                                      animations.
                                                      Honours user
                                                      preference even
                                                      if their OS
                                                      doesn't set it
                                                      (kiosk + shared
                                                      computer cases).

   Applied as data-text-size / data-contrast / data-motion on
   <html> so the rules in globals.css can target them. An inline
   init script in app/layout.tsx reads localStorage before paint to
   avoid flash-of-default-appearance.

   Implementation: delegates to a `local-only` StorageDriver. The
   public API of `prefsStore`, `readPrefs`, `writePrefs`,
   `applyPrefsToDocument`, and `initScript` is unchanged from the
   pre-driver implementation.
------------------------------------------------------------------ */

import { createLocalDriver } from "./storage/local-driver";

export const DISPLAY_PREFS_STORAGE_KEY = "curio:display-prefs:v1";

export type TextSize = "normal" | "large" | "xlarge";
export type Contrast = "normal" | "high";
export type Motion = "normal" | "reduced";

export interface DisplayPrefs {
  textSize: TextSize;
  contrast: Contrast;
  motion: Motion;
}

export const DEFAULT_PREFS: DisplayPrefs = {
  textSize: "normal",
  contrast: "normal",
  motion: "normal",
};

const TEXT_SIZES: TextSize[] = ["normal", "large", "xlarge"];
const CONTRASTS: Contrast[] = ["normal", "high"];
const MOTIONS: Motion[] = ["normal", "reduced"];

function sanitize(raw: unknown): DisplayPrefs {
  if (typeof raw !== "object" || raw === null) return { ...DEFAULT_PREFS };
  const r = raw as Record<string, unknown>;
  return {
    textSize: TEXT_SIZES.includes(r.textSize as TextSize)
      ? (r.textSize as TextSize)
      : "normal",
    contrast: CONTRASTS.includes(r.contrast as Contrast)
      ? (r.contrast as Contrast)
      : "normal",
    motion: MOTIONS.includes(r.motion as Motion)
      ? (r.motion as Motion)
      : "normal",
  };
}

const FROZEN_DEFAULT: Readonly<DisplayPrefs> = Object.freeze({
  ...DEFAULT_PREFS,
});

const driver = createLocalDriver<DisplayPrefs>({
  storageKey: DISPLAY_PREFS_STORAGE_KEY,
  initial: () => ({ ...DEFAULT_PREFS }),
  sanitize,
});

export function readPrefs(): DisplayPrefs {
  return driver.getSnapshot();
}

export function writePrefs(prefs: DisplayPrefs): void {
  driver.setSnapshot(prefs);
}

/**
 * Apply the prefs to <html> data-* attributes. Idempotent; safe to
 * call repeatedly. The init script in layout.tsx also writes these
 * before paint so SSR + first client render match.
 */
export function applyPrefsToDocument(prefs: DisplayPrefs): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.textSize = prefs.textSize;
  document.documentElement.dataset.contrast = prefs.contrast;
  document.documentElement.dataset.motion = prefs.motion;
}

/**
 * Inline script body written into <head> in app/layout.tsx so the
 * data-* attributes are present before first paint. Kept as a
 * separate export so the layout's script tag stays declarative.
 *
 * NOTE: this script reads localStorage *directly* (not via the
 * driver) because it runs before any JS module imports — earlier
 * than the driver itself. The driver becomes the source of truth
 * after first paint.
 */
export function initScript(): string {
  return `
(function () {
  try {
    var raw = localStorage.getItem(${JSON.stringify(DISPLAY_PREFS_STORAGE_KEY)});
    var parsed = raw ? JSON.parse(raw) : null;
    var ts = (parsed && ["normal","large","xlarge"].indexOf(parsed.textSize) >= 0) ? parsed.textSize : "normal";
    var co = (parsed && ["normal","high"].indexOf(parsed.contrast) >= 0) ? parsed.contrast : "normal";
    var mo = (parsed && ["normal","reduced"].indexOf(parsed.motion) >= 0) ? parsed.motion : "normal";
    var el = document.documentElement;
    el.dataset.textSize = ts;
    el.dataset.contrast = co;
    el.dataset.motion = mo;
  } catch (_) {}
})();`.trim();
}

/* ------------------------------------------------------------------
   useSyncExternalStore-compatible singleton store. Setters apply the
   change to the <html> data-* attributes alongside persisting, so
   the visual change is immediate.
------------------------------------------------------------------ */

function applyAndWrite(next: DisplayPrefs): void {
  driver.setSnapshot(next);
  applyPrefsToDocument(next);
}

export const prefsStore = {
  subscribe(listener: () => void): () => void {
    return driver.subscribe(listener);
  },
  get(): DisplayPrefs {
    return driver.getSnapshot();
  },
  getServerSnapshot(): DisplayPrefs {
    return FROZEN_DEFAULT;
  },
  setTextSize(value: TextSize) {
    applyAndWrite({ ...driver.getSnapshot(), textSize: value });
  },
  setContrast(value: Contrast) {
    applyAndWrite({ ...driver.getSnapshot(), contrast: value });
  },
  setMotion(value: Motion) {
    applyAndWrite({ ...driver.getSnapshot(), motion: value });
  },
  reset() {
    applyAndWrite({ ...DEFAULT_PREFS });
  },
  _resetForTests() {
    driver._resetForTests?.();
  },
};
