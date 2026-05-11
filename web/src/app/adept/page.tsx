import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardCheck,
  Workflow,
  ShieldCheck,
  Users,
  LineChart,
  ArrowRight,
  PencilLine,
} from "lucide-react";
import { B2B_PACKS } from "@/content/pack-registry";
import type { ContentPack } from "@/content/pack-types";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.b2bName} — demo workspace`,
  description: `${BRAND.b2bName} demo: company-approved, SME-verified learning packs. Try the Acme onboarding pack and the SME create/edit/validate/deploy workbench.`,
};

const STEPS = [
  {
    Icon: ClipboardCheck,
    title: "Scope",
    body: "We define the role + capability gap + success criteria + SME owner on a single page.",
  },
  {
    Icon: Workflow,
    title: "Draft",
    body: "The Curio engine drafts a pack from your source material (SOPs, docs, training decks).",
  },
  {
    Icon: ShieldCheck,
    title: "SME elicit + verify",
    body: "Your SME reviews each concept in the workbench — accept, edit, reject. Every approval signed + timestamped.",
  },
  {
    Icon: Users,
    title: "Roll out",
    body: "Same Curio shell, your branding + verified content. Per-learner progress, optional cohort grouping.",
  },
  {
    Icon: LineChart,
    title: "Effectivity readout",
    body: "Mastery curve, time-to-pass, drill frequency, stalled-concept heatmap, pre/post delta. SME closes the loop.",
  },
];

export default function AdeptPage() {
  return (
    <Container width="wide" className="flex flex-col gap-8 py-2">
      <Image
        src="/images/hero/final/adept-hero.jpg"
        alt=""
        width={1024}
        height={576}
        priority
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="w-full rounded-lg border border-(--border) object-cover"
      />
      <header className="flex flex-col gap-3">
        <p className="font-[family-name:var(--font-display)] text-xs uppercase tracking-[0.18em] text-(--muted)">
          {BRAND.name} for organisations
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold text-(--ink)">
          {BRAND.b2bName} — {BRAND.b2bTagline}
        </h1>
        <p className="max-w-2xl text-sm text-(--muted)">
          The {BRAND.b2bName} demo workspace. Take the same Acme
          onboarding pack a real customer would take, then jump into the
          SME workbench to see how a subject-matter expert edits,
          validates, and deploys company-approved content.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/for-teams"
            className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-(--ink) no-underline shadow-sm hover:border-(--accent) hover:text-(--accent-2)"
          >
            How it works (full write-up)
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section aria-labelledby="how-summary" className="flex flex-col gap-3">
        <h2
          id="how-summary"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          How it works — at a glance
        </h2>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => {
            const Icon = step.Icon;
            return (
              <li key={step.title}>
                <Card tone="accent" className="flex h-full flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-(--panel-2) text-xs font-semibold text-(--accent-2)"
                    >
                      {i + 1}
                    </span>
                    <Icon aria-hidden className="h-4 w-4 text-(--accent)" />
                    <h3 className="text-sm font-semibold text-(--ink)">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-(--muted)">{step.body}</p>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>

      {(() => {
        // Two groups: "general library" packs (pre-approved, swap-and-deploy)
        // and "company-specific" packs (drafted for one customer). The
        // heuristic uses the author label — "Curio L&D (general library)"
        // marks the shared library; everything else is treated as
        // tenant-specific demo content.
        const isGeneral = (a?: string) =>
          (a ?? "").toLowerCase().includes("general library");
        const generalPacks = B2B_PACKS.filter((p) =>
          isGeneral(p.config.author)
        );
        const companyPacks = B2B_PACKS.filter(
          (p) => !isGeneral(p.config.author)
        );

        return (
          <>
            <DemoPackSection
              id="general-library"
              heading="General library — pre-approved by Curio L&D"
              blurb="Baseline content companies adopt as-is. Your SME swaps any concept via the workbench without rewriting from scratch."
              packs={generalPacks}
              kind="general"
            />
            <DemoPackSection
              id="company-specific"
              heading="Company-specific demo packs"
              blurb="One-tenant content authored against a customer's policies + tooling. Acme Co. is the shipped example."
              packs={companyPacks}
              kind="company"
            />
          </>
        );
      })()}

      <section
        aria-labelledby="sme-workbench-intro"
        className="flex flex-col gap-3"
      >
        <h2
          id="sme-workbench-intro"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          The SME workbench
        </h2>
        <Card>
          <p className="text-sm text-(--muted)">
            Where a subject-matter expert turns an AI-drafted concept
            into a company-approved one. For each concept, the SME can
            <strong className="text-(--ink)"> edit </strong>
            the title, lesson, and quiz options;
            <strong className="text-(--ink)"> validate </strong>
            (sign with name + timestamp) when accurate; or revert to the
            original. A pack-level
            <strong className="text-(--ink)"> deploy </strong>
            action snapshots the current state so learners only see
            approved content.
          </p>
          <p className="mt-3 text-sm text-(--muted)">
            In this demo, all edits + approvals + deploys are kept in
            your browser only (no server). In a production rollout the
            same UI writes to your company workspace; audit logs persist
            in the L&amp;D admin tools.
          </p>
        </Card>
      </section>

      <footer className="text-sm text-(--muted)">
        <Link href="/" className="underline hover:text-(--ink)">
          ← Back to {BRAND.name}
        </Link>
      </footer>
    </Container>
  );
}

function DemoPackSection({
  id,
  heading,
  blurb,
  packs,
  kind,
}: {
  id: string;
  heading: string;
  blurb: string;
  packs: ContentPack[];
  kind: "general" | "company";
}) {
  if (packs.length === 0) return null;
  const badgeLabel =
    kind === "general"
      ? "Pre-approved · swap-and-deploy"
      : "Company-specific · tenant-only";
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <header>
        <h2
          id={id}
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          {heading}
        </h2>
        <p className="text-sm text-(--muted)">{blurb}</p>
      </header>
      <ul
        aria-label={heading}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {packs.map((pack) => {
          const c = pack.config;
          const sectionCount = pack.curriculum.sections.length;
          const conceptCount = pack.curriculum.sections.reduce(
            (n, s) => n + s.concepts.length,
            0
          );
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
                    <h3 className="text-base font-semibold text-(--ink)">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-(--muted)">
                      {c.tagline}
                    </p>
                  </div>
                </header>
                <p className="inline-flex w-fit rounded-full border border-(--accent)/40 bg-(--accent)/10 px-2 py-0.5 text-xs font-medium text-(--accent-2)">
                  {badgeLabel}
                </p>
                <p className="text-sm text-(--muted)">{c.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 text-xs text-(--muted)">
                  <li className="rounded-full border border-(--border) px-2 py-0.5">
                    {sectionCount} section{sectionCount === 1 ? "" : "s"}
                  </li>
                  <li className="rounded-full border border-(--border) px-2 py-0.5">
                    {conceptCount} concept{conceptCount === 1 ? "" : "s"}
                  </li>
                </ul>
                <div className="flex flex-wrap gap-2 border-t border-dashed border-(--border) pt-3">
                  <Link
                    href={`/${c.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-(--accent-2)"
                  >
                    Take it as a learner →
                  </Link>
                  <Link
                    href={`/adept/sme/${c.id}`}
                    className="inline-flex items-center gap-2 rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm font-semibold text-(--ink) no-underline shadow-sm transition-colors hover:border-(--accent) hover:text-(--accent-2)"
                  >
                    <PencilLine aria-hidden className="h-4 w-4" />
                    Open SME workbench
                  </Link>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
