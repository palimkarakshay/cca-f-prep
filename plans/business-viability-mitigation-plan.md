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

**Mitigation A — DELETED 2026-05-05 (iteration 01 N3).** Claude
Marketplace launched March 2026 with 6 named partners (GitLab,
Snowflake, Harvey, Replit, Lovable, Rogo) — all post-Series-B with
named-customer references and production SLAs. The Claude Partner
Network ($100M training fund) is open membership but does not
produce distribution; only Marketplace listing does, and Marketplace
listing is curated against criteria the operator cannot satisfy
(enterprise-grade ops, SOC2, named references). This option is
unavailable to the operator profile and was struck.

**Mitigation A2 (default if B/C fail their gates) — fall back to §16
micro-SaaS and accept that the venture frame is dead.** This is
explicitly the safest path; the negative study's §18 final
recommendation stands and the iterative review only sharpens it.

**Mitigation B — Sell only the measurement / Kirkpatrick layer to
existing LMS deployments.**

**Gate (added 2026-05-05).** Operator must identify a single named
L&D buyer (real person, real company, willing to install) **before
any code is written** for the extension. If no name in 14 days,
default to §16.


- The negative study's §17.3 observation: the actually defensible piece
  is calibration-Δ + L1–L4 reporting + CTA-style SME elicitation.
- Productise as a **Chrome extension** that overlays on Articulate /
  Litmos / Cornerstone authoring views, plus a measurement dashboard
  that reads outcomes from any LMS via xAPI/SCORM webhooks.
- You are no longer competing with the LMS. You are an upgrade to it.
- Risk: smaller TAM. Plausible-best-case ARR ≈ $1–3M, not $100M.

**Mitigation C — Pick a vertical the hyperscalers can't economically
serve.**

**Gate (added 2026-05-05).** Operator must have a named domain
expert willing to co-found / advise on paid terms **before scoping
the vertical**. Without an inside-the-vertical contact, the operator
is selling into the same buyers the hyperscalers serve, just slower.
If no contact in 30 days, default to §16.


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

---

## 5. P4 mitigation — Validator "moat" decay

**Problem (recap).** 23 documented failure modes pitched as moat; only
~6 actually coded; the F1 letter-bias detector failed on the operator's
own content. LLMs route around static checks at every release.

**What to do — stop selling validators as the moat:**

1. **Step 0 (added 2026-05-05, iteration 01 N9): code OR delete the
   missing 17 validators *before* any external promotion.** The
   public README of the open-source library must match what's
   actually shipped. The reputation downside of a public library
   that visibly under-delivers exceeds the reputation upside of
   having shipped one. Estimated effort to code 17 missing
   validators: 30–60 operator-hours, mostly LLM-prompt-template
   work. Budget before committing to open-source.

2. **Reframe validators as a *quality floor*, not a *moat*.** Floors
   are necessary; moats are differentiating. The decks consistently
   conflate the two.

3. **Open-source the validator suite as a Claude Skill.** The negative
   study §17.2 case stands — the suite's commercial value is low and
   decaying, but its reputation value is high and compounding. Ship it
   as `mcq-quality-checks` on npm or as a Claude Skill on the
   Marketplace. The operator becomes the named author of a public
   library every L&D team eventually finds.

4. **Build the actual moat at the *measurement* layer, not the
   validator layer.** Per-tenant Kirkpatrick L1–L4 dashboards with
   calibration-Δ trend lines and a credible methodology document take
   far longer for a competitor to copy than a regex set.

5. **Replace "23 failure modes" language across all decks with "open-
   source quality library used by N developers"** — once it ships and
   N > 0.

**What you cannot mitigate.** The "validator suite as IP" framing is
gone. Anyone who reads the collaborator deck and counts the
`// 17 more...` stubs sees through it. Treat it as commodity tooling.

---

## 6. P5 mitigation — Maven / lab-to-app citation gap

**Problem (recap).** "Maven 96%" is altMBA's number, not Maven's
(Maven's own press release: "more than 75%"). The decks borrow
effect sizes from forced-participation lab studies and apply them to
voluntary $9/mo subscribers.

**What to do — strike the borrowed-effect-size claims:**

1. **Remove these strings from every deck:**
   - "Maven W1→W2 retention 96% vs MOOC 16%"
   - "altMBA 96% completion"
   - "14× retention multiplier"
   - "Duolingo CURR +21%, DAU 4.5×"
   - "Cohort tier ≥ 60% completion vs MOOC 3–10%"
   - Any other lift figure attributed to a competitor's product.

2. **Replace with this honest line.** *"Cognitive-science research
   suggests these mechanisms — spacing, retrieval, interleaving,
   cohort accountability — increase retention. We will measure our own
   cohort's outcomes once shipped and report against the Kirkpatrick
   framework. Until then, our claim is methodological, not
   quantitative."*

3. **Cite the lab studies as design rationale** (Cepeda 2008, Roediger
   & Karpicke 2006), but never as a quantitative outcome promise.

4. **Add a measurement plan.** State the minimum N you would need to
   reach 80% statistical power on a 10-percentage-point completion
   lift (rough order: 200+ in each arm). Until you have that N, every
   pilot's results are anecdote, not evidence.

5. **Pre-register your hypotheses** in a public document before the
   first pilot starts. This is the credibility move; it costs nothing
   and inoculates against post-hoc cherry-picking.

**Why this is safe.** Methodologically honest framing wins serious
buyers and serious investors. Borrowed effect sizes from
$2k+ live cohorts collapse the moment the buyer asks for a citation.

**Watch out.** Removing the lift numbers makes the decks less
exciting. That is the correct outcome. If you need exciting numbers
to close, you do not have a closeable plan.

---

## 7. P6 mitigation — 18-day Phase 1 timeline

**Problem (recap).** 18-day Phase 1 promises a multi-tenant SaaS with
B2C learner app, B2B admin, marketing site, content authoring loop,
validators, and ops hygiene. Realistic build is 3–5 months full-time
or 9–18 months part-time.

**What to do — radically narrow Phase 1:**

1. **Cut Phase 1 to a single surface.** A B2C learner web app for the
   operator's own CCA-F study repo. No admin app. No marketing site
   beyond a one-page lander. No B2B controls. No SME review queue.
   No multi-tenancy.

2. **Use Astro + a static content pack** if possible — defer Postgres
   until you have a paying user. Most B2C cert-prep at <100 users
   runs fine on JSON files in object storage.

3. **Keep Clerk + Stripe Payment Links** for the gate; everything else
   is a static site. Total Phase 1 surface area: 4–5 routes.

4. **Time-box at 16 weeks (4 months) of evening / weekend hours**
   (8–12 hr/wk = ~150 hours). If anything is unshipped at week 8,
   **simplify scope** (cut features, not date) and re-plan;
   if anything is unshipped at week 16, stop and follow §17. The
   earlier draft of this doc said 8 weeks; iteration-01 hostile
   review (`plans/iterations/iter-01-critique.md` N1) showed median
   solo part-time time-to-first-paying-user is 6–11 months across
   indie-hacker cohort data — 8 weeks is a P95 outcome only when
   the builder has shipped a similar product before.

5. **Defer multi-tenancy until at least 5 paying users.** If you've
   never charged anyone for this product, you have no way to know
   whether the multi-tenant version is worth building.

6. **Defer Phase 2 entirely until Phase 1 has $1,000 of paying
   revenue.** No exceptions, no "this customer wants enterprise
   features."

**Why this is safe.** A B2C cert-prep app with the operator as the
first user is achievable in 8 weeks part-time. It generates real
signal (do users pay? do they complete? do they refer others?) at a
small fraction of the original scope.

**Watch out.** This kills the B2B story for Year 1. The decks must be
rewritten to admit "Year 1 = B2C only; B2B starts when there is
operator capacity, which depends on Year-1 revenue covering at least
half the operator's day-job income loss."

**The implementation plan needs a corresponding rewrite.** The
existing `IMPLEMENTATION.md` documents a multi-tenant SaaS in 18 days.
Either rewrite it to match the narrowed scope or archive it as
"original v1 plan, superseded by mitigation."

---

## 8. P7 mitigation — Free-tier TOS violation

**Problem (recap).** Vercel Hobby's TOS forbids commercial use. The
plan launches on Hobby and "flips to Pro at first paying customer" —
which is itself the TOS-breaching event.

**What to do — pay $20/mo from day one, or self-host:**

Three credible options, in order of preference:

1. **Vercel Pro from day one — $20/mo.** Phase 1 cost goes from $1/mo
   to $20/mo. The "essentially free" framing dies, but the plan was
   already fooling itself with that framing. Done.

2. **Self-host on a single VPS — $5–10/mo.** Hetzner / DigitalOcean +
   Coolify or Dokku. Brings Postgres, app, and storage onto one
   $5–10/mo machine. Less elegant; entirely TOS-clean. Adds ~4 hours
   of one-time setup.

3. **Cloudflare Pages + Workers — free, commercial-OK.** Cloudflare's
   free tier permits commercial use. Trade-off: edge runtime is more
   restrictive than Vercel's; some Next.js features need rework.

**For each non-Vercel-Pro free tier the plan uses:**

- **Neon free**: capped at 0.5 GB; upgrade to Scale ($19/mo) when you
  cross 250 MB or 100 paying users, whichever comes first.
- **Clerk free**: org cap is the limiting factor. Plan to move to
  Clerk Pro ($25/mo + per-user) when you cross 25 active orgs.
- **Resend free**: 3k emails/mo. Move to a paid plan or AWS SES
  ($0.10/1k) before any cohort cron fires.
- **PostHog free**: throttle event volume early (sample at 10% in dev,
  100% in prod with tight allowlist of events) to stretch the 1M
  ceiling.

**Why this is safe.** $20/mo Vercel Pro removes the existential TOS
risk and adds line-of-sight to the eventual Phase 2 cost. The plan's
"$1/mo" claim was always a fiction; this just makes it a $20/mo
truth.

**Watch out.** Don't migrate vendors mid-stream. Each migration is a
weekend; ten cumulative migrations is a quarter. Pick the stack and
stay.

---

## 9. P8 mitigation — SOC2 chicken-and-egg

**Problem (recap).** Enterprise won't sign without SOC2; the plan
defers SOC2 to "5 enterprise tenants pipeline" — therefore zero
enterprise tenants forever.

**What to do — exit the regulated-vertical pitch until SOC2 is real:**

1. **Drop the entire enterprise / regulated-vertical motion from the
   pitch for Year 1.** Healthcare, financial-services compliance,
   government — none of them buy from one-person teams without SOC2.
   Stop pitching them.

2. **Restrict B2B to companies <50 employees and non-regulated.** Tech
   startups, marketing agencies, e-commerce SMBs. They sign without
   SOC2. They also pay less ($5–10/seat range), but at the operator's
   capacity that is the right ceiling anyway.

3. **If you still want to do enterprise eventually, start a SOC2 Type 1
   engagement at the moment you cross $5,000 MRR.**
   - Vanta or Drata: ~$12k/yr.
   - Auditor: $15–20k for Type 1, $30–40k for Type 2.
   - Type 1 takes ~3 months from controls implementation to report.
   - Type 2 needs an additional 3–12 month observation window.
   - **Total cost from "decide" to "Type 2 in hand": $50k+ and 9–15
     months.** Budget it before you pitch enterprise.

4. **Be transparent with prospects.** "We're SOC2-Type-1-in-progress,
   target report Q3" is a legitimate posture for some buyers; "we'll
   get SOC2 if you sign" is not. Don't conflate them.

5. **Sub-processor BAAs.** When you do start SOC2, audit your
   sub-processors (Clerk, Resend, Anthropic, Vercel, Neon, R2). Each
   needs a signed BAA / DPA at the right tier. None of the free tiers
   sign these. Cost: subscription upgrades on each — typically
   $200–500/mo combined.

**Why this is safe.** Walking away from the regulated-vertical pitch
removes a forcing function (SOC2) you cannot satisfy. The plan
becomes smaller but coherent.

**What you cannot mitigate.** The dossier's "$50k–$1M ACV" enterprise
tenants in Year 3 are gone. ARR ceiling for the realistic plan is
~$300k–$1M, not $5M+. Re-state explicitly.

---

## 10. P9 mitigation — Pilot pricing inversion

**Problem (recap).** $5,000 pilot fee fully credited toward 12 months.
At entry-tier 50 seats × $5/mo = $3,000/yr. The credit exceeds Year-1
revenue. The platform pays the customer to be a customer.

**What to do — restructure the pilot so it can't lose:**

1. **Raise the pilot fee to $7.5k default for stock-catalog scope,
   $15–25k for custom-catalog** (iteration 01 T1: realistic 2026 SMB
   L&D-AI pilot pricing — Donald Taylor 2026 sentiment data: 60% of
   pilots are $0–$5k, 25% $5–10k, 12% $10–25k, 3% above $25k).
   Reject pilots below $5k unless they are explicit case-study-trade
   (signed marketing rights) deals. **Zero credit.** The pilot fee
   compensates for operator setup labour; it is not refundable.

2. **Drop the $5/seat entry tier.** Set pricing minimum at **$15/seat
   /mo** with a 25-seat platform minimum = **$375/mo floor**. This
   protects the per-tenant economics against the one customer who
   would otherwise be loss-making.

3. **Continuation = a new annual contract at list price**, not a
   credit applied to past spend. Pilots and subscriptions are
   separate motions.

4. **Cap pilot count at 2 concurrent.** Each pilot consumes ~50 hours
   of operator labour over 60 days. Three concurrent pilots is full-
   time. Two concurrent leaves room for everything else.

5. **Define pilot success in writing** before kickoff. Three numeric
   criteria, signed by the buyer at LOI. If criteria are met, the
   buyer commits to a 12-month renewal at list price; if not, both
   parties walk. No "extend the pilot" branch.

6. **Refund policy is symmetrical.** "If you cancel within 30 days for
   any reason, we refund 50%." Don't offer a 100% refund — you
   actually delivered work.

**Why this is safe.** Loss-making pilots compound. Two free pilots ×
50 hours each = 100 hours of operator time gone in Q1 with zero net
revenue. Paid pilots either fund the operator or filter out the
buyers who weren't going to convert anyway.

**Watch out.** Some prospects will balk at $10–25k. That's fine. The
prospects who balk at a $10k pilot fee are not going to renew at
$50k+ ACV; you're learning that early.

---

## 11. P10 mitigation — Solo-operator bandwidth

**Problem (recap).** Plan books 30 min/day operator labour at "100
tenants, 10k MAU"; realistic load is 54–90 hr/wk. The operator is
single point of failure for engineering AND customer success AND sales.

**What to do — cap growth so bandwidth stays sane:**

1. **Hard cap: 10 paying B2B tenants until Year 2.** Quality > growth.
   Decline new B2B prospects past the cap with a waitlist; use the
   waitlist as social proof.

2. **Choose B2C *or* B2B for Year 1, not both.** They are different
   full-time jobs. Recommended pick: **B2C cert-prep for tech
   certifications** (CCA-F, AWS, GCP), where the operator IS the
   target user and product-market fit is testable on themselves.

3. **Hire one part-time L1 support contractor at $5,000 MRR.** ~10
   hours/week, $1.5–2k/mo. Primary ticket triage and content QA spot-
   checks. Frees ~10 hr/wk of operator time for the higher-leverage
   surface (sales, content, eng).

4. **Build a real on-call story before any B2B contract.** At
   minimum: a status page, a paged alert (BetterStack or similar,
   $25/mo), and a 30-day rolling SLA log. "Solo founder, 24h
   triage" is fine for B2C; not for B2B.

5. **Keep the day job.** The negative study and the investor deck
   both implicitly admit this is a "side bet" for this exact reason.
   Burn-rate to zero is the safety net. Quit only when MRR ≥ 60% of
   day-job take-home for two consecutive quarters.

6. **Set a "sabbatical-or-stop" gate.** If MRR hits $10k by Month 12,
   take 4 weeks of unpaid leave to do focused sales. If MRR hasn't
   hit $3k by Month 12, stop the project entirely.

**Why this is safe.** Capping growth at 10 tenants × $1k MRR average
= $10k MRR ceiling for Year 1 is *fine*. It's better than zero.
Removing the venture-shaped growth target removes the bandwidth crisis.

### 11.7 Opportunity-cost honest accounting (added 2026-05-05, iteration 01 N11)

**Operator labour cost.**
- 10–15 hr/wk × 52 weeks = 520–780 hr/yr.
- At a $50/hr opportunity cost (conservative for a senior ABAP
  developer with side-consulting capacity): $26,000–$39,000/yr of
  forgone earnings.
- At Y1 MRR $500–2,000 and gross margin 55–70%: $3,300–$16,800
  contribution before counting operator labour.

**The choice in plain language.**

> By committing 10–15 hr/wk for 12 months to this side bet, the
> operator forgoes ~$26–39k of side-consulting income in exchange
> for $3–17k of project profit and optionality on a Y2 outcome. Net
> cost: **$20–35k of foregone earnings in Year 1**. The case for
> this trade is only valid if the operator believes Year 2+
> optionality is worth at least $25k of present-value bet.

The operator must record the answer to that question in
`decisions.md` with a date. If the answer is "I'm not sure," the
project is the wrong shape; consider §17.2 of the negative study
(consulting day-rates) instead — same hours, ~6× the income, no
product risk.

**What you cannot mitigate.** The "Roadmap to $100k MRR by Month
24–30" line in `deck-investor.md:286` is gone. Realistic Year-2 MRR
ceiling at this shape is **$15–30k**, not $100k. Re-state.

---

## 12. P11 mitigation — Vendor concentration

**Problem (recap).** Single Anthropic dependency for both drafter and
critic; six free-tier vendors stacked; "OpenRouter as v2 escape
hatch" is unbuilt; "data shapes are portable" is meaningless at the
operational level.

**What to do — build provider abstraction at the LLM layer from day 1:**

1. **Use the OpenAI-compatible API shape via OpenRouter from day 1**
   instead of Anthropic SDK direct. OpenRouter routes to Anthropic by
   default; switching the route is a config change, not a rewrite.

2. **Encode prompt templates in a vendor-neutral format.** Avoid
   Anthropic-specific features (XML-tagged tool use, prompt caching
   shape) in core paths until measured to be load-bearing. Where you
   do use them, isolate the vendor-specific code in one file.

3. **Pre-write a one-page migration runbook for each critical
   vendor.** Clerk → Auth0, Neon → Supabase / RDS, Vercel →
   Cloudflare, Anthropic → OpenAI. Each runbook lists steps, time
   estimate, blast radius. Store at `plans/runbooks/`. Don't *do*
   the migrations; just *plan* them. A runbook turns a "weeks of
   improvisation under outage pressure" into a "3-day execution plan
   we already wrote."

4. **Drop one vendor per quarter** until you're down to 4–5 max
   substrates. Drop priorities (in order): Inngest (use Postgres +
   pg_cron), Resend (use AWS SES), PostHog (use Plausible or even
   server-side logs for early stages), Sentry (use server-side logs +
   Cloudflare Logpush in early stages).

5. **Hard circuit-breaker on AI cost.** Server-enforced per-tenant
   monthly budget that **stops generation** when exceeded — not just
   warns the UI. This requires a transactional check before each API
   call. ~1 day of work; saves a runaway invoice.

6. **Document the Anthropic-specific risks in every deck.** Pricing,
   model deprecation, TOS shifts, first-party-product overlap. Don't
   hide them.

**Why this is safe.** Provider abstraction is cheap when done early
and expensive when done late. The runbooks shift outage response from
hours to a known plan.

**Watch out.** Don't *over*-abstract. A thin wrapper that's the same
shape as the OpenAI SDK is enough; don't build your own provider-
agnostic prompt DSL. That is yak-shaving.

---

## 13. P12 mitigation — Multi-segment GTM sprawl

**Problem (recap).** Decks pitch 7+ segments simultaneously. One
operator can serve at most one segment well in Year 1.

**What to do — pick one and delete the others from the pitch:**

1. **Pick the segment where the operator is the user.** B2C cert-prep
   for tech certifications (CCA-F, AWS, GCP, Anthropic Practitioner).
   The operator is studying for one of these, ships content for it,
   reaches first customers via the same study communities the
   operator is in, and has a credible "I built this for myself" story.

2. **Delete from every deck:**
   - Deskless workers (manufacturing, retail, healthcare frontline,
     field-services).
   - Financial-services compliance.
   - Healthcare clinical SMEs.
   - Manufacturing / shop-floor.
   - SaaS engineering onboarding.
   - Single-SME-bottleneck SMBs.
   - High-PDI / face-saving cultures.

3. **Replace with a single ICP slide.** "Adults studying for a tech
   certification while employed full-time. Pain: practice quizzes
   are bad and don't space-test. Willingness-to-pay: $10–20/mo for
   the duration of certification prep (3–6 months)."

4. **One catalog at launch — the operator's own CCA-F prep repo.**
   Add a second catalog only after the first crosses 50 paying users.
   Add a third only after the second crosses 100.

5. **Marketing motion is community-first, not outbound.** Reddit
   /r/AnthropicAI, /r/AWSCertifications, Hacker News Show HN, dev.to
   write-ups. Free, on-brand, and the operator can do it on
   weekends.

**Why this is safe.** One segment with the operator as power-user is
the only configuration where the bandwidth math works. Every other
segment requires domain expertise the operator doesn't have.

**What you cannot mitigate.** The "8 segments, one engine" framing in
`deck-overview.md:215–229` is gone. Re-write the slide as a sentence:
*"One catalog, one segment, one engine — for the operator's exam
peers."*

---

## 14. P13 mitigation — Comfort-blanket "expert review"

**Problem (recap).** `expert-review-audit.md` is a template for a
hypothetical future audit; every Score / Recommendation / Notes
column is empty; the "harsh critic" is the operator self-reviewing.

**What to do — get a real adversarial review:**

1. **Pay for an external review.** Two credible options:
   - A SaaS-fractional-CFO or angel investor: $500–1,000 for a
     2-hour review against the rubric.
   - An L&D-buyer-side acquaintance (former HR/L&D leader): $0–500
     for an hour of buyer-side critique.

2. **Post the plan publicly** on /r/SaaS, /r/Entrepreneur,
   IndieHackers, or Hacker News. Real strangers find real holes.
   Free; downside is exposing the plan publicly (which is fine —
   nobody is going to steal the plan; the plan is the constraint).

3. **Run a "kill the plan" workshop.** Set a one-hour timer; write the
   strongest single argument for stopping the project; then write
   the strongest counter; then a deciding argument. If the kill case
   wins on the merits, stop.

4. **Replace `expert-review-audit.md`** with a *recorded* audit:
   reviewer names, signed comments, dated. If you can't get any
   reviewer to sign, treat the empty rubric as *evidence the plan
   isn't real enough yet*.

5. **Set a 30-day deadline for the audit.** If no signed external
   review exists by then, consider that itself a signal.

**Why this is safe.** External eyes find what self-review can't. Even
$500 of paid review pays back many times over against a $25k SOC2
mistake or a wrong-segment go-to-market.

**Watch out.** Don't audit-shop. One critical reviewer is more
valuable than three friendly ones.

---

## 15. P14 mitigation — Pedagogical-research → product-feature leap

**Problem (recap).** Lab studies measure forced participation; the
product serves voluntary subscribers who skip the spaced-review banner.
Compliance with the intervention is the entire question, hand-waved.

**What to do — measure your own outcomes and stop borrowing:**

1. **Pre-register one measurable outcome.** Before launch, commit
   publicly to a specific number you intend to hit: e.g., "≥30% D7
   retention on free-trial signups, measured at N=200." Pre-
   registration is the credibility move; it costs nothing.

2. **Ship the simplest version of every cognitive-science feature
   first.** A spaced-review banner is fine; a calibration-Δ trend
   sparkline is fine. Don't ship the full LM1–LM8 stack at launch.
   Compliance with the simplest version is the leading indicator.

3. **Measure compliance, not just outcomes.** "X% of users opened the
   spaced-review banner within 24h" is the variable you actually
   control. The downstream retention number is what falls out.

4. **A/B test with treatment-vs-control.** The dossier promises this
   (`:968, :988, :1007`); the negative study notes N is too small.
   At your realistic N, A/B is impossible early. Ship without claims;
   measure for 6 months; only then test.

5. **Stop citing transferred effect sizes.** Replace
   *"~2× retention vs massed practice (Cepeda 2008)"* with *"We
   schedule reviews on an expanding interval informed by Cepeda
   2008. Whether this produces a measurable lift in our context is
   pending data."*

6. **Be willing to find that some of these mechanisms don't transfer.**
   The intellectual-honesty win is not "we copied 50 years of
   research"; it is "we measured what transferred and discarded what
   didn't."

**Why this is safe.** Methodologically honest framing is less
exciting and more durable. Investors and serious buyers prefer it.
Casual buyers don't notice either way.

**Watch out.** This makes the decks less impressive. You will feel a
strong pull to put the effect sizes back in. Resist it. The first
buyer who Googles "Maven 96%" and finds it's altMBA's W1→W2 number,
not a completion number, becomes a permanent-no.

---

## 16. The minimum viable safe path (re-shaped plan)

If you accept every mitigation above, the plan that survives is
recognisably different from the original. Here is the safe shape, end
to end.

### 16.1 What you build

A B2C cert-prep web app for *one* technical certification.
**Default catalog (post iteration-02 N16): Azure AI-102** —
mid-volume (~2k monthly searches), low SEO saturation, transferable
from the operator's AI/Anthropic background. Second-choice: GCP Pro
AI Engineer. **CCA-F is a free secondary catalog** used as SEO
top-of-funnel and for the operator's own studying — not the paid
revenue catalog (its 12–18 month peak window is too narrow). One
paid catalog at launch; consider second catalog only when the first
crosses 50 paying users.

Static content where possible; Postgres + Clerk + Stripe only where
actually needed.

- **Surface:** five routes — `/` (lander + sample lesson),
  `/study/[slug]` (lesson + quiz with calibration-Δ),
  `/dashboard` (progress + spaced-review with exam-date target),
  `/retake` (failed-exam recovery flow), `/account` (Stripe portal).
  Calibration-Δ + spaced-review + retake mode are the
  differentiation; without them, launch isn't viable (iteration
  02 N21).
- **Hosting:** Vercel Pro at $20/mo, or Cloudflare Pages free.
- **Auth:** Clerk free tier (single user pool, no orgs).
- **DB:** Neon free tier, or even SQLite + Litestream if hosted on a
  VPS.
- **AI:** Haiku 4.5 for content drafts; operator runs them locally via
  Claude Code (Max 20x covers it). The web app stores and serves; it
  does not generate at runtime in v1.
- **Payments:** Stripe Checkout — $10/mo or $79/yr. No tiers.
- **Telemetry:** PostHog free, server-side events only, sampled.

### 16.2 What you sell (revised 2026-05-05, iteration 02)

Three SKUs, no free tier:

| SKU | Price | What it gates |
|---|---|---|
| **Single-exam pack** (default) | **$29 one-time** | Lifetime access to that exam's catalog |
| **All-access subscription** (after ≥3 packs published) | **$19/mo** | All current and future exam packs |
| **All-access annual** | **$149/yr** | Same as monthly; ~35% savings |

**No free tier.** Public sample is *one* sample lesson per exam pack,
readable on the marketing site, with a quiz preview but the full
question bank gated. Marketing surface, not a free tier.

**Refund policy.** 30-day money-back, no questions asked. Builds
trust, lowers chargeback rate, signals confidence.

**Why these prices.** AWS Skill Builder is $29/mo (the upper anchor);
Tutorials Dojo's subscription tier sits at $14.99–24.99/mo and their
one-time exam packs at $15–25 (the empirical category norm). The
$10/mo / $79/yr in the earlier draft was below LTV-required floor
(iteration 02 N12, N13: at $10/mo blended LTV ≈ $55 vs CAC of
$96–144 from organic SEO labour — 5–7× over budget).

**The cognitive-science differentiation must ship in v1**, otherwise
the product cannot defend $19/mo against Anki + free YouTube. Three
non-negotiable launch features (re-instated from §16.4 defer list):

1. **Calibration-Δ tracker.** After each quiz, show predicted vs
   actual score; over time, plot the calibration curve.
2. **Expanding-interval spaced review tied to user-set exam date.**
   Default schedule keys off the user's exam date so review pressure
   scales accordingly.
3. **Retake mode.** Separate flow for users who failed an exam once;
   focuses on weakest topics from their first attempt.

No B2B. No SSO. No SAML. No SCIM. No SOC2 commitment. No custom
catalogs.

### 16.3 Who you sell to

Adults studying for a technical certification with **5+ years of
stable demand**. Default catalog: **AWS SAA-C03 or GCP ACE**, not
CCA-F. CCA-F is a 2026-launched cert with a 12–18 month peak window
and unknown long-term demand; treat the operator's CCA-F prep
content as a free lead-magnet feeding the SEO funnel for the paid
catalog. (Iteration 01 N5: "operator IS user" framing is fragile
because the operator's user-credibility expires the day they pass
the exam, and CCA-F is too new to bet a catalog on.)

**Distribution motion (Year 1) — SEO-first.**

1. **SEO is the primary channel.** Publish ≥30 SEO-optimised lesson
   pages in the first 12 weeks targeting long-tail queries:
   *"<exam-code> practice questions"*, *"<exam-code> sample mcqs"*,
   *"<exam-code> spaced repetition"*, *"<exam-code> retake
   strategy"*. Each page 600–1,200 words, indexable, with Open
   Graph cards and structured-data quiz markup.
2. **YouTube is the secondary motion.** One walkthrough video per
   lesson; YouTube indexes the same long-tail queries. ~8–12 hr/wk
   of operator time on this for the first 6 months produces
   compounding traffic from Month 6 onward.
3. **Community posts are tertiary, not primary.** Reddit / HN /
   dev.to are *announcements*, not a channel. Budget one Reddit
   post per quarter per relevant subreddit; expect 20–80 visitors
   and 0–2 paying users per post. (Iteration 01 N2 — Reddit/HN
   alone has produced zero profitable cert-prep B2C SaaS in the
   modern era; SEO + YouTube is the proven motion.)
4. **Realistic timing.** First paid user from organic at **Month
   4–6** at the earliest, more likely Month **9–12**.
5. **Kill signal.** If by Month 12 organic search traffic <1,000
   unique monthly visitors, the SEO motion failed; stop and migrate
   to consulting day-rates per §17.2 of the negative study.

**No paid acquisition is planned in Year 1 or Year 2** at the
projected price (iter-02 N18). At blended LTV ~$90, the only
sustainable CAC is <$30, which no paid channel currently achieves
in cert-prep B2C. This is a *deliberate constraint*, not a
deferred decision; do not "experiment with $200 of Google Ads" — it
will produce zero signal at that budget.

No outbound either.

### 16.4 What you don't build (yet)

- B2B admin app, SME review queue, multi-tenant RLS, custom catalogs,
  cohort routes, peer-comparison, leaderboard, voice authoring,
  worked-example fading, JOL slider trend lines, SCORM/xAPI export,
  Inngest pipelines, embedding dedup, Opus critic, advanced
  observability dashboards.
- All of the above are Year 2+ features, conditional on Year 1 paying
  revenue.

### 16.5 The realistic numbers

| Metric | Year 1 | Year 2 |
|---|---|---|
| Paying users | 50–200 | 200–800 |
| MRR | $500–2,000 | $2,000–8,000 |
| Operator hours / week | 10–15 (side bet) | 15–25 (still side bet) |
| Cost basis | **$130–320/mo** (Y1) | **$300–600/mo** (Y2) |
| Net to operator (median) | **$0–4k after costs + SE tax** | **$5–15k** |
| Net to operator (bottom-quartile) | **−$1–3k** (operator subsidises) | $0–3k |

**Cost-basis breakdown** (line-by-line, replacing the earlier $50/mo
guess; iteration 01 N4):

| Line | Y1 monthly |
|---|---|
| Vercel Pro (commercial-licensed) | $20 |
| Anthropic API direct OR Max 20x | $30–80 (API) / $200 (Max) |
| Stripe transaction fees (~3%) | $5–15 |
| Clerk free tier | $0 |
| Cloudflare DNS / domain | $1 |
| Resend / SES (free until ~1k MAU) | $0 |
| Sentry free tier | $0 |
| BetterStack uptime monitor | $25 |
| Domain email (Fastmail / Workspace) | $6 |
| LLC / sole-prop registration amortised | $0–25 |
| Compliance / chargeback overhead (added iter-02 N17) | $50 |
| **Subtotal Y1** | **$137–222 (API path)** / **$307–392 (Max path)** |

The earlier "$50/mo" framing was indefensible.

This is a **lifestyle micro-SaaS**, not a venture. It compounds. It is
defensible against hyperscalers because they don't care about cert-
prep niches at this scale. It is operable solo without burnout.

### 16.6 What you communicate to advisors / investors

The original investor deck targets the wrong audience. The safe shape
doesn't need investors. **Stop pitching investors.** If asked:
*"It's a cert-prep app. I'm running it as a profitable side project.
Not raising."*

If a strategic ever appears later — e.g., Anthropic, looking to bolt-
on cert-prep content for the Claude Marketplace — the conversation is
about acquisition or partnership, not Series A.

### 16.7 The "real product" decision tree

```
Build the safe-shape micro-SaaS for 6 months.
├── If MRR ≥ $3k by Month 6:
│     Continue. Add a second catalog. Reassess at Month 12.
├── If MRR ≥ $10k by Month 12:
│     Take 4 weeks unpaid leave. Run focused sales.
│     Re-evaluate B2B *small-SMB* (no SOC2 needed) only then.
├── If MRR < $1k by Month 6:
│     Stop. Migrate to §17.2 in the negative study (open-source
│     library + consulting day rates).
└── Otherwise:
      Continue at the current shape; don't escalate scope.
```

Each branch is concrete; none of them require hyperscaler-class
resources, SOC2, or 60-hour weeks.

### 16.8 Where the original plan still has value

- The CCA-F study repo content (genuinely useful).
- The validator suite as an open-source contribution (reputation
  asset).
- The cognitive-science integration as a methodology document — fine
  to publish as a blog series; not fine to sell as IP.
- The "two-phase, de-risk-the-AI-cost-first" *discipline* (good; just
  not at the scope the original plan defined).

---

## 17. Stop-signals — when to kill the project anyway

Mitigations only work if you're willing to stop when they fail. The
following are explicit kill triggers; they are not "consider pivoting"
triggers.

| Trigger | What to do |
|---|---|
| MRR < $1,000 by Month 6 (B2C path) | Stop. Migrate to open-source library + consulting (§17 of negative study). |
| 3 paid pilots fail their pre-defined success criteria (B2B path) | Stop the B2B motion. Refund nothing (pilots are paid; criteria failed for product, not pricing). |
| AI cost line exceeds 30% of MRR for two consecutive months | You under-priced or your unit economics broke. Raise prices or stop. |
| Vercel / Anthropic / Clerk TOS-relevant policy change | Migration runbook activates. If migration > 2 weeks, stop — vendor risk has crystallised. |
| Operator hours / week > 30 for two consecutive months on a side-bet schedule | Stop. The side-bet shape failed. Either go full-time (decide consciously) or shut down. |
| Day-job income or partner relationship at risk | Stop immediately. The operator's life outside this project is the actual capital. |
| External reviewer (paid, signed, dated) recommends "do not continue" | Don't continue. You paid for the answer; honor it. |
| 12 months elapsed and no segment has produced ≥ 100 paying users | Segment fit is wrong. Stop or pivot — but most likely stop. |
| First quality incident reaches a learner with a documented harm | Stop new generation, fix, audit, **and** publicly document. If you can't recover trust within 30 days, stop. |

**The single most important stop-signal:** *the operator's spouse,
family, or therapist asks if this is still healthy*. Treat that as a
P0. Most micro-SaaS founders who burn out report having dismissed
this signal multiple times.

---

### 17b. Externalised kill-trigger audit (added 2026-05-05, iteration 01 N7)

The §17 trigger list above is decorative if the operator is the only
one watching it. The operator is busy, emotionally invested, and
biased against quitting; self-monitoring fails predictably.

1. **Pick one named reviewer by 2026-05-31.** Spouse, advisor, paid
   fractional-CFO, or trusted friend. Their job is **a 60-min
   quarterly call** in which the operator answers in numbers
   against the §17 trigger list. Reviewer is paid $0 (or a flat
   $500/quarter if a fractional advisor); their leverage is that
   the operator publicly chose them.
2. **Calendar invites are owned by the reviewer**, not the operator.
   Cadence: Month 3, 6, 9, 12 from project start. Operator cannot
   decline more than one without triggering an automatic stop-review.
3. **Live MRR + cost dashboard.** Stripe webhook → public-read
   Notion / Sheets / a custom 50-line page. Anyone with the URL
   sees current MRR, cost basis, AI-cost-as-%-of-MRR, and
   **three paying-user numbers tracked separately** (iter-02 N15):
   total signups (vanity, do not optimise on this); 30-day-retained
   paying users (the real number); trailing-30-day churned paying
   users (lagging health). Updates daily. Cost: $0.
4. **Trigger response policy.** When a §17 trigger is hit, the
   operator commits in writing to the action *during the call*,
   not after. Trigger response is signed and dated to a
   `decisions.md` file in the repo.
5. **Quarterly redline.** Reviewer reads the §17 list aloud at each
   call. If a trigger has been hit and not actioned, the reviewer's
   only assignment is to ask "why are you not stopping?" until a
   number-based answer exists.

---

## 18. This-week action list (do these in order)

The list below is what an operator who accepts the mitigation plan
does in the first 7 days. Each item is a single hour or less unless
noted; the whole list is a weekend.

1. **Read the negative study + this mitigation plan end-to-end** in
   one sitting. Mark the parts you disagree with.

2. **Decide which mitigation track you accept.** The choice is
   essentially: §16 safe-path micro-SaaS, or §17.2 open-source
   library + consulting (from the negative study). Anything else is
   the original plan with extra steps.

3. **Open a `decisions.md` in the repo** and record the chosen track
   in writing, dated and signed. Future-you needs to be able to find
   this when current-you is tempted to escalate scope.

4. **Update the existing decks** to match the chosen track. The fast
   way: add a "Status" banner at the top of each deck file —
   *"This deck reflects an earlier scope. Current scope: see
   `business-viability-mitigation-plan.md` §16. Numbers below are
   superseded."* Don't rewrite the decks yet; they're useful as a
   record of what you considered and rejected.

5. **Strike the borrowed effect-size citations.** Specifically remove
   "Maven 96%", "altMBA 96%", "14× retention multiplier",
   "Duolingo CURR +21%, DAU 4.5×" from any deck or doc. **30
   minutes** of find-and-replace.

6. **Publish the validator suite as a Claude Skill or npm package
   stub.** Even an empty repo with a README that lists the 23
   intended failure modes establishes the open-source posture. Claim
   the namespace.

7. **Pre-register one outcome metric** in a public doc: e.g., "By
   Month 6, 50 paying B2C users at $10/mo, with D7 ≥ 30%."
   Pre-registration is free credibility.

8. **Cancel the Vercel Hobby plan or upgrade to Pro.** Decide. $20/mo
   or self-host. Don't continue with Hobby for any commercial
   surface.

9. **Pay $500–1,000 for an external reviewer** against the rubric in
   `expert-review-audit.md`. Or post the negative study + this
   mitigation plan to /r/SaaS / Hacker News for free critique.

10. **Schedule the 6-month and 12-month review dates** as calendar
    events. At each, re-read this doc, evaluate against §17 stop-
    signals, and decide explicitly: continue, pivot, or stop.

If items 1–10 take more than a weekend, the operator is already too
busy for the original plan. That itself is a signal.

---

## Appendix — what the safe plan does NOT promise

To keep the operator anchored and resistant to scope creep, here is
the explicit list of things the safe plan does not promise:

- $25M ARR.
- $100k MRR by Month 24.
- 95% gross margin.
- 110%/120% NRR.
- 3 signed B2B LOIs in Year 1.
- Mid-market enterprise deals.
- SOC2 Type 2 in Year 1.
- A "category-king" outcome.
- Venture funding.
- A team of 12.
- 7 vertical wedges in parallel.
- Anthropic acquisition.
- Outcome equivalence with Maven, altMBA, Duolingo, Cornerstone.

What it *does* promise: a sustainable side project with the
optionality of becoming larger if the data warrants. That's enough.






