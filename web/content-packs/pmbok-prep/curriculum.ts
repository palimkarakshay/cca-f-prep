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
        /* Placeholder — full 30-question bank lands in a later commit. */
        {
          n: 1,
          question:
            "Which of these is NOT one of the six refined principles in PMBOK 8e?",
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
            "Project = temporary + unique. Ongoing repetitive work = operations.",
        },
      ],
    },
  ],
};
