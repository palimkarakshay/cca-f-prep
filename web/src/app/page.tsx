import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        {siteConfig.name}
      </h1>
      <p className="text-(--muted)">{siteConfig.tagline}</p>
    </main>
  );
}
