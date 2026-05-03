import { notFound } from "next/navigation";
import { ALL_PACK_IDS, getPack } from "@/content/pack-registry";
import { PackProvider } from "@/content/pack-context";
import { siteConfigFor } from "@/lib/pack-helpers";
import { PACK_THEME_STYLE_ID, packThemeCSS } from "./pack-theme-style";
import type { Metadata } from "next";
import type { ReactNode } from "react";

type Params = { packId: string };

/**
 * Pre-render every registered pack's [packId]/ subtree at build time.
 * The picker at `/` lists the same set.
 */
export function generateStaticParams(): Params[] {
  return ALL_PACK_IDS.map((packId) => ({ packId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) return { title: "Pack not found" };
  const cfg = siteConfigFor(pack);
  return {
    title: { default: cfg.name, template: `%s · ${cfg.name}` },
    description: cfg.description,
  };
}

export default async function PackLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<Params>;
}) {
  const { packId } = await params;
  const pack = getPack(packId);
  if (!pack) notFound();

  const themeStyle = packThemeCSS(pack);

  return (
    <PackProvider pack={pack}>
      {/* Per-pack theme tokens scoped to data-pack on <html>. The
          inline script in app/layout.tsx sets data-pack from the
          stored choice; here we ensure the URL-resolved pack also
          gets its tokens applied as a backup style block. */}
      {themeStyle ? (
        <style
          id={`${PACK_THEME_STYLE_ID}-${packId}`}
          dangerouslySetInnerHTML={{ __html: themeStyle }}
        />
      ) : null}
      {children}
    </PackProvider>
  );
}
