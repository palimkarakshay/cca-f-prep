"use client";

import { useSiteConfig } from "@/content/pack-hooks";

export function Footer() {
  const siteConfig = useSiteConfig();
  return (
    <footer className="mt-12 border-t border-(--border)">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-(--muted)">
        Self-study platform
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
