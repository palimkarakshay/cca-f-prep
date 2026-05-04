# Content Pack Management Platform — B2B Prospect Brief

> Slide-style deck for a 30-minute discovery call with a prospective B2B customer (HR / L&D / Compliance buyer). Buyer-language, not engineering-language. Slide breaks are marked by `---`.
> Companion docs: [`./content-pack-management-plan.md`](./content-pack-management-plan.md), [`./deck-overview.md`](./deck-overview.md), [`./deck-investor.md`](./deck-investor.md), [`./deck-collaborator.md`](./deck-collaborator.md).

---

# Continuing Education, on Your Topics

A learning platform where you control the catalog,
your subject-matter expert approves every piece of content,
and AI drafts the routine work so your team focuses on judgment.

*For: [Prospect Company] • Function: [HR / L&D / Compliance / Engineering Onboarding]*

---

## The problem you have today

| | Friction |
|---|---|
| **Off-the-shelf LMS** | Curated catalog rarely covers your team's actual topics; updates lag your business by 6–12 months |
| **Build it in-house** | Cost: $200k+ and 6+ months for a content team that has to keep authoring forever |
| **Raw AI tools** | Quality is uneven; no audit trail; legal won't let you ship un-reviewed AI content to staff |
| **Status quo (PDFs + slides)** | No tracking, no quizzes, employees don't read it |

---

## What we offer

A managed learning platform where:

- **Your topics, drafted on demand** — your administrator types a topic, AI drafts a lesson + quiz from your knowledge files (PDFs, slides, runbooks).
- **Your subject-matter expert reviews before publish** — every piece of content goes through your SME's queue. They approve, edit, or reject.
- **Your employees learn at their own pace** — short lessons, 3-question quizzes, mobile-first.
- **You see the data** — completion rates, weak spots, requested topics, quality signals.

---

## How it works (the loop)

```
You upload knowledge files (PDFs, slides, runbooks)
         │
         ▼
Your admin types a topic ("Q4 SOX changes")
         │
         ▼
AI drafts lesson + 3-question quiz
         │
         ▼
Validators screen for known failure modes (23 of them)
         │
         ▼
Stronger reviewer model audits the drafter
         │
         ▼
Your SME reviews → approve / edit / reject
         │
         ▼
Employees see the new lesson; progress tracked
         │
         ▼
You see what they got wrong → next topic surfaces
```

End-to-end: typically 24 hours from topic request to live lesson.

---

## Where AI helps — and where it doesn't

| Where AI helps | Where AI does NOT decide |
|---|---|
| Drafting initial copy from your knowledge file | Whether content is fit to publish (your SME decides) |
| Suggesting quiz questions and distractors | Final wording on regulated content |
| Catching duplicate topic requests from learners | Setting your company's policy or risk tolerance |
| Surfacing topics employees ask about | Anything legal / HR / safety-sensitive |

**Your SME is always the publish gate.** Auto-publish is opt-in per catalog and off by default.

---

## Quality controls

This is the part most AI-content products skip. Ours:

- **23 documented failure modes** screened automatically before any content reaches your SME (biased answer keys, fabricated facts, weak distractors, mid-quiz spoilers, etc.).
- **Answer-justification audit** — for every quiz question, the model must point at the exact span of your knowledge file that justifies the marked answer. No span, no publish.
- **Stronger model audits weaker model** — the reviewer model is more capable than the drafter, catching systematic blind spots.
- **Pause-not-pull post-publish** — if a question performs unusually badly across many learners, it's hidden for new sessions only. Active quizzes finish as-shown. No mid-experience surprises for your staff.

---

## Outcomes — measured, not promised

Most learning vendors report seat-time. We report against the
**Kirkpatrick four-level evaluation framework** every quarter:

| Level | What it measures | Our metric |
|---|---|---|
| **L1 — Reaction** | Did learners value it? | NPS post-section; CES (effort score) |
| **L2 — Learning** | Did they learn it? | Mock pass-rate trajectory; **calibration Δ** (how well learners' confidence matches outcomes — the metric that predicts real-job competence) |
| **L3 — Behaviour** | Did they apply it? | Course-completion rate; D1 / D7 / D30 cohort retention curves; manager-survey self-report on observed behaviour change |
| **L4 — Results** | Did the business benefit? | Compliance / certification pass-rate; for regulated tenants, audit-finding deltas |

We report against all four every quarter — not vanity metrics. If we
miss a stated target, you see it before we do. **Industry baseline for
self-paced corporate completion: 12–15%** (KPI Depot 2026). Our cohort
target: ≥ 60%.

---

## How we make your SMEs effective

Subject-matter experts know their material. Most can't *teach* it
without specific scaffolding — Cognitive Task Analysis research finds
SMEs omit ~70% of decisions when self-narrating complex tasks (Clark,
Feldon, van Merriënboer, Yates & Early). We close that gap:

- **CTA intake script** — five required probes (novice-error /
  one-principle / worked-example pair / boundary case / nearest
  confusable). No SME-narration of expertise; SME answers structured
  questions instead. *Lee 2004: +46% post-training learning gain on
  CTA-built instruction vs expert-narrated, Cohen's d ≈ 1.72.*
- **Backward-design template** — write the assessment first, then the
  lesson. Eliminates unmeasurable lessons. *(Wiggins & McTighe 1998 —
  Understanding by Design.)*
- **Worked-example pair required** — mandatory field, not optional
  enrichment. *(Sweller, van Merriënboer & Paas 2019.)*
- **Expert-blind-spot prompt at submission** — "what would a novice get
  wrong here?" *(Nathan & Petrosino 2003 — expert blind spot.)*
- **≤ 1-hour SME-to-publishable-lesson commitment.** End-to-end intake
  → critic → publishable. We hold ourselves to it.

---

## Your three problems → our three answers

Buyer-language summary. Every answer is a **shipped feature in the
platform** with a **named research source** — not a slide-ware promise.

**Problem 1 — Your learners forget what they learned.** Industry self-
paced course-completion is 12–15%, and even completers retain ~25% of
content by day 6 without review.

→ **Our answer.** A spaced-review banner on every learner's dashboard
with one-tap start; expanding-interval scheduling (1/3/7/14/30d); web-
push reminders anchored to the learner's own modal study-time; cohort
surface for the relatedness lift that converts MOOC 3–10% completion to
cohort 75–96%.

→ **Sources.** Cepeda et al. 2008 *Psych Sci* (~2× retention vs massed
practice); Roediger & Karpicke 2006 (~50% lift on retrieval practice);
Maven / Reich & Ruipérez-Valiente 2019 *Science* (cohort effect);
Mazal 2022 / Duolingo (CURR +21%, DAU 4.5× from streak design).

**Problem 2 — Your SMEs are experts but not teachers.** They know the
material. They can't transfer it. Cognitive Task Analysis research finds
they omit ~70% of decisions when self-narrating, so the resulting
instruction is ~46% less effective than CTA-built equivalents (Lee
2004, Cohen's d ≈ 1.72).

→ **Our answer.** A 5-probe CTA-style intake (novice-error / one-
principle / worked-example pair / boundary case / nearest confusable)
that the admin app *requires* — your SMEs answer five structured
questions instead of writing prose. Backward-design "write the test
first" mode locks the lesson editor until a passing assessment is
authored. Voice-first / camera-first capture for shop-floor SMEs whose
knowledge is tacit (Polanyi 1966). Per-SME blind-spot dashboard
surfaces patterns over time so SMEs self-correct.

→ **Sources.** Clark, Feldon, van Merriënboer, Yates & Early (CTA);
Wiggins & McTighe 1998 (backward design); Sweller / Renkl (worked-
example fading); Nathan & Petrosino 2003 (expert blind spot);
Ericsson 1993 (deliberate-practice feedback channel).

**Problem 3 — You can't tell whether your learning programme works.**
Most LMS vendors report seat-time and completion. Neither predicts
on-the-job competence; both can be gamed.

→ **Our answer.** Kirkpatrick L1–L4 reporting every quarter. The
load-bearing metric is **calibration Δ** — how well learner confidence
matches outcomes; it predicts real-job competence in a way completion
does not. < 70% completion correlates with **3.5× compliance-violation
rate** in regulated industries (KPI Depot 2026), so this is not vanity
measurement — it monetises directly through reduced incident cost.

→ **Sources.** Kirkpatrick 1959 / 2016 four-level framework;
Dunlosky & Bjork (calibration / JOL); Kruger & Dunning 1999
(self-assessment miscalibration); KPI Depot 2026 (compliance baseline).

Full evidentiary basis (industry data, peer-reviewed research,
problem-by-problem mitigation walkthrough with falsification triggers)
in [`research-and-strategy-dossier.md`](./research-and-strategy-dossier.md).

---

## We already know your segment's failure mode

| Your segment | What we already know about your retention / SME problem | What we ship |
|---|---|---|
| **Healthcare frontline / clinical SMEs** | Schedule-poor (10-min between cases); medico-legal liability shadows speech; CME drives seat-time, not transfer | Voice-first capture + critic-mediated review; Joint Commission / CME outcome reporting built in |
| **Financial services / compliance** | Self-paced 18–25% baseline; <70% completion ⇒ 3.5× violation rate (KPI Depot 2026) | Audit-trail + role-based publish + L4-Kirkpatrick compliance reporting |
| **Manufacturing / deskless** | Tacit / haptic knowledge (Polanyi 1966); ≤ 3-min mobile sessions, offline-capable. 90%+ frontline want mobile-first | Voice-to-text auto-draft for shop-floor SMEs; offline-tolerant mobile |
| **Tech / SaaS** | Content stales weekly; SMEs prefer code / README over prose | Markdown-first authoring + code-block awareness in critic |
| **Enterprise distributed-SME** | Multi-language, multi-geo; unclear authoring rights; governance gates | Role-based publish, multi-language critic, version-pin, audit-trail |
| **Single-SME-bottleneck SMB** | Bus-factor 1; no redundancy when SME leaves | Explicit succession-of-knowledge tooling — CTA + recorded interview + auto-draft |
| **High-PDI / face-saving cultures (Japan, Korea, India, MENA, LATAM)** | SMEs reluctant to expose uncertainty in public artefacts | Leader-endorsed pathway gate; critic copy framed as *probe* not *test*; anonymised peer-review surfaces |

We don't sell you a generic LMS. We sell you a configuration of one
engine to your segment's specific failure mode.

---

## Security & compliance

| | What we do |
|---|---|
| **Tenant isolation** | Postgres row-level security; every query carries your tenant context; verified by integration test |
| **Audit log** | Every publish, edit, and rejection is logged with author, timestamp, and reason |
| **Data export** | Self-serve CSV / JSON export of your tenant's content and learner progress |
| **Soft delete** | Nothing is hard-deleted for 90 days; recoverable on request |
| **AI provenance** | Every published piece records its drafter, reviewer, validator results, and SME-approval evidence |
| **SOC2** | On the roadmap — formal audit triggered at 5 enterprise tenants. We can share our control matrix today. |
| **GDPR** | Designed in (data-export, right-to-be-forgotten); EU hosting available |

---

## Single sign-on & integration

- **Clerk Enterprise** — SAML, SCIM, OIDC. Your IT team configures once.
- **Webhooks** — completion events to your HRIS / Workday / BambooHR.
- **API** — read-only export endpoints for your data warehouse.

---

## Pilot offer

A 60-day commercial pilot with mutually defined success criteria:

| | What's included |
|---|---|
| **Seats** | Up to 50 employees |
| **Catalogs** | Up to 3 catalogs of your choosing |
| **AI generation** | 100 generations included; overage at cost |
| **SME training** | 1-hour onboarding; ongoing Slack support |
| **Pilot fee** | **$5,000**, 100% credit toward the first 12 months if you continue |
| **Success criteria (suggested)** | ≥70% of seats complete ≥1 lesson; SME approval cycle < 48h; ≥1 internally requested topic delivered; **≥ 1 percentage-point calibration-Δ improvement on participating cohort by pilot end** (the L2-Kirkpatrick learning-outcome anchor) |

**No data lock-in.** If you don't continue, you get a full export and we delete your tenant.

---

## Pricing after the pilot

| Tier | Per learner per month | Notes |
|---|---|---|
| Standard | $5 | Public catalogs only, no custom |
| Professional | $10 | Up to 5 custom catalogs, SME role, SSO |
| Enterprise | $15+ | Unlimited custom, dedicated support, SAML, audit log export |

Platform minimum: $100/mo (covers any tier under 20 seats).

Custom catalogs (drafted from your knowledge files) are included in Pro and Enterprise.

---

## Timeline — LOI to live

| Week | What happens |
|---|---|
| **W0** | Discovery call, scope catalogs, identify SME |
| **W1** | LOI signed; provisioning + SSO config |
| **W2** | Knowledge file ingestion; first 10 lessons drafted |
| **W3** | SME review cycle; first cohort invited |
| **W4** | Pilot live; weekly readout |
| **W4–W12** | 60-day pilot runs; success criteria evaluated |
| **W12** | Pilot review → continue / extend / part-ways |

---

## Comparison vs build-it-yourself

| | DIY content team | Our platform |
|---|---|---|
| **Time to first lesson** | 4–8 weeks | 24–48 hours |
| **Cost** | Salaries + tooling, $200k+/year | Subscription, $5–15/seat/mo |
| **Maintenance** | Ongoing forever | Included |
| **Quality control** | Per-author variance | Validators + reviewer + SME |
| **Topics on demand** | Backlog management | Same-day draft |

---

## Comparison vs traditional LMS

| | Cornerstone / Litmos | Our platform |
|---|---|---|
| **Catalog flexibility** | Their courses | Your topics |
| **Time to publish a new topic** | Weeks (find a vendor course) | Hours |
| **AI-drafted custom content** | No | Yes — with SME gate |
| **Per-seat cost** | $10–25 | $5–15 |
| **Implementation** | Months | Days |

---

## What we'd ask of you

To run a successful pilot, we need:

- **One named SME** with ~10 minutes/day for content review **using our 5-probe intake — no narrative writing required**. The intake structures the SME's expertise into novice-error / one-principle / worked-example pair / boundary case / nearest confusable. Each concept ships with a worked example AND a faded variant by default.
- **Knowledge files** — your existing PDFs, slides, runbooks, policy docs. We'll ingest up to 25 MB during the pilot.
- **A point person** to coordinate cohort communications.
- **A weekly 30-minute readout** during the pilot.

That's it. No code changes on your side. SSO is optional during the pilot.

---

## Frequently asked questions

**"What if your AI gets something wrong?"**
Two safety nets: deterministic validators catch documented failure modes pre-review, and your SME is the publish gate. Bad content cannot reach your staff without your SME approving it.

**"What happens to our content if we leave?"**
Self-serve export of all your content and learner progress. Tenant deletion within 30 days of request.

**"Are our knowledge files used to train any AI models?"**
**No.** We use Anthropic's API in zero-data-retention mode for enterprise tenants; your files are used only to draft content for your tenant.

**"Can we run this air-gapped / on-prem?"**
Not in v1. On-prem is on the 18-month roadmap if 3+ enterprise prospects request it.

---

## Next step

A 30-minute scoping call to determine:

1. Which 1–3 catalogs would matter most to your team?
2. Who would be your SME?
3. What does pilot success look like to you?

If we agree it's worth a pilot, we send an LOI within 48 hours.

**Contact:** [operator email] • [scheduling link]

---

## In one sentence

> *Your topics, drafted by AI, reviewed by your expert, learned by your team — at one-tenth the cost of doing it yourself.*
