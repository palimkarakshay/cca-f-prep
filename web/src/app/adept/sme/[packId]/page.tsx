import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { B2B_PACKS, getPack } from "@/content/pack-registry";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/primitives/Breadcrumbs";
import { SMEWorkbench } from "@/components/adept/SMEWorkbench";
import { BRAND } from "@/lib/brand";

type Params = { packId: string };

/**
 * SSG only the B2B packs — consumer packs don't have an SME
 * workbench, so /adept/sme/learn-french should 404 even though
 * `learn-french` is a registered pack.
 */
export function generateStaticParams(): Params[] {
  return B2B_PACKS.map((p) => ({ packId: p.config.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack || pack.config.audience !== "b2b") {
    return { title: "Not found" };
  }
  return {
    title: `SME workbench — ${pack.config.name}`,
    description: `Create, edit, validate, and deploy ${pack.config.name} content as the company SME. ${BRAND.b2bName} demo workbench.`,
  };
}

export default async function SMEWorkbenchPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack || pack.config.audience !== "b2b") notFound();

  return (
    <Container width="widest" className="flex flex-col gap-6 py-2">
      <Breadcrumbs
        trail={[
          { label: `${BRAND.b2bName} demo`, href: "/adept" },
          { label: `SME workbench: ${pack.config.name}` },
        ]}
      />

      <header className="flex flex-col gap-2">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          {BRAND.b2bName} workbench
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {pack.config.name}
        </h1>
        <p className="text-sm text-(--muted)">{pack.config.description}</p>
      </header>

      <SMEWorkbench pack={pack} />

      <footer className="text-sm text-(--muted)">
        <Link href="/adept" className="underline hover:text-(--ink)">
          ← Back to {BRAND.b2bName} demo
        </Link>
        {" "}·{" "}
        <Link href={`/${pack.config.id}`} className="underline hover:text-(--ink)">
          Open as a learner →
        </Link>
      </footer>
    </Container>
  );
}
