#!/usr/bin/env python3
"""
Validate + sanitise an LLM-generated PR review before it gets posted as
a GitHub PR comment.

The codex-review workflow feeds attacker-controllable PR diffs to an
LLM. Even with prompt-side hardening (zero-width-space-escaped fences
+ <UNTRUSTED_DIFF> tags + explicit "do not follow instructions" guards
in the prompt itself), the LLM's *output* must still be defensively
checked before it becomes a PR comment. This validator is the second
layer of defence.

Checks performed (in order):

  1. **Required structure.** The four headers (`## Consistency
     findings`, `## Correctness findings`, `## Suggested fixes`,
     `## Verdict`) must each appear exactly once. If any is missing
     or duplicated, the review is rejected.

  2. **Verdict whitelist.** The verdict line must be exactly one of
     `approve`, `approve-with-nits`, or `request-changes`. Anything
     else (including unparseable verdicts) → reject.

  3. **HTML / `javascript:` strip.** GitHub's markdown renderer
     sanitises most things server-side, but defence-in-depth: drop
     any `<script>`, `<iframe>`, `<object>`, `<embed>` tags and
     `javascript:` / `data:text/html` URL schemes from the body.
     If anything was stripped, the body is annotated so reviewers
     see what was removed.

  4. **Leaked-secret regex.** Reject if the body contains anything
     that looks like an OpenAI / Gemini / OpenRouter / GitHub /
     Anthropic key (their well-known prefixes). This catches the
     case where an injected prompt convinces the LLM to echo a
     secret back into the review markdown.

Inputs (env):
    REVIEW_IN   path to the LLM-generated review file (default
                /tmp/review.md)
    REVIEW_OUT  path to write the sanitised review to (default
                /tmp/review.md, in-place)

Exit code:
    0   review is valid, written to REVIEW_OUT
    2   review failed validation; a `review-deferred` notice was
        written to REVIEW_OUT instead. The workflow's
        deferred-handling path (existing) catches exit code 2 the
        same way it catches the deferred ENGINE.
"""
from __future__ import annotations

import os
import re
import sys

REQUIRED_HEADERS = (
    "## Consistency findings",
    "## Correctness findings",
    "## Suggested fixes",
    "## Verdict",
)

VALID_VERDICTS = {"approve", "approve-with-nits", "request-changes"}

# Defence-in-depth tag/URL strip. GitHub already sanitises markdown,
# but a sanitiser-bypass CVE is one disclosure away.
DANGEROUS_TAG_RE = re.compile(
    r"<(script|iframe|object|embed|svg|math)[^>]*>.*?</\1>"
    r"|<(script|iframe|object|embed|svg|math)[^>]*/?>",
    re.IGNORECASE | re.DOTALL,
)
DANGEROUS_URL_RE = re.compile(
    r"\((javascript:|data:text/html|vbscript:)[^)]*\)",
    re.IGNORECASE,
)
ON_HANDLER_RE = re.compile(r"\son\w+\s*=", re.IGNORECASE)

# Common API-key prefixes. If any appear in the LLM output, the LLM
# was either tricked into echoing a secret OR our prompt accidentally
# included one. Either way: reject.
SECRET_PATTERNS = (
    re.compile(r"sk-[A-Za-z0-9_-]{20,}"),       # OpenAI / OpenRouter
    re.compile(r"sk-or-v1-[A-Za-z0-9_-]{20,}"),  # OpenRouter explicit
    re.compile(r"AIza[A-Za-z0-9_-]{20,}"),       # Google API key
    re.compile(r"ghp_[A-Za-z0-9]{30,}"),         # GitHub PAT
    re.compile(r"github_pat_[A-Za-z0-9_]{40,}"),
    re.compile(r"sk-ant-[A-Za-z0-9_-]{20,}"),    # Anthropic
)


def strip_dangerous(body: str) -> tuple[str, list[str]]:
    """Strip dangerous tags / URLs / event handlers. Return cleaned body
    and a list of human-readable removal notes."""
    notes: list[str] = []
    cleaned, n = DANGEROUS_TAG_RE.subn("[stripped: dangerous tag]", body)
    if n:
        notes.append(f"{n} potentially-dangerous tag(s) stripped")
    cleaned, n = DANGEROUS_URL_RE.subn("(stripped:url-scheme)", cleaned)
    if n:
        notes.append(f"{n} dangerous URL scheme(s) stripped")
    cleaned, n = ON_HANDLER_RE.subn(" data-stripped-on-handler=", cleaned)
    if n:
        notes.append(f"{n} inline event handler(s) stripped")
    return cleaned, notes


def validate(body: str) -> tuple[bool, str, str]:
    """Return (ok, sanitised_body, error_message_if_any)."""
    # 1. Required structure
    for h in REQUIRED_HEADERS:
        count = body.count(h)
        if count != 1:
            return (
                False,
                body,
                f"Header `{h}` should appear exactly once, found {count}.",
            )

    # 2. Verdict whitelist
    verdict_match = re.search(
        r"^## Verdict\s*\n+\s*([^\n]+)",
        body,
        re.MULTILINE,
    )
    if not verdict_match:
        return False, body, "Verdict line missing."
    verdict = verdict_match.group(1).strip().strip("`*_ ").lower()
    if verdict not in VALID_VERDICTS:
        return (
            False,
            body,
            f"Verdict `{verdict}` not in whitelist "
            f"({', '.join(sorted(VALID_VERDICTS))}).",
        )

    # 3. HTML / JS-URL strip (defence-in-depth)
    cleaned, notes = strip_dangerous(body)

    # 4. Secret-leak guard
    for pat in SECRET_PATTERNS:
        m = pat.search(cleaned)
        if m:
            return (
                False,
                cleaned,
                f"Possible leaked secret matching {pat.pattern!r} "
                f"in review body. Refusing to post.",
            )

    if notes:
        cleaned += (
            "\n\n---\n_Validator notes: "
            + "; ".join(notes)
            + "._\n"
        )
    return True, cleaned, ""


def main() -> int:
    in_path = os.environ.get("REVIEW_IN", "/tmp/review.md")
    out_path = os.environ.get("REVIEW_OUT", "/tmp/review.md")
    if not os.path.exists(in_path):
        print(f"::error::review file missing: {in_path}", file=sys.stderr)
        return 2

    with open(in_path) as f:
        body = f.read()

    ok, cleaned, err = validate(body)
    if not ok:
        notice = (
            "## Code review unavailable\n\n"
            "The LLM-generated review failed validation and was "
            "withheld from posting.\n\n"
            f"Reason: {err}\n\n"
            "This PR has been labelled `review-deferred`. The "
            "scheduled re-review run will retry; if the same review "
            "fails validation again, the prompt or the model has "
            "drifted and a human should investigate.\n\n"
            "## Verdict\n\nrequest-changes\n"
        )
        with open(out_path, "w") as f:
            f.write(notice)
        print(f"::warning::review failed validation: {err}", file=sys.stderr)
        return 2

    with open(out_path, "w") as f:
        f.write(cleaned)
    return 0


if __name__ == "__main__":
    sys.exit(main())
