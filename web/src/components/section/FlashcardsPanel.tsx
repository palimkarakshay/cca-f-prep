"use client";

import { useState } from "react";
import type { Flashcard } from "@/content/curriculum-types";
import { cn } from "@/lib/utils";

interface FlashcardsPanelProps {
  cards: Flashcard[];
}

/**
 * Browsable flashcard grid. Each card flips on click + Space/Enter.
 * No spaced-repetition state here — that lands in PR4 with Flashcard
 * Battle. This panel is purely the "leaf through the deck" UI.
 *
 * Pack-agnostic — receives the deck as a prop. The page-level loader
 * calls getSectionFlashcards(section).
 */
export function FlashcardsPanel({ cards }: FlashcardsPanelProps) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  if (cards.length === 0) {
    return (
      <p className="text-sm text-(--muted)">
        No flashcards available for this section yet.
      </p>
    );
  }

  function toggle(id: string) {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section aria-labelledby="flashcards-heading" className="flex flex-col gap-3">
      <header>
        <h2
          id="flashcards-heading"
          className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
        >
          Flashcards · {cards.length} cards
        </h2>
        <p className="mt-1 text-sm text-(--muted)">
          Tap a card or press Enter to flip. Spaced repetition lands with
          Flashcard Battle (PR4).
        </p>
      </header>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {cards.map((card) => {
          const isFlipped = Boolean(flipped[card.id]);
          return (
            <li key={card.id} className="flip-card h-44">
              <button
                type="button"
                onClick={() => toggle(card.id)}
                aria-pressed={isFlipped}
                // aria-label MUST mirror the visible side so screen readers
                // hear the answer when the card is flipped to its back —
                // not the question text. The "Question:" / "Answer:" prefix
                // anchors the speech for SR users who don't see the visual
                // tone difference between the two sides.
                aria-label={
                  isFlipped
                    ? `Answer: ${card.back}`
                    : `Question: ${card.front}`
                }
                className={cn(
                  "flip-card-inner block w-full rounded-lg text-left",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
                  isFlipped && "is-flipped"
                )}
              >
                <span
                  aria-hidden={isFlipped}
                  className="flip-card-face flip-card-front rounded-lg border border-(--border) bg-(--panel) p-4 shadow-sm"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-(--accent-2)">
                    Question
                  </span>
                  <span className="mt-2 text-sm font-medium text-(--ink)">
                    {card.front}
                  </span>
                  <span className="mt-auto text-[11px] text-(--muted)">
                    Tap to reveal
                  </span>
                </span>
                <span
                  aria-hidden={!isFlipped}
                  className="flip-card-face flip-card-back rounded-lg border border-(--accent)/40 bg-(--panel-2) p-4 shadow-sm"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-(--accent-2)">
                    Answer
                  </span>
                  <span className="mt-2 overflow-y-auto text-sm text-(--ink)">
                    {card.back}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
