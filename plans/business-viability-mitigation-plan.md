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

