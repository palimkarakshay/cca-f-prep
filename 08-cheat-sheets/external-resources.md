# External Resources — Beyond Anthropic Academy

> Curated outside-Academy sources, scoped to CCA-F exam domains.
> Vetted 2026-05-02. Cottage-industry "CCA-F prep" courses deliberately
> excluded — primary sources only. Cross-vendor material excluded
> unless directly applicable in the exam's vocabulary.

## Domain 1 — Agentic Architecture & Orchestration (27%)

The single highest-weight domain. The user-flagged weakness on the cold
diagnostic was *architectural rationale*, which lives here.

| Resource | Why |
|---|---|
| [Building effective agents](https://www.anthropic.com/research/building-effective-agents) (Schluntz & Zhang) | Workflows vs. agents and the five canonical patterns. **Highest-ROI single read for D1.** |
| [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | Orchestrator-worker case study with token-economics tradeoffs — the kind of "why does this pattern win" reasoning the exam tests. |
| [When (and how) to use multi-agent systems](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them) | The *negative* case — when **not** to reach for multi-agent. Trains tradeoff judgment directly. |
| [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Initializer + incremental-coding harness pattern. Cross-feeds D5. |
| [anthropic-cookbook /patterns/agents](https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents) | Minimal reference implementations for every pattern in the post above. Read the code. |
| [ReAct (Yao et al., 2022, arXiv 2210.03629)](https://arxiv.org/abs/2210.03629) | Reasoning-action interleave underlying every modern agent loop. Read once; skip the experiment tables. |

## Domain 2 — Claude Code Configuration & Workflows (20%)

| Resource | Why |
|---|---|
| [Claude Code best practices](https://code.claude.com/docs/en/best-practices) | Official. Ground truth for hooks, settings, slash commands, CLAUDE.md. |
| [How Anthropic teams use Claude Code (PDF)](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf) | Concrete CLAUDE.md, hook, and slash-command patterns from internal teams. The closest thing to "how a working architect actually configures this." |
| [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk) | Same primitives as Claude Code, exposed as an SDK. Useful for understanding the agent loop without the IDE-specific surface. |
| [Writing a good CLAUDE.md (HumanLayer)](https://www.humanlayer.dev/blog/writing-a-good-claude-md) | Practitioner write-up reinforcing the "<300 lines, charter not documentation" discipline. |

## Domain 3 — Tool Design & MCP Integration (18%)

| Resource | Why |
|---|---|
| [modelcontextprotocol.io](https://modelcontextprotocol.io/) | Canonical spec. Read the *Architecture*, *Tools*, *Resources*, *Prompts*, and *Sampling* pages — that's the D3 vocabulary verbatim. |
| [modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol) | Spec source of truth. Track here for transport changes (e.g., Streamable HTTP). |
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | Reference servers (Filesystem, Git, Fetch, Memory, Sequential-Thinking, Everything). Read the Filesystem + Git server source to see *tool boundary* design in practice. |
| [python-sdk](https://github.com/modelcontextprotocol/python-sdk) / [typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | Official SDKs. The type signatures encode the protocol's invariants — useful sanity-check for "is this primitive really a tool/resource/prompt?" |
| [Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Anthropic's tool-design rubric. Pairs tightly with B4.4 ("model picks wrong tool → fix the description first"). |
| [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) | Parallel calls and structured outputs. Cross-feeds D4. |

## Domain 4 — Prompt Engineering & Structured Output (20%)

| Resource | Why |
|---|---|
| [Claude prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) | Official. XML tags, prefill, role-play, chain-of-thought — exam vocabulary. |
| [anthropic-cookbook /tool_use](https://github.com/anthropics/anthropic-cookbook) | JSON-schema validation + retry loops, in code. Concretizes "structured output beats prompt-level requests." |
| [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) | Structured outputs section directly maps to diagnostic-01 Q8 (constrained decoding > soft prompt requests). |

## Domain 5 — Context Management & Reliability (15%)

| Resource | Why |
|---|---|
| [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | "Attention budget" framing. Canonical for D5 — the lens that makes "compress vs relocate" obvious. |
| [Prompt caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | Cache breakpoints, TTL choices, prefix discipline. Diagnostic-01 Q10 lives here. |

## Explicitly rejected (do not study from)

- "CCA-F prep" cottage-industry sites (claudecertifications.com,
  claudecertifiedarchitect.net, certsafari, flashgenius,
  dynamicbalaji, agilefever, Udemy/Medium clones). Useful only for
  cross-checking exam structural facts; not for content study.
- Cross-vendor material (OpenAI Function Calling deep-dives, generic
  "LLM agent" Medium posts). Conceptually adjacent, but the exam tests
  Anthropic's vocabulary. Studying cross-vendor introduces noise.
- Anything >12 months old on rapidly-moving topics (MCP transport,
  Claude Code hook events, prompt caching pricing). Spec drift makes
  old write-ups actively misleading.

## How to use this list

- **Read order if starting cold:** D1 *Building effective agents* →
  D5 *Effective context engineering* → D2 *Claude Code best practices*
  → D3 *modelcontextprotocol.io Architecture page* → D4 *Claude prompting
  best practices*. That sequence builds the architect-rationale layer
  before the platform-mechanism layer, which is the order the cold
  diagnostic showed was needed.
- **Don't skim.** These are short. Read each end-to-end and write one
  line per principle into the corresponding domain's `notes.md` (when
  those exist).
- **One pass, then stop.** Re-reading is the lowest-yield study activity
  per `transition-plan.md` § Phase A. Treat each link as a single-shot
  generation prompt for your own notes, not a re-readable reference.
