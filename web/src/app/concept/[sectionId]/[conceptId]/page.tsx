import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURRICULUM } from "@/content/curriculum";
import { getConcept } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { LessonView } from "@/components/concept/LessonView";

type Params = { sectionId: string; conceptId: string };

export function generateStaticParams(): Params[] {
  return CURRICULUM.sections.flatMap((s) =>
    s.concepts.map((c) => ({ sectionId: s.id, conceptId: c.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sectionId, conceptId } = await params;
  const found = getConcept(sectionId, conceptId);
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
  const { sectionId, conceptId } = await params;
  const found = getConcept(sectionId, conceptId);
  if (!found) notFound();
  const { section, concept } = found;

  return (
    <div className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: "/" },
          { label: section.title, href: `/section/${section.id}` },
          { label: concept.title },
        ]}
      />
      <LessonView section={section} concept={concept} />
    </div>
  );
}
