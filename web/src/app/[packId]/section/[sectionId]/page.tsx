import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPack, ALL_PACK_IDS } from "@/content/pack-registry";
import {
  formatMinutes,
  getSectionFlashcards,
  getSectionFrom,
  getSectionMeta,
} from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { journeyTrail } from "@/lib/nav-trail";
import { SectionConceptList } from "@/components/section/SectionConceptList";
import { SectionConceptMap } from "@/components/section/SectionConceptMap";
import { SectionTabs } from "@/components/section/SectionTabs";
import { resolveTab } from "@/components/section/section-tabs-shared";
import { GoalsPanel } from "@/components/section/GoalsPanel";
import { QuizLauncherPanel } from "@/components/section/QuizLauncherPanel";
import { FlashcardsPanel } from "@/components/section/FlashcardsPanel";
import { GamesPanel } from "@/components/section/GamesPanel";
import { AppliedPanel } from "@/components/section/AppliedPanel";
import { Container } from "@/components/ui/Container";
import { copyFor } from "@/lib/pack-helpers";

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

  const goalsPanel = (
    <GoalsPanel section={section} meta={meta} formatMinutes={formatMinutes} />
  );

  const conceptsPanel = (
    <section aria-labelledby="concepts-heading" className="flex flex-col gap-4">
      <SectionConceptMap section={section} packId={packId} />
      <div>
        <h2
          id="concepts-heading"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
        >
          Concepts
        </h2>
        <SectionConceptList section={section} packId={packId} />
      </div>
    </section>
  );

  const flashcardsPanel = <FlashcardsPanel cards={flashcards} />;

  const quizPanel = (
    <QuizLauncherPanel
      section={section}
      packId={packId}
      sectionTestLabel={copy.sectionTestSingular}
    />
  );

  const gamesPanel = <GamesPanel packId={packId} sectionId={sectionId} />;

  const appliedPanel = <AppliedPanel section={section} packId={packId} />;

  return (
    <Container as="article" width="wide" className="py-2">
      <Breadcrumbs trail={journeyTrail(pack, { label: section.title })} />
      <SectionTabs
        activeTab={activeTab}
        panels={{
          goals: goalsPanel,
          concepts: conceptsPanel,
          flashcards: flashcardsPanel,
          quiz: quizPanel,
          apply: appliedPanel,
          games: gamesPanel,
        }}
      />
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href={`/${packId}`}
          className="text-(--muted) hover:text-(--ink)"
        >
          ← Back to {pack.config.name} journey
        </Link>
        <span aria-hidden className="text-(--muted)">·</span>
        <Link href="/" className="text-(--muted) hover:text-(--ink)">
          All journeys
        </Link>
      </div>
    </Container>
  );
}
