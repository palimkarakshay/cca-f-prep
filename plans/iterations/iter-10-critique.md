# Iteration 10 — Streak-validation pass 2

> **Date.** 2026-05-05
> **Reviewer profile.** A pissed-off subscriber who paid $19/mo,
> didn't pass the exam, and is now going through every single
> document in the public-facing repo + the validator open-source
> library looking for grounds to chargeback, sue, post negative
> reviews, and warn other prospective buyers.
>
> Different angle than iter-09 (acquirer DD). This is the **adversarial
> *customer*** angle.

---

## Findings

### Structural

**N-attempt 1: refund policy ambiguity at edge cases.** The §16.2
"30-day money-back, no questions asked" — what about: subscriber
takes the exam at Day 35, fails, demands refund at Day 36? **Plan
doesn't address.**

→ This is **tactical**, not structural. The 30-day clock is fixed
public policy; "I took the exam at Day 35" doesn't extend it.
Dispute via chargeback handled by `runbooks/stripe-account-review.md`.

**N-attempt 2: founder qualifications visibility.** A pissed-off
subscriber Googles the operator's name → sees nothing about
expertise → questions the legitimacy of the product. The §16.11
brand-first identity rule (iter-04 N35) actually makes this
harder to debunk, since the founder is intentionally not on the
public marketing site.

→ Mitigation already explicit: founder identity stays brand-first.
The disgruntled-customer angle would prefer founder-on-site, but
that's the explicit tradeoff (iter-04 N35: legal/reputational
shield > marketing transparency at this scale). Not a new finding.

**N-attempt 3: validator suite is hollow.** The pissed-off subscriber
opens the open-source validator repo, sees the README listing 23
failure-modes but only 6 implementations. Posts on Reddit:
"Validator suite is fake, I checked."

→ Already addressed (iter-01 N9, mitigation plan §5 Step 0:
*code OR delete the missing 17 validators before any external
promotion*). The README must match shipped code at all times.
Not a new finding, but worth a runbook for handling such posts.

**N-attempt 4: lesson cites Microsoft Learn URLs that 404.**
Microsoft Learn URLs are unstable; the §16.11 NDA discipline says
"validator pipeline records `derived_from_public_doc_url`" but
URLs rot. Subscriber posts "your citations are dead links."

→ This **is** a real ops issue but it's tactical: add a quarterly
link-rot scan to the §17b reviewer call, fix dead links in the
catalog. Not structurally fatal.

**N-attempt 5: catalog content stale post-Microsoft-update.** The
operator passed AI-103 at, say, Month 3. The exam evolves — Microsoft
adds a new objective, retires another. Operator doesn't notice. Six
months later subscribers are studying outdated content; one fails
the exam, blames the platform.

→ This is **structural** in shape but already partially addressed:
- iter-05 N37 model-deprecation cycle covers LLM changes.
- iter-04 N29 NDA discipline says "questions derived from public
  Microsoft Learn AI-103 Skills Measured documentation."

What's *missing* is a periodic **content-freshness audit** — a
quarterly check that the lesson catalog still aligns with the
current Microsoft Learn skills outline. **Tactical fix:** add this
as a §17b reviewer-call line item.

→ Tactical, not structural. Add to §17b checklist.

**N-attempt 6: support inbox is the operator's personal inbox.**
The §16 plan has support@ as the support address but no docs on
what email infrastructure is used. If support@ is forwarded to the
operator's day-job inbox, the day-job employer has visibility into
customer complaints and the operator's side bet. Significant
employer-relations risk.

→ This **could** be structural depending on the operator's day-job
employment agreement. Many ABAP-developer roles have moonlighting
disclosure requirements. Worth flagging.

**Verdict on N-attempt 6:** structural-conditional. **The operator's
day-job moonlighting policy is not modeled anywhere in the plan.**

---

### Structural finding: N59 — Day-job employment-agreement risk is unmodeled.

The CLAUDE.md says the operator is an ABAP developer. ABAP /
SAP roles at large enterprises commonly have:
- **Moonlighting / outside-employment disclosure clauses** — the
  operator may need written approval before running a side
  business.
- **IP assignment clauses** — anything created on company equipment,
  during work hours, or "in the field" of company business may be
  IP-assigned to the employer.
- **Non-compete clauses** — typically narrow but check.

The §16 plan has the operator running a SaaS side bet without any
documented review of the day-job employment agreement.

**Risk vectors:**
1. **Employer discovers via LinkedIn / Reddit / chargeback.**
   Termination risk; severance affected.
2. **Employer discovers and claims IP rights** to the validator
   suite or catalog.
3. **Employer audits and finds Claude Code Max usage during work
   hours** (operator likely uses Claude Code at the day job too,
   per CLAUDE.md context). Data-loss / confidentiality concern.

**Mitigation:**

1. **Operator reads employment agreement before any commit to the
   side bet.** ~30 minutes; should be done before D-002 in
   `decisions.md`.
2. **If moonlighting requires disclosure, file the disclosure** —
   honest is safer than caught.
3. **All side-bet work happens on operator-owned hardware in
   personal hours.** Documented.
4. **Side-bet IP / domain registration in operator's name only**,
   not via day-job email or systems.

**Recommended edit.** Add a new D-006 in `decisions.md` and a
new §11.9 in mitigation plan:

> ### 11.9 Day-job employment-agreement compatibility (added 2026-05-05, iter-10 N59)
>
> Operator commits to:
> 1. **Read employment agreement** for moonlighting / IP / non-
>    compete clauses before D-002 in `decisions.md`.
> 2. **File required disclosures** with employer if moonlighting
>    review is required.
> 3. **All side-bet work on personal hardware in personal hours.**
> 4. **Side-bet IP registered to operator personally**, separate
>    from any day-job systems.
> 5. **If employment agreement is incompatible** (broad
>    non-compete, broad IP assignment), the §16 plan is the
>    wrong fit — consider §17.2 of negative study (consulting
>    day rates with disclosure to employer).

---

## Iteration 10 verdict

**New structural finding:** N59 (day-job employment-agreement risk).

**Streak resets to 0.** This was missed across 8 iterations because
the focus was on product/market/legal-of-the-product, not on the
operator's employment context. The customer-adversarial angle
caught it.

**Tactical findings:**
- T-10.1: Add quarterly link-rot scan to §17b checklist.
- T-10.2: Add quarterly content-freshness audit (Microsoft Learn
  outline diff) to §17b checklist.
- T-10.3: Document support@ inbox as a non-day-job-affiliated
  email (Fastmail / Workspace personal account).

**Streak: 0/5.**

The 5-pass streak target may take more than 13 iterations. The
operator should set a hard cap at iteration 13 either way, per
iter-06 N48.
