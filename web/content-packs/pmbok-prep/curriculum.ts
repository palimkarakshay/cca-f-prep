/* ------------------------------------------------------------------
   PMBOK 8e Prep curriculum.

   Eight sections mirroring the structure of the PMBOK Guide 8th Edition
   (2025) and its companion Standard for Project Management:

     1. Foundations & Value Delivery
     2. The Six Refined Principles (was twelve in 7e)
     3. The Five Focus Areas (formerly Process Groups)
     4. Development Approaches & Tailoring (predictive / adaptive / hybrid)
     5. Performance Domains I — Governance, Scope, Schedule
     6. Performance Domains II — Finance (incl. EVM) & Stakeholders
     7. Performance Domains III — Resources & Risk
     8. Exam strategy & final review

   Content is paraphrased from PMI source material — no direct quotes
   from the PMBOK Guide or Standard are reproduced. PMBOK®, PMP®, and
   PMI® are trademarks of Project Management Institute, Inc.

   Bloom-taxonomy fields are included on every concept so the
   shell's bloom badge surfaces the cognitive level the question asks
   the learner to operate at. Each concept's quiz mixes formats
   (MCQ, true-false, fill-in) and shuffles the correct letter across
   A/B/C/D — no positional bias.

   Shape documented in `web/src/content/curriculum-types.ts`.
------------------------------------------------------------------ */

import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    /* ============================================================
       Section 1 — Foundations & Value Delivery
       ============================================================ */
    {
      id: "s1-foundations",
      n: 1,
      title: "Foundations & value delivery",
      iconImagePath: "/images/modules/final/pmbok-foundations.jpg",
      blurb:
        "What a project is, what value delivery means, and the system of roles, EEFs and OPAs that every PMP scenario assumes.",
      concepts: [
        {
          id: "c1-1-project-vs-operations",
          code: "F1.1",
          title: "Project, program, portfolio, operations",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "PMI defines a project as a temporary endeavour undertaken to create a unique product, service, or result. Two words matter: temporary (it has a definite start and finish) and unique (the output isn't routinely repeated). When a piece of work is ongoing and produces the same outputs again and again, it's operations, not a project.",
              "Programs are groups of related projects managed in a coordinated way to obtain benefits and control not available from managing them individually. Portfolios are collections of projects, programs, and operations grouped to meet strategic business objectives. The hierarchy goes portfolio → program → project → phase → activity, and the higher you go the more strategic and the less prescriptive the work becomes.",
              "On the exam, watch for keywords. 'Recurring monthly report generation' is operations. 'A coordinated set of efforts to roll out a new ERP across all regions' is a program. 'Implementing the finance module of that ERP' is a project. The choice of category drives who governs the work, who funds it, and how success is measured.",
            ],
            keyPoints: [
              "Project = temporary + unique. Operations = ongoing + repetitive.",
              "Program = related projects coordinated for shared benefits.",
              "Portfolio = projects + programs + operations aligned to strategy.",
              "PMBOK 8e (2025) has 6 principles, 5 focus areas, 7 performance domains, 40 processes.",
            ],
            simplified: {
              oneLiner:
                "A project is a one-off bundle of work with a start and an end. Operations is the same work over and over.",
              keyPoints: [
                "Project = has a finish line.",
                "Operations = no finish line.",
                "Program = several related projects.",
                "Portfolio = the org's whole bookshelf of projects, programs, and operations.",
              ],
            },
            deeper: {
              oneLiner:
                "Why PMI cares about the distinction: it determines which body of practice — and which exam — applies.",
              paragraphs: [
                "Projects are governed by PMI's Standard for Project Management and PMBOK Guide (covered by the PMP exam). Programs sit under The Standard for Program Management (PgMP exam). Portfolios sit under The Standard for Portfolio Management (PfMP exam). Operations is the realm of business management — outside PMI's certification scope.",
                "When the exam describes a scenario that is unambiguously operational ('maintain the website 24/7' with no end date), the right answer is usually that it isn't a project at all and should be handled by an operations team — even if 'manage as a project' looks plausible.",
              ],
              pitfalls: [
                "Don't pick 'manage as a program' when the scenario only describes one project. PMI tests whether you can identify the smallest correct unit.",
                "Don't treat a project's repetitive *phases* (e.g., sprints) as operations — the project itself is still temporary even if internal work is iterative.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Your IT team gets 200+ help-desk tickets a day, year after year. There's no defined end date and the outputs (resolved tickets) aren't unique. How would PMI classify this work?",
                options: {
                  A: "A project, because it has measurable outputs.",
                  B: "A program, because tickets cluster into themes.",
                  C: "Operations, because the work is ongoing and repetitive.",
                  D: "A portfolio component, because it consumes budget.",
                },
                correct: "C",
                explanations: {
                  A: "A project must be temporary. Day-after-day support work with no end date fails that test.",
                  B: "A program coordinates *related projects*, not ongoing support tickets.",
                  C: "Right — ongoing and repetitive = operations, not a project.",
                  D: "Consuming budget alone doesn't make something a portfolio component; the portfolio aligns work to strategy and includes operations, but the work *itself* is still operations.",
                },
                principle:
                  "Temporary + unique = project. Ongoing + repetitive = operations.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "A program is always larger and more expensive than any individual project it contains.",
                correct: false,
                explanationFalse:
                  "Correct — a program coordinates related projects for *shared benefits*; size and cost are not the defining test. A small program may oversee several small projects.",
                explanationTrue:
                  "Actually no — size isn't the test. The test is whether the projects are related and produce coordinated benefits.",
                principle:
                  "Programs are defined by coordinated benefit, not by budget size.",
              },
              {
                n: 3,
                question:
                  "Which option best describes a portfolio?",
                options: {
                  A: "A single very large project broken into deliverables.",
                  B: "A grouping of projects, programs, and operations chosen to advance organisational strategy.",
                  C: "A document listing all stakeholders and their interests.",
                  D: "A repository of templates the PMO maintains.",
                },
                correct: "B",
                explanations: {
                  A: "That's a large project, not a portfolio.",
                  B: "Right — portfolios sit at the strategy layer and may include both project and operational work.",
                  C: "That's a stakeholder register.",
                  D: "That's part of organisational process assets (OPAs), not a portfolio.",
                },
                principle:
                  "Portfolios align bundles of work — including operations — to strategy.",
              },
            ],
          },
        },
        {
          id: "c1-2-value-and-business-case",
          code: "F1.2",
          title: "Value, the business case, and benefits realisation",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "PMBOK 8e elevates value to the primary success indicator. Value can be quantitative (return on investment, payback period, net present value) or qualitative (brand lift, employee satisfaction, regulatory compliance). The project exists to deliver target business objectives that are worth more than what is invested.",
              "Value is captured in the business case — the document the sponsor produces before the project is authorised. It states why the project is being undertaken, the expected benefits, the financial justification, and any assumptions. The business case is owned by the sponsor, not the project manager, and it's the document the project is measured against at closure and during benefits realisation.",
              "Benefits realisation extends past project closeout. The deliverable might be released on day one, but the actual benefits (productivity gain, cost saving, market share) typically take months to land. The benefits management plan describes how, when, and by whom benefits will be measured, so the receiving organisation can confirm the value actually showed up.",
            ],
            keyPoints: [
              "Value = the ultimate success indicator in PMBOK 8e (a refined principle of the 8e standard).",
              "Business case is owned by the sponsor; PM uses it as the north star.",
              "Benefits realisation is post-closure — handled by ops or the program owner.",
              "If the business case is no longer valid mid-project, terminate (or re-plan); don't blindly finish.",
            ],
            simplified: {
              oneLiner:
                "Projects exist to deliver more value than they cost. The business case is the bet; benefits realisation is checking whether the bet paid off.",
            },
            deeper: {
              oneLiner:
                "Practical exam patterns: when scenarios mention 'the business case is no longer valid', recommend re-planning or closure, not just continuation.",
              keyPoints: [
                "Deliverable (output) ≠ outcome (the change in stakeholder state) ≠ benefit (the realised value).",
                "Earned value, IRR, NPV, payback are *financial* expressions of value, not value itself.",
                "Adaptive (agile) projects re-validate value every iteration; predictive projects re-validate at phase gates.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Mid-project, market conditions shift and the original business case no longer holds. The expected benefits will not materialise. What is the most PMI-correct next step?",
                options: {
                  A: "Continue execution — the team is already committed.",
                  B: "Escalate to the sponsor and recommend re-planning or terminating the project.",
                  C: "Quietly adjust the scope to fit the new conditions.",
                  D: "Wait until closing to record the change as a lesson learned.",
                },
                correct: "B",
                explanations: {
                  A: "Sunk-cost reasoning. PMI explicitly says it may be best to terminate when value is no longer credible.",
                  B: "Right — when the business case is invalid, escalate to the sponsor with options including termination.",
                  C: "Unauthorised scope change. Not PMI-correct.",
                  D: "Too late. Value should be re-evaluated continuously, not deferred to closing.",
                },
                principle:
                  "When the business case dies, escalate; consider termination. Don't keep building.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "Who owns the business case? (One word — the role.)",
                acceptedAnswers: ["sponsor", "project sponsor", "the sponsor"],
                placeholder: "e.g. sponsor",
                explanation:
                  "The sponsor owns the business case. The PM uses it as a guiding artefact but does not own it.",
                principle:
                  "Sponsor owns the business case and the benefits management plan.",
              },
              {
                n: 3,
                question:
                  "A team delivers software on time and on budget. Six months later, adoption is 4% and the projected productivity gains do not appear. Was this project successful?",
                options: {
                  A: "Yes — the output was delivered on time and on budget.",
                  B: "No — the outcomes and benefits expected from the deliverable did not materialise.",
                  C: "Yes, but only if a lessons-learned session is held.",
                  D: "It cannot be assessed until the next phase begins.",
                },
                correct: "B",
                explanations: {
                  A: "PMBOK 8e moves beyond on-time/on-budget. Value, not output, is the success test.",
                  B: "Right — outputs without outcomes mean no value delivered, regardless of project mechanics.",
                  C: "Lessons learned matter but don't change the value verdict.",
                  D: "Benefits realisation can begin during/after delivery; you don't need a new phase to measure it.",
                },
                principle:
                  "Output is what you ship. Outcome is what changes for stakeholders. Benefit is the realised value. PMBOK 8e measures success by benefit.",
              },
            ],
          },
        },
        {
          id: "c1-3-eef-vs-opa",
          code: "F1.3",
          title: "EEFs vs OPAs — what's outside, what's inside",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "Every PMBOK scenario assumes a project sits in a context. PMI categorises that context into two buckets. Enterprise Environmental Factors (EEFs) are conditions, not under the team's control, that influence or constrain the project. They can be internal (organisational culture, available infrastructure, marketplace conditions) or external (laws, regulations, currency rates, weather, public-health emergencies).",
              "Organisational Process Assets (OPAs) are the plans, processes, policies, procedures, templates, and historical information that the organisation already owns. OPAs are inside the organisation and can be reused or updated. Lessons learned, templates, configuration management databases, and the contract terms-and-conditions library are classic OPAs.",
              "The fastest exam heuristic: 'comes from outside or we can't change it' = EEF; 'comes from inside and we own it' = OPA. The same item can be either depending on origin — for instance, a regulatory standard is an EEF, but the internal compliance template that interprets it is an OPA.",
            ],
            keyPoints: [
              "EEF = conditions outside team control (internal or external). Examples: org culture, regulations, currency.",
              "OPA = plans, processes, templates, history owned by the org. Examples: charter template, lessons learned, risk register starter.",
              "Both feed into almost every process as inputs.",
              "When in doubt: can the team change it? Yes → OPA. No → EEF.",
            ],
            simplified: {
              oneLiner:
                "EEFs are weather. OPAs are tools the org gives you to deal with the weather.",
              keyPoints: [
                "EEF = outside, can't change.",
                "OPA = inside, can use and update.",
                "Both are inputs to nearly every process.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A project manager joins a new organisation and finds (1) a corporate risk-register template, (2) a regulatory ceiling on working-week hours, and (3) the company's escalation policy. Classify each.",
                options: {
                  A: "All three are EEFs.",
                  B: "(1) and (3) are OPAs; (2) is an EEF.",
                  C: "(1) is an OPA; (2) and (3) are EEFs.",
                  D: "All three are OPAs.",
                },
                correct: "B",
                explanations: {
                  A: "Templates and internal policies are owned by the org and modifiable — they're OPAs.",
                  B: "Right — templates + internal policies are OPAs; a *regulatory* constraint is external and counts as an EEF.",
                  C: "Internal escalation policy is owned by the org — it's an OPA, not an EEF.",
                  D: "Regulatory ceiling on working hours is external to the team — that's an EEF.",
                },
                principle:
                  "OPAs are what the org owns and you can use/update. EEFs are conditions you must respect but can't change.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Historical lessons learned from past projects are an example of an EEF.",
                correct: false,
                explanationFalse:
                  "Right — lessons learned live in the org's knowledge repository and are an OPA. They're inside the organisation and reusable.",
                explanationTrue:
                  "Actually no — lessons learned are owned by the org and re-usable, so they're OPAs, not EEFs.",
                principle:
                  "Historical information / lessons learned = OPA, not EEF.",
              },
              {
                n: 3,
                question:
                  "Which of these is most clearly an EEF rather than an OPA?",
                options: {
                  A: "The company-wide procurement template.",
                  B: "The marketplace currency exchange rate.",
                  C: "The org's risk-categorisation taxonomy.",
                  D: "The standard project closure checklist.",
                },
                correct: "B",
                explanations: {
                  A: "A template is owned by the org and reusable — an OPA.",
                  B: "Right — exchange rates are external market conditions the team can't change. Classic EEF.",
                  C: "Categorisation taxonomies are organisational process assets.",
                  D: "Standard checklists are OPAs.",
                },
                principle:
                  "External, uncontrollable conditions = EEF. Internal, reusable artefacts = OPA.",
              },
            ],
          },
        },
        {
          id: "c1-4-roles",
          code: "F1.4",
          title: "Sponsor, PM, team, stakeholders",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "The sponsor is the senior person who champions the project, provides funding, owns the business case, and clears organisational obstacles. The sponsor authorises the project (typically by signing the project charter) and accepts the final benefits. The sponsor does not run the project day-to-day — that's the PM.",
              "The project manager is the person assigned by the performing organisation to lead the team that is responsible for achieving the project objectives. PMBOK 8e calls out a broader 'project management team' — the PM plus any people who help with management activities (planning, controlling, reporting). The PM is accountable for the outcome; the team is responsible for the work.",
              "Stakeholders are anyone who can affect, be affected by, or perceive themselves to be affected by the project. That includes the customer, end users, the sponsor, regulators, suppliers, the PM's own functional manager, and even people who think the project will harm them. PMBOK is generous with the definition: if they think they're a stakeholder, they probably are.",
            ],
            keyPoints: [
              "Sponsor: funds, charters, accepts benefits. Owns the business case.",
              "PM: accountable for objectives; runs the project day-to-day.",
              "Team: responsible for the work.",
              "Stakeholders: anyone affected or who thinks they are.",
            ],
            simplified: {
              oneLiner:
                "Sponsor pays and approves. PM steers. Team builds. Stakeholders watch (and sometimes block).",
            },
            deeper: {
              oneLiner:
                "PMI distinguishes 'project team' (full set of people doing the work) from 'project management team' (subset doing planning / controlling) — distinguishable on exam questions about roles.",
              keyPoints: [
                "Customer and end user can be the same person but often aren't.",
                "Functional manager and PM share resources in matrix orgs — common source of conflict scenarios.",
                "RACI (Responsible / Accountable / Consulted / Informed) is the classic tool to make role boundaries unambiguous.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Who signs the project charter to formally authorise a project?",
                options: {
                  A: "The project manager.",
                  B: "The lead developer.",
                  C: "The sponsor (or senior management representative).",
                  D: "The customer's procurement officer.",
                },
                correct: "C",
                explanations: {
                  A: "The PM uses the charter; they don't authorise the project.",
                  B: "Team members do the work — they don't sign the charter.",
                  C: "Right — the sponsor signs the charter, formally authorising the project and committing org resources.",
                  D: "Procurement signs contracts, not the internal project charter.",
                },
                principle:
                  "Charter is signed by the sponsor (or senior management). PM uses it as authority.",
              },
              {
                n: 2,
                question:
                  "Who is *accountable* (in the RACI sense) for the project's objectives being met?",
                options: {
                  A: "The team collectively.",
                  B: "The PMO director.",
                  C: "The project manager.",
                  D: "Every stakeholder equally.",
                },
                correct: "C",
                explanations: {
                  A: "Team is responsible (does the work) but not accountable.",
                  B: "The PMO supports projects, not the accountable party for any single project.",
                  C: "Right — accountability sits with the PM; responsibility is distributed across the team.",
                  D: "Accountability doesn't distribute. Exactly one role is accountable in RACI.",
                },
                principle:
                  "RACI: PM is accountable, team is responsible, sponsor/PMO are consulted/informed.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "A community group that fears the project will damage local wildlife counts as a stakeholder even if the project team doesn't agree.",
                correct: true,
                explanationTrue:
                  "Right — PMBOK explicitly includes anyone who *perceives themselves* to be affected. Engagement-strategy questions hinge on this.",
                explanationFalse:
                  "Actually yes — PMBOK includes anyone who *perceives* themselves to be affected, even if the team disagrees with the perception.",
                principle:
                  "Stakeholder = affected, affecting, *or perceives affected*. Perception alone qualifies.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Which is NOT one of PMBOK 8e's structural counts?",
            options: {
              A: "6 principles.",
              B: "5 focus areas.",
              C: "7 performance domains.",
              D: "10 knowledge areas.",
            },
            correct: "D",
            explanations: {
              A: "Correct count — 6 refined principles in 8e (down from 12 in 7e).",
              B: "Correct count — 5 focus areas (formerly Process Groups).",
              C: "Correct count — 7 Performance Domains.",
              D: "Right — 10 knowledge areas was 6e structure. 8e replaces it with 7 Performance Domains.",
            },
            principle:
              "PMBOK 8e: 6 principles, 5 focus areas, 7 performance domains, 40 processes.",
          },
          {
            n: 2,
            question:
              "A team is rolling out a coordinated set of related projects (CRM, billing, payment gateway) to achieve a single shared 'unified customer experience' benefit. What is this most accurately?",
            options: {
              A: "A very large project.",
              B: "A program.",
              C: "A portfolio.",
              D: "Operations.",
            },
            correct: "B",
            principle:
              "Program = coordinated related projects sharing a benefit.",
          },
          {
            n: 3,
            question:
              "The marketplace exchange rate moves 12% against the project, blowing the budget. From a PMBOK categorisation standpoint, the exchange rate is a(n):",
            options: {
              A: "OPA.",
              B: "Project process asset.",
              C: "EEF.",
              D: "Risk register entry.",
            },
            correct: "C",
            principle:
              "External, uncontrollable conditions = EEF.",
          },
          {
            n: 4,
            question:
              "The deliverable launched on schedule, but adoption is stalled and projected benefits won't materialise. Which artefact most directly captures whether expected benefits showed up?",
            options: {
              A: "Project charter.",
              B: "Benefits management plan.",
              C: "Stakeholder register.",
              D: "Communications management plan.",
            },
            correct: "B",
            principle:
              "Benefits management plan governs how and when benefits are measured — typically after closeout.",
          },
          {
            n: 5,
            question:
              "Who owns the business case?",
            options: {
              A: "The project manager.",
              B: "The PMO.",
              C: "The sponsor.",
              D: "The procurement department.",
            },
            correct: "C",
            principle:
              "Sponsor owns the business case and the benefits management plan. PM uses both as a north star.",
          },
        ],
      },
    },
    /* ============================================================
       Section 2 — The Six Refined Principles (PMBOK 8e)
       ============================================================ */
    {
      id: "s2-principles",
      n: 2,
      title: "The six refined principles",
      iconImagePath: "/images/modules/final/pmbok-principles.jpg",
      blurb:
        "PMBOK 8e refined the twelve 7e principles down to six. Each is a stance, not a process — and the exam tests whether you can apply them in tradeoff scenarios.",
      concepts: [
        {
          id: "c2-1-holistic-view",
          code: "P2.1",
          title: "Adopt a Holistic View",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Adopt a Holistic View principle says the project manager should treat the project as a system: components and their interdependencies, not isolated tasks. Systems thinking traces problems to root causes, surfaces hidden interconnections, and forces the PM to consider how a change in one area ripples elsewhere.",
              "The 8e Standard frames this as 'a framework for viewing interrelationships in their full context and for seeing patterns rather than static snapshots.' Practically, it means: before changing the schedule, ask what changes in scope, cost, quality, risk, and stakeholders. Before approving a scope change, ask whether it conflicts with the strategic objectives the project was chartered for.",
              "Holistic view is the principle that touches every other performance domain. The 8e Standard explicitly says it 'interacts with and elevates the performance of all domains' — Governance, Scope, Schedule, Finance, Stakeholders, Resources, and Risk. If a scenario asks about a decision that seems narrow but has ripple effects, this is the principle you're being tested on.",
            ],
            keyPoints: [
              "Holistic view = systems thinking applied to projects.",
              "Touches all 7 performance domains.",
              "Drives root-cause analysis, integrated decision-making, and proactive risk management.",
              "PMI counter-pattern: optimising one constraint (e.g., schedule) while quietly damaging others.",
            ],
            simplified: {
              oneLiner:
                "Look at the whole project, not just the bit in front of you.",
            },
            deeper: {
              oneLiner:
                "The exam favours holistic answers over narrowly-correct ones — even when a narrower answer is technically valid.",
              examples: [
                {
                  title: "Schedule pressure scenario",
                  body: "If the test asks 'the schedule is slipping; what should the PM do first?', the holistic answer is usually 'analyse impact on scope, cost, quality, risk, and stakeholders before acting' — not 'crash the schedule' or 'add resources'. Both are valid responses, but the holistic principle says understand first.",
                },
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "The scope is being expanded mid-project. The most PMI-correct first action is:",
                options: {
                  A: "Approve the change if the customer requests it.",
                  B: "Analyse impact across schedule, cost, quality, risk, and stakeholders before deciding.",
                  C: "Refuse — scope is fixed.",
                  D: "Quietly add the work and absorb the cost.",
                },
                correct: "B",
                explanations: {
                  A: "Customer request alone doesn't bypass impact analysis.",
                  B: "Right — Adopt a Holistic View: evaluate the ripple effects before deciding. This precedes formal change control.",
                  C: "Scope is not fixed — change control exists exactly to handle changes.",
                  D: "Unauthorised work + hidden cost = trouble. Never PMI-correct.",
                },
                principle:
                  "Holistic View: analyse cross-domain impact before any change decision.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Adopt a Holistic View applies only to large or complex projects.",
                correct: false,
                explanationFalse:
                  "Right — the 8e Standard names it as one of six principles for *all* projects regardless of size.",
                explanationTrue:
                  "Actually no — the principle applies regardless of project size. Small projects also have interdependencies.",
                principle:
                  "All six principles apply to all projects, scaled by tailoring (Section 3 of the PMBOK Guide).",
              },
              {
                n: 3,
                question:
                  "Which connected domain is the Adopt a Holistic View principle most directly about?",
                options: {
                  A: "Only the Governance domain.",
                  B: "Only the Risk domain.",
                  C: "All seven performance domains.",
                  D: "Only the Stakeholders and Scope domains.",
                },
                correct: "C",
                principle:
                  "Holistic view interacts with and elevates the performance of all seven performance domains.",
              },
            ],
          },
        },
        {
          id: "c2-2-focus-on-value",
          code: "P2.2",
          title: "Focus on Value",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Focus on Value principle elevates value — return per unit of investment — to the ultimate success indicator. PMBOK 8e is explicit that value can be qualitative (testimonials, brand lift, societal benefit) as well as quantitative (ROI, NPV, IRR). What matters is that the project delivers more value than it consumes.",
              "Value can be realised throughout the project, at completion, or after closure. The Standard says: 'If misalignment persists or the project is unlikely to deliver the intended value, it may be best to terminate the effort.' This is one of the most-tested patterns — the PMP exam will repeatedly check that you don't blindly continue when value evaporates.",
              "Operationally, Focus on Value means continuously evaluating outputs against intended outcomes. A deliverable (the software) is not the same as the outcome (people use the software to do better work) is not the same as the benefit (productivity gain measured in dollars). The principle asks the PM to keep pulling the conversation from outputs back to outcomes and benefits.",
            ],
            keyPoints: [
              "Value, not on-time/on-budget, is the success indicator in 8e.",
              "Value can be quantitative or qualitative.",
              "If value won't be delivered, terminate or re-plan — don't just complete.",
              "Distinguish output → outcome → benefit.",
            ],
            simplified: {
              oneLiner:
                "Don't get high on delivering features. Stay focused on whether anyone uses them and gets value.",
            },
            deeper: {
              oneLiner:
                "Practical exam tells: anything mentioning 'gold plating' or 'scope creep' is usually wrong because both add work without adding value.",
              keyPoints: [
                "Gold plating = team adds features the customer didn't ask for (bad).",
                "Scope creep = stakeholders add scope without change control (bad).",
                "Both reduce value-per-unit-of-investment.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Halfway through delivery, the team realises that 30% of the features in the backlog will not be used by the customer. The customer agrees. What's the PMI-correct response?",
                options: {
                  A: "Build them anyway — the contract listed them.",
                  B: "Build a faster version of them and ship.",
                  C: "Negotiate to remove them through change control; focus remaining effort on high-value items.",
                  D: "Add even more features to make up.",
                },
                correct: "C",
                explanations: {
                  A: "Building work that delivers no value is waste.",
                  B: "Same problem — faster delivery of zero-value work is still zero value.",
                  C: "Right — Focus on Value: through formal change control, redirect investment to value-adding work.",
                  D: "Gold plating — adds cost without adding value.",
                },
                principle:
                  "When work won't deliver value, change control it out. Don't build it.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "PMBOK 8e distinguishes three terms in a value chain. Output is what you produce; ____ is the change for stakeholders; benefit is the realised value.",
                acceptedAnswers: ["outcome", "the outcome", "outcomes"],
                explanation:
                  "Output → outcome → benefit. The outcome is the change the stakeholder experiences (adoption, behaviour change). The benefit is its realised value.",
                principle:
                  "Output is the deliverable. Outcome is the stakeholder change. Benefit is the realised value.",
              },
              {
                n: 3,
                question:
                  "Which is the clearest example of 'gold plating' in a software project?",
                options: {
                  A: "Adding a flashy animation the customer didn't request and won't use.",
                  B: "Doing scope analysis on a customer change request.",
                  C: "Recording lessons learned at iteration end.",
                  D: "Holding a retrospective.",
                },
                correct: "A",
                explanations: {
                  A: "Right — gold plating is unrequested embellishment that adds cost without adding stakeholder-perceived value.",
                  B: "Scope analysis is good practice, not gold plating.",
                  C: "Lessons learned add organisational value.",
                  D: "Retrospectives are part of normal adaptive practice.",
                },
                principle:
                  "Gold plating adds unrequested work — reduces value-per-investment.",
              },
            ],
          },
        },
        {
          id: "c2-3-embed-quality",
          code: "P2.3",
          title: "Embed Quality Into Processes and Deliverables",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Embed Quality says quality is built in, not inspected in. The principle covers both deliverable quality (the thing meets requirements and acceptance criteria) and process quality (the way the team works is appropriate and effective). Both contribute to outcomes that meet or exceed target quality thresholds.",
              "PMBOK 8e names eight dimensions of quality: performance, conformity, reliability, resilience, satisfaction, uniformity, efficiency, and sustainability — plus compliance with standards and regulations. On the exam, watch for the difference between quality (the right thing being made well) and grade (a category — premium vs. basic). PMI's classic line: low quality is always a problem; low grade is fine if that's what the customer asked for.",
              "Operational quality practices include early defect detection ('shift-left'), inspections, audits, reviews, training, and the use of continuous improvement methods (Plan-Do-Check-Act, Lean, Six Sigma, Kaizen, Total Quality Management). Prevention is preferred over inspection: cheaper to design quality in than to test defects out.",
            ],
            keyPoints: [
              "Quality is built in (prevention) — not inspected in (detection).",
              "Quality ≠ grade. Low quality is always bad; low grade may be deliberate.",
              "Prevention > inspection (it's cheaper).",
              "Continuous improvement = PDCA, Lean, Six Sigma, Kaizen, TQM.",
            ],
            simplified: {
              oneLiner:
                "Make it right the first time. Don't ship junk and patch.",
            },
            deeper: {
              oneLiner:
                "The cost of quality includes prevention costs, appraisal costs, internal failure costs, and external failure costs — the further down the list, the more it hurts.",
              keyPoints: [
                "Cost of conformance: prevention (training, processes) + appraisal (inspections).",
                "Cost of non-conformance: internal failures (rework before ship) + external failures (warranty, brand damage).",
                "External failures are catastrophically more expensive than prevention.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A customer specifies they want a 'basic' (low-grade) phone with fewer features at a lower price. The phone meets all requirements. How does PMBOK classify this?",
                options: {
                  A: "Low quality, low grade.",
                  B: "High quality, low grade.",
                  C: "High quality, high grade.",
                  D: "Low quality, high grade.",
                },
                correct: "B",
                explanations: {
                  A: "Low quality means defects — not present here.",
                  B: "Right — quality (meets specs) is independent of grade (category). Low-grade-on-purpose is fine; low-quality never is.",
                  C: "Grade is low (basic phone) by design.",
                  D: "Quality is high (no defects); grade is low.",
                },
                principle:
                  "Quality ≠ grade. Low quality is always bad. Low grade is a customer choice.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Inspection is the preferred way to ensure quality, because catching defects late is always cheapest.",
                correct: false,
                explanationFalse:
                  "Right — prevention is preferred over inspection. Catching defects late is the most expensive option (especially external failures after release).",
                explanationTrue:
                  "Actually no — prevention is preferred. External failures (post-release) are dramatically more expensive than prevention.",
                principle:
                  "Cost of quality grows as defects move outward: prevention < appraisal < internal failure < external failure.",
              },
              {
                n: 3,
                question:
                  "Which is NOT a continuous-improvement method PMI explicitly references?",
                options: {
                  A: "Plan-Do-Check-Act (PDCA).",
                  B: "Lean.",
                  C: "Six Sigma.",
                  D: "Big Design Up Front (BDUF).",
                },
                correct: "D",
                principle:
                  "PMI's CI methods include PDCA, Lean, Six Sigma, Kaizen, TQM. BDUF is the predictive-extreme caricature, not a CI method.",
              },
            ],
          },
        },
        {
          id: "c2-4-accountable-leader",
          code: "P2.4",
          title: "Be an Accountable Leader",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Be an Accountable Leader frames leadership as ownership of the project's target business objectives plus the actions and decisions taken to pursue them. Accountability is distinct from authority: authority is the position; leadership is the influence. PMBOK 8e is explicit that 'any project professional, stakeholder, and team member can demonstrate leadership behaviours' — leadership is shared on high-performing projects.",
              "Key characteristics PMI lists: integrity, honesty, fairness; self-awareness; respectfulness, humility, and availability (the basis of servant leadership); flexibility and adaptability; shared leadership. The principle pairs with the others — particularly Build an Empowered Culture — to describe how a project manager who has limited formal authority still gets things done.",
              "On the exam, leadership scenarios usually test these four things: (1) escalating versus owning, (2) influencing without authority, (3) servant-leader behaviours (remove blockers, model behaviour) over directive ones, and (4) the difference between management (plan, measure, control) and leadership (vision, inspire, motivate).",
            ],
            keyPoints: [
              "Authority ≠ leadership. PMs often have low authority and rely on influence.",
              "Servant leadership = supporting the team, removing barriers, leading by example.",
              "Shared leadership = anyone on the project can lead in the moment.",
              "Management is about plans; leadership is about people.",
            ],
            simplified: {
              oneLiner:
                "Take responsibility, treat people well, lead by example. Don't hide behind your title.",
            },
            deeper: {
              oneLiner:
                "PMI prefers servant-leader options. Watch for 'tell the team', 'order', 'mandate' — usually wrong. 'Coach', 'facilitate', 'remove blockers', 'model' — usually right.",
              paragraphs: [
                "PMBOK 8e draws on five leadership styles you should be able to distinguish on the exam: directive (assign work, tight oversight), transactional (reward + penalty, KPIs), servant (support the team, remove impediments), transformational (vision + intrinsic motivation), and laissez-faire (hands-off). Most PMP scenarios reward servant + transformational. Directive is reserved for emergencies, safety incidents, or wholly new teams with no shared norms. Laissez-faire is almost never the right answer.",
                "There is a subtle exam pattern around situational leadership (Hersey-Blanchard). The 'correct' style depends on the team's task-readiness: low capability + low commitment → directing; low capability + high commitment → coaching; high capability + low commitment → supporting; high capability + high commitment → delegating. The trap option is always 'one style for everyone' — PMI penalises rigid leaders.",
              ],
              keyPoints: [
                "Five styles: directive, transactional, servant, transformational, laissez-faire.",
                "Default to servant on the exam; reserve directive for safety/emergency.",
                "Situational leadership: match style to team task-readiness, not to your own preference.",
                "Emotional intelligence (EI) — self-awareness, self-regulation, motivation, empathy, social skill — is explicitly named in the 8e principle.",
              ],
              pitfalls: [
                "Don't pick 'use authority' just because the PM has formal authority. PMBOK separates positional power from leadership.",
                "Don't escalate first when a facilitative attempt is still available — PMI prefers the lowest-authority resolution that works.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Two senior team members are in conflict. The PM has no formal authority over either. The most PMI-aligned response is to:",
                options: {
                  A: "Escalate immediately to the sponsor.",
                  B: "Tell one of them to fall in line.",
                  C: "Facilitate a conversation between them to surface the underlying issue.",
                  D: "Ignore it — they're senior, they'll sort it.",
                },
                correct: "C",
                explanations: {
                  A: "Escalation is a later step, after the PM has tried to resolve at the project level.",
                  B: "Without authority and without a facilitative attempt — not PMI-correct.",
                  C: "Right — facilitate, surface root cause. Servant-leader behaviour, accountability for the team dynamic.",
                  D: "Ignoring conflict reduces team performance — the opposite of accountable leadership.",
                },
                principle:
                  "Accountable leader: facilitate first, escalate only when needed.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Leadership and authority are the same thing.",
                correct: false,
                explanationFalse:
                  "Right — authority is positional; leadership is influence. PMBOK is explicit that anyone can lead, regardless of position.",
                explanationTrue:
                  "Actually no — PMBOK separates them. Authority is positional power; leadership is influence and example.",
                principle:
                  "Authority is given; leadership is demonstrated.",
              },
              {
                n: 3,
                question:
                  "Which behaviour is most associated with servant leadership in PMBOK?",
                options: {
                  A: "Issuing directives to remove ambiguity.",
                  B: "Removing barriers and supporting team needs.",
                  C: "Centralising decisions to maintain consistency.",
                  D: "Demanding daily status updates to enforce accountability.",
                },
                correct: "B",
                principle:
                  "Servant leadership: support the team, remove barriers, model the behaviour you want.",
              },
            ],
          },
        },
        {
          id: "c2-5-sustainability",
          code: "P2.5",
          title: "Integrate Sustainability Within All Project Areas",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Integrate Sustainability is the principle PMBOK 8e added (and that distinguishes 8e from older editions): meet present needs without compromising future generations' ability to meet theirs. The principle covers the triple bottom line — economic, social, environmental — and asks the project to consider externalities, not just delivered value.",
              "PMI's Sustainability Pyramid gives a four-level hierarchy of preferences for handling negative externalities: (1) avoid them altogether, (2) minimise them, (3) restore the impact, (4) compensate/offset. Higher is better. The principle applies at tactical, operational, and strategic levels — from picking recycled materials on a construction site to choosing a financing structure that doesn't lock in carbon emissions.",
              "On the exam, sustainability questions often pit short-term cost against long-term impact. PMI's correct answer respects sustainability when there's a clear externality; it does not require ignoring economics. The principle is about *integration*, not maximisation.",
            ],
            keyPoints: [
              "Triple bottom line: economic + social + environmental.",
              "Sustainability pyramid: avoid > minimise > restore > compensate.",
              "Applies at tactical, operational, and strategic levels.",
              "Integration — not maximisation. Sustainability is one factor among many.",
            ],
            simplified: {
              oneLiner:
                "Think about people, planet, and profit — not just profit.",
            },
            deeper: {
              oneLiner:
                "Sustainability often shows up via Risk: long-term environmental or regulatory threats become near-term risks once you take a sustainable lens.",
              paragraphs: [
                "The 2025 PMBOK explicitly references the UN Sustainable Development Goals (SDGs) and ISO 14001 as external frameworks a project may need to align to. Public-sector and EU-funded projects increasingly mandate this alignment in the contract — meaning sustainability is no longer a 'nice to have' principle, it is a constraint on the project management plan.",
                "Sustainability decisions also reframe the cost baseline. A higher up-front spend that avoids a future remediation cost is *not* a budget overrun — it's an NPV-positive choice when the avoided remediation is correctly valued. On the exam, watch for scenarios that present 'cheaper now / costlier later' choices: the PMI-correct answer follows the sustainability pyramid (avoid > minimise > restore > compensate) when the externality is named.",
              ],
              keyPoints: [
                "Triple bottom line: economic + social + environmental, all three measured.",
                "Sustainability constraints can be contractual (EU, SDG-aligned funders, ISO 14001).",
                "Avoid > minimise > restore > compensate — pick the higher rung when available.",
                "Long-tail externalities (carbon, regulatory, reputational) belong in the risk register.",
              ],
              pitfalls: [
                "Don't treat sustainability as marketing copy on the exam. PMBOK 8e tests it as a real planning input.",
                "Don't pick 'compensate' (offset) when 'avoid' or 'minimise' is feasible — the pyramid is strict-order.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A construction project can use a cheaper material that produces 3× the carbon emissions, or an alternative that costs 8% more but matches industry sustainability benchmarks. The business case allows either. Which is PMI's pyramid-aligned preference?",
                options: {
                  A: "Cheaper material — the business case allows it.",
                  B: "Sustainable alternative — avoid/minimise the negative externality.",
                  C: "Cheaper material + buy offsets.",
                  D: "Defer the decision to procurement.",
                },
                correct: "B",
                explanations: {
                  A: "Allowed ≠ pyramid-aligned.",
                  B: "Right — avoid > minimise > restore > compensate. The alternative *avoids* the externality.",
                  C: "Offsets sit at the bottom of the pyramid; avoidance is preferred when feasible.",
                  D: "Doesn't apply the principle.",
                },
                principle:
                  "Sustainability pyramid: avoid first, compensate last.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Integrate Sustainability applies only to construction or manufacturing projects.",
                correct: false,
                explanationFalse:
                  "Right — the principle applies to all projects, including digital, services, and research projects.",
                explanationTrue:
                  "Actually no — PMBOK 8e applies sustainability to all projects, including software, services, research.",
                principle:
                  "Sustainability is universal, applied at tactical / operational / strategic levels.",
              },
              {
                n: 3,
                question:
                  "Which option best describes the Triple Bottom Line?",
                options: {
                  A: "Cost / schedule / scope.",
                  B: "Plan / do / check.",
                  C: "People / planet / profit (social, environmental, economic).",
                  D: "Initiate / plan / execute.",
                },
                correct: "C",
                principle:
                  "Triple bottom line balances economic, social, and environmental outcomes.",
              },
            ],
          },
        },
        {
          id: "c2-6-empowered-culture",
          code: "P2.6",
          title: "Build an Empowered Culture",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Build an Empowered Culture says stakeholders and teams should be set up to collaborate proactively, with clarity on roles, responsibilities, team agreements, and processes — and then be trusted to act. The principle calls out diversity, process definition, interpersonal skills, knowledge of organisational structures, and team agreements as the five enablers.",
              "Team agreements are the practical artefact: a set of behavioural parameters and working norms agreed at project start. They cover meeting cadence, definition of done, handling disagreement, working hours, communication channels, and similar. Without them, every conflict becomes a renegotiation; with them, the team has shared ground to stand on.",
              "On the exam, watch for scenarios that pit micro-management against empowerment. The PMI-aligned answer favours trusting the team after providing context and norms — not directing every decision. Particularly relevant in adaptive (agile) environments where the team self-organises around work.",
            ],
            keyPoints: [
              "Team agreements = working norms, set early, owned by the team.",
              "Empowerment ≠ abandonment — context and norms first, then trust.",
              "Diversity enriches; empowered culture lets diverse voices land.",
              "Adaptive (agile) approaches especially depend on empowerment.",
            ],
            simplified: {
              oneLiner:
                "Give people clear norms and clear context, then trust them.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A new project team is forming. Which is the PMI-correct first step toward an empowered culture?",
                options: {
                  A: "Have the PM dictate the team's working norms.",
                  B: "Co-author team agreements at the start of the project.",
                  C: "Skip norms; let them emerge from conflict.",
                  D: "Defer norms until after the first deliverable.",
                },
                correct: "B",
                explanations: {
                  A: "Empowerment requires the team owns the norms, not the PM dictating.",
                  B: "Right — team agreements at the start, co-authored, are the foundation of empowered culture.",
                  C: "Conflict-driven norms erode trust. PMBOK prescribes proactive norms.",
                  D: "Delayed norms means delayed empowerment and likely chaos.",
                },
                principle:
                  "Team agreements are set up at the beginning, by the team, to enable empowerment.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Empowerment means the PM steps back entirely and lets the team decide everything without setting context.",
                correct: false,
                explanationFalse:
                  "Right — empowerment requires clarity of roles, norms, and context first. Then trust. Abandonment ≠ empowerment.",
                explanationTrue:
                  "Actually no — empowerment requires PMI's five enablers (diversity, process definition, interpersonal skills, structures awareness, team agreements). Abandonment doesn't qualify.",
                principle:
                  "Empowerment = trust *after* clarity. Norms first, autonomy second.",
              },
              {
                n: 3,
                question:
                  "Which is NOT one of the five enablers PMBOK names under Build an Empowered Culture?",
                options: {
                  A: "Team agreements.",
                  B: "Interpersonal skills.",
                  C: "Strict directive leadership.",
                  D: "Diversity.",
                },
                correct: "C",
                principle:
                  "The five enablers are diversity, process definition, interpersonal skills, knowledge of org structures, and team agreements.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "PMBOK 8e refined the principles from twelve down to how many?",
            options: { A: "Four.", B: "Six.", C: "Eight.", D: "Ten." },
            correct: "B",
            principle:
              "PMBOK 8e has six refined principles.",
          },
          {
            n: 2,
            question:
              "Which principle is the 'meta' principle that elevates all seven performance domains?",
            options: {
              A: "Focus on Value.",
              B: "Adopt a Holistic View.",
              C: "Embed Quality.",
              D: "Build an Empowered Culture.",
            },
            correct: "B",
            principle:
              "Holistic View is the systems-thinking principle that connects to every performance domain.",
          },
          {
            n: 3,
            question:
              "Customer asks for a basic, no-frills phone. The phone ships defect-free at the price agreed. PMBOK would describe this as:",
            options: {
              A: "Low quality, low grade.",
              B: "Low quality, high grade.",
              C: "High quality, low grade.",
              D: "High quality, high grade.",
            },
            correct: "C",
            principle:
              "Quality (meets requirements) and grade (category) are independent. Low grade is fine if customer wanted it.",
          },
          {
            n: 4,
            question:
              "The sustainability pyramid's most-preferred response to a negative externality is to:",
            options: {
              A: "Compensate / offset.",
              B: "Restore the impact.",
              C: "Minimise the impact.",
              D: "Avoid the impact altogether.",
            },
            correct: "D",
            principle:
              "Pyramid order: avoid > minimise > restore > compensate.",
          },
          {
            n: 5,
            question:
              "The PM has no formal authority over a remote, cross-vendor team. The most PMI-aligned route to action is:",
            options: {
              A: "Demand compliance via formal escalation.",
              B: "Lead by influence and example; build relationships and remove blockers.",
              C: "Wait until problems become severe enough to justify formal action.",
              D: "Avoid making decisions until authority is granted.",
            },
            correct: "B",
            principle:
              "Be an Accountable Leader: leadership is influence, not authority.",
          },
        ],
      },
    },
    /* ============================================================
       Section 3 — The Five Focus Areas (formerly Process Groups)
       ============================================================ */
    {
      id: "s3-focus-areas",
      n: 3,
      title: "The five focus areas",
      iconImagePath: "/images/modules/final/pmbok-focus-areas.jpg",
      blurb:
        "PMBOK 8e renames the historic Process Groups as Focus Areas: Initiating, Planning, Executing, Monitoring & Controlling, Closing. They overlap, iterate, and are independent of approach.",
      concepts: [
        {
          id: "c3-1-initiating",
          code: "FA3.1",
          title: "Initiating: charter the project, identify stakeholders",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Initiating focus area covers the work needed to authorise a new project or phase. Its purpose is to align stakeholders' expectations on the project's purpose, define the initial scope and resources, identify key stakeholders, and assign project-management roles. Two artefacts dominate the output: the project charter and the stakeholder register.",
              "The project charter is the document — signed by the sponsor — that formally authorises the project and gives the PM authority to apply organisational resources. It typically captures the high-level scope, the business case link, the key stakeholders, the high-level risks, the success criteria, and the assumptions. Without a charter, the project has no legitimate claim on the org's people or money.",
              "The stakeholder register identifies who is involved, what they care about, and how to engage them. It's a living document — stakeholders change as the project evolves — but the *initial* register must exist before Planning begins, because every later plan (communications, risk, scope) depends on knowing who to plan for.",
            ],
            keyPoints: [
              "Initiating produces the charter and the initial stakeholder register.",
              "Sponsor signs the charter; PM uses it as authority.",
              "Initiating happens at project start AND at the start of each new phase.",
              "Without a charter, the PM has no claim on org resources.",
            ],
            simplified: {
              oneLiner:
                "Initiating is the 'we're really doing this' moment — sponsor signs the charter, key stakeholders are named.",
            },
            deeper: {
              oneLiner:
                "Adaptive projects still need a charter — it just covers less detail (vision + initial backlog rather than full scope) and is revisited more often.",
              paragraphs: [
                "The Initiating focus area produces two anchor artefacts: the project charter and the initial stakeholder register. The charter names the sponsor, the high-level objectives, the success criteria, the assumptions and constraints, the high-level risks, the budget summary, and — crucially — the PM's level of authority. It is the document the PM points at whenever a stakeholder asks 'do you have the authority to decide that?'.",
                "Initiating also resolves the predictive-vs-adaptive choice (or the hybrid mix). On predictive (waterfall) projects a single charter survives to closeout; on adaptive (agile) projects a 'lightweight' charter is paired with a continuously-refined product backlog and re-validated at every phase gate. Either way, the project should not move into Planning until the charter is signed by the sponsor — running unauthorised work is a classic exam trap.",
              ],
              keyPoints: [
                "Charter contents: objective, success criteria, high-level scope, milestones, budget summary, assumptions, constraints, high-level risk, PM authority.",
                "Charter is owned by the sponsor; the PM drafts but does not sign.",
                "Stakeholder register starts in Initiating and is updated continuously.",
                "Adaptive charter = lighter + revisited; predictive charter = heavier + stable.",
              ],
              pitfalls: [
                "Don't begin planning without a signed charter — 'we'll write it later' is wrong on the exam.",
                "Don't confuse the charter (high-level, sponsor-signed) with the project management plan (detailed, PM-owned).",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Which artefact formally authorises a project and grants the PM authority to apply organisational resources?",
                options: {
                  A: "Project management plan.",
                  B: "Project charter.",
                  C: "Statement of work.",
                  D: "Work breakdown structure.",
                },
                correct: "B",
                explanations: {
                  A: "The PM plan covers HOW the project will be managed — it follows the charter.",
                  B: "Right — the charter authorises the project and the PM. Signed by the sponsor.",
                  C: "The SOW describes what's to be delivered, usually input to a contract or charter, not an authorising artefact.",
                  D: "The WBS decomposes scope; it comes after authorisation.",
                },
                principle:
                  "Charter authorises. PM plan plans. SOW describes the work. WBS decomposes it.",
              },
              {
                n: 2,
                question:
                  "When does Initiating happen in a multi-phase project?",
                options: {
                  A: "Only at project start.",
                  B: "At project start and at the start of each new phase.",
                  C: "Only when scope expands.",
                  D: "Continuously throughout the project.",
                },
                correct: "B",
                principle:
                  "Initiating recurs at each phase boundary, not just at project start.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "Adaptive (agile) projects do not need a project charter.",
                correct: false,
                explanationFalse:
                  "Right — adaptive projects still need a charter (often called the 'project vision' or 'product charter'). It's leaner but it still authorises the work.",
                explanationTrue:
                  "Actually no — adaptive projects still need authorisation; the charter is leaner but it exists.",
                principle:
                  "All projects need authorisation. Adaptive charters are leaner, not absent.",
              },
            ],
          },
        },
        {
          id: "c3-2-planning",
          code: "FA3.2",
          title: "Planning: scope, schedule, cost, risk, response",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Planning focus area defines the course of action: it establishes scope, refines objectives, and develops the plan needed to deliver. Outputs include the project management plan (an integrated document or set of documents) plus the project's baselines: scope baseline, schedule baseline, cost baseline.",
              "PMBOK 8e is explicit that planning is iterative. The phrase to memorise is *progressive elaboration*: the plan starts at the level of detail you can support today and is refined as more information arrives. Adaptive projects do less up-front planning and more continuous planning ('rolling-wave'); predictive projects front-load it. Either way, replanning is normal and expected.",
              "The PM plan is more than schedule + cost. It includes subsidiary plans for scope, schedule, cost, quality, resources, communications, risk, procurement, stakeholder engagement, and change management — plus the configuration management plan that says how versions and baselines are governed. Tailoring (Section 4) decides which of these subsidiary plans actually get authored.",
            ],
            keyPoints: [
              "Outputs: project management plan + baselines (scope/schedule/cost).",
              "Progressive elaboration: refine the plan as more info arrives.",
              "Rolling-wave: detailed near-term plans, high-level far-term plans.",
              "Replanning is normal, not a failure signal.",
            ],
            simplified: {
              oneLiner:
                "Planning sets the route, the milestones, and the rules — and you replan whenever the map changes.",
            },
            deeper: {
              oneLiner:
                "The exam keywords: 'progressive elaboration' (you can't plan in full detail up front), 'rolling-wave' (detail decays with time horizon), and 'baseline' (the approved version against which you measure progress).",
              paragraphs: [
                "The project management plan is a *plan of plans*: it integrates subsidiary plans (scope, schedule, cost, quality, resources, communications, risk, procurement, stakeholder engagement) plus the three baselines (scope, schedule, cost). Together with the configuration management plan and the change management plan, they form the formal document the PM uses to direct execution. Subsidiary plans are signed off as a single package — you don't approve scope but defer cost.",
                "Three exam patterns about baselines: (1) baselines change only through approved change requests via integrated change control; (2) 'compare actual vs baseline' is the canonical measurement; (3) when a question asks 'what reference does the PM use', the answer is almost always the relevant baseline. Note: the performance measurement baseline (PMB) is the *combined* scope + schedule + cost baseline that EVM compares against.",
              ],
              keyPoints: [
                "Subsidiary plans + baselines + change/config plans = the project management plan.",
                "Progressive elaboration = increasing detail as the project moves forward.",
                "Rolling-wave = detailed for the near-term, summary for the long-term.",
                "Baselines move only via integrated change control, never silently.",
                "Performance Measurement Baseline = scope + schedule + cost combined (used by EVM).",
              ],
              pitfalls: [
                "Don't pick 'update the baseline informally' on the exam — baseline changes require an approved change request.",
                "Don't confuse 'baseline' (approved, frozen until CR) with 'current plan' (working copy that changes daily).",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "The customer adds a major new feature mid-project. The PM updates the plan, baselines, and budget through formal change control. PMBOK calls this practice:",
                options: {
                  A: "Scope creep.",
                  B: "Progressive elaboration.",
                  C: "Replanning following an approved change.",
                  D: "Failure to plan.",
                },
                correct: "C",
                explanations: {
                  A: "Scope creep is *uncontrolled* scope growth. This was controlled.",
                  B: "Progressive elaboration is *internal* refinement, not customer-driven scope change.",
                  C: "Right — formally approved change triggers replanning. Normal, expected, and PMI-correct.",
                  D: "Replanning is not a failure — failing to replan is.",
                },
                principle:
                  "Approved changes → replan + rebaseline. This is healthy planning, not failure.",
              },
              {
                n: 2,
                question:
                  "Which is the BEST description of rolling-wave planning?",
                options: {
                  A: "Planning the whole project once at the start.",
                  B: "Detailed near-term planning, high-level planning for future phases.",
                  C: "Adaptive teams refusing to plan beyond the next sprint.",
                  D: "Re-planning everything every iteration.",
                },
                correct: "B",
                principle:
                  "Rolling-wave: plan in detail where you can; keep distant work at higher level until information arrives.",
              },
              {
                kind: "fill-in",
                n: 3,
                question:
                  "What's the PMBOK term for the iterative, ongoing refinement of the project management plan as more information becomes known?",
                acceptedAnswers: [
                  "progressive elaboration",
                  "progressive-elaboration",
                ],
                placeholder: "two words",
                principle:
                  "Progressive elaboration: planning detail grows with information.",
              },
            ],
          },
        },
        {
          id: "c3-3-executing",
          code: "FA3.3",
          title: "Executing: coordinate work, engage stakeholders",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Executing performs the work defined in the plan: coordinating resources, managing stakeholder engagement, and producing deliverables. It is also where the choice of approach (predictive, adaptive, or hybrid) becomes most visible — predictive execution is plan-driven and milestone-paced; adaptive execution iterates around feedback loops and demos.",
              "The PM's job in execution is largely facilitation and integration, not building. The PM enables the team to do the work: removes blockers, integrates outputs, handles change requests, and keeps stakeholders aligned. In an adaptive context this looks like servant leadership; in a predictive context it looks like classical project coordination — but the underlying activity is the same.",
              "Change requests are the most-tested artefact in Execution scenarios. PMI's pattern is rigid: any change goes through the integrated change control process. The PM evaluates impact (Holistic View!), the appropriate authority (Change Control Board, sponsor, or PM depending on threshold) decides, and the plan + baselines are updated only after approval.",
            ],
            keyPoints: [
              "Execution = coordinate + engage + produce. PM facilitates, doesn't build.",
              "Change requests must go through integrated change control. No exceptions.",
              "Adaptive vs predictive execution differs in cadence and visibility, not in goal.",
            ],
            simplified: {
              oneLiner:
                "Execution is when the team builds. The PM clears the path and runs change requests through the proper channel.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A stakeholder approaches the team lead directly and asks them to add a small feature 'just this once' — bypassing the PM. The PMI-correct response is to:",
                options: {
                  A: "Build it — small enough to absorb.",
                  B: "Refuse and ignore the stakeholder.",
                  C: "Route the request through the integrated change control process.",
                  D: "Defer all change requests to the next phase.",
                },
                correct: "C",
                explanations: {
                  A: "Bypasses change control. Sets a precedent. Erodes baselines.",
                  B: "Stakeholder engagement (and Build an Empowered Culture) says don't refuse outright. Route it.",
                  C: "Right — even small requests go through formal change control. Impact analysis, decision, update.",
                  D: "Indiscriminate deferral isn't the answer either.",
                },
                principle:
                  "All changes — small or large — go through integrated change control. No 'just this once'.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "The PM is mainly accountable for personally producing project deliverables during the Executing focus area.",
                correct: false,
                explanationFalse:
                  "Right — the team produces deliverables. The PM coordinates, integrates, engages stakeholders, and handles changes.",
                explanationTrue:
                  "Actually no — the team produces deliverables in Execution. The PM is accountable for outcomes but not for hands-on production.",
                principle:
                  "Team produces. PM coordinates and integrates.",
              },
              {
                n: 3,
                question:
                  "In a hybrid project, the construction part executes predictively (Gantt + milestones) and the software part executes adaptively (2-week sprints). PMBOK calls this:",
                options: {
                  A: "An anti-pattern — pick one approach.",
                  B: "A correctly tailored hybrid execution.",
                  C: "Operations — too varied to be a project.",
                  D: "Out of scope for PMBOK 8e.",
                },
                correct: "B",
                principle:
                  "Hybrid is a valid tailored choice when different parts of a project suit different approaches.",
              },
            ],
          },
        },
        {
          id: "c3-4-monitor-control",
          code: "FA3.4",
          title: "Monitoring & Controlling: variance, change, course-correct",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "Monitoring & Controlling tracks, measures, reviews, and regulates the progress and performance of the project. It runs *in parallel* with the other focus areas — it isn't a separate phase. The key benefit is to detect variances early enough to take corrective action before they become baseline-breaking failures.",
              "PMBOK distinguishes monitoring (observe, measure, report) from controlling (analyse variance, decide a response, implement the change). Variance analysis compares actual to plan; trend analysis projects whether the variance is likely to widen, narrow, or stay stable; root-cause analysis explains why the variance occurred.",
              "The most common controlling tool the exam tests is integrated change control. Whatever the variance, the response — corrective action, preventive action, defect repair, or scope change — flows through integrated change control to keep baselines consistent. The exception is *workarounds*: small unanticipated responses to risks that have already occurred and that don't change the plan.",
            ],
            keyPoints: [
              "M&C runs in parallel with all other focus areas — not after.",
              "Monitoring observes; controlling responds.",
              "Tools: variance analysis, trend analysis, root-cause analysis.",
              "Integrated change control keeps baselines synchronised.",
            ],
            simplified: {
              oneLiner:
                "Watch the numbers, find the variance, do something about it, log it.",
            },
            deeper: {
              oneLiner:
                "Earned Value Management (EVM) is the canonical numeric tool. CPI < 1 means over budget; SPI < 1 means behind schedule. EVM detail lives in Section 6.",
              paragraphs: [
                "Monitoring & Controlling is the focus area where the PMI question 'is the project on track?' lives. Predictive projects answer it with variance against the baselines (scope, schedule, cost) plus quality metrics; adaptive projects answer it with velocity, throughput, lead time, and a burn-up chart. Either way the PM measures, compares, decides, and acts — passive monitoring without action is a wrong-answer trap.",
                "Integrated Change Control is the M&C process candidates most often misapply on the exam. The flow is: change request raised → impact analysed across the triple constraint → CCB (Change Control Board) approves/rejects → baselines and subsidiary plans updated → change communicated to stakeholders. Any answer that skips analysis, skips the board, or makes the change before approval is wrong.",
              ],
              keyPoints: [
                "Five steps: measure, compare to baseline, decide, act, log.",
                "Lagging metric (variance) tells you what happened; leading metric (forecast EAC) tells you what's coming.",
                "Quality control = product conformance; quality assurance = process conformance.",
                "All baseline changes go through Integrated Change Control — no exceptions on the exam.",
              ],
              pitfalls: [
                "Don't pick 'fix it quietly and move on' — undocumented corrective actions fail the exam every time.",
                "Don't confuse corrective action (bring back to plan) with preventive action (avoid future variance) with defect repair (fix a delivered defect).",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A weekly status review shows actual cost is 18% higher than planned. The PMI-correct first response is to:",
                options: {
                  A: "Crash the schedule to catch up.",
                  B: "Run variance and root-cause analysis to understand WHY before deciding the response.",
                  C: "Reduce scope.",
                  D: "Inform the customer of the overrun.",
                },
                correct: "B",
                explanations: {
                  A: "Crashing addresses schedule, not cost variance. Wrong tool, and wrong order.",
                  B: "Right — understand the variance and its cause before choosing a response. Adopt a Holistic View.",
                  C: "Could be the right response but not the first action.",
                  D: "Communication matters but understanding first.",
                },
                principle:
                  "Variance → root-cause → response. Always analyse before acting.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Monitoring & Controlling is a separate, sequential phase that happens after Executing.",
                correct: false,
                explanationFalse:
                  "Right — M&C runs *in parallel* with Initiating, Planning, Executing, and Closing. Not sequential.",
                explanationTrue:
                  "Actually no — M&C is in parallel with all other focus areas.",
                principle:
                  "M&C is parallel, not sequential. It runs throughout the project.",
              },
              {
                n: 3,
                question:
                  "A team uses an unplanned workaround to handle a risk that has just occurred. PMBOK considers this:",
                options: {
                  A: "A violation of integrated change control.",
                  B: "An acceptable response when the risk is realised and the response doesn't alter the plan.",
                  C: "A reason to terminate the project.",
                  D: "Always a change request that needs CCB approval.",
                },
                correct: "B",
                principle:
                  "Workarounds are unplanned responses to realised risks; they don't have to go through change control if the plan isn't affected.",
              },
            ],
          },
        },
        {
          id: "c3-5-closing",
          code: "FA3.5",
          title: "Closing: hand over, document, release",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Closing formally completes a phase, project, or contract — including (when appropriate) terminating a project before completion. The work includes verifying that all deliverables are accepted, transitioning to operations, releasing resources, archiving documents, capturing lessons learned, and confirming that target benefits are aligned for realisation.",
              "PMBOK 8e calls out the early-closure case explicitly. If terminating becomes the best way to maximise return (or minimise loss), Closing handles that too. Stopping is not failure if continuing would destroy more value.",
              "Lessons learned is the most-tested artefact in Closing. It's a knowledge transfer to the organisation — what worked, what didn't, what would we change next time. It feeds the organisational process assets so future projects benefit. Closing without lessons learned is closing on autopilot, and PMI penalises that on the exam.",
            ],
            keyPoints: [
              "Closing applies to phase end, project end, contract end, and early termination.",
              "Outputs: accepted deliverables, lessons learned, archived docs, released resources.",
              "Lessons learned fund future projects via OPAs.",
              "Termination is a valid Closing scenario when value is gone.",
            ],
            simplified: {
              oneLiner:
                "Hand off the work, write down what you learned, free up the people, archive the rest.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Which output of Closing most directly funds *future* projects in the organisation?",
                options: {
                  A: "Final cost report.",
                  B: "Lessons learned (added to organisational process assets).",
                  C: "Released team resources.",
                  D: "Customer acceptance signature.",
                },
                correct: "B",
                principle:
                  "Lessons learned → OPAs → reusable across future projects.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Closing is only for projects that finish all their planned deliverables.",
                correct: false,
                explanationFalse:
                  "Right — Closing also handles early termination, phase closure, and contract closure.",
                explanationTrue:
                  "Actually no — early-terminated projects still go through Closing.",
                principle:
                  "Closing handles completion AND early termination.",
              },
              {
                n: 3,
                question:
                  "Which is NOT a Closing activity?",
                options: {
                  A: "Archive project records.",
                  B: "Release team resources.",
                  C: "Develop the project charter.",
                  D: "Capture lessons learned.",
                },
                correct: "C",
                principle:
                  "Charter is an Initiating artefact, not Closing.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Order the five focus areas as PMBOK 8e lists them.",
            options: {
              A: "Initiating, Planning, Executing, Monitoring & Controlling, Closing.",
              B: "Planning, Initiating, Executing, Closing, Monitoring.",
              C: "Initiating, Executing, Planning, Closing, Monitoring.",
              D: "Initiating, Planning, Monitoring & Controlling, Executing, Closing.",
            },
            correct: "A",
            principle:
              "Canonical order: Initiating, Planning, Executing, Monitoring & Controlling, Closing.",
          },
          {
            n: 2,
            question:
              "Which focus area runs in PARALLEL with all the others?",
            options: {
              A: "Initiating.",
              B: "Planning.",
              C: "Monitoring & Controlling.",
              D: "Closing.",
            },
            correct: "C",
            principle:
              "M&C is parallel with all the others — it isn't a sequential phase.",
          },
          {
            n: 3,
            question:
              "An adaptive project does very brief up-front planning, then continuously re-plans every sprint. PMBOK calls this:",
            options: {
              A: "Failure to plan.",
              B: "Rolling-wave planning.",
              C: "Big design up front (BDUF).",
              D: "Charter inflation.",
            },
            correct: "B",
            principle:
              "Rolling-wave: detailed plan near-term, high-level plan further out. Re-planned as info arrives.",
          },
          {
            n: 4,
            question:
              "A stakeholder asks the developer to slip in a small extra feature, bypassing the PM. The PMI-correct answer is:",
            options: {
              A: "Build it quietly — it's small.",
              B: "Refuse and inform the stakeholder it cannot be done.",
              C: "Route the request through the integrated change control process.",
              D: "Defer to the next project.",
            },
            correct: "C",
            principle:
              "All changes go through integrated change control, regardless of size.",
          },
          {
            n: 5,
            question:
              "A project is terminated early because the business case is no longer valid. What Closing activity should still happen?",
            options: {
              A: "None — terminated projects don't close.",
              B: "Only the final cost report.",
              C: "Full closing including lessons learned and resource release.",
              D: "Only release resources; skip lessons learned.",
            },
            correct: "C",
            principle:
              "Early-terminated projects still go through Closing — including lessons learned.",
          },
        ],
      },
    },
    /* ============================================================
       Section 4 — Development Approaches & Tailoring
       ============================================================ */
    {
      id: "s4-approaches-tailoring",
      n: 4,
      title: "Approaches & tailoring",
      iconImagePath: "/images/modules/final/pmbok-tailoring.jpg",
      blurb:
        "Predictive, adaptive, hybrid: choose by characteristic, then tailor lifecycle / processes / engagement to the actual project.",
      concepts: [
        {
          id: "c4-1-predictive",
          code: "AT4.1",
          title: "Predictive (plan-driven) approach",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Predictive (sometimes called 'waterfall' or 'plan-driven') is the approach where scope, schedule, and cost are determined in detail early in the life cycle and changes are formally controlled. Predictive favours up-front planning, clear baselines, and milestone-based progress measurement. It works best when requirements are stable, the team has solved similar problems before, and stakeholders prefer predictability over flexibility.",
              "PMBOK 8e identifies when predictive is the right call: safety- or regulation-critical work (where signed-off requirements are non-negotiable), large up-front capital commitments (capital construction, factory build-outs), and contexts where the customer needs fixed-price/fixed-scope contracts. Predictive is not 'old-fashioned' — it's the right approach when the conditions match.",
              "Watch out for the exam trap of treating predictive as inferior to adaptive. PMBOK is explicit that neither is universally better. Each is correct in its conditions; choosing wrong is the failure, not choosing predictive itself.",
            ],
            keyPoints: [
              "Plan-driven, scope/schedule/cost defined early.",
              "Right when requirements stable, deliverables physical, change costly.",
              "Heavy on baselines and formal change control.",
              "Not inferior to adaptive — context-dependent.",
            ],
            simplified: {
              oneLiner:
                "Predictive = 'we know what we're building, so let's plan it carefully and execute the plan'.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Which is the BEST candidate for a predominantly predictive approach?",
                options: {
                  A: "Building a new nuclear-reactor cooling system with strict regulatory sign-off.",
                  B: "Designing a new mobile-app onboarding flow with unclear user behaviour.",
                  C: "Discovering whether a research drug works.",
                  D: "Refreshing a marketing campaign in response to real-time feedback.",
                },
                correct: "A",
                explanations: {
                  A: "Right — high-regulation + safety-critical + heavy up-front design + costly late changes → predictive.",
                  B: "User-behaviour discovery is an adaptive sweet spot.",
                  C: "Drug discovery is highly iterative with adaptive elements within each phase.",
                  D: "Real-time feedback → adaptive cadence.",
                },
                principle:
                  "Predictive fits stable requirements + costly change + safety / regulation.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Predictive approaches are always slower than adaptive approaches.",
                correct: false,
                explanationFalse:
                  "Right — speed depends on context, not approach. A well-tailored predictive project can outpace a poorly-managed adaptive one.",
                explanationTrue:
                  "Actually no — speed is a function of context, scope, and team, not approach.",
                principle:
                  "Approach is about fit, not absolute speed.",
              },
              {
                n: 3,
                question:
                  "In a predictive project, the primary lever for handling a customer-requested mid-project scope change is:",
                options: {
                  A: "Build it next sprint.",
                  B: "Integrated change control with impact analysis and rebaselining.",
                  C: "Refuse it — scope is frozen.",
                  D: "Add it silently to avoid the paperwork.",
                },
                correct: "B",
                principle:
                  "Predictive change handling = formal change control + impact analysis + rebaselining.",
              },
            ],
          },
        },
        {
          id: "c4-2-adaptive",
          code: "AT4.2",
          title: "Adaptive (agile) approach",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "Adaptive approaches (Scrum, Kanban, XP, SAFe — the family commonly called 'agile') iterate scope around fixed time-and-cost boxes. Plans evolve constantly; the product backlog is reprioritised every iteration; customer/users provide regular feedback that shapes what's built next. The trade is predictability of *scope* for predictability of *cadence* and *learning*.",
              "PMBOK 8e situates adaptive as the right fit when requirements are uncertain or evolving, when frequent feedback delivers genuine value, when fixed end-dates dominate over fixed-scope contracts, and when teams are small enough to self-organise (PMBOK references the classic 'three-to-nine' team size from adaptive frameworks). Adaptive depends on Build an Empowered Culture.",
              "Common adaptive artefacts: product backlog (prioritised list of work), increment (the produced output of one iteration), definition of done (the criterion for accepting an increment), retrospective (structured reflection at iteration end). The PM role transforms: more facilitation and servant-leadership, less directive control.",
            ],
            keyPoints: [
              "Fixed time + cost; variable scope.",
              "Iteration → demo → feedback → adjust.",
              "Right when requirements evolve, feedback adds value, teams small.",
              "Depends on team empowerment + customer engagement.",
            ],
            simplified: {
              oneLiner:
                "Adaptive = 'we don't fully know what to build yet, so let's deliver small increments and learn'.",
            },
            deeper: {
              oneLiner:
                "Common variants: Scrum (timeboxed sprints, defined roles), Kanban (continuous flow, WIP limits), XP (engineering practices), SAFe (scaled agile for enterprises).",
              paragraphs: [
                "Scrum specifics PMP candidates are expected to know: roles (Product Owner, Scrum Master, Developers), events (sprint planning, daily scrum, sprint review, sprint retrospective, the sprint itself), artefacts (product backlog, sprint backlog, increment), and the Definition of Done. The Product Owner owns priority; the Scrum Master is a servant-leader who removes impediments; the team self-organises around the sprint goal. The PM-as-Scrum-Master mapping is common but not universal — sometimes the PM is closer to the Product Owner role.",
                "Kanban differs from Scrum in two ways: there is no fixed iteration length (work flows continuously), and there is an explicit WIP (work-in-progress) limit per column. The metric is cycle time (how long an item takes from start to done) and throughput. XP layers engineering practices on top (TDD, pair programming, continuous integration). SAFe coordinates many agile teams via a 'release train' construct — useful when the project crosses organisational boundaries.",
                "Adaptive does *not* mean 'no documentation' or 'no planning'. It means short feedback loops, frequent inspection, and incremental delivery. On the exam, an option that conflates adaptive with chaos is almost always wrong.",
              ],
              keyPoints: [
                "Scrum: timeboxed sprints (1–4 weeks), three roles, five events, three artefacts.",
                "Kanban: continuous flow, WIP limits, optimise cycle time + throughput.",
                "XP adds engineering practices: TDD, pair programming, CI, refactoring.",
                "SAFe: scaled agile, release trains, multiple teams aligned on a cadence.",
                "Adaptive ≠ ad-hoc — it is still disciplined planning + inspection.",
              ],
              pitfalls: [
                "Don't confuse the Scrum Master (servant-leader) with the Product Owner (priority-setter).",
                "Don't treat 'no documentation' as agile — agile keeps documentation 'just enough', not zero.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Which project condition most strongly suggests an adaptive approach?",
                options: {
                  A: "Strict regulatory documentation requirements.",
                  B: "Fixed-price contract with locked scope.",
                  C: "Evolving requirements and high value from frequent feedback.",
                  D: "Two-decade physical infrastructure rollout.",
                },
                correct: "C",
                principle:
                  "Adaptive is suited to evolving requirements + feedback-driven value.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "An adaptive project never produces a baseline.",
                correct: false,
                explanationFalse:
                  "Right — adaptive projects still produce baselines (release-level or roadmap-level). The granularity is coarser, but they exist.",
                explanationTrue:
                  "Actually no — adaptive projects still baseline (releases, roadmaps), just at coarser granularity.",
                principle:
                  "Adaptive ≠ no baselines. Granularity changes, not existence.",
              },
              {
                n: 3,
                question:
                  "Which is NOT one of PMBOK's standard adaptive artefacts?",
                options: {
                  A: "Product backlog.",
                  B: "Increment.",
                  C: "Definition of done.",
                  D: "Earned value baseline.",
                },
                correct: "D",
                principle:
                  "EV baselining is a predictive-leaning practice; adaptive uses backlog, increment, DoD, retrospective.",
              },
            ],
          },
        },
        {
          id: "c4-3-hybrid",
          code: "AT4.3",
          title: "Hybrid approach",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "Hybrid combines predictive and adaptive elements within a single project. PMBOK gives the example of a data-centre rollout where the building construction is predictive (physical, milestone-paced) and the computing capability inside is adaptive (iterated with feedback). Hybrid is the most common real-world choice — pure predictive and pure adaptive are surprisingly rare in large organisations.",
              "Hybrid is not a compromise; it's a tailored choice. The art is identifying which parts of the project benefit from which approach and aligning the team's working practices accordingly. The hybrid PM must reconcile two cadences: predictive milestones with adaptive increments, and the reporting that goes with both.",
              "Watch for hybrid scenarios on the exam where one part of the project is unambiguously predictive (regulated, fixed-scope) and another is unambiguously adaptive (exploratory, feedback-driven). The PMI-correct answer is usually to *not* force one approach across the whole project.",
            ],
            keyPoints: [
              "Hybrid = different approaches for different parts of the project.",
              "Most common real-world choice in large organisations.",
              "Reconcile two cadences (milestones + iterations) in reporting.",
              "Common on enterprise IT, infrastructure-plus-software programs.",
            ],
            simplified: {
              oneLiner:
                "Hybrid = some parts predictive, some parts adaptive — match the approach to the work.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A regulated medical device company is building (a) the physical device and (b) the companion app. (a) is heavily regulated, (b) iterates with users. The PMI-correct approach is:",
                options: {
                  A: "Pure predictive across both.",
                  B: "Pure adaptive across both.",
                  C: "Hybrid: predictive for (a), adaptive for (b).",
                  D: "Stop the project — too varied.",
                },
                correct: "C",
                principle:
                  "Hybrid matches approach to the work characteristics in each part.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Hybrid approaches are PMBOK's least-recommended choice.",
                correct: false,
                explanationFalse:
                  "Right — PMBOK 8e treats hybrid as a fully valid, often-preferred choice. There is no 'less-recommended'.",
                explanationTrue:
                  "Actually no — PMBOK 8e treats hybrid as an equal, valid choice — often the most realistic.",
                principle:
                  "Hybrid is a valid first-class choice, not a fallback.",
              },
              {
                n: 3,
                question:
                  "In a hybrid project the construction team experiences Gantt milestones; the software team experiences sprint demos. How does PMBOK describe this from the project level?",
                options: {
                  A: "Inconsistent — must be unified.",
                  B: "Each team correctly experiences the approach that fits their work; the project as a whole is hybrid.",
                  C: "Adaptive — the most flexible label wins.",
                  D: "Predictive — the slower discipline dominates.",
                },
                correct: "B",
                principle:
                  "Sub-teams may experience different approaches even when the project label is hybrid.",
              },
            ],
          },
        },
        {
          id: "c4-4-tailoring",
          code: "AT4.4",
          title: "Tailoring: what, why, how",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "Tailoring is the deliberate choice of which life cycle, processes, and engagement practices to use on a given project. PMBOK 8e gives tailoring its own section (Section 3 of the Guide) and frames it as essential, not optional. 'No single approach can be applied to all projects all of the time.'",
              "PMBOK names three things you tailor: the life cycle and development approach (predictive / adaptive / hybrid), the processes themselves (add / modify / remove / blend / align), and the engagement (people involved, level of empowerment, integration of contributors). The drivers are project size, criticality, complexity, industry, organisational culture, stakeholder count, and PM maturity.",
              "The exam tests tailoring by giving a project context and asking what's appropriate. Too much process = costly and wasteful; too little = ineffective. PMI's answer almost always favours the middle: enough rigour to manage risk without slowing the team. Mandatory inputs (regulation, contract, org policy) are non-negotiable; everything else is negotiable.",
            ],
            keyPoints: [
              "Tailor: (1) life cycle / approach, (2) processes, (3) engagement.",
              "Drivers: size, complexity, criticality, industry, culture, maturity.",
              "Too few processes = ineffective. Too many = wasteful.",
              "Mandatory inputs (regulation, contract) cannot be tailored out.",
            ],
            simplified: {
              oneLiner:
                "Use enough process to manage the risk, no more. Adjust to fit the project.",
            },
            deeper: {
              oneLiner:
                "PMBOK explicitly says: 'There may be situations that limit the degree to which project teams can tailor their approach (e.g., when organizational policies mandate the use of a specific approach or when a contract specifies a mandated approach).'",
              paragraphs: [
                "Tailoring inputs are listed in PMBOK 8e in four buckets: (1) project context — size, complexity, urgency, regulatory environment; (2) team context — skill level, distribution, autonomy; (3) culture — organisational appetite for ceremony, risk, formality; (4) constraints — contracts, policies, parent-portfolio rules. The PM should produce a deliberate tailoring rationale at the start of planning, not after the fact.",
                "Common tailoring decisions: how often the project status is published (weekly vs daily), how much documentation each artefact carries (one-pager vs full template), whether change requests need a CCB vote or a single approver, and which performance domains get a dedicated subsidiary plan vs being folded into the integrated plan. None of those choices are 'optional' — they are *required* tailoring outputs.",
              ],
              keyPoints: [
                "Tailoring is mandatory, not optional. PMBOK 8e requires a deliberate choice.",
                "Inputs: project context + team + culture + constraints.",
                "Document the tailoring rationale in the project management plan.",
                "Re-tailor at phase gates when context changes — don't lock in a choice forever.",
              ],
              pitfalls: [
                "Don't pick 'follow PMBOK exactly as written' — PMBOK itself rejects that on the exam.",
                "Don't tailor without documenting the rationale — undocumented tailoring is indistinguishable from skipping a step.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A 4-person internal team is running a 6-week marketing-page refresh. The PM is using the same heavyweight 80-page PM plan template the company uses for nuclear-reactor projects. PMBOK's likely critique is:",
                options: {
                  A: "Insufficient documentation — add more.",
                  B: "Over-process — tailor the plan down to fit the project's actual risk.",
                  C: "Wrong template — use the adaptive-only template.",
                  D: "No critique — consistency is good.",
                },
                correct: "B",
                principle:
                  "Tailor processes to project risk and size. Too much process is wasteful.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "PMBOK names three things you tailor. Life cycle / approach is one; engagement is another. What's the third? (One word.)",
                acceptedAnswers: ["processes", "process"],
                placeholder: "one word",
                principle:
                  "Tailor: life cycle, processes, engagement.",
              },
              {
                n: 3,
                question:
                  "Which factor CANNOT be tailored away?",
                options: {
                  A: "Internal status-report cadence.",
                  B: "The team's daily stand-up format.",
                  C: "A mandatory regulatory documentation requirement.",
                  D: "The team agreement on working hours.",
                },
                correct: "C",
                principle:
                  "Mandatory inputs (regulation, contract, org policy) cannot be tailored away.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Which approach fits 'evolving requirements + high value from frequent feedback'?",
            options: {
              A: "Predictive.",
              B: "Adaptive.",
              C: "Operations.",
              D: "Charter-only.",
            },
            correct: "B",
            principle:
              "Adaptive fits evolving requirements and feedback-driven value.",
          },
          {
            n: 2,
            question:
              "A datacentre build (physical) plus the cloud platform inside it (software). Best PMI-aligned approach?",
            options: {
              A: "Pure predictive.",
              B: "Pure adaptive.",
              C: "Hybrid.",
              D: "Operations.",
            },
            correct: "C",
            principle:
              "Different parts → different approaches = hybrid.",
          },
          {
            n: 3,
            question:
              "Tailoring is best described as:",
            options: {
              A: "Removing all process to maximise speed.",
              B: "Adding process to maximise rigour.",
              C: "Choosing the right amount of life cycle, process, and engagement for THIS project.",
              D: "Doing whatever the customer wants.",
            },
            correct: "C",
            principle:
              "Tailoring = right amount of process for THIS project's risk and size.",
          },
          {
            n: 4,
            question:
              "Which is the BEST reason to choose predictive over adaptive for a project?",
            options: {
              A: "It's older and therefore safer.",
              B: "Requirements are stable, scope is well-defined, late changes are very costly.",
              C: "The PM prefers Gantt charts.",
              D: "The organisation has more predictive templates.",
            },
            correct: "B",
            principle:
              "Choose by fit: stable + defined + costly-late-change → predictive.",
          },
          {
            n: 5,
            question:
              "Delivery cadence options PMBOK lists include single, multiple, periodic, and ___ deliveries.",
            options: {
              A: "annual.",
              B: "instantaneous.",
              C: "continuous.",
              D: "frozen.",
            },
            correct: "C",
            principle:
              "PMBOK delivery cadences: single, multiple, periodic, continuous.",
          },
        ],
      },
    },
    /* ============================================================
       Section 5 — Performance Domains I: Governance, Scope, Schedule
       ============================================================ */
    {
      id: "s5-domains-1",
      n: 5,
      title: "Performance domains I — governance, scope, schedule",
      iconImagePath: "/images/modules/final/pmbok-domains-i.jpg",
      blurb:
        "The first three of seven Performance Domains. Each domain is an outcome area, not a knowledge silo.",
      concepts: [
        {
          id: "c5-1-governance",
          code: "PD5.1",
          title: "Governance domain",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Governance Performance Domain covers the framework, functions, and processes that direct the project. PMBOK 8e splits governance into three layers: portfolio governance (which projects to fund), program governance (how to coordinate related projects), and project governance (how to make decisions inside this project).",
              "Project governance produces decision rights, escalation paths, change-control authority, and metrics for steering. The classic governance artefact is a steering committee or Change Control Board (CCB). The PM's job is to ensure governance is *right-sized*: enough to keep stakeholders aligned and unblock decisions, not so heavy it becomes bureaucracy that prevents value delivery.",
              "On the exam, governance questions test (a) who can authorise what (sponsor vs PM vs CCB), (b) which artefacts govern which decisions (charter vs PM plan vs change log), and (c) when escalation is appropriate (threshold exceeded, authority insufficient, cross-program conflict).",
            ],
            keyPoints: [
              "Three layers: portfolio / program / project governance.",
              "Right-sized governance: enough rigour, no bureaucracy.",
              "CCB / steering committee handles change requests above PM threshold.",
              "PM escalates when decision exceeds their authority or cross-program impact.",
            ],
            simplified: {
              oneLiner:
                "Governance is the system of who-decides-what. Make it appropriate for the project's risk and size.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A change request exceeds the PM's signing threshold. PMI-correct next step is:",
                options: {
                  A: "Authorise it anyway to keep the project moving.",
                  B: "Escalate to the Change Control Board or sponsor per governance.",
                  C: "Refuse outright.",
                  D: "Approve a smaller version of the request to fit the threshold.",
                },
                correct: "B",
                principle:
                  "Decisions above PM threshold escalate to the CCB or sponsor.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Governance is the same as project management.",
                correct: false,
                explanationFalse:
                  "Right — governance is the framework of decision rights and steering. PM is execution inside that framework.",
                explanationTrue:
                  "Actually no — governance is the framework, PM is execution within it.",
                principle:
                  "Governance = framework. PM = execution.",
              },
              {
                n: 3,
                question:
                  "Which is a sign that governance is too heavy on a small low-risk project?",
                options: {
                  A: "All small decisions need 5+ approvers.",
                  B: "Stakeholders are well-aligned.",
                  C: "Risk register is reviewed weekly.",
                  D: "Sponsor receives a monthly status report.",
                },
                correct: "A",
                principle:
                  "Over-governance: decision velocity slows, value delivery stalls.",
              },
            ],
          },
        },
        {
          id: "c5-2-scope",
          code: "PD5.2",
          title: "Scope domain (and the WBS)",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Scope Performance Domain manages what is and isn't in the project. Key artefacts: requirements documentation, scope statement, and the Work Breakdown Structure (WBS). The WBS is a hierarchical decomposition of the *total* scope of work into deliverable-oriented work packages — the smallest units that can be estimated and managed.",
              "PMBOK distinguishes scope creep (uncontrolled expansion of scope without change control) from gold plating (the team voluntarily adds work the customer didn't ask for). Both are anti-patterns; both reduce value-per-investment. The correct response to either is to surface it, run impact analysis, and (for scope changes) route the decision through change control.",
              "The 100% rule is the classic WBS test: the WBS includes 100% of the work — no more, no less. Anything not in the WBS is not in scope, by definition. The WBS is the foundation for schedule (every work package gets activities), cost (every work package gets an estimate), and quality (every deliverable gets acceptance criteria).",
            ],
            keyPoints: [
              "WBS = hierarchical decomposition of *all* scope. Deliverable-oriented.",
              "100% rule: WBS contains 100% of the work, nothing extra.",
              "Scope creep = uncontrolled stakeholder additions. Gold plating = team-added extras.",
              "Not in WBS = not in scope.",
            ],
            simplified: {
              oneLiner:
                "Scope is what you're committed to building. The WBS lists it. Anything not on the list isn't your job.",
            },
            deeper: {
              oneLiner:
                "Adaptive (agile) scope uses a product backlog instead of a fixed WBS, but the underlying principle — 'this is what we're committed to' — is the same.",
              paragraphs: [
                "PMBOK distinguishes *product scope* (the features/functions of the deliverable) from *project scope* (the work required to produce them). The WBS decomposes project scope; the requirements traceability matrix decomposes product scope back to its source request. Both are referenced from the scope baseline (= scope statement + WBS + WBS dictionary).",
                "Scope verification (formal stakeholder acceptance) is separate from scope control (preventing unauthorised changes) and from quality control (does it meet requirements). Many exam questions hinge on noticing which of those three the scenario actually describes. Scope creep is the slow accumulation of small unmanaged additions; gold-plating is the team adding features the customer didn't ask for. Both fail integrated change control.",
              ],
              keyPoints: [
                "Product scope (what is built) ≠ project scope (work to build it).",
                "Scope baseline = scope statement + WBS + WBS dictionary.",
                "Requirements traceability matrix links each requirement back to its source.",
                "Scope verification (acceptance) ≠ scope control (change defence) ≠ quality control (meets spec).",
                "Scope creep + gold-plating both bypass integrated change control.",
              ],
              pitfalls: [
                "Don't pick 'just add it' when the change is small — PMI treats every change as a change request.",
                "Don't treat 'stakeholder is happy' as scope verification — verification is the formal sign-off step.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Mid-project, the team voluntarily adds a fancy animation the customer didn't request. PMBOK calls this:",
                options: {
                  A: "Scope creep.",
                  B: "Gold plating.",
                  C: "Tailoring.",
                  D: "Progressive elaboration.",
                },
                correct: "B",
                explanations: {
                  A: "Scope creep is *stakeholder*-driven and uncontrolled. This is *team*-driven.",
                  B: "Right — team adding unrequested work = gold plating.",
                  C: "Tailoring is choosing process — not adding work.",
                  D: "Progressive elaboration is plan refinement, not unrequested feature addition.",
                },
                principle:
                  "Scope creep = stakeholder, uncontrolled. Gold plating = team, voluntary.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "The 100% rule of WBS construction says the WBS must include exactly what percent of the project work?",
                acceptedAnswers: ["100", "100%", "one hundred", "100 percent"],
                placeholder: "e.g. 100",
                principle:
                  "100% rule: WBS contains 100% of the work, no more, no less.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "An adaptive project doesn't manage scope.",
                correct: false,
                explanationFalse:
                  "Right — adaptive manages scope via the product backlog, definition of done, and acceptance criteria. The shape differs from a WBS; the concept doesn't.",
                explanationTrue:
                  "Actually no — adaptive uses product backlog + DoD + acceptance criteria. Scope is still managed.",
                principle:
                  "Adaptive manages scope through backlog + DoD, not via a fixed WBS.",
              },
            ],
          },
        },
        {
          id: "c5-3-schedule",
          code: "PD5.3",
          title: "Schedule domain (critical path basics)",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Schedule Performance Domain plans activities, sequences them, estimates durations, and produces a schedule baseline. The classic technique is critical-path method (CPM): identify activities, draw the dependency network, calculate the longest path from start to finish. The activities on that path have zero float — any delay there delays the whole project.",
              "Three estimation techniques the exam expects: analogous (use a similar past project — fast but imprecise), parametric (rate × quantity — better when historical rates are reliable), and three-point/PERT (optimistic + 4×most-likely + pessimistic, all divided by 6 — better when uncertainty is high). On adaptive projects, velocity (story points per sprint) replaces date-based estimation.",
              "Two compressions PMI tests: crashing (add more resources to reduce duration — costs more, doesn't change scope) and fast-tracking (perform sequential activities in parallel — increases risk, doesn't change cost). Both are valid; both have trade-offs. The exam rewards picking the right tool for the constraint.",
            ],
            keyPoints: [
              "Critical path = longest sequence; zero float.",
              "Estimate: analogous, parametric, PERT (3-point) = (O + 4M + P)/6.",
              "Compress: crash (more $, same risk profile) vs fast-track (more risk, same $).",
              "Adaptive uses velocity instead of date-based estimation.",
            ],
            simplified: {
              oneLiner:
                "The critical path is the chain that controls when you finish. To go faster, either spend more (crash) or take on risk (fast-track).",
            },
            deeper: {
              oneLiner:
                "PERT expected duration: E = (O + 4M + P) / 6. Standard deviation: σ = (P - O) / 6. Variance: σ² = ((P - O) / 6)².",
              examples: [
                {
                  title: "PERT example",
                  body: "Task estimate: optimistic 4 days, most-likely 6 days, pessimistic 14 days. PERT expected = (4 + 4×6 + 14)/6 = (4 + 24 + 14)/6 = 42/6 = 7 days.",
                },
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "An activity has optimistic = 3 days, most-likely = 6 days, pessimistic = 15 days. Calculate the PERT expected duration.",
                options: {
                  A: "6 days.",
                  B: "7 days.",
                  C: "8 days.",
                  D: "9 days.",
                },
                correct: "B",
                explanations: {
                  A: "That's the most-likely, not PERT.",
                  B: "Right — (3 + 4×6 + 15) / 6 = (3 + 24 + 15) / 6 = 42 / 6 = 7.",
                  C: "Try the formula again: O + 4M + P, then ÷ 6.",
                  D: "Try the formula again: O + 4M + P, then ÷ 6.",
                },
                principle:
                  "PERT = (O + 4M + P) / 6. Memorise this — exam regular.",
              },
              {
                n: 2,
                question:
                  "The schedule is slipping. The project has budget room but cannot accept additional risk. Best compression choice?",
                options: {
                  A: "Crash — add resources.",
                  B: "Fast-track — parallelise sequential activities.",
                  C: "Reduce scope.",
                  D: "Do nothing — let it slip.",
                },
                correct: "A",
                principle:
                  "Crashing costs money, doesn't add risk. Fast-tracking is free but adds risk. Pick the lever that matches the constraint.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "Activities on the critical path have zero float.",
                correct: true,
                explanationTrue:
                  "Right — by definition. Any delay on a critical-path activity delays project completion.",
                explanationFalse:
                  "Actually yes — by definition, critical-path activities have zero float.",
                principle:
                  "Critical path = the longest chain. Zero float by definition.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Which artefact governs which scope items are 'in' vs 'out'?",
            options: {
              A: "Project charter.",
              B: "Stakeholder register.",
              C: "WBS (Work Breakdown Structure).",
              D: "Risk register.",
            },
            correct: "C",
            principle:
              "WBS = the authoritative decomposition of all in-scope work.",
          },
          {
            n: 2,
            question:
              "A team adds an unrequested feature on top of the customer's spec. PMBOK calls this:",
            options: {
              A: "Progressive elaboration.",
              B: "Gold plating.",
              C: "Tailoring.",
              D: "Critical-path crashing.",
            },
            correct: "B",
            principle:
              "Gold plating = unrequested additions by the team.",
          },
          {
            n: 3,
            question:
              "PERT expected duration formula:",
            options: {
              A: "(O + M + P) / 3.",
              B: "(O + 4M + P) / 6.",
              C: "(O + 2M + P) / 4.",
              D: "O + M + P.",
            },
            correct: "B",
            principle:
              "PERT three-point: (Optimistic + 4 × Most-likely + Pessimistic) / 6.",
          },
          {
            n: 4,
            question:
              "Budget room exists; risk tolerance is low; schedule is slipping. Choose:",
            options: {
              A: "Fast-track.",
              B: "Crash.",
              C: "Reduce scope.",
              D: "Add gold-plating.",
            },
            correct: "B",
            principle:
              "Crash adds cost, no extra risk. Fast-track is free but adds risk.",
          },
          {
            n: 5,
            question:
              "A change request exceeds the PM's authority threshold. PMI-correct:",
            options: {
              A: "Approve it informally.",
              B: "Reject outright.",
              C: "Escalate to the CCB / sponsor.",
              D: "Wait until project closure.",
            },
            correct: "C",
            principle:
              "Above-threshold changes go to the CCB or sponsor per governance.",
          },
        ],
      },
    },
    /* ============================================================
       Section 6 — Performance Domains II: Finance & Stakeholders
       ============================================================ */
    {
      id: "s6-domains-2",
      n: 6,
      title: "Performance domains II — finance & stakeholders",
      iconImagePath: "/images/modules/final/pmbok-domains-ii.jpg",
      blurb:
        "Finance covers the project's economics — including the most-tested numeric tool, Earned Value Management. Stakeholders covers identification, analysis, and engagement.",
      concepts: [
        {
          id: "c6-1-finance",
          code: "PD6.1",
          title: "Finance domain — business case, NPV, IRR, payback",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Finance Performance Domain covers business-case justification, budgeting, cost estimation, funding, and benefits realisation. The four financial metrics PMI most often tests are: NPV (Net Present Value — sum of discounted future cash flows minus initial investment; positive is good), IRR (Internal Rate of Return — the discount rate that makes NPV zero; higher is better), payback period (how long until the project pays for itself; shorter is better), and ROI (Return on Investment — net benefit divided by cost).",
              "When the exam pits projects against each other, the heuristic ladder is: higher NPV > higher IRR > shorter payback > higher ROI. NPV is the most rigorous because it accounts for the time value of money. Payback is the least rigorous (ignores cash flows after payback). PMI's preferred metric depends on context but NPV is the safest default answer.",
              "Two cost concepts the exam abuses: sunk costs (money already spent — never relevant to forward-looking decisions) and opportunity costs (the value of the *next-best alternative not chosen* — implicit in every project selection). 'We already spent £1M' is not a reason to continue; that's sunk-cost fallacy.",
            ],
            keyPoints: [
              "NPV > IRR > payback > ROI in rigour. NPV is the safest default.",
              "NPV positive = value-adding. Higher NPV is better.",
              "Sunk costs are irrelevant to forward decisions.",
              "Opportunity cost = value of the next-best alternative not chosen.",
            ],
            simplified: {
              oneLiner:
                "NPV high and positive = good. Sunk cost = ignore it. Compare projects by what they'll add, not what was spent.",
            },
            deeper: {
              oneLiner:
                "On benefits-vs-cost questions: choose the project with the highest NPV unless the question specifies a different metric. If asked about payback alone, shorter wins.",
              paragraphs: [
                "Memorise the EVM formula family. Earned Value (EV) = % complete × Budget at Completion (BAC) for the work. Cost Variance (CV) = EV − AC; Schedule Variance (SV) = EV − PV. Cost Performance Index (CPI) = EV / AC; Schedule Performance Index (SPI) = EV / PV. Estimate at Completion (EAC) under typical conditions = BAC / CPI; if past variance is one-off, EAC = AC + (BAC − EV); if both cost and schedule drift, EAC = AC + (BAC − EV) / (CPI × SPI). Variance at Completion (VAC) = BAC − EAC. To-Complete Performance Index (TCPI) = (BAC − EV) / (BAC − AC).",
                "Time-value-of-money basics: NPV discounts future cash flows to today (positive = create value); IRR is the discount rate where NPV = 0 (compare to hurdle rate); payback is the time to recover initial investment (shorter = better but ignores time value). Benefit-Cost Ratio (BCR) > 1 means benefits exceed costs in today's money. PMI's preferred selection metric is NPV — pick the project with the highest NPV when the prompt is silent.",
              ],
              keyPoints: [
                "EVM: EV, PV, AC → CV, SV, CPI, SPI → EAC, VAC, TCPI.",
                "CPI < 1 = over budget. SPI < 1 = behind schedule.",
                "EAC formulas: typical = BAC/CPI; atypical = AC + (BAC−EV); both = AC + (BAC−EV)/(CPI·SPI).",
                "NPV is PMI's preferred selection metric when nothing else is specified.",
                "Sunk costs are never relevant to a go/no-go decision.",
              ],
              furtherReading: [
                {
                  href: "https://www.pmi.org/learning/library/earned-value-management-systems-analysis-8474",
                  title: "PMI · Earned Value Management Systems Analysis",
                },
              ],
              pitfalls: [
                "Don't confuse EAC (forecast total cost) with ETC (estimate to complete the rest); ETC = EAC − AC.",
                "Don't subtract sunk cost when deciding to continue — PMI ignores it.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Project A: NPV +£500k, IRR 14%, payback 3 years. Project B: NPV +£700k, IRR 11%, payback 5 years. Which does PMI default to selecting?",
                options: {
                  A: "Project A — higher IRR + shorter payback.",
                  B: "Project B — higher NPV.",
                  C: "Neither — both are too risky.",
                  D: "Both — diversify investment.",
                },
                correct: "B",
                explanations: {
                  A: "Higher IRR + shorter payback are seductive but NPV is the more rigorous metric.",
                  B: "Right — NPV is PMI's safest default unless another metric is specified.",
                  C: "Both have positive NPV; both add value.",
                  D: "Diversification is a portfolio question, not a project-selection one.",
                },
                principle:
                  "When NPV conflicts with IRR/payback, NPV wins — it accounts for time value of money correctly.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "'We've already spent £2M, so we should finish the project' is a valid PMI argument.",
                correct: false,
                explanationFalse:
                  "Right — that's sunk-cost fallacy. Forward decisions consider future costs and benefits, not past spend.",
                explanationTrue:
                  "Actually no — sunk costs are irrelevant. Past spend doesn't change whether future spend adds value.",
                principle:
                  "Sunk costs are irrelevant to forward-looking decisions.",
              },
              {
                n: 3,
                question:
                  "Opportunity cost in project selection refers to:",
                options: {
                  A: "The cost of the project's risks.",
                  B: "The value of the next-best project you didn't pick.",
                  C: "Money already spent.",
                  D: "Sponsor's preferred budget ceiling.",
                },
                correct: "B",
                principle:
                  "Opportunity cost = value of the option you didn't choose.",
              },
            ],
          },
        },
        {
          id: "c6-2-evm",
          code: "PD6.2",
          title: "Earned Value Management (EVM)",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "Earned Value Management (EVM) is the most-tested numeric framework on the PMP exam. Three core values: Planned Value (PV) — budget for work planned by this date; Earned Value (EV) — budget for work actually completed by this date; Actual Cost (AC) — money actually spent so far.",
              "From those three, four indicators: Cost Variance CV = EV - AC (positive = under budget); Schedule Variance SV = EV - PV (positive = ahead); Cost Performance Index CPI = EV / AC (>1 = under budget); Schedule Performance Index SPI = EV / PV (>1 = ahead). Memorise: a < 1 index or negative variance = trouble.",
              "Estimate at Completion (EAC) projects total project cost. Several formulas, but the exam-typical: EAC = BAC / CPI, where BAC = Budget at Completion (total approved budget). This assumes the trend continues. The 'to-complete performance index' (TCPI) tells you what efficiency the team needs from here to hit the budget — useful for spotting unrecoverable overruns.",
            ],
            keyPoints: [
              "Three values: PV (planned), EV (earned), AC (actual).",
              "Cost Variance = EV - AC. Schedule Variance = EV - PV.",
              "CPI = EV / AC. SPI = EV / PV. Both: >1 good, <1 bad.",
              "EAC = BAC / CPI (typical formula when trend continues).",
            ],
            simplified: {
              oneLiner:
                "EVM compares what you planned (PV), what you earned (EV), and what you spent (AC). Indices >1 are good.",
            },
            deeper: {
              oneLiner:
                "Memorisation aid: 'EV minus' for variances; 'EV over' for indices. CPI and SPI both put EV on top — when EV exceeds what was planned or spent, you're doing well.",
              examples: [
                {
                  title: "Worked example",
                  body: "BAC = £100k. By mid-project the team has done £40k of planned work (PV=£40k), actually delivered £35k of value (EV=£35k), and spent £42k (AC=£42k). CV = 35-42 = -£7k (over). SV = 35-40 = -£5k (behind). CPI = 35/42 = 0.83. SPI = 35/40 = 0.875. EAC = 100/0.83 ≈ £120k.",
                },
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A project has PV = £40k, EV = £35k, AC = £42k. Calculate CPI.",
                options: {
                  A: "1.20.",
                  B: "0.83.",
                  C: "0.875.",
                  D: "1.05.",
                },
                correct: "B",
                explanations: {
                  A: "CPI is EV/AC, not AC/EV.",
                  B: "Right — CPI = EV / AC = 35 / 42 ≈ 0.83. Under 1 = over budget.",
                  C: "That's SPI (EV / PV), not CPI.",
                  D: "Check the formula: CPI = EV / AC.",
                },
                principle:
                  "CPI = EV / AC. Less than 1 = over budget.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "Standard formula for Estimate at Completion (EAC) when the current trend continues:",
                acceptedAnswers: [
                  "BAC / CPI",
                  "BAC/CPI",
                  "bac/cpi",
                  "bac / cpi",
                ],
                placeholder: "e.g. BAC / CPI",
                principle:
                  "EAC = BAC / CPI when the cost-performance trend is assumed to continue.",
              },
              {
                n: 3,
                question:
                  "A team has SPI = 1.1 and CPI = 0.92. The project is:",
                options: {
                  A: "Ahead of schedule, over budget.",
                  B: "Behind schedule, under budget.",
                  C: "Ahead of schedule, under budget.",
                  D: "Behind schedule, over budget.",
                },
                correct: "A",
                explanations: {
                  A: "Right — SPI > 1 = ahead of schedule. CPI < 1 = over budget.",
                  B: "Reversed — SPI > 1 = ahead. CPI < 1 = over budget.",
                  C: "CPI < 1 means over budget, not under.",
                  D: "SPI > 1 means ahead, not behind.",
                },
                principle:
                  "SPI > 1 ahead; SPI < 1 behind. CPI > 1 under budget; CPI < 1 over budget.",
              },
            ],
          },
        },
        {
          id: "c6-3-stakeholders",
          code: "PD6.3",
          title: "Stakeholders domain — identify, analyse, engage",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Stakeholders Performance Domain manages who's involved, what they care about, and how they're engaged. The cycle is identify → analyse → engage → monitor. Identification happens early (in Initiating) and continues throughout; analysis classifies stakeholders by influence, interest, and impact; engagement plans calibrate communication and influence per stakeholder.",
              "Two analysis tools the exam tests: the power/interest grid (a 2×2 of low/high power against low/high interest, producing four engagement strategies: monitor / keep informed / keep satisfied / manage closely) and the salience model (three attributes: power, legitimacy, urgency — combinations like 'dominant' (power + legitimacy), 'definitive' (all three) are the classic stakeholders who must be engaged).",
              "Engagement levels PMBOK names: unaware → resistant → neutral → supportive → leading. The PM compares 'current' to 'desired' engagement level for each stakeholder and plans interventions to close the gap. Most engagement issues on the exam are answered by 'engage proactively and tailor the message to the audience'.",
            ],
            keyPoints: [
              "Cycle: identify → analyse → engage → monitor.",
              "Power/interest grid: monitor / keep informed / keep satisfied / manage closely.",
              "Salience model: power + legitimacy + urgency.",
              "Engagement levels: unaware → resistant → neutral → supportive → leading.",
            ],
            simplified: {
              oneLiner:
                "Map stakeholders to a 2×2 of power and interest, then engage each quadrant the way it needs.",
            },
            deeper: {
              oneLiner:
                "PMI's most-tested stakeholder pattern: a low-power but high-interest stakeholder is dissatisfied. Correct answer is usually 'keep informed' — not 'manage closely' (that's for high-power high-interest) and not 'ignore'.",
              paragraphs: [
                "Memorise the four quadrants of the power/interest grid: (1) high power + high interest = manage closely (active engagement); (2) high power + low interest = keep satisfied (don't bore them, but don't lose them); (3) low power + high interest = keep informed (they're advocates, give them what they need); (4) low power + low interest = monitor (don't over-invest). Alternative grids — power/influence, influence/impact, salience model (power/legitimacy/urgency) — show up rarely on the exam but the canonical 2×2 is power/interest.",
                "The Stakeholder Engagement Assessment Matrix maps each stakeholder's *current* engagement level (unaware, resistant, neutral, supportive, leading) against their *desired* engagement level. The gap drives the engagement plan. PMBOK 8e treats stakeholder management as a continuous, principle-level concern — not a one-shot register at Initiating.",
              ],
              keyPoints: [
                "Power/interest grid: manage closely / keep satisfied / keep informed / monitor.",
                "Engagement assessment matrix: current vs desired engagement, plan to close the gap.",
                "Salience model adds legitimacy + urgency for high-stakes contexts.",
                "Stakeholder register is a living document — update on every change.",
                "Engagement is principle-level in PMBOK 8e — runs through every focus area.",
              ],
              pitfalls: [
                "Don't 'manage closely' a low-power high-interest stakeholder — that's over-investment.",
                "Don't ignore a stakeholder just because they're low-power — they may be a future advocate or saboteur.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A stakeholder has high power but low interest in the project. On the power/interest grid, the engagement strategy is:",
                options: {
                  A: "Manage closely.",
                  B: "Keep informed.",
                  C: "Keep satisfied.",
                  D: "Monitor.",
                },
                correct: "C",
                explanations: {
                  A: "Manage closely is for high power + high interest.",
                  B: "Keep informed is for low power + high interest.",
                  C: "Right — high power + low interest = keep satisfied (don't overwhelm them; protect their support).",
                  D: "Monitor is for low power + low interest.",
                },
                principle:
                  "Power-interest quadrants: low/low monitor; low/high keep informed; high/low keep satisfied; high/high manage closely.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "Once the stakeholder register is built during Initiating, it doesn't need to be updated.",
                correct: false,
                explanationFalse:
                  "Right — stakeholder register is updated continuously as new stakeholders emerge and engagement levels change.",
                explanationTrue:
                  "Actually no — stakeholders change, perceptions change, and the register is updated throughout.",
                principle:
                  "Stakeholder register is a living document.",
              },
              {
                n: 3,
                question:
                  "The salience model classifies stakeholders by three attributes. Which set is correct?",
                options: {
                  A: "Power, legitimacy, urgency.",
                  B: "Cost, time, scope.",
                  C: "Power, interest, impact.",
                  D: "Sponsor, customer, regulator.",
                },
                correct: "A",
                principle:
                  "Salience model = power + legitimacy + urgency. Combinations name the classic stakeholder types (latent, expectant, definitive).",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Two projects: A has NPV +£300k, B has NPV +£550k. Other metrics: A has higher IRR and shorter payback. Default PMI selection:",
            options: {
              A: "A — higher IRR.",
              B: "B — higher NPV.",
              C: "Both equally.",
              D: "Cannot decide without sponsor input.",
            },
            correct: "B",
            principle:
              "NPV is PMI's safest default project-selection metric.",
          },
          {
            n: 2,
            question:
              "CV = -£8k. CPI = 0.85. The project is:",
            options: {
              A: "Under budget.",
              B: "Over budget.",
              C: "On budget.",
              D: "Cannot tell.",
            },
            correct: "B",
            principle:
              "Negative CV and CPI < 1 both mean over budget.",
          },
          {
            n: 3,
            question:
              "EAC formula when trend continues:",
            options: {
              A: "BAC × CPI.",
              B: "BAC / CPI.",
              C: "AC + (BAC - EV).",
              D: "AC × SPI.",
            },
            correct: "B",
            principle:
              "EAC = BAC / CPI (trend continues).",
          },
          {
            n: 4,
            question:
              "A high-power high-interest stakeholder is unhappy. PMI-aligned response:",
            options: {
              A: "Monitor.",
              B: "Keep informed.",
              C: "Keep satisfied.",
              D: "Manage closely.",
            },
            correct: "D",
            principle:
              "High power + high interest = manage closely.",
          },
          {
            n: 5,
            question:
              "Sunk costs in PMBOK 8e are:",
            options: {
              A: "Always relevant to the decision to continue.",
              B: "Never relevant to forward-looking decisions.",
              C: "Sometimes relevant, depending on size.",
              D: "Relevant only in adaptive projects.",
            },
            correct: "B",
            principle:
              "Sunk costs are irrelevant — forward decisions consider future costs and benefits only.",
          },
        ],
      },
    },
    /* ============================================================
       Section 7 — Performance Domains III: Resources & Risk
       ============================================================ */
    {
      id: "s7-domains-3",
      n: 7,
      title: "Performance domains III — resources & risk",
      iconImagePath: "/images/modules/final/pmbok-domains-iii.jpg",
      blurb:
        "Resources covers people and physical assets — including team formation and conflict. Risk covers both threats and opportunities, with five response strategies each.",
      concepts: [
        {
          id: "c7-1-resources",
          code: "PD7.1",
          title: "Resources domain — team formation and dynamics",
          bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "The Resources Performance Domain covers people and physical resources: acquiring them, developing them, and managing how they work together. PMBOK still references Bruce Tuckman's classic team-development stages: forming → storming → norming → performing → adjourning. Forming = polite and tentative; storming = conflict surfaces; norming = team agrees on how to work; performing = high productivity; adjourning = wrap up.",
              "Conflict-resolution styles PMI explicitly tests: collaborate / problem-solve (consider multiple viewpoints to reach consensus — PMI's preferred default), compromise / reconcile (give-and-take partial satisfaction — sometimes appropriate), force / direct (one party wins, others lose — last resort), smooth / accommodate (downplay differences — rarely the right answer), withdraw / avoid (retreat or postpone — only when the issue is genuinely minor).",
              "On the exam, default to collaborate / problem-solve unless the scenario explicitly rules it out (e.g., immediate safety risk → force, or trivial side issue → withdraw). Watch for scenarios where the PM is conflict-averse and just smooths over a real disagreement — PMI penalises that.",
            ],
            keyPoints: [
              "Tuckman: forming → storming → norming → performing → adjourning.",
              "Conflict styles: collaborate (best default), compromise, force, smooth, withdraw.",
              "PMI default: collaborate / problem-solve.",
              "Smooth and withdraw are rarely correct answers.",
            ],
            simplified: {
              oneLiner:
                "Teams go through stages. Conflict is normal in storming. Default to collaboration; force is for emergencies.",
            },
            deeper: {
              oneLiner:
                "When in doubt on the exam: collaborate/problem-solve is the right answer 70%+ of the time. PMI's wider stance: working through conflict openly strengthens the team.",
              paragraphs: [
                "The five Thomas-Kilmann conflict-resolution modes appear directly on the exam: collaborate (win/win, the default), compromise (lose/lose-lite, for time-pressured or trivial issues), smooth/accommodate (preserve harmony, useful for low-impact items), force/direct (one party wins, reserve for safety/emergency), and withdraw/avoid (defer, rarely correct). Tuckman's team-development model — forming, storming, norming, performing, adjourning — provides the temporal frame: conflict is expected in storming and is a signal of progress, not failure.",
                "When the exam describes a virtual / distributed team, expect higher communication overhead and explicit attention to cultural and time-zone differences. PMBOK 8e adds a hybrid-team variant where some members are co-located and others remote — the failure mode is treating remote members as second-class, which the PM must actively prevent.",
              ],
              keyPoints: [
                "Five conflict modes: collaborate > compromise > accommodate > force > avoid. Collaborate is the default on the exam.",
                "Tuckman: forming, storming, norming, performing, adjourning.",
                "Storming is normal — don't reorganise the team to escape it.",
                "Virtual / hybrid teams need more frequent, more structured communication, not less.",
                "Don't reward individuals when the work was team-delivered — it undermines team cohesion.",
              ],
              pitfalls: [
                "Don't pick 'force' on the exam unless safety or compliance is at stake.",
                "Don't avoid conflict by withdrawing — PMI considers that a competence gap, not a strategy.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Two senior engineers disagree about an architectural choice. The PM should:",
                options: {
                  A: "Pick one to keep things moving (force).",
                  B: "Postpone the discussion to later (withdraw).",
                  C: "Facilitate a session where both viewpoints are explored and a consensus solution emerges (collaborate).",
                  D: "Suggest they split the difference (compromise).",
                },
                correct: "C",
                explanations: {
                  A: "Force creates resentment — only appropriate for emergencies.",
                  B: "Withdraw leaves the issue unresolved. Wrong on architecturally significant choices.",
                  C: "Right — collaborate is PMI's preferred default. Surfaces the best of both ideas.",
                  D: "Compromise can leave both sides partially unsatisfied. Try collaborate first.",
                },
                principle:
                  "PMI default conflict response: collaborate / problem-solve.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "Tuckman's stage where conflict surfaces and team members challenge each other's ideas is:",
                acceptedAnswers: ["storming", "the storming stage"],
                principle:
                  "Storming is the conflict stage. Forming-storming-norming-performing-adjourning.",
              },
              {
                n: 3,
                question:
                  "Which Tuckman stage is characterised by HIGH productivity and minimal supervision?",
                options: {
                  A: "Forming.",
                  B: "Storming.",
                  C: "Performing.",
                  D: "Adjourning.",
                },
                correct: "C",
                principle:
                  "Performing = team is operating at high productivity with minimal intervention.",
              },
            ],
          },
        },
        {
          id: "c7-2-risk-threats",
          code: "PD7.2",
          title: "Risk domain — threats (the five negative strategies)",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "A risk is an uncertain event that, if it occurs, has a positive (opportunity) or negative (threat) effect on objectives. PMBOK 8e gives five strategies for *threats*, all PMI-tested verbatim: Escalate, Avoid, Transfer, Mitigate, Accept (memorise the acronym EATMA, or 'Eat Ma'). Each has a typical condition under which it's the right call.",
              "Escalate: the threat falls outside the PM's authority or affects portfolio/program-level objectives. Avoid: change the plan to eliminate the threat entirely (extend schedule, reduce scope, change strategy). Transfer: shift the threat to a third party — insurance, warranty, performance bond, contract clause. Mitigate: reduce probability OR impact (early action is more effective than after the fact). Accept: acknowledge the threat but take no proactive action — fine for low-priority threats or when no other strategy is cost-effective. Active acceptance establishes a contingency reserve; passive acceptance does nothing but periodically review.",
              "On the exam, the right strategy usually depends on three factors: probability, impact, and the threat's relationship to project authority. Big + outside-authority → escalate. Big + within-authority → avoid or mitigate. Small/manageable → accept (often with a contingency reserve). Transferrable to someone better placed → transfer.",
            ],
            keyPoints: [
              "Five threat strategies: Escalate, Avoid, Transfer, Mitigate, Accept.",
              "Escalate when outside PM authority or program/portfolio level.",
              "Avoid removes the cause; mitigate reduces probability or impact.",
              "Transfer = insurance / warranty / contract clause.",
              "Active acceptance = contingency reserve; passive acceptance = just monitor.",
            ],
            simplified: {
              oneLiner:
                "Threats: escalate it, avoid it, transfer it, mitigate it, or accept it. Pick by size and authority.",
            },
            deeper: {
              oneLiner:
                "Expected Monetary Value (EMV) is the typical numeric tool: EMV = probability × impact. Use it to compare strategies cost-effectively.",
              examples: [
                {
                  title: "EMV example",
                  body: "A risk has 30% probability and £100k impact. EMV = 0.3 × 100,000 = £30,000. If avoidance costs £50k, mitigation £15k reducing probability to 10% (new EMV £10k, net benefit £20k vs cost £15k = £5k positive), or insurance costs £25k — mitigation wins on EMV.",
                },
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A regulatory change at the national level is likely to affect every project in the portfolio. The PM should:",
                options: {
                  A: "Avoid by re-planning the project around it.",
                  B: "Transfer by buying insurance.",
                  C: "Mitigate by adding contingency.",
                  D: "Escalate — the threat is bigger than the project.",
                },
                correct: "D",
                principle:
                  "Threats above PM authority or affecting program/portfolio → escalate.",
              },
              {
                n: 2,
                question:
                  "A team builds a redundant subsystem to limit the damage if the primary system fails. This is which threat response?",
                options: {
                  A: "Avoid.",
                  B: "Mitigate.",
                  C: "Transfer.",
                  D: "Accept.",
                },
                correct: "B",
                explanations: {
                  A: "Avoid would remove the cause (not the consequence).",
                  B: "Right — redundancy doesn't eliminate the failure possibility; it reduces *impact*. That's mitigation.",
                  C: "Transfer would push the risk to a third party.",
                  D: "Acceptance is no proactive action.",
                },
                principle:
                  "Mitigate = reduce probability OR impact.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "Establishing a contingency reserve is a form of passive acceptance.",
                correct: false,
                explanationFalse:
                  "Right — contingency reserve is *active* acceptance. Passive acceptance is doing nothing except periodic review.",
                explanationTrue:
                  "Actually no — contingency reserve = active acceptance. Passive = no proactive action.",
                principle:
                  "Active acceptance = contingency reserve. Passive acceptance = monitor only.",
              },
            ],
          },
        },
        {
          id: "c7-3-risk-opportunities",
          code: "PD7.3",
          title: "Risk domain — opportunities (the five positive strategies)",
          bloom: "An",
          lesson: {
            status: "ready",
            paragraphs: [
              "Opportunities are positive risks. PMBOK 8e gives five symmetrical strategies — three are renamed twins of the threat list: Escalate, Exploit (twin of avoid — *ensure* it happens), Share (twin of transfer — give it to a third party better able to capture it), Enhance (twin of mitigate — increase probability or impact), Accept (same word, same logic for low-priority opportunities).",
              "Exploit: actions to make the opportunity *definitely* happen — increase probability to 100%. Example: assign your best engineers to ensure an early-completion bonus is captured. Share: bring in a partner (joint venture, special-purpose company) better positioned to realise the opportunity. Enhance: increase probability OR impact — e.g., add resources to accelerate a likely-but-not-certain early finish. Accept: low-priority; active acceptance includes a contingency reserve to take advantage if the opportunity materialises.",
              "Most-tested pattern on the exam: candidates instinctively pick *avoid* or *mitigate* when the scenario describes an opportunity. The setup is deliberately easy to misread. Slow down: 'might finish two weeks early' = opportunity; the correct verbs are exploit / share / enhance / accept — not avoid or mitigate.",
            ],
            keyPoints: [
              "Five opportunity strategies: Escalate, Exploit, Share, Enhance, Accept.",
              "Exploit = make it 100% certain.",
              "Share = transfer to a third party who can better capture it.",
              "Enhance = increase probability or impact.",
              "Accept (active) = set contingency reserve to take advantage.",
            ],
            simplified: {
              oneLiner:
                "Opportunities: escalate, exploit, share, enhance, accept. Don't reach for avoid or mitigate — those are for threats.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A vendor has offered a 20% discount if the project signs the contract within 7 days. The PM wants to capture the discount. This is which opportunity strategy?",
                options: {
                  A: "Enhance.",
                  B: "Share.",
                  C: "Exploit.",
                  D: "Accept.",
                },
                correct: "C",
                explanations: {
                  A: "Enhance increases probability of an already-uncertain event. The opportunity here is binary: take it or miss it.",
                  B: "Share involves a third party. Not relevant here.",
                  C: "Right — the PM is ensuring the opportunity is captured (probability → 100%). That's exploit.",
                  D: "Accept = take no proactive action. The PM is taking action.",
                },
                principle:
                  "Exploit = take action to make the opportunity definitely happen.",
              },
              {
                n: 2,
                question:
                  "An opportunity is large but the project's organisation lacks the in-house skills to capture it. A partner does have the skills. PMI-correct strategy:",
                options: {
                  A: "Exploit alone.",
                  B: "Share — bring in the partner.",
                  C: "Mitigate.",
                  D: "Accept.",
                },
                correct: "B",
                principle:
                  "Share = transfer to a third party better positioned to capture the opportunity.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "'Mitigate' is a valid response strategy for opportunities.",
                correct: false,
                explanationFalse:
                  "Right — mitigate is a *threat* strategy. The opportunity twin is enhance.",
                explanationTrue:
                  "Actually no — mitigate is a threat strategy. Use enhance for opportunities.",
                principle:
                  "Mitigate → threats only. The opportunity twin is enhance.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "Which is the PMI-preferred default conflict-resolution style?",
            options: {
              A: "Force.",
              B: "Smooth.",
              C: "Collaborate / problem-solve.",
              D: "Withdraw.",
            },
            correct: "C",
            principle:
              "PMI default: collaborate / problem-solve.",
          },
          {
            n: 2,
            question:
              "List the five threat-response strategies (in any order).",
            options: {
              A: "Escalate, Avoid, Transfer, Mitigate, Accept.",
              B: "Escalate, Exploit, Share, Enhance, Accept.",
              C: "Plan, Identify, Analyse, Respond, Monitor.",
              D: "Crash, Fast-track, Accept, Mitigate, Transfer.",
            },
            correct: "A",
            principle:
              "Threat strategies: Escalate, Avoid, Transfer, Mitigate, Accept (EATMA).",
          },
          {
            n: 3,
            question:
              "An opportunity could double the project's benefit if a third-party partner is brought in. Correct strategy:",
            options: {
              A: "Avoid.",
              B: "Transfer.",
              C: "Share.",
              D: "Accept.",
            },
            correct: "C",
            principle:
              "Share = give a third party (better positioned) the opportunity.",
          },
          {
            n: 4,
            question:
              "EMV (Expected Monetary Value) of a 25% probability, £40k impact threat:",
            options: {
              A: "£40,000.",
              B: "£10,000.",
              C: "£4,000.",
              D: "£100,000.",
            },
            correct: "B",
            principle:
              "EMV = probability × impact = 0.25 × £40k = £10k.",
          },
          {
            n: 5,
            question:
              "Tuckman stage with high productivity, minimal supervision needed:",
            options: {
              A: "Forming.",
              B: "Storming.",
              C: "Norming.",
              D: "Performing.",
            },
            correct: "D",
            principle:
              "Performing = high productivity, minimal management overhead.",
          },
        ],
      },
    },
    /* ============================================================
       Section 8 — Exam strategy & final review
       ============================================================ */
    {
      id: "s8-exam-strategy",
      n: 8,
      title: "Exam strategy & final review",
      iconImagePath: "/images/modules/final/pmbok-exam-strategy.jpg",
      blurb:
        "PMI-isms, scenario triage, ethics, and a study-plan checklist for the final two weeks before the exam.",
      concepts: [
        {
          id: "c8-1-pmi-isms",
          code: "ES8.1",
          title: "PMI-isms — how the exam thinks",
          bloom: "E",
          lesson: {
            status: "ready",
            paragraphs: [
              "'PMI-ism' is shorthand for the unwritten assumptions baked into PMP exam questions. They diverge from real-world practice in predictable ways and the candidates who learn them pass; those who answer from experience alone often fail. Five worth memorising:",
              "(1) The PM is professional, ethical, proactive, and process-following. Always. There is no 'realistic' option — choose the response a well-trained, ethical PM would take. (2) The PM does not skip the plan. Any answer that bypasses the project management plan is almost certainly wrong. (3) The PM does not unilaterally decide outside their authority. When the scenario implies the PM exceeds their threshold, escalate. (4) The customer/sponsor relationship is collaborative, not adversarial. Hide-the-news answers are wrong. (5) The team is competent and trustworthy unless the scenario explicitly says otherwise. Don't pick 'replace the team' as a first response.",
              "Three more PMI-isms about timing: the PM addresses problems first, not paperwork. Documentation follows action. Lessons learned are recorded continuously, not just at closing. And: 'always plan first' in scenarios where the PM is presented mid-Execution with new information. Almost any 'analyse and plan' option beats 'act immediately'.",
            ],
            keyPoints: [
              "PM is professional, ethical, proactive, plan-following.",
              "Escalate when over threshold; don't unilaterally decide.",
              "Customer relationship is collaborative; don't hide news.",
              "Address problems first, then documentation.",
              "When two answers look right, prefer the one that analyses/plans first.",
            ],
            simplified: {
              oneLiner:
                "Answer like the textbook-perfect PM, not like your real-world experience.",
            },
            deeper: {
              oneLiner:
                "Common trap: 'realistic' answers (skip the plan, decide unilaterally, fix it yourself) feel right. They're wrong on PMP. Pick the answer that fits the idealised PM.",
              paragraphs: [
                "PMI's 'idealised PM' has seven recurring exam patterns worth memorising: (1) the PM follows the plan and uses integrated change control for any deviation; (2) the PM analyses before acting (don't pick 'do the thing immediately'); (3) the PM escalates over their threshold but solves at their level when possible; (4) the PM consults stakeholders before deciding *on* them; (5) the PM treats the team as competent (don't replace, coach); (6) the PM documents continuously, not just at closing; (7) the PM picks the ethical option even when it costs the project.",
                "Many wrong-answer distractors echo real-world shortcuts: skip the meeting to save time, fix the issue yourself rather than coach the responsible person, agree to the customer's pet feature to keep them happy, work the team overtime to recover schedule. Each of these is testable. The PMI-correct response is almost always the slower, more process-following alternative — provided it doesn't violate ethics.",
              ],
              keyPoints: [
                "Plan-following > shortcut.",
                "Analyse > immediate action.",
                "Solve at your level > escalate too early.",
                "Coach the team > replace the team.",
                "Document continuously > document at closing.",
                "Ethics > business pressure.",
              ],
              pitfalls: [
                "Don't pick 'work overtime to recover schedule' — PMI prefers replanning, fast-tracking, or crashing through formal change control.",
                "Don't pick 'fix it myself' — the PM coaches the responsible team member.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A team member just discovered a major scope gap. Two options stand out: (A) immediately escalate to the sponsor, (B) analyse impact and bring options to the sponsor. PMI prefers:",
                options: {
                  A: "Option A — speed of escalation matters.",
                  B: "Option B — analyse first, then escalate with options.",
                  C: "Neither — handle it silently.",
                  D: "Defer the decision to the next review.",
                },
                correct: "B",
                principle:
                  "PMI prefers analysis + options over immediate escalation. Bring the sponsor a decision-ready package.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "When two answers look correct, the 'realistic / pragmatic' one is usually the PMI-preferred choice.",
                correct: false,
                explanationFalse:
                  "Right — PMI prefers the textbook-perfect, process-following answer over the 'realistic' shortcut.",
                explanationTrue:
                  "Actually no — PMI prefers the process-following textbook answer over the realistic shortcut.",
                principle:
                  "Idealised PM > realistic PM on the exam.",
              },
              {
                n: 3,
                question:
                  "A stakeholder calls the team lead directly to demand a change. Best PMI-aligned next step:",
                options: {
                  A: "Build the change — keep the stakeholder happy.",
                  B: "Refuse the request and report the stakeholder for going around the PM.",
                  C: "Route the request through the integrated change-control process and inform the stakeholder of the process.",
                  D: "Wait until the next steering meeting.",
                },
                correct: "C",
                principle:
                  "All changes through change control; stakeholder relationships handled collaboratively.",
              },
            ],
          },
        },
        {
          id: "c8-2-scenario-triage",
          code: "ES8.2",
          title: "Scenario triage — how to read a PMP question",
          bloom: "E",
          lesson: {
            status: "ready",
            paragraphs: [
              "PMP scenarios are dense and often run 100+ words. A reliable triage pattern: (1) read the *last sentence* first — it usually contains the actual question ('what should the PM do FIRST / NEXT / BEST?'). (2) Identify the focus area (Initiating / Planning / Executing / M&C / Closing) and the performance domain. (3) Note the wording: 'first' means immediate action; 'best' implies a strategic choice; 'next' implies a sequence.",
              "Eliminate two answers immediately. Two of four options will usually be obviously wrong (ignores the plan, breaks ethics, bypasses change control). The remaining two are the harder choice. Apply PMI-isms: plan-following > action-first; analyse > act; escalate when over threshold; collaborate > force.",
              "Be alert for 'do nothing' answers — they are sometimes correct (e.g., 'monitor only' for low-priority stakeholders, 'passive acceptance' for low-priority risks). They are rarely the right call for the FIRST action in execution, but not always wrong.",
            ],
            keyPoints: [
              "Read the last sentence first.",
              "Identify focus area + performance domain.",
              "Eliminate two obviously-wrong options.",
              "Apply PMI-isms to the remaining pair.",
              "'First' vs 'best' vs 'next' matters.",
            ],
            simplified: {
              oneLiner:
                "Read the question last sentence first. Eliminate the two obviously-wrong options. PMI-ism the remaining pair.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Reading 100+ word scenarios efficiently means starting with:",
                options: {
                  A: "The first sentence — it sets the context.",
                  B: "The last sentence — it usually contains the actual question.",
                  C: "All four options — choose by gut.",
                  D: "The middle paragraph — it has the data.",
                },
                correct: "B",
                principle:
                  "Read the last sentence first to anchor on the question being asked.",
              },
              {
                kind: "true-false",
                n: 2,
                question:
                  "'Do nothing' is always the wrong answer on a PMP exam question.",
                correct: false,
                explanationFalse:
                  "Right — 'do nothing / monitor only' can be correct for low-priority risks (passive acceptance) or low-power-low-interest stakeholders (monitor).",
                explanationTrue:
                  "Actually no — there are cases (passive acceptance, monitor-only stakeholders) where 'do nothing' is correct.",
                principle:
                  "'Do nothing' is occasionally correct — for low-priority risks or stakeholders.",
              },
              {
                n: 3,
                question:
                  "Words that change which response is correct on the same scenario:",
                options: {
                  A: "'FIRST' implies immediate action sequence; 'BEST' implies strategic fit.",
                  B: "'FIRST', 'NEXT', 'BEST' all mean the same thing.",
                  C: "Only 'FIRST' matters; the others are noise.",
                  D: "Only 'BEST' matters.",
                },
                correct: "A",
                principle:
                  "FIRST = order-of-action. BEST = quality/strategic fit. NEXT = sequence after current step.",
              },
            ],
          },
        },
        {
          id: "c8-3-ethics-and-study-plan",
          code: "ES8.3",
          title: "PMI Code of Ethics + final two weeks",
          bloom: "E",
          lesson: {
            status: "ready",
            paragraphs: [
              "PMI's Code of Ethics and Professional Conduct is enforced in two ways: it's a separate testable domain on the PMP exam, and a few scenarios are designed to trip up candidates who deprioritise it. Four pillars: Responsibility (ownership of decisions), Respect (for people, dignity, resources), Fairness (impartial, transparent), Honesty (truthful, accurate). Memorise them: R-R-F-H.",
              "Ethics scenarios usually have a candidate ethical breach (bribery, conflict of interest, hiding information, plagiarism, retaliation) and a 'business pressure' option that asks the PM to look the other way. The PMI-correct answer is always the ethical one, even when it's commercially painful. Disclose conflicts; refuse bribes; report violations.",
              "Final-two-weeks study plan: (1) one full timed mock exam per week; (2) drill the worst-performing domain daily; (3) re-read the PMBOK principles section once a week; (4) write the EVM formulas, PERT formula, and the five threat / five opportunity strategies on a single index card you read every morning; (5) sleep more than the day before — fatigued candidates underperform their material by ~10%.",
            ],
            keyPoints: [
              "Four ethics pillars: Responsibility, Respect, Fairness, Honesty.",
              "Ethics always wins over commercial pressure on the exam.",
              "Two full mocks in final two weeks, plus daily targeted drills.",
              "Memorise EVM, PERT, and the five-strategy lists on an index card.",
              "Sleep — fatigue costs ~10% on real-exam performance.",
            ],
            simplified: {
              oneLiner:
                "Ethics: always pick the ethical option. Study plan: two timed mocks + daily drills + sleep.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A vendor offers the PM a gift worth £200 to 'expedite invoice approval'. PMI-correct response:",
                options: {
                  A: "Accept — it's within typical gift-giving etiquette.",
                  B: "Decline politely and disclose the offer to the appropriate authority.",
                  C: "Accept and disclose it afterwards.",
                  D: "Negotiate the gift's value down.",
                },
                correct: "B",
                principle:
                  "Conflicts of interest: decline + disclose. Always.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "PMI's four ethics pillars (in any order). Memorisation aid is R-R-F-H. Name any one of them.",
                acceptedAnswers: [
                  "responsibility",
                  "respect",
                  "fairness",
                  "honesty",
                ],
                placeholder: "one word",
                principle:
                  "Responsibility, Respect, Fairness, Honesty.",
              },
              {
                n: 3,
                question:
                  "In a final-two-weeks study plan, the highest-value daily activity is:",
                options: {
                  A: "Reading random forum posts.",
                  B: "Watching new long-form videos.",
                  C: "Drilling the domain where mock-exam performance is weakest.",
                  D: "Re-reading the entire PMBOK Guide from page 1.",
                },
                correct: "C",
                principle:
                  "Spaced, targeted practice at weak spots beats broad re-reading in the final fortnight.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question:
              "When two answers both seem correct, prefer:",
            options: {
              A: "The faster, more pragmatic one.",
              B: "The textbook-PM-following-process one.",
              C: "The one that requires least documentation.",
              D: "The one that avoids stakeholder contact.",
            },
            correct: "B",
            principle:
              "PMI-ism #1: prefer the idealised PM, not the realistic shortcut.",
          },
          {
            n: 2,
            question:
              "PMI's four ethics pillars are:",
            options: {
              A: "Speed, scale, cost, quality.",
              B: "Responsibility, Respect, Fairness, Honesty.",
              C: "Plan, Do, Check, Act.",
              D: "Initiate, Plan, Execute, Close.",
            },
            correct: "B",
            principle:
              "Ethics: R-R-F-H. Memorise.",
          },
          {
            n: 3,
            question:
              "PMP question reading strategy: read first which sentence?",
            options: {
              A: "First sentence.",
              B: "The four options.",
              C: "Last sentence (the actual question).",
              D: "Middle paragraph.",
            },
            correct: "C",
            principle:
              "Read the last sentence first to anchor on the actual question.",
          },
          {
            n: 4,
            question:
              "A vendor offers a gift to expedite a decision. The PM should:",
            options: {
              A: "Accept and split with the team.",
              B: "Decline and disclose.",
              C: "Accept under £100, decline above.",
              D: "Ignore — no rule has been broken.",
            },
            correct: "B",
            principle:
              "Conflict of interest → decline + disclose.",
          },
          {
            n: 5,
            question:
              "Two weeks before the exam, daily highest-value activity:",
            options: {
              A: "Drill the weakest domain.",
              B: "Cram new topics.",
              C: "Re-read PMBOK cover to cover.",
              D: "Stop studying entirely.",
            },
            correct: "A",
            principle:
              "Targeted weak-spot drilling beats broad re-reading in the final fortnight.",
          },
        ],
      },
    },
  ],
  /* ============================================================
     Mock exams — full list authored after the section content.
     ============================================================ */
  mockExams: [
    {
      id: "mock-30",
      title: "Mock exam — 30 PMP-style scenarios",
      blurb:
        "30 questions, 45 minutes, drawn proportionally from all eight sections. Treat anything under 70% as a study gap.",
      timeMinutes: 45,
      passPct: 0.7,
      scoreBands: [
        {
          min: 0,
          max: 49,
          verdict: "Re-study the principles + focus areas",
          message:
            "You're missing the structural anchors of the PMBOK 8e framework. Re-read Sections 1, 2, and 3 before attempting again.",
        },
        {
          min: 50,
          max: 69,
          verdict: "Almost there",
          message:
            "You know most of the material but have gaps. Drill the section test where you missed the most and re-attempt this mock.",
        },
        {
          min: 70,
          max: 84,
          verdict: "Mock-exam pass",
          message:
            "You're at or above PMI's typical 70% threshold. Sit one more timed mock to confirm consistency.",
        },
        {
          min: 85,
          max: 100,
          verdict: "Exam-ready",
          message:
            "Consistent mock results at this band typically translate to real-exam pass. Book the exam.",
        },
      ],
      questions: [
        {
          n: 1,
          question:
            "Which is NOT one of the six refined principles in PMBOK 8e?",
          options: {
            A: "Adopt a Holistic View.",
            B: "Be an Accountable Leader.",
            C: "Optimise the Project Schedule.",
            D: "Focus on Value.",
          },
          correct: "C",
          principle:
            "The six 8e principles: Holistic View, Value, Quality, Accountable Leader, Sustainability, Empowered Culture.",
        },
        {
          n: 2,
          question:
            "An ongoing 24/7 support operation with no end date is best classified as:",
          options: {
            A: "A project.",
            B: "A program.",
            C: "Operations.",
            D: "A portfolio.",
          },
          correct: "C",
          principle:
            "Project = temporary + unique. Ongoing + repetitive = operations.",
        },
        {
          n: 3,
          question:
            "The customer asks the team lead directly to slip in a small change, bypassing the PM. The PMI-correct response is:",
          options: {
            A: "Build it — it's small.",
            B: "Refuse and ignore the customer.",
            C: "Route the request through the integrated change-control process.",
            D: "Defer to the next quarterly review.",
          },
          correct: "C",
          principle:
            "All changes go through integrated change control. No 'just this once'.",
        },
        {
          n: 4,
          question:
            "PV = 80, EV = 70, AC = 90. Calculate CPI.",
          options: {
            A: "1.14.",
            B: "0.78.",
            C: "0.88.",
            D: "0.875.",
          },
          correct: "B",
          principle:
            "CPI = EV / AC = 70/90 ≈ 0.78. Less than 1 = over budget.",
        },
        {
          n: 5,
          question:
            "A new EU regulation that will reshape every project in the portfolio. Risk response strategy?",
          options: {
            A: "Avoid.",
            B: "Transfer.",
            C: "Mitigate.",
            D: "Escalate.",
          },
          correct: "D",
          principle:
            "Risks above PM authority or affecting portfolio level → escalate.",
        },
        {
          n: 6,
          question:
            "Activity O=4, M=8, P=18. PERT expected duration:",
          options: {
            A: "8.",
            B: "9.",
            C: "10.",
            D: "11.",
          },
          correct: "B",
          principle:
            "PERT = (O + 4M + P) / 6 = (4 + 32 + 18) / 6 = 54 / 6 = 9.",
        },
        {
          n: 7,
          question:
            "The team adds a fancy reporting feature the customer didn't request. PMBOK calls this:",
          options: {
            A: "Tailoring.",
            B: "Progressive elaboration.",
            C: "Gold plating.",
            D: "Scope creep.",
          },
          correct: "C",
          principle:
            "Gold plating = team voluntarily adding work. Scope creep = stakeholders adding scope without control.",
        },
        {
          n: 8,
          question:
            "PMI's preferred default conflict-resolution style:",
          options: {
            A: "Force.",
            B: "Smooth.",
            C: "Collaborate / problem-solve.",
            D: "Withdraw.",
          },
          correct: "C",
          principle:
            "Default conflict response: collaborate / problem-solve.",
        },
        {
          n: 9,
          question:
            "A stakeholder has HIGH power but LOW interest. Power/interest grid strategy:",
          options: {
            A: "Monitor.",
            B: "Keep informed.",
            C: "Keep satisfied.",
            D: "Manage closely.",
          },
          correct: "C",
          principle:
            "High power + low interest = keep satisfied.",
        },
        {
          n: 10,
          question:
            "PMBOK's sustainability pyramid's MOST-preferred response to a negative externality:",
          options: {
            A: "Compensate / offset.",
            B: "Restore the impact.",
            C: "Minimise the impact.",
            D: "Avoid the impact altogether.",
          },
          correct: "D",
          principle:
            "Sustainability pyramid: avoid > minimise > restore > compensate.",
        },
        {
          n: 11,
          question:
            "Project A: NPV +£200k, IRR 18%. Project B: NPV +£400k, IRR 12%. PMI default selection:",
          options: {
            A: "A — higher IRR.",
            B: "B — higher NPV.",
            C: "Both equally.",
            D: "Cannot decide.",
          },
          correct: "B",
          principle:
            "NPV is the safest default project-selection metric in PMBOK.",
        },
        {
          n: 12,
          question:
            "Approach for evolving requirements + frequent feedback?",
          options: {
            A: "Predictive.",
            B: "Adaptive.",
            C: "Operations.",
            D: "Charter-only.",
          },
          correct: "B",
          principle:
            "Adaptive fits evolving requirements and feedback-driven value.",
        },
        {
          n: 13,
          question:
            "Tuckman's stage where the team operates at high productivity with minimal supervision:",
          options: {
            A: "Forming.",
            B: "Storming.",
            C: "Norming.",
            D: "Performing.",
          },
          correct: "D",
          principle:
            "Performing = high productivity, minimal management overhead.",
        },
        {
          n: 14,
          question:
            "An opportunity could be realised but the org lacks the in-house skill. A partner does. PMI strategy:",
          options: {
            A: "Exploit alone.",
            B: "Mitigate.",
            C: "Share — bring in the partner.",
            D: "Avoid.",
          },
          correct: "C",
          principle:
            "Share = transfer opportunity to a third party better positioned to capture it.",
        },
        {
          n: 15,
          question:
            "Internal compliance template (built by the org's QA team) is a:",
          options: {
            A: "EEF.",
            B: "Risk register entry.",
            C: "OPA.",
            D: "Stakeholder.",
          },
          correct: "C",
          principle:
            "Internal, org-owned, reusable artefact = OPA.",
        },
        {
          n: 16,
          question:
            "EAC formula when the current cost trend is expected to continue:",
          options: {
            A: "BAC × CPI.",
            B: "BAC / CPI.",
            C: "AC + BAC.",
            D: "AC × SPI.",
          },
          correct: "B",
          principle:
            "EAC = BAC / CPI when trend continues.",
        },
        {
          n: 17,
          question:
            "The business case becomes invalid mid-project. PMI-correct first action:",
          options: {
            A: "Continue — too much already spent.",
            B: "Escalate to sponsor; recommend re-planning or termination.",
            C: "Quietly reduce scope.",
            D: "Wait for the customer to complain.",
          },
          correct: "B",
          principle:
            "When the business case dies, escalate. Continuation is not PMI-correct.",
        },
        {
          n: 18,
          question:
            "Which is NOT a Closing-focus-area activity?",
          options: {
            A: "Archive project records.",
            B: "Release team resources.",
            C: "Develop the project charter.",
            D: "Capture lessons learned.",
          },
          correct: "C",
          principle:
            "Charter is an Initiating artefact, not Closing.",
        },
        {
          n: 19,
          question:
            "100% rule for the WBS says:",
          options: {
            A: "The WBS is 100% complete after planning.",
            B: "Each work package is 100% defined before execution.",
            C: "The WBS includes 100% of the project work — no more, no less.",
            D: "All stakeholders sign off on 100% of the WBS.",
          },
          correct: "C",
          principle:
            "WBS 100% rule: every scope element in, nothing extra.",
        },
        {
          n: 20,
          question:
            "Schedule slipping. Budget room exists; risk tolerance low. Best compression:",
          options: {
            A: "Crash — add resources.",
            B: "Fast-track — parallelise.",
            C: "Reduce scope.",
            D: "Do nothing.",
          },
          correct: "A",
          principle:
            "Crash adds money, no extra risk. Fast-track is free but adds risk.",
        },
        {
          n: 21,
          question:
            "Active acceptance of a threat means:",
          options: {
            A: "Do nothing.",
            B: "Establish a contingency reserve.",
            C: "Insure against the threat.",
            D: "Eliminate the threat's cause.",
          },
          correct: "B",
          principle:
            "Active acceptance = contingency reserve. Passive acceptance = monitor only.",
        },
        {
          n: 22,
          question:
            "Quality vs grade: low-quality phones are:",
          options: {
            A: "Always acceptable if customer wants them.",
            B: "Acceptable if grade was also low.",
            C: "Never acceptable.",
            D: "Acceptable for low-cost projects.",
          },
          correct: "C",
          principle:
            "Low quality is always bad. Low grade can be a deliberate choice.",
        },
        {
          n: 23,
          question:
            "Adaptive scope is governed primarily through:",
          options: {
            A: "The WBS.",
            B: "The Gantt chart.",
            C: "The product backlog + definition of done + acceptance criteria.",
            D: "The earned-value baseline.",
          },
          correct: "C",
          principle:
            "Adaptive scope = backlog + DoD + acceptance criteria.",
        },
        {
          n: 24,
          question:
            "A vendor offers the PM a £200 gift to expedite an invoice. Correct response:",
          options: {
            A: "Accept — within etiquette.",
            B: "Decline and disclose.",
            C: "Accept under £100 only.",
            D: "Ignore.",
          },
          correct: "B",
          principle:
            "Conflict of interest → decline + disclose. Always.",
        },
        {
          n: 25,
          question:
            "PMI's four ethics pillars are Responsibility, Respect, Fairness, and ___?",
          options: {
            A: "Honesty.",
            B: "Speed.",
            C: "Profitability.",
            D: "Confidentiality.",
          },
          correct: "A",
          principle:
            "Ethics: Responsibility, Respect, Fairness, Honesty.",
        },
        {
          n: 26,
          question:
            "PMI distinguishes deliverable from outcome from benefit. The customer experiences:",
          options: {
            A: "The output mostly.",
            B: "The outcome (a change in their state) and over time the benefit (realised value).",
            C: "Only the benefit.",
            D: "Only the output.",
          },
          correct: "B",
          principle:
            "Output → outcome → benefit. PMBOK 8e measures success by benefit.",
        },
        {
          n: 27,
          question:
            "EMV of a risk: probability 40%, impact £250k. EMV =",
          options: {
            A: "£10k.",
            B: "£100k.",
            C: "£250k.",
            D: "£1M.",
          },
          correct: "B",
          principle:
            "EMV = probability × impact = 0.40 × £250k = £100k.",
        },
        {
          n: 28,
          question:
            "Monitoring & Controlling is performed:",
          options: {
            A: "After Executing, before Closing.",
            B: "In parallel with all other focus areas.",
            C: "Only at phase gates.",
            D: "Only when the schedule slips.",
          },
          correct: "B",
          principle:
            "M&C is parallel with all focus areas throughout the project.",
        },
        {
          n: 29,
          question:
            "Tailoring decisions are limited by:",
          options: {
            A: "The PM's personal preference.",
            B: "Team agreements alone.",
            C: "Mandatory inputs (regulation, contract, org policy).",
            D: "Nothing — anything can be tailored.",
          },
          correct: "C",
          principle:
            "Mandatory inputs cannot be tailored away — regulation, contract, org policy.",
        },
        {
          n: 30,
          question:
            "Final-two-weeks daily highest-value study activity:",
          options: {
            A: "Re-read the whole PMBOK Guide.",
            B: "Watch new long-form videos.",
            C: "Targeted drill on the weakest mock-exam domain.",
            D: "Cram new topics not yet seen.",
          },
          correct: "C",
          principle:
            "Spaced, targeted weak-spot drilling beats broad re-reading in the final fortnight.",
        },
      ],
    },
  ],
};
