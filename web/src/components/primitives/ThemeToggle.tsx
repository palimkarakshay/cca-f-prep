"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
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
  // Server doesn't know the user's saved theme; render as dark and let
  // client hydration replace the icon. The shell colors are driven by
  // CSS tokens that respect the .dark class set by the inline init
  // script in <head>, which runs before paint.
  return "dark";
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* quota / private mode — silently drop */
    }
  }

  const label =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  const Icon = theme === "dark" ? Sun : Moon;

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
