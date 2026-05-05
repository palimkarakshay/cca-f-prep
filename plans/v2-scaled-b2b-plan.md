# v2 — Scaled-Down B2B Plan (canonical)

> **Status.** Source of truth for the post-audit shape of this venture.
> Supersedes the v1 plans (`deck-*.md`, `content-pack-management-plan.md`,
> `IMPLEMENTATION.md`, `research-and-strategy-dossier.md` §5–6,
> `expert-review-audit.md`) where they conflict.
>
> **Why this exists.** The hostile review
> (`./business-viability-negative-study.md`) identified nine independently
> fatal problems with the v1 SaaS plan. The mitigation plan
> (`./business-viability-mitigation-plan.md`) classified each as tactical /
> structural / unmitigable and prescribed a safe path. This document
> *combines the findings and the prescribed solutions* into a single
> coherent plan that:
>
> - **keeps a B2B case alive** at a deliberately scaled-down size, and
> - **survives all nine audit findings simultaneously.**
>
> **It is not a rationalisation of v1.** Where v1 made a claim that the
> review struck (95% gross margin, $25M ARR, 18-day Phase 1, Maven 96%),
> v2 does not put the claim back in. The reduced ambition is the price
> of survival.
>
> **Underlying evidence.** `./business-viability-research-notes.md`
> preserves the line-cited subagent ammunition.

---

## Table of contents

1. Executive summary — what v2 is and isn't
2. ICP — one segment, named
3. Pricing — bands that cover operator labour
4. Sales motion — what the operator can actually run
5. Product surface area — the scaled architecture
6. Phase 1 build (8–12 weeks part-time)
7. Phase 2 build (gated on revenue, not on date)
8. Revised unit economics
9. Vendor strategy — provider abstraction from day 1
10. Risk register (revised)
11. Stop-signals (carried over from mitigation plan §17)
12. What v2 explicitly does NOT promise
13. Crosswalk — v1 → v2 changes by document

---

## 1. Executive summary — what v2 is and isn't

**v2 is a focused B2B + B2C learning-content platform for one named
segment, run by one operator on a side-bet schedule, with a hard
ceiling of 10 paying B2B tenants in Year 1 and ~$10–15k MRR by month
12.** It survives every finding in the negative study by being
deliberately smaller than v1.

**v2 is:**
- A **B2C cert-prep web app** that doubles as the wedge content for the
  B2B motion. The operator is the first user; the operator's CCA-F
  study material is the seed catalog.
- A **B2B "team" upgrade** that converts an existing B2C account into
  a small-team workspace. SMB-only (≤50 employees), non-regulated.
- One product, one engine, one segment.

**v2 is *not*:**
- A horizontal AI-LMS competing with Workday-Sana, Articulate, or
  NotebookLM (those won; see `business-viability-research-notes.md`
  §E).
- A mid-market enterprise pitch (no SOC2, no SAML, no SCIM in v1).
- A multi-segment platform (drops deskless, financial-services
  compliance, healthcare, manufacturing, high-PDI cultures from the
  pitch).
- A venture-shaped startup (no $100k MRR Month-24 roadmap, no
  fundraising motion).

**v2 keeps from v1:**
- The two-phase capital-efficiency discipline (de-risk AI cost before
  paying for it).
- Validators-as-quality-floor (not as moat).
- Methodologically honest measurement (Kirkpatrick L1–L4 framework,
  calibration-Δ as a *measurement* not a *promise*).
- The CCA-F study repo as seed content and dogfood.

**v2 drops from v1:**
- $25M ARR / 0.05% SAM-share framing.
- 95% gross margin / NRR 110–120% claims.
- 18-day Phase 1 timeline.
- Mid-market enterprise / regulated-vertical pitch until SOC2 exists.
- The "8 segments, one engine" framing.
- Maven 96% / altMBA 96% / Duolingo CURR / 14× retention citations
  borrowed from cohort or B2C-app contexts.
- Pilot fee with full credit toward subscription.
- Vercel Hobby for any commercial surface.
- Validator-suite-as-moat positioning.
- Claims of vendor portability that don't survive scrutiny.

---

## 2. ICP — one segment, named

**Primary ICP (B2C):** Adults studying for a tech/cloud/AI
certification while employed full-time. CCA-F, AWS Solutions
Architect, GCP Professional Cloud Architect, Anthropic Practitioner.
Pain: practice quizzes are bad, don't space-test, don't surface
calibration. Willingness-to-pay: $10–25/mo for the duration of cert
prep (typically 3–6 months).

**Secondary ICP (B2B small-team):** Engineering teams of 5–50 at
SaaS / AI / cloud / dev-tools companies who are paying for cert prep
out of L&D budgets ($1k–$3k per engineer per year is common). The
buyer is the engineering manager or VP Eng, NOT a Head of L&D, NOT a
compliance officer, NOT HR. **Critical constraint:** the buyer's
procurement does NOT require SOC2, SAML, or a security questionnaire
that exceeds a one-pager. If they ask for SOC2, you say "not in v1"
and walk away.

**Anti-ICP (explicitly out of scope for v1):**
- Healthcare frontline / clinical SMEs (HIPAA gating).
- Financial-services compliance (SOX, FINRA gating).
- Government (FedRAMP gating).
- Manufacturing / shop-floor (deskless wedge requires a different
  product shape).
- Mid-market enterprise (>250 employees) — sales cycle and SOC2 too
  expensive for a solo operator.
- High-PDI / face-saving culture pitches — out of v1 scope.

**Why this segment.** The operator is in it. Distribution is
community-shaped (Reddit, dev.to, Hacker News) rather than
field-sales-shaped. The buyer is technical and forgives a
one-pager-rather-than-SOC2 posture. Engineering managers buy more
quickly than HR/L&D.

---

## 3. Pricing — bands that cover operator labour

| Tier | Audience | Price | Includes |
|---|---|---|---|
| **Free** | Trial / freemium | $0 | 3 lessons across 1 catalog; spaced-review on those 3 |
| **Pro (B2C)** | Individual learner | **$15/mo** or **$129/yr** | All catalogs, full spaced-review, calibration-Δ dashboard |
| **Team Starter (B2B)** | 5–25 seats | **$20/seat/mo**, **$300/mo platform minimum** | All catalogs, basic team admin, weekly progress digest |
| **Team Pro (B2B)** | 25–50 seats | **$25/seat/mo**, **$750/mo platform minimum** | + per-team private custom-catalog (up to 1) drafted from team's own knowledge file |
| **Enterprise** | >50 seats | not-sold-in-v1 | Sales conversation deferred to Year 2+ pending SOC2 |

**Pilot offer (B2B only):** **$10,000 fee, 60-day pilot, no credit
toward subscription.** Pilot fee compensates operator setup labour;
it is non-refundable. Continuation requires a NEW signed annual
contract at list price.

**Why this is different from v1:**
- v1 had $5/seat entry tier; v2 has $20 floor. The $5 tier was
  loss-making per seat once operator labour was priced in.
- v1 had $5,000 pilot fully credited; v2 has $10k non-credited.
- v1 had no platform minimum at the entry tier; v2 has $300/mo floor.
- v1 implied B2C $9/mo pricing parity with Duolingo Plus; v2 raises
  to $15 because cert-prep buyers tolerate more, and the math at $9
  did not work (LTV ~$112 at 8% monthly churn vs realistic CAC).

**Money-back guarantee** for B2C: 30 days, no questions, automated.
Reduces friction; structurally cheap because B2C subscribers churn
naturally if it doesn't fit.

**No money-back on B2B pilot** — the operator delivered work.

