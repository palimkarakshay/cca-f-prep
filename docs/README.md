# `docs/` — CCA-F practice runner

Single-file static MCQ runner for the diagnostics in this repo. One HTML, no
build step, no dependencies. Open `index.html` directly or serve it via GitHub
Pages.

## Run locally

```sh
# either
open docs/index.html

# or, if you want a real http origin (so localStorage persists per-host)
python3 -m http.server -d docs 8000
# → http://localhost:8000
```

## Deploy on GitHub Pages

There's a workflow at `.github/workflows/pages.yml` that builds and deploys
`docs/` on every push to `main`. It does the artifact upload + deploy, but
**Pages itself has to be enabled once** by hand — the default `GITHUB_TOKEN`
in Actions has `pages: write` (deploy) but not admin scope (enable), so the
workflow can't flip the switch for you.

One-time setup:

1. Go to repo **Settings → Pages**.
2. **Source**: select **GitHub Actions**.
3. Save (no branch selection needed — the workflow provides the artifact).

Push to `main` after that (or hit **Run workflow** on the Actions tab) and the
site lands at `https://palimkarakshay.github.io/cca-f-prep/` within ~30s.

### Fallback: branch-based source (if "GitHub Actions" source isn't available)

If your plan/org doesn't expose the GitHub Actions Pages source, switch to:

- **Source**: Deploy from a branch
- **Branch**: `main` · folder `/docs`

…and disable the workflow file (or delete it). Pages will serve
`/docs/index.html` directly off `main`.

### Zero-config alternative

If you just need to access the app without flipping any settings, the file is
served as-is by `raw.githack.com`:

```
https://raw.githack.com/palimkarakshay/cca-f-prep/main/docs/index.html
```

## What it does

- Renders `Diagnostic 01` (`full-mock-exams/diagnostic-01.md`) one question at
  a time with A/B/C/D radio cards.
- Each question has an optional **reasoning textarea** — write why you picked
  what you picked. It surfaces in the result review next to the canonical
  explanation, so wrong-answer review stays grounded in your thinking, not the
  answer key's.
- Progress and notes persist to `localStorage` per browser. Refresh-safe.
- Submit reveals score, score-band guidance, and a per-question breakdown:
  - Verdict (correct / incorrect / skipped)
  - Your pick vs. correct answer
  - Your reasoning (if you wrote any)
  - Why each option is right or wrong
  - The underlying principle the question is testing

## Adding more diagnostics

The quiz data is the `QUIZ` constant in `index.html`. To add a second
diagnostic, lift it to an array of quizzes and add a picker on the start
screen — that's roughly a 30-line change. Until then, keep the embedded data
in sync with the source markdown in `full-mock-exams/`.
