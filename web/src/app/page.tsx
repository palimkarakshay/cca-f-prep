import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Briefcase,
  Compass,
  Sparkles,
} from "lucide-react";
import { CONSUMER_PACKS } from "@/content/pack-registry";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { LearningGoalCapture } from "@/components/dashboard/LearningGoalCapture";
import { DesignerJourneyDecoder } from "@/components/dashboard/DesignerJourneyDecoder";
import { ResumeLearningCard } from "@/components/dashboard/ResumeLearningCard";

export const metadata: Metadata = {
  title: "Pick a learning journey",
  description:
    "Tell us what you want to learn and why. Curio shapes a learning journey for you — sectioned lessons, applied practice, and a way to verify mastery.",
};

export default function PickerPage() {
  return (
    <Container width="wide" className="flex flex-col gap-8 py-2">
      <Image
        src="/images/hero/final/picker-hero.jpg"
        alt=""
        width={1024}
        height={576}
        priority
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="w-full rounded-lg border border-(--border) object-cover"
      />
      {/* Resume card — surfaces only when the visitor has a saved
          last-visit record (returning learner). Lives ABOVE the
          "What do you want to learn?" header so a returner can jump
          straight back into their journey without scrolling past
          the picker. The card itself is a client component and
          renders null on first paint, so first-time visitors see
          the picker exactly as before. */}
      <ResumeLearningCard />
      <header>
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          {BRAND.name} · {BRAND.tagline}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-(--ink)">
          What do you want to learn?
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-(--muted)">
          Curio shapes <strong className="text-(--ink)">learning
          journeys</strong> around what you want to do — not generic
          courses. Pick a lane below: you&apos;re here to learn for
          yourself, or you&apos;re designing a journey for someone else
          (that lane is <strong className="text-(--ink)">{BRAND.b2bName}</strong>).
        </p>
      </header>

      {/* Two-lane chooser. Anchors let the persistent secondary CTAs
          jump between lanes without re-rendering. Both lanes ask the
          same two questions (what + why) but decode the answers for
          different audiences. */}
      <nav
        aria-label="Choose your lane"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <LaneTile
          href="#lane-learner"
          Icon={GraduationCap}
          label="I want to learn for myself"
          help="Two questions, then a shaped journey + applied practice. Pick a ready-made journey, or wait for us to author yours."
        />
        <LaneTile
          href="#lane-designer"
          Icon={Briefcase}
          label="I’m designing for someone else"
          help="L&D leads, instructional designers, SMEs. Decode the gap into a brief, then build the pack in the Adept SME workbench."
        />
      </nav>

      {/* Learner lane */}
      <section
        id="lane-learner"
        aria-labelledby="lane-learner-heading"
        className="flex flex-col gap-4 scroll-mt-24"
      >
        <header className="flex items-center gap-2">
          <Compass aria-hidden className="h-5 w-5 text-(--accent)" />
          <h2
            id="lane-learner-heading"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
          >
            For learners
          </h2>
        </header>
        <LearningGoalCapture />

        <section
          aria-labelledby="ready-to-go"
          className="flex flex-col gap-3"
        >
          <header>
            <h3
              id="ready-to-go"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)"
            >
              Ready-made learning journeys
            </h3>
            <p className="text-sm text-(--muted)">
              Already authored. Pick one to start now — switch any time.
              Progress is kept per journey.
            </p>
          </header>
          <ul
            aria-label="Available learning journeys"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CONSUMER_PACKS.map((pack) => {
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
                      {c.iconImagePath ? (
                        <Image
                          aria-hidden
                          src={c.iconImagePath}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 flex-none overflow-hidden rounded-md border border-(--border) bg-(--panel-2) object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden
                          className="h-12 w-12 flex-none overflow-hidden rounded-md border border-(--border) bg-(--panel-2)"
                          dangerouslySetInnerHTML={{ __html: c.iconSvg }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-semibold text-(--ink)">
                          {c.name}
                        </h4>
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
                        {conceptCount} concept
                        {conceptCount === 1 ? "" : "s"}
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
                        aria-label={`Start the ${c.name} learning journey`}
                        className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-(--accent-2)"
                      >
                        Start journey
                        <ArrowRight aria-hidden className="h-4 w-4" />
                      </Link>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      </section>

      {/* Designer lane */}
      <section
        id="lane-designer"
        aria-labelledby="lane-designer-heading"
        className="flex flex-col gap-4 scroll-mt-24"
      >
        <header className="flex items-center gap-2">
          <Briefcase aria-hidden className="h-5 w-5 text-(--accent)" />
          <h2
            id="lane-designer-heading"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
          >
            For Curio L&amp;D designers + SMEs
          </h2>
        </header>
        <DesignerJourneyDecoder />

        <Card>
          <div className="flex items-start gap-3">
            <Sparkles
              aria-hidden
              className="h-5 w-5 flex-none text-(--accent)"
            />
            <div>
              <h3 className="text-base font-semibold text-(--ink)">
                Already have a journey in mind? Skip the decoder.
              </h3>
              <p className="mt-1 text-sm text-(--muted)">
                Jump straight into the SME workbench to draft, edit, validate,
                and deploy a company-approved journey.
              </p>
              <p className="mt-2 text-sm">
                <Link
                  href="/adept"
                  className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                >
                  Open {BRAND.b2bName} demo workspace
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
                {" "}·{" "}
                <Link
                  href="/for-teams"
                  className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                >
                  How {BRAND.b2bName} works (full write-up)
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </section>
    </Container>
  );
}

function LaneTile({
  href,
  Icon,
  label,
  help,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  help: string;
}) {
  return (
    <a
      href={href}
      aria-label={`${label} — ${help}`}
      className="group flex h-full flex-col gap-2 rounded-lg border border-(--border) bg-(--panel) p-4 no-underline shadow-sm transition-colors hover:border-(--accent) hover:bg-(--panel-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-(--ink)">
        <Icon
          aria-hidden
          className="h-4 w-4 text-(--accent) transition-transform group-hover:scale-110"
        />
        {label}
      </span>
      <span className="text-xs text-(--muted)">{help}</span>
      <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-(--accent-2)">
        Jump in
        <ArrowRight aria-hidden className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}
