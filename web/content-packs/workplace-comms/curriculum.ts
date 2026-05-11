import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    {
      id: "s1-async-1on1s",
      n: 1,
      title: "Communicating async + running 1:1s",
      blurb:
        "Four high-leverage habits — when to skip the meeting, how to write a status update that doesn't need one, how a 1:1 earns its slot, and how to give feedback that actually changes behaviour.",
      concepts: [
        {
          id: "c1-1-async-vs-sync",
          code: "C1.1",
          title: "Async vs sync — when to use which",
          lesson: {
            status: "ready",
            paragraphs: [
              "Pick async when the response can wait a few hours, the audience is more than three, or the topic benefits from people thinking in writing. Pick sync when the topic is high-stakes, requires back-and-forth iteration, or involves an interpersonal moment (feedback, conflict, recognition).",
              "Defaulting to sync (meetings) for everything is the dominant failure mode. Defaulting to async for everything is the equal-and-opposite failure mode — async feedback delivered without warmth lands as cold; async conflict festers without a real-time pressure-valve.",
              "Practical heuristic: write the message async first. If you find yourself writing 'I think it'd be easier to chat about this', that's the moment to schedule the sync — but with a written agenda derived from the draft you just wrote.",
            ],
            keyPoints: [
              "Async-default for status, plans, decisions with > 3 readers.",
              "Sync-default for feedback, conflict, recognition, ambiguous topics.",
              "Write async first; promote to sync when you can't finish the message.",
            ],
            pitfalls: [
              "Calling a 'quick sync' for what could have been a 5-sentence message.",
              "Delivering hard feedback async — the words land flatter than intended.",
            ],
            simplified: {
              oneLiner: "Async by default; sync for the human moments.",
            },
            // Ear-first narration of the same lesson, used by the TTS
            // control. Reads more naturally aloud than the visual body.
            audioTranscript:
              "Here's the rule of thumb. Default to writing things down — async — when the response can wait, when more than three people need to weigh in, or when the topic gets better with thinking time. Default to a meeting — sync — when the topic is high-stakes, when there's real back-and-forth in the room, or when there's an interpersonal moment at play: feedback, conflict, recognition. The most common failure mode is over-meeting. The equal-and-opposite failure mode is over-writing — async feedback can feel cold, and async conflict festers. The practical trick: write the message async first. The moment you catch yourself writing 'I think we should just chat about this' is the moment to book the meeting — but only after you've written the agenda you would have written anyway.",
            imageDescriptions: [
              {
                ref: "async-sync-quadrant",
                description:
                  "A two-by-two quadrant labelled 'audience size' on the horizontal axis and 'stakes' on the vertical. The top-right cell (large audience, high stakes) is shaded as async-with-sync-decision; the top-left (small audience, high stakes) sits squarely in the sync column; the bottom-left (small audience, low stakes) is informal sync; the bottom-right (large audience, low stakes) is pure async.",
              },
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Your team needs to decide on a new on-call rotation. Six people, one timezone overlap window. Async or sync?",
                options: {
                  A: "Sync — too many people for async to converge.",
                  B: "Async — write the proposal, collect comments, decide.",
                  C: "Skip it — let on-call sort itself.",
                  D: "Vote in a poll without context.",
                },
                correct: "B",
                principle:
                  "Multi-person decisions with reasoning benefit from async drafting; sync converges faster on top of an async draft.",
              },
            ],
          },
        },

        {
          id: "c1-2-status-updates",
          code: "C1.2",
          title: "Writing a status update that doesn't need a meeting",
          lesson: {
            status: "ready",
            paragraphs: [
              "A useful status update has three parts in order: what shipped (outcome, not activity), what's blocked (specific blocker + who you need help from), one thing you're doing differently next week (continuous improvement). Three sentences each, max.",
              "What kills status updates: activity lists ('worked on auth, fixed bugs, attended meetings'), apologies for low output, and vague help-asks ('any thoughts?'). Each of these makes your manager schedule a clarification call you could have avoided.",
              "Manager-side: read every update before the team meeting; ask clarifying questions in the doc, not in the meeting. The meeting is for blockers that couldn't be unblocked async.",
            ],
            keyPoints: [
              "Three sentences: shipped (outcome), blocked (specific + who), one improvement.",
              "Outcomes beat activities. 'Shipped login fix' beats 'worked on auth'.",
              "Specific help-asks unblock; vague ones invite another meeting.",
            ],
            examples: [
              {
                title: "A passing status update",
                body:
                  "\"Shipped login fix; cohort dashboard scoped (link). Blocked Friday on staging creds — Anita unblocked me Mon AM. Next week: batch creds requests Thu so block doesn't repeat.\"",
              },
            ],
            pitfalls: [
              "Activity-only updates that force a clarification call.",
              "Apologising for honest output; manager loses the signal of where to help.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Which sentence is missing from this update? \"Shipped onboarding flow v2. Blocked Wed on the Stripe webhook docs.\"",
                options: {
                  A: "An apology for being blocked.",
                  B: "One thing you're doing differently next week.",
                  C: "A list of activities.",
                  D: "A self-assessment score.",
                },
                correct: "B",
                principle:
                  "Status updates close the loop with a continuous-improvement sentence; without it the manager has no signal about whether the block will repeat.",
              },
            ],
          },
        },

        {
          id: "c1-3-1on1s",
          code: "C1.3",
          title: "Running a productive 1:1 — IC + manager view",
          lesson: {
            status: "ready",
            paragraphs: [
              "A 1:1 is not a status meeting (your written update covers that). It's for: topics the IC wants to raise, career trajectory, feedback in both directions, and one cross-functional question that needs the manager's reach. Shared agenda doc owned by the IC, edited by both, last 5 minutes left blank for the unplanned topic that always emerges.",
              "Cancel-able? Only by the IC, not by the manager. Manager-cancelled 1:1s communicate that the manager's calendar matters more than the IC's growth — even when that wasn't the intent.",
              "End with explicit action items: who owns what, by when. No 'we should look into that' — that's a euphemism for 'this won't happen'. Either someone owns it with a date, or the meeting decided not to do it.",
            ],
            keyPoints: [
              "1:1 ≠ status meeting. Agenda owned by the IC.",
              "Manager doesn't cancel; signal cost is too high.",
              "End with named owners + dates, not 'we should look into that'.",
            ],
            pitfalls: [
              "Skipping a 1:1 because 'nothing to discuss' — the meeting is where you find the things.",
              "Manager dominating the agenda; the IC stops bringing topics.",
              "Action items that name no owner.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Your IC says 'I don't think we need our 1:1 this week, nothing pressing.' What's the best response?",
                options: {
                  A: "Cancel it. Saves both calendars.",
                  B: "Insist on the meeting; force a topic.",
                  C: "Keep it but make it shorter; tell them you'll bring one topic you want their take on.",
                  D: "Reschedule to next month.",
                },
                correct: "C",
                principle:
                  "Skipping 1:1s ratchets one-way; keep the slot but reduce friction. The meeting is where surface topics emerge that look pressing only in hindsight.",
              },
            ],
          },
        },

        {
          id: "c1-4-feedback",
          code: "C1.4",
          title: "Giving feedback that lands",
          lesson: {
            status: "ready",
            paragraphs: [
              "Feedback that lands is specific, timely, and tied to an observable behaviour, not an inferred trait. 'You interrupted Anita three times in the standup' is feedback; 'you're dismissive' is character-attack dressed as feedback.",
              "Use SBI (Situation–Behaviour–Impact) for delivery: name the situation, the observed behaviour, and the impact you saw. Avoid 'feedback sandwiches' — burying the message between two compliments dilutes it and trains people to brace for the middle of every sentence.",
              "Bidirectional: ask the IC for feedback at the end of every 1:1. The first three times you'll get 'no notes'; the fourth time you'll get something real if you've made the channel safe.",
            ],
            keyPoints: [
              "Specific + observable + timely. Trait labels are not feedback.",
              "SBI: Situation, Behaviour, Impact. No compliment sandwich.",
              "Ask for feedback up the chain every 1:1; safety is built by repetition.",
            ],
            pitfalls: [
              "Trait-attacks dressed as feedback ('you're not detail-oriented').",
              "Feedback delayed by weeks; the receiver no longer remembers the moment.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Which of these is feedback?",
                options: {
                  A: "'You're not a team player.'",
                  B: "'In yesterday's standup you interrupted Anita three times before she finished her update.'",
                  C: "'I just have a feeling about your attitude lately.'",
                  D: "'You should be more collaborative.'",
                },
                correct: "B",
                principle:
                  "Specific + observable + timely. Trait labels are inferences, not feedback.",
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
              "Which is the strongest default communication mode for a six-person decision on next quarter's roadmap?",
            options: {
              A: "Sync meeting — too many people for async.",
              B: "Async writeup with comment thread; promote to sync only if not converging.",
              C: "Email blast, no discussion.",
              D: "Decide privately and announce.",
            },
            correct: "B",
            principle: "Async-default for multi-person decisions with reasoning.",
          },
          {
            n: 2,
            question:
              "Which three parts make a useful status update?",
            options: {
              A: "Activities, hours, mood.",
              B: "Outcomes shipped, specific blocker + helper, one improvement next week.",
              C: "An apology, an excuse, a vow.",
              D: "Calendar dump.",
            },
            correct: "B",
            principle: "Outcomes + blockers + improvement — the three-sentence shape.",
          },
          {
            n: 3,
            question:
              "Who owns the 1:1 agenda by default?",
            options: {
              A: "The manager.",
              B: "The IC.",
              C: "HR.",
              D: "Whoever booked the meeting.",
            },
            correct: "B",
            principle:
              "1:1s are the IC's meeting; agenda ownership signals whose growth the slot is for.",
          },
          {
            n: 4,
            question:
              "True or false: a 'feedback sandwich' — compliment, criticism, compliment — is the recommended delivery for hard feedback.",
            kind: "true-false",
            correct: false,
            explanationTrue:
              "Wrong — sandwiches dilute the message and train people to brace for the middle of every sentence.",
            explanationFalse:
              "Right — name the behaviour and the impact directly. Specific beats softened.",
            principle:
              "Specific + observable + impact-named beats compliment-sandwiched.",
          },
        ],
      },
    },
  ],
};
