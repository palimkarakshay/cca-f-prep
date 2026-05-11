import type { Metadata } from "next";
import Link from "next/link";
import { ALL_PACKS } from "@/content/pack-registry";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { LearningGoalCapture } from "@/components/dashboard/LearningGoalCapture";

export const metadata: Metadata = {
  title: "Pick a topic",
  description:
    "Choose what you want to learn today. Each topic carries its own progress, sections, and quizzes.",
};

export default function PickerPage() {
  return (
    <Container width="wide" className="flex flex-col gap-6 py-2">
      <header>
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          {BRAND.name} · {BRAND.tagline}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          What do you want to learn today?
        </h1>
        <p className="mt-1 text-sm text-(--muted)">
          Tell us your goal — {BRAND.name} shapes a pack around it. Already have
          a topic in mind? Pick one of the courses below; each is a
          self-contained course with its own progress.
        </p>
      </header>

      <LearningGoalCapture />

      <section aria-labelledby="ready-to-go" className="flex flex-col gap-3">
        <header>
          <h2
            id="ready-to-go"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)"
          >
            Ready-made courses
          </h2>
          <p className="text-sm text-(--muted)">
            Curated topics, fully authored. Pick one to start now — switch any
            time. Progress is kept per topic.
          </p>
        </header>
      <ul
        aria-label="Available topics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ALL_PACKS.map((pack) => {
          const c = pack.config;
          const sectionCount = pack.curriculum.sections.length;
          const conceptCount = pack.curriculum.sections.reduce(
            (n, s) => n + s.concepts.length,
            0
          );
          const mockCount = (pack.curriculum.mockExams ?? []).length;
          return (
            <li key={c.id}>
              <Card className="flex h-full flex-col gap-3 p-5">
                <header className="flex items-start gap-3">
                  <div
                    aria-hidden
                    className="h-12 w-12 flex-none overflow-hidden rounded-md border border-(--border) bg-(--panel-2)"
                    dangerouslySetInnerHTML={{ __html: c.iconSvg }}
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-(--ink)">
                      {c.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-(--muted)">
                      {c.tagline}
                    </p>
                  </div>
                </header>

                <p className="text-sm text-(--muted)">{c.description}</p>

                <ul className="mt-auto flex flex-wrap gap-2 text-xs text-(--muted)">
                  <li className="rounded-full border border-(--border) px-2 py-0.5">
                    {sectionCount} section{sectionCount === 1 ? "" : "s"}
                  </li>
                  <li className="rounded-full border border-(--border) px-2 py-0.5">
                    {conceptCount} concept{conceptCount === 1 ? "" : "s"}
                  </li>
                  {mockCount > 0 ? (
                    <li className="rounded-full border border-(--border) px-2 py-0.5">
                      {mockCount}{" "}
                      {(c.copy?.mockExamsHeading ?? "mock exam").toLowerCase()}
                      {mockCount === 1 ? "" : "s"}
                    </li>
                  ) : null}
                </ul>

                <div className="border-t border-dashed border-(--border) pt-3">
                  <Link
                    href={`/${c.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-(--accent-2)"
                  >
                    Start {c.name} →
                  </Link>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
      </section>

      <footer className="mt-2 text-xs text-(--muted)">
        For organisations:{" "}
        <Link href="/for-teams" className="underline hover:text-(--ink)">
          {BRAND.b2bName} for teams
        </Link>{" "}
        — SME-verified, company-approved content packs with measurable
        effectivity.
      </footer>
    </Container>
  );
}
