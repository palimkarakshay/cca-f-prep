# Runbook: Anthropic model deprecation / migration

## Triggers

- Anthropic deprecation notice (≥60 days advance per Anthropic's
  policy).
- Pricing change on a pinned model.
- New model that delivers materially better quality at equal cost.

## Pre-emptive hardening (launch-blocking)

1. **Pin exact model versions** in API calls:
   `claude-sonnet-4-6-20251015`, `claude-haiku-4-5-20251001`.
   Never use alias names that auto-upgrade.
2. **Validator regression suite** at `tests/validators/` — 50–100
   prompt + expected-output pairs covering each validator class
   and at least 5 sample lessons. Runs on every model swap.
3. **Per-model prompt templates.** If a prompt template depends
   on model-specific behavior (cache breakpoint shape, tool-use
   schema), version it: `prompts/v1-sonnet-4-6.ts` etc.
4. **Provider abstraction.** All Anthropic calls go through a
   `lib/llm.ts` wrapper that exposes a vendor-neutral interface.

## Migration steps (per swap, ~4–8 operator hours)

1. Read the deprecation notice; identify the recommended
   replacement model.
2. Update the model-version constant in `lib/llm.ts`. Open a PR;
   CI runs the validator regression suite.
3. **If regression suite passes (≥98% pass rate):** deploy to
   production behind a feature flag at 10% traffic for 24 hours,
   monitor cost + quality.
4. **If regression suite fails (<98% pass rate):** triage which
   prompts broke; update prompt templates; re-run regression.
   Loop.
5. **Content-pack revalidation.** Re-run validators on existing
   lessons. Flag any lesson whose validator score regressed; fix
   manually. ~30 min to several hours depending on scope.
6. Update `model-card.md` with the new model.
7. Document the swap in `decisions.md` with date and reason.

## RTO

- 60 days from notice to deprecation = ~30 evening hours over 8
  weeks of part-time work. Comfortably within Anthropic's grace
  window.

## What can go wrong

- Anthropic shortens the notice window (rare but happened in 2025
  for one model). Mitigation: monitor `model-deprecations` page
  weekly via cron + Resend email.
- New model degrades on the operator's specific prompt patterns.
  Mitigation: regression suite catches this before deploy.
- Cost regression (newer model more expensive at equal quality).
  Mitigation: cost is a regression criterion; the validator suite
  fails the swap if cost > 2× previous model.
