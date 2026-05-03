/* ------------------------------------------------------------------
   Sewing for Beginners curriculum.

   Two modules (sections), four techniques (concepts), one tote-bag
   final project (mock exam). No Bloom-taxonomy fields — the badge
   simply doesn't render for this pack.

   Shape documented in `web/src/content/curriculum-types.ts`.
------------------------------------------------------------------ */

import type { Curriculum } from "./_types";

export const CURRICULUM: Curriculum = {
  schemaVersion: 1,
  sections: [
    {
      id: "m1-hand-stitching",
      n: 1,
      title: "Hand-stitching foundations",
      blurb:
        "Threading, knotting, and the four stitches you'll reach for in 90% of repairs.",
      concepts: [
        {
          id: "t1-thread-and-knot",
          code: "T1.1",
          title: "Threading a needle and tying a starter knot",
          lesson: {
            status: "ready",
            paragraphs: [
              "Cut a length of thread no longer than your forearm — long enough to work with, short enough not to tangle. Trim the end at a 45° angle with sharp scissors so the fibers compress into a point. A blunt-cut end fans out and won't slide through the eye.",
              "Hold the needle still and bring the thread to it (not the other way around). For darker fabrics or eye-strained moments, hold the needle in front of a piece of white paper — the contrast makes the eye pop.",
              "For most stitching, use a single thread and tie a small knot at one end. Wrap the tail twice around your index fingertip, then roll the wraps off with your thumb so they twist together. Pull tight — that's a quilter's knot, sturdy and small.",
            ],
            keyPoints: [
              "Cut thread no longer than your forearm; trim the end at 45°.",
              "Bring thread to needle; use white paper behind the eye for contrast.",
              "Quilter's knot: wrap twice around fingertip, roll off, pull tight.",
            ],
            simplified: {
              oneLiner:
                "Short thread + sharp angled cut + white background = needle threads first try.",
              paragraphs: [
                "If you keep missing the eye, your thread end is probably fanned out. Re-cut it on a steep angle with sharp scissors and try again.",
              ],
            },
            deeper: {
              oneLiner:
                "Needle eye geometry, thread twist (S vs Z), and thread weight all interact with how much thread you can pull through cleanly.",
              paragraphs: [
                "Needle eyes aren't all the same. A 'sharps' needle has an oblong eye sized for one strand of standard cotton. A 'crewel' or 'embroidery' needle has a longer eye to fit floss or doubled thread. Trying to pull two strands through a sharps eye is the most common cause of fraying mid-stitch.",
                "Thread twist matters too. Most cotton thread is Z-twist (the fibers spiral up-and-to-the-right). Pulling against the twist (e.g. dragging the thread over fabric in the wrong direction) progressively unspins it. If you find your thread getting visibly fluffier as you sew, flip the spool over and try again — you've been pulling against the twist.",
              ],
              keyPoints: [
                "Match needle eye size to thread weight. Sharps for 1 strand, crewel for floss / doubled thread.",
                "Z-twist thread (most cotton) unspins when pulled against the twist — flip the spool if it's fraying.",
                "Beeswax run on the thread (one short pass) reduces tangling on long stitching runs.",
              ],
              furtherReading: [
                {
                  title: "Singer needle compatibility chart",
                  href: "https://www.singer.com/needle-compatibility",
                },
              ],
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Why cut the thread end at a 45° angle before threading?",
                options: {
                  A: "It looks more professional in the finished seam.",
                  B: "The angled cut compresses the fibers into a point so they slide through the eye.",
                  C: "It prevents the thread from unraveling later.",
                  D: "It makes the knot at the other end easier to tie.",
                },
                correct: "B",
                explanations: {
                  A: "Cosmetics aren't the reason — the cut end is hidden inside the work.",
                  B: "Right — a flat-cut end fans out and won't fit through the eye.",
                  C: "Unraveling is prevented by the knot, not the angle.",
                  D: "The knot at the opposite end is unrelated to the threading end.",
                },
                principle:
                  "Sharp angled cut → compressed fiber point → easy threading.",
              },
              {
                n: 2,
                question: "What's the right thread length for hand stitching?",
                options: {
                  A: "As long as possible — minimizes re-threading.",
                  B: "About one arm-span — gives plenty of working room.",
                  C: "About the length of your forearm — long enough to work, short enough not to tangle.",
                  D: "Exactly the length of the seam you're sewing.",
                },
                correct: "C",
                principle: "Forearm length balances reach against tangling.",
              },
            ],
          },
        },
        {
          id: "t2-running-and-back-stitch",
          code: "T1.2",
          title: "Running stitch and back stitch",
          lesson: {
            status: "ready",
            paragraphs: [
              "The running stitch is the alphabet of hand sewing: pass the needle in and out of the fabric in a straight line, evenly spaced. Use it for basting (temporary holds) and gathers. It's quick but not strong — a tug undoes it.",
              "The back stitch is the running stitch's stronger sibling. Each new stitch goes backwards into the end of the previous one, so the thread is doubled along the seam. Use it for repairs that need to hold — popped buttonhole edges, ripped trouser inseams, anything you'd otherwise reach for the machine.",
              "Spacing matters more than speed. Aim for stitches around 3 mm long with 3 mm gaps. A few even stitches read better than a long line of uneven ones.",
            ],
            keyPoints: [
              "Running stitch: in-and-out, even spacing, quick but weak. Use for basting.",
              "Back stitch: each stitch reverses into the previous one — doubled thread, much stronger.",
              "Aim for ~3 mm stitches with even spacing; even beats fast.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "You're repairing a popped trouser inseam. Which stitch is right?",
                options: {
                  A: "Running stitch — it's faster.",
                  B: "Back stitch — the doubled thread holds under tension.",
                  C: "Either; the choice is cosmetic.",
                  D: "Neither; this needs a sewing machine.",
                },
                correct: "B",
                explanations: {
                  A: "Running stitch fails under tension — the trouser will pop again.",
                  B: "Back stitch's doubled thread is the hand-sewing equivalent of a machine straight stitch.",
                  C: "The choice is structural, not cosmetic.",
                  D: "Hand back stitch is plenty for an inseam repair.",
                },
                principle:
                  "Strength under tension → back stitch (doubled thread).",
              },
              {
                n: 2,
                question: "What makes hand-stitches look professional?",
                options: {
                  A: "Speed — getting through it before fatigue sets in.",
                  B: "Even spacing — consistency reads as skill.",
                  C: "Tiny stitches — the smaller the better.",
                  D: "Thread color matching the fabric exactly.",
                },
                correct: "B",
                principle: "Consistency > speed > size.",
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
              "Which combination is correct for stitching a button back on a shirt?",
            options: {
              A: "Cross-cut thread end, running stitch, no knot.",
              B: "Angled-cut thread, back stitch through the holes 4–5 times, knot the underside.",
              C: "Doubled thread, running stitch through the holes once.",
              D: "Single thread, machine satin stitch.",
            },
            correct: "B",
            principle: "Angled cut + back stitch + secure knot = lasting button repair.",
          },
          {
            n: 2,
            question:
              "When is a running stitch the right choice over a back stitch?",
            options: {
              A: "Inseams and high-tension repairs.",
              B: "Basting — a temporary hold while you align two pieces before machine sewing.",
              C: "Hemming a heavy curtain.",
              D: "Repairing a torn pocket lining.",
            },
            correct: "B",
            principle: "Running stitch = quick + weak = temporary holds only.",
          },
        ],
      },
    },
    {
      id: "m2-machine-basics",
      n: 2,
      title: "Machine sewing basics",
      blurb:
        "Threading a domestic machine, choosing tension and stitch length, and sewing your first straight seam.",
      concepts: [
        {
          id: "t3-machine-threading",
          code: "T2.1",
          title: "Threading a domestic machine",
          lesson: {
            status: "ready",
            paragraphs: [
              "Every domestic machine has a numbered thread path printed on the body — usually arrows from the spool to the tension discs to the take-up lever to the needle. Follow it in order. Skipping any step (especially the take-up lever) causes the most common beginner symptom: a snarled mess of thread under the fabric.",
              "Raise the presser foot before threading. The tension discs are open when the foot is up and clamped when it's down; threading with the foot down means the thread doesn't seat between the discs and the tension is wrong from the first stitch.",
              "Once threaded, lower the needle by hand-cranking one full revolution. The needle should pick up the bobbin thread and bring a loop up through the throat plate. Pull both threads to the back under the foot — about 4 inches each — and you're ready to sew.",
            ],
            keyPoints: [
              "Follow the printed thread path in order — never skip the take-up lever.",
              "Raise the presser foot BEFORE threading so tension discs are open.",
              "Hand-crank one revolution to pick up the bobbin thread; both threads go to the back.",
            ],
            simplified: {
              oneLiner: "Foot up. Follow the arrows. Pick up the bobbin thread. Sew.",
            },
          },
          quiz: {
            questions: [
              {
                n: 1,
                question:
                  "Your machine is making a snarled mess of thread on the underside. What's the most likely cause?",
                options: {
                  A: "Bobbin tension is too tight.",
                  B: "You threaded the machine with the presser foot down, so the upper-thread tension never engaged.",
                  C: "The needle is too small for the fabric.",
                  D: "The fabric is too thin.",
                },
                correct: "B",
                explanations: {
                  A: "Bobbin tension changes manifest as evenly loose stitches, not a snarled mess.",
                  B: "Classic — tension discs only clamp the thread when the foot is up at threading time.",
                  C: "Needle size mostly affects skipped stitches, not thread snarls.",
                  D: "Thin fabric causes puckering, not snarls.",
                },
                principle:
                  "Threading with foot down = no upper tension = bird's-nest underside.",
              },
            ],
          },
        },
        {
          id: "t4-first-seam",
          code: "T2.2",
          title: "Sewing a straight seam with backstitch reinforcement",
          lesson: {
            status: "ready",
            paragraphs: [
              "Most straight seams use stitch length 2.5 (a metric used by most domestic machines, ≈ 10 stitches per inch). It's the goldilocks setting: long enough to sew quickly, short enough to hold.",
              "At the start AND end of every seam, sew 3–4 stitches forward, then 3–4 stitches in reverse, then continue. This 'reinforcement' locks the threads so the seam doesn't unravel from either end. Skipping it is why beginner seams fall apart at the edges.",
              "Keep the fabric edge aligned with the 5/8 inch (15 mm) mark on the throat plate — that's the standard seam allowance for garment sewing. Don't pull or push the fabric; let the feed dogs do the work.",
            ],
            keyPoints: [
              "Stitch length 2.5 for general seams.",
              "Reverse-then-forward at start AND end to lock the seam.",
              "Align the fabric edge with the 5/8\" guide; let the feed dogs pull, don't push.",
            ],
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "Why reinforce the start and end of every seam with reverse stitching?",
                options: {
                  A: "It looks tidier.",
                  B: "It locks the threads so the seam can't unravel from either end.",
                  C: "It tightens the bobbin tension.",
                  D: "It's only needed when sewing knits.",
                },
                correct: "B",
                principle: "Reverse-then-forward locks the thread tails.",
              },
              {
                n: 2,
                question: "Should you push the fabric through the machine to speed things up?",
                options: {
                  A: "Yes — it goes faster.",
                  B: "No — the feed dogs handle it; pushing skews stitches and can break the needle.",
                  C: "Only for thin fabrics.",
                  D: "Only when sewing curves.",
                },
                correct: "B",
                principle: "Feed dogs feed; you guide.",
              },
            ],
          },
        },
      ],
      sectionTest: null,
    },
  ],
  mockExams: [
    {
      id: "p1-tote-bag",
      title: "Final project: a simple tote bag",
      blurb:
        "Cut, hem, and seam two rectangles into a usable tote — your first finished sewn item.",
      timeMinutes: 60,
      passPct: 0.6,
      scoreBands: [
        {
          min: 0,
          max: 59,
          verdict: "Needs revisiting",
          message:
            "Re-read modules 1 and 2 with the project in front of you. The techniques are in the lessons; the assembly order is what we just walked through.",
        },
        {
          min: 60,
          max: 100,
          verdict: "Tote complete",
          message:
            "You've sewn a finished item end-to-end. Try the same project in a different fabric to consolidate the muscle memory.",
        },
      ],
      questions: [
        {
          n: 1,
          question:
            "You've cut two 16\" × 14\" fabric rectangles for a tote body. What's the right order of operations?",
          options: {
            A: "Sew the side and bottom seams first, then hem the top opening.",
            B: "Hem the top opening first, then sew the side and bottom seams with the hems aligned.",
            C: "Skip the top hem; the seam allowance is enough.",
            D: "Hem each side separately, then sew the bottom only.",
          },
          correct: "B",
          principle: "Hem the opening first → it's much harder once the bag is a tube.",
        },
        {
          n: 2,
          question: "Which thread color hides imperfect stitches best?",
          options: {
            A: "A bright contrasting color so problems are visible and fixable.",
            B: "A color slightly darker than the fabric's main tone — blends best because we read shadows.",
            C: "Pure white, regardless of fabric color.",
            D: "Always match the lining color.",
          },
          correct: "B",
          principle: "Slightly-darker thread reads as shadow, not as a line.",
        },
        {
          n: 3,
          question:
            "Your tote's bottom seam is puckering. What's the most common fix to try first?",
          options: {
            A: "Increase stitch length to 4.0 and re-sew.",
            B: "Re-thread the upper thread with the presser foot UP, so the tension engages.",
            C: "Switch to a heavier fabric.",
            D: "Add interfacing to the seam allowance.",
          },
          correct: "B",
          principle: "Puckering 9 times out of 10 is upper-thread tension; re-thread with foot up.",
        },
      ],
    },
  ],
};
