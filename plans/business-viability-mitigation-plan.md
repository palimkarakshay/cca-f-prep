# Business Viability — Mitigation Plan

> **Companion to.** `business-viability-negative-study.md` — the hostile review.
> This document does the opposite job: for each identified problem, it proposes
> the safest available mitigation. Where no safe mitigation exists, it says so
> explicitly rather than papering over the gap.
>
> **Stance.** Constructive but unsentimental. The negative study identified
> nine independently fatal problems. Some can be tactically fixed (re-cost the
> AI line, raise the pilot fee, switch off Vercel Hobby). Others are
> structural and only mitigate by **shrinking what you're building** — there
> is no version of the original SaaS plan that survives all nine critiques
> simultaneously. The honest mitigations narrow the product, narrow the
> segment, and narrow the timeline.
>
> **What this doc is not.** It is not a rationalisation of the original
> plan. It is not a "yes-and." Three of the fourteen problems can only be
> mitigated by killing that part of the plan; the doc names them.

---

## Table of contents

1. Triage — which problems can be safely mitigated, and which can't
2. P1 mitigation — TAM / SAM / SOM math
3. P2 mitigation — AI cost mis-pricing
4. P3 mitigation — Hyperscaler / suite-vendor competition
5. P4 mitigation — Validator "moat" decay
6. P5 mitigation — Maven / lab-to-app citation gap
7. P6 mitigation — 18-day Phase 1 timeline
8. P7 mitigation — Free-tier TOS violation
9. P8 mitigation — SOC2 chicken-and-egg
10. P9 mitigation — Pilot pricing inversion
11. P10 mitigation — Solo-operator bandwidth
12. P11 mitigation — Vendor concentration
13. P12 mitigation — Multi-segment GTM sprawl
14. P13 mitigation — Comfort-blanket "expert review"
15. P14 mitigation — Pedagogical-research → product-feature leap
16. The minimum viable safe path (re-shaped plan)
17. Stop-signals — when to kill the project anyway
18. This-week action list (do these in order)

---

## 1. Triage

Each of the 14 problems falls into one of three categories.

| | Tactical fix | Structural fix | No safe mitigation — kill |
|---|---|---|---|
| **What it means** | Single-decision change to a slide, a price, a config, or a vendor | Re-shaping the plan: cut scope, cut segment, change what you sell | Cannot be fixed within the original plan; the only safe move is to remove that part of the plan |
| | | | |
| P1  TAM math | ✓ rewrite slide bottoms-up | | |
| P2  AI cost | ✓ re-cost + caps | | |
| P3  Hyperscaler competition | | ✓ pivot to partner-of / measurement-only | |
| P4  Validator moat | | ✓ stop selling validators as IP | |
| P5  Citation gap (Maven 96%) | ✓ strike the citations | | |
| P6  18-day Phase 1 | | ✓ scope cut to one surface, 8–12 weeks | |
| P7  Free-tier TOS | ✓ pay $20/mo or self-host VPS | | |
| P8  SOC2 chicken-and-egg | | ✓ exit the regulated-vertical pitch | |
| P9  Pilot pricing | ✓ raise + remove credit | | |
| P10 Operator bandwidth | | ✓ cap tenant count + drop B2B or B2C | |
| P11 Vendor concentration | ✓ provider abstraction at LLM layer | | |
| P12 Segment sprawl | | ✓ pick one, drop six | |
| P13 Audit theatre | ✓ pay an external reviewer | | |
| P14 Lab→app leap | | ✓ measure your own outcomes; stop borrowing effect sizes | |
| | | | |
| **Existential — kill these parts** | | | The mid-market enterprise pitch (until SOC2 + headcount); the "8 segments, one engine" framing; the venture-shaped roadmap to $100k MRR by Month 24 |

**Reading the triage.** Five problems are tactical (cheap to fix in a few
days). Seven are structural (require shrinking the plan). Three are
non-mitigable within the venture frame; they're listed in the bottom row
as parts of the plan that must be **removed**, not improved.

The mitigation strategy in each per-problem section below assumes you
accept this triage. If you don't, the negative study's §18 final
recommendation stands: don't build it as a SaaS at all.

---

## 2. P1 mitigation — TAM / SAM / SOM math

**Problem (recap).** Decks claim "$370B TAM, $50B SAM, 0.05% = $25M ARR"
without any bottoms-up funnel logic. Dossier asserts 1,000 SMB tenants
in 36 months ≈ one new tenant per workday for three years.

**What to do — kill the top-down framing entirely:**

1. **Delete the TAM/SAM/SOM slide from `deck-investor.md`.** Replace with
   a single bottoms-up table:

   | Source | Named accounts you could plausibly contact in 30 days | Realistic close rate at 12 months | Year-1 revenue |
   |---|---|---|---|
   | Personal network (warm intros) | List names, not categories | 15–25% | $? |
   | LinkedIn outbound (cold) | List job titles + ICPs | 1–3% | $? |
   | Inbound (SEO + content) | 0 until SEO compounds | 0 in Y1 | $0 |

2. **Fill the table with real names.** If the warm-intro column has fewer
   than 15 named contacts, the GTM is not viable as a venture.

3. **Replace SOM share-of-market language** with "X paying customers ×
   $Y ACV = $Z ARR" — never with a percentage of someone else's TAM.

4. **Drop the "0.05% of SAM = $25M ARR" line entirely.** It is a
   conversation-ender for any due-diligence-capable reader.

**Why this is safe.** Bottoms-up math forces you to count actual people
in actual companies. If the count is too small, you learn that *now*,
before spending build effort. The mitigation costs you the most exciting
slide and gives you decision-grade information instead.

**Watch out for the false comfort.** Bottoms-up that produces 60+ named
SMB-L&D-buyer contacts is unusual unless you've worked in L&D
previously. If you've never sold to L&D buyers and don't know any, the
honest bottoms-up number is 2–5, and the venture conclusion is "no."

---

## 3. P2 mitigation — AI cost mis-pricing

**Problem (recap).** Plan claims $300/mo AI at 100 tenants × 50k
generations. Realistic figure is $5–10k/mo (25–30× higher).

**What to do — re-cost + impose hard caps:**

1. **Re-do the math.** Build a spreadsheet with one row per pipeline
   call (drafter, critic, embeddings, voice transcription, suggestion
   dedup) and explicit token estimates. Use **list prices**, not the
   prompt-cached optimistic case. Show the fully-loaded cost per
   generation, then multiply.

2. **Establish the breakeven price per generation.** If draft+critique
   for one lesson costs $0.20 in raw tokens, you must charge ≥ $1
   amortised across the lesson's lifetime to clear AI cost + infra +
   support + a margin. That sets a floor on per-generation pricing.

3. **Generate-once-publish-many.** A lesson should be generated **once
   per tenant** and amortised across every learner. Never regenerate
   per learner. The schema must enforce this — `lesson_version` is the
   billable unit, not `lesson_view`.

4. **Hard cap monthly generations per tenant.** Server-enforced ceiling
   (e.g., 200 generations/mo on the entry tier; overage = $2/generation
   cash, not "soft warning"). Burn-meter is a UI feature; circuit-
   breaker is a backend feature.

5. **Switch the drafter to Haiku 4.5** for the cheapest tier. Haiku at
   roughly 1/12 of Sonnet output cost makes the entry tier viable.
   Use Sonnet only on tiers where the price supports it.

6. **Drop Opus from the critic role on routine drafts.** Use Sonnet as
   critic on Haiku drafts. Reserve Opus for ≤ 5% sampled spot-checks
   (the routing pattern that's already in the plan but never costed).

7. **Pass-through pricing for high-volume tenants.** Charge per
   generation above the cap, not per seat. This protects margin against
   power users.

**Updated honest margin.** With caps + Haiku/Sonnet routing + amortised
generation, gross margin lands at **55–70%**, not 95%. That is **fine**
— most ed-tech SaaS lives in that band. Stop claiming 95%.

**What you cannot mitigate.** The headline "$450–1000/mo Phase 2"
budget is gone. Real Phase 2 budget at the pitched scale is
**$3,000–6,000/mo**. Re-state explicitly in every deck.

---

## 4. P3 mitigation — Hyperscaler / suite-vendor competition

**Problem (recap).** Workday-Sana, Synthesia, Articulate AI, NotebookLM
Enterprise (free with Workspace), Claude Marketplace — the category is
already won at the layer the plan targets.

**What to do — stop selling at the layer the hyperscalers own:**

There are three credible mitigations. Pick exactly one; do not stack
them, because the operator bandwidth in §11 doesn't support multiple.

**Mitigation A — Become an Anthropic partner, not an Anthropic
competitor.**
- Apply to **Claude Marketplace** as a vertical solution. Anthropic
  charges 0% commission to selected partners and provides distribution
  through their enterprise relationships.
- Reframe the product as "Claude for L&D, vertical-tuned" rather than
  "an AI-LMS." You buy distribution; Anthropic owns the customer.
- Risk: Anthropic deprioritises L&D as a vertical, or admits another
  partner ahead of you.

**Mitigation B — Sell only the measurement / Kirkpatrick layer to
existing LMS deployments.**
- The negative study's §17.3 observation: the actually defensible piece
  is calibration-Δ + L1–L4 reporting + CTA-style SME elicitation.
- Productise as a **Chrome extension** that overlays on Articulate /
  Litmos / Cornerstone authoring views, plus a measurement dashboard
  that reads outcomes from any LMS via xAPI/SCORM webhooks.
- You are no longer competing with the LMS. You are an upgrade to it.
- Risk: smaller TAM. Plausible-best-case ARR ≈ $1–3M, not $100M.

**Mitigation C — Pick a vertical the hyperscalers can't economically
serve.**
- Highly-regulated professional CE: medical CME with state-board
  specifics, AICPA CPE, FAA pilot recurrent training, FINRA Series 7
  refreshers.
- Each vertical has compliance details Google and Anthropic won't
  encode. The validator suite becomes domain-specific, which is a real
  moat in that vertical.
- Cost: you must hire or partner with a domain expert in that vertical.
  It is no longer a side bet.
- Risk: you don't know any of those verticals from inside, and
  "AI-content-quality" is a much smaller wedge against "this is what
  the state board accepts as CE credit."

**What you cannot mitigate.** The horizontal "AI-LMS for everyone"
pitch is dead. Workday-Sana, NotebookLM, Articulate AI already occupy
that surface. The first slide that pitches the product as a horizontal
LMS replacement should be deleted.


