"use client";

import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Layers, RotateCcw, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGamesStore } from "@/hooks/useGamesStore";
import {
  DEFAULT_BATTLE_CONFIG,
  bestStreak,
  buildDeck,
  maxPossibleScore,
  newBattleState,
  reduce,
  type BattleConfig,
  type BattleRating,
  type BattleState,
} from "./engine";
import type { Flashcard, Section } from "@/content/curriculum-types";

const TICK_MS = 250;

interface FlashcardBattleGameProps {
  section: Section;
  /** Pack-supplied flashcards — derived in the page-level loader. */
  cards: Flashcard[];
  packId: string;
  config?: BattleConfig;
  rng?: () => number;
}

export function FlashcardBattleGame({
  section,
  cards,
  packId,
  config = DEFAULT_BATTLE_CONFIG,
  rng,
}: FlashcardBattleGameProps) {
  const { recordAttempt } = useGamesStore();

  const initial = useState<BattleState>(() =>
    newBattleState(buildDeck(cards, config.cardsPerRound, rng), config)
  )[0];
  const [state, dispatch] = useReducer(reduce, initial);
  const recordedAt = useRef<number | null>(null);
  const initialDeckSize = initial.queue.length;

  // Accumulate wall-clock for the GameAttempt while a card is in
  // front of the user. Tick rate is coarse — the user is self-paced.
  useEffect(() => {
    if (state.phase !== "front" && state.phase !== "back") return;
    const id = window.setInterval(() => {
      dispatch({ type: "tick", deltaMs: TICK_MS });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [state.phase]);

  // Persist exactly once on transition to done.
  useEffect(() => {
    if (state.phase !== "done") return;
    if (recordedAt.current !== null) return;
    if (state.outcomes.length === 0) return; // empty deck case — don't record
    const now = Date.now();
    recordedAt.current = now;
    recordAttempt("flashcard-battle", {
      sectionId: section.id,
      score: state.score,
      maxScore: maxPossibleScore(initialDeckSize, state.config),
      durationMs: state.durationMs,
      finishedAt: now,
    });
  }, [
    state.phase,
    state.score,
    state.outcomes.length,
    state.durationMs,
    state.config,
    section.id,
    initialDeckSize,
    recordAttempt,
  ]);

  const onFlip = useCallback(() => dispatch({ type: "flip" }), []);
  const onRate = useCallback(
    (rating: BattleRating) => dispatch({ type: "rate", rating }),
    []
  );

  // Keyboard shortcuts: space/enter flip; 1/2/3 rate Hard/Good/Easy.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (state.phase === "front" && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        onFlip();
        return;
      }
      if (state.phase === "back") {
        const map: Record<string, BattleRating> = {
          "1": "hard",
          "2": "good",
          "3": "easy",
        };
        const r = map[e.key];
        if (r) {
          e.preventDefault();
          onRate(r);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, onFlip, onRate]);

  if (cards.length === 0) {
    return <EmptyState packId={packId} sectionId={section.id} />;
  }

  if (state.phase === "idle") {
    return (
      <StartScreen
        section={section}
        config={state.config}
        deckSize={initialDeckSize}
        onStart={() => dispatch({ type: "start" })}
      />
    );
  }

  if (state.phase === "done") {
    return (
      <ResultScreen
        state={state}
        section={section}
        packId={packId}
        initialDeckSize={initialDeckSize}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <PlayScreen
      state={state}
      initialDeckSize={initialDeckSize}
      onFlip={onFlip}
      onRate={onRate}
    />
  );
}

function EmptyState({ packId, sectionId }: { packId: string; sectionId: string }) {
  return (
    <Card tone="warn" className="p-6">
      <h2 className="text-base font-semibold text-(--ink)">No flashcards yet</h2>
      <p className="mt-2 text-sm text-(--muted)">
        This section's concepts don't have flashcards derived yet. Try another
        section.
      </p>
      <Link
        href={`/${packId}/section/${sectionId}?tab=games`}
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "mt-4 no-underline"
        )}
      >
        Back to games
      </Link>
    </Card>
  );
}

function StartScreen({
  section,
  config,
  deckSize,
  onStart,
}: {
  section: Section;
  config: BattleConfig;
  deckSize: number;
  onStart: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3 p-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-(--accent-2)">
          Flashcard Battle
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          {section.title}
        </h1>
      </header>
      <ul className="ml-4 list-disc space-y-1 text-sm text-(--muted)">
        <li>{deckSize} cards drawn from this section's flashcards</li>
        <li>
          Read the front, think, then flip. Rate yourself: Hard (
          {config.pointsHard} pts), Good ({config.pointsGood} pts), Easy (
          {config.pointsEasy} pts).
        </li>
        <li>
          Hard ratings re-queue the card so you see it again before the round
          ends — {config.hardRequeueOffset} cards later.
        </li>
      </ul>
      <button
        type="button"
        onClick={onStart}
        className={cn(
          buttonVariants({ variant: "default", size: "default" }),
          "self-start"
        )}
      >
        Start battle
      </button>
    </Card>
  );
}

function PlayScreen({
  state,
  initialDeckSize,
  onFlip,
  onRate,
}: {
  state: BattleState;
  initialDeckSize: number;
  onFlip: () => void;
  onRate: (r: BattleRating) => void;
}) {
  const card = state.queue[state.index];
  const seen = state.outcomes.length;
  const remaining = state.queue.length - state.index;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between text-xs">
        <span className="font-mono text-(--muted)">
          Card {seen + 1} · {remaining} left in queue
        </span>
        <span className="rounded-full border border-(--border) bg-(--panel-2) px-2 py-0.5 font-mono text-(--ink)">
          {state.score} pts
        </span>
      </header>

      <Card
        tone={state.phase === "back" ? "accent" : "default"}
        className="flex h-56 flex-col gap-3 p-5"
      >
        <p className="text-[10px] font-semibold uppercase tracking-wide text-(--accent-2)">
          {state.phase === "back" ? "Answer" : "Question"}
        </p>
        <p className="text-base font-medium text-(--ink) flex-1 overflow-y-auto">
          {state.phase === "back" ? card.back : card.front}
        </p>
        {state.phase === "front" ? (
          <button
            type="button"
            onClick={onFlip}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "self-start gap-2"
            )}
          >
            <Layers className="h-4 w-4" aria-hidden />
            Reveal answer
          </button>
        ) : null}
      </Card>

      {state.phase === "back" ? (
        <div role="group" aria-label="Rate this card" className="grid grid-cols-3 gap-2">
          <RateBtn label="Hard" sub="see again" tone="bad" hotkey="1" onPress={() => onRate("hard")} />
          <RateBtn label="Good" sub="next time" tone="warn" hotkey="2" onPress={() => onRate("good")} />
          <RateBtn label="Easy" sub="got it" tone="good" hotkey="3" onPress={() => onRate("easy")} />
        </div>
      ) : null}

      <p className="text-[11px] text-(--muted)">
        Tip: <kbd className="rounded bg-(--panel-2) px-1">Space</kbd> reveals;{" "}
        <kbd className="rounded bg-(--panel-2) px-1">1</kbd>–
        <kbd className="rounded bg-(--panel-2) px-1">3</kbd> rate Hard / Good /
        Easy.
      </p>

      {/* Progress chip — initialDeckSize sets the baseline so Hard
          requeues don't make the bar shrink mid-run. */}
      <div className="text-[10px] text-(--muted)">
        Round progress: {seen} / {initialDeckSize}
      </div>
    </div>
  );
}

function RateBtn({
  label,
  sub,
  tone,
  hotkey,
  onPress,
}: {
  label: string;
  sub: string;
  tone: "bad" | "warn" | "good";
  hotkey: string;
  onPress: () => void;
}) {
  const toneClass =
    tone === "bad"
      ? "border-(--bad)/50 text-(--bad) hover:bg-(--bad)/10"
      : tone === "warn"
        ? "border-(--warn)/50 text-(--warn) hover:bg-(--warn)/10"
        : "border-(--good)/50 text-(--good) hover:bg-(--good)/10";
  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        "flex flex-col items-center justify-center rounded-md border bg-(--panel) px-3 py-3 text-sm font-semibold transition-colors",
        "min-h-12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
        toneClass
      )}
    >
      <span className="flex items-center gap-2">
        {label}
        <kbd className="rounded bg-(--panel-2) px-1 text-[10px] font-mono text-(--muted)">
          {hotkey}
        </kbd>
      </span>
      <span className="text-[10px] font-normal text-(--muted)">{sub}</span>
    </button>
  );
}

function ResultScreen({
  state,
  section,
  packId,
  initialDeckSize,
  onRetry,
}: {
  state: BattleState;
  section: Section;
  packId: string;
  initialDeckSize: number;
  onRetry: () => void;
}) {
  const max = maxPossibleScore(initialDeckSize, state.config);
  const pct = max > 0 ? Math.round((state.score / max) * 100) : 0;
  const easyCount = state.outcomes.filter((o) => o.rating === "easy").length;
  const goodCount = state.outcomes.filter((o) => o.rating === "good").length;
  const hardCount = state.outcomes.filter((o) => o.rating === "hard").length;
  const totalSecs = Math.round(state.durationMs / 1000);

  return (
    <Card tone="accent" className="flex flex-col gap-4 p-6">
      <header className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-(--panel-2) text-(--accent-2)"
        >
          <Trophy className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)">
            Battle complete
          </h2>
          <p className="text-xs text-(--muted)">
            {section.title} · {totalSecs}s
          </p>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="Score" value={`${state.score}`} sub={`/ ${max}`} />
        <Stat label="Confidence" value={`${pct}%`} sub={`${easyCount + goodCount}/${initialDeckSize} kept`} />
        <Stat label="Easy / Good / Hard" value={`${easyCount} / ${goodCount} / ${hardCount}`} />
        <Stat label="Best streak" value={`${bestStreak(state)}×`} sub="kept in a row" />
      </dl>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRetry}
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-2")}
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Play again
        </button>
        <Link
          href={`/${packId}/section/${section.id}?tab=games`}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "no-underline"
          )}
        >
          Back to games
        </Link>
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border border-(--border) bg-(--panel) p-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-(--accent-2)">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-lg text-(--ink)">{value}</dd>
      {sub ? <dd className="text-[11px] text-(--muted)">{sub}</dd> : null}
    </div>
  );
}
