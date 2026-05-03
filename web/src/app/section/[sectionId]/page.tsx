import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CURRICULUM } from "@/content/curriculum";
import { getSection } from "@/content/curriculum-loader";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { SectionConceptList } from "@/components/section/SectionConceptList";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { copy } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Params = { sectionId: string };

export function generateStaticParams(): Params[] {
  return CURRICULUM.sections.map((s) => ({ sectionId: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section) return { title: "Section not found" };
  return {
    title: `Section ${section.n}: ${section.title}`,
    description: section.blurb,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section) notFound();

  return (
    <Container as="article" width="prose" className="py-2">
      <Breadcrumbs
        trail={[{ label: "Dashboard", href: "/" }, { label: section.title }]}
      />
      <header className="mb-4">
        <p className="font-mono text-xs text-(--muted)">
          Section {String(section.n).padStart(2, "0")}
          {section.sourceCourse ? ` · ${section.sourceCourse}` : null}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          {section.title}
        </h1>
        <p className="mt-2 text-sm text-(--muted)">{section.blurb}</p>
      </header>

      <section aria-labelledby="concepts-heading">
        <h2
          id="concepts-heading"
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--accent-2)"
        >
          Concepts
        </h2>
        <SectionConceptList section={section} />
      </section>

      {section.sectionTest ? (
        <section
          aria-labelledby="section-test-heading"
          className="mt-6 rounded-lg border border-dashed border-(--border) p-4"
        >
          <h2
            id="section-test-heading"
            className="text-base font-semibold text-(--ink)"
          >
            {copy.sectionTestSingular}
          </h2>
          <p className="mt-1 text-sm text-(--muted)">
            {section.sectionTest.questions.length} questions ·{" "}
            {Math.round((section.sectionTest.passPct ?? 0.7) * 100)}% pass-gate
            unlocks the next section.
          </p>
          <Link
            href={`/section/${section.id}/test`}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "mt-3 no-underline"
            )}
          >
            Take {copy.sectionTestSingular.toLowerCase()}
          </Link>
        </section>
      ) : null}

      <div className="mt-6">
        <Link href="/" className="text-sm text-(--muted) hover:text-(--ink)">
          ← Back to dashboard
        </Link>
      </div>
    </Container>
  );
}
