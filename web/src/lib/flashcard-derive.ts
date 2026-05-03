import type { Concept, Flashcard } from "@/content/curriculum-types";

/**
 * Derive a flashcard deck from an existing Concept. Source priority:
 *
 * 1. Concept.title → simplified.oneLiner (canonical "what is X?" card)
 * 2. Each keyPoint → an "Explain why" card
 * 3. The first paragraph of the lesson → "Define <code>" card (fallback)
 *
 * The deck is capped at 6 cards to keep Flashcard Battle sessions
 * tractable. Cards are deterministic for a given concept (same id +
 * front + back across renders) so spaced-repetition state keys stay
 * stable across reloads.
 */
export function deriveFlashcards(concept: Concept): Flashcard[] {
  const lesson = concept.lesson;
  const cards: Flashcard[] = [];

  // Card 1: code/title → one-liner (the canonical definition)
  const oneLiner =
    lesson?.simplified?.oneLiner ?? lesson?.paragraphs?.[0]?.split(". ")[0];
  if (oneLiner) {
    cards.push({
      id: `${concept.id}::definition`,
      front: `What is "${concept.title}"?`,
      back: oneLiner,
    });
  }

  // Cards 2..N: each keyPoint reframed as a recall prompt.
  // We pick at most 4 keyPoints to leave room for the analogy card.
  const keyPoints = lesson?.keyPoints ?? [];
  for (let i = 0; i < Math.min(keyPoints.length, 4); i++) {
    cards.push({
      id: `${concept.id}::kp-${i}`,
      front: `In "${concept.title}", explain:`,
      back: keyPoints[i],
    });
  }

  // Card N+1: the analogy if one exists — a memorable mental hook.
  const analogy = lesson?.simplified?.analogy;
  if (analogy && cards.length < 6) {
    cards.push({
      id: `${concept.id}::analogy`,
      front: `Analogy for "${concept.title}":`,
      back: analogy,
    });
  }

  return cards.slice(0, 6);
}
