import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import {
  parseCoverageTable,
  parseDomainsFromReadme,
  parseExamHeader,
  parseQuestionFile,
  parseSolutionFile,
} from './parser.js';
import type {
  ContentPack,
  Domain,
  ImportPayload,
  Mcq,
  McqOption,
  MockExam,
  MockExamQuestion,
} from './types.js';
import { EMPTY_PAYLOAD } from './types.js';

interface ImportOptions {
  packSlug?: string;
  packTitle?: string;
}

const PASSING_SCORE_RE = /Passing\s+scaled\s+score:\s*(\d+)/i;

async function pathExists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readIfExists(p: string): Promise<string | null> {
  try {
    return await readFile(p, 'utf8');
  } catch {
    return null;
  }
}

function letterToIdx(letter: 'A' | 'B' | 'C' | 'D'): number {
  return { A: 0, B: 1, C: 2, D: 3 }[letter];
}

function externalRefForExamQuestion(examSlug: string, qNumber: number): string {
  return `${examSlug}#q${qNumber}`;
}

export async function importRepo(rootDir: string, opts: ImportOptions = {}): Promise<ImportPayload> {
  const payload: ImportPayload = structuredClone(EMPTY_PAYLOAD);

  const readmePath = path.join(rootDir, 'README.md');
  const readme = await readIfExists(readmePath);
  if (!readme) {
    throw new Error(`No README.md found at ${readmePath}`);
  }

  const claudeMd = (await readIfExists(path.join(rootDir, 'CLAUDE.md'))) ?? '';
  const passingScore = (() => {
    const m = PASSING_SCORE_RE.exec(claudeMd);
    return m ? Number(m[1]) : null;
  })();

  const readmeH1 = /^#\s+(.+)$/m.exec(readme)?.[1]?.trim() ?? path.basename(rootDir);
  const packSlug = opts.packSlug ?? slugify(path.basename(rootDir));
  const packTitle = opts.packTitle ?? readmeH1;

  const pack: ContentPack = {
    slug: packSlug,
    title: packTitle,
    locale: 'en',
    passing_score: passingScore,
    version: 1,
    status: 'draft',
    source_ref: 'README.md',
  };
  payload.packs.push(pack);

  const domainSpecs = parseDomainsFromReadme(readme);
  const domainByNumber = new Map<number, { slug: string; title: string }>();
  for (const spec of domainSpecs) {
    const folderPath = path.join(rootDir, spec.slug);
    const notesPath = path.join(folderPath, 'notes.md');
    const notes_md = (await readIfExists(notesPath)) ?? null;
    payload.domains.push({
      pack_slug: pack.slug,
      slug: spec.slug,
      title: spec.title,
      weight_pct: spec.weight_pct,
      position: spec.number,
      notes_md,
    });
    domainByNumber.set(spec.number, { slug: spec.slug, title: spec.title });
  }

  const mockDir = path.join(rootDir, 'full-mock-exams');
  if (await pathExists(mockDir)) {
    const entries = (await readdir(mockDir)).filter(
      f => f.endsWith('.md') && !f.startsWith('.'),
    );
    for (const file of entries) {
      const examSlug = file.replace(/\.md$/, '');
      const examPath = path.join(mockDir, file);
      const solutionPath = path.join(mockDir, 'solutions', file);
      const examMd = await readFile(examPath, 'utf8');
      const solutionMd = await readIfExists(solutionPath);

      const header = parseExamHeader(examMd);
      const coverage = parseCoverageTable(examMd);
      const coverageByQ = new Map(coverage.map(c => [c.q, c]));
      const questions = parseQuestionFile(examMd);
      const solutions = solutionMd ? parseSolutionFile(solutionMd) : [];
      const solutionsByQ = new Map(solutions.map(s => [s.number, s]));

      payload.mock_exams.push({
        pack_slug: pack.slug,
        slug: examSlug,
        title: header.title,
        duration_min: header.duration_min,
        question_count: header.question_count || questions.length,
        status: 'draft',
      });

      for (const q of questions) {
        const cov = coverageByQ.get(q.number);
        const sol = solutionsByQ.get(q.number);
        const domainNumber = sol?.domain_number ?? cov?.domain_number ?? null;
        if (domainNumber === null) {
          throw new Error(
            `Question Q${q.number} in ${file} has no domain mapping (coverage table or solution).`,
          );
        }
        const domainRef = domainByNumber.get(domainNumber);
        if (!domainRef) {
          throw new Error(
            `Question Q${q.number} maps to domain ${domainNumber} which is not declared in README.md`,
          );
        }

        const externalRef = externalRefForExamQuestion(examSlug, q.number);

        const mcq: Mcq = {
          domain_pack_slug: pack.slug,
          domain_slug: domainRef.slug,
          external_ref: externalRef,
          stem_md: q.stem_md,
          options: q.options as McqOption[],
          correct_idx: sol ? letterToIdx(sol.correct_letter) : -1,
          principle: sol?.principle ?? null,
          distractor_rationales: sol
            ? buildDistractorRationales(sol.correct_letter, sol.rationales)
            : null,
          difficulty: 'medium',
          source_ref: `full-mock-exams/${file}#Q${q.number}`,
          status: sol ? 'draft' : 'draft',
        };
        if (mcq.correct_idx === -1) {
          throw new Error(
            `Question Q${q.number} in ${file} has no solution — correct answer unknown`,
          );
        }
        payload.mcqs.push(mcq);

        const link: MockExamQuestion = {
          mock_exam_pack_slug: pack.slug,
          mock_exam_slug: examSlug,
          position: q.number,
          mcq_external_ref: externalRef,
        };
        payload.mock_exam_questions.push(link);
      }
    }
  }

  for (const spec of domainSpecs) {
    const challengesDir = path.join(rootDir, spec.slug, 'challenges');
    const solutionsDir = path.join(rootDir, spec.slug, 'solutions');
    if (!(await pathExists(challengesDir))) continue;
    const challengeFiles = (await readdir(challengesDir)).filter(
      f => f.endsWith('.md'),
    );
    for (const file of challengeFiles) {
      const slug = file.replace(/\.md$/, '');
      const prompt_md = await readFile(path.join(challengesDir, file), 'utf8');
      const titleMatch = /^#\s+(.+)$/m.exec(prompt_md);
      payload.challenges.push({
        domain_pack_slug: pack.slug,
        domain_slug: spec.slug,
        slug,
        title: titleMatch?.[1]?.trim() ?? slug,
        prompt_md,
        difficulty: 'medium',
        tags: [],
        status: 'draft',
      });

      const sPath = path.join(solutionsDir, file);
      const body_md = await readIfExists(sPath);
      if (body_md) {
        payload.solutions.push({
          challenge_pack_slug: pack.slug,
          challenge_domain_slug: spec.slug,
          challenge_slug: slug,
          body_md,
          principle: null,
        });
      }
    }
  }

  return payload;
}

function buildDistractorRationales(
  correct: 'A' | 'B' | 'C' | 'D',
  rationales: Record<'A' | 'B' | 'C' | 'D', string>,
): string[] {
  return (['A', 'B', 'C', 'D'] as const)
    .filter(l => l !== correct)
    .map(l => rationales[l]);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
