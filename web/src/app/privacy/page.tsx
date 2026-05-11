import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy — ${BRAND.name}`,
  description: `What ${BRAND.name} stores about you, where, and for how long.`,
};

/* ------------------------------------------------------------------
   Privacy placeholder. NOT lawyer-reviewed. Replace before
   commercial launch — the v2 plan defers commercialization, but
   the surface lives here today so links from cookie banners /
   footers don't 404 once they ship.
------------------------------------------------------------------ */
export default function PrivacyPage() {
  return (
    <Container width="prose" className="flex flex-col gap-6 py-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-(--ink)">
          Privacy
        </h1>
        <p className="mt-2 text-sm text-(--muted)">
          Last updated: not yet — placeholder while the platform is in
          pre-commercial development.
        </p>
      </header>

      <section className="flex flex-col gap-3 text-sm text-(--ink)">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
          What we store on your device
        </h2>
        <p>
          Today, {BRAND.name} runs entirely in your browser. Your learning
          progress, goals, display preferences, and SME workbench drafts
          are stored in <code>localStorage</code> on the device you use to
          visit the site. Nothing is sent to a server.
        </p>
        <p>
          You can clear the data at any time by emptying your browser&apos;s
          local storage for this site, or by using your browser&apos;s
          &ldquo;clear site data&rdquo; controls.
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold">
          What we collect server-side
        </h2>
        <p>
          Today: nothing personal. The site is hosted on Vercel, which
          retains short-lived edge logs for operational reasons; those
          logs are not joined to any account because no accounts exist
          yet.
        </p>
        <p>
          When account-backed features launch, this page will be replaced
          with a real, lawyer-reviewed policy that names the categories
          of data, the legal basis, retention periods, and the data
          processors involved. Until then, treat this page as a notice
          that the policy is in development.
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold">
          Contact
        </h2>
        <p>
          For privacy questions, open an issue on the public repository
          or contact the site operator directly. A dedicated privacy
          contact ships alongside the commercial launch.
        </p>

        <p className="mt-4">
          <Link href="/terms" className="underline hover:no-underline">
            Terms of use →
          </Link>
        </p>
      </section>
    </Container>
  );
}
