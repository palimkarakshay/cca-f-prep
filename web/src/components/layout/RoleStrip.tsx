"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  PencilLine,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { getPack } from "@/content/pack-registry";
import { BRAND } from "@/lib/brand";

/**
 * Role-aware context strip shown directly under the header on
 * expert-mode pages (Adept marketing + workbench + for-teams).
 * Surfaces the active mode and the most useful cross-mode jump
 * (e.g. SME workbench → preview as learner). Renders nothing on
 * learner routes so the consumer chrome stays clean.
 */
export function RoleStrip() {
  const pathname = usePathname() ?? "";
  const mode = modeForPath(pathname);
  if (!mode) return null;

  return (
    <div
      role="region"
      aria-label="Workspace mode"
      className="border-b border-(--border) bg-(--panel-2)/60"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="flex items-center gap-2 text-(--ink)">
          <mode.Icon
            aria-hidden
            className="h-3.5 w-3.5 flex-none text-(--accent)"
          />
          <span className="font-[family-name:var(--font-display)] uppercase tracking-[0.16em] text-(--muted)">
            {mode.eyebrow}
          </span>
          <span className="font-semibold">{mode.title}</span>
          {mode.subtitle ? (
            <span className="hidden text-(--muted) sm:inline">
              · {mode.subtitle}
            </span>
          ) : null}
        </div>
        {mode.actions.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-1.5">
            {mode.actions.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="inline-flex min-h-8 items-center gap-1 rounded-md border border-(--border) bg-(--panel) px-2.5 py-1 font-medium text-(--ink) no-underline shadow-sm transition-colors hover:border-(--accent) hover:text-(--accent-2)"
                >
                  {a.label}
                  <ArrowRight aria-hidden className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

interface ModeAction {
  label: string;
  href: string;
}

interface Mode {
  Icon: typeof Briefcase;
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions: ModeAction[];
}

function modeForPath(pathname: string): Mode | null {
  // SME workbench — explicit "you are editing pack X" mode + a quick
  // jump to the learner preview for the same pack.
  if (pathname.startsWith("/adept/sme/")) {
    const segments = pathname.split("/").filter(Boolean);
    const packId = segments[2] ?? "";
    const pack = packId ? getPack(packId) : null;
    return {
      Icon: PencilLine,
      eyebrow: "Workbench",
      title: pack ? `SME — ${pack.config.name}` : "SME workbench",
      subtitle: "Edit, validate, deploy company-approved content",
      actions: pack
        ? [
            { label: "Preview as learner", href: `/${pack.config.id}` },
            { label: `${BRAND.b2bName} home`, href: "/adept" },
          ]
        : [{ label: `${BRAND.b2bName} home`, href: "/adept" }],
    };
  }
  if (pathname === "/adept" || pathname === "/adept/onboarding") {
    return {
      Icon: Briefcase,
      eyebrow: `${BRAND.b2bName} workspace`,
      title: pathname.endsWith("/onboarding") ? "Onboarding" : "Demo workspace",
      subtitle: "For L&D leaders, SMEs, and the learners they support",
      actions: [
        { label: "Onboarding", href: "/adept/onboarding" },
        { label: `How ${BRAND.b2bName} works`, href: "/for-teams" },
      ],
    };
  }
  if (pathname.startsWith("/adept/")) {
    return {
      Icon: Briefcase,
      eyebrow: `${BRAND.b2bName} workspace`,
      title: "L&D / SME area",
      actions: [{ label: `${BRAND.b2bName} home`, href: "/adept" }],
    };
  }
  if (pathname === "/for-teams" || pathname.startsWith("/for-teams/")) {
    return {
      Icon: GraduationCap,
      eyebrow: "For decision-makers",
      title: `${BRAND.b2bName} for leaders`,
      subtitle: "How the company-approved learning loop actually works",
      actions: [{ label: `Try the demo`, href: "/adept" }],
    };
  }
  return null;
}
