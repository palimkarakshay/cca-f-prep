"use client";

import { useState } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/content/curriculum-types";

// Claude.ai reads ?q=<prompt> on /new and on project pages to pre-fill
// the chat input. Cap the inline prompt to keep the URL under common
// proxy/browser limits (~8 KB); the full prompt still lands in the
// clipboard when truncation kicks in.
const MAX_INLINE_PROMPT_CHARS = 6000;

function appendPromptToUrl(baseUrl: string, prompt: string): string {
  try {
    const url = new URL(baseUrl);
    const trimmed =
      prompt.length > MAX_INLINE_PROMPT_CHARS
        ? prompt.slice(0, MAX_INLINE_PROMPT_CHARS) +
          "\n\n[Prompt truncated for URL — paste from clipboard for full context.]"
        : prompt;
    url.searchParams.set("q", trimmed);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function buildPrompt(opts: {
  conceptCode: string;
  conceptTitle: string;
  question: string;
  lesson: Lesson | null;
}): string {
  const { conceptCode, conceptTitle, question, lesson } = opts;
  const body =
    lesson?.paragraphs?.join("\n\n") ?? "(lesson body not yet authored)";
  const keyPoints =
    lesson?.keyPoints && lesson.keyPoints.length > 0
      ? "\n\nKey points:\n- " + lesson.keyPoints.join("\n- ")
      : "";
  return [
    `Concept ${conceptCode} — ${conceptTitle}`,
    "",
    "Source lesson:",
    body + keyPoints,
    "",
    "My question:",
    question.trim() || "(write your question here)",
  ].join("\n");
}

export function AskClaudePanel({
  conceptCode,
  conceptTitle,
  lesson,
}: {
  conceptCode: string;
  conceptTitle: string;
  lesson: Lesson | null;
}) {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function copyAndOpen() {
    const prompt = buildPrompt({ conceptCode, conceptTitle, question, lesson });
    let copied = false;
    try {
      await navigator.clipboard.writeText(prompt);
      copied = true;
    } catch {
      // Clipboard may be blocked; we still open Claude with the prompt in the URL.
    }
    const base = siteConfig.claudeProjectUrl || siteConfig.claudeFallbackUrl;
    const url = appendPromptToUrl(base, prompt);
    setStatus(
      copied
        ? "Prompt copied and pre-filled in the chat that just opened."
        : "Prompt pre-filled in the chat that just opened (clipboard copy was blocked)."
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyOnly() {
    const prompt = buildPrompt({ conceptCode, conceptTitle, question, lesson });
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("Prompt copied to clipboard.");
    } catch {
      setStatus("Copy failed.");
    }
  }

  return (
    <section className="mt-8 border-t border-dashed border-(--border) pt-6">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-(--accent-2)">
        Ask Claude
      </h3>
      <p className="mt-1 text-sm text-(--muted)">
        Build a prompt with this lesson + your question, copy it, and open the
        Claude Project in a new tab.
      </p>
      <label htmlFor="ask-claude-input" className="sr-only">
        Your question
      </label>
      <textarea
        id="ask-claude-input"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What's confusing about this concept?"
        rows={3}
        className="mt-3 w-full resize-y rounded-md border border-(--border) bg-(--panel-2) p-3 text-sm leading-relaxed text-(--ink) focus:border-(--accent) focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={copyOnly}>
          <Copy className="h-3.5 w-3.5" aria-hidden /> Copy prompt
        </Button>
        <Button variant="default" size="sm" onClick={copyAndOpen}>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open in Claude
        </Button>
      </div>
      {status ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-2 min-h-[1.2em] text-xs text-(--good)"
        >
          {status}
        </p>
      ) : null}
    </section>
  );
}
