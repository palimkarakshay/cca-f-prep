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
    } else {
      // Real lesson rendering arrives in commit 2.
      panel.appendChild(el("div", { class: "lesson-stub" }, "Lesson rendering arrives in commit 2."));
    }

    panel.appendChild(el("div", { class: "controls" },
      el("button", { onclick: () => navigate("section", { sectionId: section.id }) }, "← Back to section"),
      el("div", { class: "nav-spacer" }),
      el("button", {
        class: "primary",
        disabled: hasQuiz ? false : "disabled",
        onclick: () => hasQuiz && navigate("quiz", { sectionId: section.id, conceptId: concept.id })
      }, hasQuiz ? "Take quiz →" : "Quiz — coming")
    ));

    root.appendChild(panel);
  }

  // ---------------- Lesson / Quiz / Result placeholders (filled in commits 2-3) ----------------
  function renderLesson() {
    // Commit 2 fills this in. For now, fall back to concept detail.
    P.location.view = "concept";
    saveProgress();
    return renderConceptDetail();
  }
  function renderQuiz() {
    root.appendChild(el("div", { class: "panel" },
      el("h2", null, "Quiz runner"),
      el("p", { class: "blurb" }, "Wired up in commit 2 alongside the first authored concept (B1.1)."),
      el("button", { class: "primary", onclick: () => navigate("dashboard") }, "← Back to dashboard")
    ));
  }
  function renderQuizResult()        { renderQuiz(); }
  function renderSectionTest()       { renderQuiz(); }
  function renderSectionTestResult() { renderQuiz(); }

  // ---------------- Boot ----------------
  // If the saved location points at a view that doesn't exist yet, fall back.
  if (P.location.view !== "dashboard" && P.location.view !== "section" && P.location.view !== "concept") {
    P.location.view = "dashboard";
  }
  render();
})();
