import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMockExamsFrom } from "@/content/curriculum-loader";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { copyFor } from "@/lib/pack-helpers";
import { cn } from "@/lib/utils";

type Params = { packId: string };

export function generateStaticParams(): Params[] {
  return ALL_PACK_IDS.map((packId) => ({ packId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Not found" };
  const copy = copyFor(pack);
  return {
    title: copy.mockExamsHeading,
    description: copy.mockExamsMetaDescription,
  };
}

export default async function MockIndexPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const copy = copyFor(pack);
  const mocks = getMockExamsFrom(pack.curriculum);

  return (
    <Container width="prose" className="py-2">
      <Breadcrumbs
        trail={[
          { label: "Dashboard", href: `/${packId}` },
          { label: copy.mockExamsHeading },
        ]}
      />
      <header className="mb-4">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          {copy.mockExamsHeading}
        </h1>
        <p className="mt-1 text-sm text-(--muted)">{copy.mockExamsBlurb}</p>
      </header>

      {mocks.length === 0 ? (
        <p className="text-sm text-(--muted)">
          None authored yet. They live at the top level of
          <code className="mx-1 rounded-sm bg-(--panel-2) px-1.5 py-0.5">
            CURRICULUM.mockExams
          </code>
          and surface here automatically.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {mocks.map((m) => (
            <Card key={m.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-base font-semibold text-(--ink)">{m.title}</h2>
                <span className="text-xs text-(--muted)">
                  {m.questions.length} Q · {m.timeMinutes}m ·{" "}
                  {Math.round(m.passPct * 100)}% {copy.passLabel}
                </span>
              </div>
              <p className="mt-1 text-sm text-(--muted)">{m.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/${packId}/mock/${m.id}`}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "no-underline"
                  )}
                >
                  Start
                </Link>
                <Link
                  href={`/${packId}/mock/${m.id}/result`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "no-underline"
                  )}
                >
                  Review last attempt
                </Link>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </Container>
  );
}
