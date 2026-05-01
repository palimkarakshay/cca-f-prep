# CCA-F Prep Repo — Context for Claude Code

## Purpose
This repo contains study material, practice questions, and coding challenges
for the Anthropic Claude Certified Architect – Foundations (CCA-F) exam.

## Exam structure
- 60 scenario-based MCQs, 120 minutes
- Five weighted domains:
  1. Agentic Architecture & Orchestration (27%)
  2. Claude Code Configuration & Workflows (20%)
  3. Tool Design & MCP Integration (18%)
  4. Prompt Engineering & Structured Output (20%)
  5. Context Management & Reliability (15%)
- Passing scaled score: 720/1000

## Repo layout
- `01-agentic-architecture/` … `05-context-reliability/` — one folder per exam domain, 1:1 with the official names above
  - `notes.md` — concise study notes for the domain
  - `mcq-set-N.md` — practice MCQs (questions only, answer key separate)
  - `challenges/` — hands-on exercises (debug, refactor, design, write-the-code)
  - `solutions/` — answer keys and reference solutions, mirroring `challenges/`
- `06-failure-analysis/error-log.md` — running log of every miss using the
  Mistake / Why / Principle / Prevention schema and the F1–F8 cognitive
  failure-mode taxonomy
- `07-mock-exams/` — full-length practice exams + parallel `solutions/`
  (e.g., `diagnostic-01.md`)
- `08-cheat-sheets/`
  - `decision-trees.md` — condensed *When-to* trees + running defaults
    promoted from `error-log.md`
  - `training-methodology.md` — daily loop, mock-exam phases, drills,
    weekly structure

## Authoring conventions
- MCQs: 4 options (A–D), one best answer, three plausible distractors.
- Each MCQ explanation must name the **principle**, not just the answer.
- Challenges follow easy → medium → hard within each domain.
- Solutions live in a parallel `solutions/` folder, never inline with the
  challenge prompt, so I can attempt without spoilers.
- Keep notes terse and scannable. Lean signal over completeness.
- **Strict validation loop.** Every challenge states a target principle
  and a known failure mode; the solution names both. If a challenge can
  be "solved" without naming the principle, it's too easy or too vague —
  rewrite it.
- **Error taxonomy.** Every miss gets logged in
  `06-failure-analysis/error-log.md` with an F-code (F1–F8). Patterns
  repeating across ≥3 misses are promoted to
  `08-cheat-sheets/decision-trees.md` § "How I default."
- **Rebuild-from-scratch challenges (no-AI).** At least one challenge per
  domain is marked `[no-ai]` in its filename or front matter. I solve
  it without Claude — design the prompt, write the reasoning, identify
  failure modes — before consulting the solution. AI assist on `[no-ai]`
  challenges invalidates the practice.

## My background (relevant context)
- Senior ABAP developer; comfortable with code, schemas, and structured
  thinking. Skip beginner framing.
- **Cold diagnostic-01 score: 3/10** (2026-05-01). Detailed F-code analysis
  in `06-failure-analysis/error-log.md`. Pattern: strong on platform
  mechanisms (hooks, schemas, caching), weak on architectural rationale
  and tradeoff judgment. Tendency to pick elaborate distractors over the
  simplest correct answer.
- Tendency to change goals mid-session — see `08-cheat-sheets/training-methodology.md`
  § "Final gap."

## How to help me
- When I ask you to generate a challenge or MCQ, do not show the answer
  in the same file unless I explicitly ask. Put it in `solutions/`.
- When I'm stuck, prefer leading questions over direct answers.
- Cite the exam domain and sub-area when generating new content.
- Reference real-world examples from `palimkarakshay/lumivara-site` where
  the abstract concept has a concrete production analog (CLAUDE.md +
  AGENTS.md, dual-lane architecture, session-budget watermarks at 80%/95%,
  AI routing tables, Vercel-mirror discipline).
- When I'm shifting goals mid-session, name it and ask whether to defer
  the new thread to a parking-lot note or pursue it. Keep me anchored on
  the main goal: pass the CCA-F exam.
