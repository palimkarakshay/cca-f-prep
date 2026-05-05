# Iteration 03 — Mitigations

## Triage

| # | Finding | Triage | Closes in |
|---|---|---|---|
| N22 | AI-102 catalog retires June 30, 2026 | Structural (pivot to AI-103) | this iter |
| N23 | Content velocity 3× short of topical authority | Structural (timeline reset) | this iter |
| N24 | No backlink strategy | Tactical (motion outline) | this iter |
| N25 | YouTube cold-start unmodeled | Structural (defer to Y2) | this iter |
| N26 | Operator-cred deficit at AI-103 | Tactical (cert commitment) | this iter |
| N27 | Kill thresholds wrong for new timeline | Tactical (re-set table) | this iter |
| N28 | Single-catalog demand bet | Structural (catalog optionality) | this iter |

---

## N22 — AI-103 pivot

Replace AI-102 with AI-103 in:
- §16.1 (catalog): default catalog is **Azure AI-103 (Azure AI App
  and Agent Developer Associate)**.
- §16.3 (segment): same.
- §11.2: same.

Add caveats:
- New exam = unknown Y1 demand; trigger pivot if <200/mo searches by
  Month 6 (per N28).
- First-mover advantage shrinks fast — SkillCertPro already at
  AI-103. Operator must publish first 5 lessons by July 15, 2026
  to claim "earliest community-driven AI-103 prep." Otherwise the
  motion is "another option among several."
- Microsoft AI-103 study guide may be sparse — opportunity for
  "official study guide explained" content.

## N23 / N25 — Distribution timeline reset

§16.3 timing rewrite:

> **Realistic timing.** First paid user from organic at **Month
> 9–14** at earliest; more likely **Month 12–18**. Topical authority
> (the leading 2026 SEO signal) requires ~50 pieces of content
> (lessons + supporting articles) before consistent rankings, which
> is ~30 weeks at the operator's part-time velocity. Plan: do not
> expect MRR > $200 before Month 9; do not expect MRR > $500 before
> Month 12; do not expect MRR > $2,000 before Month 18.
>
> **YouTube — deferred to Year 2.** Cold-start economics in 2026 do
> not support a part-time YouTube channel with <2 videos/week. Year
> 2: re-evaluate based on Year-1 paid-user count.

## N24 — Backlink motion

Add §16.3.5:

> **Backlink motion (Year 1):**
>
> 1. Publish 1 guest post per month on a relevant blog (operator
>    network — Substacks of cloud/AI dev friends, dev.to, Hashnode).
>    Target: 12 backlinks Year 1.
> 2. Create 2 *linkable assets* per quarter: e.g. "complete passing-
>    rate analysis of AI-103," "free 6-week AI-103 study plan PDF,"
>    a public open-source validator library that L&D devs reference.
>    Target: 5–15 organic backlinks Year 1.
> 3. Lesson companion videos on YouTube embedded into lesson pages
>    (zero standalone YouTube channel; just lesson companions for
>    embed). Cross-share on Twitter/Mastodon.
>
> **Realistic Year 1 backlink count: 30–60 referring domains.** Not
> enough to rank against incumbents on competitive queries. Plan
> to rank only on long-tail queries in Year 1.

## N26 — Operator certification commitment

Add §16.10:

> **Operator certification commitment.** Operator commits to
> passing AI-103 within **90 days** of project start as precondition
> for charging for the catalog. Exam attempt: $165 + ~30 hours
> focused study. If not passed by Month 3, catalog must be
> repositioned as "study-along-with-me" content rather than
> "passing-rate-promised" content until certification earned.

## N27 — New kill-signal table

Replace the existing B2C single-line "MRR < $1,000 by Month 6" entry
in §17 with this table:

| Month | Trigger |
|---|---|
| 3 | Operator AI-103 cert attempted — pass or written-down "study-along-with-me" reposition |
| 6 | First paying user must exist (MRR ≥ $19) AND organic SE volume ≥ 200/mo for the target exam |
| 9 | MRR ≥ $200 |
| 12 | MRR ≥ $500; organic search traffic ≥ 500 unique monthly visitors |
| 18 | MRR ≥ $2,000 — otherwise stop and follow §17.2 of negative study |

## N28 — Catalog optionality

Add §17 trigger:

> **AI-103 demand-failure trigger.** If by Month 6 AI-103 monthly
> search volume on Google (measured via Search Console on operator's
> domain OR Ahrefs free) is <200/mo, demand hasn't materialised.
> Pivot catalog to a backup choice (CompTIA Security+, AWS DVA-C02,
> Anthropic CCA-Developer if launched) within 30 days, or stop
> and follow §17.2.

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — apply N22–N28
   inline.
2. `plans/iterations/ledger.md` — append iteration-03.

---

## Streak counter

**Iter 03: 4 new structural findings + 3 tactical. Streak = 0/5.**
