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
------------------------------------------------------------------ */

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

export function readPrefs(): DisplayPrefs {
  if (typeof window === "undefined") return { ...DEFAULT_PREFS };
  try {
    const raw = window.localStorage.getItem(DISPLAY_PREFS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return sanitize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function writePrefs(prefs: DisplayPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      DISPLAY_PREFS_STORAGE_KEY,
      JSON.stringify(prefs)
    );
  } catch {
    // Quota or disabled storage — swallow.
  }
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
   useSyncExternalStore-compatible singleton store.
------------------------------------------------------------------ */

type Listener = () => void;

const FROZEN_DEFAULT: Readonly<DisplayPrefs> = Object.freeze({
  ...DEFAULT_PREFS,
});

let cached: DisplayPrefs | null = null;
const listeners = new Set<Listener>();

function snapshot(): DisplayPrefs {
  if (typeof window === "undefined") return FROZEN_DEFAULT;
  if (cached === null) cached = readPrefs();
  return cached;
}

function emit(next: DisplayPrefs): void {
  cached = next;
  writePrefs(next);
  applyPrefsToDocument(next);
  for (const l of listeners) l();
}

export const prefsStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: snapshot,
  getServerSnapshot(): DisplayPrefs {
    return FROZEN_DEFAULT;
  },
  setTextSize(value: TextSize) {
    emit({ ...snapshot(), textSize: value });
  },
  setContrast(value: Contrast) {
    emit({ ...snapshot(), contrast: value });
  },
  setMotion(value: Motion) {
    emit({ ...snapshot(), motion: value });
  },
  reset() {
    emit({ ...DEFAULT_PREFS });
  },
  _resetForTests() {
    cached = null;
    listeners.clear();
  },
};
