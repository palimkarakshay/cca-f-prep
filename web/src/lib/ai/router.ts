/* ------------------------------------------------------------------
   AI router — the single seam between the app and any LLM provider.

   Per plans/v2-scaled-b2b-plan.md §9:

     "All AI calls go through `lib/ai/router.ts` — a single file,
      one function `generate({ system, user, model })`. Default route:
      Anthropic via OpenRouter. No Anthropic SDK calls outside this
      file."

   Rules
   -----
   1. Do NOT import `@anthropic-ai/sdk` or `openai` outside this file.
   2. Do NOT use Anthropic-specific features (prompt caching, XML tool
      use, etc.) in core paths. When they land in Phase 2, isolate
      them to lib/ai/anthropic-features.ts with a graceful fallback.
   3. Prompt templates live in `prompts/*.md` and are imported as
      strings, never inlined.
   4. The router is server-only — never expose to the client bundle.
      The decoder + Ask-Claude callsites hit a route handler that
      itself calls this module.

   v1 status
   ---------
   This is a *stub*. With no OPENROUTER_API_KEY set, `generate()`
   returns the "not configured" error result. Callsites already
   understand the disabled state and fall back to the local
   heuristics (e.g. decodeJourney). When the key is configured and
   `NEXT_PUBLIC_AI_DECODER_ENABLED=1`, the real path lights up.

   Cost defenses listed in the plan — per-user / per-tenant rate
   limit, token-budget circuit breaker, result cache — are NOT
   included here yet. Adding them is a follow-up; the contract
   below is deliberately small so they slot in around it.
------------------------------------------------------------------ */

import "server-only";

export type ModelSlug =
  | "anthropic/claude-haiku-4.5"
  | "anthropic/claude-sonnet-4.6"
  | "anthropic/claude-opus-4.7"
  | (string & {}); // open for OpenRouter slugs we haven't named yet

export interface GenerateInput {
  /** System prompt — usually the markdown content of a prompts/*.md file. */
  system: string;
  /** User message. */
  user: string;
  /** Optional model override. Defaults to AI_DEFAULT_MODEL or Haiku. */
  model?: ModelSlug;
  /** Optional max tokens for the response. Defaults to a sane cap. */
  maxTokens?: number;
}

export type GenerateResult =
  | { ok: true; text: string; model: ModelSlug; promptTokens: number; completionTokens: number }
  | { ok: false; reason: "not-configured" | "rate-limited" | "budget-exceeded" | "upstream-error"; detail?: string };

const DEFAULT_MODEL: ModelSlug =
  (process.env.AI_DEFAULT_MODEL as ModelSlug | undefined) ?? "anthropic/claude-haiku-4.5";
const DEFAULT_MAX_TOKENS = 1024;

/**
 * The single entry point for AI generation. Returns a discriminated
 * union — callers MUST handle the disabled / error cases. There is
 * no thrown-exception path for "AI is off"; that state is reified.
 */
export async function generate(input: GenerateInput): Promise<GenerateResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "not-configured" };
  }

  const model = input.model ?? DEFAULT_MODEL;
  const maxTokens = input.maxTokens ?? DEFAULT_MAX_TOKENS;

  // Lazy fetch wiring deferred until the first paying path needs it.
  // The shape is locked here so the call site is stable; the body
  // below is a placeholder until Phase 1 §6 lights up.
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: input.system },
          { role: "user", content: input.user },
        ],
      }),
    });
    if (!res.ok) {
      return { ok: false, reason: "upstream-error", detail: `${res.status} ${res.statusText}` };
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    return {
      ok: true,
      text,
      model,
      promptTokens: json.usage?.prompt_tokens ?? 0,
      completionTokens: json.usage?.completion_tokens ?? 0,
    };
  } catch (err) {
    return {
      ok: false,
      reason: "upstream-error",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
