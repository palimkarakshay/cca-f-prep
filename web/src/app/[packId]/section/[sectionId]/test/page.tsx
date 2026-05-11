import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { getSectionFrom } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { journeyTrail } from "@/lib/nav-trail";
import { Container } from "@/components/ui/Container";
import { SectionTestPage } from "@/components/quiz/SectionTestPage";
import { copyFor } from "@/lib/pack-helpers";

type Params = { packId: string; sectionId: string };

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const packId of ALL_PACK_IDS) {
    const pack = getPack(packId);
    if (!pack) continue;
    for (const s of pack.curriculum.sections) {
      if (s.sectionTest) out.push({ packId, sectionId: s.id });
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
  if (!pack) return { title: "Not found" };
  const copy = copyFor(pack);
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section) return { title: `${copy.sectionTestSingular} not found` };
  return { title: `${copy.sectionTestSingular} · ${section.title}` };
}

export default async function SectionTestRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId, sectionId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const copy = copyFor(pack);
  const section = getSectionFrom(pack.curriculum, sectionId);
  if (!section || !section.sectionTest) notFound();

  return (
    <Container width="narrow" className="py-2">
      <Breadcrumbs
        trail={journeyTrail(
          pack,
          { label: section.title, href: `/${packId}/section/${section.id}` },
          { label: copy.sectionTestSingular }
        )}
      />
      <SectionTestPage section={section} />
    </Container>
  );
}
