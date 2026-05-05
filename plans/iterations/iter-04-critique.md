# Iteration 04 — Hostile Review (Legal / IP / Liability)

> **Date.** 2026-05-05
> **Stance.** This pass attacks the **legal exposure** of selling
> AI-generated cert-prep questions in a niche dominated by NDA-bound
> exam content. Microsoft's certification NDA, the CompTIA candidate
> agreement, and the trademark provisions are the binding constraints
> nobody in the prior plan documents has considered. There are real
> ways to get sued here, and the operator's solo-LLC has no defensive
> capital.
> **Reviewer profile assumed.** A startup-counsel attorney who has
> defended three "study material" companies against trademark and
> NDA-violation claims and seen how Pearson VUE / Microsoft / CompTIA
> respond to flagged content.
> **Output.** New legal-shaped findings (N29+).

---

## N29 — The "AI-103 practice questions" framing risks NDA scrutiny.

**The operator's plan**: AI-generates practice questions for AI-103.
**The legal landscape**:

- Microsoft's certification NDA states: *"You are expressly
  prohibited from disclosing, publishing, reproducing, or
  transmitting this exam, in whole or in part, in any form or by
  any means, verbal or written, electronic or mechanical, for any
  purpose."* (Microsoft Certification Exam – Candidate Agreement.)
- The NDA binds the **certified individual** — i.e., anyone who
  has *taken* the exam. The operator has *not* taken AI-103 yet
  per iter-03 N26, so the operator is not directly bound by the
  AI-103 NDA.
- **However**, once the operator passes AI-103 (per the iter-03
  Day-90 commitment), the operator becomes an NDA signatory and
  cannot author practice questions that resemble actual exam
  questions.
- **Detection.** Microsoft uses data forensics — they compare
  test-takers' patterns of correct/wrong answers across exam
  delivery to flag candidates whose pattern suggests memorised
  content from a specific source. If a critical mass of operator's
  customers pass AI-103 with a measurable forensic signature, the
  operator's content gets flagged regardless of intent.
- **Consequences if flagged.** Microsoft can revoke the operator's
  AI-103 certification (after passing it), revoke certifications of
  customers who used the materials, and pursue legal action against
  the operator for tortious interference + NDA violation.

**Why this is structural.** The operator's pitch — "I passed AI-103
so I know what's on it" — is, by Microsoft's framing, a literal NDA
violation if the questions are too close to real exam content.
"Inspired by" is fine; "memorised and rephrased" is not. The line
is enforced via forensics, not just intent.

**Mitigation paths:**

1. **Author questions BEFORE passing AI-103.** This is consistent
   with iter-03 N26's commitment to attempt AI-103 within 90 days,
   *but the question authoring must happen before the attempt.* The
   operator drafts questions from the public AI-103 Microsoft Learn
   study guide + Azure AI Foundry documentation, and explicitly
   does NOT update the questions after taking the exam.
2. **Mark questions as "objective-aligned, not exam-aligned."**
   Make a clear public claim: questions are derived from the
   published AI-103 Skills Measured outline, not from exam content.
   This is also true (and verifiable in the validator pipeline:
   each question must cite a specific Microsoft Learn skill code).
3. **Avoid the "passing rate" claim.** "100% of our students
   passed" implies the questions match real exam content.
   Don't make the claim.
4. **Don't market with the term "exam dump" or "real questions."**
   Both are hot-button NDA terms.

**Recommended edit.** Mitigation plan §16 needs a §16.11 — *"Legal
posture on exam content"*:

> All practice questions are derived from publicly published
> Microsoft Learn AI-103 Skills Measured documentation and Azure
> AI Foundry official documentation. Questions are NOT derived
> from exam attempts (the operator has explicitly committed to
> drafting before taking the exam, per iter-04 N29). All marketing
> avoids the terms "exam dump," "real questions," or "guaranteed
> pass." All public lesson pages cite the specific Microsoft Learn
> skill codes from which the question is derived.

---

## N30 — Trademark use of "Azure," "Microsoft," "AI-103" requires careful disclaimers.

Microsoft's trademark provisions (Microsoft Certification Program
Agreement) bar third parties from registering, adopting, or using
any name, trademark, domain name, or designation that includes or
violates Microsoft's rights in any Certification Marks or Microsoft
trademark.

**What's safe vs unsafe:**

| Use | Safe |
|---|---|
| Domain "ai103prep.com" | **UNSAFE** — incorporates exam code without authorization |
| Domain "aigentprep.com" + tagline "for the AI-103 exam" | Safe (descriptive, not appropriation) |
| Page title "Azure AI-103 practice questions" | Safe (nominative use) |
| Logo using Microsoft's certification badge | **UNSAFE** — uses certification mark |
| "Powered by Azure" | **UNSAFE** unless operator is on Azure (operator is on Vercel + Anthropic, not Azure) |
| Use of "Microsoft" or "Azure" as keywords for paid ads | Safe but contestable |

**Risk vectors:**
- A poorly-chosen domain registrable as a UDRP cybersquatting
  complaint can be transferred to Microsoft on 60-day timeline
  for ~$1,500 in WIPO arbitration cost. The operator's response
  would cost $5–15k in legal fees.
- Use of the official Microsoft certification badge (the colored
  hexagonal logo) is a clear trademark violation; common DMCA-
  style takedown for a $0–500 cost to Microsoft.
- Marketing copy that says "endorsed by Microsoft" or "official"
  is straight-up false advertising.

**Recommended edit.** Add to §16.11:

> Domain name: do not include "ai103," "azure," "microsoft,"
> or any specific exam code. Branded domains only (e.g.,
> "calibrant.io" + sub-pages for each exam catalog).
> Marketing copy uses **nominative fair use only**: "practice
> questions for the [Azure AI-103] exam" is fine; "Azure AI-103
> Prep" as a brand name is not.
> Logos/badges: never reproduce Microsoft's certification badge.
> Use the operator's own visual identity exclusively.

---

## N31 — AI-generated content liability under the new Italian/EU AI Act.

The EU AI Act (live for general-purpose AI obligations as of
August 2026 per implementation timeline; certain transparency
obligations already in effect Q1 2026):

- **Transparency obligation:** AI-generated content distributed in
  the EU must disclose AI involvement in a way the user can
  understand. The §16 plan currently has no such disclosure on
  lesson pages.
- **Content provenance:** systems generating educational content
  need to tag the model used and the provenance chain. PostHog
  doesn't do this; the plan has no provenance ledger.
- **Risk-tier classification:** "training systems" sit in the
  AI-Act high-risk tier if used for assessment of educational
  outcomes. **The §16 plan's calibration-Δ + retake mode could
  arguably qualify** as a high-risk system, requiring conformity
  assessment + CE marking.
- **Penalties.** EU AI Act fines: up to €15M or 3% of worldwide
  turnover for non-compliance with transparency obligations; up
  to €35M or 7% for prohibited-use violations. For a solo-LLC,
  this is "everything you have."

**The operator's exposure:**
- If any EU customer signs up, the platform falls under EU AI Act
  jurisdiction.
- The plan currently does not geo-fence EU users, so EU exposure
  is the default.
- Compliance work for transparency obligations: AI-disclosure
  banner per lesson, model-card publication, provenance ledger.
  ~20–40 hours of operator time.
- Compliance work IF qualified high-risk (assessment system):
  external conformity assessment ($15–50k), risk-management
  system documentation, post-market monitoring obligations,
  registration in EU AI database. **This is fatal to the §16
  plan.**

**Recommended edit.** Add to §16.11:

> **EU AI Act compliance posture:**
> 1. **Transparency banner** on every lesson and quiz page: *"This
>    content was AI-generated and validated by [validator suite]. Spot
>    an error? Email support@; we refund unconditionally on verified
>    errors."* Must satisfy Article 50 transparency obligation.
> 2. **Model card** at `/model-card` describing the LLMs used,
>    training data assumptions, validator pipeline, known
>    limitations.
> 3. **Provenance ledger** in DB: every lesson row tracks
>    `generated_by_model`, `generated_at`, `validator_pass_log`.
> 4. **High-risk classification check.** Calibration-Δ + retake
>    mode arguably constitute "assessment systems" under Annex III
>    of the AI Act. Either:
>    - **Drop the assessment-shape framing** — present
>      calibration-Δ as "study aid," not "exam-readiness assessment."
>      Keep retake mode as "review of weak topics," not "exam-
>      readiness predictor."
>    - **Or geo-fence EU users out of the calibration-Δ feature**
>      until conformity assessment is completed (which is fatal to
>      the §16 budget).
> 5. **Geo-fence EU customers entirely** until the operator can
>    afford conformity-assessment costs. Cookie-banner + IP-region
>    block at signup. This is the cleanest mitigation.

---

## N32 — Liability insurance is unbudgeted.

The operator is selling educational content, AI-generated, to
exam-takers who will fail exams. **Lawsuits in this space are real:**
- A user sues for "I paid for prep that promised passing rate; I
  failed." Small-claims court: $0–$5k operator cost.
- A user sues for "I followed the spaced review instruction and
  the algorithm scheduled the wrong topics for my exam date."
  Negligence claim: $5–25k legal cost.
- The exam vendor (Microsoft) sues for NDA violation per N29
  detection. Tortious interference: $50k+.

**Standard B2C-SaaS insurance coverage**:
- General liability + cyber: ~$500–1,000/yr.
- E&O (errors and omissions) for educational content: $1,500–
  3,000/yr.
- D&O if incorporated: $1,500–4,000/yr.

**Recommended edit.** Mitigation plan §16.5: add a $200/mo
insurance line. **And** §16.11: incorporate as Wyoming or
Delaware LLC at the start (cost: $300 + $50/yr registered agent),
giving the operator entity-level liability shield.

---

## N33 — Open-source validator suite has its own license trap.

Iter-01 N9 / mitigation plan §5: open-source validator suite as a
Claude Skill / npm package.

**License selection traps:**

- **MIT** is permissive and the obvious choice — but the operator's
  validator suite includes prompt templates derived from prior
  Claude API documentation. Anthropic's documentation is licensed
  under an Anthropic-specific terms-of-use that may not allow
  derivative redistribution. **Need to audit each prompt template
  for derived-from-Anthropic-docs claims** before publishing.
- **GPL / AGPL** would force commercial users to also open-source
  their code; this kills the "L&D teams adopt this internally"
  motion the mitigation plan banked on.
- **Apache 2.0** has the best balance but introduces patent-grant
  language that some enterprises avoid (especially Microsoft and
  Salesforce).

**The trickier issue: training-data attribution.** If the
validators were trained or tuned on real exam-prep content scraped
from the web (Tutorials Dojo, Brainscape question banks, etc.),
those question banks may be copyrighted. The plan does not
document the training/tuning data lineage. Without that
documentation, the open-source library carries copyright-
infringement risk for any user who deploys it.

**Recommended edit.** Add to §16.11:

> Open-source validator suite ships under **Apache 2.0** with:
> - A clear `TRAINING_DATA.md` describing exactly what was used to
>   tune validator prompts (operator's own CCA-F study notes
>   only, no scraped content).
> - A `THIRD_PARTY_NOTICES.md` listing Anthropic SDK + any other
>   dependencies and their licenses.
> - An explicit disclaimer: *"This library does not include any
>   exam content. It validates user-submitted MCQ format
>   only."*
> - No reference to Microsoft, AWS, GCP exam content in tests
>   or examples.

---

## N34 — Privacy / GDPR / CCPA compliance is unbudgeted.

The §16 plan stores: user email, Stripe customer ID, lesson
progress (which questions answered, which wrong), calibration-Δ
data per user, and exam-date target.

**This is "data linked to identifiable individuals" under GDPR /
CCPA.** Compliance obligations:

- **Privacy policy.** Drafted-by-template at minimum; lawyer-
  reviewed if EU traffic. $300–800.
- **Data subject access request (DSAR) handling.** A documented
  process to respond to "what data do you have on me?" and
  "delete my data" requests within 30 days. ~4 hours of one-time
  setup + ~30 min per request.
- **Data processing agreements (DPA) with sub-processors.**
  Stripe, Clerk, Anthropic, Vercel, Neon, PostHog all need DPAs
  signed and stored. Some have public DPAs (Stripe, Clerk);
  others require explicit signature.
- **Breach notification.** 72-hour notification to relevant DPA
  on personal data breach. The plan has no playbook.
- **CCPA "Do Not Sell" link.** Required for California traffic.

**Recommended edit.** Add to §16.11:

> Privacy compliance:
> 1. Privacy policy template adapted to the platform; reviewed
>    by attorney annually. Y1 cost: $500.
> 2. Public DSAR endpoint at `/privacy/dsar` with a Notion-form
>    backed flow. ~4 hours of one-time setup.
> 3. Pre-signed DPAs from Stripe, Clerk, Anthropic, Vercel, Neon,
>    PostHog stored in `legal/dpa/`. Confirmed at quarterly §17b
>    audit.
> 4. **Add a `runbooks/data-breach.md`** with 72-hour notification
>    template and triage steps.
> 5. Cookie consent banner (third-party libraries: Cookiebot, Klaro)
>    for EU/UK traffic. Cookiebot free tier OK at <100 pages.

This is roughly **20 hours of one-time work and $500/yr
overhead.**

---

## N35 — Right-of-publicity and "founder is the brand" risk.

The §16 plan + iter-03 N26 has the operator personally pass AI-103
and brand the operator as the founder. **Two specific risks:**

1. **Doxxing / harassment.** A failed exam-taker who blames the
   prep tool can find the operator's name + day-job and harass.
   Cert-prep niches have a track record of this (one Whizlabs
   founder dealt with a 2-year harassment campaign).
2. **Reputational asymmetry.** A *single* viral negative review
   names the founder by name. The Reddit post permanently shows
   up in Google results for the operator's name.

**Mitigations:**
- Use a brand name, not the operator's personal name, for the
  product (already implicit in §16.11 above).
- The operator's day job (ABAP development) should not be
  cross-linked publicly.
- LinkedIn / Twitter handles for the brand should be separate from
  the operator's personal handles.

**Recommended edit.** Add to §16.11:

> Founder identity: brand-first, not founder-first. The operator's
> personal name is not on the public marketing site. "Founded by
> [Operator]" appears only on `/about` if the operator chooses;
> the operator's day-job remains separate.

---

## Iteration 04 verdict

**New structural findings:** N29 (NDA risk), N31 (EU AI Act risk),
N32 (no insurance / no LLC).

**3 new structural findings.** Mitigated by the §16.11 add (legal
posture — comprehensive policy block).

**Tactical findings:** N30 (trademark), N33 (license traps), N34
(privacy/GDPR), N35 (founder reputation).

**Streak counter: still 0/5.** Iter-04 is not clean.

**Notable.** Iter-04's findings push the cost basis up by **~$200/mo
(insurance + privacy compliance)** and push the launch-readiness
checklist out by **~25 hours of one-time legal/compliance work.**
This is real. The §16 plan should not launch without these in
place.
