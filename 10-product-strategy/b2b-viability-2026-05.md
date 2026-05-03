# B2B viability — the cca-f-prep learning shell across topics

> Status: strategy note, 2026-05-03. Branch: `claude/knowledge-extraction-smes-fubCV`.
> Author: this is a written-by-Claude analysis grounded in the actual code in
> [`web/`](../web/) and the conventions in [`CLAUDE.md`](../CLAUDE.md). Every
> intervention names a file or script path so a follow-up PR can pick it up
> directly.

## Executive summary

The repo started life as exam-prep content for one cert. The product surface
underneath it — the Next.js shell in [`web/`](../web/) — has quietly become a
**content-agnostic learning platform**: three packs ship today (`cca-f-prep`,
`sample-pack`, `sewing-beginners`); the
[`web/content-packs/README.md`](../web/content-packs/README.md) explicitly
names `learn-french` and `leadership-conflict` as future-pack examples. The
swap mechanism (one env var → parallel Vercel deploys) makes it cheap to
spin up a per-customer site.

If we want to sell this as a B2B learning tool across arbitrary topics, the
hard problems are not engineering, they are behavioral and operational:

1. **Initial adoption psychology.** Why does a new user open it twice?
2. **Stickiness.** Why are they still here on day 14?
3. **SME knowledge extraction.** How do we get content out of experts who
   can't articulate, won't share, or have no time?
4. **Content freshness.** How do we know a lesson has aged out before a
   learner does?
5. **Content validation.** How do we catch the spoiler-leak / letter-bias /
   contradiction class of bugs before they ship?

Thesis per blocker: small, ship-this-week interventions exist for all five
that don't need a server backend. The deeper plays (auth, telemetry, SME
authoring UI, scheduled freshness checks) need infrastructure investment —
but the path is incremental, not a rewrite.

## Current product baseline

| Capability | Where it lives | Notes |
| --- | --- | --- |
| Content-pack contract | [`web/src/content/pack-types.ts`](../web/src/content/pack-types.ts), [`web/src/content/curriculum-types.ts`](../web/src/content/curriculum-types.ts) | `Section → Concept → Lesson + Quiz`, plus optional `MockExam[]`. |
| Pack swap (build-time) | [`web/content-packs/README.md`](../web/content-packs/README.md) | `NEXT_PUBLIC_CONTENT_PACK_ID=<id>` resolves the `@active-pack` alias. Tree-shakes inactive packs. |
| Per-user progress | [`web/src/lib/progress-store.ts`](../web/src/lib/progress-store.ts), [`web/src/lib/games-store.ts`](../web/src/lib/games-store.ts) | `localStorage` only. No server, no signup. Per-pack namespaced key. |
| Mastery taxonomy | `MasteryLevel[]` in `pack-types.ts` | Pack-overridable. Default 5-level ladder. `countsAsMastered`, `isUnderwhelm` flags drive recommendations. |
| Engagement layer | [`web/src/components/games/time-trivia/`](../web/src/components/games/time-trivia/), [`web/src/components/games/flashcard-battle/`](../web/src/components/games/flashcard-battle/), [`web/src/components/section/games-catalog.ts`](../web/src/components/section/games-catalog.ts) | Two live games, four planned. |
| Auto-derivation | [`web/src/lib/flashcard-derive.ts`](../web/src/lib/flashcard-derive.ts) | Concept → up to 6 flashcards from `keyPoints`, `simplified.oneLiner`, and `simplified.analogy`. Stable IDs for SR keying. |
| Recommendation engine | [`docs/curriculum.js`](../docs/curriculum.js), [`docs/app.js`](../docs/app.js) | Mastery 0–4, 60% quiz / 70% section-test pass-gates. |
| Pedagogy framing | [`00-academy-basics/`](../00-academy-basics/) | Knowles, Bloom (revised), Cognitive Load Theory, Bjork desirable difficulty, Ericsson deliberate practice — all already in the repo's vocabulary. |
| External review | [`.github/workflows/codex-review.yml`](../.github/workflows/codex-review.yml), [`.github/workflows/codex-review-recheck.yml`](../.github/workflows/codex-review-recheck.yml) | Codex reviews every PR, labels `codex-blockers` when material findings exist. Recheck cron retries deferred reviews every 2h. |
| Pack-swap smoke test | [`web/scripts/swap-smoke.sh`](../web/scripts/swap-smoke.sh) | Iterates every pack end-to-end (lint + test + build). Structural only — does not check pedagogical quality. |
| Observed quality bugs | [`CLAUDE.md`](../CLAUDE.md) — `letter-bias-2026-05`, `diagnostic-01` spoiler regression | Real, dated failure modes — the canonical bugs the validator must catch. |

What is **not** built today: any auth, any tenancy model, any server-side
analytics, any SME-facing authoring UI, any decay/freshness signal, any
automated content-quality linter beyond structural conformance.

The next five sections walk each blocker, name what we have, where the gap
is, and what to build. Interventions are tagged **S** (one PR, no backend),
**M** (one sprint, may need a script or schema field), **L** (needs auth
and/or backend).

---

## 1. Initial adoption psychology

### Frame
Fogg's behavior model: B = M·A·P. A new B2B user has **low motivation** (their
manager told them to open it), **unknown ability** (they've never used the
product), and a **prompt** that is whatever email or Slack link they clicked.
The first session has to close the M-A-P loop within minutes or the second
session never happens. Knowles adds: adult learners need *agency* and
*relevance to their problem* — generic tutorials get bounced.

### What we have
- Zero-friction entry: no signup wall (localStorage progress works
  anonymously). This is a real adoption asset; do not lose it when adding
  auth later.
- "Easy" depth toggle on lessons (`Lesson.simplified` in
  `curriculum-types.ts`) — already an ability-lowering surface.
- Per-pack theme + branding so a B2B tenant's site looks like *theirs*, not
  ours. Reduces perceived effort to "use the corporate tool".

### Gaps
- No first-run experience. The dashboard shows the same surface to a
  brand-new user as to a 30-day veteran.
- No "time to first value" measurement; we don't know if anyone is winning
  in the first session.
- No starter-path heuristic. The recommendation engine assumes the user has
  *some* progress — cold start is unguided.
- No pack-configurable "why you should care" intro.

### Interventions
- **S** — First-run sheet. Single component on the dashboard route that
  triggers when `progress` is empty: pick a goal, pick a 10-minute starter
  concept (pack-configured), commit to one quiz. The "first win" is one
  correct quiz answer in under 90 seconds. This is pure UI; reuse the
  existing recommendation banner styles.
- **S** — Per-pack `pack.config.starterConceptId` field on `PackConfig` so
  each B2B customer picks the strongest entry concept for their topic.
  Default falls back to "first concept of section 1".
- **M** — A/B-able onboarding shape. Add `pack.config.onboarding` block
  (`firstRunSheet: boolean`, `goalDatePrompt: boolean`, `starterPath:
  "guided" | "free"`). Lets us experiment without per-customer code.
- **L** — Telemetry beacon (opt-in, off by default, B2B-tenant-gated):
  `{first concept opened, time-to-first-correct-answer, day-1 return,
  day-7 return}`. Without this we are guessing at adoption.

### How we'd know it worked
- Day-1 → day-7 return rate on a per-pack basis (telemetry, L-effort).
- "First correct answer" event firing within session 1 for >70% of new
  users.
- Manual proxy until telemetry: in pilots, ask the customer's training
  lead for the per-user activity export from their LMS / SSO logs.

---

## 2. Stickiness / retention

### Frame
Self-Determination Theory (Deci & Ryan): autonomy, competence, relatedness.
Streaks alone deliver competence + a coercive form of motivation; without
autonomy and relatedness they burn out. Bjork's *desirable difficulty*: the
review needs to be hard enough to feel earned. Eyal's hook loop (trigger →
action → variable reward → investment) is the right shape, but *only when
the reward is genuine learning progress*, not vanity points.

### What we have
- Streak tracking + best-mock-score on the dashboard
  ([`web/src/lib/progress-store.ts`](../web/src/lib/progress-store.ts)).
- Mastery 0–N taxonomy with `isUnderwhelm` and `countsAsMastered` flags
  (real competence signal, not just XP).
- Two live games — Time Trivia and Flashcard Battle — mounted at
  `/<packId>/section/[id]/games/[gameId]`.
- Recommendation banner ("drill this", "take section test", "next lesson")
  surfacing from progress + mastery state.

### Gaps
- No spaced-repetition queue. [`docs/app.js`](../docs/app.js) explicitly
  flags this as a roadmap item. Without it, mastered concepts decay
  silently.
- No re-entry mechanism. PWA manifest is wired but push notifications are
  not.
- No "since you last visited" surface. The dashboard does not differentiate
  a return visit from a fresh one.
- No social / cohort layer (and probably should not be the first move —
  most B2B learning customers want individual progress, not leaderboards).

### Interventions
- **S** — "Since last visit" diff card on the dashboard. Reads
  `progress.lastVisitedAt` (add field), shows: new content in this pack,
  decayed concepts, recommended 5-minute review.
- **M** — Spaced-repetition queue. Reuse
  [`web/src/lib/flashcard-derive.ts`](../web/src/lib/flashcard-derive.ts)
  to source cards (it already keys deterministically by concept id, which
  is exactly what an SR scheduler needs). SM-2 or FSRS scheduler in
  `web/src/lib/sr-queue.ts`. Surface as a "5-minute review" CTA on the
  dashboard.
- **M** — Pack-configurable cadence: `pack.config.cadence = { dailyMinutes:
  10, sessionPresets: [5, 10, 25] }` so different B2B customers can tune
  the ritual. Some customers want 5-min daily; others want 25-min weekly.
- **L** — PWA push notifications, opt-in, gated behind `pack.config.cadence
  .enableReminders`. **Behavioral-psych guardrail:** at most one prompt per
  day, snooze-able, never streak-shaming language. The point is to support
  intention, not coerce.

### How we'd know it worked
- 14-day retention rate (telemetry).
- Session-2 occurrence within 72h of session-1.
- Spaced-repetition queue size staying below ~30 cards per active user
  (proxy for "they're keeping up").

---

## 3. SME knowledge extraction

### Frame
Polanyi: *"we know more than we can tell."* Tacit knowledge does not
volunteer itself. COM-B (Michie et al.) splits the intervention surface
into capability, opportunity, motivation — you have to diagnose which is
missing before you choose a tool.

Three SME archetypes, one mode each:

| Archetype | What's missing (COM-B) | Best mode |
| --- | --- | --- |
| Can't articulate | Capability (psychological) | Scaffolded interview — Claude leads with structured questions, drafts, the SME corrects. |
| Won't share | Motivation | "Redact and review" — agent drafts from existing artifacts; SME *edits* a draft (low perceived cost vs. authoring from scratch). |
| No time | Opportunity | Ambient capture — Loom/transcript/doc-link goes in, draft comes out asynchronously. |

### What we have
- The authoring path is "edit `curriculum.ts`" — a TypeScript object
  literal. See [`web/content-packs/README.md`](../web/content-packs/README.md)
  § "Authoring a new pack". This is a hard wall for any non-engineer SME.
- The CLAUDE.md `2026-05-02 Academy-content scrub` entry proves the
  template-and-fill auto-author pattern works at scale (38 concepts, 8
  section tests, mined from `00-academy-basics/notes/0X-*.md`).

### Gaps
- No SME-facing UI. SMEs cannot author without a developer in the loop.
- No interview agent / prompt scaffold. The Academy-scrub used ad-hoc
  prompting; the protocol is undocumented and unrepeatable.
- No artifact-ingestion. We can't point an agent at a Confluence space, a
  Slack export, or a 30-min Loom and get a draft pack back.
- No "draft → review" surface. Even if we generated a draft, an SME has
  nowhere ergonomic to review-and-correct it short of editing TypeScript.

### Interventions
- **S** — Codify the SME extraction protocol *now* as a shippable doc.
  See appendix A below — a structured Claude-prompted interview script
  that produces a draft `curriculum.ts` from a 30-minute SME conversation.
  Anyone with Claude access can run this today; no product changes
  required.
- **M** — `scripts/sme-import/` CLI. Takes a transcript (markdown, .vtt,
  pasted text) and an optional pack skeleton, emits a draft pack folder
  (sections + concepts as stubs, mirroring the Academy-scrub auto-author
  pattern). Wire to [`web/scripts/swap-smoke.sh`](../web/scripts/swap-smoke.sh)
  so the draft is type-checked end-to-end before review.
- **M** — Three intake modes wrapping the same `sme-import/` core:
  - `sme-import interview --transcript <path>` — full guided interview to
    drafted pack.
  - `sme-import redact --source <doc-or-folder>` — ingest existing
    artifacts (markdown, PDFs), emit a draft for SME edit.
  - `sme-import ambient --url <loom-or-doc>` — fetch + transcribe + draft.
- **L** — SME-facing web authoring view, gated behind future B2B auth.
  Wraps `curriculum.ts` shape with a form UI + a "Draft with Claude"
  button. Eliminates the TypeScript wall entirely. Save-to-PR via GitHub
  API so the codex review pipeline still gates merges.

### How we'd know it worked
- Time-to-first-pack for a non-engineer SME drops from "infinite" (today —
  they cannot do it) to under 8 hours of SME time for a 20-concept pack.
- Codex review pass-rate on auto-drafted packs (target: >70% of drafts
  pass codex review without human re-edits).

---

## 4. Keeping content fresh

### Frame
Content half-life varies by topic. A regulatory-compliance pack stales in
months; a sewing pack stales in years. Three things have to exist for
freshness to work: **signals** (how do we detect drift?), **triggers**
(what kicks off a refresh?), and **ownership** (who fixes it?).

The CCA-F pack tracks this manually via the `Coherency review log` in
[`CLAUDE.md`](../CLAUDE.md) (entries dated 2026-05-02). That works for one
pack with one author; it does not scale to a B2B catalog.

### What we have
- Codex review on every PR ([`.github/workflows/codex-review.yml`](../.github/workflows/codex-review.yml))
  — catches drift *when humans push*, not when the source material changes.
- Codex recheck cron ([`.github/workflows/codex-review-recheck.yml`](../.github/workflows/codex-review-recheck.yml))
  — proves the "scheduled-job + GitHub Action" pattern works in this repo.
- Per-section `sourceCourse` field already in `curriculum-types.ts` (line
  144) — partial pointer, but no URL, no last-reviewed date.

### Gaps
- No `concept.lastReviewed` timestamp.
- No `concept.sourceUrl` pointer to the upstream source of truth.
- No diff-against-source job.
- No decay-aware recommendation. A concept reviewed in 2024 looks
  identical to one reviewed last week.
- No content owner mapping — when drift is detected, no human is
  responsible by name.

### Interventions
- **S** — Add optional `lastReviewed` (ISO date) and `sourceUrl` fields to
  `Concept` in `curriculum-types.ts`. Render a small "reviewed YYYY-MM"
  badge on lessons. Pack-configurable threshold
  (`pack.config.freshness.staleAfterDays`) gates a "needs review" badge.
- **M** — `.github/workflows/freshness-check.yml`. Scheduled (weekly).
  For each concept with a `sourceUrl`, fetch the source, hash-diff
  against a cached snapshot in `freshness-cache/`. When materially
  changed, open a PR labeled `freshness-drift`. Mirrors the
  [`codex-review-recheck.yml`](../.github/workflows/codex-review-recheck.yml)
  cron pattern.
- **M** — Decay-aware recommendation. Extend the recommendation engine
  ([`docs/app.js`](../docs/app.js)) to surface "review this stale concept"
  alongside drill / lesson / quiz recommendations.
- **L** — Per-pack content-owner map in `pack.config.owners` — section
  id → owner identifier (GitHub handle or email). Freshness PRs auto-
  assign the right owner via the GitHub Actions API. Closes the
  ownership loop.

### How we'd know it worked
- Median age of in-production concepts stays under
  `pack.config.freshness.staleAfterDays`.
- Freshness-drift PRs land within N days of opening (per-pack SLA).
- Zero "this lesson contradicts our current docs" customer reports.

---

## 5. Content validation

### Frame
Validation is a stack. Kirkpatrick L1 (do learners react well?) and L2 (do
they actually learn?) are the *outcome* signals; before you ever get to
L1 you need authoring-quality gates. The `letter-bias-2026-05` and
`diagnostic-01` spoiler regression entries in
[`CLAUDE.md`](../CLAUDE.md) are real, dated failures — these are the
canonical bugs any validator must catch.

### What we have
- Codex review on PR (`.github/workflows/codex-review.yml`) — catches
  pedagogical clarity, distractor plausibility, principle-naming.
- Pack-swap smoke test
  ([`web/scripts/swap-smoke.sh`](../web/scripts/swap-smoke.sh)) —
  structural conformance only.
- Vitest + Playwright suites for the shell UI.
- Mastery taxonomy with `isUnderwhelm` + `countsAsMastered` (some
  validation is encoded in the contract itself — packs cannot ship a
  mastery ladder where no level "counts as mastered").

### Gaps
- No automated check for: correct-letter distribution, spoiler leaks,
  duplicate questions, missing `principle` field, Bloom-tag distribution,
  reading-level drift, broken pass-gates, MCQ option-length leaks
  (longest-option-is-correct bias).
- No real-user-correct-rate signal (Kirkpatrick L2). Without telemetry
  we cannot detect "everyone gets question 7 right" (too easy / leaked
  answer) or "nobody gets question 12 right" (broken or under-specified).

### Interventions
- **S** — `scripts/validate-pack.ts` static analyzer. Runs in CI under
  `npm run validate:packs`. Reports:
  - Correct-answer letter distribution per quiz / per pack (flag >70%
    concentration on any one letter — the `letter-bias-2026-05` bug).
  - Example-answer-string vs. real-answer-key match (the
    `diagnostic-01` spoiler regression).
  - `principle` field presence on every MCQ.
  - Question-text duplicates across the pack.
  - Bloom-tag presence/distribution for academic packs.
  - MCQ option-length variance (correct option significantly longer is a
    classic test-writing leak).
  Wire into `swap-smoke.sh`.
- **M** — `.github/codex-rubric-learning.md` — a domain-specific rubric
  that the codex-review workflow loads when reviewing pack PRs. Catches
  what static analysis can't: ambiguous distractors, stem leakage,
  conflicting concepts.
- **M** — Per-quiz `userCorrectRate` telemetry (opt-in, B2B-tenant-gated).
  Questions with <20% or >95% correct rate get auto-flagged for review.
  Real Kirkpatrick L2 signal.
- **L** — Validation-report route in the web app, gated to owners/admins,
  surfaces validator findings + decay signals + low-quality questions in
  one place. Authoring loop closes inside the product.

### How we'd know it worked
- Letter distribution on every shipped pack stays inside [25%, 50%] per
  letter (tight enough to prevent positional learning, loose enough that
  packs aren't forced into contortions).
- Zero spoiler regressions across all packs in CI for 90 consecutive
  days.
- For packs with telemetry: no question persistently outside [20%, 95%]
  user-correct-rate without a flagged review.

---

## What B2B productization actually requires

The four interventions tagged **L** above all assume the same four pieces
of infrastructure we don't have today:

1. **Auth + tenancy.** Today: localStorage only (single-tenant by design).
   For B2B: at minimum SSO (Google, Microsoft, Okta) and per-tenant data
   isolation. The pack-namespaced storage keys already in
   [`web/content-packs/README.md`](../web/content-packs/README.md) §
   "Storage isolation" give us the *naming convention*; the auth + sync
   layer is new.
2. **Per-tenant analytics backend.** Minimum signals: time-to-first-value,
   day-1 / day-7 / day-30 retention, per-question correct-rate. Without
   these we are guessing at every intervention's effect.
3. **Pack registry + lifecycle.** Today: filesystem under
   `web/content-packs/`. For B2B: versioned packs (semver), `lastReviewed`
   metadata, owner mapping, freshness signals. The cross-repo extraction
   recipe at the bottom of `web/content-packs/README.md` already
   anticipates this — it just needs version pinning and a publish
   workflow.
4. **SME authoring path.** Today: TypeScript. For B2B: a form UI on top
   of `curriculum.ts` shape + a "Draft with Claude" button + a "Save as
   PR" path so codex review still gates merges. This is the single
   biggest UX gap for non-technical customers.

None of these is a rewrite. Each is one quarter of focused work *if* a
B2B customer commits to a pilot.

## Recommended sequencing

A 90-day phased rollout, weighted to "ship something every two weeks":

- **Days 0–30 (no backend).** Ship S-effort items in §1 (first-run sheet,
  `starterConceptId`), §2 ("since last visit" card), §4 (`lastReviewed` +
  `sourceUrl` fields with badge), §5 (`validate-pack.ts`). Publish
  Appendix A as a standalone protocol any B2B prospect can use to draft
  their first pack.
- **Days 30–60 (single sprint of M-effort).** Spaced-repetition queue;
  `sme-import/` CLI in three modes; `freshness-check.yml` workflow;
  `codex-rubric-learning.md`; pack-configurable cadence + onboarding.
- **Days 60–90 (B2B pilot prerequisite).** Auth + per-tenant analytics
  backend; PWA push; SME-facing authoring view (read-only first, then
  editable); pilot one paying B2B customer end-to-end. The Kirkpatrick L2
  loop closes here — every previous decision becomes measurable.

The order is deliberate: every "L" intervention sits on top of work the
"S" + "M" interventions already validate. We do not commit to auth + a
backend until the cheap experiments have shown which retention and
extraction levers actually move learner behavior.

---

## Appendix A — SME extraction protocol (shippable today)

A 30-minute structured Claude-led interview that produces a draft
`curriculum.ts` skeleton. Use Claude's longest-context model (Opus 4.7
1M is what this repo defaults to). Run as a single conversation; do not
rely on memory across sessions.

### Inputs
- One SME, on a call (record the call) or async via a transcript.
- One existing pack as a structural template (the `cca-f-prep` or
  `sewing-beginners` pack — same shape, different topic, helps Claude
  match the contract in `web/src/content/curriculum-types.ts`).

### Prompt scaffold
1. **Frame the SME** (90 seconds): "We're building a learner-facing
   course on \<topic>. Your job is to be the source of truth — not to
   write it. I'll ask questions; Claude will draft; you'll correct. We
   need 6–10 sections, each with 3–5 concepts. Plan: 30 minutes."
2. **Top-down extraction** (12 minutes): "What are the 6–10 things a
   learner has to be able to *do* by the end of the course?" — these
   become section titles. Reject "know about X"; insist on observable
   verbs (Bloom: Apply / Analyze / Evaluate). Push back when an SME
   gives a Bloom-Remember answer ("they should know what an LLM is")
   and reframe to Apply ("they should be able to choose between two
   models for a task").
3. **Per-section depth** (12 minutes, ~90s each): "For section *N*,
   what's the *one* thing a learner most often gets wrong?" — captures
   the pitfall that becomes the canonical concept's `Lesson.pitfalls[]`.
   "Give me one analogy that makes section *N* click" — drives
   `Lesson.simplified.analogy`. "Give me one example you've seen in
   the wild" — drives `Lesson.examples[]`.
4. **Validation pass** (5 minutes): Read the draft section list back
   to the SME. Anything they hesitate on for >5 seconds is
   under-specified — flag it for follow-up. Anything they correct is a
   captured insight; verbatim into the lesson.

### Outputs
- A draft `curriculum.ts` skeleton (sections + concept stubs with
  titles + `simplified.oneLiner` + one `pitfall` each). Quizzes are
  empty stubs at this stage — they get drafted from the lessons in a
  follow-up pass once the SME has validated the skeleton.
- A `notes/sme-interview-<date>.md` capturing direct SME quotes for
  later citation. (This is the same shape as
  [`00-academy-basics/notes/`](../00-academy-basics/notes/).)

### Why this works
- **Capability:** The SME is asked for examples and pitfalls (concrete,
  recallable) instead of definitions (abstract, hard for tacit experts).
- **Motivation:** The SME *edits a draft*, not authors from scratch —
  perceived cost drops by an order of magnitude (Kahneman: editing is
  loss-aversion-friendly).
- **Opportunity:** 30 minutes is a meeting that fits in a day.
- **Validation:** the draft is type-checked end-to-end via the existing
  `web/scripts/swap-smoke.sh` before any human review.

When `scripts/sme-import/` ships (intervention §3.M), this protocol
becomes the input format — the CLI consumes the transcript + a pack
skeleton and emits the draft pack folder mechanically.

---

## Open questions

These are decisions a human (not Claude) should make before we commit
engineering to any **L** intervention:

- Pricing model: per-seat, per-pack, per-tenant? Affects whether we
  build per-pack or per-tenant analytics first.
- Hosting model: parallel Vercel projects (today's recipe) vs. single
  multi-tenant deployment? Affects auth + storage architecture.
- Authoring ownership: does the customer's SME own the pack repo, or do
  we host packs for them? Affects whether the SME authoring UI ships
  on our domain or theirs.
- Telemetry: opt-in vs. opt-out at the tenant level? Affects every
  measurement above.
