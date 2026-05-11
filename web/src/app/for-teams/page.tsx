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
    title: "Scope with the customer",
    body:
      "We start from the company's actual capability gaps — onboarding for a role, compliance refresh, internal tool adoption. The output is a one-page brief: target audience, success criteria, end-use, and the SME who will own sign-off.",
    Icon: ClipboardCheck,
  },
  {
    num: 2,
    title: "Draft with the Curio engine",
    body:
      "Same content-pack engine as the consumer product. We seed it with the customer's source-of-truth material (SOPs, policies, code docs, training decks) and generate a structured pack: sections, concept lessons, quizzes, section tests, optional mock exam.",
    Icon: Workflow,
  },
  {
    num: 3,
    title: "SME elicit + verify",
    body:
      "The customer's subject-matter expert reviews each concept in a side-by-side editor: keep, edit, or reject. Every accepted concept records who signed it off and on what date — audit-ready by construction. Nothing ships unverified.",
    Icon: ShieldCheck,
  },
  {
    num: 4,
    title: "Roll out to learners",
    body:
      "Same Curio shell, the customer's branding and content. SSO-ready (roadmap), per-learner progress, optional cohort grouping. Same backward-design prompts on first run so each learner names their own success criteria and end-use.",
    Icon: Users,
  },
  {
    num: 5,
    title: "Effectivity report + next steps",
    body:
      "After each cohort: mastery curves per concept, time-to-pass distribution, drill-trigger frequency, and the concepts most learners stalled on. The SME uses that to rewrite weak concepts; the loop closes. We propose the next pack only when the data says the current one is landing.",
    Icon: LineChart,
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
      </header>

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
