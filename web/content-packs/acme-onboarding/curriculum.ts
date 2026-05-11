/* ------------------------------------------------------------------
   Acme Onboarding curriculum — B2B demo content.

   Teaches a fictional but realistic company-specific workflow:
   how new employees at "Acme Co." log their hours and send the
   weekly summary to their manager. One section, four concepts,
   one section test. No mock exam — small-pack demo.

   Tone notes:
   - Concrete company tool name ("AcmeTime") — placeholder for a
     real customer's tool (Workday, Replicon, Harvest, etc.).
   - Each lesson names the SME-defined success criterion at the
     top, in line with the backward-design discipline surfaced
     by the umbrella learning-goal capture on `/`.
   - Pitfalls are real rookie mistakes a manager would call out
     in the first month, not generic time-tracking advice.
------------------------------------------------------------------ */

import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    {
      id: "s1-log-hours",
      n: 1,
      title: "Logging hours to your manager",
      blurb:
        "Acme's weekly time-logging workflow, end-to-end. Pass this section before your second Monday on the team and you'll never miss a payroll cut-off.",
      concepts: [
        {
          id: "c1-1-when",
          code: "C1.1",
          title: "When to log — the Acme weekly rhythm",
          lesson: {
            status: "ready",
            paragraphs: [
              "Acme runs a Monday-to-Sunday work week and payroll cuts off at 17:00 every Monday for the previous week. Log your hours daily as you finish each block of work — do not wait until Friday or, worse, Monday morning.",
              "Daily logging is policy, not preference. The L&D research backing it: time-tracking accuracy drops by ~25% per day delayed (Acme Engineering Productivity audit, 2025). A Monday-morning catch-up costs your manager an hour of clarifying questions and risks a missed payroll cut-off.",
              "If you genuinely cannot log on a working day (sickness, deep-focus block, customer crisis), the same-day catch-up by 22:00 is acceptable. Anything older than 24 hours requires a one-line note in the entry explaining the gap.",
            ],
            keyPoints: [
              "Acme week = Monday 00:00 → Sunday 23:59.",
              "Payroll cut-off = Monday 17:00 for the *previous* week.",
              "Log daily; same-day catch-up acceptable; >24h late needs a note.",
            ],
            pitfalls: [
              "Logging the whole week on Monday morning. Manager has to clarify, payroll risks slipping.",
              "Backdating without a note. Auto-flagged in the L&D dashboard; manager has to ask.",
            ],
            simplified: {
              oneLiner: "Log every day. Payroll closes Monday 17:00.",
              paragraphs: [
                "Each work day, before you log off, open AcmeTime and enter your hours. Sunday night the timesheet auto-submits. Monday 17:00 it's locked.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "It's Monday 10:00. You realise you forgot to log Thursday and Friday of last week. What's the first thing you do?",
                options: {
                  A: "Skip it — payroll won't notice two days.",
                  B: "Log both days now, add a one-line note explaining the gap, message your manager.",
                  C: "Wait until Tuesday so it doesn't show up in this week's audit.",
                  D: "Email payroll directly with the hours and bypass AcmeTime.",
                },
                correct: "B",
                explanations: {
                  A: "Payroll cuts at 17:00 today. Skipping it means unpaid hours for last week.",
                  B: "Correct — late entries are explicitly allowed if you add the gap note before the 17:00 cut-off. The manager message is a courtesy, not policy.",
                  C: "Tuesday is too late; last week's window is closed at 17:00 Monday.",
                  D: "Bypassing AcmeTime breaks the audit trail and creates a payroll reconciliation incident.",
                },
                principle:
                  "Late entries are allowed with a gap note before the 17:00 Monday cut-off.",
              },
              {
                n: 2,
                question:
                  "The Acme work week begins on which day?",
                options: {
                  A: "Sunday",
                  B: "Monday",
                  C: "Tuesday",
                  D: "Whatever day you started at Acme",
                },
                correct: "B",
                principle: "Acme week = Monday 00:00 → Sunday 23:59.",
              },
            ],
          },
        },

        {
          id: "c1-2-tool",
          code: "C1.2",
          title: "Using AcmeTime — entering an hour block",
          lesson: {
            status: "ready",
            paragraphs: [
              "All hours go through AcmeTime (internal: time.acme.local). Each entry has four required fields: date, hours (in 0.25 increments), project code, and a one-line description of what you did. SSO sign-in via your Acme Google account; no separate password.",
              "Project codes follow the format AC-XXXX (engineering) or OP-XXXX (operations). If you don't know your project code, ask your manager rather than guessing — wrong codes route the hours to the wrong cost centre and the entry has to be reversed by Finance.",
              "The one-line description is read by your manager weekly; it is not just for your records. Write the outcome (\"shipped login bug fix\") not the activity (\"worked on auth\"). Outcome-style descriptions cut clarification messages roughly in half.",
            ],
            keyPoints: [
              "Tool: time.acme.local — SSO via Google.",
              "Required: date, hours (0.25 step), project code (AC- or OP-), one-line outcome.",
              "Outcome-style descriptions beat activity-style descriptions.",
            ],
            examples: [
              {
                title: "Good description",
                body:
                  "\"AC-1042 — shipped fix for /login 500 errors; rolled out to prod 16:00.\"",
              },
              {
                title: "Avoid",
                body:
                  "\"AC-1042 — worked on bugs.\" Manager has to ask: which bug, did it ship, when?",
              },
            ],
            pitfalls: [
              "Guessing the project code. Wrong cost-centre means Finance reverses + re-enters the row, slow.",
              "Activity-only descriptions. They drive the weekly clarification ping that wastes 20+ minutes.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Which of these AcmeTime entries needs the least clarification from your manager?",
                options: {
                  A: "\"AC-1042 — auth.\"",
                  B: "\"AC-1042 — worked on the login bug today.\"",
                  C: "\"AC-1042 — shipped /login 500-error fix; deployed prod 16:00.\"",
                  D: "\"AC-1042 — engineering tasks.\"",
                },
                correct: "C",
                explanations: {
                  A: "One-word entries fail the one-line-description policy and trigger a clarification ping.",
                  B: "Activity-style — the manager still doesn't know if it shipped or what the outcome was.",
                  C: "Correct — names the deliverable + the outcome + a timestamp. No follow-up needed.",
                  D: "Too generic; could be any AC- row.",
                },
                principle:
                  "Outcome-style descriptions beat activity-style descriptions.",
              },
              {
                n: 2,
                question:
                  "Your project code is unknown. What's the right next step?",
                options: {
                  A: "Use AC-0000 as a placeholder until Finance corrects it.",
                  B: "Ask your manager for the right code; do not log against a guess.",
                  C: "Skip the entry and log double next time.",
                  D: "Use the previous week's code.",
                },
                correct: "B",
                principle:
                  "Project codes route cost; wrong codes cost the team a Finance reversal.",
              },
            ],
          },
        },

        {
          id: "c1-3-overtime",
          code: "C1.3",
          title: "Overtime, time-off, and edge cases",
          lesson: {
            status: "ready",
            paragraphs: [
              "Acme's standard week is 40 hours. Anything over 45 in a week is flagged for your manager — not because you're in trouble, but because sustained overtime is a process-failure signal the team needs to investigate. Log the hours honestly; do not under-report to avoid the flag.",
              "Public holidays go under the HOLIDAY-AC code at your normal daily hours. Personal time off (PTO) uses the PTO-AC code; sick leave uses SICK-AC. None of these need a project code — the time-off codes substitute for one.",
              "On-call rotations: log the on-call block as a single 24-hour entry per shift with code ONCALL-AC, then log any actual paged work as separate hourly entries against the relevant project code. Don't double-count.",
              "Travel: travel time during the business day counts. Travel outside business hours (your morning commute, a 22:00 flight) does not. Travel that overlaps both — log the in-hours portion only.",
            ],
            keyPoints: [
              "Standard week = 40h. Over 45h triggers a manager flag — log honestly anyway.",
              "Time-off codes: HOLIDAY-AC, PTO-AC, SICK-AC. No project code needed.",
              "On-call: one 24h block + separate paged-work entries — never double-count.",
              "Travel: only the portion overlapping business hours is logged.",
            ],
            pitfalls: [
              "Under-reporting overtime to avoid the >45h flag. Defeats the process-improvement signal.",
              "Double-counting on-call shift hours and paged-work hours.",
              "Logging full out-of-hours travel time.",
            ],
            simplified: {
              oneLiner:
                "Special days have their own codes; log honestly, don't double-count.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You worked a 24-hour on-call shift on Saturday and got paged twice — 1 hour at 02:00 fixing a database alert, 30 min at 14:00 on an alert that turned out to be noise. How do you log it?",
                options: {
                  A: "One 24-hour entry under ONCALL-AC; that covers everything.",
                  B: "Just the 1.5 hours of actual paged work against the project; don't log the on-call shift itself.",
                  C: "One 24-hour ONCALL-AC entry, plus a separate 1h entry against the database project, plus a separate 0.5h entry against the noise alert's project.",
                  D: "Double the paged-work hours since it was after-hours.",
                },
                correct: "C",
                explanations: {
                  A: "On-call shift alone misses the paged-work hours that bill to projects.",
                  B: "On-call shifts are themselves billable — you need the shift entry too.",
                  C: "Correct — shift entry + paged work entries separately; no double-count.",
                  D: "Overtime multipliers are payroll's job, not yours. Log honest hours.",
                },
                principle:
                  "On-call = shift entry + paged-work entries, never one rolled-up number.",
              },
              {
                n: 2,
                question:
                  "You worked 47 hours this week. What should you log?",
                options: {
                  A: "40 — anything more triggers a flag and isn't worth the conversation.",
                  B: "45 — that's the cap before the flag.",
                  C: "47, honestly. The flag is a process-improvement signal, not a penalty.",
                  D: "Split the extra 7 across next week.",
                },
                correct: "C",
                principle:
                  "Honest overtime logging is the input to fixing chronic overload — under-reporting hides the signal.",
              },
            ],
          },
        },

        {
          id: "c1-4-summary",
          code: "C1.4",
          title: "Sending the weekly summary to your manager",
          lesson: {
            status: "ready",
            paragraphs: [
              "Every Sunday at 18:00, AcmeTime auto-generates your weekly summary and drops it into your draft Slack DMs to your manager. The summary is your draft, not the final message — you are expected to review, edit, and send by Monday 09:00.",
              "What to add before sending: any context the line-items don't carry (e.g. \"deep-focus Wednesday is why the hours look light on Tuesday\"), any blockers you hit, and one thing you want to do differently next week. Three sentences total is the standard.",
              "What not to add: an apology for low hours (your hours are honest — if they're low there's a reason worth discussing), or a wall-of-text retrospective (that's what 1:1s are for).",
              "Once sent, the timesheet auto-submits for payroll. You cannot edit it after Monday 17:00 without manager + payroll approval, so use the 09:00–17:00 window on Monday morning to spot-check totals one last time.",
            ],
            keyPoints: [
              "AcmeTime drafts your weekly summary Sunday 18:00 — review and send by Monday 09:00.",
              "Add: context, blockers, one thing you'd do differently. ~3 sentences.",
              "Skip: apologies for low hours, long retros.",
              "After Monday 17:00 the timesheet locks — edits need manager + payroll approval.",
            ],
            examples: [
              {
                title: "A passing weekly summary",
                body:
                  "\"40h across AC-1042 (login fix shipped) and AC-1051 (started cohort dashboard). Wednesday was a deep-focus day so Tuesday hours look light by comparison. Blocked Friday afternoon by missing staging creds — Eve unblocked me Monday 09:00. Next week I'll batch the staging-creds requests so the block doesn't repeat.\"",
              },
            ],
            pitfalls: [
              "Sending an unedited auto-draft. Manager has to ask what context the numbers miss.",
              "Apologising for low hours when there's a real reason. Wastes your manager's time.",
              "Trying to edit after the 17:00 lock without escalating.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "When does AcmeTime auto-draft your weekly summary, and by when must you send the reviewed version to your manager?",
                options: {
                  A: "Draft: Friday 17:00. Send: Friday 18:00.",
                  B: "Draft: Sunday 18:00. Send: Monday 09:00.",
                  C: "Draft: Monday 09:00. Send: Monday 17:00.",
                  D: "There's no auto-draft; you write it from scratch.",
                },
                correct: "B",
                principle:
                  "Sunday-evening draft → Monday-morning send keeps the manager's review window before payroll cut-off.",
              },
              {
                n: 2,
                question:
                  "Which of these is NOT in the three-sentence summary template?",
                options: {
                  A: "Context that the line-items don't carry.",
                  B: "Any blockers from the week.",
                  C: "One thing you'd do differently next week.",
                  D: "A line apologising for hours that came in low.",
                },
                correct: "D",
                principle:
                  "Apologies for honest hours waste the manager's review time; the summary is for context, not contrition.",
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
              "When is the Acme payroll cut-off for the previous week?",
            options: {
              A: "Friday 17:00",
              B: "Sunday 23:59",
              C: "Monday 09:00",
              D: "Monday 17:00",
            },
            correct: "D",
            principle: "Monday 17:00 — after that the previous week is locked.",
          },
          {
            n: 2,
            question:
              "You logged your hours against the wrong project code. What's the correct next step?",
            options: {
              A: "Leave it — Finance will catch it eventually.",
              B: "Edit the entry in AcmeTime; project codes can be fixed up to the Monday 17:00 lock.",
              C: "Delete the entry and re-create it from scratch under the right code.",
              D: "Message payroll to manually reroute the hours.",
            },
            correct: "B",
            principle:
              "Edit-before-lock is the cheap path; deletes and payroll messages add reversal work.",
          },
          {
            n: 3,
            question:
              "Which weekly-summary entry is best?",
            options: {
              A: "\"Worked a lot this week, sorry the hours are low.\"",
              B: "\"40h across AC-1042 and AC-1051; Wed deep-focus explains the Tuesday dip; staging-creds block on Fri (unblocked Mon); next week I'll batch creds requests.\"",
              C: "\"All good, see AcmeTime.\"",
              D: "\"Full retrospective on the project history attached — pls read the 4-page doc.\"",
            },
            correct: "B",
            principle:
              "Three sentences = context + blockers + one improvement. No apologies, no walls of text.",
          },
          {
            n: 4,
            question:
              "True or false: you should under-report a 47-hour week to avoid triggering the manager overtime flag.",
            kind: "true-false",
            correct: false,
            explanationTrue:
              "Wrong — the flag is a process-improvement signal. Under-reporting hides chronic overload from the team that can fix it.",
            explanationFalse:
              "Right — log honestly. The flag is how Acme catches teams that need more headcount, not a personal penalty.",
            principle:
              "Honest overtime logging is an input to fixing overload — never a target to dodge.",
          },
        ],
      },
    },
  ],
};
