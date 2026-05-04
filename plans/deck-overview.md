# Content Pack Management Platform — Deck

> Slide-style summary of the build plan. Designed for a 10-minute walk-through with a non-technical stakeholder. Slide breaks are marked by `---`.
> Companion docs: [`./content-pack-management-plan.md`](./content-pack-management-plan.md) (detailed plan), [`./deck-investor.md`](./deck-investor.md) (investor/advisor angle), [`./deck-b2b-prospect.md`](./deck-b2b-prospect.md) (B2B sales angle), [`./deck-collaborator.md`](./deck-collaborator.md) (technical collaborator angle).

---

# Content Pack Management Platform

A focused learning platform for individuals and companies.
Built in two phases — de-risk the AI cost before paying for AI.

*Branch: `claude/content-pack-management-plan-gO7ys`*

---

## The problem

- AI-generated study content is everywhere — and most of it is **bad**.
- Common failure modes are predictable: biased answer keys, fabricated facts, weak distractors, no source justification.
- Buyers (especially enterprises) won't trust AI lessons that no human reviewed.
- Building this **with the AI cost turned on from day 1** is how startups burn $50k before learning whether anyone wants the product.

---

## The product, one paragraph

A learning platform with two modes:

- **B2C:** anyone signs up, picks a catalog, learns at their own pace.
- **B2B:** companies buy access for staff; their internal expert reviews material before it goes live.

AI drafts the content; deterministic validators catch known failure modes; a stronger AI reviewer audits the drafter; a **human always approves before publish**.

---

## Two markets, one product

| | B2C | B2B |
|---|---|---|
| **Who** | Self-directed learners (cert candidates, hobbyists) | SMB and mid-market HR / L&D |
| **Pricing intuition** | $9/mo Pro (free tier with 5 catalogs) | $5–15 per learner per month, $100/mo platform minimum |
| **Why they buy** | Quizzes that aren't trash; ability to request topics | Curated, expert-reviewed material; SSO; usage reporting |

---

## The two-phase strategy

**Phase 1 — Proof-of-concept. Cost: ~$0/month.**

- AI authoring done by the operator inside **Claude Code locally** (paid by existing Max 20x subscription).
- Web platform stores, versions, and serves the content the operator authored offline.
- Goal: validate willingness-to-pay before any AI cost is incurred.

**Phase 2 — Commercial. Cost: ~$450–1000/month at planned scale.**

- Turn on in-app AI generation, billing, B2B controls.
- Everything from Phase 1 carries over without rewrites.

---

## Phase 1 success metric

**Paying intent — measured directly.**

- **B2B:** "Request a pilot" form on marketing site → operator follow-up → signed LOI.
  Target before Phase 2 spend: **3 signed LOIs**.

- **B2C:** "Get early access" waitlist + Stripe Payment Link for refundable $9 pre-orders.
  Target: **50 waitlisted, 10 pre-orders**.

If Phase 1 doesn't hit these, we don't spend on Phase 2. Hard gate.

---

## Phase 1 cost — essentially free

| Line | Vendor | Cost |
|---|---|---|
| Hosting | Vercel Hobby | $0 |
| Database | Neon Postgres free | $0 |
| File storage | Cloudflare R2 free | $0 |
| Auth | Clerk free | $0 |
| Email | Resend free | $0 |
| Analytics | PostHog free | $0 |
| Errors | Sentry free | $0 |
| **AI authoring** | **Claude Max 20x** | **already paid** |
| Domain | registrar | ~$1/mo |
| **Total incremental** | | **~$1/mo** |

---

## Phase 2 cost — at 100 tenants, 10k MAU, 50k generations/mo

| Line | Cost |
|---|---|
| Hosting (Vercel Pro) | $20 |
| Database (Neon Scale) | $19 |
| Auth (Clerk Pro) | $25+ |
| Job queue (Inngest Pro) | $20 |
| **AI drafter (Sonnet)** | **~$200** |
| **AI reviewer (Opus)** | **~$100** |
| Embeddings, email, errors, etc. | ~$70 |
| **Total** | **~$450–1000/mo** |

AI is the dominant line. Hard cap = per-tenant monthly token budget with UI burn meter.

---

## Pricing math at modest scale

- 1000 paying B2C learners × $9 = **$9k MRR**
- 50 B2B tenants × 50 seats × $10 = **$25k MRR**
- Combined ≈ **$34k MRR** vs ~$600/mo infra
- ⇒ **gross margin > 95%** at this scale.

The AI cost line scales with **generations**, not learners. As long as we don't regenerate per learner, margins stay healthy.

---

## What learners experience

- Sign up via email-link.
- Browse catalogs; tap a concept.
- Read short lesson; take 3-question quiz.
- Progress synced across devices.
- "Suggest a topic" button → feedback loop.
- "Report this content" button → quality signal.

Same UX in Phase 1 and Phase 2.

---

## What the operator does in Phase 1

- Open Claude Code in the project repo (paid by Max).
- Paste a knowledge file (PDF / markdown / slides as text).
- Run `/draft-topic` slash command → Claude drafts JSON.
- Local validators run automatically (catch known failure modes).
- Open admin tool → paste JSON → publish.

**~10 minutes per topic.**

---

## What changes in Phase 2

Additive on Phase 1, behind feature flags, in this order:

1. Vercel Pro (TOS compliance for paid customers).
2. In-app AI generation pipeline (Inngest + Anthropic API).
3. **Opus critiques Sonnet** drafts; answer-justification audit.
4. Confidence routing + sampled spot-checks.
5. B2B controls: SME role, two-eye gate, per-tenant catalogs.
6. Stripe billing.
7. Embedding-based suggestion dedup.
8. Post-publish quality signals → "pause-not-pull".

Nothing from Phase 1 is thrown away.

---

## Top risks & mitigations

| Risk | Mitigation |
|---|---|
| AI cost spirals | Per-tenant budget cap; UI burn meter; alerts at 80%. |
| AI hallucinations reach learners | Validators + Opus critic + answer-justification audit + post-publish signals. |
| Tenant data leak | Postgres RLS + Neon HTTP driver + integration test. |
| Enterprises won't accept AI content | B2B default = human-required; auto-publish is opt-in. |
| No revenue path validated | Phase 1's only job is to prove paying intent before Phase 2 spend. |

---

## Decision triggers

| Trigger | What flips |
|---|---|
| First paid customer / signed LOI | Vercel Hobby → Vercel Pro |
| Operator authoring backlog > 1 week | Turn on Phase 2 in-app generation |
| First B2B contract requires per-company review | Activate SME role + two-eye gate |
| 5+ enterprise deals blocked on compliance | Pursue formal SOC2 |
| First quality incident reaching learner | Switch reviewer to cross-vendor |

---

## Phase 1 timeline — ~18 working days

| Phase | Days | Deliverable |
|---|---|---|
| P1 | ~3 | Monorepo + DB + auth + storage wired |
| P2 | ~3 | Astro marketing site + LOI / waitlist / pre-order capture |
| P3 | ~4 | Learner app: catalog, lesson, quiz, progress, search |
| P4 | ~4 | Admin app: import, lint, suggestions, leads, knowledge files |
| P5 | ~2 | Operator authoring loop (Claude Code skill + validators) |
| P6 | ~2 | Verification: end-to-end + RLS + Lighthouse |

---

## What we need to start Phase 1

**Sign-off:**
- The two-phase plan is the right shape.
- Phase 1 success metric = signed LOIs + pre-orders is the right gate.

**Resources:**
- ~18 working days of focused build time.
- One domain (~$12/yr).
- Clerk + Neon + Vercel + R2 + PostHog + Sentry + Resend free-tier accounts.
- Stripe account (for the pre-order Payment Link).

**That's it.** Phase 2 spend is gated on Phase 1 evidence.

---

## In one sentence

> *Build a polished delivery platform first, prove people will pay for it using $0/month of infra, and only then turn on the expensive AI generation — with the safety nets (validators, reviewer model, human-in-the-loop) wired in from day one.*
