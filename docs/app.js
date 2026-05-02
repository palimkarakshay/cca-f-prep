/* ------------------------------------------------------------------
   CCA-F Prep — self-study platform (scaffold)

   Architecture:
     curriculum.js  — content data (sections / concepts / lessons / quizzes)
     app.js         — router, persistence, adaptive engine, view rendering
     app.css        — styling

   No build step. Open index.html directly or serve docs/ over GitHub Pages.
------------------------------------------------------------------ */
(function () {
  "use strict";

  // ---------------- Persistence ----------------
  const NS = "cca-f-prep";
  const PROGRESS_KEY = NS + ":progress:v1";

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return newProgress();
      const obj = JSON.parse(raw);
      if (!obj || obj.schemaVersion !== 1) return newProgress();
      // Defensive: if curriculum sections changed, ensure entries exist
      return obj;
    } catch (e) { return newProgress(); }
  }
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(P)); } catch (e) {}
  }
  function newProgress() {
    const first = CURRICULUM.sections[0];
    return {
      schemaVersion: 1,
      concept: {},                    // conceptId -> { lessonRead, quizAttempts, mastery, currentAttempt? }
      section: first
        ? { [first.id]: { unlocked: true, testAttempts: [], complete: false } }
        : {},
      location: { view: "dashboard", sectionId: null, conceptId: null }
    };
  }

  let P = loadProgress();

  function ensureSection(id) {
    if (!P.section[id]) {
      P.section[id] = { unlocked: false, testAttempts: [], complete: false };
    }
    return P.section[id];
  }
  function ensureConcept(id) {
    if (!P.concept[id]) {
      P.concept[id] = { lessonRead: false, quizAttempts: [], mastery: 0, currentAttempt: null };
    }
    return P.concept[id];
  }

  // ---------------- Curriculum lookup ----------------
  function getSection(id) { return CURRICULUM.sections.find(s => s.id === id) || null; }
  function getConcept(sectionId, conceptId) {
    const s = getSection(sectionId);
    return s ? (s.concepts.find(c => c.id === conceptId) || null) : null;
  }

  // ---------------- Mastery + recommendation (placeholders for commit 1) ----------------
  // Mastery scale (0–4) drives the badge in the dashboard. Adaptive engine
  // is fleshed out in commit 3; for the scaffold we expose only the
  // primitives needed for navigation.
  function masteryLabel(m) {
    return ["Not started", "Lesson read", "Below 60%", "Passing", "Strong"][m] || "Not started";
  }

  // ---------------- Element helper ----------------
  function el(tag, attrs) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (k === "class") e.className = v;
        else if (k === "html") e.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
        else if (v !== false && v != null) e.setAttribute(k, v);
      }
    }
    for (let i = 2; i < arguments.length; i++) {
      const arr = Array.isArray(arguments[i]) ? arguments[i] : [arguments[i]];
      for (const k of arr) {
        if (k == null || k === false) continue;
        e.appendChild(typeof k === "string" ? document.createTextNode(k) : k);
      }
    }
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  const root = document.getElementById("root");
  const brandSub = document.getElementById("brandSub");
  const topnav = document.getElementById("topnav");
  document.querySelector(".brand-title").addEventListener("click", () => navigate("dashboard"));

  // ---------------- Router ----------------
  function navigate(view, opts) {
    P.location = {
      view: view,
      sectionId: (opts && opts.sectionId) || null,
      conceptId: (opts && opts.conceptId) || null
    };
    saveProgress();
    render();
  }

  function render() {
    clear(root);
    clear(topnav);
    window.scrollTo({ top: 0 });
    const v = P.location.view;
    if (v === "section")            return renderSection();
    if (v === "concept")            return renderConceptDetail();
    if (v === "lesson")             return renderLesson();
    if (v === "quiz")               return renderQuiz();
    if (v === "quizResult")         return renderQuizResult();
    if (v === "sectionTest")        return renderSectionTest();
    if (v === "sectionTestResult")  return renderSectionTestResult();
    return renderDashboard();
  }

  // ---------------- Breadcrumbs ----------------
  function breadcrumbs(trail) {
    const wrap = el("div", { class: "breadcrumbs" });
    trail.forEach((step, i) => {
      if (i > 0) wrap.appendChild(el("span", { class: "sep" }, "›"));
      if (step.onclick) {
        wrap.appendChild(el("button", { class: "crumb", onclick: step.onclick }, step.label));
      } else {
        wrap.appendChild(el("span", null, step.label));
      }
    });
    return wrap;
  }

  // ---------------- Dashboard ----------------
  function renderDashboard() {
    brandSub.textContent = "Self-study dashboard";
    topnav.appendChild(el("span", null, CURRICULUM.sections.length + " sections · "
      + CURRICULUM.sections.reduce((n, s) => n + s.concepts.length, 0) + " concepts"));

    // Recommendation banner placeholder — wired up in commit 3
    const reco = el("div", { class: "reco" },
      el("div", { class: "reco-label" }, "Scaffold preview"),
      el("div", { class: "reco-title" }, "Walk the structure first."),
      el("div", { class: "reco-why" },
        "This is the navigation skeleton. Lessons, quizzes, the adaptive recommendation engine, "
        + "and progress saving land in subsequent commits. Click into a section to see how concepts list. "
        + "Click a concept to preview the lesson/quiz shell.")
    );
    root.appendChild(reco);

    const list = el("div", { class: "section-list" });
    CURRICULUM.sections.forEach(section => list.appendChild(renderSectionCard(section)));
    root.appendChild(list);
  }

  function renderSectionCard(section) {
    const sp = ensureSection(section.id);
    const conceptsDone = section.concepts.filter(c => ensureConcept(c.id).mastery >= 3).length;
    const total = section.concepts.length;
    const allConceptsDone = total > 0 && conceptsDone === total;

    let statusText = sp.unlocked ? (allConceptsDone ? "Ready for section-test" : (conceptsDone + "/" + total + " concepts")) : "Locked";
    if (sp.complete) statusText = "Complete";

    const card = el("div", { class: "section-card" + (sp.unlocked ? "" : " locked") });

    const head = el("div", { class: "section-head", onclick: () => {
      if (sp.unlocked) navigate("section", { sectionId: section.id });
    } },
      el("span", { class: "section-num" }, "Section " + section.n),
      el("span", { class: "section-title" }, section.title),
      el("span", {
        class: "section-status" + (sp.complete ? " complete" : "") + (sp.unlocked ? "" : " locked")
      }, statusText)
    );
    card.appendChild(head);

    card.appendChild(el("p", { class: "section-blurb" }, section.blurb));

    if (sp.unlocked) {
      const conceptList = el("div", { class: "concept-list" });
      section.concepts.forEach(c => conceptList.appendChild(renderConceptRow(section, c)));
      card.appendChild(conceptList);

      const sectionTestUnlocked = allConceptsDone;
      card.appendChild(el("div", {
        class: "section-test-card" + (sectionTestUnlocked ? " unlocked" : "")
      },
        sectionTestUnlocked
          ? "Section-test unlocked — author lands in commit 3."
          : "Section-test unlocks after every concept reaches Passing."
      ));
    }

    return card;
  }

  function renderConceptRow(section, concept) {
    const cp = ensureConcept(concept.id);
    return el("div", {
      class: "concept-row",
      onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id })
    },
      el("span", { class: "concept-code" }, concept.code),
      el("span", { class: "concept-title" }, concept.title),
      el("span", { class: "concept-bloom", title: "Bloom level" }, concept.bloom),
      el("span", { class: "mastery m" + cp.mastery, title: masteryLabel(cp.mastery) }, masteryLabel(cp.mastery))
    );
  }

  // ---------------- Section view ----------------
  function renderSection() {
    const section = getSection(P.location.sectionId);
    if (!section) return navigate("dashboard");
    brandSub.textContent = "Section " + section.n + " · " + section.title;
    topnav.appendChild(el("button", {
      class: "linkish",
      onclick: () => navigate("dashboard")
    }, "← All sections"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: "Section " + section.n + " · " + section.title }
    ]));

    const panel = el("div", { class: "panel" },
      el("h2", null, section.title),
      el("p", { class: "blurb" }, section.blurb)
    );
    const list = el("div", { class: "concept-list", style: "margin-top: 4px;" });
    section.concepts.forEach(c => list.appendChild(renderConceptRow(section, c)));
    panel.appendChild(list);

    const sp = ensureSection(section.id);
    const allConceptsDone = section.concepts.every(c => ensureConcept(c.id).mastery >= 3);
    panel.appendChild(el("div", {
      class: "section-test-card" + (allConceptsDone ? " unlocked" : "")
    },
      allConceptsDone
        ? "Section-test unlocked — coming in commit 3."
        : "Pass all concept quizzes to unlock the section-test."
    ));

    root.appendChild(panel);
  }

  // ---------------- Concept detail (lesson + quiz launcher) ----------------
  function renderConceptDetail() {
    const section = getSection(P.location.sectionId);
    const concept = getConcept(P.location.sectionId, P.location.conceptId);
    if (!section || !concept) return navigate("dashboard");

    brandSub.textContent = section.title + " · " + concept.code;
    topnav.appendChild(el("button", { class: "linkish", onclick: () => navigate("section", { sectionId: section.id }) }, "← Section"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: section.title, onclick: () => navigate("section", { sectionId: section.id }) },
      { label: concept.code + " · " + concept.title }
    ]));

    const cp = ensureConcept(concept.id);
    const hasLesson = concept.lesson && concept.lesson.status === "ready";
    const hasQuiz   = concept.quiz && concept.quiz.questions && concept.quiz.questions.length > 0;

    const panel = el("div", { class: "panel" },
      el("div", { class: "lesson-meta" },
        el("span", { class: "badge dom" }, concept.code),
        el("span", { class: "badge" }, "Bloom: " + concept.bloom),
        el("span", { class: "badge" }, "Mastery: " + masteryLabel(cp.mastery))
      ),
      el("h2", null, concept.title),
      el("p", { class: "blurb" }, "Source: " + section.sourceCourse)
    );

    if (!hasLesson) {
      panel.appendChild(el("div", { class: "lesson-stub" },
        el("div", null, el("strong", null, "Lesson — coming."),
          " The micro-lesson for this concept is authored in a later commit."),
        el("div", { style: "margin-top:6px;" },
          "When ready it will include: 3–5 paragraphs of explanation, key takeaways, a worked example, and the canonical pitfalls.")
      ));
    }

    panel.appendChild(el("div", { class: "controls" },
      el("button", { onclick: () => navigate("section", { sectionId: section.id }) }, "← Back to section"),
      el("div", { class: "nav-spacer" }),
      hasLesson
        ? el("button", { onclick: () => navigate("lesson", { sectionId: section.id, conceptId: concept.id }) }, "Read lesson →")
        : null,
      el("button", {
        class: "primary",
        disabled: hasQuiz ? false : "disabled",
        onclick: () => hasQuiz && startQuiz(section, concept)
      }, hasQuiz ? (cp.currentAttempt ? "Resume quiz →" : "Take quiz →") : "Quiz — coming")
    ));

    root.appendChild(panel);
  }

  // ---------------- Lesson view ----------------
  function renderLesson() {
    const section = getSection(P.location.sectionId);
    const concept = getConcept(P.location.sectionId, P.location.conceptId);
    if (!section || !concept || !concept.lesson || concept.lesson.status !== "ready") {
      return navigate("concept", { sectionId: P.location.sectionId, conceptId: P.location.conceptId });
    }
    const cp = ensureConcept(concept.id);
    const L = concept.lesson;

    brandSub.textContent = section.title + " · " + concept.code + " · Lesson";
    topnav.appendChild(el("button", { class: "linkish", onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id }) }, "← Concept"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: section.title, onclick: () => navigate("section", { sectionId: section.id }) },
      { label: concept.code, onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id }) },
      { label: "Lesson" }
    ]));

    const panel = el("div", { class: "panel lesson" },
      el("div", { class: "lesson-meta" },
        el("span", { class: "badge dom" }, concept.code),
        el("span", { class: "badge" }, "Bloom: " + concept.bloom),
        el("span", { class: "badge" }, section.sourceCourse)
      ),
      el("h2", null, concept.title)
    );

    L.paragraphs.forEach(p => panel.appendChild(el("p", null, p)));

    if (L.keyPoints && L.keyPoints.length) {
      panel.appendChild(el("h3", null, "Key takeaways"));
      const ul = el("ul");
      L.keyPoints.forEach(k => ul.appendChild(el("li", null, k)));
      panel.appendChild(ul);
    }

    if (L.examples && L.examples.length) {
      panel.appendChild(el("h3", null, "Worked example"));
      L.examples.forEach(ex => panel.appendChild(
        el("div", { class: "example" },
          el("div", { class: "ex-title" }, ex.title),
          el("div", null, ex.body)
        )
      ));
    }

    if (L.pitfalls && L.pitfalls.length) {
      panel.appendChild(el("h3", null, "Pitfalls"));
      const div = el("div", { class: "pitfalls" });
      const ul = el("ul");
      L.pitfalls.forEach(pf => ul.appendChild(el("li", null, pf)));
      div.appendChild(ul);
      panel.appendChild(div);
    }

    if (L.notesRef) {
      panel.appendChild(el("div", { class: "notes-ref" },
        "Source notes: ", el("code", null, L.notesRef)
      ));
    }

    cp.lessonRead = true;
    if (cp.mastery < 1) cp.mastery = 1;
    saveProgress();

    const hasQuiz = concept.quiz && concept.quiz.questions && concept.quiz.questions.length > 0;
    panel.appendChild(el("div", { class: "controls" },
      el("button", { onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id }) }, "← Back"),
      el("div", { class: "nav-spacer" }),
      el("button", {
        class: "primary",
        disabled: hasQuiz ? false : "disabled",
        onclick: () => hasQuiz && startQuiz(section, concept)
      }, hasQuiz ? "Take quiz →" : "Quiz — coming")
    ));

    root.appendChild(panel);
  }

  // ---------------- Quiz runner ----------------
  function startQuiz(section, concept) {
    const cp = ensureConcept(concept.id);
    if (!cp.currentAttempt) {
      cp.currentAttempt = {
        idx: 0,
        answers: concept.quiz.questions.map(() => ({ pick: null, notes: "" }))
      };
      saveProgress();
    }
    navigate("quiz", { sectionId: section.id, conceptId: concept.id });
  }

  function renderQuiz() {
    const section = getSection(P.location.sectionId);
    const concept = getConcept(P.location.sectionId, P.location.conceptId);
    if (!section || !concept || !concept.quiz) return navigate("dashboard");
    const cp = ensureConcept(concept.id);
    if (!cp.currentAttempt) return startQuiz(section, concept);

    const Q = concept.quiz.questions;
    const a = cp.currentAttempt;
    const i = a.idx;
    const q = Q[i];
    const total = Q.length;

    brandSub.textContent = section.title + " · " + concept.code + " · Quiz";
    topnav.appendChild(el("span", null, "Q " + (i + 1) + " of " + total));
    topnav.appendChild(el("button", { class: "linkish", onclick: () => {
      if (confirm("Exit quiz? Your progress is saved; you can resume from the concept page.")) {
        navigate("concept", { sectionId: section.id, conceptId: concept.id });
      }
    } }, "Exit"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: section.title, onclick: () => navigate("section", { sectionId: section.id }) },
      { label: concept.code, onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id }) },
      { label: "Quiz · Q" + (i + 1) + "/" + total }
    ]));

    const pct = (i / total) * 100;
    root.appendChild(el("div", { class: "progress-shell" },
      el("div", { class: "progress-fill", style: "width:" + pct + "%" })
    ));

    const optionsWrap = el("div", { class: "options" });
    Object.keys(q.options).forEach(letter => {
      const text = q.options[letter];
      const sel = a.answers[i].pick === letter;
      optionsWrap.appendChild(
        el("div", {
          class: "opt" + (sel ? " sel" : ""),
          role: "button",
          tabindex: "0",
          onclick: () => { a.answers[i].pick = letter; saveProgress(); render(); },
          onkeydown: (ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              a.answers[i].pick = letter; saveProgress(); render();
            }
          }
        },
          el("div", { class: "opt-letter" }, letter),
          el("div", { class: "opt-text" }, text)
        )
      );
    });

    const reasonTa = el("textarea", {
      class: "reason",
      placeholder: "Optional — write your reasoning. Why this answer? What ruled out the others? Surfaces in the result review next to the canonical explanation."
    });
    reasonTa.value = a.answers[i].notes || "";
    reasonTa.addEventListener("input", (ev) => {
      a.answers[i].notes = ev.target.value;
      saveProgress();
    });

    const card = el("div", { class: "panel" },
      el("div", { class: "qhead" },
        el("span", { class: "qno" }, "Q" + q.n),
        el("span", { class: "badge dom" }, concept.code),
        q.bSkills && q.bSkills.length > 1
          ? el("span", { class: "badge" }, "Also tags: " + q.bSkills.filter(b => b !== concept.code).join(", "))
          : null
      ),
      el("h1", { class: "qtitle" }, "Q" + q.n),
      el("div", { class: "qbody" }, q.question),
      optionsWrap,
      el("div", { class: "reason-wrap" },
        el("div", { class: "reason-label" }, "Your reasoning (optional)"),
        reasonTa
      )
    );
    root.appendChild(card);

    const isLast = i === total - 1;
    const allPicked = a.answers.every(x => x.pick);

    root.appendChild(el("div", { class: "controls" },
      el("button", {
        onclick: () => { a.idx = Math.max(0, i - 1); saveProgress(); render(); },
        disabled: i === 0 ? "disabled" : false
      }, "← Prev"),
      el("div", { class: "nav-spacer" }),
      !isLast
        ? el("button", {
            class: "primary",
            onclick: () => { a.idx = Math.min(total - 1, i + 1); saveProgress(); render(); }
          }, "Next →")
        : el("button", {
            class: "primary",
            onclick: () => {
              if (!allPicked) {
                const skipped = a.answers.map((x, idx) => x.pick ? null : idx + 1).filter(Boolean);
                if (!confirm("You haven't picked an answer for Q" + skipped.join(", Q") + ". Submit anyway?")) return;
              }
              submitQuiz(section, concept);
            }
          }, "Submit quiz")
    ));
  }

  function submitQuiz(section, concept) {
    const cp = ensureConcept(concept.id);
    const Q = concept.quiz.questions;
    const a = cp.currentAttempt;
    const score = a.answers.reduce((acc, ans, i) => acc + (ans.pick === Q[i].correct ? 1 : 0), 0);
    cp.quizAttempts.push({
      score: score,
      total: Q.length,
      dateISO: new Date().toISOString(),
      answers: a.answers.map(x => ({ pick: x.pick, notes: x.notes }))
    });
    cp.currentAttempt = null;
    // Mastery: <60 → 2; ≥60 → 3; ≥90 → 4
    const pct = score / Q.length;
    if (pct >= 0.9) cp.mastery = 4;
    else if (pct >= 0.6) cp.mastery = 3;
    else cp.mastery = 2;
    saveProgress();
    navigate("quizResult", { sectionId: section.id, conceptId: concept.id });
  }

  function renderQuizResult() {
    const section = getSection(P.location.sectionId);
    const concept = getConcept(P.location.sectionId, P.location.conceptId);
    if (!section || !concept || !concept.quiz) return navigate("dashboard");
    const cp = ensureConcept(concept.id);
    const last = cp.quizAttempts[cp.quizAttempts.length - 1];
    if (!last) return navigate("concept", { sectionId: section.id, conceptId: concept.id });

    const Q = concept.quiz.questions;
    const passed = (last.score / last.total) >= 0.6;

    brandSub.textContent = section.title + " · " + concept.code + " · Result";
    topnav.appendChild(el("button", { class: "linkish", onclick: () => navigate("section", { sectionId: section.id }) }, "← Section"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: section.title, onclick: () => navigate("section", { sectionId: section.id }) },
      { label: concept.code, onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id }) },
      { label: "Result" }
    ]));

    const verdictText = passed
      ? (cp.mastery === 4 ? "Strong — concept marked complete (≥90%)." : "Pass — concept marked complete (≥60%).")
      : "Below 60% — re-read the lesson and re-take the quiz.";

    root.appendChild(el("div", { class: "scorecard" },
      el("div", null,
        el("div", { class: "score-num" }, last.score + " / " + last.total),
        el("div", { class: "score-meta" }, Math.round((last.score / last.total) * 100) + "% · attempt " + cp.quizAttempts.length)
      ),
      el("div", { class: "score-band" },
        el("div", { class: "verdict-line " + (passed ? "pass" : "fail") },
          passed ? "Concept passed" : "Below pass-gate"),
        el("div", null, verdictText)
      )
    ));

    root.appendChild(el("div", { class: "controls", style: "margin-top:0;margin-bottom:18px;" },
      el("button", { onclick: () => navigate("section", { sectionId: section.id }) }, "← Back to section"),
      el("div", { class: "nav-spacer" }),
      passed
        ? null
        : el("button", { onclick: () => navigate("lesson", { sectionId: section.id, conceptId: concept.id }) }, "Re-read lesson"),
      el("button", {
        class: "primary",
        onclick: () => startQuiz(section, concept)
      }, "Re-take quiz")
    ));

    const review = el("div", { class: "review" });
    Q.forEach((q, i) => {
      const ans = last.answers[i];
      const picked = ans.pick;
      const status = !picked ? "skipped" : (picked === q.correct ? "correct" : "wrong");
      const verdictTextR = !picked ? "Skipped" : (picked === q.correct ? "Correct" : "Incorrect");

      const expList = el("ul");
      Object.keys(q.options).forEach(letter => {
        const isRight = letter === q.correct;
        const why = q.explanations[letter] || "";
        const li = el("li", { class: isRight ? "right" : "" });
        if (isRight) {
          li.appendChild(el("strong", null, letter + " — Correct."));
          li.appendChild(document.createTextNode(" " + why));
        } else {
          li.appendChild(el("strong", null, letter + "."));
          li.appendChild(document.createTextNode(" " + why));
        }
        expList.appendChild(li);
      });

      review.appendChild(el("div", { class: "rcard " + status },
        el("div", { class: "qhead" },
          el("span", { class: "qno" }, "Q" + q.n),
          el("span", { class: "badge dom" }, concept.code),
          el("span", { class: "verdict " + status }, verdictTextR)
        ),
        el("h3", null, "Q" + q.n),
        el("div", { class: "qtext-mini" }, q.question),
        el("div", { class: "answer-row" },
          el("div", null,
            el("span", { class: "lbl" }, "Your pick:"),
            el("code", null, picked || "—")
          ),
          el("div", null,
            el("span", { class: "lbl" }, "Correct:"),
            el("code", null, q.correct)
          )
        ),
        ans.notes && ans.notes.trim()
          ? el("div", { class: "user-notes" },
              el("span", { class: "lbl" }, "Your reasoning"),
              ans.notes.trim()
            )
          : null,
        el("div", { class: "explain" },
          el("h4", null, "Per-option breakdown"),
          expList
        ),
        el("div", { class: "principle" },
          el("span", { class: "lbl" }, "Principle:"),
          q.principle
        )
      ));
    });
    root.appendChild(review);
  }

  function renderSectionTest()       { renderQuiz(); }
  function renderSectionTestResult() { renderQuiz(); }

  // ---------------- Boot ----------------
  const VALID_VIEWS = ["dashboard", "section", "concept", "lesson", "quiz", "quizResult", "sectionTest", "sectionTestResult"];
  if (VALID_VIEWS.indexOf(P.location.view) === -1) P.location.view = "dashboard";
  render();
})();
