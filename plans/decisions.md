# Decisions log

> **Purpose.** Single source of truth for plan-level decisions made
> by the operator. Required by §11.7 (opportunity cost), §17b (kill-
> trigger response), §16.10 (cert commitment), §16.15 (founder fit
> proof), §16.12 (model swaps).
>
> **Format.** Each entry is one decision with a date, signer (operator
> or named reviewer), and rationale. Future-you needs to be able to
> find these when current-you is tempted to escalate scope.

---

## D-001 — Plan track choice

- **Date.** 2026-05-05
- **Signer.** Operator (reviewer not yet named; placeholder
  `<reviewer-tbd>`)
- **Decision.** Accept the §16 micro-SaaS shape after iter-01
  through iter-06 mitigation review. The venture-shape plan is
  retired (decks archived 2026-05-05 in
  `plans/archive-2026-05-04/`).
- **Rationale.** Negative study (2026-05-04) + 6 hostile review
  iterations identified ≥30 structural problems; 22 of them were
  closeable only by shrinking scope. The §16 shape is the only
  configuration where the bandwidth math, unit economics, and
  legal posture all close.
- **Sunset date.** Re-confirm at every quarterly §17b reviewer
  call.

---

## D-002 — Opportunity cost — accept or stop?

- **Date.** *(operator to fill in by 2026-05-12)*
- **Signer.** Operator + reviewer
- **Question.** "By choosing this side-bet, I am forgoing
  $20–35k of side-consulting income in Year 1 in exchange for $3–17k
  of project profit and Year-2 optionality. Do I believe Year-2
  optionality is worth at least $25k of present-value bet?"
- **Decision.** *(yes / no)*
- **Rationale.** *(operator writes 2–3 sentences.)*
- **Action if "no".** Take the side-consulting income directly.
  Stop the project; salvage CCA-F study repo as personal asset
  + open-source validator suite.

---

## D-003 — Reviewer name

- **Date.** *(operator to fill in by 2026-05-31)*
- **Signer.** Operator
- **Decision.** Reviewer name = *_______*
- **Rationale.** Per §17b: spouse, advisor, paid fractional CFO,
  or trusted friend with no skin in the game. Their job: 60-min
  quarterly call, sign + date kill-trigger responses.

---

## D-004 — Catalog choice

- **Date.** *(operator to fill in)*
- **Signer.** Operator
- **Decision.** Default catalog = Azure AI-103.
- **Rationale.** Iter-03 N22 / N28: AI-103 has 56-day window for
  first-mover advantage; AI-102 retires 2026-06-30; AI-103 is
  beta-then-live around the operator's launch. Backup catalog
  trigger at Month 6 if AI-103 search volume < 200/mo.

---

## D-006 — Day-job employment-agreement compatibility

- **Date.** *(operator to fill in by 2026-05-19)*
- **Signer.** Operator
- **Decision.** Side-bet is/is not compatible with day-job
  employment agreement.
- **Evidence.** Employment-agreement section reference / clauses
  reviewed.
- **Disclosure status.** Filed with employer / not required.
- **Action if incompatible.** Stop the §16 plan; consider §17.2
  of negative study (consulting with explicit disclosure).

---

## D-005 — Hosting choice

- **Date.** *(operator to fill in)*
- **Signer.** Operator
- **Decision.** Default hosting = *_______*.
- **Rationale.** Iter-05 N36: Vercel Pro pricing change makes it
  $30–80/mo realistic; Cloudflare Pages free or Render $19/mo
  preferred.

---

## What "success" means (per §16.15 / iter-06 N47)

The operator commits to the following definition of success
*before* the data comes in. All three must be true.

- **Definition 1 (financial):** Year-2 MRR ≥ $5k AND Year-2 net
  to operator ≥ $5k after costs and self-employment tax.
- **Definition 2 (learning):** By Year 2 the operator understands
  cognitive psychology applied to spaced learning well enough to
  (a) pass CCA-F at >800; (b) explain it to a non-expert in 30
  minutes; (c) ship at least one open-source contribution.
- **Definition 3 (life):** Spouse / family unaffected. No more
  than 12 hr/wk on this. Day-job performance unaffected.

If any of (1), (2), (3) are at risk and not recoverable in 90
days, the project stops per §17.

---

## Model swap log (§16.12)

| Date | From | To | Validator regression pass-rate | Decision |
|---|---|---|---|---|
| *(none yet)* | | | | |

## Kill-trigger response log (§17b)

| Date | Trigger | Reviewer | Operator response | Outcome |
|---|---|---|---|---|
| *(none yet)* | | | | |

---

## Weekly motivation log (iter-13 T-13.2)

Each Sunday, operator records: *"would I do this again knowing what I now know?"* 1–10.
Three consecutive weekly ratings <5 triggers a §17 stop-review
(mandatory reviewer call, not auto-stop).

| Week | Score | Note |
|---|---|---|
| *(starts at project commit)* | | |
