import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardCheck,
  Users,
  LineChart,
  ArrowRight,
  ShieldCheck,
  Workflow,
  Compass,
  Briefcase,
  Library,
  Building2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.b2bName} for teams`,
  description: `How ${BRAND.b2bName} delivers company-approved, SME-verified learning packs to teams — with measurable effectivity data.`,
};

interface Step {
  num: number;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

const STEPS: Step[] = [
  {
    num: 1,
    title: "Scope with the journey decoder",
    body:
      "Start in the designer lane on the home page. Two questions — the capability gap and the business driver — feed the journey decoder, which produces a structured brief: section spine, audience cues, success signals, and the source documents you'll need to upload. That brief is what your SME signs off on before drafting begins.",
    Icon: ClipboardCheck,
  },
  {
    num: 2,
    title: "Draft in the SME workbench",
    body:
      "Same content-pack engine as the consumer Curio product, opened inside the SME workbench at /adept. We seed it with your source-of-truth material (SOPs, policies, code docs, training decks) and the workbench renders a draft pack — sections, concept lessons, quizzes, section tests, optional mock exam — ready for SME review.",
    Icon: Workflow,
  },
  {
    num: 3,
    title: "SME elicit + verify in the workbench",
    body:
      "Your subject-matter expert works through the workbench concept-by-concept: accept, edit, or revert. Each approval is signed with the SME's name and timestamped, so the pack is audit-ready by construction. A pack-level Deploy action snapshots the approved state — nothing ships unverified.",
    Icon: ShieldCheck,
  },
  {
    num: 4,
    title: "Roll out to learners",
    body:
      "The same consumer Curio shell, now serving your branded, SME-approved content. Per-learner progress, optional cohort grouping, SSO on the roadmap. Learners run the same backward-design prompts on first touch, so each one names their own success criteria — and you can compare those against the SME-defined ones from step 1.",
    Icon: Users,
  },
  {
    num: 5,
    title: "Effectivity report + next steps",
    body:
      "After each cohort: mastery curves per concept, time-to-pass distribution, drill-trigger frequency, and the concepts most learners stalled on. The SME uses that to rewrite weak concepts in the workbench; the loop closes. We propose the next pack only when the data says the current one is landing.",
    Icon: LineChart,
  },
];

interface PackKind {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  body: string;
  badge: string;
}

const PACK_KINDS: PackKind[] = [
  {
    Icon: Library,
    title: "General library — pre-approved by Curio L&D",
    body: "Baseline content companies adopt as-is (workplace comms, security awareness, new-manager basics, …). Your SME swaps any concept via the workbench without rewriting from scratch. Fastest path to a deployed pack.",
    badge: "Pre-approved · swap-and-deploy",
  },
  {
    Icon: Building2,
    title: "Company-specific — drafted from your material",
    body: "One-tenant content authored against your policies, tooling, and source-of-truth docs. Acme Co. onboarding is the shipped example. Longer pilot, but the pack matches your reality exactly.",
    badge: "Company-specific · tenant-only",
  },
];

const DEMO_BULLETS = [
  "We co-author one pilot pack from your real material (one role, 8–15 concepts).",
  "Your SME owns the verification queue — accept/edit/reject per concept, with timestamps.",
  "Cohort of 10–25 learners runs the pack; we instrument mastery, time, and drill data.",
  "End-of-cohort readout: pass-rate curve + per-concept stall analysis + a written next-pack proposal grounded in that data.",
  "Pricing for the pilot is fixed and non-refundable; production licence depends on the effectivity readout.",
];

export default function ForTeamsPage() {
  return (
    <Container width="wide" className="flex flex-col gap-8 py-2">
      <Image
        src="/images/hero/final/for-teams-hero.jpg"
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
          Curio for consumers lets anyone learn anything. {BRAND.b2bName} brings
          that same shell into companies: company-approved curriculum,
          SME-verified content, measurable effectivity. No hallucinated
          training material, no untracked sign-off.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/adept"
            className="inline-flex items-center gap-1 rounded-md bg-(--accent) px-3 py-2 font-semibold text-white no-underline shadow-sm hover:bg-(--accent-2)"
          >
            Try the {BRAND.b2bName} demo workspace
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
          <Link
            href="/#lane-designer"
            className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-3 py-2 font-medium text-(--ink) no-underline shadow-sm hover:border-(--accent) hover:text-(--accent-2)"
          >
            Start with the journey decoder
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section aria-labelledby="lane-context" className="flex flex-col gap-3">
        <h2
          id="lane-context"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          Where {BRAND.b2bName} fits — the designer lane
        </h2>
        <Card tone="accent">
          <div className="flex items-start gap-3">
            <Compass
              aria-hidden
              className="h-5 w-5 flex-none text-(--accent)"
            />
            <div className="flex flex-col gap-2 text-sm text-(--muted)">
              <p>
                {BRAND.name} opens with a two-lane chooser. Each lane asks the
                same two questions (what + why) but decodes the answers for a
                different audience:
              </p>
              <ul className="flex flex-col gap-1.5">
                <li className="flex items-start gap-2">
                  <Users
                    aria-hidden
                    className="mt-0.5 h-4 w-4 flex-none text-(--accent-2)"
                  />
                  <span>
                    <strong className="text-(--ink)">Learner lane.</strong>{" "}
                    The consumer Curio surface — pick a ready-made journey or
                    have one shaped for you. Self-paced, per-learner progress.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Briefcase
                    aria-hidden
                    className="mt-0.5 h-4 w-4 flex-none text-(--accent-2)"
                  />
                  <span>
                    <strong className="text-(--ink)">Designer lane.</strong>{" "}
                    For L&amp;D leads, instructional designers, and SMEs. The
                    journey decoder produces a structured brief; the SME
                    workbench at <code>/adept</code> turns that brief into an
                    approved pack. <strong className="text-(--ink)">
                      That&apos;s {BRAND.b2bName}.
                    </strong>
                  </span>
                </li>
              </ul>
              <p>
                The five steps below are what happens once you&apos;re in the
                designer lane. The decoder + workbench are not bolt-ons — they
                are the shell.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section
        aria-labelledby="pack-kinds"
        className="flex flex-col gap-3"
      >
        <h2
          id="pack-kinds"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          Two paths into {BRAND.b2bName}
        </h2>
        <p className="max-w-2xl text-sm text-(--muted)">
          Companies adopt {BRAND.b2bName} from one of two starting points.
          Both end up in the same SME workbench and ship through the same
          deploy action — they differ only in where the first draft comes
          from.
        </p>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PACK_KINDS.map((kind) => {
            const Icon = kind.Icon;
            return (
              <li key={kind.title}>
                <Card className="flex h-full flex-col gap-3">
                  <header className="flex items-start gap-3">
                    <Icon
                      aria-hidden
                      className="h-5 w-5 flex-none text-(--accent)"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-(--ink)">
                        {kind.title}
                      </h3>
                      <p className="mt-1 inline-flex w-fit rounded-full border border-(--accent)/40 bg-(--accent)/10 px-2 py-0.5 text-xs font-medium text-(--accent-2)">
                        {kind.badge}
                      </p>
                    </div>
                  </header>
                  <p className="text-sm text-(--muted)">{kind.body}</p>
                </Card>
              </li>
            );
          })}
        </ul>
        <p className="text-sm text-(--muted)">
          See both live on the{" "}
          <Link
            href="/adept"
            className="underline-offset-4 hover:underline"
          >
            {BRAND.b2bName} demo workspace
          </Link>
          .
        </p>
      </section>

      <section
        aria-labelledby="how-it-works"
        className="flex flex-col gap-4"
      >
        <h2
          id="how-it-works"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          How it works
        </h2>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {STEPS.map((step) => {
            const Icon = step.Icon;
            return (
              <li key={step.num}>
                <Card tone="accent" className="flex h-full flex-col gap-3">
                  <header className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-(--panel-2) text-sm font-semibold text-(--accent-2)"
                    >
                      {step.num}
                    </span>
                    <div className="flex-1">
                      <h3 className="flex items-center gap-2 text-base font-semibold text-(--ink)">
                        <Icon aria-hidden className="h-4 w-4 text-(--accent)" />
                        {step.title}
                      </h3>
                    </div>
                  </header>
                  <p className="text-sm text-(--muted)">{step.body}</p>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>

      <section
        aria-labelledby="demo"
        className="flex flex-col gap-3"
      >
        <h2
          id="demo"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          What the demo pilot looks like
        </h2>
        <Card>
          <p className="text-sm text-(--muted)">
            A scoped, time-boxed evaluation. We commit to one pack and one
            cohort; you commit to one SME and one role. Both sides see real
            data before either commits to a production licence.
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-(--muted)">
            {DEMO_BULLETS.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <ArrowRight
                  aria-hidden
                  className="mt-1 h-3.5 w-3.5 flex-none text-(--accent)"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section
        aria-labelledby="what-we-measure"
        className="flex flex-col gap-3"
      >
        <h2
          id="what-we-measure"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          What we measure (the effectivity layer)
        </h2>
        <p className="text-sm text-(--muted)">
          Self-report &ldquo;completed&rdquo; isn&apos;t evidence. We
          instrument the learning loop end-to-end and surface only the
          metrics that map back to the SME-defined success criteria from
          step 1.
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              k: "Mastery curve",
              v: "% of concepts each learner has scored at or above the pass-gate, over time. Per cohort and per role.",
            },
            {
              k: "Time-to-pass",
              v: "Median + p95 from first-touch to mastered, per concept. Identifies the concepts that drag the whole cohort.",
            },
            {
              k: "Drill frequency",
              v: "Concepts that triggered the below-60% drill recommendation. High drill rates flag content that needs an SME rewrite.",
            },
            {
              k: "Section-test pass rate",
              v: "Pass-gate is configurable per pack. We report first-attempt and best-attempt.",
            },
            {
              k: "Stalled-concept heatmap",
              v: "Which concepts learners read but never quiz. Surface for the SME so they can shorten or restructure.",
            },
            {
              k: "Pre/post delta",
              v: "Optional baseline assessment at pack start vs. section-test at end. The strongest evidence of transfer.",
            },
          ].map((row) => (
            <li key={row.k}>
              <Card className="h-full">
                <p className="text-sm font-semibold text-(--ink)">{row.k}</p>
                <p className="mt-1 text-sm text-(--muted)">{row.v}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="try-first"
        className="flex flex-col gap-3"
      >
        <h2
          id="try-first"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          Try it before you brief us
        </h2>
        <Card>
          <p className="text-sm text-(--muted)">
            The {BRAND.b2bName} demo workspace is fully interactive and runs
            entirely in your browser — no signup, no server. Take a general-
            library pack as a learner, then open the same pack in the SME
            workbench to see the accept / edit / revert / deploy loop a real
            customer SME walks through.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link
              href="/adept"
              className="inline-flex items-center gap-1 rounded-md bg-(--accent) px-3 py-2 font-semibold text-white no-underline shadow-sm hover:bg-(--accent-2)"
            >
              Open the {BRAND.b2bName} demo
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link
              href="/#lane-designer"
              className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-3 py-2 font-medium text-(--ink) no-underline shadow-sm hover:border-(--accent) hover:text-(--accent-2)"
            >
              Decode a journey from your own gap
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      </section>

      <section
        aria-labelledby="next-steps"
        className="flex flex-col gap-3"
      >
        <h2
          id="next-steps"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--ink)"
        >
          Next steps
        </h2>
        <Card tone="good">
          <ol className="flex flex-col gap-2 text-sm text-(--ink)">
            <li>
              <strong>Send us the brief.</strong> One role, one capability
              gap, one SME. We&apos;ll come back with a scoped pilot
              proposal in 5 business days.
            </li>
            <li>
              <strong>Sign the pilot.</strong> Fixed price, non-refundable;
              4–8 week timebox depending on source-material readiness.
            </li>
            <li>
              <strong>Decide on production from the readout.</strong> No
              renewal until the effectivity data lands. If it doesn&apos;t,
              we owe you the post-mortem, not a discount.
            </li>
          </ol>
          <p className="mt-4 text-sm text-(--muted)">
            We&apos;re early — pilot capacity is intentionally small while
            the engine + verification flow harden. Get in touch via the
            repo issue tracker for now.
          </p>
          <p className="mt-3 text-sm">
            <Link
              href="/adept/onboarding"
              className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-2 font-semibold text-white no-underline shadow-sm transition-colors hover:bg-(--accent-2)"
            >
              See the onboarding lanes for leaders, SMEs, and learners
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
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
