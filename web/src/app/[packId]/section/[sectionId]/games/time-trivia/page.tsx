import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { getSectionFrom } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { TimeTriviaGame } from "@/components/games/time-trivia/TimeTriviaGame";

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
  if (!pack) return { title: "Time Trivia" };
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) return { title: "Time Trivia" };
  return {
    title: `Time Trivia — ${section.title}`,
    description: `15-second-per-question MCQ round drawn from ${section.title}.`,
  };
}

export default async function TimeTriviaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId, sectionId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) notFound();

  return (
    <Container as="article" width="prose" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: `/${packId}` },
          { label: section.title, href: `/${packId}/section/${section.id}` },
          { label: "Games", href: `/${packId}/section/${section.id}?tab=games` },
          { label: "Time Trivia" },
        ]}
      />
      <TimeTriviaGame section={section} packId={packId} />
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
