import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMockExamFrom } from "@/content/curriculum-loader";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { journeyTrail } from "@/lib/nav-trail";
import { Container } from "@/components/ui/Container";
import { MockExamPage } from "@/components/quiz/MockExamPage";
import { copyFor } from "@/lib/pack-helpers";

type Params = { packId: string; mockId: string };

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const packId of ALL_PACK_IDS) {
    const pack = getPack(packId);
    if (!pack) continue;
    for (const m of pack.curriculum.mockExams ?? []) {
      out.push({ packId, mockId: m.id });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId, mockId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Not found" };
  const copy = copyFor(pack);
  const mock = getMockExamFrom(pack.curriculum, mockId);
  if (!mock) return { title: `${copy.mockExamsHeading} not found` };
  return { title: mock.title };
}

export default async function MockRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId, mockId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const copy = copyFor(pack);
  const mock = getMockExamFrom(pack.curriculum, mockId);
  if (!mock) notFound();

  return (
    <Container width="narrow" className="py-2">
      <Breadcrumbs
        trail={journeyTrail(
          pack,
          { label: copy.mockExamsHeading, href: `/${packId}/mock` },
          { label: mock.title }
        )}
      />
      <MockExamPage mock={mock} />
    </Container>
  );
}
