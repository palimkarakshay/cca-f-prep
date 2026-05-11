import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    {
      id: "s1-security-basics",
      n: 1,
      title: "Security awareness fundamentals",
      blurb:
        "Four habits that block 80% of incidents — recognising phishing fast, password + MFA hygiene, knowing what data goes where, and reporting suspected incidents the right way.",
      concepts: [
        {
          id: "c1-1-phishing",
          code: "C1.1",
          title: "Recognising phishing in 30 seconds",
          lesson: {
            status: "ready",
            paragraphs: [
              "Most phishing fails one of four checks: the sender domain doesn't match the brand (e.g. it claims to be from your bank but the domain is bank-secure-portal.com); the urgency is artificial (\"act in the next 4 hours\"); the link target on hover doesn't match the visible text; or the request asks for credentials, payment details, or to forward an MFA code.",
              "Run the 30-second triage: (1) check the sender domain character-by-character; (2) hover the link and read the actual target; (3) ask yourself whether the email pressures you to skip verification. If any of the three fails, do not click and do not reply.",
              "Spear-phishing — the targeted variant — gets the sender domain right by spoofing or compromising a real account. The remaining tells are: unexpected channel for the topic (CFO asking for gift cards via email is the canonical example), and any \"please don't loop in finance/legal\" preamble.",
            ],
            keyPoints: [
              "Four checks: sender domain · urgency · link target · credential ask.",
              "Hover before you click; type domains by hand if uncertain.",
              "Wire-transfer / gift-card / MFA-code asks → call the person on a known number.",
            ],
            pitfalls: [
              "Clicking 'unsubscribe' on a phishing email — it confirms your address is live.",
              "Replying with 'Is this legit?' — same problem.",
            ],
            simplified: {
              oneLiner:
                "Slow down. Domain, link target, urgency, ask — check all four.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "An email \"from your CFO\" asks you to buy $500 of gift cards for client gifts and reply with the codes. Reply-to address is gmail.com. What do you do?",
                options: {
                  A: "Buy them and reply, your CFO probably needs them fast.",
                  B: "Forward the email to IT and reach the CFO via Slack or phone before doing anything.",
                  C: "Reply asking 'is this legit?' — saves time.",
                  D: "Ignore the email and don't mention it.",
                },
                correct: "B",
                explanations: {
                  A: "Classic gift-card phish. Never act on urgent finance requests in an unexpected channel.",
                  B: "Correct — verify on a known channel (not by replying) and route to IT so they can warn other targets.",
                  C: "A reply confirms your address is live and may even get a follow-up phish.",
                  D: "Ignoring it leaves IT blind to a campaign that's likely hitting others too.",
                },
                principle:
                  "Verify urgent finance asks on a known channel; report to IT so the campaign can be blocked org-wide.",
              },
            ],
          },
        },

        {
          id: "c1-2-passwords-mfa",
          code: "C1.2",
          title: "Password hygiene + MFA",
          lesson: {
            status: "ready",
            paragraphs: [
              "Use a password manager for every account, generate unique high-entropy passwords (16+ chars, random), and never reuse them. The dominant breach vector for individuals is credential stuffing — attackers replay a password leaked in one breach against every other account that might share it.",
              "MFA: prefer authenticator app or hardware key over SMS. SMS MFA is better than no MFA but is vulnerable to SIM-swap. Hardware keys (FIDO2/WebAuthn) are the gold standard because they bind the credential to the origin and resist phishing.",
              "Never share an MFA code. If someone — even \"IT\" — calls and asks you to read your code aloud, the call is the attack. Legitimate support will never ask for the code; legitimate password resets never require it from another person.",
            ],
            keyPoints: [
              "Password manager + unique random passwords for every account.",
              "MFA via app or hardware key; SMS only as last resort.",
              "Never read an MFA code aloud or paste it into an unfamiliar form.",
            ],
            pitfalls: [
              "Reusing 'just one' password — the one most likely to be in a breach dump.",
              "Approving an MFA prompt you didn't initiate ('MFA fatigue' attack).",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Your phone buzzes with an MFA approval prompt — but you didn't just log in anywhere. The prompts keep coming. What's happening + what do you do?",
                options: {
                  A: "Approve one to make them stop.",
                  B: "Someone has your password and is trying MFA-fatigue. Deny all, change the password immediately, alert IT.",
                  C: "Approve a prompt; the system is probably just confused.",
                  D: "Ignore and turn off MFA so it stops bothering you.",
                },
                correct: "B",
                principle:
                  "Unprompted MFA = the attacker already has your password. Deny, rotate the password, escalate.",
              },
            ],
          },
        },

        {
          id: "c1-3-data-tiers",
          code: "C1.3",
          title: "Data tiers — public, internal, confidential, restricted",
          lesson: {
            status: "ready",
            paragraphs: [
              "Most companies classify data into four tiers. Public: anyone can see it (marketing material). Internal: anyone employed can see it (handbook, org chart). Confidential: limited audience (financials before earnings, customer lists). Restricted: smallest necessary audience (PII at scale, credentials, secrets, source code for some companies).",
              "The tier determines where the data is allowed to live. Public + Internal can usually go in shared drives, public docs, Slack. Confidential needs access-controlled folders + named recipients. Restricted needs encrypted-at-rest storage, named-recipient access logs, and a default 'no copy' rule.",
              "When in doubt, ask. The cost of asking is a five-minute conversation; the cost of mis-classifying restricted data is a compliance incident your manager + security + legal all have to spend hours on.",
            ],
            keyPoints: [
              "Four tiers: Public · Internal · Confidential · Restricted.",
              "Tier determines storage + sharing — match the rule to the tier.",
              "When unsure, ask before sending. Asking is cheap; rework is not.",
            ],
            examples: [
              {
                title: "Tier examples",
                body:
                  "Public: company logo. Internal: handbook. Confidential: pre-earnings revenue. Restricted: customer PII, prod credentials.",
              },
            ],
            pitfalls: [
              "Putting customer PII in a personal Drive folder to 'work on it later'.",
              "Pasting Restricted data into a chat with an external partner.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "A customer support ticket includes the customer's full name + email + last 4 of their card. Which tier?",
                options: {
                  A: "Public — they gave it to us.",
                  B: "Internal.",
                  C: "Confidential at minimum, often Restricted depending on company policy.",
                  D: "Doesn't need classification.",
                },
                correct: "C",
                principle:
                  "Customer PII is always at least Confidential; combined with card data, most policies escalate to Restricted.",
              },
            ],
          },
        },

        {
          id: "c1-4-incident-report",
          code: "C1.4",
          title: "Reporting a suspected incident",
          lesson: {
            status: "ready",
            paragraphs: [
              "If you suspect an incident — clicked a phishing link, mis-shared restricted data, lost a device, saw something off in a colleague's account — report it immediately. The incident-response (IR) team would rather get five false alarms than one delayed real one. Reporting fast is the most important habit in security; investigating is their job.",
              "How to report: use the documented channel (typically a #security-incident Slack channel, security@ alias, or hotline — your policy specifies which). Include what happened, when, what data may be involved, and your contact info. Do not start investigating yourself — preserving the evidence matters more than your guess about whether it's real.",
              "What not to do: don't forward the suspicious email widely ('FYI all'), don't try to log in again, don't delete anything. If you clicked a link, isolate the device by disconnecting from the network and wait for IR to triage.",
            ],
            keyPoints: [
              "Report fast; IR prefers false alarms to delayed real reports.",
              "Use the documented channel; include what + when + data + your contact.",
              "Don't investigate or delete; preserve evidence for IR.",
            ],
            pitfalls: [
              "Forwarding the phish to your whole team to 'warn them'.",
              "Hours of guilt before reporting — by which time the attacker has moved.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You realise the link you clicked an hour ago was a phish. You're now in a tense team meeting. What do you do?",
                options: {
                  A: "Wait until the meeting ends; mention it tomorrow.",
                  B: "Send a quick message in the #security-incident channel right now with what happened + when, then return to the meeting.",
                  C: "Try logging into all your accounts to check.",
                  D: "Tell only your manager and ask them to handle it.",
                },
                correct: "B",
                principle:
                  "Report fast in the documented channel; preservation matters more than personal investigation.",
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
              "Which is the strongest single MFA factor?",
            options: {
              A: "SMS one-time code.",
              B: "Email magic link.",
              C: "Authenticator app or hardware key (FIDO2 / WebAuthn).",
              D: "Security questions.",
            },
            correct: "C",
            principle:
              "Hardware keys + WebAuthn bind credentials to the origin; phishing-resistant by design.",
          },
          {
            n: 2,
            question:
              "An unexpected wire-transfer request 'from the CEO' arrives via email. The reply-to address is a gmail.com. What do you do?",
            options: {
              A: "Process it — the CEO probably knows.",
              B: "Verify on a known channel before any action; loop in IT.",
              C: "Reply asking 'is this legit?'.",
              D: "Forward to your team to warn them.",
            },
            correct: "B",
            principle:
              "Verify on a known channel; never reply or forward widely.",
          },
          {
            n: 3,
            question:
              "You've spotted what looks like a phish you already clicked. What's the right first move?",
            options: {
              A: "Try to log in again to confirm.",
              B: "Report via the documented channel immediately; disconnect from network if you can.",
              C: "Delete the email and hope.",
              D: "Email your team to warn them.",
            },
            correct: "B",
            principle:
              "Report fast + preserve evidence > investigate yourself.",
          },
          {
            n: 4,
            question:
              "True or false: customer PII can sit in a personal cloud drive folder while you're working on a one-off support ticket.",
            kind: "true-false",
            correct: false,
            explanationTrue:
              "Wrong — PII is Confidential at minimum and lives only in access-controlled, logged storage.",
            explanationFalse:
              "Right — PII never lives in personal storage, even temporarily.",
            principle:
              "Tier-driven storage rules are non-negotiable; personal drives never hold customer PII.",
          },
        ],
      },
    },
  ],
};
