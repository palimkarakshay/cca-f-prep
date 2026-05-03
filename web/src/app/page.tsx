import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <div className="py-2">
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-semibold">
        {siteConfig.name}
      </h1>
      <p className="text-(--muted)">{siteConfig.tagline}</p>
    </div>
  );
}
