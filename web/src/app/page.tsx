import type { Metadata } from "next";
import { RecommendationBanner } from "@/components/dashboard/RecommendationBanner";
import { SectionList } from "@/components/dashboard/SectionList";
import { MockExamPanel } from "@/components/dashboard/MockExamPanel";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Dashboard",
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <Container width="prose" className="flex flex-col gap-6 py-2">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          {siteConfig.name}
        </h1>
        <p className="text-sm text-(--muted)">{siteConfig.tagline}</p>
      </header>
      <RecommendationBanner />
      <SectionList />
      <MockExamPanel />
    </Container>
  );
}
