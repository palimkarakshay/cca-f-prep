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

---

## 5. P4 mitigation — Validator "moat" decay

**Problem (recap).** 23 documented failure modes pitched as moat; only
~6 actually coded; the F1 letter-bias detector failed on the operator's
own content. LLMs route around static checks at every release.

**What to do — stop selling validators as the moat:**

1. **Code the missing 17 validators before any pitching.** It is
   indefensible to claim a moat that exists in commented stubs. Either
   ship the work or strike the claim.

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

4. **Time-box at 8 weeks of evening / weekend hours** (= ~80–100
   hours). If anything is unshipped at week 8, stop and re-plan.

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

1. **Raise the pilot fee to $10–25k for ≤ 50 seats** depending on the
   custom-catalog scope. **Zero credit.** The pilot fee compensates
   for operator setup labour; it is not refundable.

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




