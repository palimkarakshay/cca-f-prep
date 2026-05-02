# Domain 2 — Claude Code Configuration & Workflows

**Exam weight: 20%.** Sub-areas: CLAUDE.md hygiene, settings.json
cascade, hooks vs. memory vs. CLAUDE.md, slash commands, Skills, hooks
on the lifecycle, Claude Code in CI.

## One-line summary

Configuration discipline is about routing each rule to the **mechanism
that matches its trust requirement**: harness-enforced (hooks),
context-loaded (CLAUDE.md), user-invoked (slash commands), or
model-selected (Skills). Pick wrong and the rule is advisory when it
needed to be a guarantee.

## 5 principles

1. **CLAUDE.md is RAM, not a database.** Loaded into every session's
   system context. Anything binding goes here; anything reference-only
   goes to `docs/` / `reference/` and is `@`-included on demand. When
   it bloats: **relocate**, do not summarize (F2 — compression reflex
   is the classic exam trap).

2. **Mechanism by trust requirement.** "Every time X" / "from now on
   when X" → **hook in `settings.json`** (harness-enforced,
   deterministic). Project rules / charter → **CLAUDE.md** (advisory,
   model-interpreted). Reusable user-triggered prompt → **slash
   command** (user-invoked). Discoverable capability the model picks
   into → **Skill** (model-selected at runtime).

3. **Settings cascade (highest → lowest precedence):** enterprise
   managed > CLI flags > `.claude/settings.local.json` (local project,
   gitignored) > `.claude/settings.json` (shared project, checked in)
   > `~/.claude/settings.json` (user). **Local project beats shared
   project** — easy to invert under exam pressure.

4. **Hook events have semantic granularity, not just timing.** Pick
   `Stop` for per-turn actions ("after the task"), `PostToolUse` for
   per-tool actions ("after each edit"), `PreToolUse` for blocking
   guards, `UserPromptSubmit` for input-time policy, `SessionStart`
   for boot-time setup. Map "every time …" wording to the matching
   event before answering.

5. **Skills vs. slash commands vs. hooks vs. CLAUDE.md** differ by
   *invocation model*: Skills are model-discovered and model-selected;
   slash commands are user-typed; hooks are harness-fired on lifecycle
   events; CLAUDE.md is always-loaded passive context. A skill that
   should have been a hook is unenforced; a hook that should have been
   a Skill misses the discovery flexibility.

## 2 failure modes

- **F-soft-rule-for-hard-need** — using CLAUDE.md / system prompt
  language for a security-critical guardrail. Model can disobey. Fix:
  hook.
- **F-claudemd-bloat** — letting CLAUDE.md grow to 10k+ tokens. Bloat
  poisons every turn's context. Fix: relocate to `reference/`,
  `@`-include only what is still binding.

## Maps to CCA-F sub-areas

- *CLAUDE.md hygiene* — diagnostic-01 Q4
- *Hooks vs. memory vs. CLAUDE.md* — diagnostic-01 Q5
- *Settings cascade & permissions* — basics-diagnostic Q (B5.2)
- *Slash commands* — basics-checklist B5.4
- *Skills* — basics-checklist B7.1–B7.4
- *Claude Code in CI surface* — basics-checklist B6.5

## Real-world hook (lumivara)

`CLAUDE.md` opens with `@AGENTS.md` to pull in the binding charter,
then keeps only the practical build/test layer. `docs/_deprecated/`
and `docs/00-INDEX.md` exist precisely so historical material doesn't
bloat the active charter — *move, don't summarize* in production form.

## External reading (see `08-cheat-sheets/external-resources.md`)

- Claude Code best practices (official) — ground truth for hooks,
  settings, slash commands, CLAUDE.md
- *How Anthropic teams use Claude Code* (PDF) — concrete patterns from
  internal teams
- *Building agents with the Claude Agent SDK* — same primitives, SDK
  surface
- HumanLayer "Writing a good CLAUDE.md" — <300-line discipline

## Recall prompts

1. CLAUDE.md hits 12k tokens. Right fix in one word — and what's the
   trap word that looks right but isn't?
2. User says "every time you finish a task, run lint." Which mechanism,
   and which event specifically?
3. Settings cascade — order from highest to lowest, including CLI
   flags. Which two are easy to invert?
4. Skill vs. slash command vs. hook vs. CLAUDE.md — distinguish by
   *invocation model* in one phrase each.
5. Hook for blocking dangerous shell commands — which event, and why
   not `PostToolUse`?
