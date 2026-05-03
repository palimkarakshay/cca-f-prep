import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mx-auto mt-12 max-w-3xl px-5 pb-10 text-center text-xs text-(--muted)">
      Self-study platform ·{" "}
      <a
        href={siteConfig.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-(--muted) underline hover:text-(--ink)"
      >
        repo
      </a>
    </footer>
  );
}
