/* ------------------------------------------------------------------
   Umbrella brand layer.

   Each content pack carries its own name (e.g. "CCA-F Prep",
   "Learn French"). The product that *delivers* those packs is the
   shell — branded as **Curio** for B2C and **Adept** for B2B. The
   shell name is fixed across packs so visitors never see "CCA-F Prep"
   in the chrome of a French course.

   Chrome (Header / Footer / metadata) reads `BRAND`. Pack-specific
   surfaces (pack landing H1, picker card heading) still read the
   pack's own config via `useSiteConfig()`.
------------------------------------------------------------------ */

export const BRAND = {
  /** Consumer-facing wordmark. */
  name: "Curio",
  shortName: "Curio",
  /** One-line value prop shown under the wordmark on the picker. */
  tagline: "Learn anything.",
  /** Longer description used in metadata + open graph. */
  description:
    "Tell us what you want to learn and why. Curio shapes a learning journey for you — sectioned lessons, applied practice per section, quizzes, drills, and a way to verify mastery.",
  /** B2B variant name. Same shell, company-approved content. */
  b2bName: "Adept",
  b2bTagline: "Curio for teams.",
} as const;

export type Brand = typeof BRAND;
