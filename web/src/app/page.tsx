import type { Metadata } from "next";
import { RecommendationBanner } from "@/components/dashboard/RecommendationBanner";
import { SectionList } from "@/components/dashboard/SectionList";
import { MockExamPanel } from "@/components/dashboard/MockExamPanel";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Dashboard",
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <Container width="wide" className="flex flex-col gap-6 py-2">
      {/* Page-level h1 (the chrome Header already shows the tagline; we
          keep the wordmark visible here as a landmark heading but skip
          the tagline so it doesn't duplicate-render and break strict-mode
          locators). */}
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          {siteConfig.name}
        </h1>
      </header>
      <RecommendationBanner />

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
