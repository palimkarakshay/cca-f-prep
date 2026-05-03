import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import {
  getSectionFlashcards,
  getSectionFrom,
} from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { FlashcardBattleGame } from "@/components/games/flashcard-battle/FlashcardBattleGame";

type Params = { packId: string; sectionId: string };

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
  if (!pack) return { title: "Flashcard Battle" };
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) return { title: "Flashcard Battle" };
  return {
    title: `Flashcard Battle — ${section.title}`,
    description: `Self-paced flashcard run through ${section.title}. Rate Hard / Good / Easy.`,
  };
}

export default async function FlashcardBattlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId, sectionId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) notFound();
  const cards = getSectionFlashcards(section);

  return (
    <Container as="article" width="prose" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: `/${packId}` },
          { label: section.title, href: `/${packId}/section/${section.id}` },
          { label: "Games", href: `/${packId}/section/${section.id}?tab=games` },
          { label: "Flashcard Battle" },
        ]}
      />
      <FlashcardBattleGame section={section} cards={cards} packId={packId} />
      <div className="mt-6">
        <Link
          href={`/${packId}/section/${section.id}?tab=games`}
          className="text-sm text-(--muted) hover:text-(--ink)"
        >
          ← Back to games
        </Link>
      </div>
    </Container>
  );
}
