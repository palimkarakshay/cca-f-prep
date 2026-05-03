#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { importRepo } from './importer.js';
import type { ImportPayload } from './types.js';

interface CliArgs {
  root: string;
  out: string | null;
  packSlug: string | null;
  packTitle: string | null;
  pretty: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  // pnpm (and other runners) set INIT_CWD to the directory the user invoked
  // from, even after the runner cd's into a workspace package. Resolve
  // user-provided relative paths against that, not the package dir.
  const baseDir = process.env.INIT_CWD || process.cwd();
  const args: CliArgs = {
    root: baseDir,
    out: null,
    packSlug: null,
    packTitle: null,
    pretty: true,
  };
  const resolveFromBase = (p: string): string =>
    path.isAbsolute(p) ? p : path.resolve(baseDir, p);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === '--') continue;
    switch (a) {
      case '--root':
        args.root = resolveFromBase(argv[++i] ?? '.');
        break;
      case '--out':
        args.out = resolveFromBase(argv[++i] ?? 'import.json');
        break;
      case '--pack-slug':
        args.packSlug = argv[++i] ?? null;
        break;
      case '--pack-title':
        args.packTitle = argv[++i] ?? null;
        break;
      case '--no-pretty':
        args.pretty = false;
        break;
      case '-h':
      case '--help':
        printHelp();
        process.exit(0);
      default:
        if (!a.startsWith('-') && args.root === baseDir) {
          args.root = resolveFromBase(a);
        } else {
          console.error(`Unknown argument: ${a}`);
          process.exit(2);
        }
    }
  }
  return args;
}

function printHelp(): void {
  process.stdout.write(
    [
      'Usage: ccafp-import [options] [<root>]',
      '',
      'Ingests a markdown study repo into a JSON import payload.',
      '',
      'Options:',
      '  --root <dir>          Repo root (default: cwd or positional)',
      '  --out <file>          Write JSON to file (default: stdout)',
      '  --pack-slug <slug>    Override pack slug (default: derived from root dirname)',
      '  --pack-title <title>  Override pack title (default: README H1)',
      '  --no-pretty           Compact JSON output',
      '  -h, --help            Show this help',
      '',
    ].join('\n'),
  );
}

function summarize(payload: ImportPayload): string {
  return [
    `packs:               ${payload.packs.length}`,
    `domains:             ${payload.domains.length}`,
    `mcqs:                ${payload.mcqs.length}`,
    `challenges:          ${payload.challenges.length}`,
    `solutions:           ${payload.solutions.length}`,
    `mock_exams:          ${payload.mock_exams.length}`,
    `mock_exam_questions: ${payload.mock_exam_questions.length}`,
  ].join('\n');
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const payload = await importRepo(args.root, {
    packSlug: args.packSlug ?? undefined,
    packTitle: args.packTitle ?? undefined,
  });
  const json = JSON.stringify(payload, null, args.pretty ? 2 : 0);
  if (args.out) {
    await writeFile(args.out, json + '\n', 'utf8');
    process.stderr.write(`wrote ${args.out}\n${summarize(payload)}\n`);
  } else {
    process.stdout.write(json + '\n');
    process.stderr.write(summarize(payload) + '\n');
  }
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
