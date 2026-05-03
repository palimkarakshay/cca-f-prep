import { describe, expect, it } from 'vitest';

import {
  parseCoverageTable,
  parseDomainsFromReadme,
  parseExamHeader,
  parseQuestionFile,
  parseSolutionFile,
} from '../src/parser.js';

const QUESTION_FIXTURE = `# Diagnostic 01 — Mixed Domain (10 questions, ~20 min)

Take this cold.

Coverage:

| Q | Domain | Sub-area |
|---|---|---|
| 1 | 1. Agentic Architecture | Coordinator-subagent vs. linear loop |
| 2 | 1. Agentic Architecture | Hook event placement |

---

## Q1 — Coordinator-subagent vs. linear loop

A team is building a research assistant.

What is the **strongest** reason to refactor?

- A. Subagents reduce per-turn token cost.
- B. Independent searches can run in parallel.
- C. Subagents have a longer context window.
- D. Required when more than 10 tools are registered.

**My answer:** _______

---

## Q2 — Hook event placement

A developer wants Claude Code to refuse \`rm -rf\`.

Which hook event?

- A. \`SessionStart\` — block at boot.
- B. \`PreToolUse\` — inspect and reject.
- C. \`PostToolUse\` — inspect after.
- D. \`Stop\` — analyze at end.

**My answer:** _______
`;

const SOLUTION_FIXTURE = `# Diagnostic 01 — Solutions

> Stop here.

---

## Q1 — Coordinator-subagent vs. linear loop

**Correct: B**

- A — wrong axis. Subagents inherit the parent model.
- **B — right.** Parallel execution and context isolation.
- C — false. Subagents get a fresh window, not bigger.
- D — fabricated. There is no "10 tools" threshold.

**Principle:** Reach for coordinator-subagent when work parallelizes or context would pollute.

**Lumivara-site analogy:** the planner / executor split.

**Domain:** 1 — Agentic Architecture & Orchestration → sub-area "Coordinator-subagent."

---

## Q2 — Hook event placement

**Correct: B**

- A — \`SessionStart\` runs once at boot.
- **B — right.** \`PreToolUse\` fires before tool calls and can block.
- C — \`PostToolUse\` runs after.
- D — \`Stop\` runs at session end.

**Principle:** Pre-execution policy → \`PreToolUse\`.

**Domain:** 1 — Agentic Architecture & Orchestration → sub-area "Hooks."
`;

const README_FIXTURE = `# CCA-F Prep

Study material.

## Layout
- \`01-agentic-architecture/\` — agentic loops, coordinator-subagent, hooks (27%)
- \`02-claude-code/\` — CLAUDE.md, slash commands, configuration (20%)
- \`03-tool-design-mcp/\` — tool descriptions, MCP servers (18%)
- \`04-prompt-engineering/\` — system prompts, structured output (20%)
- \`05-context-reliability/\` — context windows, batching, retries (15%)
- \`full-mock-exams/\` — 60-question practice exams
- \`reference/\` — glossary
`;

describe('parseExamHeader', () => {
  it('extracts title, count, and duration', () => {
    const h = parseExamHeader(QUESTION_FIXTURE);
    expect(h.title).toBe('Diagnostic 01 — Mixed Domain');
    expect(h.question_count).toBe(10);
    expect(h.duration_min).toBe(20);
  });

  it('handles missing duration', () => {
    const h = parseExamHeader('# Mock 02 (5 questions)\n\nbody');
    expect(h.question_count).toBe(5);
    expect(h.duration_min).toBeNull();
  });

  it('throws on missing H1', () => {
    expect(() => parseExamHeader('## not h1')).toThrow();
  });
});

describe('parseCoverageTable', () => {
  it('parses Q→domain mappings', () => {
    const rows = parseCoverageTable(QUESTION_FIXTURE);
    expect(rows).toEqual([
      {
        q: 1,
        domain_number: 1,
        domain_label: 'Agentic Architecture',
        subarea: 'Coordinator-subagent vs. linear loop',
      },
      {
        q: 2,
        domain_number: 1,
        domain_label: 'Agentic Architecture',
        subarea: 'Hook event placement',
      },
    ]);
  });

  it('returns empty when no table', () => {
    expect(parseCoverageTable('# Just a title\n\nNo table.')).toEqual([]);
  });
});

describe('parseQuestionFile', () => {
  it('parses 2 questions with 4 options each', () => {
    const qs = parseQuestionFile(QUESTION_FIXTURE);
    expect(qs).toHaveLength(2);
    expect(qs[0]!.number).toBe(1);
    expect(qs[0]!.title).toBe('Coordinator-subagent vs. linear loop');
    expect(qs[0]!.options.map(o => o.letter)).toEqual(['A', 'B', 'C', 'D']);
    expect(qs[0]!.options[1]!.text).toContain('parallel');
    expect(qs[0]!.stem_md).toContain('research assistant');
    expect(qs[0]!.stem_md).not.toContain('My answer');
  });

  it('throws when options are missing', () => {
    const broken = `## Q1 — Bad

stem.

- A. only one option.

**My answer:** _______
`;
    expect(() => parseQuestionFile(broken)).toThrow(/4 options/);
  });
});

describe('parseSolutionFile', () => {
  it('parses correct letter, rationales, principle, domain', () => {
    const sols = parseSolutionFile(SOLUTION_FIXTURE);
    expect(sols).toHaveLength(2);

    const s1 = sols[0]!;
    expect(s1.number).toBe(1);
    expect(s1.correct_letter).toBe('B');
    expect(s1.rationales.A).toContain('wrong axis');
    expect(s1.rationales.B).toContain('Parallel execution');
    expect(s1.rationales.C).toContain('fresh window');
    expect(s1.rationales.D).toContain('fabricated');
    expect(s1.principle).toContain('coordinator-subagent');
    expect(s1.domain_number).toBe(1);
    expect(s1.domain_subarea).toBe('Coordinator-subagent');
  });

  it('throws when **Correct:** is missing', () => {
    expect(() =>
      parseSolutionFile('## Q1 — bad\n\nno correct marker\n\n**Domain:** 1 — X\n'),
    ).toThrow(/Correct/);
  });
});

describe('parseDomainsFromReadme', () => {
  it('extracts 5 domains with weights', () => {
    const ds = parseDomainsFromReadme(README_FIXTURE);
    expect(ds).toHaveLength(5);
    expect(ds[0]).toMatchObject({
      number: 1,
      slug: '01-agentic-architecture',
      weight_pct: 27,
    });
    expect(ds[4]!.slug).toBe('05-context-reliability');
    expect(ds[4]!.weight_pct).toBe(15);
  });
});
