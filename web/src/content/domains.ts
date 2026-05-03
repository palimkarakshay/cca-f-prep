import type { CCAFDomain, CCAFDomainInfo } from "./curriculum-types";

/**
 * The five official CCA-F exam domains. Order matches the exam guide;
 * weights sum to 1.0. The `title` field mirrors what mock-exam
 * Question.domain uses so the two systems can be cross-referenced.
 */
export const DOMAINS: Record<CCAFDomain, CCAFDomainInfo> = {
  "agentic-architecture": {
    id: "agentic-architecture",
    n: 1,
    title: "1. Agentic Architecture",
    shortLabel: "Agentic Architecture",
    weight: 0.27,
  },
  "claude-code": {
    id: "claude-code",
    n: 2,
    title: "2. Claude Code Configuration & Workflows",
    shortLabel: "Claude Code",
    weight: 0.2,
  },
  "tool-design-mcp": {
    id: "tool-design-mcp",
    n: 3,
    title: "3. Tool Design & MCP Integration",
    shortLabel: "Tool Design & MCP",
    weight: 0.18,
  },
  "prompt-engineering": {
    id: "prompt-engineering",
    n: 4,
    title: "4. Prompt Engineering & Structured Output",
    shortLabel: "Prompt Engineering",
    weight: 0.2,
  },
  "context-reliability": {
    id: "context-reliability",
    n: 5,
    title: "5. Context Management & Reliability",
    shortLabel: "Context & Reliability",
    weight: 0.15,
  },
};

export const DOMAIN_LIST: CCAFDomainInfo[] = Object.values(DOMAINS).sort(
  (a, b) => a.n - b.n
);
