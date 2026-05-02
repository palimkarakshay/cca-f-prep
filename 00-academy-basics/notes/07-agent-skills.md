# Introduction to Agent Skills — notes

**Course:** [Introduction to agent skills](https://anthropic.skilljar.com/introduction-to-agent-skills) ·
**Length:** 30–60 min · **Maps to:** Domain 2 — Claude Code Configuration & Workflows

## One-line summary

Skills are reusable, distributable units of *capability* (markdown
instructions + optional supporting files). The harness loads a skill on
demand when the user invokes it; the skill instructions then steer the
session.

## 5 principles

1. **A Skill is markdown + frontmatter + optional assets.** Frontmatter
   declares name, description, allowed tools. The body is the
   instructions Claude follows when the skill is invoked.
2. **Skills are user-invoked, not auto-fired.** They appear in the
   skills list and load on `/skill-name` (or programmatic invoke). They
   don't run unless asked.
3. **One skill, one purpose.** A skill with three goals fragments
   instruction adherence. Split.
4. **Skills are distributed, not just personal.** Project skills
   (`.claude/skills/`) ship in the repo; user skills (`~/.claude/skills/`)
   are personal; plugin/marketplace skills are versioned.
5. **Description quality decides discoverability.** Just like a tool
   description, the skill description is what determines whether the
   user (or another agent) reaches for it. Vague descriptions = unused
   skills.

## 2 failure modes

- **F-skill-as-feature-dump** — packing a kitchen-sink skill that does
  setup + linting + deploy. Symptoms: instruction drift, partial
  adherence.
- **F-skill-vs-claudemd** — putting always-on rules into a Skill instead
  of CLAUDE.md. Skills don't auto-load; the rules silently don't apply.

## Maps to CCA-F

- **Domain 2** — when to use a Skill vs. a slash command vs. CLAUDE.md
  vs. a hook. Expect "which mechanism" tradeoff MCQs.

## Recall prompts

1. Always-on project rule → Skill, slash command, hook, or CLAUDE.md?
2. A skill description starts "Helper for various tasks." Why is that a
   bug?
3. Where does a project-shared skill live?
