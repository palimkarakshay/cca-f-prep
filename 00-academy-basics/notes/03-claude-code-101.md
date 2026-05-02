# Claude Code 101 — notes

**Course:** [Claude Code 101](https://anthropic.skilljar.com/claude-code-101) ·
**Length:** ~1 hr · **Maps to:** Domain 2 — Claude Code Configuration & Workflows

## One-line summary

Orientation to the Claude Code CLI: the agent loop, permission model,
project-vs-user settings, and where instructions live (CLAUDE.md, slash
commands).

## 5 principles

1. **The agent loop is observe → plan → act → verify.** Tools are how it
   acts; context is how it observes; CLAUDE.md is how it remembers
   project rules across turns.
2. **Permissions are tiered, not binary.** Allow / Ask / Deny per tool,
   in `settings.json`. Project settings layer over user settings; both
   layer under enterprise managed settings.
3. **CLAUDE.md is project memory, not documentation.** It's read into
   every session's system context. Anything binding goes here; anything
   reference-only goes elsewhere and gets `@`-included on demand.
4. **Slash commands are reusable prompts**, not features. They expand
   into the user message; they're per-project (`.claude/commands/`) or
   personal (`~/.claude/commands/`).
5. **Settings cascade.** Enterprise managed > project `settings.json` >
   project `settings.local.json` > user `~/.claude/settings.json`. Higher
   tiers can lock fields lower tiers can't override.

## 2 failure modes

- **F-claudemd-bloat** — letting CLAUDE.md grow to thousands of lines.
  Bloat poisons the system context every turn. Fix is *relocate* into
  `reference/`, not summarize.
- **F-permissions-too-loose** — leaving `Allow *` for shell tools and
  hitting destructive operations. The blast radius is the file system,
  not just Claude's reasoning.

## Maps to CCA-F

- **Domain 2** directly: settings cascade, CLAUDE.md hygiene, slash
  commands, permission tiers — all show up as MCQ targets.
- Cross-feeds Domain 1 (the agent loop) and Domain 5 (CLAUDE.md as the
  context-window discipline boundary).

## Real-world hook (lumivara)

`palimkarakshay/lumivara-site` is the textbook example of CLAUDE.md +
`@AGENTS.md` discipline plus a `docs/_deprecated/` archive — i.e. *move*
not *summarize*.

## Recall prompts

1. What are the four agent-loop steps?
2. Where does an Enterprise-managed `permissions.deny` setting win over a
   user `permissions.allow`?
3. CLAUDE.md hits 4000 lines. What's the right fix in one word?
