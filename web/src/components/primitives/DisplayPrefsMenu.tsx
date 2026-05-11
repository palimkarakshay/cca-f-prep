"use client";

/* ------------------------------------------------------------------
   Display preferences menu — text size / contrast / motion.

   A small Sliders icon next to the theme toggle that pops a panel
   with three groups of segmented controls. Persists to localStorage
   via `prefsStore`; the init script in app/layout.tsx applies the
   stored values before paint so the menu's selection matches the
   current document state on first render.
------------------------------------------------------------------ */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import {
  prefsStore,
  type Contrast,
  type DisplayPrefs,
  type Motion,
  type TextSize,
} from "@/lib/display-prefs";

const TEXT_SIZE_OPTIONS: Array<{
  value: TextSize;
  label: string;
  hint: string;
}> = [
  { value: "normal", label: "A", hint: "Normal text" },
  { value: "large", label: "A+", hint: "Large text" },
  { value: "xlarge", label: "A++", hint: "Extra-large text" },
];

const CONTRAST_OPTIONS: Array<{ value: Contrast; label: string; hint: string }> = [
  { value: "normal", label: "Normal", hint: "Normal contrast" },
  { value: "high", label: "High", hint: "High contrast" },
];

const MOTION_OPTIONS: Array<{ value: Motion; label: string; hint: string }> = [
  { value: "normal", label: "On", hint: "Animations on" },
  { value: "reduced", label: "Reduced", hint: "Reduce animations" },
];

export function DisplayPrefsMenu() {
  const hydrated = useHydrated();
  const prefs: DisplayPrefs = useSyncExternalStore(
    prefsStore.subscribe,
    prefsStore.get,
    prefsStore.getServerSnapshot
  );
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Until hydration completes we render the button with the default
  // pref values; afterwards it reflects the live store. This avoids
  // the React 19 hydration-mismatch warning.
  const live = hydrated ? prefs : { textSize: "normal", contrast: "normal", motion: "normal" };
  const anyNonDefault =
    live.textSize !== "normal" ||
    live.contrast !== "normal" ||
    live.motion !== "normal";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Display preferences"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-(--border) bg-(--panel) text-(--muted) shadow-sm",
          "transition-colors hover:border-(--accent) hover:text-(--ink)",
          anyNonDefault && "border-(--accent) text-(--accent-2)"
        )}
      >
        <SlidersHorizontal aria-hidden className="h-4 w-4" />
      </button>
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Display preferences"
          className={cn(
            "absolute right-0 z-40 mt-2 w-72 rounded-lg border border-(--border) bg-(--panel) p-4 shadow-lg",
            "flex flex-col gap-4 text-sm text-(--ink)"
          )}
        >
          <p className="font-semibold text-(--ink)">Display preferences</p>
          <Segmented
            legend="Text size"
            value={prefs.textSize}
            options={TEXT_SIZE_OPTIONS}
            onChange={(v) => prefsStore.setTextSize(v)}
          />
          <Segmented
            legend="Contrast"
            value={prefs.contrast}
            options={CONTRAST_OPTIONS}
            onChange={(v) => prefsStore.setContrast(v)}
          />
          <Segmented
            legend="Animations"
            value={prefs.motion}
            options={MOTION_OPTIONS}
            onChange={(v) => prefsStore.setMotion(v)}
          />
          <button
            type="button"
            onClick={() => prefsStore.reset()}
            className="inline-flex items-center gap-2 self-start rounded-md border border-(--border) bg-(--panel-2) px-3 py-1.5 text-xs text-(--muted) hover:border-(--accent) hover:text-(--ink)"
          >
            <RotateCcw aria-hidden className="h-3.5 w-3.5" />
            Reset to defaults
          </button>
          <p className="text-xs text-(--muted)">
            Saved in your browser. Independent of the dark / light theme.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Segmented<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: Array<{ value: T; label: string; hint: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-xs font-medium text-(--muted)">{legend}</legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className="inline-flex rounded-md border border-(--border) bg-(--panel-2) p-0.5"
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={opt.hint}
              onClick={() => onChange(opt.value)}
              className={cn(
                "min-h-8 flex-1 rounded-sm px-3 text-sm transition-colors",
                selected
                  ? "bg-(--panel) text-(--ink) shadow-sm"
                  : "text-(--muted) hover:text-(--ink)"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
