/* Pack-scoped theme CSS — emitted as a <style> block by [packId]/layout.tsx.
   Mirrors what app/layout.tsx does for the env-var-default pack but
   keys on data-pack so the right tokens apply when the user switches
   packs at runtime via the picker. */

import type { ContentPack } from "@/content/pack-types";

export const PACK_THEME_STYLE_ID = "pack-theme-style";

export function packThemeCSS(pack: ContentPack): string {
  const t = pack.config.theme;
  if (!t) return "";
  const toBlock = (vars: Record<string, string> | undefined): string => {
    if (!vars) return "";
    return Object.entries(vars)
      .map(([k, v]) => `${k}: ${v};`)
      .join("\n  ");
  };
  const light = toBlock(t.light);
  const dark = toBlock(t.dark);
  const out: string[] = [];
  if (light) out.push(`html[data-pack="${pack.config.id}"] {\n  ${light}\n}`);
  if (dark)
    out.push(
      `html[data-pack="${pack.config.id}"].dark {\n  ${dark}\n}`
    );
  return out.join("\n");
}
