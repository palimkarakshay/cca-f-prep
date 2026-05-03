import type { McqOption } from './types.js';

export interface ParsedQuestion {
  number: number;
  title: string;
  stem_md: string;
  options: McqOption[];
}

export interface ParsedSolution {
  number: number;
  title: string;
  correct_letter: 'A' | 'B' | 'C' | 'D';
  rationales: Record<'A' | 'B' | 'C' | 'D', string>;
  principle: string | null;
  domain_number: number | null;
  domain_subarea: string | null;
}

export interface ParsedExamHeader {
  title: string;
  question_count: number;
  duration_min: number | null;
}

export interface CoverageRow {
  q: number;
  domain_number: number;
  domain_label: string;
  subarea: string;
}

export interface ParsedDomainSpec {
  number: number;
  slug: string;
  title: string;
  weight_pct: number | null;
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;
type Letter = (typeof LETTERS)[number];

// Parse the H1 of a mock exam question file:
//   "# Diagnostic 01 — Mixed Domain (10 questions, ~20 min)"
export function parseExamHeader(markdown: string): ParsedExamHeader {
  const h1 = /^#\s+(.+)$/m.exec(markdown);
  if (!h1) throw new Error('Exam file is missing an H1 title');
  const fullTitle = h1[1]!.trim();

  const meta = /\((\d+)\s+questions(?:,\s*~?(\d+)\s*min)?\)/i.exec(fullTitle);
  const question_count = meta ? Number(meta[1]) : 0;
  const duration_min = meta && meta[2] ? Number(meta[2]) : null;

  return {
    title: fullTitle.replace(/\s*\([^)]*\)\s*$/, '').trim(),
    question_count,
    duration_min,
  };
}

// Parse the coverage table that appears near the top of a mock exam.
//   | Q | Domain | Sub-area |
//   |---|---|---|
//   | 1 | 1. Agentic Architecture | Coordinator-subagent vs. linear loop |
export function parseCoverageTable(markdown: string): CoverageRow[] {
  const lines = markdown.split('\n');
  const headerIdx = lines.findIndex(
    l => /^\|\s*Q\s*\|\s*Domain\s*\|\s*Sub-area\s*\|/i.test(l),
  );
  if (headerIdx === -1) return [];

  const rows: CoverageRow[] = [];
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line.startsWith('|')) break;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map(c => c.trim());
    if (cells.length < 3) continue;
    const q = Number(cells[0]);
    const domainCell = cells[1] ?? '';
    const subarea = cells[2] ?? '';
    const dm = /^(\d+)\.\s*(.+)$/.exec(domainCell);
    if (!Number.isFinite(q) || !dm) continue;
    rows.push({
      q,
      domain_number: Number(dm[1]),
      domain_label: dm[2]!.trim(),
      subarea,
    });
  }
  return rows;
}

// Split a markdown body on `## Q<n> — <title>` headers. Returns the segment
// for each question, with whitespace trimmed.
function splitQuestionSections(markdown: string): {
  number: number;
  title: string;
  body: string;
}[] {
  const re = /^##\s+Q(\d+)\s+[—-]\s+(.+)$/gm;
  const matches: { number: number; title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) {
    matches.push({
      number: Number(m[1]),
      title: m[2]!.trim(),
      index: m.index,
    });
  }
  const out: { number: number; title: string; body: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i]!;
    const next = matches[i + 1];
    const headerEnd = markdown.indexOf('\n', cur.index) + 1;
    const end = next ? next.index : markdown.length;
    const body = markdown
      .slice(headerEnd, end)
      .replace(/^\s*---\s*$/gm, '')
      .trim();
    out.push({ number: cur.number, title: cur.title, body });
  }
  return out;
}

// Parse a question block body into stem + 4 options. The format is:
//   <stem paragraphs (may include a final question line)>
//
//   - A. <text>
//   - B. <text>
//   - C. <text>
//   - D. <text>
//
//   **My answer:** _______
export function parseQuestionBody(body: string): {
  stem_md: string;
  options: McqOption[];
} {
  // Strip the answer scratch line if present.
  const cleaned = body.replace(/^\*\*My answer:\*\*.*$/m, '').trim();

  const optionRe = /^-\s+([A-D])\.\s+(.+)$/gm;
  const opts: { letter: Letter; text: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = optionRe.exec(cleaned)) !== null) {
    opts.push({
      letter: m[1] as Letter,
      text: m[2]!.trim(),
      index: m.index,
    });
  }
  if (opts.length !== 4) {
    throw new Error(
      `Expected 4 options (A–D), found ${opts.length}. Body starts: ${cleaned.slice(0, 80)}`,
    );
  }
  for (let i = 0; i < 4; i++) {
    if (opts[i]!.letter !== LETTERS[i]) {
      throw new Error(`Options out of order: expected ${LETTERS[i]}, got ${opts[i]!.letter}`);
    }
  }

  const stem_md = cleaned.slice(0, opts[0]!.index).trim();
  const options: McqOption[] = opts.map(o => ({ letter: o.letter, text: o.text }));
  return { stem_md, options };
}

export function parseQuestionFile(markdown: string): ParsedQuestion[] {
  return splitQuestionSections(markdown).map(({ number, title, body }) => {
    const { stem_md, options } = parseQuestionBody(body);
    return { number, title, stem_md, options };
  });
}

// Parse a solution block body. The format is:
//   **Correct: B**
//
//   - A — <rationale>
//   - **B — <rationale>**
//   - C — <rationale>
//   - D — <rationale>
//
//   **Principle:** <text>
//
//   **Lumivara-site analogy:** ... (optional)
//
//   **Domain:** 1 — Agentic Architecture & Orchestration → sub-area "Coordinator-subagent."
export function parseSolutionBody(body: string): Omit<ParsedSolution, 'number' | 'title'> {
  const correctMatch = /\*\*Correct:\s+([A-D])\*\*/.exec(body);
  if (!correctMatch) {
    throw new Error(`Solution missing **Correct: X**. Body: ${body.slice(0, 80)}`);
  }
  const correct_letter = correctMatch[1] as Letter;

  const rationales: Record<Letter, string> = { A: '', B: '', C: '', D: '' };
  // Each rationale line: `- A — text` or `- **A — text.**` (the correct one is bolded).
  // Allow the rationale to span multiple lines until the next bullet/blank/section.
  const rationaleRe =
    /^-\s+(?:\*\*)?([A-D])\s+[—-]\s+(.+?)(?:\*\*)?$/gm;
  let m: RegExpExecArray | null;
  while ((m = rationaleRe.exec(body)) !== null) {
    const letter = m[1] as Letter;
    let text = m[2]!.trim();
    // Strip a trailing `**` that survived if the rationale was the bolded
    // one and ended with punctuation inside the bold span.
    text = text.replace(/\*\*\s*$/, '').trim();
    rationales[letter] = text;
  }

  const principleMatch = /\*\*Principle:\*\*\s+([\s\S]*?)(?=\n\s*\n|\*\*[A-Z][a-z-]+:\*\*|$)/.exec(
    body,
  );
  const principle = principleMatch ? principleMatch[1]!.trim() : null;

  const domainLine = /^\*\*Domain:\*\*\s+(.+)$/m.exec(body)?.[1]?.trim() ?? null;
  let domain_number: number | null = null;
  let domain_subarea: string | null = null;
  if (domainLine) {
    const numMatch = /^(\d+)\s*[—-]/.exec(domainLine);
    if (numMatch) domain_number = Number(numMatch[1]);
    const subMatch = /sub-area\s*"([^"]+)"|sub-area\s*([^.\n]+?)(?:\.\s*$|$)/.exec(
      domainLine,
    );
    const captured = subMatch ? (subMatch[1] ?? subMatch[2]) : null;
    if (captured) domain_subarea = captured.trim().replace(/\.\s*$/, '');
  }

  return {
    correct_letter,
    rationales,
    principle,
    domain_number,
    domain_subarea,
  };
}

export function parseSolutionFile(markdown: string): ParsedSolution[] {
  return splitQuestionSections(markdown).map(({ number, title, body }) => {
    const parsed = parseSolutionBody(body);
    return { number, title, ...parsed };
  });
}

// Parse the README's "## Layout" section to recover canonical domain
// slugs + weights. Format:
//   - `01-agentic-architecture/` — agentic loops, coordinator-subagent, hooks (27%)
export function parseDomainsFromReadme(markdown: string): ParsedDomainSpec[] {
  const re = /^-\s+`(\d{2}-[a-z0-9-]+)\/`\s+[—-]\s+([^()]+?)(?:\s*\((\d+)%\))?\s*$/gm;
  const out: ParsedDomainSpec[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) {
    const slug = m[1]!;
    const numberMatch = /^(\d{2})-/.exec(slug);
    if (!numberMatch) continue;
    out.push({
      number: Number(numberMatch[1]),
      slug,
      title: m[2]!.trim().replace(/[,;]\s*$/, ''),
      weight_pct: m[3] ? Number(m[3]) : null,
    });
  }
  return out;
}
