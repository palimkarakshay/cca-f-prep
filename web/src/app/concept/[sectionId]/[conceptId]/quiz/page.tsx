import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURRICULUM } from "@/content/curriculum";
import { getConcept } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { ConceptQuizPage } from "@/components/quiz/ConceptQuizPage";

type Params = { sectionId: string; conceptId: string };

export function generateStaticParams(): Params[] {
  return CURRICULUM.sections.flatMap((s) =>
    s.concepts
      .filter((c) => c.quiz)
      .map((c) => ({ sectionId: s.id, conceptId: c.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sectionId, conceptId } = await params;
  const found = getConcept(sectionId, conceptId);
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
  const { sectionId, conceptId } = await params;
  const found = getConcept(sectionId, conceptId);
  if (!found) notFound();
  const { section, concept } = found;

  return (
    <Container width="narrow" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: "/" },
          { label: section.title, href: `/section/${section.id}` },
          {
            label: concept.title,
            href: `/concept/${section.id}/${concept.id}`,
          },
          { label: "Quiz" },
        ]}
      />
      <ConceptQuizPage section={section} concept={concept} />
    </Container>
  );
}
