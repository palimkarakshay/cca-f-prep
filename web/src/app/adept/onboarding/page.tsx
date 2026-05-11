import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  ClipboardCheck,
  FileSearch,
  GraduationCap,
  LineChart,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { B2B_PACKS } from "@/content/pack-registry";

export const metadata: Metadata = {
  title: `${BRAND.b2bName} onboarding — pick your lane`,
  description: `Onboarding for ${BRAND.b2bName} clients. Three lanes — leaders scoping a pilot, SMEs verifying content, learners taking a journey. Each lane shows what you do, what you bring, and the next step.`,
};

const LANES = [
  {
    id: "leader",
    Icon: Briefcase,
    label: "I'm a leader / decision-maker",
    help: "L&D head, manager, ops or compliance owner. You're scoping whether Adept fits your team.",
  },
  {
    id: "sme",
    Icon: PencilLine,
    label: "I'm a subject-matter expert",
    help: "You own the truth of the content. Adept routes AI-drafted material through you for review + sign-off before it ships.",
  },
  {
    id: "learner",
    Icon: GraduationCap,
    label: "I'm a learner",
    help: "You're inside a team that uses Adept. You want to know what taking a pack feels like, and what's measured.",
  },
] as const;

interface Step {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  body: string;
}

const LEADER_STEPS: Step[] = [
  {
    Icon: ClipboardCheck,
    title: "Pick one role + one gap",
    body: "Adept pilots run scoped — one role, one capability gap, one SME owner. Bring the role title, the gap in plain English, and the success criterion you'd accept as proof it worked.",
  },
  {
    Icon: FileSearch,
    title: "Gather your source-of-truth material",
    body: "SOPs, policies, training decks, code docs, internal wikis. Whatever the SME would point at if a new hire asked. The Curio engine drafts from these — no hallucinated training.",
  },
  {
    Icon: ShieldCheck,
    title: "Nominate the SME",
    body: "One subject-matter expert who can spend ~4 hours over the pilot reviewing the AI-drafted pack. Their sign-off is what makes the content ship-worthy.",
  },
  {
    Icon: LineChart,
    title: "Agree the readout",
    body: "Pilot end → mastery curve, time-to-pass, stalled-concept heatmap, pre/post delta. We pre-agree which numbers count as success so production renewal isn't a vibes call.",
  },
];

const SME_STEPS: Step[] = [
  {
    Icon: FileSearch,
    title: "Walk into the workbench",
    body: "Open /adept and pick the pack you've been assigned to verify. Each concept appears side-by-side: AI-drafted version on the left, your edits on the right.",
  },
  {
    Icon: PencilLine,
    title: "Edit, validate, or reject — per concept",
    body: "For each concept: tighten the lesson, fix the quiz options, or reject the whole thing. Validation is a sign + timestamp — it's audit-ready by construction.",
  },
  {
    Icon: ShieldCheck,
    title: "Deploy when the pack is approved",
    body: "Pack-level deploy action snapshots the current verified state. Learners only see content you've signed off on. You can re-deploy after edits whenever the source-of-truth shifts.",
  },
  {
    Icon: LineChart,
    title: "Close the loop with the data",
    body: "After each cohort, the readout flags the concepts most learners stalled on. That's your rewrite list — the workbench keeps the prior version so the diff is clear.",
  },
];

const LEARNER_STEPS: Step[] = [
  {
    Icon: Sparkles,
    title: "First-run: name your why",
    body: "Adept asks you two questions before the first lesson — what you want to do with this, and why now. The pack is the same; the framing shaped to your answers is yours.",
  },
  {
    Icon: GraduationCap,
    title: "Sectioned lessons + applied practice",
    body: "Each section has a lesson, a quick quiz, and a short applied exercise. Quizzes adapt: below 60% triggers a drill recommendation; passing unlocks the next section.",
  },
  {
    Icon: ClipboardCheck,
    title: "Section tests prove transfer",
    body: "End of each section is a graded test against the SME-defined pass-gate. Best score is kept; first attempt is reported separately so you can see how the gap closed.",
  },
  {
    Icon: LineChart,
    title: "What gets measured",
    body: "Your mastery curve, your time-to-pass, and the concepts you drilled. Aggregate (de-identified) data goes to your SME so the next version of the pack lands better.",
  },
];

export default function AdeptOnboardingPage() {
  // Pick a single demo pack to anchor the "try it as a learner" CTAs.
  // Acme is the canonical company-specific demo; falls back to the
  // first B2B pack if Acme is ever renamed.
  const demoPack =
    B2B_PACKS.find((p) => p.config.id === "acme-onboarding") ?? B2B_PACKS[0];
  const demoPackId = demoPack?.config.id;
  const demoPackName = demoPack?.config.name;

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
          {BRAND.b2bName} onboarding
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold text-(--ink)">
          Pick your lane
        </h1>
        <p className="max-w-2xl text-sm text-(--muted)">
          {BRAND.b2bName} touches three roles inside a customer org —
          leaders who scope, SMEs who verify, learners who take the pack.
          Each lane below shows what you actually do, what you need to
          bring, and the next concrete step. Jump to your lane; the other
          two are there so you can see what the rest of your team is on
          the hook for.
        </p>
      </header>

      <nav
        aria-label="Choose your role"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {LANES.map((lane) => (
          <a
            key={lane.id}
            href={`#lane-${lane.id}`}
            aria-label={`${lane.label} — ${lane.help}`}
            className="group flex h-full flex-col gap-2 rounded-lg border border-(--border) bg-(--panel) p-4 no-underline shadow-sm transition-colors hover:border-(--accent) hover:bg-(--panel-2) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-(--ink)">
              <lane.Icon
                aria-hidden
                className="h-4 w-4 text-(--accent) transition-transform group-hover:scale-110"
              />
              {lane.label}
            </span>
            <span className="text-xs text-(--muted)">{lane.help}</span>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-(--accent-2)">
              Jump in
              <ArrowRight aria-hidden className="h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </nav>

      <LaneSection
        id="lane-leader"
        Icon={Briefcase}
        title="Leaders — scope a pilot"
        blurb="You bring the role, the gap, and the SME. We come back with a fixed-price pilot proposal in 5 business days. Four inputs decide whether the pilot is scoped tight enough to land."
        steps={LEADER_STEPS}
        cta={{
          primary: {
            label: `How ${BRAND.b2bName} works (full write-up)`,
            href: "/for-teams",
          },
          secondary: { label: "See a demo pack", href: "/adept" },
        }}
        footerCallout={
          <>
            <strong className="text-(--ink)">Stop-signal — read this first:</strong>{" "}
            pilots fail when the role is too broad, the gap is too fuzzy,
            or the SME can&apos;t commit ~4 hours. If any of those is the
            case, narrow the brief before you send it.
          </>
        }
      />

      <LaneSection
        id="lane-sme"
        Icon={PencilLine}
        title="SMEs — verify the content"
        blurb="You're the truth layer. The AI drafts; you approve. Four steps cover the full workbench loop, including the close-the-loop pass after a cohort lands."
        steps={SME_STEPS}
        cta={
          demoPackId
            ? {
                primary: {
                  label: `Open the ${demoPackName} workbench`,
                  href: `/adept/sme/${demoPackId}`,
                },
                secondary: {
                  label: `Preview the learner view`,
                  href: `/${demoPackId}`,
                },
              }
            : {
                primary: { label: "Open the SME workbench", href: "/adept" },
              }
        }
        footerCallout={
          <>
            <strong className="text-(--ink)">In this demo:</strong> edits +
            approvals + deploys are kept in your browser only. In a
            production rollout the same UI writes to your company
            workspace and audit logs persist in L&amp;D admin tools.
          </>
        }
      />

      <LaneSection
        id="lane-learner"
        Icon={GraduationCap}
        title="Learners — what taking a pack feels like"
        blurb="Adept is the same Curio shell your consumers see, with company-approved content and a measurement layer. The four steps below match the actual first-run flow."
        steps={LEARNER_STEPS}
        cta={
          demoPackId
            ? {
                primary: {
                  label: `Take ${demoPackName} as a learner`,
                  href: `/${demoPackId}`,
                },
                secondary: {
                  label: `Try a Curio (consumer) pack`,
                  href: "/",
                },
              }
            : { primary: { label: "Browse demo packs", href: "/adept" } }
        }
        footerCallout={
          <>
            <strong className="text-(--ink)">Privacy note:</strong> what
            you score on each concept is yours. Aggregate, de-identified
            data goes to your SME so the next version of the pack lands
            better. No per-learner score reaches a manager unless your
            company explicitly wires that integration.
          </>
        }
      />

      <Card tone="good" className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-(--ink)">
          <Users aria-hidden className="h-4 w-4 text-(--accent)" />
          Not sure which lane you&apos;re in?
        </h2>
        <p className="text-sm text-(--muted)">
          If you wear two hats (most operators do), read your primary
          lane first, then skim the other. The most common combination
          is leader + SME on the first pilot — you scope it and you
          verify the content because the company can&apos;t free up two
          people yet. That&apos;s fine; the workbench is designed for
          that overlap.
        </p>
        <p className="text-sm">
          <Link
            href="/for-teams"
            className="inline-flex items-center gap-1 text-(--accent-2) underline-offset-4 hover:underline"
          >
            Read the full {BRAND.b2bName} write-up
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </p>
      </Card>

      <footer className="text-sm text-(--muted)">
        <Link href="/adept" className="underline hover:text-(--ink)">
          ← Back to {BRAND.b2bName} workspace
        </Link>
      </footer>
    </Container>
  );
}

interface LaneCTA {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

function LaneSection({
  id,
  Icon,
  title,
  blurb,
  steps,
  cta,
  footerCallout,
}: {
  id: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  blurb: string;
  steps: Step[];
  cta: LaneCTA;
  footerCallout?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="flex flex-col gap-4 scroll-mt-24"
    >
      <header className="flex flex-col gap-2">
        <h2
          id={`${id}-heading`}
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)"
        >
          <Icon aria-hidden className="h-5 w-5 text-(--accent)" />
          {title}
        </h2>
        <p className="max-w-2xl text-sm text-(--muted)">{blurb}</p>
      </header>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {steps.map((step, i) => {
          const StepIcon = step.Icon;
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
                  <StepIcon aria-hidden className="h-4 w-4 text-(--accent)" />
                  <h3 className="text-sm font-semibold text-(--ink)">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-(--muted)">{step.body}</p>
              </Card>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={cta.primary.href}
          className="inline-flex items-center gap-2 rounded-md bg-(--accent) px-3 py-2 text-sm font-semibold text-white no-underline shadow-sm transition-colors hover:bg-(--accent-2)"
        >
          {cta.primary.label}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        {cta.secondary ? (
          <Link
            href={cta.secondary.href}
            className="inline-flex items-center gap-2 rounded-md border border-(--border) bg-(--panel) px-3 py-2 text-sm font-semibold text-(--ink) no-underline shadow-sm transition-colors hover:border-(--accent) hover:text-(--accent-2)"
          >
            {cta.secondary.label}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      {footerCallout ? (
        <Card tone="warn">
          <p className="text-sm text-(--muted)">{footerCallout}</p>
        </Card>
      ) : null}
    </section>
  );
}
