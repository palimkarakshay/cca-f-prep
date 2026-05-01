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

In repo **Settings → Pages**:

- **Source**: Deploy from a branch
- **Branch**: `main` · folder `/docs`

The site lands at `https://palimkarakshay.github.io/cca-f-prep/`.

No workflow file needed — Pages serves `/docs/index.html` directly.

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
