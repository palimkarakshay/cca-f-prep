"use client";

import Link from "next/link";
import { useSiteConfig } from "@/content/pack-hooks";
import { BRAND } from "@/lib/brand";

export function Footer() {
  const siteConfig = useSiteConfig();
  return (
    <footer className="mt-12 border-t border-(--border)">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-(--muted)">
        {BRAND.name} · {BRAND.tagline}
        {" "}·{" "}
        <Link
          href="/for-teams"
          className="text-(--muted) underline hover:text-(--ink)"
        >
          {BRAND.b2bName} for teams
        </Link>
        {siteConfig.repoUrl ? (
          <>
            {" "}·{" "}
            <a
              href={siteConfig.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--muted) underline hover:text-(--ink)"
            >
              repo
            </a>
          </>
        ) : null}
      </div>
    </footer>
  );
}
