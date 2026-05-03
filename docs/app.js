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

  // ---------------- Config ----------------
  // Ask Claude → opens this URL. Pointing it at a Project preserves the
  // exam-prep system prompt + project knowledge across questions, instead
  // of starting from a blank claude.ai/new chat. Leave empty to fall back
  // to a fresh chat.
  const CLAUDE_PROJECT_URL = "https://claude.ai/project/019deb60-3da7-7585-b1ef-97577eabe2ef";
  const CLAUDE_FALLBACK_URL = "https://claude.ai/new";

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
      mock: {},                       // mockId -> { attempts, currentAttempt? }
      location: { view: "dashboard", sectionId: null, conceptId: null, mockId: null }
    };
  }

  let P = loadProgress();
  // Forward-compat: lazily add fields older stored progress doesn't have.
  if (!P.mock) P.mock = {};
  if (P.location && !("mockId" in P.location)) P.location.mockId = null;

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
  function ensureMock(id) {
    if (!P.mock[id]) {
      P.mock[id] = { attempts: [], currentAttempt: null };
    }
    return P.mock[id];
  }

  // ---------------- Curriculum lookup ----------------
  function getSection(id) { return CURRICULUM.sections.find(s => s.id === id) || null; }
  function getConcept(sectionId, conceptId) {
    const s = getSection(sectionId);
    return s ? (s.concepts.find(c => c.id === conceptId) || null) : null;
  }
  function getMockExam(id) {
    const list = CURRICULUM.mockExams || [];
    return list.find(m => m.id === id) || null;
  }
  function mockExams() { return CURRICULUM.mockExams || []; }

  // ---------------- Mastery ----------------
  function masteryLabel(m) {
    return ["Not started", "Lesson read", "Below 60%", "Passing", "Strong"][m] || "Not started";
  }

  function isSectionPassed(sectionId) {
    const s = ensureSection(sectionId);
    const last = s.testAttempts[s.testAttempts.length - 1];
    if (!last) return false;
    const sec = getSection(sectionId);
    const passPct = (sec && sec.sectionTest && sec.sectionTest.passPct) || 0.7;
    return (last.score / last.total) >= passPct;
  }

  function unlockNextSection(sectionId) {
    const idx = CURRICULUM.sections.findIndex(s => s.id === sectionId);
    const next = CURRICULUM.sections[idx + 1];
    if (next) ensureSection(next.id).unlocked = true;
  }

  // ---------------- Adaptive recommendation ----------------
  // Priorities:
  //   1. Drill: any unlocked-section concept currently at mastery=2 (failed quiz).
  //   2. Section-test: an unlocked section where every authored concept passes
  //      AND the section-test exists AND it hasn't been passed.
  //   3. Continue: earliest unlocked-incomplete section's first authored,
  //      not-yet-passed concept.
  //   4. Done.
  function recommend() {
    for (const section of CURRICULUM.sections) {
      if (!ensureSection(section.id).unlocked) continue;
      for (const c of section.concepts) {
        const cp = ensureConcept(c.id);
        if (cp.mastery === 2 && c.quiz) {
          return {
            kind: "drill",
            title: "Drill " + c.code + " — " + c.title,
            why: "Last quiz scored below 60%. Re-read the lesson, then re-take the quiz.",
            actionLabel: "Re-read lesson",
            action: () => navigate("lesson", { sectionId: section.id, conceptId: c.id })
          };
        }
      }
    }
    for (const section of CURRICULUM.sections) {
      const sp = ensureSection(section.id);
      if (!sp.unlocked || sp.complete) continue;
      if (!section.sectionTest) continue;
      const authored = section.concepts.filter(c => c.quiz);
      if (!authored.length) continue;
      const allPassed = authored.every(c => ensureConcept(c.id).mastery >= 3);
      const allConceptsHaveQuizzes = section.concepts.every(c => c.quiz);
      if (allPassed && allConceptsHaveQuizzes && !isSectionPassed(section.id)) {
        return {
          kind: "sectionTest",
          title: "Section-test ready: " + section.title,
          why: "All concept quizzes in this section pass. Take the section-test (≥" +
               Math.round(((section.sectionTest.passPct || 0.7) * 100)) + "% to unlock the next section).",
          actionLabel: "Take section-test",
          action: () => startSectionTest(section)
        };
      }
    }
    for (const section of CURRICULUM.sections) {
      const sp = ensureSection(section.id);
      if (!sp.unlocked || sp.complete) continue;
      for (const c of section.concepts) {
        const cp = ensureConcept(c.id);
        const hasContent = (c.lesson && c.lesson.status === "ready") || (c.quiz && c.quiz.questions && c.quiz.questions.length);
        if (!hasContent) continue;
        if (cp.mastery >= 3) continue;
        const wantQuiz = cp.lessonRead && c.quiz;
        return {
          kind: "concept",
          title: c.code + " · " + c.title,
          why: wantQuiz ? "Lesson read. Take the quiz to lock in mastery." : ("Continue " + section.title + "."),
          actionLabel: wantQuiz ? "Take quiz" : "Read lesson",
          action: () => navigate(wantQuiz ? "quiz" : "lesson", { sectionId: section.id, conceptId: c.id })
        };
      }
    }
    return {
      kind: "done",
      title: "All authored content complete.",
      why: "More content lands as sections are authored. You're up to date.",
      actionLabel: null,
      action: null
    };
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
      conceptId: (opts && opts.conceptId) || null,
      mockId: (opts && opts.mockId) || null
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
    if (v === "mockExam")           return renderMockExam();
    if (v === "mockExamResult")     return renderMockExamResult();
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

    const r = recommend();
    const reco = el("div", { class: "reco" },
      el("div", { class: "reco-label" }, "Recommended next"),
      el("div", { class: "reco-title" }, r.title),
      el("div", { class: "reco-why" }, r.why)
    );
    if (r.action) {
      reco.appendChild(el("button", { class: "primary", onclick: r.action }, r.actionLabel));
    }
    root.appendChild(reco);

    const list = el("div", { class: "section-list" });
    CURRICULUM.sections.forEach(section => list.appendChild(renderSectionCard(section)));
    root.appendChild(list);

    if (mockExams().length) {
      root.appendChild(renderMockExamsPanel());
    }
  }

  function renderMockExamsPanel() {
    const wrap = el("div", { class: "mock-panel" });
    wrap.appendChild(el("div", { class: "mock-panel-head" },
      el("span", { class: "mock-panel-title" }, "Mock exams"),
      el("span", { class: "mock-panel-sub" }, "Cold calibration. Score band tells you which domain to train first.")
    ));
    const cards = el("div", { class: "mock-card-list" });
    mockExams().forEach(m => cards.appendChild(renderMockExamCard(m)));
    wrap.appendChild(cards);
    return wrap;
  }

  function renderMockExamCard(mock) {
    const mp = ensureMock(mock.id);
    const last = mp.attempts[mp.attempts.length - 1];
    const inProgress = !!mp.currentAttempt;
    const total = mock.questions.length;

    let statusText;
    let statusClass = "";
    if (inProgress) {
      const picked = mp.currentAttempt.answers.filter(a => a.pick).length;
      statusText = "In progress · " + picked + "/" + total + " answered";
      statusClass = "in-progress";
    } else if (last) {
      const pct = Math.round((last.score / last.total) * 100);
      statusText = "Last attempt: " + last.score + "/" + last.total + " (" + pct + "%) · "
        + mp.attempts.length + " attempt" + (mp.attempts.length === 1 ? "" : "s");
      statusClass = (last.score / last.total) >= (mock.passPct || 0.7) ? "pass" : "fail";
    } else {
      statusText = "Not yet taken";
    }

    const card = el("div", { class: "mock-card" },
      el("div", { class: "mock-card-head" },
        el("span", { class: "mock-card-title" }, mock.title),
        el("span", { class: "mock-card-meta" },
          total + " Q · ~" + mock.timeMinutes + " min")
      ),
      el("p", { class: "mock-card-blurb" }, mock.blurb),
      el("div", { class: "mock-card-status " + statusClass }, statusText),
      el("div", { class: "mock-card-actions" },
        el("button", {
          class: "primary",
          onclick: () => startMockExam(mock)
        }, inProgress ? "Resume" : (last ? "Re-take" : "Start mock exam")),
        last
          ? el("button", { onclick: () => navigate("mockExamResult", { mockId: mock.id }) }, "Review last attempt")
          : null
      )
    );
    return card;
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
    const authoredConcepts = section.concepts.filter(c => c.quiz);
    const allConceptsHaveQuizzes = section.concepts.every(c => c.quiz);
    const allAuthoredPassed = authoredConcepts.length > 0 && authoredConcepts.every(c => ensureConcept(c.id).mastery >= 3);
    const fullyUnlocked = allConceptsHaveQuizzes && allAuthoredPassed;
    const hasSectionTest = !!section.sectionTest;

    let sectionTestText;
    let sectionTestAction = null;
    if (!hasSectionTest) {
      sectionTestText = "Section-test — not yet authored.";
    } else if (fullyUnlocked) {
      const passed = isSectionPassed(section.id);
      sectionTestText = passed ? "Section-test passed — section complete." : "Section-test unlocked.";
      sectionTestAction = () => startSectionTest(section);
    } else if (allAuthoredPassed && !allConceptsHaveQuizzes) {
      sectionTestText = "Section-test waits on unauthored concepts (" + section.concepts.filter(c => !c.quiz).map(c => c.code).join(", ") + ").";
    } else {
      sectionTestText = "Pass all concept quizzes to unlock the section-test.";
    }

    const sectionTestCard = el("div", {
      class: "section-test-card" + ((fullyUnlocked || isSectionPassed(section.id)) ? " unlocked" : "")
    }, sectionTestText);
    if (sectionTestAction) {
      sectionTestCard.appendChild(el("div", { style: "margin-top:10px;" },
        el("button", { class: "primary", onclick: sectionTestAction },
          isSectionPassed(section.id) ? "Re-take section-test" : "Take section-test →")
      ));
    }
    panel.appendChild(sectionTestCard);

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
  // View-local state (not persisted): simplify mode resets when the
  // active lesson changes so each new lesson opens in canonical view.
  let lessonMode = "full"; // "full" | "simplified"
  let lessonModeFor = null; // conceptId the current lessonMode applies to

  function renderLesson() {
    const section = getSection(P.location.sectionId);
    const concept = getConcept(P.location.sectionId, P.location.conceptId);
    if (!section || !concept || !concept.lesson || concept.lesson.status !== "ready") {
      return navigate("concept", { sectionId: P.location.sectionId, conceptId: P.location.conceptId });
    }
    if (lessonModeFor !== concept.id) {
      lessonMode = "full";
      lessonModeFor = concept.id;
    }
    const cp = ensureConcept(concept.id);
    const L = concept.lesson;
    const S = L.simplified || null;
    const isSimplified = lessonMode === "simplified" && !!S;

    brandSub.textContent = section.title + " · " + concept.code + " · Lesson" + (isSimplified ? " · Simplified" : "");
    topnav.appendChild(el("button", { class: "linkish", onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id }) }, "← Concept"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: section.title, onclick: () => navigate("section", { sectionId: section.id }) },
      { label: concept.code, onclick: () => navigate("concept", { sectionId: section.id, conceptId: concept.id }) },
      { label: "Lesson" }
    ]));

    const simplifyBtn = el("button", {
      class: "simplify-toggle" + (isSimplified ? " on" : ""),
      title: S ? "Toggle a simpler explanation" : "No pre-authored simpler version — use Ask Claude below",
      onclick: () => {
        if (!S) {
          const ta = document.getElementById("askClaudeInput");
          if (ta) { ta.focus(); ta.scrollIntoView({ behavior: "smooth", block: "center" }); }
          return;
        }
        lessonMode = isSimplified ? "full" : "simplified";
        render();
      }
    }, isSimplified ? "Show full lesson" : (S ? "Simplify" : "Ask for simpler"));

    const panel = el("div", { class: "panel lesson" },
      el("div", { class: "lesson-meta" },
        el("span", { class: "badge dom" }, concept.code),
        el("span", { class: "badge" }, "Bloom: " + concept.bloom),
        el("span", { class: "badge" }, section.sourceCourse),
        el("div", { class: "lesson-meta-spacer" }),
        simplifyBtn
      ),
      el("h2", null, concept.title)
    );

    if (isSimplified) {
      panel.appendChild(el("div", { class: "simplified-banner" },
        el("span", { class: "lbl" }, "Simplified view"),
        " — plain language. Toggle off for the canonical lesson."
      ));
      if (S.oneLiner) {
        panel.appendChild(el("div", { class: "simplified-oneliner" }, S.oneLiner));
      }
      if (S.analogy) {
        panel.appendChild(el("h3", null, "Analogy"));
        panel.appendChild(el("p", null, S.analogy));
      }
      if (S.paragraphs && S.paragraphs.length) {
        panel.appendChild(el("h3", null, "In plain terms"));
        S.paragraphs.forEach(p => panel.appendChild(el("p", null, p)));
      }
      if (S.keyPoints && S.keyPoints.length) {
        panel.appendChild(el("h3", null, "Key takeaways"));
        const ul = el("ul");
        S.keyPoints.forEach(k => ul.appendChild(el("li", null, k)));
        panel.appendChild(ul);
      }
    } else {
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
    }

    if (L.notesRef) {
      panel.appendChild(el("div", { class: "notes-ref" },
        "Source notes: ", el("code", null, L.notesRef)
      ));
    }

    cp.lessonRead = true;
    if (cp.mastery < 1) cp.mastery = 1;
    saveProgress();

    panel.appendChild(renderAskClaudePanel(section, concept, L));

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

  // ---------------- Ask Claude panel ----------------
  // No backend, no API key: build a prompt that contains the lesson + the
  // user's question, copy it to the clipboard, then open claude.ai/new.
  function buildSimplifyPrompt(concept, L, userQuestion) {
    const lessonText = [
      "Title: " + concept.title + " (" + concept.code + ")",
      "",
      L.paragraphs.join("\n\n")
    ];
    if (L.keyPoints && L.keyPoints.length) {
      lessonText.push("", "Key takeaways:", L.keyPoints.map(k => "- " + k).join("\n"));
    }
    if (L.pitfalls && L.pitfalls.length) {
      lessonText.push("", "Pitfalls:", L.pitfalls.map(p => "- " + p).join("\n"));
    }
    const q = (userQuestion || "").trim() || "Explain this concept in simpler terms with a concrete analogy.";
    return [
      "I'm studying for the Anthropic CCA-F exam. Here's a lesson I'd like a simpler take on.",
      "",
      "--- LESSON ---",
      lessonText.join("\n"),
      "--- END LESSON ---",
      "",
      "My request: " + q
    ].join("\n");
  }

  function renderAskClaudePanel(section, concept, L) {
    const wrap = el("div", { class: "ask-claude" });
    wrap.appendChild(el("h3", null, "Ask Claude for a simpler take"));
    const opensProject = !!CLAUDE_PROJECT_URL;
    wrap.appendChild(el("p", { class: "ask-claude-help" },
      "Type a question (or leave blank for a default simpler explanation). " +
      "We'll copy a prompt with this lesson's content to your clipboard and open " +
      (opensProject ? "your CCA-F Claude Project" : "Claude") +
      " in a new tab."
    ));

    const ta = el("textarea", {
      id: "askClaudeInput",
      class: "ask-claude-input",
      placeholder: "e.g. Explain like I'm new to LLMs. Use an analogy. Skip the jargon."
    });

    const status = el("div", { class: "ask-claude-status", role: "status", "aria-live": "polite" });

    const openBtn = el("button", {
      class: "primary ask-claude-open",
      onclick: () => {
        const prompt = buildSimplifyPrompt(concept, L, ta.value);

        // Open the new tab synchronously while the click's user-activation
        // is still live — awaiting clipboard.writeText() first can drop
        // activation in Safari/Firefox and trigger their popup blocker.
        window.open(CLAUDE_PROJECT_URL || CLAUDE_FALLBACK_URL, "_blank", "noopener");

        // Try the synchronous execCommand path first so we never have to
        // await before any other side-effect that needs activation.
        let copied = false;
        try {
          const tmp = document.createElement("textarea");
          tmp.value = prompt;
          tmp.style.position = "fixed";
          tmp.style.left = "-9999px";
          document.body.appendChild(tmp);
          tmp.select();
          copied = !!(document.execCommand && document.execCommand("copy"));
          document.body.removeChild(tmp);
        } catch (e) { copied = false; }

        const finish = (ok) => {
          const dest = opensProject ? "Claude Project" : "Claude";
          status.textContent = ok
            ? "Prompt copied. Paste it into the new " + dest + " tab."
            : "Could not auto-copy — the prompt is shown below; copy it manually.";
          if (!ok) {
            ta.value = prompt;
            ta.focus();
            ta.select();
          }
        };

        if (copied) {
          finish(true);
          return;
        }

        // Async clipboard API as a secondary attempt. Safe to await here
        // because the new tab and synchronous copy attempt are already done.
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(prompt)
            .then(() => finish(true))
            .catch(() => finish(false));
        } else {
          finish(false);
        }
      }
    }, opensProject ? "Open in Claude Project →" : "Open in Claude →");

    const previewBtn = el("button", {
      class: "ghost",
      onclick: () => {
        const prompt = buildSimplifyPrompt(concept, L, ta.value);
        const pre = document.getElementById("askClaudePreview");
        if (pre) {
          if (pre.dataset.shown === "1") {
            pre.style.display = "none";
            pre.dataset.shown = "0";
            previewBtn.textContent = "Preview prompt";
          } else {
            pre.textContent = prompt;
            pre.style.display = "block";
            pre.dataset.shown = "1";
            previewBtn.textContent = "Hide prompt";
          }
        }
      }
    }, "Preview prompt");

    wrap.appendChild(ta);
    wrap.appendChild(el("div", { class: "ask-claude-controls" }, previewBtn, openBtn));
    wrap.appendChild(status);
    wrap.appendChild(el("pre", { id: "askClaudePreview", class: "ask-claude-preview", style: "display:none" }));
    return wrap;
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

  // ---------------- Section-test runner ----------------
  function startSectionTest(section) {
    const sp = ensureSection(section.id);
    if (!sp.currentTestAttempt) {
      sp.currentTestAttempt = {
        idx: 0,
        answers: section.sectionTest.questions.map(() => ({ pick: null, notes: "" }))
      };
      saveProgress();
    }
    navigate("sectionTest", { sectionId: section.id });
  }

  function renderSectionTest() {
    const section = getSection(P.location.sectionId);
    if (!section || !section.sectionTest) return navigate("dashboard");
    const sp = ensureSection(section.id);
    if (!sp.currentTestAttempt) return startSectionTest(section);

    const Q = section.sectionTest.questions;
    const a = sp.currentTestAttempt;
    const i = a.idx;
    const q = Q[i];
    const total = Q.length;

    brandSub.textContent = section.title + " · Section-test";
    topnav.appendChild(el("span", null, "Q " + (i + 1) + " of " + total));
    topnav.appendChild(el("button", { class: "linkish", onclick: () => {
      if (confirm("Exit the section-test? Your progress is saved; you can resume from the section page.")) {
        navigate("section", { sectionId: section.id });
      }
    } }, "Exit"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: section.title, onclick: () => navigate("section", { sectionId: section.id }) },
      { label: "Section-test · Q" + (i + 1) + "/" + total }
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
      placeholder: "Optional reasoning."
    });
    reasonTa.value = a.answers[i].notes || "";
    reasonTa.addEventListener("input", (ev) => {
      a.answers[i].notes = ev.target.value;
      saveProgress();
    });

    root.appendChild(el("div", { class: "panel" },
      el("div", { class: "qhead" },
        el("span", { class: "qno" }, "Q" + q.n),
        el("span", { class: "badge dom" }, "Section " + section.n),
        q.bSkills && q.bSkills.length
          ? el("span", { class: "badge" }, "Tags: " + q.bSkills.join(", "))
          : null
      ),
      el("h1", { class: "qtitle" }, "Q" + q.n),
      el("div", { class: "qbody" }, q.question),
      optionsWrap,
      el("div", { class: "reason-wrap" },
        el("div", { class: "reason-label" }, "Your reasoning (optional)"),
        reasonTa
      )
    ));

    const isLast = i === total - 1;
    const allPicked = a.answers.every(x => x.pick);

    root.appendChild(el("div", { class: "controls" },
      el("button", {
        onclick: () => { a.idx = Math.max(0, i - 1); saveProgress(); render(); },
        disabled: i === 0 ? "disabled" : false
      }, "← Prev"),
      el("div", { class: "nav-spacer" }),
      !isLast
        ? el("button", { class: "primary", onclick: () => { a.idx = Math.min(total - 1, i + 1); saveProgress(); render(); } }, "Next →")
        : el("button", {
            class: "primary",
            onclick: () => {
              if (!allPicked) {
                const skipped = a.answers.map((x, idx) => x.pick ? null : idx + 1).filter(Boolean);
                if (!confirm("You haven't picked an answer for Q" + skipped.join(", Q") + ". Submit anyway?")) return;
              }
              submitSectionTest(section);
            }
          }, "Submit section-test")
    ));
  }

  function submitSectionTest(section) {
    const sp = ensureSection(section.id);
    const Q = section.sectionTest.questions;
    const a = sp.currentTestAttempt;
    const score = a.answers.reduce((acc, ans, i) => acc + (ans.pick === Q[i].correct ? 1 : 0), 0);
    sp.testAttempts.push({
      score: score,
      total: Q.length,
      dateISO: new Date().toISOString(),
      answers: a.answers.map(x => ({ pick: x.pick, notes: x.notes }))
    });
    sp.currentTestAttempt = null;
    const passPct = section.sectionTest.passPct || 0.7;
    if ((score / Q.length) >= passPct) {
      sp.complete = true;
      unlockNextSection(section.id);
    }
    saveProgress();
    navigate("sectionTestResult", { sectionId: section.id });
  }

  function renderSectionTestResult() {
    const section = getSection(P.location.sectionId);
    if (!section || !section.sectionTest) return navigate("dashboard");
    const sp = ensureSection(section.id);
    const last = sp.testAttempts[sp.testAttempts.length - 1];
    if (!last) return navigate("section", { sectionId: section.id });

    const Q = section.sectionTest.questions;
    const passPct = section.sectionTest.passPct || 0.7;
    const passed = (last.score / last.total) >= passPct;

    brandSub.textContent = section.title + " · Section-test result";
    topnav.appendChild(el("button", { class: "linkish", onclick: () => navigate("section", { sectionId: section.id }) }, "← Section"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: section.title, onclick: () => navigate("section", { sectionId: section.id }) },
      { label: "Section-test result" }
    ]));

    const verdict = passed
      ? "Section complete. " + (CURRICULUM.sections[CURRICULUM.sections.findIndex(s => s.id === section.id) + 1]
          ? "Next section unlocked."
          : "All sections cleared.")
      : "Below " + Math.round(passPct * 100) + "% gate. Re-take, or drill the lowest-scoring concepts first.";

    root.appendChild(el("div", { class: "scorecard" },
      el("div", null,
        el("div", { class: "score-num" }, last.score + " / " + last.total),
        el("div", { class: "score-meta" }, Math.round((last.score / last.total) * 100) + "% · attempt " + sp.testAttempts.length)
      ),
      el("div", { class: "score-band" },
        el("div", { class: "verdict-line " + (passed ? "pass" : "fail") },
          passed ? "Section passed" : "Below pass-gate"),
        el("div", null, verdict)
      )
    ));

    root.appendChild(el("div", { class: "controls", style: "margin-top:0;margin-bottom:18px;" },
      el("button", { onclick: () => navigate("section", { sectionId: section.id }) }, "← Back to section"),
      el("div", { class: "nav-spacer" }),
      el("button", { class: "primary", onclick: () => startSectionTest(section) }, "Re-take section-test")
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
          el("span", { class: "badge dom" }, "Section " + section.n),
          q.bSkills ? el("span", { class: "badge" }, "Tags: " + q.bSkills.join(", ")) : null,
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

  // ---------------- Mock-exam runner ----------------
  function startMockExam(mock) {
    const mp = ensureMock(mock.id);
    if (!mp.currentAttempt) {
      mp.currentAttempt = {
        idx: 0,
        startedISO: new Date().toISOString(),
        answers: mock.questions.map(() => ({ pick: null, notes: "" }))
      };
      saveProgress();
    }
    navigate("mockExam", { mockId: mock.id });
  }

  function scoreBandFor(mock, score) {
    const bands = mock.scoreBands || [];
    return bands.find(b => score >= b.min && score <= b.max) || null;
  }

  function renderMockExam() {
    const mock = getMockExam(P.location.mockId);
    if (!mock) return navigate("dashboard");
    const mp = ensureMock(mock.id);
    if (!mp.currentAttempt) return startMockExam(mock);

    const Q = mock.questions;
    const a = mp.currentAttempt;
    const i = a.idx;
    const q = Q[i];
    const total = Q.length;

    brandSub.textContent = mock.title + " · Mock exam";
    topnav.appendChild(el("span", null, "Q " + (i + 1) + " of " + total));
    topnav.appendChild(el("button", { class: "linkish", onclick: () => {
      if (confirm("Exit the mock exam? Your progress is saved; you can resume from the dashboard.")) {
        navigate("dashboard");
      }
    } }, "Exit"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: mock.title },
      { label: "Q" + (i + 1) + "/" + total }
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

    root.appendChild(el("div", { class: "panel" },
      el("div", { class: "qhead" },
        el("span", { class: "qno" }, "Q" + q.n),
        q.domain ? el("span", { class: "badge dom" }, q.domain) : null,
        q.subArea ? el("span", { class: "badge" }, q.subArea) : null
      ),
      el("h1", { class: "qtitle" }, "Q" + q.n),
      el("div", { class: "qbody" }, q.question),
      optionsWrap,
      el("div", { class: "reason-wrap" },
        el("div", { class: "reason-label" }, "Your reasoning (optional)"),
        reasonTa
      )
    ));

    const isLast = i === total - 1;
    const allPicked = a.answers.every(x => x.pick);

    root.appendChild(el("div", { class: "controls" },
      el("button", {
        onclick: () => { a.idx = Math.max(0, i - 1); saveProgress(); render(); },
        disabled: i === 0 ? "disabled" : false
      }, "← Prev"),
      el("div", { class: "nav-spacer" }),
      !isLast
        ? el("button", { class: "primary", onclick: () => { a.idx = Math.min(total - 1, i + 1); saveProgress(); render(); } }, "Next →")
        : el("button", {
            class: "primary",
            onclick: () => {
              if (!allPicked) {
                const skipped = a.answers.map((x, idx) => x.pick ? null : idx + 1).filter(Boolean);
                if (!confirm("You haven't picked an answer for Q" + skipped.join(", Q") + ". Submit anyway?")) return;
              }
              submitMockExam(mock);
            }
          }, "Submit mock exam")
    ));
  }

  function submitMockExam(mock) {
    const mp = ensureMock(mock.id);
    const Q = mock.questions;
    const a = mp.currentAttempt;
    const score = a.answers.reduce((acc, ans, i) => acc + (ans.pick === Q[i].correct ? 1 : 0), 0);
    mp.attempts.push({
      score: score,
      total: Q.length,
      startedISO: a.startedISO || null,
      finishedISO: new Date().toISOString(),
      answers: a.answers.map(x => ({ pick: x.pick, notes: x.notes }))
    });
    mp.currentAttempt = null;
    saveProgress();
    navigate("mockExamResult", { mockId: mock.id });
  }

  function renderMockExamResult() {
    const mock = getMockExam(P.location.mockId);
    if (!mock) return navigate("dashboard");
    const mp = ensureMock(mock.id);
    const last = mp.attempts[mp.attempts.length - 1];
    if (!last) return navigate("dashboard");

    const Q = mock.questions;
    const passPct = mock.passPct || 0.7;
    const passed = (last.score / last.total) >= passPct;
    const band = scoreBandFor(mock, last.score);

    brandSub.textContent = mock.title + " · Result";
    topnav.appendChild(el("button", { class: "linkish", onclick: () => navigate("dashboard") }, "← Dashboard"));

    root.appendChild(breadcrumbs([
      { label: "Dashboard", onclick: () => navigate("dashboard") },
      { label: mock.title },
      { label: "Result" }
    ]));

    root.appendChild(el("div", { class: "scorecard" },
      el("div", null,
        el("div", { class: "score-num" }, last.score + " / " + last.total),
        el("div", { class: "score-meta" }, Math.round((last.score / last.total) * 100) + "% · attempt " + mp.attempts.length)
      ),
      el("div", { class: "score-band" },
        el("div", { class: "verdict-line " + (passed ? "pass" : "fail") },
          band ? band.verdict : (passed ? "Above pass-gate" : "Below pass-gate")),
        el("div", null, band ? band.message : "")
      )
    ));

    root.appendChild(el("div", { class: "controls", style: "margin-top:0;margin-bottom:18px;" },
      el("button", { onclick: () => navigate("dashboard") }, "← Back to dashboard"),
      el("div", { class: "nav-spacer" }),
      el("button", { class: "primary", onclick: () => startMockExam(mock) }, "Re-take mock exam")
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
          q.domain ? el("span", { class: "badge dom" }, q.domain) : null,
          q.subArea ? el("span", { class: "badge" }, q.subArea) : null,
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

  // ---------------- Boot ----------------
  const VALID_VIEWS = ["dashboard", "section", "concept", "lesson", "quiz", "quizResult", "sectionTest", "sectionTestResult", "mockExam", "mockExamResult"];
  if (VALID_VIEWS.indexOf(P.location.view) === -1) P.location.view = "dashboard";
  render();
})();
