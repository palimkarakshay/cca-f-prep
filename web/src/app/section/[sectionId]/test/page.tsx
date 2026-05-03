import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURRICULUM } from "@/content/curriculum";
import { getSection } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionTestPage } from "@/components/quiz/SectionTestPage";
import { copy } from "@/lib/site-config";

type Params = { sectionId: string };

export function generateStaticParams(): Params[] {
  return CURRICULUM.sections
    .filter((s) => s.sectionTest)
    .map((s) => ({ sectionId: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section) return { title: `${copy.sectionTestSingular} not found` };
  return { title: `${copy.sectionTestSingular} · ${section.title}` };
}

export default async function SectionTestRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section || !section.sectionTest) notFound();

  return (
    <Container width="narrow" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: "/" },
          { label: section.title, href: `/section/${section.id}` },
          { label: copy.sectionTestSingular },
        ]}
      />
      <SectionTestPage section={section} />
    </Container>
  );
}
