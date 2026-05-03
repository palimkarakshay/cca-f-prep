import type { CCAFDomain } from "./curriculum-types";

/**
 * Concept → CCA-F domain mapping. Each of the 41 concepts is assigned
 * to ONE primary domain so games like Domain Rush have an authoritative
 * answer. Cross-domain concepts pick the closest match per the
 * skills-matrix.md cross-references.
 *
 * Reasoning:
 * - B1.x (Claude 101): product surface — context cost, file uploads,
 *   project memory → Domain 5 (Context & Reliability).
 * - B2.x (AI Fluency 4Ds): description, discernment, diligence → all
 *   prompt-engineering & structured output → Domain 4.
 * - B3.x (Claude API): system/user placement, few-shots, leak →
 *   Domain 4. Tool-use loop + tool-schema → Domain 3.
 *   Prompt caching → Domain 5 (context optimisation).
 * - B4.x (MCP): every concept is Domain 3.
 * - B5.x (Claude Code 101): hooks, permissions, slash → Domain 2.
 * - B6.x (Claude Code in Action): hook lifecycle/trust → Domain 2.
 *   Watermark loop → Domain 5. Subagent vs inline → Domain 1.
 *   CI surface blast radius → Domain 2.
 * - B7.x (Skills): skill placement / critique / kitchen-sink → Domain 2.
 * - B8.x (Subagents): all four → Domain 1.
 * - B9.x (Cowork): plugin/skill, checkpoint cadence, set-and-forget →
 *   Domain 1 (multi-agent orchestration is the umbrella).
 */
export const DOMAIN_MAP: Record<string, CCAFDomain> = {
  // Section 1 — Claude 101
  "b1-1": "context-reliability",
  "b1-2": "context-reliability",
  "b1-3": "context-reliability",
  "b1-4": "context-reliability",

  // Section 2 — AI Fluency: Framework & Foundations
  "b2-1": "prompt-engineering",
  "b2-2": "prompt-engineering",
  "b2-3": "prompt-engineering",
  "b2-4": "prompt-engineering",
  "b2-5": "prompt-engineering",

  // Section 3 — Building with the Claude API
  "b3-1": "prompt-engineering",
  "b3-2": "prompt-engineering",
  "b3-3": "tool-design-mcp",
  "b3-4": "context-reliability",
  "b3-5": "tool-design-mcp",
  "b3-6": "prompt-engineering",

  // Section 4 — Introduction to MCP
  "b4-1": "tool-design-mcp",
  "b4-2": "tool-design-mcp",
  "b4-3": "tool-design-mcp",
  "b4-4": "tool-design-mcp",
  "b4-5": "tool-design-mcp",
  "b4-6": "tool-design-mcp",

  // Section 5 — Claude Code 101
  "b5-1": "claude-code",
  "b5-2": "claude-code",
  "b5-3": "claude-code",
  "b5-4": "claude-code",

  // Section 6 — Claude Code in Action
  "b6-1": "claude-code",
  "b6-2": "claude-code",
  "b6-3": "context-reliability",
  "b6-4": "agentic-architecture",
  "b6-5": "claude-code",

  // Section 7 — Introduction to Agent Skills
  "b7-1": "claude-code",
  "b7-2": "claude-code",
  "b7-3": "claude-code",
  "b7-4": "claude-code",

  // Section 8 — Introduction to Subagents
  "b8-1": "agentic-architecture",
  "b8-2": "agentic-architecture",
  "b8-3": "agentic-architecture",
  "b8-4": "agentic-architecture",

  // Section 9 — Introduction to Claude Cowork
  "b9-1": "agentic-architecture",
  "b9-2": "agentic-architecture",
  "b9-3": "agentic-architecture",
};
