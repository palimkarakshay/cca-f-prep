/* ------------------------------------------------------------------
   French for English Speakers — curriculum.

   Five modules covering greetings, numbers/time, café & restaurant,
   asking for directions, and reading signs/notices. Two real-life
   scenarios as "final projects" (mock exams). No Bloom-taxonomy
   fields — the badge doesn't render for this pack.

   Pronunciation hints are written in plain English approximations,
   not IPA — the target learner has zero French and shouldn't have
   to decode phonetic symbols first.

   Quebec vs France differences are flagged inline when they're
   noticeable (vocabulary like "bienvenue" for "you're welcome",
   "déjeuner" meaning lunch vs breakfast, etc.).

   Shape documented in `web/src/content/curriculum-types.ts`.
------------------------------------------------------------------ */

import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    /* ============================================================
       Module 1 — Greetings and politeness
       ============================================================ */
    {
      id: "m1-greetings",
      n: 1,
      title: "Greetings and politeness",
      blurb:
        "Hello, goodbye, please and thank you — the four phrases you'll use a hundred times a day.",
      concepts: [
        {
          id: "c1-bonjour-bonsoir",
          code: "L1.1",
          title: "Bonjour, bonsoir, and the tu/vous split",
          lesson: {
            status: "ready",
            paragraphs: [
              "The most important French word you'll learn is bonjour (\"bohn-zhoor\"). It means hello — and culturally, it's also the price of admission. Walking into a shop or boulangerie without saying bonjour first is read as rude, even in tourist areas. Say it before you say anything else.",
              "After dark — roughly after 6 p.m. — switch to bonsoir (\"bohn-swahr\", good evening). For goodbye, use au revoir (\"oh ruh-vwahr\"). For an informal hi/bye between friends, salut (\"sah-loo\") works both ways, but only with people your age you already know — don't say it to a shopkeeper.",
              "French has two words for \"you\": tu (informal, singular) and vous (formal, or plural). As a beginner, default to vous with strangers, shopkeepers, officials, and anyone older than you. Wait for them to suggest tu (\"on peut se tutoyer\") before switching. In Quebec the threshold for tu is a little lower among adults — still default to vous and let context pull you down.",
            ],
            keyPoints: [
              "Always say bonjour before anything else when entering a shop or addressing a stranger.",
              "Bonjour by day, bonsoir from ~6 p.m. onward. Au revoir to leave; salut only with friends.",
              "Default to vous with anyone you don't know. Wait to be invited into tu.",
            ],
            simplified: {
              oneLiner:
                "Bonjour first, then your request. Au revoir to leave. Vous for strangers, tu for friends.",
              keyPoints: [
                "Bonjour = hello (during the day).",
                "Bonsoir = good evening (after dark).",
                "Au revoir = goodbye.",
                "Vous when in doubt.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You walk into a small bakery in Lyon at 10 a.m. What's the first thing you should say?",
                options: {
                  A: "Nothing — just point at what you want.",
                  B: "Bonjour.",
                  C: "Salut.",
                  D: "Bonsoir.",
                },
                correct: "B",
                explanations: {
                  A: "Skipping the greeting is read as rude in France, even in tourist contexts. The bonjour comes first.",
                  B: "Right — bonjour is the universal daytime greeting and an unwritten politeness requirement on entry.",
                  C: "Salut is for friends your own age, not for a shopkeeper you don't know.",
                  D: "Bonsoir is for the evening (roughly after 6 p.m.), not 10 a.m.",
                },
                principle: "Bonjour first; then your request. Skipping it reads as rude.",
              },
              {
                n: 2,
                question:
                  "You're addressing a stranger — say, asking a passerby for directions. Tu or vous?",
                options: {
                  A: "Tu — French people prefer informal speech.",
                  B: "Vous — the default for anyone you don't already know.",
                  C: "Doesn't matter; both are equally polite.",
                  D: "Always tu when speaking to one person.",
                },
                correct: "B",
                principle:
                  "Vous is the safe default with strangers; tu is invited, never assumed.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "You can use salut as a casual hello to a shopkeeper you've never met.",
                correct: false,
                explanationFalse:
                  "Right — salut is informal and reserved for friends, peers, family. With a shopkeeper, always bonjour (or bonsoir in the evening).",
                explanationTrue:
                  "Actually no — salut is too familiar for someone you don't know. Stick to bonjour.",
                principle: "Salut is friend-level. Strangers get bonjour/bonsoir.",
              },
            ],
          },
        },
        {
          id: "c2-merci-svp",
          code: "L1.2",
          title: "S'il vous plaît, merci, and excuse me",
          lesson: {
            status: "ready",
            paragraphs: [
              "S'il vous plaît (\"seel voo pleh\") means please. The literal translation is \"if it pleases you\". With friends or children, it shortens to s'il te plaît (\"seel tuh pleh\"). Tack it onto the end of any request: un café s'il vous plaît, l'addition s'il vous plaît.",
              "Merci (\"mehr-see\") means thank you. To strengthen it, say merci beaucoup (\"mehr-see boh-koo\", thanks a lot) or merci bien (\"mehr-see byahn\", thanks very much — slightly more formal). Reply to merci with je vous en prie (\"zhuh voo zahn pree\", formal) or de rien (\"duh ree-ahn\", you're welcome / it's nothing) — or in Quebec, often simply bienvenue (\"byahn-vuh-noo\"), which would be confusing in France because there it only means welcome on arrival.",
              "Excuse me has two flavours. Pardon (\"par-dohn\") is what you say when bumping into someone or squeezing past on a bus. Excusez-moi (\"ex-koo-zay mwah\") is what you say to get someone's attention before asking a question — like \"excuse me, where's the metro?\". Don't mix them up: pardon is apology, excusez-moi is an opener.",
            ],
            keyPoints: [
              "S'il vous plaît (formal) / s'il te plaît (informal) = please.",
              "Merci = thanks. Merci beaucoup is the everyday strengthener.",
              "Reply to thanks: de rien (France) or bienvenue (Quebec).",
              "Pardon = apology after a bump. Excusez-moi = opener before a question.",
            ],
            simplified: {
              oneLiner:
                "Please = s'il vous plaît. Thanks = merci. Sorry-I-bumped-you = pardon. Excuse-me-can-I-ask = excusez-moi.",
            },
            deeper: {
              oneLiner:
                "France and Quebec part company on \"you're welcome\" — the same word means different things on opposite sides of the Atlantic.",
              paragraphs: [
                "In France, the standard reply to merci is de rien (literally \"of nothing\"), je vous en prie (\"I beg you, please\") or il n'y a pas de quoi (\"there's nothing to thank for\"). All three are common; je vous en prie is the most formal.",
                "In Quebec, bienvenue is the everyday reply to merci. A French person hearing this would think you're welcoming them somewhere — in France bienvenue means only \"welcome (on arrival)\". This is one of the most cited France-vs-Quebec vocabulary differences and a quick way to clock where someone learned their French.",
              ],
              keyPoints: [
                "France: de rien / je vous en prie / il n'y a pas de quoi.",
                "Quebec: bienvenue (also de rien works, but bienvenue is more common).",
                "France's bienvenue means welcome-on-arrival only.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You want to get a stranger's attention to ask for directions. Which phrase opens the conversation?",
                options: {
                  A: "Pardon.",
                  B: "Excusez-moi.",
                  C: "Merci.",
                  D: "Salut.",
                },
                correct: "B",
                explanations: {
                  A: "Pardon is what you say after bumping into someone — it's apology, not an opener.",
                  B: "Right — excusez-moi is the dedicated \"excuse me, may I\" opener.",
                  C: "Merci is thanks; it doesn't open a conversation.",
                  D: "Salut is informal hi for friends, not a stranger-attention opener.",
                },
                principle:
                  "Pardon = apology after the fact. Excusez-moi = opener before the question.",
              },
              {
                n: 2,
                question:
                  "A waiter brings your coffee. You say merci. They reply bienvenue. Where are you most likely?",
                options: {
                  A: "Paris.",
                  B: "Lyon.",
                  C: "Marseille.",
                  D: "Montreal.",
                },
                correct: "D",
                explanations: {
                  A: "In France, de rien or je vous en prie is the standard reply. Bienvenue would sound odd.",
                  B: "Same as Paris — France uses de rien / je vous en prie. Bienvenue would be unusual.",
                  C: "Same — bienvenue isn't the French \"you're welcome\".",
                  D: "Right — in Quebec, bienvenue is the everyday \"you're welcome\" reply.",
                },
                principle:
                  "Bienvenue as a reply to merci is a Quebec marker; France uses de rien.",
              },
              {
                kind: "fill-in",
                n: 3,
                question:
                  "Translate \"please\" in the polite form (the one you'd use with a shopkeeper).",
                acceptedAnswers: [
                  "s'il vous plaît",
                  "s'il vous plait",
                  "sil vous plait",
                  "svp",
                ],
                placeholder: "e.g. s'il vous plaît",
                explanation:
                  "S'il vous plaît is the formal/standard please. The informal version (s'il te plaît) is for friends and children. SVP is the common written abbreviation.",
                principle: "S'il vous plaît is the polite-default please.",
              },
            ],
          },
        },
        {
          id: "c3-introductions",
          code: "L1.3",
          title: "Introducing yourself and basic small talk",
          lesson: {
            status: "ready",
            paragraphs: [
              "To say your name: je m'appelle [name] (\"zhuh mah-pell\"), literally \"I call myself\". Or shorter: moi, c'est [name] (\"mwah, say\"). To ask theirs: comment vous appelez-vous? (\"koh-mahn voo zah-play voo\", formal) or et toi? (\"ay twah\", \"and you?\" — informal).",
              "Two opening pleasantries:",
              "• Comment allez-vous? (\"koh-mahn tah-lay voo\") — How are you? (formal). Reply: Ça va bien, merci (\"sah vah byahn mehr-see\", I'm well, thanks).",
              "• Ça va? (\"sah vah\") — How's it going? (informal). Reply: Ça va (I'm good) or pas mal (not bad).",
              "When asked enchanté(e) (\"ahn-shahn-tay\", \"delighted\") — that's the equivalent of \"nice to meet you\". Women add a silent e (enchantée) — pronunciation identical. Just reply enchanté(e) back.",
            ],
            keyPoints: [
              "Je m'appelle [name] = my name is. Comment vous appelez-vous? = what's your name?",
              "Ça va? = how's it going? Reply ça va or pas mal.",
              "Enchanté(e) = nice to meet you (silent e for women, same sound).",
            ],
            simplified: {
              oneLiner:
                "Je m'appelle X. Et vous? — Bonjour, comment ça va? — Ça va, merci.",
              keyPoints: [
                "Je m'appelle [name] = my name is.",
                "Ça va? = how are you?",
                "Ça va = I'm fine.",
                "Enchanté = nice to meet you.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "Translate: \"My name is Sam.\"",
                options: {
                  A: "Je suis Sam.",
                  B: "Je m'appelle Sam.",
                  C: "Mon nom Sam.",
                  D: "C'est moi Sam.",
                },
                correct: "B",
                explanations: {
                  A: "Je suis Sam (\"I am Sam\") is grammatically fine but unnatural for introductions — French speakers use je m'appelle.",
                  B: "Right — je m'appelle (\"I call myself\") is the standard self-introduction.",
                  C: "Missing a verb — not a complete French sentence.",
                  D: "Not how French introductions work.",
                },
                principle: "Self-introduction = je m'appelle [name], not je suis.",
              },
              {
                n: 2,
                question:
                  "A new colleague says ça va? to you. Which reply is correct AND informal-appropriate?",
                options: {
                  A: "Comment allez-vous?",
                  B: "Ça va, merci. Et toi?",
                  C: "Je m'appelle Sam.",
                  D: "Au revoir.",
                },
                correct: "B",
                explanations: {
                  A: "That's a re-question in the formal register — fine in meaning but wrong register for ça va? which is informal.",
                  B: "Right — answer ça va (I'm fine), thank them, return the question informally with et toi (\"and you?\").",
                  C: "That introduces yourself; it doesn't answer how you're doing.",
                  D: "That's goodbye, not a how-are-you reply.",
                },
                principle:
                  "Match register: ça va? gets ça va + et toi? (informal returns informal).",
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
              "You enter a tabac (tobacco shop) at 7:30 p.m. to buy a metro ticket. What's the right opening?",
            options: {
              A: "Salut!",
              B: "Bonsoir, monsieur. Un ticket de métro s'il vous plaît.",
              C: "Excusez-moi, je voudrais un ticket.",
              D: "Pardon, ticket métro.",
            },
            correct: "B",
            principle:
              "Bonsoir (evening) + monsieur (polite address) + s'il vous plaît at the end = correct register, complete request.",
          },
          {
            n: 2,
            question:
              "You bump into someone on the bus and they steady themselves. What's the right word?",
            options: {
              A: "Excusez-moi.",
              B: "Pardon.",
              C: "Merci.",
              D: "Bienvenue.",
            },
            correct: "B",
            principle:
              "Pardon is the bump-apology. Excusez-moi is the get-attention opener — wrong here.",
          },
          {
            n: 3,
            question:
              "A French acquaintance asks ça va? after a long day. Most natural reply?",
            options: {
              A: "Bonjour.",
              B: "Pas mal, et toi?",
              C: "Je m'appelle bien.",
              D: "S'il vous plaît.",
            },
            correct: "B",
            principle:
              "Pas mal (\"not bad\") is a natural mid-energy reply; returning the question with et toi keeps the exchange going.",
          },
        ],
      },
    },

    /* ============================================================
       Module 2 — Numbers, money, and time
       ============================================================ */
    {
      id: "m2-numbers-time",
      n: 2,
      title: "Numbers, money, and time",
      blurb:
        "Counting to 100, reading prices in euros and dollars, and telling the time on a 24-hour clock.",
      concepts: [
        {
          id: "c4-numbers-1-20",
          code: "L2.1",
          title: "Numbers 1–20 and 21–100",
          lesson: {
            status: "ready",
            paragraphs: [
              "Numbers 1–10: un (uhn), deux (duh), trois (twah), quatre (kat-ruh), cinq (sank), six (sees), sept (set), huit (weet), neuf (nuhf), dix (dees). Practice them out loud — they show up in prices, addresses, dates, phone numbers, and times.",
              "11–16 are their own words: onze, douze, treize, quatorze, quinze, seize. From 17 on, French goes additive: dix-sept (10+7), dix-huit (10+8), dix-neuf (10+9), then vingt (20).",
              "21–69 are mostly regular: vingt et un (21), vingt-deux (22), trente (30), quarante (40), cinquante (50), soixante (60). Then France gets weird:",
              "• 70 = soixante-dix (\"sixty-ten\")",
              "• 80 = quatre-vingts (\"four-twenties\")",
              "• 90 = quatre-vingt-dix (\"four-twenty-ten\")",
              "• 99 = quatre-vingt-dix-neuf (\"four-twenty-nineteen\")",
              "In Belgium and Switzerland (and to some extent Quebec, though less rigidly), 70 = septante and 90 = nonante — much simpler. Quebec mostly uses the France versions but understands both. Memorise the France pattern; you'll be understood everywhere.",
            ],
            keyPoints: [
              "1–10 are essential — drill them out loud.",
              "11–16 are unique words; 17–19 are additive (dix-sept, dix-huit, dix-neuf).",
              "70 = soixante-dix, 80 = quatre-vingts, 90 = quatre-vingt-dix in France/Quebec.",
              "Septante / nonante exist in Belgium & Switzerland — recognise but don't rely on them in France.",
            ],
            simplified: {
              oneLiner:
                "1–10 essential. Up to 69 mostly logical. 70/80/90 in France are math problems — memorise them.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "What's 75 in French (France)?",
                options: {
                  A: "Septante-cinq.",
                  B: "Soixante-quinze.",
                  C: "Soixante-dix-cinq.",
                  D: "Quatre-vingt-quinze.",
                },
                correct: "B",
                explanations: {
                  A: "Septante is Belgium/Switzerland. France uses the sixty-system.",
                  B: "Right — soixante (60) + quinze (15) = 75.",
                  C: "Soixante-dix is 70; you can't tack on another -cinq. The 'teen' word for 15 (quinze) is built into the math.",
                  D: "Quatre-vingt-quinze is 95 (80 + 15), not 75.",
                },
                principle:
                  "France's 70-series stacks 60 + a teen word: soixante + onze/douze/treize... = 71/72/73...",
              },
              {
                n: 2,
                question: "Which is 17?",
                options: {
                  A: "Sept-dix.",
                  B: "Dix-sept.",
                  C: "Dix-et-sept.",
                  D: "Soixante-sept.",
                },
                correct: "B",
                principle: "17 = dix-sept (10 + 7), additive, no \"et\".",
              },
              {
                kind: "fill-in",
                n: 3,
                question:
                  "Write the French (France) word for 80. (One word, hyphenated is fine.)",
                acceptedAnswers: ["quatre-vingts", "quatre vingts", "quatre-vingt"],
                placeholder: "e.g. quatre-vingts",
                explanation:
                  "80 in France = quatre-vingts (\"four twenties\"). The s drops when followed by another number: quatre-vingt-un (81).",
                principle:
                  "80 is built as 4×20. Belgium/Switzerland use octante/huitante, which French speakers will understand but rarely say.",
              },
            ],
          },
        },
        {
          id: "c5-money-prices",
          code: "L2.2",
          title: "Reading and saying prices",
          lesson: {
            status: "ready",
            paragraphs: [
              "France and most of Europe use the euro (€). Quebec uses the Canadian dollar ($CAD). Prices are written with a comma as the decimal separator in French: 2,50 € (two euros fifty), not 2.50.",
              "To say the price out loud: deux euros cinquante (2,50 €), trois euros (3 €), quinze euros quatre-vingt-dix (15,90 €). In Quebec: trois dollars cinquante or just trois cinquante in casual speech.",
              "Common register lines you'll hear at a till:",
              "• Ça fait [X] euros. — That'll be [X] euros.",
              "• Vous payez comment? — How are you paying?",
              "• Carte ou espèces? — Card or cash?",
              "• Avez-vous la monnaie? — Do you have exact change?",
              "Card is universal in France and Quebec; contactless is the default. Cash (espèces, or argent comptant in Quebec) still useful for markets and very small purchases.",
            ],
            keyPoints: [
              "France uses €, Quebec uses $CAD; both write the decimal as a comma (2,50).",
              "Say the whole number first, then the unit, then the cents: deux euros cinquante.",
              "Carte ou espèces? = card or cash? Card is the everyday default.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "How do you say 4,75 € out loud?",
                options: {
                  A: "Quatre virgule sept cinq euros.",
                  B: "Quatre euros soixante-quinze.",
                  C: "Quatre soixante-quinze cents.",
                  D: "Quatre euros soixante-cinq.",
                },
                correct: "B",
                explanations: {
                  A: "You don't say the decimal point — euros come first, then the cent count as a regular number.",
                  B: "Right — quatre euros (4 €) then soixante-quinze (75) for the cents.",
                  C: "Not how French prices are read. Cents stay in the same number stream.",
                  D: "That's 4,65 €, not 4,75 €.",
                },
                principle:
                  "Price = [whole number] [unit] [cents as a regular number]. No virgule spoken.",
              },
              {
                n: 2,
                question: "The cashier asks Carte ou espèces? They're asking…",
                options: {
                  A: "Are you a member?",
                  B: "Card or cash?",
                  C: "Do you want a receipt?",
                  D: "Do you have a loyalty number?",
                },
                correct: "B",
                principle: "Carte = card; espèces = cash. The two payment methods.",
              },
            ],
          },
        },
        {
          id: "c6-telling-time",
          code: "L2.3",
          title: "Telling the time (24-hour clock)",
          lesson: {
            status: "ready",
            paragraphs: [
              "French uses the 24-hour clock for anything formal — train schedules, restaurant hours, opening times, bus stops. 14h30 means 2:30 p.m. The h stands for heures (hours) and replaces the colon.",
              "To say a time: il est [number] heures [minutes]. \"It's 9 o'clock\" = il est neuf heures. \"It's 9:30\" = il est neuf heures trente, or more conversationally il est neuf heures et demie (nine and a half).",
              "Quarter past = et quart. Quarter to = moins le quart. Half past = et demie. So 8:15 = huit heures et quart; 8:45 = neuf heures moins le quart (\"nine minus quarter\"). These quarter/half phrases are 12-hour-clock style — use them in casual conversation. Stick to numeric forms (treize heures quinze for 13:15) when reading schedules.",
              "Midi (noon) and minuit (midnight) are the two times that don't take heures: il est midi (it's noon), il est minuit (it's midnight). \"Half past noon\" = midi et demi (note: midi/minuit are masculine, so demi has no e).",
            ],
            keyPoints: [
              "24-hour clock everywhere written: 14h30 = 2:30 p.m.",
              "Il est [N] heures = it's [N] o'clock.",
              "Et quart = quarter past; moins le quart = quarter to; et demie = half past.",
              "Midi = noon; minuit = midnight (no heures).",
            ],
            simplified: {
              oneLiner:
                "Schedules use 24-hour (14h30). Speaking is 12-hour (deux heures et demie). h replaces the colon.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "A restaurant menu reads \"Service: 12h–14h, 19h–22h.\" When can you eat?",
                options: {
                  A: "Noon to 2 a.m., then 7 a.m. to 10 a.m.",
                  B: "Noon to 2 p.m. and 7 p.m. to 10 p.m.",
                  C: "12 p.m. to 2 a.m.",
                  D: "Only between 7 p.m. and 10 p.m.",
                },
                correct: "B",
                explanations: {
                  A: "12h–14h is noon–2 p.m., not noon–2 a.m. 24-hour clock — afternoon hours are 13–23.",
                  B: "Right — 12h = noon, 14h = 2 p.m. Then 19h = 7 p.m., 22h = 10 p.m.",
                  C: "Mis-reading the 24h clock. 14h is 2 p.m.",
                  D: "It also opens for lunch (12h–14h), not just dinner.",
                },
                principle:
                  "24-hour clock: 13h–23h means 1 p.m.–11 p.m. Always parse the second number first to anchor afternoon vs morning.",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "Write 8:45 in conversational French (use the quarter-to form). Two-word answer is fine.",
                acceptedAnswers: [
                  "neuf heures moins le quart",
                  "neuf heures moins quart",
                  "9 heures moins le quart",
                  "9h moins le quart",
                ],
                placeholder: "e.g. neuf heures moins le quart",
                explanation:
                  "Conversationally, 8:45 is read as \"nine minus a quarter\" — neuf heures moins le quart. On a schedule it would be written 08h45 or huit heures quarante-cinq.",
                principle:
                  "Moins le quart = quarter to. The base hour shifts up by one.",
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
            question: "How do you say 92 in French (France)?",
            options: {
              A: "Neuf-deux.",
              B: "Nonante-deux.",
              C: "Quatre-vingt-douze.",
              D: "Soixante-trente-deux.",
            },
            correct: "C",
            principle:
              "92 = 4 × 20 + 12 = quatre-vingt-douze. Nonante-deux is Belgium/Switzerland.",
          },
          {
            n: 2,
            question:
              "A train ticket shows \"Départ 17h05\". When does it leave?",
            options: {
              A: "5 a.m.",
              B: "5:05 a.m.",
              C: "5:05 p.m.",
              D: "7:05 a.m.",
            },
            correct: "C",
            principle:
              "17h on the 24-hour clock = 5 p.m. (17 − 12). 17h05 = 5:05 p.m.",
          },
          {
            n: 3,
            question: "Cashier says ça fait douze euros quarante. The price is…",
            options: {
              A: "€12,04.",
              B: "€12,40.",
              C: "€2,40.",
              D: "€20,40.",
            },
            correct: "B",
            principle:
              "Whole-euros first (douze = 12), then the cents as a regular number (quarante = 40). 12,40 €.",
          },
        ],
      },
    },

    /* ============================================================
       Module 3 — Café and restaurant
       ============================================================ */
    {
      id: "m3-cafe-restaurant",
      n: 3,
      title: "Café and restaurant",
      blurb:
        "Order a coffee, read a menu, ask for the bill — the survival kit for eating out in France or Quebec.",
      concepts: [
        {
          id: "c7-ordering-cafe",
          code: "L3.1",
          title: "Ordering at a café (the je voudrais formula)",
          lesson: {
            status: "ready",
            paragraphs: [
              "The polite, universal way to order anything in French is je voudrais (\"zhuh voo-dray\") — \"I would like\". It's softer than je veux (\"I want\"), which can sound demanding. Pair it with s'il vous plaît at the end and you're set:",
              "• Je voudrais un café, s'il vous plaît. — I'd like a coffee, please.",
              "• Je voudrais deux croissants, s'il vous plaît. — I'd like two croissants, please.",
              "Café in France defaults to a small espresso. If you want what North Americans call \"a coffee\", ask for un café allongé (espresso with extra hot water) or un café crème (espresso with steamed milk — closest to a latte). Un café au lait is more of a breakfast-at-home thing. In Quebec, un café is closer to a North American filter coffee.",
              "For tea: un thé (plain), un thé au lait (with milk), une infusion (herbal tea). Cold drinks: une eau gazeuse (sparkling water), une eau plate (still water), un jus d'orange (orange juice).",
              "When the server comes to your table, they may simply say bonjour or je vous écoute (\"I'm listening\"). You can lead with je voudrais or with the more casual pour moi, ce sera... (\"for me, it'll be...\").",
            ],
            keyPoints: [
              "Je voudrais [item], s'il vous plaît. — universal polite order phrase.",
              "Un café = small espresso in France. Un café crème = closest to a latte.",
              "Eau gazeuse = sparkling; eau plate = still.",
              "Quebec un café is closer to a North-American filter coffee.",
            ],
            simplified: {
              oneLiner:
                "Bonjour. Je voudrais un café s'il vous plaît. Merci. — three-line café order, complete.",
            },
            deeper: {
              oneLiner:
                "French café drinks are precisely named — the wrong word gets you the wrong cup.",
              keyPoints: [
                "Un express / un café = single espresso.",
                "Un double = double espresso.",
                "Un allongé = espresso lengthened with hot water (like a long black).",
                "Un café crème = espresso with steamed milk (closest to a latte).",
                "Un noisette = espresso with a dash of milk (closest to a piccolo / macchiato).",
                "Un café au lait = filter or large coffee with hot milk — café-at-home style; rarely served as such in Parisian cafés.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "In a Parisian café, what's the politest, most natural way to order one espresso?",
                options: {
                  A: "Je veux un café.",
                  B: "Un café.",
                  C: "Bonjour, je voudrais un café, s'il vous plaît.",
                  D: "Donnez-moi un café.",
                },
                correct: "C",
                explanations: {
                  A: "Je veux is too blunt — sounds demanding to French ears. Use je voudrais.",
                  B: "Functional but missing the greeting and politeness markers. Reads as curt.",
                  C: "Right — bonjour to open + je voudrais (would like) + s'il vous plaît at the end is the full polite order.",
                  D: "\"Give me\" — imperative and rude in this register.",
                },
                principle:
                  "Polite order = bonjour + je voudrais + item + s'il vous plaît. Skipping any feels rude.",
              },
              {
                n: 2,
                question:
                  "You're in Paris and want something close to a North-American milky coffee. What do you order?",
                options: {
                  A: "Un café.",
                  B: "Un express.",
                  C: "Un café crème.",
                  D: "Un café noir.",
                },
                correct: "C",
                explanations: {
                  A: "Un café in France = single espresso. Not milky.",
                  B: "Un express = also a single espresso. Same thing as un café in France.",
                  C: "Right — café crème = espresso + steamed milk, closest to a latte / North-American milk coffee.",
                  D: "Un café noir = a black coffee, no milk.",
                },
                principle:
                  "Specify crème for milk; un café alone defaults to single espresso in France.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "In a Parisian café, ordering \"un café\" will get you a large filter coffee.",
                correct: false,
                explanationFalse:
                  "Right — un café in France is a single espresso. For something larger and milky, ask for un café crème or un café allongé.",
                explanationTrue:
                  "Actually no — un café is an espresso. The default size in France is small.",
                principle:
                  "Un café in France = espresso, not filter. Quebec defaults closer to filter.",
              },
            ],
          },
        },
        {
          id: "c8-restaurant-menu",
          code: "L3.2",
          title: "Reading a restaurant menu",
          lesson: {
            status: "ready",
            paragraphs: [
              "Most French restaurant menus follow the same structure:",
              "• Entrées — starters (NOT main courses; \"entrée\" in North America misleadingly means main, but in France it's literally the entry course).",
              "• Plats / Plats principaux — main courses.",
              "• Desserts — desserts.",
              "• Boissons — drinks.",
              "• Carte des vins — wine list.",
              "Many restaurants offer a formule (set menu): formule à 18 € might mean entrée + plat OR plat + dessert; le menu à 25 € often means entrée + plat + dessert. Read the small print or ask: la formule, qu'est-ce qu'elle comprend? (\"what does the set menu include?\").",
              "Useful menu vocabulary: viande (meat), poisson (fish), poulet (chicken), bœuf (beef), porc (pork), agneau (lamb), saumon (salmon), thon (tuna), légumes (vegetables), salade (salad). Cooking levels for steak: bleu (extremely rare), saignant (rare), à point (medium), bien cuit (well done).",
              "Dietary needs: je suis végétarien(ne) (I'm vegetarian), je suis allergique aux noix (I'm allergic to nuts), sans gluten (gluten-free). In Quebec, déjeuner = breakfast and dîner = lunch and souper = dinner. In France, déjeuner = lunch and dîner = dinner. Easy trap to fall into.",
            ],
            keyPoints: [
              "Entrée = starter (not main course). Plat = main. Dessert = dessert.",
              "Formule = abbreviated set menu (2 courses); menu = full set menu (3 courses).",
              "Steak doneness: bleu / saignant / à point / bien cuit.",
              "Quebec meal-names shift one slot: déjeuner = breakfast, dîner = lunch, souper = dinner.",
            ],
            simplified: {
              oneLiner:
                "Entrée=starter, plat=main, dessert=dessert. Formule=2 courses, menu=3.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You're reading a Paris bistro menu. Under \"Entrées\" you see soupe à l'oignon. This dish is a…",
                options: {
                  A: "Main course.",
                  B: "Starter.",
                  C: "Side dish.",
                  D: "Dessert.",
                },
                correct: "B",
                explanations: {
                  A: "Watch out — entrée in France is NOT the main course (despite North American usage).",
                  B: "Right — entrée literally means \"entry\" — the starter course.",
                  C: "Sides are usually grouped with the plat or à la carte.",
                  D: "Onion soup is hot, savoury, and on the starter section.",
                },
                principle:
                  "France: entrée = starter, plat = main. North-American \"entrée\" means main — opposite meaning, easy to confuse.",
              },
              {
                n: 2,
                question:
                  "You want your steak cooked medium. What do you tell the waiter?",
                options: {
                  A: "Bleu, s'il vous plaît.",
                  B: "Saignant, s'il vous plaît.",
                  C: "À point, s'il vous plaît.",
                  D: "Bien cuit, s'il vous plaît.",
                },
                correct: "C",
                principle:
                  "Doneness scale: bleu (very rare) → saignant (rare) → à point (medium) → bien cuit (well done).",
              },
              {
                n: 3,
                question:
                  "You're in Montreal and a friend invites you for souper. You should arrive at…",
                options: {
                  A: "Breakfast time.",
                  B: "Lunch time.",
                  C: "Dinner time.",
                  D: "Afternoon snack time.",
                },
                correct: "C",
                explanations: {
                  A: "In Quebec that's déjeuner.",
                  B: "In Quebec that's dîner.",
                  C: "Right — in Quebec, souper = dinner (the evening meal). In France, souper means a late-evening meal after the theater — different and rarely used.",
                  D: "Snack time is goûter or collation.",
                },
                principle:
                  "Quebec meal-names shift one slot earlier than France: déjeuner / dîner / souper = breakfast / lunch / dinner.",
              },
            ],
          },
        },
        {
          id: "c9-paying-bill",
          code: "L3.3",
          title: "Asking for and paying the bill",
          lesson: {
            status: "ready",
            paragraphs: [
              "In France, the bill never comes automatically. You have to ask for it — usually by catching the waiter's eye and saying l'addition, s'il vous plaît (\"lah-dee-syon, seel voo pleh\"). It's perfectly polite to wait quite a while after dessert before asking; meals are not rushed.",
              "In Quebec, asking the same way (l'addition s'il vous plaît) works fine. Quebecers also commonly say la facture (\"the bill / invoice\"), which would feel oddly formal in France.",
              "When paying: the waiter usually brings a portable card machine to the table — vous pouvez insérer votre carte (you can insert your card) or contactless. Cash leaves on a small plate or tray.",
              "Tipping. In France, service is compris (\"included\") by law — listed on the bill and built into menu prices. Rounding up to the nearest euro, or leaving 1–2 € on a coffee, or 5–10 € on a nice meal, is appreciated but not expected. In Quebec, tipping 15–20% is standard and expected (closer to US norms) — service is NOT included; you add it on top.",
            ],
            keyPoints: [
              "Ask for the bill: l'addition, s'il vous plaît. (Quebec also: la facture.)",
              "Bill never comes automatically in France — you have to ask.",
              "Tipping: France = service compris (rounding up optional). Quebec = 15–20% expected on top.",
            ],
            simplified: {
              oneLiner:
                "L'addition s'il vous plaît. France: service is included. Quebec: tip 15–20% on top.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You're done with dinner at a Paris bistro and want to leave. The waiter hasn't brought the bill. What do you do?",
                options: {
                  A: "Wait — it'll come.",
                  B: "Stand up and walk to the till.",
                  C: "Catch the waiter's eye and ask: l'addition, s'il vous plaît.",
                  D: "Leave money on the table and walk out.",
                },
                correct: "C",
                explanations: {
                  A: "It won't — French waiters never bring the bill unsolicited. You'd wait forever.",
                  B: "Some places have a till, but at a sit-down bistro you ask the waiter, who then either brings the machine or rings you up.",
                  C: "Right — French waiters wait to be asked. L'addition, s'il vous plaît is the universal polite request.",
                  D: "You don't know the total yet — there might be a couvert or service charge.",
                },
                principle:
                  "In France the bill comes only on request. Asking is not rude; waiting forever is the mistake.",
              },
              {
                n: 2,
                question:
                  "You've had a 30 € lunch in Paris. The bill shows service compris. What's appropriate to tip?",
                options: {
                  A: "Nothing more — service is already included.",
                  B: "Exactly 18% (about 5.40 €) on top, like in North America.",
                  C: "Rounding up to 32 €, leaving 2 € — appreciated but not required.",
                  D: "Cash only, never card tip.",
                },
                correct: "C",
                explanations: {
                  A: "Technically fine — but most diners round up a little. Nothing extra is read as cheap by some.",
                  B: "Over-tipping by French standards. North-American 18–20% is unusual; locals don't do it.",
                  C: "Right — service is included, so a 1–2 € round-up is the local convention. Generous but not unusual.",
                  D: "There's no rule against card tips, though small tips are usually in cash on the plate.",
                },
                principle:
                  "France: service compris means rounding up is generosity, not obligation. 18–20% is North-American, not French.",
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
              "You order with je voudrais un café au lait, un croissant, et l'addition s'il vous plaît, all at the same time. What's wrong?",
            options: {
              A: "Café au lait isn't served in cafés.",
              B: "You can't ask for the bill before you've eaten.",
              C: "You don't say s'il vous plaît at the end of a chain.",
              D: "Nothing — that's a complete and polite order.",
            },
            correct: "B",
            principle:
              "L'addition s'il vous plaît is asked AFTER eating, not as part of the initial order. It's how you end the visit.",
          },
          {
            n: 2,
            question:
              "Steak doneness from least to most cooked is…",
            options: {
              A: "Bien cuit → à point → saignant → bleu.",
              B: "Bleu → saignant → à point → bien cuit.",
              C: "Saignant → bleu → bien cuit → à point.",
              D: "À point → bleu → saignant → bien cuit.",
            },
            correct: "B",
            principle:
              "Bleu (almost raw) → saignant (rare) → à point (medium) → bien cuit (well done).",
          },
          {
            n: 3,
            question:
              "In Montreal, after a $40 dinner, an appropriate tip is roughly…",
            options: {
              A: "$0 — service is included.",
              B: "$2 — rounding up.",
              C: "$6–$8 — 15–20% as expected in Quebec.",
              D: "$20 — generous by local standards.",
            },
            correct: "C",
            principle:
              "Quebec tipping ≈ North-American norms: 15–20% on top of the bill. Different from France where service is compris.",
          },
        ],
      },
    },

    /* ============================================================
       Module 4 — Asking for directions and getting around
       ============================================================ */
    {
      id: "m4-directions",
      n: 4,
      title: "Asking for directions and getting around",
      blurb:
        "Where is X? How far? How do I get to the metro? — the phrases that unlock a city.",
      concepts: [
        {
          id: "c10-where-is",
          code: "L4.1",
          title: "Où est… and où se trouve…",
          lesson: {
            status: "ready",
            paragraphs: [
              "The single most useful question for a tourist: où est… ? (\"oo eh\", \"where is...?\"). Open with the politeness layer first, then ask:",
              "• Excusez-moi, où est la gare? — Excuse me, where is the train station?",
              "• Pardon, où sont les toilettes? — Sorry, where are the bathrooms? (note: sont because toilettes is plural).",
              "A slightly more formal alternative is où se trouve…? (\"where is found...\"). Same meaning, marginally more polished — common on signage.",
              "Useful destinations to know: la gare (train station), la station de métro (metro station), l'arrêt de bus (bus stop), la pharmacie (pharmacy), l'hôpital (hospital), la banque (bank), le distributeur / le guichet automatique (ATM), l'office de tourisme (tourist info), les toilettes (bathrooms), le supermarché (supermarket), le marché (open-air market), la poste (post office), l'hôtel (hotel).",
              "If the answer is too fast, the rescue phrase is: pouvez-vous parler plus lentement, s'il vous plaît? (\"can you speak more slowly, please?\"). Use it without hesitation — most French speakers will gladly slow down.",
            ],
            keyPoints: [
              "Où est [X]? — universal where-is question. Singular est, plural sont.",
              "Open with excusez-moi or pardon before asking a stranger.",
              "Memorise the high-frequency destinations: gare, métro, pharmacie, toilettes, ATM.",
              "Rescue line: pouvez-vous parler plus lentement?",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You stop a stranger in Lyon to ask where the train station is. What's the most natural full phrasing?",
                options: {
                  A: "Gare où?",
                  B: "Excusez-moi, où est la gare?",
                  C: "Bonjour, gare s'il vous plaît.",
                  D: "Pardon, je voudrais la gare.",
                },
                correct: "B",
                explanations: {
                  A: "Word-salad — French questions need a verb and proper word order.",
                  B: "Right — excusez-moi opens, où est is the question, la gare is the destination.",
                  C: "Reads as a request (please give me a station), not a question (where is it?).",
                  D: "Same problem — je voudrais is an order verb, not a question.",
                },
                principle: "Asking-where = [excusez-moi/pardon] + où est + [destination].",
              },
              {
                kind: "fill-in",
                n: 2,
                question:
                  "Fill in the blank: \"Excusez-moi, _____ les toilettes?\" (one or two words.)",
                acceptedAnswers: ["où sont", "ou sont"],
                placeholder: "e.g. où sont",
                explanation:
                  "Toilettes is plural in French, so the verb agrees: où sont (where are) les toilettes? Not où est.",
                principle:
                  "Subject–verb agreement: plural noun (les toilettes) → plural verb (sont), not singular est.",
              },
              {
                n: 3,
                question:
                  "The reply is in fast French. You don't understand. The right rescue phrase is…",
                options: {
                  A: "Au revoir!",
                  B: "Je ne sais pas.",
                  C: "Pouvez-vous parler plus lentement, s'il vous plaît?",
                  D: "Merci, ça va.",
                },
                correct: "C",
                principle:
                  "Asking for slower speech is normal and welcomed. Most speakers will gladly oblige.",
              },
            ],
          },
        },
        {
          id: "c11-direction-words",
          code: "L4.2",
          title: "Left, right, straight ahead — parsing directions",
          lesson: {
            status: "ready",
            paragraphs: [
              "When someone gives you directions, the survival-level vocabulary is small but essential:",
              "• à gauche — to the left (\"ah gohsh\")",
              "• à droite — to the right (\"ah dwaht\")",
              "• tout droit — straight ahead (\"too dwah\") — note: NOT to the right; the difference between droit and droite trips up everyone first time.",
              "• en face — opposite / across from (\"ahn fass\")",
              "• à côté de — next to (\"ah ko-tay duh\")",
              "• près de — near (\"preh duh\")",
              "• loin de — far from (\"lwahn duh\")",
              "Common landmarks in directions: au coin (at the corner), au feu (at the traffic light — short for au feu rouge), au carrefour (at the intersection), après (after), avant (before), jusqu'à (until / as far as).",
              "Distance phrases: à cinq minutes à pied (five minutes on foot), à deux pâtés de maisons (two blocks — France) or à deux coins de rue (Quebec usage), tout près (very close), pas très loin (not very far).",
              "When directions overwhelm you, repeat back the key landmark: alors, tout droit jusqu'au feu, puis à droite? — clear confirmation closes the loop.",
            ],
            keyPoints: [
              "À gauche / à droite / tout droit = left / right / straight on. Tout droit ≠ à droite.",
              "En face = opposite. À côté de = next to. Près de / loin de = near / far.",
              "Au feu = at the light; au coin = at the corner.",
              "Confirm the route back to the speaker — closes the loop and catches misunderstandings.",
            ],
            simplified: {
              oneLiner:
                "Gauche=left, droite=right, tout droit=straight. Au feu=at the light, au coin=at the corner.",
            },
            deeper: {
              oneLiner:
                "Why tout droit confuses every beginner: droit (masculine adjective, \"straight\") looks almost identical to droite (feminine noun, \"right\"). Same root, different gender, different meaning.",
              paragraphs: [
                "Tout droit literally means \"all straight\" — go entirely straight ahead. The droit here is a masculine adverb-like usage meaning \"straight\".",
                "À droite means \"to the right\". The droite here is a feminine noun: la droite = the right side. The à preposition pulls in the article-y feminine form.",
                "In rapid speech the distinction is mostly the final consonant: droit ends in a soft \"dwah\", droite ends in a crisp \"dwaht\" (you can hear the t). When in doubt, ask the speaker to repeat slowly — pouvez-vous répéter? — and listen for the t.",
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Someone gives you directions: tout droit jusqu'au feu, puis à droite. They mean…",
                options: {
                  A: "Right at the light, then straight.",
                  B: "Straight to the light, then right.",
                  C: "Right all the way to the right side.",
                  D: "Straight, then straight again, until you find it.",
                },
                correct: "B",
                explanations: {
                  A: "Wrong order — tout droit is the first step, à droite is the second.",
                  B: "Right — tout droit (straight) jusqu'au feu (to the light), puis (then) à droite (to the right).",
                  C: "Confuses droit with droite. Tout droit means straight ahead, not to the right.",
                  D: "Misses the à droite step entirely.",
                },
                principle:
                  "Tout droit = straight (masculine). À droite = to the right (feminine). They sound similar; the t at the end of droite is the giveaway.",
              },
              {
                n: 2,
                question:
                  "The pharmacy is en face de la banque. It's…",
                options: {
                  A: "Next to the bank.",
                  B: "Inside the bank.",
                  C: "Across the street from the bank.",
                  D: "Behind the bank.",
                },
                correct: "C",
                principle:
                  "En face de = directly opposite, across from. Distinct from à côté de (next to) and derrière (behind).",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "Tout droit and à droite mean the same thing — both translate to \"right\".",
                correct: false,
                explanationFalse:
                  "Right — tout droit means straight ahead. À droite means to the right. Different words, different directions; only the spelling/sound is similar.",
                explanationTrue:
                  "Actually no — tout droit means \"straight ahead\", à droite means \"to the right\". This is one of the most common beginner mix-ups.",
                principle:
                  "Tout droit ≠ à droite. Memorise as a pair so you don't confuse them in the moment.",
              },
            ],
          },
        },
        {
          id: "c12-transit",
          code: "L4.3",
          title: "Buses, metros, trains — getting a ticket",
          lesson: {
            status: "ready",
            paragraphs: [
              "Public transit vocabulary is short and useful: le métro (subway), le bus (bus — same word, French pronunciation \"boos\"), le tramway (tram), le train (train), le TGV (high-speed inter-city train), le RER (Paris suburban train).",
              "Buying tickets: un ticket (one ride), un carnet (book of 10 — Paris), un pass journée or pass 24h (day pass), un abonnement (subscription / season pass). In Paris the Navigo Easy is a rechargeable card replacing the paper carnet for most uses.",
              "Useful sentences:",
              "• Un ticket de métro, s'il vous plaît. — One metro ticket, please.",
              "• Le prochain train pour [destination] part à quelle heure? — When does the next train to [destination] leave?",
              "• Ce train va à [destination]? — Does this train go to [destination]?",
              "• Quel quai? — Which platform?",
              "• Composter votre billet — Validate your ticket (older signs at French rail stations — you used to have to punch your ticket in a yellow machine before boarding regional trains; mostly automated now but signs persist).",
              "In Quebec (Montreal STM), un billet = one ride, une carte OPUS = the rechargeable transit card. Bus and metro share the same fare network. Outside Montreal, intercity buses (Orléans Express, FlixBus) are how you get between cities for many routes.",
            ],
            keyPoints: [
              "Le métro / bus / tramway / train / TGV / RER — the transit vocabulary.",
              "Un ticket = one ride. Un carnet (Paris) = 10. Un pass journée = day pass.",
              "Useful question: ce train va à [destination]? — does this go to X?",
              "Composter = validate (older French regional rail).",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You're at Gare du Nord in Paris and want to confirm the train in front of you goes to Lille. What do you ask the conductor?",
                options: {
                  A: "Lille s'il vous plaît?",
                  B: "Ce train va à Lille?",
                  C: "Le métro pour Lille?",
                  D: "Quel est le quai?",
                },
                correct: "B",
                explanations: {
                  A: "Polite but unclear — they might think you're asking for a ticket.",
                  B: "Right — ce train va à [destination]? is the unambiguous confirmation phrasing.",
                  C: "Lille isn't on a metro — it's an SNCF train.",
                  D: "That asks the platform number, not whether the train goes to Lille.",
                },
                principle:
                  "Ce train va à X? = does this train go to X? — the precise confirmation question.",
              },
              {
                n: 2,
                question:
                  "An older sign at a French regional train station says composter votre billet. It means…",
                options: {
                  A: "Pay for your ticket.",
                  B: "Compost it after use (environmental notice).",
                  C: "Validate your ticket — punch it in the yellow machine before boarding.",
                  D: "Compare prices.",
                },
                correct: "C",
                principle:
                  "Composter = validate at a yellow lecteur de cartes / composteur machine. Skipping it used to mean a fine even if you had a paid ticket; mostly automated now but signs persist.",
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
              "You're lost in Quebec City and ask Excusez-moi, où est l'office de tourisme? The reply is À deux coins de rue, sur votre droite. The office is…",
            options: {
              A: "Two streets away, on your left.",
              B: "Two blocks away, on your right.",
              C: "At the second traffic light, straight ahead.",
              D: "Two minutes by metro.",
            },
            correct: "B",
            principle:
              "Coin de rue = street corner / block (Quebec idiom). Sur votre droite = on your right. Two blocks on the right.",
          },
          {
            n: 2,
            question:
              "Which question correctly asks for the next train to Marseille?",
            options: {
              A: "Quand Marseille train?",
              B: "Le prochain train pour Marseille part à quelle heure?",
              C: "Marseille s'il vous plaît, quand?",
              D: "Allez-vous Marseille?",
            },
            correct: "B",
            principle:
              "Le prochain train pour X part à quelle heure? — full polite phrasing.",
          },
          {
            n: 3,
            question:
              "Where do bus tickets typically validate in a French city bus?",
            options: {
              A: "At a counter inside the bus station — buy and validate together.",
              B: "Onboard, in a small validation machine near the entry door.",
              C: "Tickets don't need validation; just hold them.",
              D: "At the driver's window, who stamps it manually.",
            },
            correct: "B",
            principle:
              "Bus tickets are validated on board at a yellow machine on entry. Skipping it = riding without a valid ticket if you're checked.",
          },
        ],
      },
    },

    /* ============================================================
       Module 5 — Reading signs and notices
       ============================================================ */
    {
      id: "m5-signs",
      n: 5,
      title: "Reading signs, notices, and warnings",
      blurb:
        "The street signs, shop notices, and short written instructions you'll see daily — and what to ignore vs. obey.",
      concepts: [
        {
          id: "c13-shop-notices",
          code: "L5.1",
          title: "Shop and door signs",
          lesson: {
            status: "ready",
            paragraphs: [
              "Common signs on shop doors and windows are short, repetitive, and decode-by-sight once you know them:",
              "• Ouvert / Fermé — Open / Closed.",
              "• Poussez / Tirez — Push / Pull. (Easy mnemonic: Poussez has a P like Push.)",
              "• Entrée / Sortie — Entrance / Exit.",
              "• Sortie de secours — Emergency exit.",
              "• Soldes — Sales / discounts (a regulated French institution; full sales twice a year).",
              "• Promotion / Promo — Promotional offer.",
              "• Caisse — Cash register / checkout.",
              "• Fermeture exceptionnelle — Closed today (unscheduled).",
              "• Congés annuels — Annual holidays (typical in France in August — many small shops close for two weeks).",
              "• En vacances — On vacation.",
              "• Réservé aux clients — Customers only (often on toilettes / parking).",
              "• Service compris — Service included (on restaurant bills and menus — confirms no tip required).",
              "• Interdit de fumer / Défense de fumer — No smoking.",
            ],
            keyPoints: [
              "Poussez (push) ≠ tirez (pull). P=push is the easy mnemonic.",
              "Soldes = official sales (twice a year in France); promo = anytime promotional offer.",
              "Congés annuels in August is normal for small French shops.",
              "Interdit / défense de... = forbidden / no...",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You walk to a glass door at a Paris boulangerie. The sign reads TIREZ. You should…",
                options: {
                  A: "Push the door.",
                  B: "Pull the door.",
                  C: "Wait for it to slide open.",
                  D: "Knock first.",
                },
                correct: "B",
                explanations: {
                  A: "Push is poussez (P = Push mnemonic).",
                  B: "Right — tirez = pull.",
                  C: "Not a sliding-door instruction. That would be automatic.",
                  D: "Knocking on a shop door is unusual — just open it.",
                },
                principle:
                  "Poussez = push, tirez = pull. P/P mnemonic is the fastest way to remember which is which.",
              },
              {
                n: 2,
                question:
                  "A small boulangerie in Marseille has a handwritten sign: Congés annuels du 1er au 18 août. The shop is…",
                options: {
                  A: "Hosting a holiday-themed event from August 1–18.",
                  B: "Selling discounted yearly subscriptions.",
                  C: "Closed for annual vacation from August 1 to 18.",
                  D: "Open extended hours for August.",
                },
                correct: "C",
                explanations: {
                  A: "Congés = leave / holidays (the time off, not the event).",
                  B: "Annuels just means annual; nothing here is about a subscription.",
                  C: "Right — congés annuels = annual leave / staff vacation. Common in France in August.",
                  D: "Opposite of correct — these dates are when it's closed.",
                },
                principle:
                  "Congés annuels in August is a French summer pattern — many small shops shut. Plan around it.",
              },
            ],
          },
        },
        {
          id: "c14-street-signs",
          code: "L5.2",
          title: "Street signs and traffic notices",
          lesson: {
            status: "ready",
            paragraphs: [
              "Most road signs in France and Quebec use international (UN) symbols, but the text labels are in French and worth recognising on sight:",
              "• Sens unique — One way.",
              "• Sens interdit — No entry (matches the red-circle white-bar symbol).",
              "• Stationnement interdit — No parking.",
              "• Stationnement payant — Paid parking.",
              "• Cédez le passage — Yield / give way (matches the inverted-triangle symbol).",
              "• Priorité à droite — Yield to traffic on the right (a French intersection rule that catches foreign drivers off-guard: at an unmarked intersection, cars coming from your right have priority).",
              "• Travaux — Roadworks.",
              "• Déviation — Detour.",
              "• Ralentir — Slow down.",
              "• Piétons — Pedestrians.",
              "• Passage piéton — Pedestrian crossing.",
              "• Voie sans issue / Impasse — Dead end / cul-de-sac.",
              "• Zone bleue — Time-limited parking zone (you display a disc showing your arrival time).",
              "• Centre-ville — Town centre (the direction signs point you to).",
              "• Toutes directions — All directions (use this when you don't recognise the specific town named on the other signs).",
              "In Quebec, signs are bilingual on highways but often French-only in older neighbourhoods. Arrêt (instead of STOP) is the Quebec-specific octagon — North America's only French stop sign.",
            ],
            keyPoints: [
              "Sens interdit = no entry (do not enter). Sens unique = one way.",
              "Cédez le passage = yield. Priorité à droite is France's default unmarked-intersection rule.",
              "Toutes directions is your friend when lost — it routes you out of any town center.",
              "Quebec stop signs read ARRÊT, not STOP.",
            ],
            simplified: {
              oneLiner:
                "Sens interdit=don't enter, cédez=yield, travaux=roadworks, toutes directions=all routes (use when lost).",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You're driving in rural France and approach a small unmarked intersection (no signs, no lights). A car is coming from your right. Who has priority?",
                options: {
                  A: "You — you're already on the road.",
                  B: "The car on the right — priorité à droite.",
                  C: "Whoever is faster.",
                  D: "The bigger vehicle.",
                },
                correct: "B",
                explanations: {
                  A: "Not in France — the priorité à droite rule is the default at unmarked intersections.",
                  B: "Right — at unmarked French intersections, cars coming from your right have priority unless signs say otherwise. Catches foreign drivers off-guard.",
                  C: "Not a driving rule.",
                  D: "Not a driving rule.",
                },
                principle:
                  "Priorité à droite — France's default unmarked-intersection rule. Always look right and yield.",
              },
              {
                n: 2,
                question:
                  "Driving in Quebec, you see a red octagonal sign reading ARRÊT. You should…",
                options: {
                  A: "Speed up — it's a yield.",
                  B: "Slow down — it means caution.",
                  C: "Come to a full stop — it's a stop sign.",
                  D: "Stop only if pedestrians are present.",
                },
                correct: "C",
                explanations: {
                  A: "Same shape as a North-American stop sign — same meaning.",
                  B: "Same shape as a North-American stop sign — same meaning.",
                  C: "Right — Arrêt is Quebec's French-only stop sign. Same shape and color as STOP elsewhere.",
                  D: "Stop sign = unconditional full stop.",
                },
                principle:
                  "Quebec arrêt = stop. Same octagon, French word — required full stop.",
              },
              {
                kind: "true-false",
                n: 3,
                question:
                  "Toutes directions on a French road sign means you should go in every direction simultaneously.",
                correct: false,
                explanationFalse:
                  "Right — it means \"all directions\". It's the catch-all route used to send you toward whichever onward exit you need. When you can't find your destination on the more specific signs, follow toutes directions and you'll likely find the right exit further on.",
                explanationTrue:
                  "Of course not — it means \"all directions\", a generic onward sign useful when you don't recognise the specific towns named.",
                principle:
                  "Toutes directions = catch-all onward sign — follow it when lost and you'll find the right specific sign further on.",
              },
            ],
          },
        },
        {
          id: "c15-warnings-safety",
          code: "L5.3",
          title: "Warnings, prohibitions, and emergency notices",
          lesson: {
            status: "ready",
            paragraphs: [
              "Warning words you'll see on signs, packaging, and machinery:",
              "• Attention — Watch out / Warning.",
              "• Danger — Danger.",
              "• Interdit / Défense de... — Forbidden / No...",
              "• Ne pas... — Do not...",
              "• Risque de... — Risk of...",
              "• Eau non potable — Non-drinkable water (often on outdoor taps in parks).",
              "• Ne pas se pencher au dehors — Do not lean out (classic train-window sign).",
              "• Réservé au personnel — Staff only.",
              "• Issue de secours — Emergency exit.",
              "• Premiers secours — First aid.",
              "• En cas d'urgence... — In case of emergency...",
              "• Pompiers — Fire brigade (general-purpose emergency in France: 18 from a landline, 112 from a mobile).",
              "• SAMU — French ambulance / emergency medical service (15).",
              "• Police-secours — Emergency police (17).",
              "• In Quebec: 911 is universal (same as US/Canada).",
              "Pharmacy cross is green and lit — the universal sign of an open pharmacy. Outside hours, the cross is dark; for after-hours pharmacy info look for pharmacie de garde notices.",
            ],
            keyPoints: [
              "Attention = warning; Danger = danger; Interdit / Défense de / Ne pas = forbidden.",
              "Eau non potable = don't drink (common on park / fountain taps).",
              "France emergency: 112 (general), 18 (fire), 15 (SAMU), 17 (police).",
              "Quebec emergency: 911 (universal).",
              "Pharmacie de garde = on-duty pharmacy out-of-hours.",
            ],
            simplified: {
              oneLiner:
                "Attention/Danger/Interdit are the warning trio. France: 112 emergency. Quebec: 911.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You're at a Paris park drinking-fountain and notice a small sign reading eau non potable. You should…",
                options: {
                  A: "Drink — eau non potable just means \"plain water\".",
                  B: "Not drink — it means the water isn't safe to drink.",
                  C: "Drink only after letting it run for a minute.",
                  D: "Boil it first.",
                },
                correct: "B",
                explanations: {
                  A: "Potable means drinkable; non potable means NOT drinkable.",
                  B: "Right — eau non potable means this water isn't tested or safe for drinking. Common on outdoor utility taps.",
                  C: "Letting it run doesn't make non-potable water safe.",
                  D: "If it's non-potable due to contamination, boiling may not handle all hazards. Just don't drink it.",
                },
                principle:
                  "Non potable = do not drink. Look for potable (drinkable) before using outdoor water in France.",
              },
              {
                n: 2,
                question:
                  "You're in Lyon and someone collapses. Which number do you dial from a mobile phone?",
                options: {
                  A: "911 — it's universal.",
                  B: "112 — the European general emergency number.",
                  C: "411 — directory.",
                  D: "999 — UK emergency.",
                },
                correct: "B",
                explanations: {
                  A: "911 won't reach French emergency services. It's a US/Canada number.",
                  B: "Right — 112 is the EU-wide emergency number; works from any mobile, free, even without a SIM. France also uses 15 (SAMU), 17 (police), 18 (fire) but 112 routes to all of them.",
                  C: "Directory enquiries — wrong service.",
                  D: "UK only.",
                },
                principle:
                  "112 is the European-wide emergency number, working from any mobile. Quebec uses 911 (same as the rest of North America).",
              },
              {
                kind: "fill-in",
                n: 3,
                question:
                  "What does the sign Issue de secours mean? (Two-word English phrase.)",
                acceptedAnswers: [
                  "emergency exit",
                  "fire exit",
                  "emergency exits",
                ],
                placeholder: "e.g. emergency exit",
                explanation:
                  "Issue (way out) + de secours (of rescue/emergency) = emergency exit. Found in any public building.",
                principle:
                  "Issue de secours = emergency exit. Know this on sight — useful in any sudden situation.",
              },
            ],
          },
        },
      ],
      sectionTest: null,
    },
  ],

  /* ============================================================
     Real-life scenarios (a.k.a. "mock exams")
     ============================================================ */
  mockExams: [
    {
      id: "s1-cafe-paris",
      title: "Scenario: Ordering breakfast at a Paris café",
      blurb:
        "You walk into a small café in Paris at 9 a.m. for breakfast. Navigate the greeting, ordering, paying, and leaving — all in French.",
      timeMinutes: 15,
      passPct: 0.7,
      scoreBands: [
        {
          min: 0,
          max: 69,
          verdict: "Not quite",
          message:
            "Re-read Module 1 (greetings) and Module 3 (café & restaurant). The grammar is fine — the gap is usually in matching politeness register to the situation.",
        },
        {
          min: 70,
          max: 100,
          verdict: "Café-fluent",
          message:
            "You can walk into a French café, order breakfast, pay, and leave without switching to English. The single highest-leverage daily-life skill — well done.",
        },
      ],
      questions: [
        {
          n: 1,
          question:
            "Step 1: You walk in at 9 a.m. The barista catches your eye. What's the first thing you say?",
          options: {
            A: "Salut!",
            B: "Bonjour!",
            C: "Bonsoir!",
            D: "Excusez-moi.",
          },
          correct: "B",
          principle:
            "Bonjour is the daytime opener — the politeness floor in any French shop, even before your order.",
        },
        {
          n: 2,
          question:
            "Step 2: You want a small espresso and a croissant. The politest phrasing is…",
          options: {
            A: "Café et croissant.",
            B: "Donnez-moi un café et un croissant.",
            C: "Je voudrais un café et un croissant, s'il vous plaît.",
            D: "Je veux café croissant maintenant.",
          },
          correct: "C",
          principle:
            "Je voudrais [items] + s'il vous plaît is the universal polite order frame.",
        },
        {
          n: 3,
          question:
            "Step 3: The barista asks Vous prenez ça ici ou à emporter? They're asking…",
          options: {
            A: "Are you ordering for someone else?",
            B: "For here or to go?",
            C: "Do you have exact change?",
            D: "Is this your first time here?",
          },
          correct: "B",
          principle:
            "Ici (here) or à emporter (to take away) — basic dine-in-vs-takeaway question.",
        },
        {
          n: 4,
          question:
            "Step 4: You finish, want the bill. What do you say?",
          options: {
            A: "Au revoir!",
            B: "L'addition, s'il vous plaît.",
            C: "Je voudrais payer maintenant.",
            D: "C'est combien?",
          },
          correct: "B",
          principle:
            "L'addition s'il vous plaît is the canonical bill-request. C'est combien? would work for a one-item till, but at a sit-down café it's L'addition.",
        },
        {
          n: 5,
          question:
            "Step 5: The bill is 5,80 €. You pay with a 10 € note. The barista hands you change. What do you say as you take it?",
          options: {
            A: "Pardon.",
            B: "Au revoir.",
            C: "Merci, au revoir!",
            D: "Je voudrais.",
          },
          correct: "C",
          principle:
            "Merci to thank for the change, au revoir to close out the interaction. Both expected on exit.",
        },
      ],
    },
    {
      id: "s2-lost-in-quebec-city",
      title: "Scenario: Lost in Quebec City, looking for the tourist office",
      blurb:
        "You're a tourist in Quebec City, can't find l'office de tourisme, and need to ask a passerby. Get from \"I'm lost\" to \"thank you, I know where to go now\".",
      timeMinutes: 15,
      passPct: 0.7,
      scoreBands: [
        {
          min: 0,
          max: 69,
          verdict: "Re-read Module 4",
          message:
            "Asking-for-directions phrases are short but matter for tone. Revisit Module 4 (où est, direction words, transit) and try again.",
        },
        {
          min: 70,
          max: 100,
          verdict: "Direction-asker",
          message:
            "You can stop strangers, ask politely, parse the answer, and confirm. This unlocks any city in French.",
        },
      ],
      questions: [
        {
          n: 1,
          question:
            "You spot a friendly-looking person on the sidewalk. How do you open the conversation?",
          options: {
            A: "Hé!",
            B: "Excusez-moi, monsieur/madame.",
            C: "Salut, ça va?",
            D: "Au revoir.",
          },
          correct: "B",
          principle:
            "Excusez-moi + monsieur/madame is the polite stranger-opener. Salut/ça va is too familiar with a stranger.",
        },
        {
          n: 2,
          question:
            "Now you ask where the tourist office is. What's the right grammar?",
          options: {
            A: "Où est l'office de tourisme?",
            B: "Où sont l'office de tourisme?",
            C: "Tourisme office où?",
            D: "Quand l'office de tourisme?",
          },
          correct: "A",
          principle:
            "Où est (singular) because l'office is singular. Sont is plural; quand asks when, not where.",
        },
        {
          n: 3,
          question:
            "They reply: C'est à deux coins de rue, tout droit, sur votre gauche. The tourist office is…",
          options: {
            A: "Two streets away, turn right at the corner.",
            B: "Two blocks straight ahead, on your left.",
            C: "Two minutes away, on the right.",
            D: "Far — take the metro.",
          },
          correct: "B",
          principle:
            "Coin de rue = block / street corner. Tout droit = straight. Sur votre gauche = on your left.",
        },
        {
          n: 4,
          question:
            "Their answer was fast and you missed the middle. What do you say to ask them to slow down?",
          options: {
            A: "Pouvez-vous parler plus lentement, s'il vous plaît?",
            B: "Je ne parle pas français.",
            C: "Plus fort!",
            D: "Au revoir.",
          },
          correct: "A",
          principle:
            "Pouvez-vous parler plus lentement? = can you speak more slowly? Universal rescue line. Plus fort = louder (different problem).",
        },
        {
          n: 5,
          question:
            "Confirmation step: you repeat the route back to them. Which phrasing is most natural?",
          options: {
            A: "Alors, tout droit, deux coins de rue, à gauche?",
            B: "Bonjour, je voudrais l'office de tourisme.",
            C: "Vous êtes sûr?",
            D: "Au revoir et merci.",
          },
          correct: "A",
          principle:
            "Repeating the key landmarks back closes the loop and catches misunderstandings. Alors... is the natural \"so...\" opener.",
        },
        {
          n: 6,
          question:
            "How do you thank them and end the exchange?",
          options: {
            A: "Au revoir.",
            B: "Merci beaucoup, bonne journée!",
            C: "S'il vous plaît.",
            D: "Pardon.",
          },
          correct: "B",
          principle:
            "Merci beaucoup (thanks very much) + bonne journée (have a good day) is the warm, complete close.",
        },
      ],
    },
  ],
};
