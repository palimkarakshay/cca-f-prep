# Iteration 08 — Mitigations

## Triage

| # | Finding | Triage | Closes in |
|---|---|---|---|
| N54 | First-mover advantage erodes during build | Structural (catalog re-pick logic) | this iter |
| N55 | Cloudflare ops complexity | Tactical (host-rank reorder) | this iter |
| N56 | Financial framing still soft | Structural (rewrite §16.5) | this iter |
| N57 | No exit / wind-down documentation | Tactical (write §16.16) | this iter |
| N58 | No consolidated v2 plan doc | Structural (defer to post-streak) | next iter cycle |

---

## N54 — Catalog logic re-routed

Update §16.3:

> **Default catalog (revised iter-08 N54):**
>
> 1. **CCA-Architect or CCA-Developer (Anthropic) catalog** if those
>    certs launch within the operator's build window
>    (≤ 2026-08-01). The operator has the only credible "I built
>    this *while* studying for the same cert" story.
> 2. **AI-103 with explicit anti-first-mover positioning** — "we
>    came late but better: calibration-Δ, real spaced repetition,
>    retake mode."
>
> Default switches to **(1)** if Anthropic CCA-Developer launches
> before 2026-08-01; otherwise **(2)**. Decision recorded in
> `decisions.md` D-004.

## N55 — Hosting rank reorder

Update §16.1 hosting block:

> **Hosting options ranked by operator-time-cost (revised iter-08 N55):**
> 1. **Render Professional ($19/mo)** — Postgres bundled, Node
>    standard, lowest ops complexity. Default for §16.
> 2. **Vercel Pro ($20–80/mo)** — best DX, accept cost variance.
> 3. **Cloudflare Pages + Workers (free, commercial-OK)** —
>    cheapest cash but highest learning curve. Choose only if
>    operator is already familiar with Cloudflare.

## N56 — Financial framing rewrite

Replace §16.5:

> ### 16.5 The realistic numbers (revised iter-08 N56)
>
> | Metric | Year 1 | Year 2 |
> |---|---|---|
> | Paying users (net of churn) | 30–150 | 150–600 |
> | MRR (Y1: floor 0 first 9 months) | $0–500 (M1–M9), $500–2,000 (M10–12) | $2,000–8,000 |
> | Operator hours / week | 12 (sustainability cap) | 12 |
> | Cost basis | $332–552/mo | $400–800/mo |
> | Y1 revenue total | $2,000–8,000 | $24,000–96,000 |
> | Y1 cost total | $4,000–6,600 | $4,800–9,600 |
> | Y1 net before labour | -$4,600 to +$1,400 | $14,400–86,400 |
> | Y1 implicit labour cost | $31,200 | $31,200 |
> | **Y1 net after labour** | **-$36,000 to -$30,000** | **-$17,000 to +$55,000** |
>
> **Year 1 is a labour-loss-funded learning project.** Net to
> operator's bank account is small to mildly negative.
>
> Cost-basis breakdown per §16.5 above; revenue derived from Y1
> SEO-only motion (per §16.3) at the conservative end of the range.
>
> The case for proceeding rests entirely on:
> 1. Learning is intrinsically valuable.
> 2. Year-2 optionality (Y2 net could be +$55k in best case).
>
> If neither motivates, §16 is the wrong shape; consider §17.2 of
> the negative study (consulting day rates).

## N57 — Exit / wind-down

Add §16.16 (per critique content) — three pre-defined paths
(acquihire, passive, wind-down).

## N58 — Defer

Defer to post-streak-validation (after iter-13 if needed).

---

## Edits to canonical files (this commit)

1. `plans/business-viability-mitigation-plan.md` — N54, N55, N56, N57.
2. `plans/iterations/ledger.md` — append.

---

## Streak counter

**Iter 08: 3 structural + 2 tactical. Streak = 0/5.**
