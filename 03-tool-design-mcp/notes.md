# Domain 3 — Tool Design & MCP Integration

**Exam weight: 18%.** Sub-areas: tool descriptions, MCP primitives,
MCP transports (closed list), schema design, server organisation,
auth placement.

## One-line summary

The model's only documentation for a tool is its description and
schema. MCP standardises three primitives (tools / resources /
prompts) over two transports (`stdio` / `Streamable HTTP`). Most
"model picks the wrong tool" bugs are description bugs.

## 5 principles

1. **Tool descriptions are the model's only documentation.** When the
   model picks the wrong tool, the **description is the first thing
   to fix** — not a rename, not a system-prompt nudge, not a tool
   merge. A good description names: what it operates on, input shape,
   ideal-use scenarios, and what it does *not* handle. Differentiation
   > naming > nudging.

2. **MCP primitives — three core, two emerging.** Core (exam-tested):
   **tools** (executable, side-effecting, model-invoked), **resources**
   (read-only data referenced by URI, app/user-invoked), **prompts**
   (reusable user-invoked templates). Emerging in the spec:
   **sampling** (server asks client to run an LLM call), **roots**
   (client tells server which paths/URIs are in-scope). Don't expose a
   static document as a tool, or a workflow as a resource — primitive
   misfit is a direct exam target.

3. **MCP transports — closed list of two.** `stdio` for local
   single-user (server is a child process; lifecycle bound to the
   client; no port; no auth surface). **Streamable HTTP** (legacy
   name: HTTP+SSE) for remote / multi-user. **WebSockets, gRPC, named
   pipes are not MCP transports** — cross them out on first read (F6
   — closed-list miss).

4. **Server-per-capability, not server-per-team.** Clean MCP design is
   small focused servers (filesystem, git, fetch) composed by the
   client, not one giant "company server." Composability is the win;
   monolithic MCP servers re-create the integration spaghetti MCP was
   meant to solve.

5. **Auth lives at the transport, not in tool inputs.** For
   `Streamable HTTP`, OAuth-style flows. For `stdio`, the parent
   process owns identity. Putting credentials into tool input schemas
   is structurally wrong — the schema is for the model; the model
   should never handle credentials.

## 2 failure modes

- **F-transport-confusion** — picking WebSockets/gRPC for MCP. They
  aren't options. Closed list of two.
- **F-description-debt** — vague tool descriptions ("Search the system
  for documents" / "Find files") cause selection errors that look like
  model bugs. Fix the description first; only escalate to API redesign
  if the descriptions are already maximally differentiated.

## Maps to CCA-F sub-areas

- *Tool description quality* — diagnostic-01 Q7
- *MCP transport choice* — diagnostic-01 Q6
- *MCP primitives* — basics-diagnostic Q (B4.1)
- *Server organisation* — basics-checklist B4.5
- *Auth placement* — basics-checklist B4.6

## External reading (see `08-cheat-sheets/external-resources.md`)

- modelcontextprotocol.io — canonical spec; read Architecture, Tools,
  Resources, Prompts, Sampling
- modelcontextprotocol/servers — Filesystem and Git servers as
  reference designs for tool-boundary discipline
- *Writing effective tools for AI agents* (Anthropic) — official tool-
  design rubric
- *Advanced tool use* — parallel calls, structured outputs

## Recall prompts

1. Two valid MCP transports — name them, and the legacy term for the
   second.
2. Three core MCP primitives — name them and what each is invoked by
   (model / app / user).
3. "Model picks the wrong tool." First fix?
4. Where does auth live for an MCP server, and why not in tool inputs?
5. Server-per-capability vs. monolith — which wins, and why?
