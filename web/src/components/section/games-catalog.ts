/* ------------------------------------------------------------------
   Mini-game catalog — pack-agnostic.

   PR2 ships all six tiles in `status: "soon"`. PR3 flips Time Trivia
   to `"live"`. PR4 flips Flashcard Battle. Subsequent PRs (PR5+) flip
   the rest. Each pack consumes the SAME catalog — game implementations
   themselves accept Section/Concept/Flashcard as props so they work
   for any curriculum.
------------------------------------------------------------------ */

export type MiniGameStatus = "live" | "soon";

export type MiniGameId =
  | "time-trivia"
  | "flashcard-battle"
  | "concept-match"
  | "domain-rush"
  | "complete-the-code"
  | "interactive-scenarios";

/** Lucide icon name keyword. Resolved to a component by MiniGameCard
 *  via a small lookup so the catalog file stays a pure data module. */
export type MiniGameIcon =
  | "timer"
  | "layers"
  | "puzzle"
  | "target"
  | "code"
  | "git-branch";

export interface MiniGameMeta {
  id: MiniGameId;
  title: string;
  blurb: string;
  status: MiniGameStatus;
  /** Eyebrow above the title (e.g., "Exam", "Vocabulary"). */
  category: string;
  icon: MiniGameIcon;
}

export const GAMES_CATALOG: readonly MiniGameMeta[] = [
  {
    id: "time-trivia",
    title: "Time Trivia",
    blurb:
      "10 questions, 15 seconds each. Cumulative score with streak bonus. Reinforces speed under exam pressure.",
    status: "live",
    category: "Exam",
    icon: "timer",
  },
  {
    id: "flashcard-battle",
    title: "Flashcard Battle",
    blurb:
      "Spaced-repetition battle through the section's flashcards. Hard / Good / Easy keeps the right cards in front of you.",
    status: "soon",
    category: "Memory",
    icon: "layers",
  },
  {
    id: "concept-match",
    title: "Concept Match",
    blurb:
      "Match each technical term with its definition. Timer + score reward speed and accuracy on exam vocabulary.",
    status: "soon",
    category: "Vocabulary",
    icon: "puzzle",
  },
  {
    id: "domain-rush",
    title: "Domain Rush",
    blurb:
      "Concepts appear one by one — classify each into the right CCA-F domain. 5 levels, mastery-graded.",
    status: "soon",
    category: "Domains",
    icon: "target",
  },
  {
    id: "complete-the-code",
    title: "Complete the Code",
    blurb:
      "Real Claude API snippets with missing parameters. Pick the correct value to reinforce exact syntax.",
    status: "soon",
    category: "Syntax",
    icon: "code",
  },
  {
    id: "interactive-scenarios",
    title: "Interactive Scenarios",
    blurb:
      "Make decisions in real-world scenarios — which model, which pattern, how to handle errors. Mirrors the exam shape.",
    status: "soon",
    category: "Architecture",
    icon: "git-branch",
  },
];

/** Resolved href for the per-section game route. Centralised so tests
 *  + components agree on the URL shape. */
export function gameHrefFor(packId: string, sectionId: string, gameId: MiniGameId): string {
  return `/${packId}/section/${sectionId}/games/${gameId}`;
}
