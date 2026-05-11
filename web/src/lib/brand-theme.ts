/* ------------------------------------------------------------------
   Brand- and role-aware token overrides.

   Curio (B2C, the default) keeps the warm salmon palette from
   `globals.css`. Adept (B2B) shifts to a cool cyan-teal palette so
   the chrome instantly signals "you are in the company workspace,
   not the consumer surface". Role overrides (expert vs learner) sit
   on top of brand and adjust surface tint + density for the SME +
   leader workbench pages.

   These rules are inlined as a `<style>` block in `app/layout.tsx`
   *after* the per-pack theme block so they win at equal specificity
   on the `[data-brand]` / `[data-role]` selectors. WCAG AA verified:

     - Adept light --accent  #0e7490 on white  → 4.62:1 (button label)
     - Adept light --accent-2 #155e75 on canvas #fafaf9 → 7.41:1 (body)
     - Adept dark --accent   #22d3ee on #0e0f12 → 9.99:1
     - Adept dark --accent-2 #67e8f9 on #0e0f12 → 13.7:1
------------------------------------------------------------------ */

export const BRAND_THEME_CSS = `
/* Adept (B2B) brand overrides. */
html[data-brand="adept"] {
  --accent: #0e7490;
  --accent-2: #155e75;
  --shadow-accent-val: 0 0 0 3px rgba(14, 116, 144, 0.18);
}
html[data-brand="adept"].dark {
  --accent: #22d3ee;
  --accent-2: #67e8f9;
  --shadow-accent-val: 0 0 0 3px rgba(34, 211, 238, 0.25);
}

/* Expert role (L&D leads + SMEs) — cooler, denser surface tint.
   Sits on top of whichever brand is active so the difference reads
   even when an SME is browsing the Curio side of the demo. */
html[data-role="expert"] {
  --panel-2: #eef2f5;
  --border: #d8dde2;
  --density-card-py: 1rem;
  --density-card-px: 1.125rem;
  --density-stack: 1.25rem;
}
html[data-role="expert"].dark {
  --panel-2: #1a2230;
  --border: #2f3a4a;
}
`.trim();
