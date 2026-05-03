import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMockExam, getMockExams } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { MockResultPage } from "@/components/quiz/MockExamPage";

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
  if (!mock) return { title: "Mock result not found" };
  return { title: `Result · ${mock.title}` };
}

export default async function MockResultRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { mockId } = await params;
  const mock = getMockExam(mockId);
  if (!mock) notFound();

  return (
    <div className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: "/" },
          { label: "Mock exams", href: "/mock" },
          { label: mock.title, href: `/mock/${mock.id}` },
          { label: "Result" },
        ]}
      />
      <MockResultPage mock={mock} />
    </div>
  );
}
