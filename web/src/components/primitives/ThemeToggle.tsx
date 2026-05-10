"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { THEME_STORAGE_KEY } from "@/lib/storage-keys";

const STORAGE_KEY = THEME_STORAGE_KEY;

type Theme = "light" | "dark";

function subscribeTheme(cb: () => void): () => void {
  if (typeof document === "undefined") return () => undefined;
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  // Server doesn't know the user's saved theme; render as dark to match
  // the inline init script's no-stored-preference fallback. The shell
  // colors are driven by CSS tokens that respect the .dark class set by
  // the inline init script in <head>, which runs before paint.
  return "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );
  // Server always renders the dark-mode icon to keep markup stable;
  // after hydration the client picks up the real document class. The
  // inline init script in <head> sets the right .dark class before
  // paint so the page colors are correct from frame 1 even though the
  // icon flips post-hydration.
  const hydrated = useHydrated();

  function toggle() {
    const current: Theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const next: Theme = current === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* quota / private mode — silently drop */
    }
  }

  const displayTheme: Theme = hydrated ? theme : "dark";
  const label =
    displayTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  const Icon = displayTheme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-(--border) bg-(--panel-2) text-(--ink) transition-colors hover:border-(--accent)",
        className
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
