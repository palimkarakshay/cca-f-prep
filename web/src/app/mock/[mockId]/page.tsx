import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMockExam, getMockExams } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { MockExamPage } from "@/components/quiz/MockExamPage";
import { copy } from "@/lib/site-config";

type Params = { mockId: string };

export function generateStaticParams(): Params[] {
  return getMockExams().map((m) => ({ mockId: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { mockId } = await params;
  const mock = getMockExam(mockId);
  if (!mock) return { title: `${copy.mockExamsHeading} not found` };
  return { title: mock.title };
}

export default async function MockRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { mockId } = await params;
  const mock = getMockExam(mockId);
  if (!mock) notFound();

  return (
    <Container width="narrow" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: "/" },
          { label: copy.mockExamsHeading, href: "/mock" },
          { label: mock.title },
        ]}
      />
      <MockExamPage mock={mock} />
    </Container>
  );
}
