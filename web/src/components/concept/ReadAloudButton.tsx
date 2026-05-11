"use client";

/* ------------------------------------------------------------------
   ReadAloudButton — text-to-speech for lesson content.

   Uses the browser's built-in `window.speechSynthesis` API — no
   external service, no audio data leaves the device. Reads the
   passed `parts` (a string array of paragraphs / key-points /
   examples) sequentially with a small inter-utterance pause.

   States:
     - idle           — show "Read aloud" play button.
     - speaking       — show pause + stop.
     - paused         — show resume + stop.

   If the API is unavailable (older browsers, locked-down kiosks),
   the component renders nothing rather than a broken control.

   A11y notes:
     - aria-live="polite" status text announces transitions for
       screen readers + low-vision users who can't see the icon
       state change.
     - The button itself carries aria-label that describes the
       current action (Play / Pause / Resume / Stop).
     - Reduced-motion users still get the audio; we don't gate
       this on `prefers-reduced-motion`.
------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";

type Status = "idle" | "speaking" | "paused";

export function ReadAloudButton({
  parts,
  label = "Read aloud",
  className,
}: {
  /** Strings to read in order. Empty entries skipped. */
  parts: string[];
  /** Visible button label when idle. */
  label?: string;
  className?: string;
}) {
  const hydrated = useHydrated();
  const supported =
    hydrated &&
    typeof window !== "undefined" &&
    "speechSynthesis" in window;
  const [status, setStatus] = useState<Status>("idle");
  // The current SpeechSynthesisUtterance chain. We keep a ref so the
  // cleanup in `stop` can cancel it without setting state on an
  // unmounted component.
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Cancel any in-flight speech if the component unmounts (route
  // change, lesson swap). Otherwise the audio keeps playing on the
  // next page.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    utterancesRef.current = [];
    setStatus("idle");
  }, []);

  const play = useCallback(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    // Resuming a paused queue: just resume; don't re-queue.
    if (status === "paused") {
      synth.resume();
      setStatus("speaking");
      return;
    }
    // Fresh playback — wipe any leftovers and queue the parts.
    synth.cancel();
    const cleanParts = parts
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (cleanParts.length === 0) return;
    const utterances: SpeechSynthesisUtterance[] = cleanParts.map((p) => {
      const u = new SpeechSynthesisUtterance(p);
      u.rate = 1;
      u.pitch = 1;
      u.volume = 1;
      // Prefer the user's UI language so accent / pronunciation
      // matches what they read. Fall back to en-US if not set.
      u.lang =
        (typeof navigator !== "undefined" && navigator.language) || "en-US";
      return u;
    });
    utterances[utterances.length - 1].onend = () => {
      utterancesRef.current = [];
      setStatus("idle");
    };
    utterances[utterances.length - 1].onerror = () => {
      utterancesRef.current = [];
      setStatus("idle");
    };
    utterancesRef.current = utterances;
    for (const u of utterances) synth.speak(u);
    setStatus("speaking");
  }, [parts, status]);

  const pause = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  if (!supported) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--panel-2) p-0.5",
        className
      )}
    >
      {status === "idle" ? (
        <button
          type="button"
          onClick={play}
          aria-label={label}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium text-(--ink) transition-colors hover:bg-(--panel)"
        >
          <Volume2 aria-hidden className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ) : null}
      {status === "speaking" ? (
        <button
          type="button"
          onClick={pause}
          aria-label="Pause read-aloud"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium text-(--ink) transition-colors hover:bg-(--panel)"
        >
          <Pause aria-hidden className="h-4 w-4" />
          <span className="hidden sm:inline">Pause</span>
        </button>
      ) : null}
      {status === "paused" ? (
        <button
          type="button"
          onClick={play}
          aria-label="Resume read-aloud"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium text-(--ink) transition-colors hover:bg-(--panel)"
        >
          <Play aria-hidden className="h-4 w-4" />
          <span className="hidden sm:inline">Resume</span>
        </button>
      ) : null}
      {status !== "idle" ? (
        <button
          type="button"
          onClick={stop}
          aria-label="Stop read-aloud"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs text-(--muted) transition-colors hover:bg-(--panel) hover:text-(--ink)"
        >
          <Square aria-hidden className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Stop</span>
        </button>
      ) : null}
      <span aria-live="polite" className="sr-only">
        {status === "idle"
          ? "Read-aloud ready"
          : status === "speaking"
          ? "Reading lesson aloud"
          : "Read-aloud paused"}
      </span>
    </div>
  );
}
