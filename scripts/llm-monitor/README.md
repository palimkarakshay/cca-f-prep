# `llm-monitor` — bot self-awareness pipeline

## What this is

A scheduled collector + analyzer that reads the wider conversation about
the LLMs and SDKs **this repo's bot fleet depends on** (Claude, the
Anthropic SDK, Codex, Gemini, MCP, Claude Code itself) and feeds the
findings back into the codebase so the bots are **self-aware** of:

* current bugs / regressions / outages other people have hit,
* new best practices and prompt patterns,
* deprecated APIs or model IDs,
* features and tools we should adopt.

The output is a digest **plus** an auto-maintained
[`docs/llm-monitor/KNOWN_ISSUES.md`](../../docs/llm-monitor/KNOWN_ISSUES.md)
that the codex-review prompt (and any future deep-research / delegation
prompts) can ingest as context. That is the "self-awareness" layer —
every executor run starts from the last 14 days of field reports
instead of frozen training data.

Adapted from `palimkarakshay/lumivara-site` — only the core pipeline
pieces required for code review, deep research, and automation
self-awareness on this repo. Newsletter / dual-lane / Vercel-specific
machinery from the upstream is intentionally not included.

## Cadence (tiered)

Two cron tiers, picked by `--mode`:

| Tier | Cron | Collectors | Outputs | Purpose |
|---|---|---|---|---|
| **watch** | every 15 min (`4,19,34,49 * * * *`) | `statuspages` | `KNOWN_ISSUES.md`, auto-issues | Outage detection on Anthropic / OpenAI / GitHub / Cloudflare / Hugging Face |
| **sweep** | every 2 h (`13 */2 * * *`) | all 6 collectors | digest + KNOWN_ISSUES + RECOMMENDATIONS + auto-issues | Full content sweep |

Watch and sweep share the same dedupe set (`state/seen.json` via
actions/cache), so an outage caught at 11:04 by the watch tier won't
re-emit when the 13:13 sweep runs. They also share the
`llm-monitor` concurrency group so writes to `KNOWN_ISSUES.md` are
serialised.

Workflows:
[`llm-monitor-watch.yml`](../../.github/workflows/llm-monitor-watch.yml) +
[`llm-monitor.yml`](../../.github/workflows/llm-monitor.yml).

## Architecture (three layers, kept separate)

```
collectors/        →  store.py            →  analyzer.py        →  digest.py + feedback.py
(per-source         (normalize + dedupe    (Claude Opus           (writes digest +
 fetchers)           in JSON state)         classifier)            updates KNOWN_ISSUES,
                                                                   auto-files issues)
```

1. **Collectors** (`collectors/*.py`) — one per source. Each takes no
   arguments, reads its config from `sources.json`, and prints one
   normalized JSON record per line to stdout (JSONL). They do not write
   to the store directly; the orchestrator does.
2. **Store** (`store.py`) — append-only JSONL files under
   `state/raw/<YYYY-MM>.jsonl` plus a `state/seen.json` url-hash
   dedupe set. No DB dependency — `gh` CI runners only get stdlib +
   `gh`.
3. **Analyzer** (`analyzer.py`) — batches new records into a single
   Claude Opus call (Anthropic → Gemini → OpenAI ladder) that
   classifies each `{bug, feature, best-practice, comparison, news,
   noise}`, extracts the model/SDK mentioned, scores severity +
   novelty, and writes a structured JSON output.
4. **Digest** (`digest.py`) — renders the analyzer output into a daily
   Markdown digest committed to
   `docs/llm-monitor/digests/YYYY-MM-DD.md`.
5. **Feedback** (`feedback.py`) — turns high-signal records into:
   * upserts into `KNOWN_ISSUES.md` (so prompts pick them up),
   * upserts into `RECOMMENDATIONS.md` (so architecture passes pick
     them up),
   * GitHub issues labelled `auto-discovered` for actionable items.

## Running locally

```bash
# Full sweep (default — every 2h tier). Runs all 6 collectors,
# rewrites digest, refreshes KNOWN_ISSUES + RECOMMENDATIONS.
ANTHROPIC_API_KEY=... \
REDDIT_CLIENT_ID=... REDDIT_CLIENT_SECRET=... \
GH_TOKEN=$(gh auth token) \
python3 scripts/llm-monitor/run.py --mode=sweep

# Watch tier — every 15 min. Statuspages only; skips digest rewrite.
# Used for outage detection between sweeps.
python3 scripts/llm-monitor/run.py --mode=watch

# Single-collector debugging
python3 scripts/llm-monitor/collectors/hackernews.py
python3 scripts/llm-monitor/collectors/statuspages.py
```

## Source list

Configured in [`sources.json`](sources.json). Covers:

* **HackerNews** — Algolia API, no auth. Story + comment search.
  Sweep-only.
* **RSS** — Anthropic news, OpenAI blog, Google DeepMind, Simon
  Willison, Latent Space, Hugging Face, GitHub changelog,
  Import AI (Jack Clark), TLDR AI. Sweep-only.
* **Reddit** — r/LocalLLaMA, r/ClaudeAI, r/OpenAI, r/singularity,
  r/MachineLearning. Public JSON or OAuth (rate limit difference).
  Sweep-only.
* **GitHub** — releases + recent issues for the SDKs / CLIs we
  depend on (`anthropics/anthropic-sdk-{python,typescript}`,
  `anthropics/claude-code`, `openai/openai-python`,
  `googleapis/python-genai`). Sweep-only.
* **Stack Overflow** — questions tagged `anthropic`, `claude`,
  `claude-code`, `openai-api`. Anonymous StackExchange API;
  `STACKEXCHANGE_API_KEY` optional for higher quota. Sweep-only.
* **Statuspages** — `/api/v2/status.json` + `/api/v2/incidents/unresolved.json`
  for Anthropic / OpenAI / GitHub / Cloudflare / Hugging Face.
  **Used by both watch and sweep tiers.**

## Secrets

The pipeline runs out of the box on **only** the secrets you already
have for codex-review (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `GH_TOKEN`
provided automatically). To enable the other collectors at full
capacity:

| Collector | Secrets to add | Where to get | Cost |
|---|---|---|---|
| Anthropic analyzer (preferred) | `ANTHROPIC_API_KEY` | https://console.anthropic.com | Pay-as-you-go |
| Reddit (authed)¹ | `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` | https://www.reddit.com/prefs/apps → "create app" → "script" | Free |
| Stack Overflow (authed)² | `STACKEXCHANGE_API_KEY` | https://stackapps.com/apps/oauth/register → script-type OAuth | Free |

¹ Reddit also works **without** auth via the public JSON endpoints, at
~60 req/min. The collector falls back to that path automatically if the
secrets are absent. For continuous CI use, authed mode is recommended.

² Stack Overflow works **without** auth at 300 req/day per IP (plenty
for our every-2h cadence — ~84 req/day). The key only matters if the
tag list grows past ~20 entries. Skip until needed.

When ready to enable, add the secret in **Settings → Secrets and
variables → Actions** and the workflow will pick it up on the next run
— no code changes needed.

## Self-awareness feedback loop

This is the load-bearing piece. Without it, the digest is just a
newsletter. The loop:

1. Analyzer marks a record `severity: high` and `kind: bug` if it's a
   confirmed regression in a model/SDK we use.
2. `feedback.py` upserts a one-line entry into
   [`KNOWN_ISSUES.md`](../../docs/llm-monitor/KNOWN_ISSUES.md)
   under the matching section (Claude / SDK / MCP / etc.).
3. The codex-review prompt (and any future deep-research / delegation
   prompts) include `KNOWN_ISSUES.md` as pinned context, so every bot
   run starts the day having "read the morning paper".
4. For items with severity `high` AND a clear action ("upgrade SDK",
   "switch model ID"), feedback also opens a GitHub issue labelled
   `auto-discovered` + `infra-allowed` so the existing review pipeline
   (and any future delegation pipeline) can pick it up like any other
   backlog item.

The result: **the bots learn from the field every day**, without the
operator hand-curating a changelog.
