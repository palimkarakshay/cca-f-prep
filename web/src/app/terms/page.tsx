import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Terms — ${BRAND.name}`,
  description: `Terms of use for ${BRAND.name}.`,
};

/* ------------------------------------------------------------------
   Terms placeholder. NOT lawyer-reviewed. Replace before commercial
   launch — keep the surface live today so footer links don't 404
   once they ship.
------------------------------------------------------------------ */
export default function TermsPage() {
  return (
    <Container width="prose" className="flex flex-col gap-6 py-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          Terms of use
        </h1>
        <p className="mt-2 text-sm text-(--muted)">
          Last updated: not yet — placeholder while the platform is in
          pre-commercial development.
        </p>
      </header>

      <section className="flex flex-col gap-3 text-sm text-(--ink)">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
          Use of the site
        </h2>
        <p>
          {BRAND.name} is provided as-is for educational purposes during
          its pre-commercial development phase. The content is shaped
          for self-study; it does not replace formal training,
          professional advice, or certification.
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold">
          Content accuracy
        </h2>
        <p>
          The content packs are drafted by the site operator and, in
          some cases, AI-assisted. Every pack is intended to be
          reviewed by a subject-matter expert before it is treated as
          authoritative. The site explicitly does not warrant that any
          specific fact is current or correct; use it as a study aid,
          not a primary source.
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold">
          No account today
        </h2>
        <p>
          The site does not have user accounts yet. When accounts
          launch, these terms will be replaced with a real,
          lawyer-reviewed version that covers acceptable use, account
          termination, and billing. Until then, the only data stored
          is in your browser; see the{" "}
          <Link href="/privacy" className="underline hover:no-underline">
            privacy page
          </Link>
          .
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold">
          Changes
        </h2>
        <p>
          These terms can change without notice during the
          pre-commercial phase. Material changes will be announced
          alongside the commercial launch.
        </p>
      </section>
    </Container>
  );
}
