# Iteration 01 — Mitigations

> **Companion to.** `iter-01-critique.md`
> **Stance.** Each finding from iteration 01 gets a triage and a mitigation.
> Where a finding requires a canonical-plan edit, that edit is captured
> here as a directive; the actual file edit happens in the same iteration's
> commit. Goal: never let a finding stay only as paper.

---

## Triage — iteration 01

| # | Finding | Triage | Closes in |
|---|---|---|---|
| N1 | 8-week B2C timeline still optimistic | Tactical (re-state the time-box) | this iter |
| N2 | Reddit/HN/dev.to is not a distribution plan | Structural (rewrite §16.3 to SEO + YouTube) | this iter |
| N3 | Claude Marketplace partnership unavailable | Structural (delete Option A from P3) | this iter |
| N4 | Year-1 cost basis 3–5× higher than $50 | Tactical (re-state §16.5 numbers) | this iter |
| N5 | Operator-IS-user is fragile | Structural (broaden segment OR sunset Y2) | this iter — segment decision |
| N6 | Decks still in repo with original numbers | Tactical (archive or rewrite) | this iter |
| N7 | Kill triggers un-instrumented | Structural (externalise audit) | this iter — design |
| N8 | B2B decks still tempting | Tactical (archive) | this iter — same as N6 |
| N9 | Open-source validators may damage rep | Tactical (gate launch on validator completeness) | this iter |
| N10 | Claude Max TOS for commercial use | Tactical (runbook + API-direct fallback) | this iter |
| N11 | Operator opportunity cost not priced | Structural (force the comparison) | this iter |
| T1–T4 | Sharpenings of P-series | Tactical | this iter |

---

## N1 — Realistic timeline

**Edit to mitigation plan §16:**
- Change "8 weeks of evening / weekend hours (~80–100 hours)" to
  *"16 weeks (4 months) part-time at 8–12 hr/wk = ~150 hours, with a
  hard re-plan gate at week 8."*
- Add: *"At week 8, if no payment-capable lander is live, **simplify
  the scope** (e.g., cut from quizzes-with-spaced-review to flat lesson
  index + Stripe gate); do not extend the date by adding more
  features."*

This change is in directive form only. Apply to
`plans/business-viability-mitigation-plan.md` §6 (P6 mitigation) and
§16.

## N2 — Replace channel mix

**Edit to §16.3:**

> **Distribution motion (Year 1):**
>
> 1. **SEO is the primary channel.** The catalog must publish ≥30
>    SEO-optimised lesson pages in the first 12 weeks targeting
>    long-tail queries: *"<exam-code> practice questions"*,
>    *"<exam-code> sample mcqs"*, *"<exam-code> spaced repetition"*,
>    *"<exam-code> retake strategy"*. Each page is ~600–1,200 words,
>    indexable, with Open Graph cards.
> 2. **YouTube is the secondary motion.** One walkthrough video per
>    lesson; YouTube indexes and surfaces them on the same long-tail
>    queries. ~8–12 hr/wk of operator time on this for the first 6
>    months produces compounding traffic from Month 6 onward.
> 3. **Community posts are tertiary.** Reddit / HN / dev.to are
>    *announcements*, not a channel. Budget one Reddit post per
>    quarter per relevant subreddit; expect 20–80 visitors and
>    0–2 paying users per post.
> 4. **Realistic timing.** First paid user from organic at **Month
>    4–6** at the earliest, more likely Month **9–12**. Plan accordingly.

Add this to §16 in `plans/business-viability-mitigation-plan.md`.
Also add a note in §17 (kill signals): *"If by Month 12 organic
search traffic <1,000 unique monthly visitors, the SEO motion
failed; stop and migrate to consulting day-rates."*

## N3 — Delete Marketplace pivot

**Edit to §4 (P3 mitigation):**

- **Delete Mitigation A entirely.** Anthropic Claude Marketplace
  launched March 2026 with 6 named partners (GitLab, Snowflake,
  Harvey, Replit, Lovable, Rogo); Marketplace listing requires
  enterprise-grade ops the operator cannot satisfy. Joining the
  Claude Partner Network ($100M training fund) is open to anyone
  but does not produce distribution; only Marketplace listing does.
- **Add gate to Mitigation B (Chrome extension):** *"Operator must
  identify a single named L&D buyer who would install the extension,
  before any code is written. If no name, default to §16."*
- **Add gate to Mitigation C (regulated CE):** *"Operator must have
  a named domain expert willing to co-found / advise paid, before
  scoping. If no name, default to §16."*
- **Add a new §4.4 — *"Default mitigation if A/B/C all fail their gates:
  follow §16."*** Make explicit that the negative-study's own
  conclusion (kill the venture frame) is the realistic outcome.

## N4 — Honest cost basis

**Replace §16.5 cost row with the line-by-line table from N4 of the
critique.**

Default ranges:
- **Y1 cost basis:** $130–$320/mo (depending on whether operator
  uses Claude API direct or Max 20x).
- **Y2 cost basis:** $300–$600/mo (Clerk Pro at scale, Neon Scale,
  observability).

**Replace the "net to operator: small but positive" line with:**

> *"**Y1 net to operator (median):** $0–$4k after costs and self-
> employment tax. **Y1 net (bottom-quartile):** -$1,000 to -$3,000;
> the operator subsidises the project from day-job income.**Y2 net
> (median):** $5–15k. The project is viable as a hobby with side-
> income optionality, not as a primary income source for at least 3
> years."*

## N5 — Segment broadening / sunset acknowledgement

**Edit to §11.2 and §12:**

- **Default segment:** AWS Solutions Architect Associate (SAA-C03) or
  GCP Associate Cloud Engineer. Both are 5+ year stable demand,
  $30–60M-revenue cert-prep markets, with known customer behaviour.
- **CCA-F is the *operator's* learning project**, not the revenue
  catalog. Content from CCA-F study can be a free lead magnet (Reddit
  posts, blog, YouTube) but should not be the primary paid catalog
  unless and until Anthropic certification has multi-year stable
  demand visible.
- **If the operator insists on CCA-F as the launch catalog**, accept
  the 12–18 month sunset: cohort window peaks Q3 2026, declines Q1
  2027 onward as the cert ages out. Plan a second-catalog migration
  by Month 9 unconditionally.

## N6 / N8 — Archive the venture decks

**Concrete operation (do this commit):**
1. `mkdir plans/archive-2026-05-04`
2. `git mv plans/deck-investor.md plans/archive-2026-05-04/`
3. `git mv plans/deck-b2b-prospect.md plans/archive-2026-05-04/`
4. `git mv plans/deck-collaborator.md plans/archive-2026-05-04/`
5. `git mv plans/deck-overview.md plans/archive-2026-05-04/`
6. `git mv plans/research-and-strategy-dossier.md plans/archive-2026-05-04/`
7. Add `plans/archive-2026-05-04/README.md` reading: *"These decks
   reflect a venture-shape plan that did not survive 2026-05-04
   hostile review. They are kept as evidence of what was considered
   and rejected. Do not reference. Current shape:
   `plans/business-viability-mitigation-plan.md` §16."*
8. Leave `plans/IMPLEMENTATION.md`, `plans/expert-review-audit.md`,
   `plans/content-pack-management-plan.md` — these have already been
   banner-flagged; per N6 we should also move them, but they contain
   technical content (DB schema, content-pack structure) that may be
   reused under §16 shape. Defer their archival until iteration 03's
   technical-execution review.

The corresponding HTML / PPTX files do not need archiving — they are
build artefacts. Add `plans/archive-2026-05-04/.gitignore` excluding
generated files if needed.

## N7 — Externalised kill-trigger audit

**Add a new §17b to `business-viability-mitigation-plan.md`:**

> ### 17b. Externalised kill-trigger audit (operator cannot self-audit)
>
> 1. **Pick one named reviewer** by 2026-05-31. Spouse, advisor,
>    paid fractional-CFO, or trusted friend. Their job is **a 60-min
>    quarterly call** in which the operator answers in numbers
>    against the §17 trigger list. The reviewer is paid $0 (or a
>    flat $500/quarter if a fractional advisor); their leverage is
>    that the operator publicly chose them.
> 2. **Calendar invites.** Reviewer issues invites on
>    a fixed cadence (Month 3, Month 6, Month 9, Month 12 from
>    project start). Operator cannot decline more than one without
>    triggering an automatic "stop" review.
> 3. **Live MRR + cost dashboard.** Stripe webhook → public-read
>    Notion / Sheets / a custom 50-line page. Anyone with the URL
>    sees current MRR, cost basis, AI-cost-as-%-of-MRR, paying-user
>    count. Updates daily. Cost: $0.
> 4. **Trigger response policy.** When a §17 trigger is hit, the
>    operator commits in writing to the action *during the call*,
>    not after. Trigger response is signed and dated to a
>    `decisions.md` file in the repo.
> 5. **Quarterly redline.** Reviewer reads the §17 list aloud at
>    each call. If a trigger has been hit and not actioned, the
>    reviewer's only assignment is to ask "why are you not stopping?"
>    until a number-based answer exists.

## N9 — Validator completeness gate

**Edit to §5 (P4 mitigation):**

- Re-order the steps. *"Step 0: code OR delete the missing 17
  validators. Public README must match what's actually shipped."*
- Add: *"Until Step 0 is complete, do not promote the validator
  suite externally. The reputation downside of a public library that
  visibly under-delivers exceeds the reputation upside of having
  shipped one. **Estimated effort to code 17 missing validators: 30–60
  operator-hours**, mostly LLM-prompt-template work (regex / text-
  pattern detectors, embedding-similarity dedup, etc.). Budget
  before committing to open-source."*

## N10 — Claude Max TOS / API-direct runbook

**Add a new runbook at `plans/runbooks/claude-max-tos-shift.md`:**

```
# Runbook: Claude Max recategorised as commercial-disallowed

## Trigger
- Anthropic TOS update flags personal-tier subscriptions as
  prohibited for commercial output, OR
- Anthropic enforces existing language on the operator's account, OR
- Anthropic raises Max 20x pricing >50% in a single review cycle.

## Steps (≤4 hours)
1. Switch content authoring from Claude Code (Max) to Anthropic API
   direct via the existing OpenRouter wrapper.
2. Update the env: ANTHROPIC_API_KEY direct; remove CLAUDE_CODE_MODE.
3. Re-run the AI-cost spreadsheet at the new shape (per P2 mitigation).
4. Update §16.5 cost basis: drop $200 Max line, add $30–80 API line
   for Y1 / $80–200 for Y2.

## Worst case
Operator pays an additional $0–100/mo. No content loss; no migration
of stored content; no churn impact on existing users. Total downside
is bounded.
```

This runbook is short on purpose. Long runbooks decay; short ones
survive.

## N11 — Opportunity cost forced comparison

**Add a new §11.7 "Opportunity-cost honest accounting":**

> **Operator labour cost.**
> - 10–15 hr/wk × 52 weeks = 520–780 hr/yr.
> - At a $50/hr opportunity cost (conservative for a senior ABAP
>   developer with side-consulting capacity): $26,000–$39,000/yr.
> - At Y1 MRR $500–2,000, gross margin 55–70%: $3,300–$16,800
>   contribution.
>
> **The choice in plain language.**
>
> *"By committing 10–15 hr/wk for 12 months to this side bet, the
> operator forgoes ~$26–39k of side-consulting income in exchange for
> $3–17k of project profit and optionality on a Y2 outcome. Net cost:
> $20–35k of foregone earnings in Year 1. The case for this trade is
> only valid if the operator believes Year 2+ optionality is worth at
> least $25k of present-value bet."*
>
> Operator must record the answer to that question in `decisions.md`
> with a date. If the answer is "I'm not sure," the project is the
> wrong shape; consider §17.2 of the negative study (consulting day-
> rates) or just take the side-consulting income directly.

## T-series sharpenings

- **T1.** §10 (P9 mitigation): change pilot fee default from
  "$10–25k" to *"$7.5k for stock-catalog scope, $15–25k for custom-
  catalog. Reject pilots below $5k unless they're case-study-trade
  (signed-marketing-rights) deals."*
- **T2.** §12 (P11 mitigation), runbook timing: change "AWS SES
  swap" estimate from "1 day" to *"3 days, including SES production-
  access review and DNS cutover."*
- **T3.** §6 (P5 mitigation): change *"N ≥ 200 per arm"* to *"N
  varies with baseline rate; see [sample-size-table]."* Add the table:

  | Baseline | N per arm for 80% power, 10pt lift |
  |---|---|
  | 5% | 150 |
  | 10% | 200 |
  | 30% | 350 |
  | 50% | 400 |

- **T4.** §13 (P13 mitigation): raise external-review budget from
  "$500–1,000" to *"$800–1,500."*

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — apply N1, N2, N3,
   N4, N5, N7 (§17b), N11 (§11.7), T1, T2, T3, T4 inline.
2. `plans/archive-2026-05-04/` — created with 5 archived deck files
   + README.
3. `plans/runbooks/claude-max-tos-shift.md` — created.
4. `plans/iterations/ledger.md` — append iteration-01 row.

---

## Streak counter

**Iter 01: 8 new structural findings. Streak = 0 clean passes.**
Next iteration must re-attack post-mitigation state.
