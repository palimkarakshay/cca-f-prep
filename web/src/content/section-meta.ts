import type { SectionMeta } from "./curriculum-types";

/**
 * Per-section metadata mined from `00-academy-basics/notes/0X-*.md`:
 * Course URL (academyUrl), course length (timeMinutes), and the "5
 * principles" rephrased as student-facing learning objectives.
 *
 * timeMinutes uses the midpoint of the source's range (e.g., "30–60 min"
 * → 45) and the explicit hours (e.g., "3–4 hr" → 210). Adjust per
 * section as the curriculum evolves.
 *
 * videoUrl is intentionally undefined — we don't have authoritative
 * embeds for the Anthropic Academy courses yet; UI shows "Watch on
 * Anthropic Academy ↗" pointing at academyUrl until videos are wired.
 */
export const SECTION_META: Record<string, SectionMeta> = {
  "s1-claude-101": {
    academyUrl: "https://anthropic.skilljar.com/claude-101",
    timeMinutes: 45,
    track: "Foundation",
    learningObjectives: [
      "Distinguish Claude.ai (the product surface) from the Claude API.",
      "Explain why a Project gives scoped persistent memory, not retrieval.",
      "Identify when to use an Artifact vs an inline message.",
      "Predict the context cost of attaching N files to a Project.",
      "Trace per-product limits (caps, context length) back to the subscription tier rather than the model.",
    ],
  },
  "s2-ai-fluency": {
    academyUrl:
      "https://anthropic.skilljar.com/ai-fluency-framework-foundations",
    timeMinutes: 210,
    track: "Foundation",
    learningObjectives: [
      "Classify a model failure as a Delegation, Description, Discernment, or Diligence problem.",
      "Recognise mis-delegation: tasks that require knowledge or rights the model can't have.",
      "Write structured task descriptions (role, inputs, outputs, constraints).",
      "Run a description ↔ discernment loop to converge on usable output.",
      "Name the diligence concern in a deployment scenario before shipping.",
    ],
  },
  "s3-claude-api": {
    academyUrl: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
    timeMinutes: 210,
    track: "Builder",
    learningObjectives: [
      "Place an instruction correctly in the system vs the user role.",
      "Format few-shot examples as alternating user / assistant turns.",
      "Trace a tool-use loop using stop_reason to know when the model is done.",
      "Place cache_control markers to maximise prompt-cache hits.",
      "Pick tool-schema vs prompt-only structured output for a given task.",
    ],
  },
  "s4-mcp": {
    academyUrl:
      "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
    timeMinutes: 120,
    track: "Builder",
    learningObjectives: [
      "Classify a capability as a Tool, Resource, or Prompt.",
      "Pick stdio vs Streamable HTTP for a given deployment shape.",
      "Diagnose why a model picked the wrong tool by examining its description.",
      "Decide between server-per-capability and a monolith MCP server.",
      "Place auth at the transport layer rather than in tool input fields.",
    ],
  },
  "s5-claude-code-101": {
    academyUrl: "https://anthropic.skilljar.com/claude-code-101",
    timeMinutes: 60,
    track: "Builder",
    learningObjectives: [
      "Place a hook on the correct lifecycle event (PreToolUse, PostToolUse, etc.).",
      "Predict the result when enterprise / user / project / local permissions cascade.",
      "Route a rule to CLAUDE.md vs reference / skill / slash / hook by trust level.",
      "Author a project-scoped vs personal slash command for the right reuse boundary.",
    ],
  },
  "s6-claude-code-action": {
    academyUrl: "https://anthropic.skilljar.com/claude-code-in-action",
    timeMinutes: 60,
    track: "Builder",
    learningObjectives: [
      "Order all hook lifecycle events correctly in a single agent turn.",
      "Pick hook vs CLAUDE.md by trust level (high trust = enforce; low trust = suggest).",
      "Predict when a no-watermark loop will exhaust context and propose 80/95% gates.",
      "Choose subagent vs inline for parallelism + isolation tradeoffs.",
      "Reason about CI surface blast radius — autonomous agents need tighter permissions, not looser.",
    ],
  },
  "s7-skills": {
    academyUrl: "https://anthropic.skilljar.com/introduction-to-agent-skills",
    timeMinutes: 45,
    track: "Builder",
    learningObjectives: [
      "Distinguish Skill from slash command, CLAUDE.md, and hook by invocation model.",
      "Critique a skill description for discoverability (specific, action-oriented, scoped).",
      "Place a skill at project, personal, or plugin scope based on the audience.",
      "Detect a kitchen-sink skill and split it into single-purpose ones.",
    ],
  },
  "s8-subagents": {
    academyUrl: "https://anthropic.skilljar.com/introduction-to-subagents",
    timeMinutes: 45,
    track: "Architect",
    learningObjectives: [
      "Identify two valid spawn triggers for a subagent (parallelism + isolation).",
      "Critique a subagent brief — is the goal, context, and exit criteria clear?",
      "Reason about cost: when does spawning a subagent cost more than it saves?",
      "Explain what the parent does NOT see from a subagent and design summaries for visibility.",
    ],
  },
  "s9-cowork": {
    academyUrl: "https://anthropic.skilljar.com/introduction-to-claude-cowork",
    timeMinutes: 60,
    track: "Architect",
    learningObjectives: [
      "Distinguish Plugin vs Skill (delivery mechanism vs invokable unit).",
      "Add appropriate human-checkpoint cadence for multi-day vs multi-week tasks.",
      "Recognise the set-and-forget anti-pattern in long-running agent runs.",
    ],
  },
};
