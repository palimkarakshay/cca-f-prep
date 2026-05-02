# Claude 101 — notes

**Course:** [Claude 101](https://anthropic.skilljar.com/claude-101) ·
**Length:** 30–60 min · **Maps to:** conceptual base (no single CCA-F domain)

## One-line summary

Orientation to Claude.ai as a product surface — chat UI, projects, file
uploads, artifacts. Non-technical scope; no API.

## 5 principles

1. **Claude.ai ≠ the Claude API.** The product surface (chat, projects,
   artifacts) is built on top of the API; choices like context limits,
   model versions, and rate limits at the product layer are separate from
   what the API exposes.
2. **Projects are scoped memory.** A "project" gives a persistent system
   prompt + a small file corpus shared across chats inside it — closer to
   a CLAUDE.md than a vector store.
3. **Artifacts are isolated, re-renderable outputs.** They exist so long
   work products (code, docs, diagrams) don't pollute conversational
   context and can be iterated on directly.
4. **Files in chat are inlined into context, not retrieved.** They count
   against the context window the same as text. There is no semantic
   search at this layer.
5. **Per-product limits are enforced UI-side.** Daily message caps,
   context length, and model selection are subscription-tier features —
   they don't reflect API capability.

## 2 failure modes

- **F-conflate-product-and-api** — assuming Claude.ai's project memory
  works like an embeddings store, or that artifacts persist across
  accounts. They don't.
- **F-context-not-retrieval** — uploading 30 files to a project and
  expecting Claude to retrieve the relevant one. They are *all* in
  context (or truncated); there's no RAG here.

## Maps to CCA-F

Mostly orientation. Useful only as scaffolding for the distinction
between **conversation memory**, **persistent project memory**, and
**retrieval** that recurs in Domain 5 (Context & Reliability).

## Recall prompts (cover the page, answer aloud)

1. What's the difference between a Project file and a RAG corpus?
2. Why are Artifacts a separate construct instead of inline messages?
3. Where does Claude.ai's daily message cap come from — model, plan, or both?
