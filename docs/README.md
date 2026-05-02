# `docs/` — CCA-F self-study platform

Adaptive self-study app for CCA-F prep. Walks the user through a curriculum
section-by-section, concept-by-concept: micro-lesson → quiz → section-test,
with a recommendation engine that picks the next step from results. No build
step, no dependencies, vanilla JS. Lives at:

- `https://palimkarakshay.github.io/cca-f-prep/` (GitHub Pages)
- `https://raw.githack.com/palimkarakshay/cca-f-prep/main/docs/index.html` (preview)

## Files

| File             | Role                                                                  |
|------------------|-----------------------------------------------------------------------|
| `index.html`     | HTML shell — loads `app.css` and `app.js`. No content.                |
| `app.css`        | All styling.                                                          |
| `app.js`         | Router, persistence, adaptive engine, view rendering. No content.     |
| `curriculum.js`  | **Content data** — sections, concepts, lessons, quizzes, section-tests.|

Adding a new concept or section is a **data-only edit in `curriculum.js`** —
`app.js` does not change. The dashboard, section view, lesson view, quiz
runner, and recommendation engine all derive from the data.

## Run locally

```sh
# either
open docs/index.html

# or (so localStorage persists per-host)
python3 -m http.server -d docs 8000
# → http://localhost:8000
```

## Curriculum data shape

```js
const CURRICULUM = {
  schemaVersion: 1,
  sections: [
    {
      id: "s1-claude-101",            // slug, stable
      n: 1,                           // section number for display
      title: "Claude 101",
      sourceCourse: "Anthropic Academy — Claude 101",
      blurb: "Mental model …",
      concepts: [
        {
          id: "b1-1",
          code: "B1.1",               // matches 09-progress-tracker/skills-matrix.md
          title: "Project vs RAG corpus",
          bloom: "U",                 // R / U / A / An / E / C
          lesson: { … } | null,       // null = "lesson coming" stub
          quiz:   { … } | null
        },
        …
      ],
      sectionTest: { … } | null
    },
    …
  ],
  mockExams: [                                 // optional — top-level
    {
      id: "diagnostic-01",
      title: "Diagnostic 01 — Mixed Domain",
      blurb: "…",
      sourceFile: "07-mock-exams/diagnostic-01.md",
      timeMinutes: 20,
      passPct: 0.7,
      scoreBands: [
        { min: 9, max: 10, verdict: "Strong baseline", message: "…" },
        …
      ],
      questions: [ /* same shape as sectionTest.questions */ ]
    }
  ]
};
```

### Lesson shape

```js
{
  status: "ready",                       // "draft" | "ready"
  paragraphs: ["…", "…", "…"],           // 3–5 short paragraphs
  keyPoints:  ["…"],                     // bulleted takeaways
  examples:   [{ title: "…", body: "…" }], // optional worked example(s)
  pitfalls:   ["…"],                     // common mistakes / failure modes
  notesRef:   "00-academy-basics/notes/01-claude-101.md",
  simplified: {                          // optional — drives the Simplify toggle
    oneLiner:   "…",                     // one-sentence TLDR
    analogy:    "…",                     // plain-language analogy
    paragraphs: ["…"],                   // 1–3 simpler paragraphs
    keyPoints:  ["…"]                    // optional simpler bullets
  }
}
```

### Simplify feature

Each lesson view exposes two ways to get a simpler explanation:

1. **Simplify toggle** — flips the lesson into a plain-language view
   built from `lesson.simplified` (one-liner TLDR + analogy + simpler
   paragraphs + simpler key points). Toggle off to return to the
   canonical lesson. If `simplified` isn't authored, the button focuses
   the Ask Claude input below instead.
2. **Ask Claude panel** — a textarea + "Open in Claude →" button. The
   app builds a self-contained prompt (lesson body + your question),
   copies it to the clipboard, and opens `claude.ai/new` in a new tab.
   No API key needed; works on a static GitHub Pages host.

Authoring a `simplified` block is optional but recommended — it gives
the toggle something to flip to without leaving the app.

### Quiz / section-test shape

```js
{
  passPct: 0.7,                          // section-tests only; quiz pass-gate is hardcoded 0.6
  questions: [
    {
      n: 1,
      question: "…",
      options:      { A: "…", B: "…", C: "…", D: "…" },
      correct:      "B",
      explanations: { A: "…", B: "…", C: "…", D: "…" },
      principle:    "Named principle — the *why*, not just the answer.",
      bSkills:      ["B1.1", "B1.4"]      // which B-codes this Q evidences
    }
  ]
}
```

### Mock-exam shape

Mock exams are the same MCQ shape as section-tests, but live at the
top level of `CURRICULUM.mockExams` (independent of section progress)
and carry a score-band rubric so the result page can give the user a
direct "what to train next" verdict.

```js
{
  id: "diagnostic-01",
  title: "Diagnostic 01 — Mixed Domain",
  blurb: "Cold calibration across all five exam domains.",
  sourceFile: "07-mock-exams/diagnostic-01.md",
  timeMinutes: 20,
  passPct: 0.7,
  scoreBands: [
    { min: 9, max: 10, verdict: "Strong baseline",        message: "…" },
    { min: 7, max: 8,  verdict: "Solid",                  message: "…" },
    { min: 5, max: 6,  verdict: "Sequence by exam weight",message: "…" },
    { min: 0, max: 4,  verdict: "Slow down",              message: "…" }
  ],
  questions: [
    {
      n: 1, question: "…",
      options: { A: "…", B: "…", C: "…", D: "…" },
      correct: "B",
      explanations: { A: "…", B: "…", C: "…", D: "…" },
      principle: "…",
      domain: "1. Agentic Architecture",   // optional — surfaced as a badge
      subArea: "Coordinator-subagent vs. linear loop"
    }
  ]
}
```

Mock-exam attempts persist independently from section progress (under
`P.mock[id]` in `localStorage`). Resume / re-take / review-last-attempt
are wired up on the dashboard's **Mock exams** panel.

## Adding content

### Add a concept (lesson + quiz) to an existing section

1. Find the section in `curriculum.js`.
2. Replace the concept's `lesson: null` with a populated lesson object.
3. Replace `quiz: null` with a populated quiz object.
4. Commit the diff. Pages redeploys in ~30s.

The new concept auto-renders in the dashboard and the section view. The
adaptive engine starts recommending it once previous concepts in the
section pass.

### Add a new section

1. Append a new section object to `CURRICULUM.sections`.
2. The dashboard auto-renders it locked. It unlocks when the prior
   section's section-test passes.

### Authoring conventions

- **Match the source.** Lessons mine from existing notes (`00-academy-basics/notes/`,
  domain `notes.md`, etc.) — not invented from scratch. `notesRef` points back
  to the source so I can cross-check.
- **Pass-gate is the principle, not the letter.** Every quiz question has a
  `principle` field naming the *why*. Distractors should each be wrong for a
  *different* reason; the per-option `explanations` say which.
- **Tag with B-skills.** Every quiz Q lists `bSkills` (one or more codes from
  `09-progress-tracker/skills-matrix.md`). This is what the matrix view will
  consume in v2 to derive measured ratings.
- **Mix correct-letter positions.** Avoid B-B-B-B patterns. Distribute the
  correct letter across A/B/C/D within a quiz.
- **Section-test ≠ quiz collage.** The section-test should test *synthesis*
  across the section's concepts, not just repeat their per-concept quizzes.

## Mastery scale

| Mastery | Meaning                          | How it's set                                  |
|---------|----------------------------------|-----------------------------------------------|
| 0       | Not started                      | Default                                        |
| 1       | Lesson read                      | Set on entering the lesson view                |
| 2       | Below pass-gate (<60% on quiz)   | After quiz submit                              |
| 3       | Passing (≥60%)                   | After quiz submit                              |
| 4       | Strong (≥90%)                    | After quiz submit                              |

A concept counts as "complete" at mastery ≥ 3.

## Adaptive engine

The dashboard's `Recommended next` banner picks the highest-priority
action from the user's progress:

1. **Drill** — any concept currently at mastery=2. Re-read lesson, re-take.
2. **Section-test** — every concept in an unlocked section passes AND
   the section-test exists AND it hasn't been passed yet.
3. **Continue** — earliest unlocked-incomplete section's first authored,
   not-yet-passed concept. If lesson unread → "Read lesson"; if read →
   "Take quiz".
4. **Done** — all authored content complete; new content lands as it's
   authored.

Pass-gates:
- Concept quiz: 60% (advances mastery to 3+).
- Section-test: 70% (marks section complete, unlocks next section).

## Persistence

Single localStorage key, schema-versioned:

```
key:   cca-f-prep:progress:v1
shape: {
  schemaVersion: 1,
  concept: { [conceptId]: { lessonRead, quizAttempts, mastery, currentAttempt } },
  section: { [sectionId]: { unlocked, testAttempts, complete, currentTestAttempt } },
  location: { view, sectionId, conceptId }
}
```

To reset progress (in browser console):
```js
localStorage.removeItem("cca-f-prep:progress:v1"); location.reload();
```

When the schema needs a breaking change, bump the version (`v2`, `v3`)
in `app.js`. Old state is then ignored and a fresh `newProgress()` is
created. This is the migration story for now — explicit, manual, and
non-destructive (the old key isn't deleted, so we could write a migration
later if needed).

## Deploy

`.github/workflows/pages.yml` builds and deploys `docs/` on every push
to `main`. Pages must be enabled once by hand:

1. **Settings → Pages**.
2. **Source**: GitHub Actions.
3. Save.

After that, push to `main` → live in ~30s.

## What's not in v1

Tracked here so it doesn't get forgotten:

- **Spaced repetition.** Concepts at mastery 3+ should resurface on a
  schedule (`09-progress-tracker/spaced-review.md` has the schema).
- **Different-question retakes.** Re-takes currently replay the same
  questions; v2 should sample from a per-concept question bank.
- **Architect-tier content (CCA-F domains).** v1 covers the Anthropic
  Academy basics (sections 1–9). The architect layer (the five exam
  domains) lands once basics are solid.
- **Skills-matrix view.** The data is being collected (`bSkills` on every
  Q); a matrix dashboard view will read it.
- **Question-bank sampling.** Section-tests currently have a fixed
  question list; could sample from the union of concept-quiz banks.
