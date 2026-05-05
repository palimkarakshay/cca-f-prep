# Iteration 04 — Mitigations

## Triage

| # | Finding | Triage | Closes in |
|---|---|---|---|
| N29 | NDA-violation risk on AI-103 prep | Structural (legal posture + author-before-pass discipline) | this iter |
| N30 | Trademark / domain landmines | Tactical (branding rule) | this iter |
| N31 | EU AI Act exposure | Structural (geo-fence + transparency) | this iter |
| N32 | No insurance / no LLC | Structural (incorporate + insure) | this iter |
| N33 | OSS validator license traps | Tactical (Apache 2.0 + provenance) | this iter |
| N34 | GDPR / CCPA unbudgeted | Tactical (privacy infrastructure) | this iter |
| N35 | Founder reputational exposure | Tactical (brand-first identity) | this iter |

---

## Consolidated mitigation: §16.11 "Legal & compliance posture"

Single canonical block to insert into the mitigation plan. Includes
the rules from N29, N30, N31, N33, N34, N35.

> ### 16.11 Legal & compliance posture (added 2026-05-05, iteration 04)
>
> **Entity.** Wyoming or Delaware LLC, single-member, formed by Day
> 30 of project start. ~$300 setup + $50/yr registered agent.
> Liability shield is the single highest-leverage legal protection.
>
> **Insurance.** General liability + cyber + E&O bundle: target
> $200/mo total ($2,400/yr). Buy at the moment first paying user
> exists, not before launch.
>
> **NDA / exam-content discipline.**
> 1. All practice questions are derived from publicly published
>    Microsoft Learn AI-103 Skills Measured documentation and Azure
>    AI Foundry official documentation.
> 2. Question authoring **completes before the operator takes
>    AI-103**. The operator does NOT update questions after the
>    exam attempt. Validator pipeline records `derived_from_public_doc_url`
>    for every question; missing field = question is rejected.
> 3. No marketing language: "exam dump," "real questions," "100%
>    pass rate," "exact exam questions," "memorize these and pass."
> 4. Marketing language: "objective-aligned practice questions,"
>    "covers Microsoft Learn skills measured," "spaced-repetition
>    of cognitive concepts."
>
> **Trademark / branding.**
> - Domain name: brand-first (e.g., "calibrant.io"). Do **not**
>   include "ai103," "azure," "microsoft," or any specific exam
>   code in the domain.
> - Marketing copy uses **nominative fair use only**: "practice
>   questions for the [Azure AI-103] exam" is fine; "Azure AI-103
>   Prep" as a brand is not.
> - Logos / badges: never reproduce Microsoft, AWS, GCP certification
>   badges. Operator's own visual identity exclusively.
> - Founder identity: brand-first, not founder-first. Operator's
>   personal name not on the public marketing site. Day-job remains
>   separate (no LinkedIn cross-link).
>
> **EU AI Act compliance posture.**
> - **Transparency banner** on every lesson and quiz page:
>   *"Generated with AI-assisted authoring + validator suite. Spot
>   an error? Email support@; we refund unconditionally on verified
>   errors."*
> - **Model card** at `/model-card` describing the LLMs used,
>   training data assumptions, validator pipeline, known
>   limitations.
> - **Provenance ledger** in DB: every lesson row tracks
>   `generated_by_model`, `generated_at`, `validator_pass_log`.
> - **High-risk classification:** calibration-Δ + retake mode are
>   framed as "study aid," not "exam-readiness assessment." The
>   product does not predict the user's exam outcome.
> - **Geo-fence EU customers entirely until conformity assessment
>   is feasible** (i.e., not in Y1 or Y2). Cookie banner + IP-based
>   blocker at signup. EU users see a "we're not yet available in
>   your region" page. This is the cleanest mitigation; revisit at
>   $5k MRR.
>
> **GDPR / CCPA / privacy.**
> - Privacy policy: template-adapted, reviewed by attorney
>   annually. ~$500/yr.
> - Public DSAR endpoint at `/privacy/dsar` with Notion-backed
>   form. ~4 hours setup.
> - Pre-signed DPAs from Stripe, Clerk, Anthropic, Vercel, Neon,
>   PostHog stored in `legal/dpa/`. Confirmed in §17b quarterly
>   audit.
> - Cookie consent banner (Cookiebot free / Klaro) for residual
>   non-EU traffic; EU geo-fence covers most.
>
> **Open-source license posture.**
> - Validator suite ships under **Apache 2.0**.
> - `TRAINING_DATA.md` describes exactly what tuned the validators
>   (operator's own notes; no scraped third-party content).
> - `THIRD_PARTY_NOTICES.md` lists all dependencies and licenses.
> - Disclaimer: *"This library does not include any exam content.
>   It validates user-submitted MCQ format only."*
> - No reference to Microsoft, AWS, GCP exam content in tests or
>   examples.

## N32 — Cost-basis update

Update §16.5 cost-basis table with the insurance line and amortised
LLC. New cost basis Y1: **$337–522 (API path)** / **$507–622 (Max path)**.

## N34 — Runbooks

Add `plans/runbooks/data-breach.md` (72-hour notification +
triage).

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — append §16.11,
   update §16.5 cost basis.
2. `plans/runbooks/data-breach.md` — created.
3. `plans/iterations/ledger.md` — append iteration-04.

---

## Streak counter

**Iter 04: 3 new structural findings + 4 tactical. Streak = 0/5.**
