# Domain 5 — Context Management & Reliability

**Exam weight: 15%** (lowest, but cross-feeds D1 and D2). Sub-areas:
context windows, prompt caching, batching, retries, retrieval vs.
whole-document, watermarks (cross-domain).

## One-line summary

Context is an **attention budget**, not a storage budget. Reliability
comes from (a) putting the right content in the right slot, (b)
caching what's stable, (c) chunking/retrieving what's too big, and
(d) bounding loops so partial work survives failure.

## 5 principles

1. **Context is attention, not storage.** Claude can hold 200k tokens
   *technically*; quality degrades sharply past ~50% utilisation.
   "Send the whole thing and hope" is the canonical anti-pattern when
   input is >70% of the window. Decide between **send-whole / chunk-
   and-summarize / retrieval** by *item independence*, not by total
   size alone.

2. **Prompt caching wins big when a stable prefix is reused.** Place
   `cache_control` at the boundary between stable content (system
   prompt + reference docs) and dynamic content (user message). Cache
   reads ~10% of base input cost; writes ~25% premium (5-min TTL).
   Break-even is roughly 2–3 reuses; with hundreds of calls/day the
   savings are dominant.

3. **Batching is for throughput, caching is for cost-of-prefix.**
   Batching amortises per-call overhead. Caching kills the
   send-30k-tokens-500-times problem. They solve different bugs;
   conflating them is a common distractor.

4. **Bounded loops with watermark exits** (cross-domain with D1):
   ~80% context fill → commit + clean exit; ~95% → hard exit. A clean
   exit is success. Without watermarks, retries silently consume the
   budget that was meant for the *answer*.

5. **Retries and timeouts are first-class reliability surfaces.**
   Idempotent tool calls retry safely; non-idempotent ones must be
   detected (request IDs, side-effect checks) before retry. A retry
   policy that re-runs `send_email` on timeout is a production bug
   waiting to happen.

## 2 failure modes

- **F-compression-reflex** — reaching for "summarize / shrink /
  compress" when the structural answer is *relocate* (move to disk,
  `@`-include) or *retrieve* (chunked search). Compression loses
  fidelity; relocation preserves it. Diagnostic-01 hit this twice
  (Q4 and Q9).
- **F-cache-misplacement** — putting volatile content (today's date,
  user ID) inside the cached prefix, or putting the cache breakpoint
  *before* stable reference content. Both kill the hit rate.

## Maps to CCA-F sub-areas

- *Prompt caching strategy* — diagnostic-01 Q10
- *CLAUDE.md hygiene as context discipline* — diagnostic-01 Q4
  (cross-feeds D2)
- *Bounded loops & watermarks* — diagnostic-01 Q3 (cross-feeds D1)
- *Retrieval vs. whole-document* — basics-checklist (B6.x)
- *System field leak (caching)* — basics-checklist B3.6

## Decision tree (from `08-cheat-sheets/decision-trees.md`)

```
input > 50% of window?
  no  → send whole
  yes → independent items?
          yes → chunk + summarize per chunk
          no  → retrieval (search/embed)
```

## External reading (see `08-cheat-sheets/external-resources.md`)

- *Effective context engineering for AI agents* — "attention budget"
  framing; canonical for D5
- Prompt caching docs (official) — breakpoints, TTL, prefix discipline
- *Effective harnesses for long-running agents* — cross-feeds D1

## Recall prompts

1. 30k-token system prompt, 200-token user, 500 calls/day. Biggest
   cost lever?
2. Cache reads cost what fraction of base input?
3. Retrieval vs. chunk-and-summarize vs. send-whole — what's the
   deciding question?
4. CLAUDE.md hits 12k tokens. Why is "summarize with an LLM" wrong?
5. Watermark exits — at what context fill, and what action at each?
   (Yes, this overlaps D1 — that's the point: same answer, two domains.)
