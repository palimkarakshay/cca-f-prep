# Business Viability — Negative Study

> **Mandate.** Hostile review of the AI-enhanced LMS plan documented in this folder
> (decks, research dossier, implementation plan, expert audit). Solely focused on
> the question: *should this be built as a commercial business at all?*
>
> **Stance.** Critical business-plan manager. The author is not paying me to
> agree. Below are the strongest reasons this plan is unlikely to return the
> operator's time and capital, what is structurally fragile in the pitch, and
> what — if anything — should be salvaged.
>
> **Documents reviewed.** `deck-overview.md`, `deck-investor.md`,
> `deck-b2b-prospect.md`, `deck-collaborator.md`,
> `research-and-strategy-dossier.md`, `expert-review-audit.md`,
> `IMPLEMENTATION.md`, `content-pack-management-plan.md`. Cross-referenced with
> 2026 market data (Mordor Intelligence, SaaS Capital, LinkedIn Workplace
> Learning Report, Donald Taylor L&D Sentiment, public competitor pricing
> pages).
>
> **Status.** In-progress — sections fill out incrementally with tiny commits.

---

## Table of contents

1. Executive verdict
2. The fundamental contradiction (AI fixes AI)
3. TAM/SAM/SOM math doesn't survive a pencil
4. Unit economics are a mirage
5. Competitive landscape is misrepresented
6. Pedagogical-research moat is not a moat
7. Solo-operator bandwidth is the binding constraint
8. The 18-day Phase 1 is fantasy timeline
9. Free-tier infrastructure for commercial use is a TOS violation
10. Compliance / SOC2 chicken-and-egg
11. Pricing math is upside down (the pilot economics)
12. Vendor concentration risk
13. Quality-validator "moat" decays with each model release
14. Multi-segment GTM with one operator is a fatal sprawl
15. The expert-review audit is a comfort blanket, not an audit
16. Future of work in this category — Anthropic / OpenAI commoditise it
17. What can be salvaged
18. Final recommendation

---

## 1. Executive verdict

**This is not a venture business. It is a side-project disguised as one.**

Read in isolation, each deck is competent. Read together, the contradictions
are unhealable:

- The pitch claims AI-content is bad and the wedge is *quality*. The product
  fix is also AI-content. The differentiator is a layer of validators and a
  human reviewer — both of which are catch-up commodities, not moats.
- The unit-economics claim 95% gross margin and 110–120% NRR. Both omit the
  largest costs in real ed-tech (CAC, sales labour, content review labour,
  support, churn) and use top-quartile benchmarks as targets without an
  evidence basis.
- The capital-efficient framing is structurally honest, *and* it indicts the
  rest of the deck. If the operator truly believes Phase 1 might fail the
  gate, the investor deck shouldn't claim a path to $100k MRR by Month
  24–30. Pick one.
- The plan attacks 7+ segments simultaneously (B2C cert prep, deskless
  workers, financial compliance, healthcare, manufacturing, SaaS engineering
  onboarding, single-SME-bottleneck SMBs, high-PDI cultures). One solo
  operator can serve at most one segment well in Year 1.
- The Phase 1 timeline (~18 working days) is approximately one-fifth of what
  the actual scope requires for a multi-tenant SaaS with B2C learner app,
  B2B admin, marketing site, content authoring loop, validators, and
  operational hygiene. This is not a debate about velocity; it's a
  category error.
- The pilot pricing ($5,000 fee fully credited toward 12 months) is
  *upside-down* for the entry tier: a 50-seat × $5/mo customer pays $3,000
  in Year 1, of which $5,000 is already credited. The operator pays the
  customer to be a customer.
- Mid-market enterprise will not buy AI-generated training content from a
  solo founder without SOC2. The plan defers SOC2 until "5 enterprise
  tenants" — a chicken-and-egg that means *zero enterprise tenants forever*.

**Recommendation up front.** Kill the commercial framing. Keep the CCA-F
prep repo as a personal study tool. If the AI-content quality discipline
is genuinely interesting, ship it as an open-source library or a Claude
Skill — not as a SaaS. The salvage path is in §17.

