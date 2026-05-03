import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { getConceptFrom } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { LessonView } from "@/components/concept/LessonView";

type Params = { packId: string; sectionId: string; conceptId: string };

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const packId of ALL_PACK_IDS) {
    const pack = getPack(packId);
    if (!pack) continue;
    for (const s of pack.curriculum.sections) {
      for (const c of s.concepts) {
        out.push({ packId, sectionId: s.id, conceptId: c.id });
      }
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId, sectionId, conceptId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Concept not found" };
  const found = getConceptFrom(pack.curriculum, sectionId, conceptId);
  if (!found) return { title: "Concept not found" };
  return {
    title: `${found.concept.code} · ${found.concept.title}`,
    description: found.concept.lesson?.simplified?.oneLiner ?? found.section.blurb,
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId, sectionId, conceptId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const found = getConceptFrom(pack.curriculum, sectionId, conceptId);
  if (!found) notFound();
  const { section, concept } = found;

  return (
    <Container width="widest" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: `/${packId}` },
          {
            label: section.title,
            href: `/${packId}/section/${section.id}`,
          },
          { label: concept.title },
        ]}
      />
      <LessonView section={section} concept={concept} />
    </Container>
  );
}
