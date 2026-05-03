import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { getConceptFrom } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { ConceptQuizPage } from "@/components/quiz/ConceptQuizPage";

type Params = { packId: string; sectionId: string; conceptId: string };

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const packId of ALL_PACK_IDS) {
    const pack = getPack(packId);
    if (!pack) continue;
    for (const s of pack.curriculum.sections) {
      for (const c of s.concepts) {
        if (c.quiz) out.push({ packId, sectionId: s.id, conceptId: c.id });
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
  if (!pack) return { title: "Quiz not found" };
  const found = getConceptFrom(pack.curriculum, sectionId, conceptId);
  if (!found) return { title: "Quiz not found" };
  return {
    title: `Quiz · ${found.concept.code} ${found.concept.title}`,
  };
}

export default async function ConceptQuizRoute({
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
    <Container width="narrow" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: `/${packId}` },
          { label: section.title, href: `/${packId}/section/${section.id}` },
          {
            label: concept.title,
            href: `/${packId}/concept/${section.id}/${concept.id}`,
          },
          { label: "Quiz" },
        ]}
      />
      <ConceptQuizPage section={section} concept={concept} />
    </Container>
  );
}
