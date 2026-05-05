# Iteration 12 — Streak-validation pass (2/5 target)

> **Date.** 2026-05-05
> **Reviewer profile.** A skeptical infrastructure SRE who's worked at
> Cloudflare and Stripe and knows how SaaS systems break under load.

## Re-attack

Walked the canonical plan looking for **operational resilience**
gaps not yet attacked. Cross-referenced 8 runbooks against 2026
SRE best practice for solo-operated SaaS.

### Considered angles

- **DDoS / abuse:** Render and Cloudflare both provide some baseline
  DDoS protection; Vercel does not by default. Not modeled in
  hosting choice. Tactical.
- **Account takeover via OAuth:** Clerk handles, but secondary
  factors (TOTP) not enforced. Tactical.
- **Supply-chain compromise on npm packages:** the operator's build
  pulls hundreds of npm dependencies. A `colors`/`event-stream`-
  style attack could compromise the build. **No mitigation
  modeled.**
- **Anthropic outage / rate-limit:** the cost-circuit-breaker
  (§16.13) handles spend, but doesn't handle availability. If
  Anthropic is down for 6 hours, content authoring stops; that's
  fine because authoring is asynchronous. Customer-facing impact
  is zero.
- **Stripe outage:** signup paused; customer-facing impact is users
  can't subscribe for the duration. Recovery is automatic.
  Tactical mitigation: status banner.
- **Domain registrar lock-in:** if the operator's domain registrar
  fails, recovery is messy. Use a reputable registrar (Porkbun,
  Cloudflare Registrar) and enable transfer lock + 2FA.
- **Single-key compromise:** Stripe API key, Anthropic key, etc.
  Rotation policy not documented.

### Findings

**Structural: 0.** None of these are fatal at the §16 scale.

**Tactical:**
- **T-12.1.** TOTP / 2FA enforcement on operator's accounts (Clerk,
  Stripe, Anthropic, GitHub, registrar, Vercel/Render, Neon,
  email). One-time setup; ~30 minutes; eliminates whole class of
  attacks. Add to launch checklist.
- **T-12.2.** Supply-chain hardening: `pnpm audit` in CI; Dependabot
  PRs reviewed weekly; pinned versions in lockfile (no caret
  ranges in deps). Add to §16.4 / §16.12 model-discipline block.
- **T-12.3.** Quarterly secret rotation in §17b: rotate
  ANTHROPIC_API_KEY, STRIPE_API_KEY, CLERK_SECRET_KEY at minimum.
  Add to checklist.
- **T-12.4.** Domain registrar specification: Porkbun or Cloudflare
  Registrar (transfer-locked, 2FA on, contact info masked).
  Update §16 hosting block.

## Verdict

**0 structural, 4 tactical. Streak: 2/5.**
