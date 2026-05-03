"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Compass, BookOpen, Layers, Award, Gamepad2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TAB_IDS, type TabId } from "./section-tabs-shared";

export type { TabId };

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "goals", label: "Goals", icon: Compass },
  { id: "concepts", label: "Concepts", icon: BookOpen },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: Award },
  { id: "games", label: "Games", icon: Gamepad2 },
];

export interface SectionTabsProps {
  /** Pre-resolved active tab from the server. Client mirrors via useSearchParams. */
  activeTab: TabId;
  /** Tab panels (one per tab id). Receive the active tab as a prop so
   *  each panel can decide whether to render or stay hidden. We render
   *  ALL panels in the DOM with `hidden` on the inactive ones — keeps
   *  scroll position + lets the tabs survive client-side state. */
  panels: Record<TabId, React.ReactNode>;
}

/**
 * 5-tab strip following the ARIA Authoring Practices for tabs (auto-
 * activation). Horizontal scrollable strip on mobile + tablet; sticky
 * vertical aside on lg+.
 *
 * Pack-agnostic: takes panels as a prop. The page-level loader is the
 * only place that touches the curriculum singletons.
 */
export function SectionTabs({ activeTab, panels }: SectionTabsProps) {
  const router = useRouter();
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    goals: null,
    concepts: null,
    flashcards: null,
    quiz: null,
    games: null,
  });

  // Keep the focused tab in sync with the active one when it changes
  // (e.g., from the URL on refresh). Avoids stealing focus on every
  // render — only when the active tab actually changed.
  const lastActive = useRef<TabId | null>(null);
  useEffect(() => {
    if (lastActive.current && lastActive.current !== activeTab) {
      tabRefs.current[activeTab]?.focus();
    }
    lastActive.current = activeTab;
  }, [activeTab]);

  function selectTab(next: TabId) {
    if (next === activeTab) return;
    // The section page is the only route that uses ?tab; other params
    // aren't expected here. If we ever add some, switch to a
    // useSearchParams-based merge wrapped in <Suspense>.
    const href = next === "goals" ? "?" : `?tab=${next}`;
    router.replace(href, { scroll: false });
  }

  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const idx = TAB_IDS.indexOf(activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectTab(TAB_IDS[(idx + 1) % TAB_IDS.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectTab(TAB_IDS[(idx - 1 + TAB_IDS.length) % TAB_IDS.length]);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectTab(TAB_IDS[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      selectTab(TAB_IDS[TAB_IDS.length - 1]);
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8">
      {/* Tab strip — horizontal under lg, sticky vertical aside at lg+. */}
      <div
        role="tablist"
        aria-label="Section sections"
        onKeyDown={onKey}
        className={cn(
          "mb-4 flex flex-row gap-1 overflow-x-auto scrollbar-hide",
          "border-b border-(--border) pb-1",
          "lg:sticky lg:top-6 lg:mb-0 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-l lg:border-(--border) lg:pb-0 lg:pl-2 lg:self-start"
        )}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`section-tab-${tab.id}`}
              aria-controls={`section-panel-${tab.id}`}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "min-h-11", // ≥ 44 px tap target
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                "lg:w-full lg:justify-start",
                active
                  ? "bg-(--panel-2) text-(--ink)"
                  : "text-(--muted) hover:bg-(--panel-2) hover:text-(--ink)"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels — all rendered, only one visible. */}
      <div className="min-w-0">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            id={`section-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`section-tab-${tab.id}`}
            hidden={tab.id !== activeTab}
            tabIndex={0}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            {panels[tab.id]}
          </div>
        ))}
      </div>
    </div>
  );
}
