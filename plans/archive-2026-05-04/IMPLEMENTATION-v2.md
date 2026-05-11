# Implementation Plan v2 (ARCHIVED 2026-05-11)

> **Archived 2026-05-11.** This was the parallel B2C micro-SaaS track
> implementing `business-viability-mitigation-plan.md` §16 (Render Pro
> $19/mo + $29 one-time + $19/mo + $149/yr pricing, ≤ 5 routes,
> 6–10 months at 12 hr/wk). It has been **retired** in favour of the
> v2-scaled-B2B shape implemented per
> [`../commercialization-readiness-plan.md`](../commercialization-readiness-plan.md)
> (CRP — Vercel Pro, $15 B2C + $20–25 B2B, 6-vendor cap, 8–12 weeks
> part-time Phase 1). Kept on disk as historical record only — do not
> follow. Operator-behaviour mitigations from §17 and the weekend
> action list from §18 are inherited by CRP §13.

> **Date.** 2026-05-05
> **Anchored to.** `plans/iterations/final-business-plan-v2.md`
> (the canonical post-iteration plan; survived 5/5 hostile-review
> streak across iters 11–15) and
> `plans/business-viability-mitigation-plan.md` (long-form).
> **Supersedes.** `plans/archive-2026-05-04/IMPLEMENTATION.md` —
> the venture-shape 18-day Phase 1 plan.
> **Parallel track.** `plans/v2-scaled-b2b-plan.md` is the
> alternative B2B-scaled-down v2; this implementation guide is
> for the **B2C micro-SaaS** track. If the operator prefers the
> B2B track, follow `plans/v2-scaled-b2b-plan.md` §IMPLEMENTATION
> instead.
>
> **Stance.** This document is concrete: dates, file paths,
> decisions in `decisions.md`, hours per task, kill-checkpoints.
> It is the *only* document the operator should keep open while
> building. Cross-references back to the canonical plan exist for
> *why*; this doc is *what + when*.

---

## 0. One-page summary

**Goal.** Ship the §16 micro-SaaS to first paying user by Month
9–14, within 12 hr/wk, without violating any of the 14 §17 kill
triggers.

**Scope.** 5 routes, 12 lessons, 6 supporting articles, calibration-
Δ feature, validator suite (25-pair regression), open-source
validator package, full legal/tax/security posture.

**Budget.** ~340–490 operator hours (28–41 weeks at 12 hr/wk =
6–10 months). Y1 cash cost: $4–6.6k. Y1 net after labour:
−$36k to −$30k (a labour-funded learning project; see §11 of
final-business-plan-v2.md).

**Hard cap.** No iteration produces work beyond what's in this
file without going through a §17b reviewer call first.

---

## 1. Pre-flight gates (Day 0–14, must pass before any code)

These are kill-or-go decisions. **Do not start building until
all five are answered.**

### G-1 — Read the final plan end-to-end

- **Action.** Read `plans/iterations/final-business-plan-v2.md`
  in one sitting (~30 minutes). Mark sections you disagree with.
- **Artefact.** Comments / annotations in a personal copy.
- **Cost.** 30 min.
- **Done when.** Operator can answer "what does the plan cap at
  12 hr/wk?", "what kills the project at Month 6?", "what is the
  founder-fit-proof?" without re-reading.

### G-2 — Day-job employment-agreement compatibility (D-006)

- **Action.** Read employment agreement for moonlighting / IP /
  non-compete clauses (iter-10 N59 / §11.9).
- **Decision.** Compatible / incompatible / requires disclosure.
- **Artefact.** `plans/decisions.md` D-006 filled in, signed and
  dated.
- **Cost.** 1–2 hours including any HR conversation.
- **Done when.** D-006 has a yes/no in writing.
- **Kill.** If incompatible (broad non-compete, broad IP
  assignment): stop. Migrate to negative study §17.2
  (consulting day-rates with disclosure).

### G-3 — Opportunity-cost answer (D-002)

- **Action.** Answer "do I believe Y2 optionality is worth $25k
  of present-value bet?" with 2–3 sentences of rationale
  (iter-01 N11 / §11.7).
- **Artefact.** `plans/decisions.md` D-002.
- **Cost.** 1 hour reflecting + writing.
- **Kill.** If "no": take side-consulting income directly.
  Do not start the build.

### G-4 — Catalog choice (D-004)

- **Action.** Decide AI-103 OR Anthropic CCA-Developer based on
  whether CCA-Developer launches by 2026-08-01 (iter-08 N54).
- **Artefact.** `plans/decisions.md` D-004 with date and
  rationale.
- **Cost.** 30 min research + 30 min decision.
- **Done when.** D-004 names one catalog and one fallback.

### G-5 — Reviewer named (D-003)

- **Action.** Pick one named reviewer (spouse, advisor,
  fractional CFO, friend) and get their verbal commitment to
  4 quarterly 60-min calls (iter-01 N7 / §17b).
- **Artefact.** `plans/decisions.md` D-003 with reviewer name.
- **Cost.** 1–2 hours including the conversation.
- **Done when.** Reviewer has the §17 kill-trigger doc and has
  scheduled the Month-3 call.

### G-6 — StickK $500 commitment device

- **Action.** Set up a StickK-style commitment: $500 to a charity-
  of-anti-choice (one the operator strongly disagrees with) that
  releases if a §17 trigger is hit and not actioned within 14
  days (iter-13 T-13.1).
- **Artefact.** Account at stickk.com or equivalent; reviewer is
  the referee.
- **Cost.** 30 min setup; $0 expected cost ($500 only released on
  failure).
- **Done when.** StickK account live, $500 escrowed, reviewer
  named as referee.

### G-7 — Hosting choice (D-005)

- **Action.** Default Render Professional ($19/mo); alternatives
  Cloudflare Pages free or Vercel Pro $20–80/mo (iter-08 N55).
- **Artefact.** `plans/decisions.md` D-005.
- **Done when.** D-005 names the host.

**G-1 through G-7 must all pass before Week 1 begins.**

---

## 2. Phase 1 — Foundations (Weeks 1–4, ~40 hours)

### Week 1: Legal + identity

- **Form Wyoming LLC** (single-member, registered agent on file).
  ~2 hours including bank-account opening.
- **Domain registration** at Porkbun or Cloudflare Registrar
  (transfer-locked, 2FA on, masked contact). Brand-first name
  per iter-04 N30 — no "ai103," "azure," "microsoft" in domain.
  ~1 hour.
- **Business email** on the brand domain via Fastmail or
  Workspace, **personal-account-backed not day-job**
  (iter-10 T-10.3). ~30 min.
- **2FA on every account** (Clerk, Stripe, Anthropic, GitHub,
  Render, Neon, registrar, email, brand socials). Hardware
  security key recommended for the highest-value accounts
  (iter-12 T-12.1). ~1 hour.
- **Insurance quote requested** from Vouch / Embroker / Foxquilt
  for general liability + cyber + E&O bundle. **Don't buy yet**
  — buy at first paying user (iter-04 N32).
- **GitHub repo** created, with `LICENSE` (Apache 2.0 for the
  validator suite once split out), `.gitignore`, `README.md`.

**Artefact.** LLC EIN + bank account, domain, email, GitHub repo
all live. Logged in `decisions.md`.

### Week 2: Repo skeleton + auth abstraction

- **Next.js / Astro app** scaffolded (whichever the operator is
  fastest with). Render or Cloudflare-Pages deploy verified
  via "Hello World."
- **Auth abstraction at `lib/auth.ts`** — never call `clerkClient`
  directly from route handlers (iter-05 N41). Generate UUIDs on
  signup, store in own `users` table, treat Clerk session as one
  identity backend.
- **Postgres** on Render (bundled) or Neon free.
- **5 placeholder routes:** `/`, `/study/[slug]`, `/dashboard`,
  `/retake`, `/account`. Each is a stub.
- **Cloudflare R2 bucket** for backups, no traffic yet.

**Artefact.** Repo at the level where `npm run dev` works and
all 5 routes return 200.

### Week 3: Validator regression test scaffold + CI/CD

- **GitHub Actions workflow:** lint + typecheck + unit-test on
  every PR; required to merge (iter-05 N39).
- **`tests/validators/` directory** scaffolded with the first
  3–5 validator test pairs (target: 25 pairs at launch per
  iter-06 N43 cut).
- **`pnpm audit` step** in the CI workflow, fails the build on
  high-severity findings (iter-12 T-12.2).
- **Lockfile pinning:** `pnpm install --save-exact` for all deps;
  no caret ranges in package.json.
- **`scripts/db-backup.sh`** — weekly cron-able `pg_dump` to R2
  bucket with versioned filename (iter-05 N38).

**Artefact.** Green CI build on a trivial PR.

### Week 4: Stripe + payment plumbing

- **Stripe account** opened; products created for the three SKUs
  ($29 one-time, $19/mo, $149/yr). Checkout-page customisation:
  refund policy displayed at moment of payment (iter-05 N40).
- **Stripe Tax enabled** from day 1 (iter-07 N49). ~$10/mo at
  Y1 scale.
- **30-day money-back policy** added to checkout AND to email
  receipt template.
- **Stripe webhook** at `/api/webhook/stripe` writing to
  `daily_metrics` table.
- **Pre-renewal reminders** configured: 7-day and 1-day before
  annual renewal (iter-14 T-14.4).
- **Paddle / Lemon Squeezy account** registered as backup but
  not wired in (per `runbooks/stripe-account-review.md`).

**Artefact.** Test-mode purchase round-trips through Stripe back
to the app. Refund flow works.

**End of Phase 1 (Week 4):** infrastructure complete, no paying
features yet. Total spend: **~40 hours**, ~$50 in setup costs
(LLC, domain, registrar). **§17b reviewer call at Month 1**.

---

## 3. Phase 2 — Content engine (Weeks 5–10, ~70 hours)

### Week 5: Content authoring pipeline

- **Local Claude Code** (Max 20x) for drafting; OR Anthropic
  API direct via `lib/llm.ts` wrapper if operator wants to
  retire the Claude-Max-TOS risk (iter-01 N10).
- **Pinned model versions** in `lib/llm.ts`:
  `claude-sonnet-4-6-20251015` for critic, `claude-haiku-4-5-20251001`
  for drafter (iter-05 N37).
- **Prompt templates** in `prompts/` directory; vendor-neutral
  shape (OpenAI-compatible) per iter-01 P11.
- **Validator pipeline** — initial 6 validators implemented; 19
  more stubbed but not promoted (iter-01 N9 step 0).
- **Lesson schema in DB:** `lessons` table with
  `derived_from_public_doc_url`, `generated_by_model`,
  `generated_at`, `validator_pass_log` — provenance ledger
  (iter-04 N31).
- **Author 1–2 sample lessons end-to-end** to validate the pipeline.

### Week 6–8: First 6 lessons + 3 articles

- **6 lessons** authored using the pipeline. ~5 hr per lesson
  draft+review = 30 hours.
- **3 supporting articles** (long-form, SEO-optimized) for topical-
  authority cluster. ~4 hr per = 12 hours.
- **`derived_from_public_doc_url`** is required for every
  question; missing field → automatic rejection.
- **No question authored from exam-attempt memory.** The operator
  has not yet taken the chosen catalog's exam (iter-04 N29).

### Week 9: Cog-sci differentiation v1 — calibration-Δ

- **Quiz UI** with predicted-confidence slider (the JOL = Judgment
  of Learning).
- **Per-quiz score** comparison: predicted vs actual.
- **Dashboard widget** showing calibration curve over time.
- **No spaced-review or retake mode** — those ship at v1.1
  (iter-06 N43 cut + iter-11 T-11.1).
- ~12 hours.

### Week 10: Six more lessons + three more articles

- 6 more lessons (30 hr) + 3 more articles (12 hr) → catalog at
  12 lessons + 6 articles total. **Done with launch content.**
- ~Actually overflows Week 10 by 1–2 weeks at the operator's
  velocity. Plan accordingly: shift to Week 11–12 if needed; do
  not extend by adding features.

**End of Phase 2 (~Week 10):** content engine running, 12 lessons
+ 6 articles + calibration-Δ feature live in dev. **§17b
reviewer call at Month 3 (≈Week 12).**

**Day-90 founder-fit gate.** Operator must have **attempted the
chosen catalog's certification** by this point (iter-03 N26 +
iter-09 T-09.2). Outcomes:
- Pass → catalog can be sold as "passing-rate-promised."
- Fail → reposition catalog as "study-along-with-me" until
  passed.
- Not attempted → §17 kill trigger fires.

---

## 4. Phase 3 — Compliance + accessibility (Weeks 11–14, ~50 hours)

### Week 11: Privacy + DSAR + cookie banner

- **Privacy policy** drafted from a multi-jurisdiction template
  covering GDPR + UK GDPR + CCPA/CPRA + VCDPA + CPA + CTDPA +
  UCPA + TDPSA + residual US-state laws (iter-04 N34 + iter-07
  N51). Submitted for $500 attorney review.
- **`/privacy/dsar` endpoint** — Notion-form-backed flow for
  data subject access requests.
- **Cookie banner** (Cookiebot free / Klaro) for residual
  non-EU traffic.
- **DPAs** from Stripe, Clerk, Anthropic, Render, Neon, PostHog
  collected and stored in `legal/dpa/`.
- **Geo-fence** at signup: non-US, non-Canada users blocked with
  a "we're not yet available in your region" message (iter-04
  N31 + iter-07 N49).
- ~14 hours.

### Week 12: Accessibility

- **Component-library audit:** confirm Radix UI / shadcn/ui usage
  across all custom components (iter-07 N50).
- **axe-core in CI** — fails the PR build on accessibility
  regressions.
- **Keyboard navigation, focus indicators, ARIA labels** —
  manual remediation pass.
- **`/accessibility` page** with public WCAG 2.2 AA conformance
  statement.
- ~12 hours.

### Week 13: Security hardening

- **Cost circuit-breaker** (iter-05 N42 / §16.13): per-tenant +
  global daily AI spend cap; alert on >2× rolling 7-day average
  via Resend transactional email.
- **Pinned model versions** verified across all LLM calls.
- **Secret rotation** policy in `runbooks/secret-rotation.md`
  (one-pager); first rotation done.
- **Sentry** wired (free tier).
- **BetterStack uptime monitor** activated ($25/mo).
- **`pnpm audit` resolver review** — apply fixes.
- ~12 hours.

### Week 14: Legal posture finalisation

- **EU AI Act transparency banner** on every lesson and quiz page
  (iter-04 N31).
- **`/model-card`** describing LLMs used, training-data assumptions,
  validator pipeline, known limitations.
- **NDA / exam-content discipline review** — every question has
  `derived_from_public_doc_url`; spot-check 100% pass.
- **Marketing copy review:** banned phrases ("exam dump," "real
  questions," "100% pass rate") absent across the site.
- **Founder identity** kept brand-first; operator's personal name
  not on `/about` (iter-04 N35).
- ~12 hours.

**End of Phase 3 (~Week 14):** legal/compliance/security
**launch-blocking** items complete. ~$700 spent (privacy attorney
review).

---

## 5. Phase 4 — Open-source validator suite (Weeks 15–17, ~30 hours)

Per iter-01 N9 + §16.11:

### Week 15–16: Code the missing 17 validators OR delete

- The README of the open-source library MUST match shipped code.
- Estimated effort: **30–60 operator hours** for 17 validator
  templates.
- If operator decides to ship only 6: cut README to 6, drop the
  others permanently. Either is honest; the lie was claiming 23
  while shipping 6.
- Tests for each validator in `tests/validators/`.

### Week 17: Public release

- `TRAINING_DATA.md` documents validator-tuning data lineage
  (operator's own notes; no scraped third-party content).
- `THIRD_PARTY_NOTICES.md` lists Anthropic SDK + deps with
  licenses.
- **Apache 2.0** license file.
- **Disclaimer:** *"This library does not include any exam
  content. It validates user-submitted MCQ format only."*
- Publish to npm + GitHub. Announce on dev.to / Hashnode.
- ~6 hours of release plumbing.

**Artefact.** Public open-source validator package, 6–23
validators shipped, README matches shipped count.

---

## 6. Phase 5 — Pre-launch validation (Weeks 18–20, ~30 hours)

### Week 18: Internal end-to-end testing

- **Operator runs the full subscriber flow** as a brand-new user:
  signup → checkout → 30-day refund → resubscribe → annual
  upgrade → cancel.
- **At least one full lesson + quiz cycle** with calibration-Δ
  data persisted across sessions.
- **Stripe test-mode chargeback** simulated; webhook responds.

### Week 19: External pre-launch review (iter-04 P13 mitigation)

- **Pay $800–1,500 for an external reviewer** (fractional CFO,
  L&D buyer-side, or paid Indie Hackers reviewer).
- **OR post the plan publicly** on /r/SaaS for free critique.
- Apply blocking findings before launch.

### Week 20: Insurance + accessibility audit + final smoke

- **Buy the insurance bundle** (~$200/mo): GL ~$50, cyber ~$50,
  E&O ~$100. Wait until first paying user expected within 30
  days.
- **Accessibility audit:** automated tools route ($0) OR external
  auditor ($1k–3k); apply fixes.
- **Final smoke test:** all 5 routes, all 3 SKUs, all kill-trigger
  scripts, all runbooks rehearsed.

**End of Phase 5 (~Week 20):** ready to launch. Total elapsed
calendar: ~5 months at 12 hr/wk; total operator hours so far:
~220 hours.

---

## 7. Launch (Week 21)

### Pre-launch checklist (must all be ✓)

- [ ] D-001 through D-006 in `decisions.md` filled in and signed.
- [ ] LLC formed, EIN issued, bank account live.
- [ ] Insurance bundle bought.
- [ ] All deck files archived in `plans/archive-2026-05-04/`.
- [ ] `final-business-plan-v2.md` re-read in past 7 days.
- [ ] Operator certification attempted (passed OR
  catalog-repositioned).
- [ ] Validator regression suite (≥25 pairs) green on main.
- [ ] axe-core green on main.
- [ ] `pnpm audit` no high-severity findings.
- [ ] Privacy policy + DSAR + cookie banner + geo-fence active.
- [ ] EU AI Act transparency banner + model card live.
- [ ] Cost circuit-breaker tested with deliberate over-budget
  request.
- [ ] DB backup restoration tested from R2.
- [ ] Operator-unavailable runbook tested (set up auto-responder
  + verify reviewer can pause signups).
- [ ] StickK $500 commitment device live.
- [ ] §17b dashboard public-read URL works.
- [ ] Reviewer Month-6 call scheduled.
- [ ] Open-source validator package published.

### Launch motion

- **Soft launch:** announce on operator's Twitter/Mastodon +
  one Reddit post in /r/<chosen-cert>. Goal: 5–15 visitors,
  1 paying user (the operator's existing study-network).
- **No press push, no Hacker News Show HN, no PR.** Y1 motion is
  SEO-only (per iter-03); the soft launch confirms the system
  works end-to-end with real money.
- **Stripe paywall enforced; no comp accounts** (iter-14 T-14.1).

### First-paying-user actions

- **Buy insurance** (already done in Phase 5).
- **Send personal thank-you email.** No automation.
- **Update §17b dashboard.**
- **Log the milestone in `decisions.md`.**

---

## 8. Post-launch operations (Months 2–18)

### Weekly cadence (~12 hr/wk)

- **Sunday evening:** weekly motivation log (1–10 score) in
  `decisions.md` (iter-13 T-13.2). Three consecutive <5 →
  stop-review.
- **2 lesson updates or 1 new lesson + 1 SEO article** per week.
- **Customer support:** ≤24h SLA on `support@` (per accessibility
  statement).
- **Cost circuit-breaker dashboard:** verify daily AI spend < cap.
- **Stripe + Sentry + BetterStack triage:** ~30 min.

### Monthly cadence

- **§17 trigger self-review** (informal; reviewer call quarterly).
- **`pnpm audit` + Dependabot review** (iter-12 T-12.2).
- **MRR + cost-basis dashboard refresh.**
- **One guest post or one linkable-asset published.**

### Quarterly cadence (§17b reviewer call)

Each call covers:
- §17 kill-trigger review (read aloud).
- Live MRR + cost dashboard walk-through.
- Link-rot scan (`lychee` on `derived_from_public_doc_url`)
  (iter-10 T-10.1).
- Content-freshness audit (Skills Measured outline diff)
  (iter-10 T-10.2).
- Stripe chargeback ratio.
- Insurance policy renewal status.
- Tax nexus status across US states (iter-07 N49).
- axe-core regression run.
- Quarterly secret rotation
  (ANTHROPIC, STRIPE, CLERK keys).
- DPA verification.
- Founder mood (3-month rolling motivation log average).
- One review-free week scheduled before next call (iter-07 N53).

### Annual cadence

- Privacy-policy attorney review (~$500).
- LLC annual filing (~$50–200 depending on state).
- Insurance renewal.
- Re-read `final-business-plan-v2.md` end-to-end.
- Re-read `IMPLEMENTATION-v2.md` (this doc) and revise based on
  what was learned.

---

## 9. v1.1 (Month 4–5 post-launch, ~30 hours)

Per iter-06 N43 cuts deferred:

- **Spaced-review controls** at `/dashboard`.
- **Retake mode** at `/retake` — failed-exam recovery flow.
- **Subscription pause** (1–3 months; iter-14 T-14.3) — reduces
  involuntary churn ~15%.
- **Validator regression suite** expanded to 50–100 pairs.
- **Public model card** (deferred per iter-06 N43; was
  launch+30 days).

---

## 10. Kill checkpoints (mapped to §17)

| Date | Checkpoint | Pass criteria | Failure response |
|---|---|---|---|
| Day 14 | G-2 employment-agreement | Compatible / disclosed | Stop. Negative-study §17.2. |
| Day 30 | LLC formed | EIN + bank account live | Stop. Plan needs entity-shield. |
| Day 90 | Operator certification | Attempted (pass OR repositioned) | Stop OR reposition. |
| Month 6 | First paying user | MRR ≥ $19 AND organic SE volume ≥ 200/mo | Stop. Migrate to §17.2. |
| Month 6 | Catalog demand | AI-103 search volume ≥ 200/mo | Pivot catalog within 30 days OR stop. |
| Month 6 | CCA-F prep | At 800/1000 by 2026-11-05 | Stop (founder-fit-proof failed). |
| Month 9 | Revenue ramp | MRR ≥ $200 | Stop or radically simplify. |
| Month 12 | Revenue ramp | MRR ≥ $500 + organic search ≥ 500/mo | Stop. Migrate to §17.2. |
| Month 18 | Revenue ramp | MRR ≥ $2,000 | Stop. Migrate to §17.2. |
| Ongoing | AI cost ratio | < 30% of MRR for 2 consecutive months | Raise prices or stop. |
| Ongoing | Operator hours | ≤30 hr/wk for 2 consecutive months | Stop. Side-bet shape failed. |
| Ongoing | Spouse / family signal | "Is this still healthy?" | Treat as P0; pause. |
| Ongoing | Catalog retirement announced | New catalog decided in 30 days | Decide or wind-down per §16.16. |

Each failure has a documented response. The reviewer reads them
aloud quarterly per §17b.

---

## 11. File / folder layout (target end-of-Phase-5)

```
.
├── README.md                     # public; v1 lander summary + link to /
├── LICENSE                       # Apache 2.0 for OSS validator exports
├── package.json                  # exact-version pinned deps
├── pnpm-lock.yaml                # committed
├── app/                          # Next.js app router (or Astro pages/)
│   ├── page.tsx                  # /
│   ├── study/[slug]/page.tsx     # /study/[slug]
│   ├── dashboard/page.tsx        # /dashboard
│   ├── retake/page.tsx           # /retake (v1.1)
│   ├── account/page.tsx          # /account
│   ├── api/
│   │   ├── webhook/stripe/route.ts
│   │   ├── llm/route.ts          # gated by cost circuit-breaker
│   │   └── privacy/dsar/route.ts
│   ├── privacy/page.tsx
│   ├── accessibility/page.tsx
│   └── model-card/page.tsx
├── lib/
│   ├── auth.ts                   # auth abstraction (Clerk migration-safe)
│   ├── llm.ts                    # LLM provider abstraction (OpenRouter-shape)
│   ├── stripe.ts                 # Stripe SDK wrapper
│   ├── validators/               # quality-validator suite (OSS-able)
│   └── cost-cap.ts               # circuit-breaker
├── prompts/                      # vendor-neutral prompt templates
├── tests/
│   ├── validators/               # ≥25 prompt+expected pairs
│   └── ui/                       # axe-core regression
├── db/
│   └── migrations/
├── scripts/
│   ├── db-backup.sh              # weekly cron
│   └── content-freshness-diff.sh # quarterly
├── content/                      # 12 lessons + 6 articles
│   ├── lessons/
│   └── articles/
├── legal/
│   ├── privacy-policy.md
│   ├── tos.md
│   └── dpa/                      # signed DPAs from sub-processors
├── public-quality-log/           # incident log (per quality-incident runbook)
├── incidents/                    # general incident log
├── decisions.md                  # operator's decision log
└── plans/                        # current dir; canonical plan + iterations + runbooks
```

The repo is intentionally flat. No microservices, no monorepo, no
separate admin app.

---

## 12. Cost projection by phase

| Phase | Weeks | Operator hr | Cash spend | Notes |
|---|---|---|---|---|
| Pre-flight gates | 0–2 | 5–10 | $0 | Reading + decisions |
| Phase 1 — Foundations | 1–4 | 40 | $50 (LLC, domain) | Insurance not yet bought |
| Phase 2 — Content engine | 5–10 | 70 | $100 (Anthropic API for content drafting) | Paid-but-deferred Stripe |
| Phase 3 — Compliance | 11–14 | 50 | $500 (privacy attorney) | |
| Phase 4 — OSS validator | 15–17 | 30 | $0 | Reputation asset |
| Phase 5 — Pre-launch | 18–20 | 30 | $800–1,500 (external reviewer) + $200/mo insurance starts | First paying user expected |
| Launch | 21 | 5 | $0 | Soft launch only |
| Ongoing post-launch | 22+ | 12/wk | $374–552/mo | Per §16.5 |

**Total launch-blocking operator hours: ~225–235** (consistent
with iter-06 N43 estimate of 340–490 if SEO content keeps
extending; the launch-blocking subset is tighter).

---

## 13. Decisions.md scaffold

`plans/decisions.md` should accumulate:

- D-001 — plan track choice (already filled).
- D-002 — opportunity cost (Day 12).
- D-003 — reviewer name (Day 31).
- D-004 — catalog choice (Day 14).
- D-005 — hosting (Day 14).
- D-006 — employment-agreement compatibility (Day 19).
- D-007 — first paying user logged (Month 6–14).
- Model swap log (each Anthropic deprecation).
- Kill-trigger response log (each §17b call).
- Weekly motivation log (Sundays).

---

## 14. What this implementation does NOT include

- **B2B admin app, SME review queue, multi-tenant RLS, custom
  catalogs.** Those are the venture-shape plan
  (`plans/archive-2026-05-04/IMPLEMENTATION.md`) — gone.
- **Cohort routes, peer-comparison, leaderboard, voice authoring,
  worked-example fading, JOL slider trend lines, SCORM/xAPI export,
  Inngest pipelines, embedding dedup, Opus critic, advanced
  observability dashboards.** All Year-2+ candidates conditional
  on Year-1 paying revenue.
- **Paid acquisition.** No Google Ads, no Reddit Ads, no LinkedIn
  outbound (iter-02 N18).
- **Free tier.** One sample lesson per pack on the marketing site
  is a marketing surface, not a free product (iter-02 N20).
- **YouTube channel** in Year 1 (iter-03 N25). Lesson companion
  videos for embedding only.
- **EU customers** (iter-04 N31 / iter-07 N49). Geo-fenced.
- **Crunch weekends.** Hard-capped at 12 hr/wk (iter-06 N44).

---

## 15. Cross-references

- **Final business plan:** `plans/iterations/final-business-plan-v2.md`
- **Long-form canonical plan:** `plans/business-viability-mitigation-plan.md`
- **Original venture-shape (archived):** `plans/archive-2026-05-04/IMPLEMENTATION.md`
- **Parallel B2B-scaled-down v2:** `plans/v2-scaled-b2b-plan.md`
  (alternative track; if B2B is preferred over B2C, follow that
  doc instead of this one)
- **Iteration ledger:** `plans/iterations/ledger.md`
- **Negative study:** `plans/business-viability-negative-study.md`
- **Decisions log:** `plans/decisions.md`
- **Runbooks:** `plans/runbooks/`
  - `claude-max-tos-shift.md`
  - `clerk-migration.md`
  - `data-breach.md`
  - `db-restore.md`
  - `model-deprecation.md`
  - `operator-unavailable.md`
  - `quality-incident.md`
  - `stripe-account-review.md`

---

## 16. Last word

If items 1–G7 (pre-flight gates) take more than two weekends, the
operator is already too busy for this plan; that itself is a
signal, and §17 stop applies. Iterate on this implementation
plan based on what is learned from actual building — but never
add scope without going through a §17b reviewer call first.
