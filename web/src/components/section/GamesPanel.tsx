import { GAMES_CATALOG, gameHrefFor } from "./games-catalog";
import { MiniGameCard } from "./MiniGameCard";

interface GamesPanelProps {
  packId: string;
  sectionId: string;
}

/**
 * Mini-game grid for the section landing's Games tab. Pure
 * presentational: maps GAMES_CATALOG → MiniGameCard with the live
 * route URL or undefined for "soon" tiles. Pack-agnostic — only
 * needs the route ids to construct hrefs.
 */
export function GamesPanel({ packId, sectionId }: GamesPanelProps) {
  return (
    <section aria-labelledby="games-heading">
      <header className="mb-4">
        <h2
          id="games-heading"
          className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
        >
          Mini-games
        </h2>
        <p className="mt-1 text-sm text-(--muted)">
          These mini-games unlock as we ship them — Time Trivia next.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES_CATALOG.map((g) => (
          <MiniGameCard
            key={g.id}
            title={g.title}
            blurb={g.blurb}
            category={g.category}
            icon={g.icon}
            status={g.status}
            href={
              g.status === "live" ? gameHrefFor(packId, sectionId, g.id) : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
