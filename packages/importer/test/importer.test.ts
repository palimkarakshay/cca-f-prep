import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { importRepo } from '../src/importer.js';

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
);

describe('importRepo against the actual repo', () => {
  it('produces a single pack with 5 domains and the diagnostic mock exam', async () => {
    const payload = await importRepo(REPO_ROOT);

    expect(payload.packs).toHaveLength(1);
    const pack = payload.packs[0]!;
    expect(pack.title).toBe('CCA-F Prep');
    expect(pack.passing_score).toBe(720);

    expect(payload.domains).toHaveLength(5);
    const slugs = payload.domains.map(d => d.slug).sort();
    expect(slugs).toEqual([
      '01-agentic-architecture',
      '02-claude-code',
      '03-tool-design-mcp',
      '04-prompt-engineering',
      '05-context-reliability',
    ]);
    const weights = Object.fromEntries(
      payload.domains.map(d => [d.slug, d.weight_pct]),
    );
    expect(weights['01-agentic-architecture']).toBe(27);
    expect(weights['05-context-reliability']).toBe(15);

    expect(payload.mock_exams).toHaveLength(1);
    expect(payload.mock_exams[0]!.slug).toBe('diagnostic-01');
    expect(payload.mock_exams[0]!.question_count).toBe(10);
    expect(payload.mock_exams[0]!.duration_min).toBe(20);
  });

  it('produces 10 MCQs, all linked to a domain and resolved to a correct answer', async () => {
    const payload = await importRepo(REPO_ROOT);

    expect(payload.mcqs).toHaveLength(10);
    for (const mcq of payload.mcqs) {
      expect(mcq.options).toHaveLength(4);
      expect(mcq.correct_idx).toBeGreaterThanOrEqual(0);
      expect(mcq.correct_idx).toBeLessThanOrEqual(3);
      expect(mcq.principle).toBeTruthy();
      expect(mcq.distractor_rationales).toHaveLength(3);
      expect(mcq.domain_slug).toMatch(/^\d{2}-/);
    }

    const q1 = payload.mcqs.find(m => m.external_ref === 'diagnostic-01#q1');
    expect(q1).toBeDefined();
    expect(q1!.correct_idx).toBe(1); // B
    expect(q1!.domain_slug).toBe('01-agentic-architecture');
    expect(q1!.stem_md).toContain('research assistant');
    expect(q1!.principle).toMatch(/coordinator-subagent/i);
  });

  it('links every mock exam question to an MCQ in order', async () => {
    const payload = await importRepo(REPO_ROOT);
    const links = payload.mock_exam_questions.filter(
      l => l.mock_exam_slug === 'diagnostic-01',
    );
    expect(links).toHaveLength(10);
    const positions = links.map(l => l.position).sort((a, b) => a - b);
    expect(positions).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const link of links) {
      const mcq = payload.mcqs.find(m => m.external_ref === link.mcq_external_ref);
      expect(mcq).toBeDefined();
    }
  });

  it('handles empty challenge folders gracefully', async () => {
    const payload = await importRepo(REPO_ROOT);
    expect(payload.challenges).toEqual([]);
    expect(payload.solutions).toEqual([]);
  });

  it('honours pack-slug and pack-title overrides', async () => {
    const payload = await importRepo(REPO_ROOT, {
      packSlug: 'cca-f-foundations',
      packTitle: 'CCA-F Foundations',
    });
    expect(payload.packs[0]!.slug).toBe('cca-f-foundations');
    expect(payload.packs[0]!.title).toBe('CCA-F Foundations');
  });
});
