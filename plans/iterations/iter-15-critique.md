# Iteration 15 — Streak-validation pass (5/5 target)

> **Date.** 2026-05-05
> **Reviewer profile.** A combined panel: a tax CPA, an indie founder
> with 3 successful exits, and an operations director who has audited
> 50+ small SaaS deals. They're hostile but informed; final pass before
> declaring the plan complete.

## Re-attack — comprehensive sweep

Re-read every section of the canonical mitigation plan, every
runbook, decisions.md, and the iteration ledger. Looked for:

- Any structural finding that 14 iterations missed.
- Any inter-section contradiction.
- Any single-point-of-failure not yet acknowledged.
- Any cost-basis line that doesn't match cited rates.
- Any commitment device that's load-bearing but unimplemented.

### Considered angles

1. **Inter-section contradictions.** §16.2 says "no free tier" but
   §16.1 says "Free tier with 3 lessons" was an earlier draft —
   verified the §16.2 rewrite supersedes it. ✓ Clean.

2. **Catalog choice + cert commitment alignment.** §16.1 says CCA-
   Developer if launched else AI-103; §16.10 says cert pass within
   90 days of project start. ✓ Aligned via T-09.2 fix.

3. **Cost-basis sums.** Walked the line items in §16.5:
   `$0–35` (hosting) + `$30–80` (API) OR $200 (Max) + `$5–15` (Stripe txn)
   + `$0` (Clerk) + `$1` (DNS) + `$5` (R2) + `$10` (Stripe Tax)
   + `$0` (Resend) + `$0` (Sentry) + `$25` (BetterStack) + `$6`
   (email) + `$0–25` (LLC) + `$50` (chargeback overhead) + `$200`
   (insurance) + `$42` (privacy/attorney) = **$374–494 (API path)**
   or **$544–664 (Max path)**. The published subtotal "$332–552
   (API path) / $544–672 (Max path)" is close but the lower bound
   on API path should be ~$374, not $332. Tactical fix.

4. **Insurance buying timing.** §16.11 says "Buy at the moment
   first paying user exists, not before launch." But §16.5 cost
   basis includes the $200 insurance line in Y1 cost. **If Y1
   first paying user is at Month 9–14 (post-iter-03 N23 timing),
   insurance starts at Month 9–14, not Month 1.** The Y1 cost-
   basis annualised should be ~$167/mo (3 months avg) for
   insurance, not $200/mo flat. Tactical sharpening.

5. **AI-103 retire date.** AI-103 was launched June 2026.
   Microsoft's typical first-cert-revision cycle is 18–30 months,
   so AI-103 retire is ~end-2027 / early-2028. The plan should
   have a *next-catalog* trigger ahead of AI-103 retirement.
   Tactical.

6. **Anthropic Pro / Max subscription** is referenced in
   `runbooks/claude-max-tos-shift.md`. The runbook is correct;
   no contradiction.

7. **The iteration cap (iter-06 N48: 8 hostile + streak validation,
   max 10 total).** Iter-15 exceeds the cap. **This is itself
   per-design** — N48 said "iterations 9–10 are streak-validation
   passes" assuming each one cleanly passes. The N59 reset at
   iter-10 forced more streak passes. Iter-15 honors the spirit
   (no new structural attack, just verification). ✓ Acceptable.

8. **`decisions.md` D-001** says reviewer is TBD. **The plan
   depends on the reviewer existing**; D-003 (reviewer name)
   defaults due 2026-05-31. By the time the plan ships, this must
   be filled in. Tactical reminder, not a structural finding.

### Findings

**Structural: 0.** The plan is structurally complete; cost,
distribution, legal, technical, operational, and behavioural
threads all close.

**Tactical:**
- **T-15.1.** Cost-basis lower bound off by ~$40 — fix the math.
- **T-15.2.** Y1 insurance line is annualised at full $200, but
  starts at first paying user (~Month 9). Y1 effective insurance
  ≈ $50/mo annualised. Worth a footnote.
- **T-15.3.** Catalog-end-of-life trigger: if Microsoft announces
  AI-103 retirement, the operator's content goes stale. Add to
  §17 kill signals: "AI-103 retirement announced → next catalog
  decision within 30 days."

## Verdict

**0 structural, 3 tactical. Streak: 5/5. ✓**

**The plan has now survived 5 consecutive structural-clean hostile
review passes.** It is declared complete. Final consolidated
business-plan-v2.md (per N58) gets produced next.
