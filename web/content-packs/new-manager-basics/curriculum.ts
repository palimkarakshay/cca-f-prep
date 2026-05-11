import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    {
      id: "s1-first-90-days",
      n: 1,
      title: "First 90 days as a new manager",
      blurb:
        "Four habits that distinguish a manager-who-leads from a manager-who-hovers — delegation, upward status, hiring loops, and knowing when to coach versus when to course-correct.",
      concepts: [
        {
          id: "c1-1-delegation",
          code: "C1.1",
          title: "Delegation — tasks vs outcomes",
          lesson: {
            status: "ready",
            paragraphs: [
              "There are two ways to delegate: by task ('write a draft of the Q3 plan by Friday') and by outcome ('we need a Q3 plan the team can rally behind; you own it'). New managers default to task-delegation because it feels safer; experienced managers delegate outcomes whenever the IC has enough context to choose the path.",
              "The trade-off: outcome-delegation builds judgement but loses you the ability to predict the exact deliverable; task-delegation predicts the deliverable but doesn't build judgement. For people you're growing, lean outcome. For deadline-critical / low-risk-of-wrong-path work, task is fine.",
              "Never delegate the responsibility without delegating the authority to make the supporting decisions. \"Own the Q3 plan, but check every call with me\" is fake delegation — and your IC will read it as distrust, even when you meant it as caution.",
            ],
            keyPoints: [
              "Task = predictable deliverable, no judgement growth.",
              "Outcome = judgement growth, less predictable path.",
              "Authority moves with responsibility, or it isn't delegation.",
            ],
            pitfalls: [
              "Outcome-delegating to someone without enough context — sets them up to fail.",
              "Keeping decision authority while assigning the work; reads as distrust.",
            ],
            simplified: {
              oneLiner:
                "Delegate outcomes when growing people; delegate tasks when the deadline owns you.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You assigned your senior IC to 'own the new-hire onboarding redesign'. Three weeks in, they bring you a structured proposal that takes a different shape than you'd have chosen. What do you do?",
                options: {
                  A: "Override with your version — you have more context.",
                  B: "Engage with the proposal's logic; redirect only on things you can name an explicit principle for.",
                  C: "Take it back and assign it to someone more aligned.",
                  D: "Approve it without reading to avoid confrontation.",
                },
                correct: "B",
                principle:
                  "Outcome-delegation means trusting the path you didn't choose. Redirect on principles, not preferences.",
              },
            ],
          },
        },

        {
          id: "c1-2-status-up",
          code: "C1.2",
          title: "Writing manager status updates (upward)",
          lesson: {
            status: "ready",
            paragraphs: [
              "Your skip-level reads ~30 status updates a week. The ones they engage with are short, signal where help is needed, and never bury the lede. Your update is not a status of your team's work — it's a status of *your* judgement-calls and where they could go wrong.",
              "Three sections: (1) what we shipped + why it mattered (one or two outcomes, not a feature list); (2) the one call I made this week I'm least certain about + why I made it that way; (3) the help I need from you that I can't get elsewhere.",
              "Resist the urge to launder bad news through the team's quotes. 'Anita feels we're slipping on the deadline' is worse than 'we're going to miss the Sep 1 deadline by two weeks; here's my proposal to recover or descope.'",
            ],
            keyPoints: [
              "Skip-level is sampling your judgement, not auditing your team's tickets.",
              "Lead with one uncertain call you made + the reasoning.",
              "Own bad news; don't launder it through ICs' voices.",
            ],
            pitfalls: [
              "Long ticket dumps; the signal drowns in the list.",
              "Hiding the uncertain call so the update feels confident.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Your skip-level asked for weekly status. What belongs in week 2?",
                options: {
                  A: "A bulleted list of every ticket the team closed.",
                  B: "Two outcomes shipped, one uncertain call I made, one help-ask I can only get from them.",
                  C: "An apology for not having more to report.",
                  D: "A copy of the team's stand-up notes.",
                },
                correct: "B",
                principle:
                  "Upward updates surface judgement-calls and help-asks; ticket lists obscure both.",
              },
            ],
          },
        },

        {
          id: "c1-3-hiring",
          code: "C1.3",
          title: "Running a hiring loop you'd want to be in",
          lesson: {
            status: "ready",
            paragraphs: [
              "Before posting the role, write the bar: the three capabilities a successful hire must demonstrate, with a single canonical signal each. Without an explicit bar, every interviewer applies their own and your loop has random noise.",
              "Calibrate interviewers before they meet candidates — ideally with a one-hour session per role using a sample transcript or case. Without calibration, the strongest signal in your hire/no-hire data is which interviewer scored, not the candidate's actual fit.",
              "Debrief structure: each interviewer states their hire / no-hire / strong-no-hire vote and the strongest evidence first; discussion second. Doing it the other way round lets the loudest voice anchor everyone else.",
            ],
            keyPoints: [
              "Write the bar before posting: three capabilities + one canonical signal each.",
              "Calibrate interviewers per role; un-calibrated loops measure the interviewer, not the candidate.",
              "Debrief votes first, then discussion — anchors hurt accuracy.",
            ],
            pitfalls: [
              "Posting before you've named the bar.",
              "Letting the loudest interviewer speak first in debrief.",
              "Hiring on 'culture fit' without operationalising what that means for this role.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "In a debrief, who should state their vote + evidence first?",
                options: {
                  A: "The hiring manager — they have the most context.",
                  B: "The most senior person in the room.",
                  C: "Every interviewer states vote + evidence before discussion opens.",
                  D: "Whoever is least sure — they should be heard first.",
                },
                correct: "C",
                principle:
                  "Votes-before-discussion blocks the anchoring effect that distorts panel decisions.",
              },
            ],
          },
        },

        {
          id: "c1-4-coach-vs-correct",
          code: "C1.4",
          title: "When to coach vs when to course-correct",
          lesson: {
            status: "ready",
            paragraphs: [
              "Coach when the IC has the capability but is making sub-optimal choices — your role is to ask questions that help them see what you see. Course-correct when the IC is heading toward a near-term outcome you can't accept — your role is to name the problem directly, name the change you need, and reserve coaching for after.",
              "The mistake new managers make: defaulting to coaching for everything because it feels less confrontational. Coaching a fire is malpractice — the building burns while you Socratic-method the IC.",
              "The mistake experienced managers sometimes make: defaulting to course-correcting because it's faster. The IC stops bringing the early-warning signals because they know each one becomes a directive. You lose the surface area to coach.",
              "A simple test: if the cost of being wrong is small + recoverable, coach. If it's large or irreversible (customer impact, security incident, hire-mistake), course-correct now, coach later in the 1:1.",
            ],
            keyPoints: [
              "Coach: capability + sub-optimal choice + recoverable cost.",
              "Course-correct: high-cost or irreversible + immediate need.",
              "Default to coaching is malpractice for fires; default to correcting kills coaching surface.",
            ],
            pitfalls: [
              "Socratic-method during a customer-impacting incident.",
              "Correcting low-stakes calls so often the IC stops bringing them up.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Your IC is about to send a tone-deaf customer email an hour before a major escalation call. What do you do?",
                options: {
                  A: "Ask a Socratic question about how the customer might receive it.",
                  B: "Course-correct: name the problem, propose an alternative now; coach on the pattern in your next 1:1.",
                  C: "Let them send it and learn from the fallout.",
                  D: "Rewrite it without telling them.",
                },
                correct: "B",
                principle:
                  "High-cost + immediate → course-correct now, coach on the pattern later.",
              },
            ],
          },
        },
      ],
      sectionTest: {
        passPct: 0.75,
        questions: [
          {
            n: 1,
            question:
              "Which is closer to outcome-delegation than task-delegation?",
            options: {
              A: "'Draft the Q3 plan by Friday.'",
              B: "'Own the Q3 plan we present to the team next week; you have my support.'",
              C: "'Use this template, fill in section 3.'",
              D: "'Mail the existing plan to the team.'",
            },
            correct: "B",
            principle:
              "Outcome-delegation names the result + authority; task-delegation names the artefact.",
          },
          {
            n: 2,
            question:
              "Which is the strongest single fix for noisy hiring loops?",
            options: {
              A: "Add more interviewers.",
              B: "Write the bar (capabilities + canonical signal) and calibrate interviewers before the role opens.",
              C: "Use gut feel — bias is reduced if everyone uses the same heuristic.",
              D: "Skip the debrief.",
            },
            correct: "B",
            principle:
              "Calibration against an explicit bar collapses interviewer-variance noise.",
          },
          {
            n: 3,
            question:
              "Your IC is escalating a customer issue badly, in real time. Coach or course-correct?",
            options: {
              A: "Coach — they'll learn more.",
              B: "Course-correct now; coach the pattern in the next 1:1.",
              C: "Withdraw from the call and let them handle it.",
              D: "Fire them.",
            },
            correct: "B",
            principle:
              "High-cost + immediate → correct now, coach later.",
          },
          {
            n: 4,
            question:
              "True or false: upward status updates should consist mainly of a list of every ticket your team closed last week.",
            kind: "true-false",
            correct: false,
            explanationTrue:
              "Wrong — ticket lists drown the signal. Skip-levels sample your judgement, not your backlog.",
            explanationFalse:
              "Right — surface outcomes + the uncertain calls + help-asks. Lists are the failure mode.",
            principle:
              "Upward updates sample judgement, not ticket throughput.",
          },
        ],
      },
    },
  ],
};
