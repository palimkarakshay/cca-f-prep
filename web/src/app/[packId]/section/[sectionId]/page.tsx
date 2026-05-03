import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPack, ALL_PACK_IDS } from "@/content/pack-registry";
import {
  getSectionFrom,
  getSectionMeta,
  getSectionFlashcards,
} from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { SectionConceptList } from "@/components/section/SectionConceptList";
import { SectionTabs } from "@/components/section/SectionTabs";
import { resolveTab } from "@/components/section/section-tabs-shared";
import { GAMES_CATALOG, gameHrefFor } from "@/components/section/games-catalog";
import { MiniGameCard } from "@/components/section/MiniGameCard";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { copyFor } from "@/lib/pack-helpers";
import { cn } from "@/lib/utils";

type Params = { packId: string; sectionId: string };
type SearchParams = { tab?: string };

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const packId of ALL_PACK_IDS) {
    const pack = getPack(packId);
    if (!pack) continue;
    for (const section of pack.curriculum.sections) {
      out.push({ packId, sectionId: section.id });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId, sectionId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Section not found" };
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) return { title: "Section not found" };
  return {
    title: `Section ${section.n}: ${section.title}`,
    description: section.blurb,
  };
}

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { packId, sectionId } = await params;
  const sp = await searchParams;
  const pack = getPack(packId);
  if (!pack) notFound();
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) notFound();

  const activeTab = resolveTab(sp.tab);
  const meta = getSectionMeta(sectionId);
  const flashcards = getSectionFlashcards(section);
  const copy = copyFor(pack);

  // Goals panel header content — kept inline in PR2.3 as a placeholder.
  // PR2.4 extracts it into a dedicated GoalsPanel component with the
  // time badge + academy link + learning objectives + key concepts.
  const goalsPanel = (
    <div>
      <header className="mb-4">
        <p className="font-mono text-xs text-(--muted)">
          Section {String(section.n).padStart(2, "0")}
          {section.sourceCourse ? ` · ${section.sourceCourse}` : null}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          {section.title}
        </h1>
        <p className="mt-2 text-sm text-(--muted)">{section.blurb}</p>
      </header>
      {meta ? (
        <p className="text-xs text-(--muted)">
          {meta.timeMinutes} min · {meta.learningObjectives.length} learning objectives ·{" "}
          <a
            href={meta.academyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--accent-2) underline-offset-2 hover:underline"
          >
            Watch on Anthropic Academy ↗
          </a>
        </p>
      ) : null}
    </div>
  );

  const conceptsPanel = (
    <section aria-labelledby="concepts-heading">
      <h2
        id="concepts-heading"
        className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
      >
        Concepts
      </h2>
      <SectionConceptList section={section} packId={packId} />
    </section>
  );

  // Placeholder for PR2.5 — list the cards inline as a quick visual.
  const flashcardsPanel = (
    <section aria-labelledby="flashcards-heading">
      <h2
        id="flashcards-heading"
        className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
      >
        Flashcards · {flashcards.length} cards
      </h2>
      <p className="text-sm text-(--muted)">
        Flip-card UI lands in PR2.5. Cards are derived from concept titles +
        keyPoints + analogies — no hand-authoring required.
      </p>
    </section>
  );

  const quizPanel = section.sectionTest ? (
    <section
      aria-labelledby="section-test-heading"
      className="rounded-lg border border-dashed border-(--border) p-4"
    >
      <h2
        id="section-test-heading"
        className="text-base font-semibold text-(--ink)"
      >
        {copy.sectionTestSingular}
      </h2>
      <p className="mt-1 text-sm text-(--muted)">
        {section.sectionTest.questions.length} questions ·{" "}
        {Math.round((section.sectionTest.passPct ?? 0.7) * 100)}% pass-gate
        unlocks the next section.
      </p>
      <Link
        href={`/${packId}/section/${section.id}/test`}
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "mt-3 no-underline"
        )}
      >
        Take {copy.sectionTestSingular.toLowerCase()}
      </Link>
    </section>
  ) : (
    <p className="text-sm text-(--muted)">
      No {copy.sectionTestSingular.toLowerCase()} authored for this section yet.
    </p>
  );

  const gamesPanel = (
    <section aria-labelledby="games-heading">
      <h2
        id="games-heading"
        className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
      >
        Mini-games
      </h2>
      <p className="mb-4 text-sm text-(--muted)">
        These mini-games unlock as we ship them — Time Trivia next.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES_CATALOG.map((g) => (
          <MiniGameCard
            key={g.id}
            title={g.title}
            blurb={g.blurb}
            category={g.category}
            icon={g.icon}
            status={g.status}
            href={g.status === "live" ? gameHrefFor(packId, sectionId, g.id) : undefined}
          />
        ))}
      </div>
    </section>
  );

  return (
    <Container as="article" width="wide" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: `/${packId}` },
          { label: section.title },
        ]}
      />
      <SectionTabs
        activeTab={activeTab}
        panels={{
          goals: goalsPanel,
          concepts: conceptsPanel,
          flashcards: flashcardsPanel,
          quiz: quizPanel,
          games: gamesPanel,
        }}
      />
      <div className="mt-6">
        <Link
          href={`/${packId}`}
          className="text-sm text-(--muted) hover:text-(--ink)"
        >
          ← Back to dashboard
        </Link>
      </div>
    </Container>
  );
}
