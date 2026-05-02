# Introduction to Model Context Protocol — notes

**Course:** [Introduction to MCP](https://anthropic.skilljar.com/introduction-to-model-context-protocol) ·
**Length:** ~2 hr · **Maps to:** Domain 3 — Tool Design & MCP Integration

## One-line summary

MCP standardizes how external tools, resources, and prompts plug into an
LLM client. Three primitives, two transports — closed list.

## 5 principles

1. **Three MCP primitives:** **tools** (executable, side-effecting,
   model-invoked), **resources** (read-only data referenced by URI,
   usually app/user-invoked), **prompts** (reusable user-invoked
   templates). Don't confuse them; the exam tests primitive-fit
   directly.
2. **Two transports — closed list:**
   - `stdio` — local single-user, server is a child process.
   - `HTTP+SSE` (now also "streamable HTTP") — remote / multi-user.
   Anything else (WebSockets, gRPC, named pipes) is wrong on MCP
   questions.
3. **Tool descriptions are the model's only documentation.** Schema +
   description is what the model uses to choose between tools; bad
   descriptions look like "model picks the wrong tool" bugs.
4. **Servers are per-capability, not per-team.** A clean MCP design is
   small focused servers (one per integration) composed by the client,
   not one giant "company server."
5. **Auth and identity live at the transport layer**, not in tool
   schemas. For `HTTP+SSE`, OAuth-style flows; for `stdio`, the parent
   process owns identity. Putting credentials into tool inputs is
   structurally wrong.

## 2 failure modes

- **F-wrong-primitive** — exposing a static document as a tool (it
  should be a resource), or a workflow as a resource (it should be a
  prompt).
- **F-transport-confusion** — picking WebSockets/gRPC for MCP. They
  aren't options.

## Maps to CCA-F

- **Domain 3** is mostly this course. Expect at least 4–6 questions on
  MCP transports, primitives, schema design, tool-description quality.

## Recall prompts

1. A team wants to expose a database query helper to Claude. Tool,
   resource, or prompt?
2. Two valid MCP transports — name them.
3. Model picks the wrong tool. First fix?
