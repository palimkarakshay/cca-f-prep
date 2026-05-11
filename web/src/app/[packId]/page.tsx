import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RecommendationBanner } from "@/components/dashboard/RecommendationBanner";
import { SectionList } from "@/components/dashboard/SectionList";
import { MockExamPanel } from "@/components/dashboard/MockExamPanel";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { ProgressCharts } from "@/components/dashboard/ProgressCharts";
import { JourneyJumper } from "@/components/dashboard/JourneyJumper";
import { BeforeYouBegin } from "@/components/dashboard/BeforeYouBegin";
import { Container } from "@/components/ui/Container";
import { LastVisitTracker } from "@/components/layout/LastVisitTracker";
import { getPack } from "@/content/pack-registry";
import { siteConfigFor } from "@/lib/pack-helpers";

type Params = { packId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Pack not found" };
  const cfg = siteConfigFor(pack);
  return { title: "Journey overview", description: cfg.description };
}

export default async function PackHomePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();
  const cfg = siteConfigFor(pack);

  return (
    <Container width="wide" className="flex flex-col gap-6 py-2">
      <LastVisitTracker
        packId={pack.config.id}
        packName={pack.config.name}
        href={`/${pack.config.id}`}
      />
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1 text-xs text-(--muted) hover:text-(--ink)"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
          All learning journeys
        </Link>
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          Learning journey
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {cfg.name}
        </h1>
        <p className="text-sm text-(--muted)">{cfg.tagline}</p>
      </header>
      <RecommendationBanner />

      {pack.config.prerequisites ? (
        <BeforeYouBegin
          packId={pack.config.id}
          prerequisites={pack.config.prerequisites}
        />
      ) : null}

      <JourneyJumper />

      <section id="progress" aria-label="Progress overview" className="scroll-mt-24">
        <ProgressCharts />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
        <div className="flex flex-col gap-6 min-w-0">
          <section id="sections" aria-label="All sections" className="scroll-mt-24">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
              Sections
            </h2>
            <SectionList />
          </section>
          <MockExamPanel />
        </div>
        <aside aria-label="Your progress" className="lg:sticky lg:top-6">
          <StatsPanel />
        </aside>
      </div>
    </Container>
  );
}
