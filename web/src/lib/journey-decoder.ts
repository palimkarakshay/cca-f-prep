/* ------------------------------------------------------------------
   Journey decoder — pure, deterministic, local-only.

   The home page asks two questions:
     - "What do you want to learn?" (the capability)
     - "Why do you want to learn it?" (the motivation / end-use)

   `decodeJourney(input)` reads those two strings and returns a
   structured shape an L&D designer (or the Curio engine) can use as
   a brief: outcomes, observable success signals, suggested section
   spine, audience cues, content sources to gather. The function is
   intentionally heuristic — it tags keywords (cert, role,
   compliance, language, code, etc.) and emits a recommendation
   shape. No LLM, no network — runs in the unit-test suite without
   mocks.

   The same decoded structure is shown to the learner ("here's
   what your journey will look like") and to the L&D expert
   ("here's the design brief"), with the framing changing.
------------------------------------------------------------------ */

export type JourneyKind =
  | "certification"
  | "role-onboarding"
  | "compliance"
  | "language"
  | "coding-skill"
  | "tool-adoption"
  | "domain-knowledge"
  | "general";

export interface JourneyInput {
  /** Free-form: "what do you want to learn?". */
  what: string;
  /** Free-form: "why do you want to learn it?". */
  why: string;
}

export interface DesignerSourceHint {
  /** Label shown to the SME on the upload tile. */
  label: string;
  /** Why this document type matters for *this* audience. */
  rationale: string;
  /** Whether the source is strictly required to build the journey. */
  required: boolean;
}

export interface DecodedJourney {
  kind: JourneyKind;
  /** Short headline ("Conversational French for travel"). */
  headline: string;
  /** Compact one-line statement of the transfer context. */
  endUse: string;
  /** Observable evidence of mastery — what "done" looks like. */
  successSignals: string[];
  /** Suggested section spine — every section also flagged for
      whether it should ship an "applied experience" block. */
  sectionSpine: Array<{ title: string; applied: string }>;
  /** Audience cues a designer should pin before authoring. */
  audienceCues: string[];
  /** Source-doc tiles the SME should upload to seed the pack. */
  suggestedSources: DesignerSourceHint[];
  /** Suggested time-on-task per learner (rough order). */
  estimatedHours: { low: number; high: number };
  /** Whether the journey should carry an expiration date by default. */
  recommendsExpiry: boolean;
  /** Plain-English brief sentence the designer can paste into a doc. */
  designerBrief: string;
}

const KIND_PATTERNS: Array<{
  kind: JourneyKind;
  whatPatterns: RegExp[];
  whyPatterns?: RegExp[];
}> = [
  {
    kind: "certification",
    whatPatterns: [
      /\b(cert|certification|exam|certified|cca-?f|aws|azure|gcp|pmp|cfa|cpa)\b/i,
    ],
  },
  {
    kind: "compliance",
    whatPatterns: [
      /\b(compliance|gdpr|hipaa|sox|policy|policies|safety|regulator|regulatory|audit)\b/i,
    ],
    whyPatterns: [/\b(audit|regulator|fine|legal|deadline)\b/i],
  },
  {
    kind: "role-onboarding",
    whatPatterns: [
      /\b(onboard|onboarding|new[- ]?hire|ramp[- ]?up|first[- ]?90[- ]?days|role)\b/i,
    ],
  },
  {
    kind: "language",
    whatPatterns: [
      /\b(french|spanish|german|italian|japanese|mandarin|chinese|portuguese|arabic|hindi|korean|russian|language)\b/i,
    ],
  },
  {
    kind: "coding-skill",
    whatPatterns: [
      /\b(sql|python|typescript|javascript|react|node|api|kubernetes|terraform|rust|go(?:lang)?|programming|code|coding|algorithms?|data[- ]?structures?)\b/i,
    ],
  },
  {
    kind: "tool-adoption",
    whatPatterns: [
      /\b(salesforce|figma|notion|jira|tableau|powerbi|workday|servicenow|sap|s\/4|s4hana|claude|chatgpt|copilot|tool|platform)\b/i,
    ],
  },
  {
    kind: "domain-knowledge",
    whatPatterns: [
      /\b(finance|accounting|marketing|sales|product|ux|design|hr|operations|supply[- ]?chain|leadership|management)\b/i,
    ],
  },
];

export function detectKind(input: JourneyInput): JourneyKind {
  const what = input.what ?? "";
  const why = input.why ?? "";
  for (const p of KIND_PATTERNS) {
    if (p.whatPatterns.some((re) => re.test(what))) return p.kind;
    if (p.whyPatterns && p.whyPatterns.some((re) => re.test(why))) {
      return p.kind;
    }
  }
  return "general";
}

function titleCase(s: string): string {
  return s.replace(/\b([a-z])/g, (_m, c: string) => c.toUpperCase());
}

function shorten(s: string, n: number): string {
  const trimmed = s.trim().replace(/\s+/g, " ");
  if (trimmed.length <= n) return trimmed;
  return trimmed.slice(0, n - 1).trimEnd() + "…";
}

function headlineFor(kind: JourneyKind, what: string): string {
  const base = shorten(what || "Your learning journey", 80);
  switch (kind) {
    case "certification":
      return `${titleCase(base)} — certification path`;
    case "compliance":
      return `${titleCase(base)} — compliance journey`;
    case "role-onboarding":
      return `${titleCase(base)} — role onboarding`;
    case "language":
      return `${titleCase(base)} — language journey`;
    case "coding-skill":
      return titleCase(base);
    case "tool-adoption":
      return `${titleCase(base)} — tool adoption`;
    case "domain-knowledge":
      return titleCase(base);
    default:
      return titleCase(base);
  }
}

const SECTION_SPINES: Record<
  JourneyKind,
  Array<{ title: string; applied: string }>
> = {
  certification: [
    {
      title: "Exam blueprint + scoring rules",
      applied: "Annotate one past exam scenario per learner — flag traps.",
    },
    {
      title: "Core domains — concept lessons",
      applied: "Author one 4-option MCQ per concept, name the principle.",
    },
    {
      title: "Drills + spaced practice",
      applied: "Run a timed 10-MCQ drill at end of each domain.",
    },
    {
      title: "Mock exams + post-mortem",
      applied: "After each mock, write a 3-line F-code failure analysis.",
    },
  ],
  "role-onboarding": [
    {
      title: "Map of the role + first 30/60/90 days",
      applied: "Learner draws their own org map from memory.",
    },
    {
      title: "Tools + accesses + who-to-ask",
      applied: "Walk through the runbook for one real ticket end-to-end.",
    },
    {
      title: "Core workflows + escalation paths",
      applied: "Shadow a senior; write up a one-page debrief.",
    },
    {
      title: "Success criteria + first deliverable",
      applied: "Ship a small real artefact and get peer review.",
    },
  ],
  compliance: [
    {
      title: "What the policy says + why it exists",
      applied: "Map one real workflow to the policy clause that gates it.",
    },
    {
      title: "What you must do / never do",
      applied: "Sort 10 scenario cards into compliant / non-compliant.",
    },
    {
      title: "What to escalate + audit trail",
      applied: "Walk through a mock incident and file the right ticket.",
    },
    {
      title: "Attestation + refresh cadence",
      applied: "Sign + timestamp the attestation in the workbench.",
    },
  ],
  language: [
    {
      title: "Survival phrases + pronunciation",
      applied: "Record yourself ordering coffee; self-grade.",
    },
    {
      title: "Everyday conversation patterns",
      applied: "Hold a 5-minute conversation with a partner.",
    },
    {
      title: "Reading + listening in context",
      applied: "Watch one short clip with subtitles, summarise in target language.",
    },
    {
      title: "Writing + cultural fluency",
      applied: "Write a 200-word email to a real recipient.",
    },
  ],
  "coding-skill": [
    {
      title: "Mental model + when to reach for it",
      applied: "Read one production codebase using it; explain it in a paragraph.",
    },
    {
      title: "Core primitives — hands-on",
      applied: "Solve 3 small exercises unaided; commit them.",
    },
    {
      title: "Real-world patterns + anti-patterns",
      applied: "Refactor a 100-line snippet to use the pattern correctly.",
    },
    {
      title: "Build it: end-to-end mini-project",
      applied: "Ship a small working tool; PR-review with peer.",
    },
  ],
  "tool-adoption": [
    {
      title: "What problem the tool solves (vs. alternatives)",
      applied: "Map one current workflow to the new tool's primitives.",
    },
    {
      title: "Day-1 tasks: navigate + configure",
      applied: "Complete a guided setup on a real (sandbox) tenant.",
    },
    {
      title: "Day-30 tasks: integrate + automate",
      applied: "Build one automation that replaces a manual step.",
    },
    {
      title: "Hand-off: docs + training the team",
      applied: "Run a 15-min teach-back to one teammate.",
    },
  ],
  "domain-knowledge": [
    {
      title: "Vocabulary + first principles",
      applied: "Define the top 10 terms in your own words.",
    },
    {
      title: "Frameworks + mental models",
      applied: "Apply one framework to a real situation at work.",
    },
    {
      title: "Cases + judgement calls",
      applied: "Pick a side on a case; write a 1-paragraph rationale.",
    },
    {
      title: "Synthesis + transfer",
      applied: "Teach the core idea to a non-expert in 5 minutes.",
    },
  ],
  general: [
    {
      title: "Goal + success criteria",
      applied: "Write the one-line target you'll grade yourself against.",
    },
    {
      title: "Core concepts — read + recall",
      applied: "Teach back each concept in your own words.",
    },
    {
      title: "Practice + feedback loop",
      applied: "Do 3 real tasks; get peer or self feedback.",
    },
    {
      title: "Transfer to the real use-case",
      applied: "Apply it to the end-use you named on day one.",
    },
  ],
};

const SOURCE_HINTS: Record<JourneyKind, DesignerSourceHint[]> = {
  certification: [
    {
      label: "Official exam blueprint / domain weights",
      rationale:
        "Anchors the section spine. Without this every quiz is guesswork — and learners over-prepare on under-weighted domains.",
      required: true,
    },
    {
      label: "Past exam scenarios + answer rationales",
      rationale: "Lets the SME validate distractor plausibility, not just the correct answer.",
      required: true,
    },
    {
      label: "Vendor reference docs (latest version)",
      rationale: "Pins technical facts to dated source-of-truth — exam content rotates.",
      required: false,
    },
  ],
  "role-onboarding": [
    {
      label: "Role description + level-band rubric",
      rationale: "Names the capabilities the audience must own by day 30/60/90.",
      required: true,
    },
    {
      label: "Top 5 SOPs + runbooks for the role",
      rationale: "These become the spine of the applied-experience blocks.",
      required: true,
    },
    {
      label: "Org map + key stakeholders",
      rationale: "Half of onboarding is who-to-ask, not what-to-know.",
      required: false,
    },
    {
      label: "First-30-day checklist (current)",
      rationale: "Validates against what the role actually does today.",
      required: false,
    },
  ],
  compliance: [
    {
      label: "The policy / standard / regulation text",
      rationale: "The single source of truth; SME signs against this version + revision date.",
      required: true,
    },
    {
      label: "Internal control mapping",
      rationale: "Connects each clause to the workflow that has to satisfy it.",
      required: true,
    },
    {
      label: "Past audit findings (redacted ok)",
      rationale: "Tells the SME where this audience actually slips.",
      required: false,
    },
    {
      label: "Escalation + reporting playbook",
      rationale: "The action-side of compliance — the part learners forget.",
      required: false,
    },
  ],
  language: [
    {
      label: "Target situations (audio/video, optional)",
      rationale: "Real samples of the context the learner will face — pronunciation + register.",
      required: false,
    },
    {
      label: "Vocabulary + phrase list scoped to the use-case",
      rationale: "A grocery-shopping list, not a textbook A1.",
      required: false,
    },
  ],
  "coding-skill": [
    {
      label: "Production code samples (anonymised)",
      rationale: "Teaches the pattern in-context, not in abstract toy code.",
      required: true,
    },
    {
      label: "Internal style guide / linter config",
      rationale: "Pins idioms learners must match when they ship.",
      required: false,
    },
    {
      label: "Common review-comments / anti-patterns",
      rationale: "Pre-empts the mistakes that show up in the first PR.",
      required: false,
    },
  ],
  "tool-adoption": [
    {
      label: "Vendor admin + user docs",
      rationale: "Source-of-truth for screens, fields, terminology.",
      required: true,
    },
    {
      label: "Internal config decisions (which features on/off)",
      rationale: "Generic vendor docs don't match your tenant.",
      required: true,
    },
    {
      label: "List of workflows the tool replaces",
      rationale: "Frames every lesson against a real task.",
      required: false,
    },
  ],
  "domain-knowledge": [
    {
      label: "1–3 canonical references (books, papers, decks)",
      rationale: "Anchors the vocabulary + frameworks.",
      required: true,
    },
    {
      label: "Recent in-house cases or memos",
      rationale: "Keeps the journey out of textbook abstraction.",
      required: false,
    },
  ],
  general: [
    {
      label: "Any existing source-of-truth document",
      rationale: "Even one good doc gives the SME something to validate against.",
      required: false,
    },
    {
      label: "A 1-paragraph statement of the audience + outcome",
      rationale: "Lets the engine pin the journey to a real use-case.",
      required: true,
    },
  ],
};

const AUDIENCE_CUES: Record<JourneyKind, string[]> = {
  certification: [
    "Exam date — fixed deadline shapes spaced-practice cadence.",
    "Prior experience tier — first-timer vs. recert.",
    "Allowed prep time per week (drives session length).",
  ],
  "role-onboarding": [
    "Seniority band — IC1 vs. IC4 onboarding diverge sharply.",
    "Remote vs. on-site — affects shadowing + escalation paths.",
    "Manager involvement (will they sign off the 30-day check?).",
  ],
  compliance: [
    "Function (handling PII? handling money? handling minors?).",
    "Audit cadence + last finding.",
    "Regulator + jurisdiction (drives wording + attestation form).",
  ],
  language: [
    "Reason for learning (travel, work, family) — drives register.",
    "Target situations (cafe, office, classroom).",
    "Time-to-first-use (days, weeks, months).",
  ],
  "coding-skill": [
    "Existing stack — what languages do they already know?",
    "Where it'll be used (greenfield, legacy refactor).",
    "Review culture (will a senior read their first PR?).",
  ],
  "tool-adoption": [
    "Role using the tool (admin, end-user, integrator).",
    "Migration from a previous tool (yes/no) — anchors mental models.",
    "Tenancy: is the demo tenant production-like?",
  ],
  "domain-knowledge": [
    "Why now — promotion review, project, curiosity.",
    "What they'll do *with* the knowledge (transfer context).",
    "Existing exposure — university vs. self-taught vs. zero.",
  ],
  general: [
    "Who exactly is the learner? (be more specific than a role).",
    "What will they do with this in 90 days?",
    "What does the SME consider 'done well'?",
  ],
};

function defaultHours(kind: JourneyKind): { low: number; high: number } {
  switch (kind) {
    case "certification":
      return { low: 25, high: 60 };
    case "role-onboarding":
      return { low: 8, high: 24 };
    case "compliance":
      return { low: 1, high: 3 };
    case "language":
      return { low: 30, high: 200 };
    case "coding-skill":
      return { low: 10, high: 40 };
    case "tool-adoption":
      return { low: 4, high: 12 };
    case "domain-knowledge":
      return { low: 6, high: 20 };
    default:
      return { low: 6, high: 20 };
  }
}

const RECOMMENDS_EXPIRY: Record<JourneyKind, boolean> = {
  certification: true,
  "role-onboarding": false,
  compliance: true,
  language: false,
  "coding-skill": false,
  "tool-adoption": true,
  "domain-knowledge": false,
  general: false,
};

const SUCCESS_SIGNALS: Record<JourneyKind, (input: JourneyInput) => string[]> = {
  certification: () => [
    "Score ≥ pass-mark on a fresh full-length mock under exam conditions.",
    "Can name the principle behind each missed question, not just the correct answer.",
    "Drill scores stable above 75% across the last 3 attempts.",
  ],
  "role-onboarding": () => [
    "Ships first real ticket / deliverable unaided.",
    "Can name top 5 stakeholders + when to escalate to whom.",
    "Manager signs off the 30-day check with no open blockers.",
  ],
  compliance: () => [
    "Sorts 10 mixed scenarios correctly into compliant / non-compliant.",
    "Files a clean mock incident report with the right reviewer in the loop.",
    "Signs the attestation themselves — no SME prompt needed.",
  ],
  language: () => [
    "Holds a 5-minute target-language conversation without falling back to English.",
    "Orders / asks / answers in 3 real situations.",
    "Reads + comprehends a real native text from the target situation.",
  ],
  "coding-skill": () => [
    "Solves 3 unseen problems unaided, passing tests in < 30 min each.",
    "Ships a small project end-to-end + peer review.",
    "Can explain when *not* to use the pattern, not just when to use it.",
  ],
  "tool-adoption": () => [
    "Completes the day-1 setup on a sandbox tenant unaided.",
    "Replaces one manual workflow with a working automation.",
    "Walks a teammate through the tool in 15 min.",
  ],
  "domain-knowledge": () => [
    "Teaches the core idea to a non-expert in under 5 minutes.",
    "Applies the framework to one real situation at work.",
    "Argues a defensible position on a case with no single right answer.",
  ],
  general: (input) => [
    `Can demonstrate "${shorten(input.what || "the capability", 60)}" in the end-use context.`,
    `Names the why ("${shorten(input.why || "their motivation", 60)}") as the criterion that ends the loop.`,
    "Can teach the key idea to someone who hasn't taken the journey.",
  ],
};

function summariseEndUse(input: JourneyInput): string {
  const why = (input.why || "").trim();
  if (!why) return "End-use not yet captured — ask the learner before authoring.";
  return shorten(why, 160);
}

function designerBriefFor(
  kind: JourneyKind,
  input: JourneyInput
): string {
  const what = shorten(input.what || "the capability", 80);
  const why = shorten(input.why || "the stated end-use", 100);
  switch (kind) {
    case "certification":
      return `Author a certification-style journey for "${what}". Audience prepares against an external exam; the why ("${why}") is the deadline pressure. Anchor the section spine in the official blueprint, weight by exam domain percentages, and ship a mock-exam loop with post-mortem.`;
    case "role-onboarding":
      return `Author a role-onboarding journey for "${what}". Audience is new in role; the why ("${why}") frames their first 30-day deliverable. Anchor against SOPs, escalation paths, and named stakeholders — not just concept lessons.`;
    case "compliance":
      return `Author a compliance journey for "${what}". Audience must attest to specific clauses; the why ("${why}") is audit / regulator pressure. Pin every concept to a clause + revision date, include scenario sorting, end with a signed attestation and set an expiration date.`;
    case "language":
      return `Author a language journey for "${what}". The why ("${why}") fixes the register and the target situations — author every section against a concrete, named scenario the learner will be in.`;
    case "coding-skill":
      return `Author a coding-skill journey for "${what}". The why ("${why}") names where the learner will use this — every applied block must produce a real artefact (PR, script, refactor), not a toy exercise.`;
    case "tool-adoption":
      return `Author a tool-adoption journey for "${what}". The why ("${why}") names which workflows have to migrate — every section ends in the learner doing the real task in a sandbox tenant.`;
    case "domain-knowledge":
      return `Author a domain-knowledge journey for "${what}". The why ("${why}") names the transfer context — every section closes with the learner applying the framework to a real situation.`;
    default:
      return `Author a general learning journey for "${what}". The why ("${why}") is the transfer context — every section's applied block must point back at that real-world use.`;
  }
}

export function decodeJourney(input: JourneyInput): DecodedJourney {
  const kind = detectKind(input);
  return {
    kind,
    headline: headlineFor(kind, input.what),
    endUse: summariseEndUse(input),
    successSignals: SUCCESS_SIGNALS[kind](input),
    sectionSpine: SECTION_SPINES[kind],
    audienceCues: AUDIENCE_CUES[kind],
    suggestedSources: SOURCE_HINTS[kind],
    estimatedHours: defaultHours(kind),
    recommendsExpiry: RECOMMENDS_EXPIRY[kind],
    designerBrief: designerBriefFor(kind, input),
  };
}

import { createLRU } from "./lru-cache";

/**
 * Memoised decoder. The cache is keyed on the normalised input
 * (whitespace-collapsed, lower-cased) so cosmetic edits don't bust
 * it. Today the underlying call is a cheap regex; tomorrow (when
 * NEXT_PUBLIC_AI_DECODER_ENABLED=1 lights the AI path through
 * `lib/ai/router.ts`) the same cache layer protects against
 * runaway token spend on repeated identical prompts.
 *
 * Cap of 32 entries is enough for a typical typing session — the
 * cache exists to dedupe back-and-forth edits, not to be a
 * cross-session store. Clears on full reload, which is fine.
 */
const decoderCache = createLRU<string, DecodedJourney>(32);

function cacheKey(input: JourneyInput): string {
  const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
  return `${norm(input.what)}|${norm(input.why)}`;
}

export function decodeJourneyCached(input: JourneyInput): DecodedJourney {
  const key = cacheKey(input);
  const hit = decoderCache.get(key);
  if (hit) return hit;
  const value = decodeJourney(input);
  decoderCache.set(key, value);
  return value;
}

/** Test-only — drop memoised decodes between cases. */
export function __resetJourneyDecoderCacheForTests(): void {
  decoderCache.clear();
}

export const JOURNEY_KIND_LABEL: Record<JourneyKind, string> = {
  certification: "Certification prep",
  "role-onboarding": "Role onboarding",
  compliance: "Compliance / attestation",
  language: "Language",
  "coding-skill": "Coding skill",
  "tool-adoption": "Tool adoption",
  "domain-knowledge": "Domain knowledge",
  general: "General learning journey",
};
