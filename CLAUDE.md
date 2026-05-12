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
- Passing scaled score: 720/1000 (range 100–1000)
- **Format details (often missed — added 2026-05-02 after audit):**
  - **Proctored, closed-book, no AI assistance.**
  - **6 production scenarios exist; 4 are randomly chosen per sitting.**
    All 60 questions anchor to those 4 scenarios — i.e., ~15 questions
    per scenario. Implication: practice scenario-anchored question
    *blocks* (one shared scenario → 10–15 follow-up questions), not
    isolated single-MCQs. Mock exams here should mirror that shape.
  - **No penalty for guessing** — answer every question.
  - $99 sitting fee (waived for first 5,000 Anthropic Partner Network
    employees). Cert launched 2026-03-12. Score reports ~2 business days,
    digital badge issued.
  - "Foundations" is the entry tier; Anthropic has signaled additional
    tiers (seller, developer, architect-advanced) later in 2026.
  - The 27/20/18/20/15 weight split is consistent across every
    third-party source citing the exam guide PDF, but not yet found
    on a first-party anthropic.com URL — treat as very likely correct.

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
  AI routing tables, Vercel-mirror discipline). Order: principle first,
  lumivara-site link second. Don't fabricate links.
- When I'm shifting goals mid-session, name it and ask whether to defer
  the new thread to a parking-lot note or pursue it. Keep me anchored on
  the main goal: pass the CCA-F exam.
- Watch for accidental answer leaks in question files: example answer
  strings, sample submissions, and option ordering must NOT mirror the
  real key. (See diagnostic-01 spoiler regression, 2026-05-02.)

## External review (codex)

Every PR is reviewed by OpenAI gpt-5.5 (with Gemini → GitHub Models →
OpenRouter fallback) via `.github/workflows/codex-review.yml`. The
review is posted as a PR comment and labels the PR `codex-reviewed` /
`codex-blockers` / `review-deferred` accordingly. Use it as the merge
gate — don't merge `codex-blockers` without addressing findings.

- **Trigger:** opens, reopens, synchronizes, or `ready_for_review` on
  any PR. Manual rerun via `workflow_dispatch` with `pr=<n>`.
- **Provider ladder:** `scripts/codex-review-fallback.py` — same
  five-leg ladder used in `palimkarakshay/lumivara-site`. Defers (no
  silent skip) only when every leg is unavailable.
- **Recheck cron:** `.github/workflows/codex-review-recheck.yml` retries
  any open `review-deferred` PR every 2h.
- **Secrets to set in repo settings → Actions:** `OPENAI_API_KEY`,
  `OPENAI_API_KEY_BACKUP`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` (all
  optional; GitHub Models leg uses the auto-provisioned `GITHUB_TOKEN`).
- **Retroactive review of pre-workflow commits:** open a PR from a
  branch that contains the historical changes — codex will review the
  PR's full diff.

## Coherency review log

- 2026-05-02 — Audit of committed history. Two findings:
  - **Spoiler in `07-mock-exams/diagnostic-01.md`** (still
    `full-mock-exams/` at audit time; renamed to `07-mock-exams/` in
    PR #2 in parallel) — the example answer-format string
    `1B 2B 3B 4B 5C 6B 7B 8B 9B 10B` was an exact match for the answer
    key. Replaced with a neutral `1X 2X … 10X` placeholder (commit
    `c38f580`). Spoiler-leak watchpoint added to "How to help me" so
    future MCQ generation doesn't reintroduce it.
  - **No external review pipeline existed** — added codex workflow
    parity with `palimkarakshay/lumivara-site` (commits `f28350d`,
    `10a9e33`, plus this CLAUDE.md update).

- 2026-05-02 — Academy-content scrub + curriculum completion. Scope:
  validate `docs/curriculum.js` against the live
  [Anthropic Academy](https://anthropic.skilljar.com/) and author every
  remaining stub. Three findings:
  - **Curriculum was 3/41 concepts authored** at start of pass (B1.1,
    B1.4, B5.1; section-test 1/9). The remaining 38 concepts and 8
    section-tests were stub `null`s. Authored all 38 concepts (lesson +
    3-Q quiz each, mirroring the existing `paragraphs/keyPoints/examples/
    pitfalls/simplified` shape and the principle/bSkills tagging
    convention) and all 8 missing section-tests, mining each from the
    corresponding `00-academy-basics/notes/0X-*.md`. Per-section
    commits, fast-forward merges to `main` so Pages redeploys
    incrementally. Final state: **9 sections, 41/41 concepts ready,
    9/9 section-tests** (verified offline by parsing `curriculum.js`
    and asserting every concept has lesson+quiz with required fields).
  - **Academy now publishes ~17 courses** (vs 9 mapped here); the eight
    new ones — *Advanced MCP*, *Claude with Vertex AI*, *Claude with
    Bedrock*, *AI Capabilities and Limitations*, *AI Fluency for
    Education / Students / Nonprofits*, *Teaching AI Fluency* — are
    out of scope for CCA-F **Foundations** (Foundations tests the 9
    courses already mapped). Documented here so a future tier (CCA
    Architect-Advanced, CCA Developer) can pick them up without
    re-scrubbing. No content additions made for them; tightening to
    the exam over breadth.
  - **Quality finding: correct-letter distribution is B-skewed** in
    the auto-authored quizzes (~76% B across 41 concept quizzes). The
    `docs/README.md` authoring conventions explicitly call out
    "Mix correct-letter positions. Avoid B-B-B-B patterns. Distribute
    the correct letter across A/B/C/D within a quiz." The pass
    privileged content fidelity over letter shuffling; the next
    follow-up commit rebalances the worst-offender concept quizzes
    (those with all-B answers) so users practise reasoning rather
    than learning a positional bias. Tracked as `letter-bias-2026-05`.

- 2026-05-04 — **AI-LMS business-plan hostile review.** Triggered by
  the operator asking for a "harsh critic" pass on
  `plans/{deck-overview, deck-investor, deck-b2b-prospect,
  deck-collaborator, content-pack-management-plan, IMPLEMENTATION,
  expert-review-audit, research-and-strategy-dossier}.md`. Five
  parallel subagent critiques + one 2026 market-research pass produced
  three new docs in `plans/`:
  - `business-viability-negative-study.md` (18 sections + 2
    appendices, ~1,200 lines): per-domain hostile findings (TAM
    fallacy, AI-cost off by 25–30×, Maven 96% misattribution,
    18-day-Phase-1 fantasy, free-tier ToS breach, SOC2 chicken-
    and-egg, pilot-pricing inversion, hyperscaler commoditisation
    via Workday-Sana $1.1B, Synthesia $4B, NotebookLM Enterprise
    GA, Anthropic Claude Marketplace).
  - `business-viability-mitigation-plan.md` (18 sections +
    appendix, ~950 lines): per-problem mitigations classified
    tactical/structural/unmitigable; §16 minimum-viable safe path
    (B2C cert-prep micro-SaaS for one segment, $10/mo, ≤5 routes,
    $500–2k MRR Year-1 ceiling, 10–15 hr/wk operator load); §17
    explicit stop-signals; §18 one-weekend action list; explicit
    anti-promise list (no $25M ARR, no 95% margin, no NRR 110%, no
    SOC2 in Year 1).
  - `business-viability-research-notes.md` (raw subagent findings
    preserved as evidence of record, with line citations into the
    operator's own decks).
  - **Cross-link banners added** to all eight pre-existing plan
    docs (`deck-*.md`, `content-pack-management-plan.md`,
    `IMPLEMENTATION.md`, `expert-review-audit.md`,
    `research-and-strategy-dossier.md`) so any future read picks
    up the superseded-status disclosure.
  - **Watch-list.** Operator should not send the B2B prospect deck,
    recruit on the collaborator deck, or pitch the investor deck in
    its current shape until the mitigation-plan rewrites are
    applied. Decks are kept on disk as record of what was
    considered and rejected, not as live pitching artefacts.

- 2026-05-04 (later) — **v2 scaled-down plan synthesised.** Follow-up
  to the hostile review: combined the negative findings + mitigations
  back into the v1 documents and produced a canonical v2 plan that
  keeps a B2B case alive at deliberately scaled-down size.
  - **New canonical doc:** `plans/v2-scaled-b2b-plan.md` — 13
    sections covering scaled ICP (tech-cert prep + small eng
    teams 5–50, non-regulated), pricing (B2C $15, B2B $20–25/seat,
    $300/$750 platform minimums, $10k non-refundable pilot),
    6-surface architecture (single-tenant in v1; RLS migration in
    week 7), 8–12 week part-time Phase 1, revenue-gated Phase 2,
    honest unit economics (60–75% gross margin, 95–105% blended
    NRR), revised risk register, stop-signals, and an explicit
    crosswalk of v1 → v2 changes per document.
  - **Implementation guide updated:** `plans/IMPLEMENTATION.md`
    now leads with a "v2 — Scaled-down build guide" section
    defining the week-by-week plan, cut scope (no admin app, no
    SAML/SCIM, no custom-catalog drafting in v1), server-side
    per-tenant token-budget circuit breaker, and a discipline
    list of what NOT to build in v1.
  - **Content-pack management plan updated:** prepended a
    v1-vs-v2 crosswalk table + buyer-language summary + v2
    anchor reading order so a fresh build session reads v2 first.
  - **Decks annotated inline:** `deck-overview.md`,
    `deck-investor.md`, `deck-b2b-prospect.md`,
    `deck-collaborator.md` now carry inline "v2 review note"
    callouts at the most-affected claims (TAM/SOM, gross margin,
    NRR, pilot pricing, security posture, recruiting ask, 18-day
    timeline, Maven 96%, etc.) — not whole-body rewrites.
  - **Dossier annotated:** `research-and-strategy-dossier.md`
    inline review notes at §5.1 SOM, §5.4 unit economics + CAC,
    §5.5 NRR. Citation walk in §§1–4 retained as design rationale.
  - **Audit doc has executed findings:** `expert-review-audit.md`
    appended §H "Executed audit (2026-05-04)" with H1.1–H4.4
    actual scored findings (severity + mitigation reference).
    The v1 §§A–G empty rubric remains as the framework a future
    paid reviewer can populate.
  - **Net effect.** v1 docs are preserved as historical record;
    v2 is canonical wherever they conflict. Anyone reading the
    materials encounters v2 first (in the new canonical doc and
    in `IMPLEMENTATION.md` / `content-pack-management-plan.md`
    headers) and inline review notes at the specific v1 claims
    that the audit struck.

- 2026-05-11 — **Two-lane coherence pass on the live web app.**
  The home page (`web/src/app/page.tsx`) introduces a "learner" vs
  "designer" lane split with two intake forms (`LearningGoalCapture`
  + `DesignerJourneyDecoder`). Downstream surfaces had drifted:
  `/for-teams` (the full Adept write-up) never named the lanes,
  the journey decoder, or the SME workbench; `/adept` floated free
  of the lane model; the web README's route tree and feature list
  predated the rebrand; the top-level README had no pointer to the
  live app. Pass adds, in six small commits:
  - `/for-teams`: "Where Adept fits — the designer lane" intro
    card, "Two paths into Adept" library-vs-company section,
    "Try it before you brief us" cross-link card to `/adept` +
    `/#lane-designer`, and step 1–3 rewrites that name the
    decoder and the workbench explicitly.
  - `/adept`: "You're in the designer lane" callout mapping the
    5-step framework to decoder/workspace/readout, "Back to the
    journey decoder" header CTA, one-line addition naming the
    workbench as "the build surface for the designer lane".
  - `/` lead paragraph names Adept as the designer lane; the
    designer-lane tile help text previews the decode → workbench
    flow.
  - `web/README.md`: "Two-lane home page (Curio / Adept)" section
    with lane / audience / front door / build surface table; route
    tree updated to list `/for-teams`, `/adept`, `/adept/sme/[packId]`
    under their actual locations; available-features list now
    covers the lane chooser, the decoders, the demo workspace, the
    SME workbench, and the write-up route.
  - Top-level `README.md`: one-paragraph callout above the folder
    layout and a `web/` row pointing readers at `web/README.md`,
    so the live product is discoverable from the repo root.
  - **Canonical lane vocabulary** (use these terms; don't paraphrase
    in future passes):
    - *Learner lane* → consumer Curio surface, ready-made or
      shaped journeys.
    - *Designer lane* → Adept, fronted by the journey decoder,
      built in the SME workbench, deployed via the pack-level
      Deploy action.
    - *General-library packs* → pre-approved baseline content
      (workplace comms, security, manager basics, …).
    - *Company-specific packs* → one-tenant content drafted from
      customer source material (acme-onboarding is the example).
  - No new routes or components introduced; copy-thread pass
    only. Visual hierarchy on `/for-teams` left as-is — flagged
    for a future design pass.

- 2026-05-11 (later) — **Commercialization-plan coherency pass.**
  `plans/commercialization-readiness-plan.md` (CRP) was committed via
  PR #47 (commit `e2e037e`) as the implementation lens applying
  `v2-scaled-b2b-plan.md` to the code under `web/`. Nothing yet
  pointed at it. This pass routes a fresh reader to it from every
  related document and resolves the loose ends a gap-audit surfaced.
  Six small commits:
  - **CRP self-extended.** New `## 0. Status` block (canonical as of
    2026-05-11), new `## 12. Gap analysis vs prior plans` table
    (covers all 9 fatal problems from the negative study, names the
    5 mitigations that lived only in the mitigation plan, lists the
    3 drifts between CRP and the now-archived `IMPLEMENTATION-v2.md`,
    and resolves the two open design questions inline), new `## 13.
    Operator-behaviour kills` restating the four binding stop-signals
    from v2 §11 + the anti-promise list, so they are in CRP itself
    and not just in mitigation-plan / decisions.md.
  - **Banners on prior plan docs.** A 2–3 line "Reading order" header
    added to `v2-scaled-b2b-plan.md`, `business-viability-negative-
    study.md`, `business-viability-mitigation-plan.md`, `business-
    viability-research-notes.md`, and `decisions.md` — each routes
    the reader to CRP for code, v2 for business shape.
  - **Root `README.md`.** New "Live product roadmap" callout under
    the existing `web/` block + a `plans/` row in the layout table.
  - **`web/README.md`.** New "## Commercialization roadmap" section
    cross-linking CRP + v2 and ticking off the 12 immediate-wins
    items (all 12 landed in PR #46 / follow-ups).
  - **`IMPLEMENTATION-v2.md` archived.** `git mv`'d into
    `plans/archive-2026-05-04/` with an "Archived 2026-05-11" banner.
    It was the parallel B2C micro-SaaS / Render Pro / $29-one-time
    track from mitigation-plan §16. CRP follows the v2-scaled-B2B
    track instead (Vercel Pro, $15 B2C + $20–25 B2B, 6-vendor cap).
    Inbound references from `v2-scaled-b2b-plan.md`,
    `business-viability-mitigation-plan.md`, and `decisions.md`
    updated to the new archive path.
  - **Resolved open design questions** (inline in CRP §12):
    - GDPR erasure vs immutable `pack_deploy.snapshot` →
      tombstone-actor policy from mitigation-plan §8; snapshot body
      stays intact, identifying fields swapped for an `erasure_event`
      pointer. `/api/data-delete` ships in v0.5.
    - Static `curriculum.ts` vs DB-backed `pack_registry` →
      `pack_registry` is a registry of *which packs exist for which
      tenant*, not the curriculum body; curriculum stays in TS until
      v0.6 when AI-generated drafts require persistence.
  - **Net answers to the operator's four questions** (now living in
    CRP §12.E): the new plan addresses all 9 fatal problems
    structurally; pilot-pricing inversion is inherited from v2 but
    not foregrounded in CRP; operator-behaviour mitigations were
    missing from CRP and have now been imported as §13; no new
    risks introduced. The B2C-only track is retired, not preserved.
  - **Doc set is now coherent.** A fresh reader hits root README →
    `web/` block → CRP §0 → §1–§11 → §12 audit → §13 kills. v1 /
    retired tracks are reachable only via the explicit banner in
    each prior doc that names them as superseded.
