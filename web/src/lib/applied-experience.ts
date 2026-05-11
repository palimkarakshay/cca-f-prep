/* ------------------------------------------------------------------
   Applied-experience helper.

   Every section in a learning journey should end with the learner
   *doing* something real, not just answering more MCQs. This module
   surfaces those applied-experience prompts to the section page's
   new "Apply" tab.

   Resolution order:
     1. If the section author wrote `section.appliedExperience`, use
        it verbatim.
     2. Otherwise, generate a sensible default spine from the
        section's concepts: a recall task, a transfer task, and a
        teach-back task — each tied to one or more concepts so the
        page can link back into the lesson.

   The generated spine is deterministic per section id, so the
   "Apply" tab renders the same prompts across renders + refreshes.
------------------------------------------------------------------ */

import type {
  AppliedExperience,
  Concept,
  Section,
} from "@/content/curriculum-types";

const RECALL_VERBS = [
  "Map",
  "List",
  "Diagram",
  "Outline",
  "Summarise",
];

const TRANSFER_VERBS = [
  "Apply",
  "Use",
  "Solve",
  "Translate",
];

function pickVerb(verbs: string[], seed: string): string {
  // Stable per section so the same section keeps the same verb across
  // navigations + reloads. Cheap string-hash sum mod len.
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return verbs[Math.abs(h) % verbs.length];
}

function firstConceptTitle(section: Section): string {
  const c: Concept | undefined = section.concepts[0];
  return c?.title ?? section.title;
}

function lastConceptTitle(section: Section): string {
  const c: Concept | undefined =
    section.concepts[section.concepts.length - 1];
  return c?.title ?? section.title;
}

function generateAppliedSpine(section: Section): AppliedExperience[] {
  const verb1 = pickVerb(RECALL_VERBS, section.id);
  const verb2 = pickVerb(TRANSFER_VERBS, section.id + "x");
  const first = firstConceptTitle(section);
  const last = lastConceptTitle(section);
  return [
    {
      id: `${section.id}-applied-recall`,
      title: `${verb1} the core idea`,
      prompt: `In your own words, ${verb1.toLowerCase()} the central idea of "${first}". Aim for one paragraph, no jargon you haven't earned.`,
      doneWhen:
        "A non-expert could read your paragraph and explain it back to you.",
      minutes: 10,
      conceptId: section.concepts[0]?.id,
      level: "analyse",
    },
    {
      id: `${section.id}-applied-transfer`,
      title: `${verb2} it to a real situation`,
      prompt: `Find a real situation from your own work / life where "${last}" applies. ${verb2} the idea — describe the situation, the move you'd make, and the alternative you considered first.`,
      doneWhen:
        "You can name a specific situation (not a hypothetical), state your move, and explain the trade-off in one paragraph.",
      minutes: 15,
      conceptId:
        section.concepts[section.concepts.length - 1]?.id ??
        section.concepts[0]?.id,
      level: "apply",
    },
    {
      id: `${section.id}-applied-teach-back`,
      title: "Teach it back",
      prompt: `Pick someone (a colleague, a peer, a rubber duck) and explain the section to them in under 5 minutes. Use your own example, not the one from the lesson.`,
      doneWhen:
        "Your listener can repeat the core idea + the trade-off back to you without prompting.",
      minutes: 5,
      level: "evaluate",
    },
  ];
}

export function getAppliedExperiences(
  section: Section
): AppliedExperience[] {
  if (section.appliedExperience && section.appliedExperience.length > 0) {
    return section.appliedExperience;
  }
  return generateAppliedSpine(section);
}

export const APPLIED_LEVEL_LABEL: Record<
  NonNullable<AppliedExperience["level"]>,
  string
> = {
  apply: "Apply",
  analyse: "Analyse",
  evaluate: "Evaluate",
  create: "Create",
};
