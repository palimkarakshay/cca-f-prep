/* ------------------------------------------------------------------
   Curriculum data — the single source of truth for the self-study app.

   Shape:
     CURRICULUM = {
       schemaVersion: <int>,
       sections: [
         {
           id, n, title, sourceCourse, blurb,
           concepts: [
             { id, code, title, bloom, lesson, quiz }
           ],
           sectionTest
         }
       ]
     }

   Lesson shape (when authored):
     {
       status: "ready",                       // "draft" | "ready"
       paragraphs: ["...", "..."],            // body text, plain
       keyPoints: ["..."],                    // bulleted takeaways
       examples: [{ title, body }],           // optional worked examples
       pitfalls: ["..."],                     // common mistakes / failure modes
       notesRef: "00-academy-basics/notes/..." // pointer back to the source notes
     }

   Quiz / sectionTest shape (when authored):
     {
       questions: [
         {
           n, question,
           options: { A, B, C, D },
           correct: "A"|"B"|"C"|"D",
           explanations: { A, B, C, D },
           principle: "...",
           bSkills: ["B1.1", ...]              // which B-codes this Q evidences
         }
       ]
     }

   Adding a new concept = push an object into the section's concepts.
   Adding a new section = push a section. Both auto-render in the dashboard.
   No app.js changes required for content updates.

   Bloom column matches 09-progress-tracker/skills-matrix.md:
     R = Remember, U = Understand, A = Apply, An = Analyze, E = Evaluate, C = Create
------------------------------------------------------------------ */

const CURRICULUM = {
  schemaVersion: 1,
  sections: [
    {
      id: "s1-claude-101",
      n: 1,
      title: "Claude 101",
      sourceCourse: "Anthropic Academy — Claude 101",
      blurb: "Mental model of Claude.ai products. Projects, artifacts, file attachments, model picker. The non-API surface.",
      concepts: [
        { id: "b1-1", code: "B1.1", title: "Project vs RAG corpus",            bloom: "U", lesson: null, quiz: null },
        { id: "b1-2", code: "B1.2", title: "Product-tier vs API-level limit",  bloom: "A", lesson: null, quiz: null },
        { id: "b1-3", code: "B1.3", title: "Artifact vs inline message",       bloom: "E", lesson: null, quiz: null },
        { id: "b1-4", code: "B1.4", title: "Context cost of N file uploads",   bloom: "A", lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s2-ai-fluency",
      n: 2,
      title: "AI Fluency: Framework & Foundations",
      sourceCourse: "Anthropic Academy — AI Fluency: Framework & Foundations",
      blurb: "The 4D framework — Description, Delegation, Discernment, Diligence — for diagnosing AI failures by structural cause, not surface symptom.",
      concepts: [
        { id: "b2-1", code: "B2.1", title: "Classify failure into a 4D",           bloom: "An", lesson: null, quiz: null },
        { id: "b2-2", code: "B2.2", title: "Identify mis-delegation",              bloom: "An", lesson: null, quiz: null },
        { id: "b2-3", code: "B2.3", title: "Write a structured description",       bloom: "A",  lesson: null, quiz: null },
        { id: "b2-4", code: "B2.4", title: "Run description ↔ discernment loop",   bloom: "A",  lesson: null, quiz: null },
        { id: "b2-5", code: "B2.5", title: "Name the diligence concern",           bloom: "E",  lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s3-claude-api",
      n: 3,
      title: "Building with the Claude API",
      sourceCourse: "Anthropic Academy — Building with the Claude API",
      blurb: "Message API, system vs user roles, tool use, structured output, prompt caching, few-shots as turns.",
      concepts: [
        { id: "b3-1", code: "B3.1", title: "Place instruction in system vs user",          bloom: "E",  lesson: null, quiz: null },
        { id: "b3-2", code: "B3.2", title: "Few-shots as alternating turns",               bloom: "A",  lesson: null, quiz: null },
        { id: "b3-3", code: "B3.3", title: "Trace tool-use loop / stop_reason",            bloom: "An", lesson: null, quiz: null },
        { id: "b3-4", code: "B3.4", title: "Place cache_control marker",                   bloom: "E",  lesson: null, quiz: null },
        { id: "b3-5", code: "B3.5", title: "Tool-schema vs prompt-only structured output", bloom: "E",  lesson: null, quiz: null },
        { id: "b3-6", code: "B3.6", title: "Detect system-field leak",                     bloom: "An", lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s4-mcp",
      n: 4,
      title: "Introduction to MCP",
      sourceCourse: "Anthropic Academy — Introduction to MCP",
      blurb: "Model Context Protocol primitives (tool / resource / prompt), transports (stdio / HTTP+SSE), and what auth boundary they imply.",
      concepts: [
        { id: "b4-1", code: "B4.1", title: "Classify tool / resource / prompt",      bloom: "An", lesson: null, quiz: null },
        { id: "b4-2", code: "B4.2", title: "stdio vs HTTP+SSE",                      bloom: "E",  lesson: null, quiz: null },
        { id: "b4-3", code: "B4.3", title: "Reject non-MCP transports",              bloom: "R",  lesson: null, quiz: null },
        { id: "b4-4", code: "B4.4", title: "Diagnose wrong-tool-pick to description", bloom: "An", lesson: null, quiz: null },
        { id: "b4-5", code: "B4.5", title: "Server-per-capability vs monolith",      bloom: "E",  lesson: null, quiz: null },
        { id: "b4-6", code: "B4.6", title: "Auth at transport, not in tool input",   bloom: "A",  lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s5-claude-code-101",
      n: 5,
      title: "Claude Code 101",
      sourceCourse: "Anthropic Academy — Claude Code 101",
      blurb: "Claude Code anatomy: hooks, slash commands, permissions, the CLAUDE.md / settings.json split.",
      concepts: [
        { id: "b5-1", code: "B5.1", title: "Place hook on correct event",         bloom: "A",  lesson: null, quiz: null },
        { id: "b5-2", code: "B5.2", title: "Predict permission cascade",          bloom: "An", lesson: null, quiz: null },
        { id: "b5-3", code: "B5.3", title: "Route rule (CLAUDE.md/skill/hook)",   bloom: "E",  lesson: null, quiz: null },
        { id: "b5-4", code: "B5.4", title: "Author slash command",                bloom: "A",  lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s6-claude-code-action",
      n: 6,
      title: "Claude Code in Action",
      sourceCourse: "Anthropic Academy — Claude Code in Action",
      blurb: "Lifecycle events end-to-end, hook trust levels, subagents vs inline, CI surface, watermarks.",
      concepts: [
        { id: "b6-1", code: "B6.1", title: "Order all hook events",            bloom: "R",  lesson: null, quiz: null },
        { id: "b6-2", code: "B6.2", title: "Hook vs CLAUDE.md by trust level", bloom: "E",  lesson: null, quiz: null },
        { id: "b6-3", code: "B6.3", title: "Predict no-watermark loop failure", bloom: "An", lesson: null, quiz: null },
        { id: "b6-4", code: "B6.4", title: "Subagent vs inline",               bloom: "E",  lesson: null, quiz: null },
        { id: "b6-5", code: "B6.5", title: "CI surface blast radius",          bloom: "An", lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s7-skills",
      n: 7,
      title: "Introduction to Agent Skills",
      sourceCourse: "Anthropic Academy — Introduction to Agent Skills",
      blurb: "Skills as user-invoked capabilities. Routing between skill / slash / CLAUDE.md / hook by invocation model.",
      concepts: [
        { id: "b7-1", code: "B7.1", title: "Skill vs slash vs CLAUDE.md vs hook", bloom: "An", lesson: null, quiz: null },
        { id: "b7-2", code: "B7.2", title: "Critique skill description",          bloom: "E",  lesson: null, quiz: null },
        { id: "b7-3", code: "B7.3", title: "Place skill (project/user/plugin)",   bloom: "A",  lesson: null, quiz: null },
        { id: "b7-4", code: "B7.4", title: "Detect kitchen-sink skill",           bloom: "An", lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s8-subagents",
      n: 8,
      title: "Introduction to Subagents",
      sourceCourse: "Anthropic Academy — Introduction to Subagents",
      blurb: "Subagent triggers (parallelism, context isolation), the cost model, and what the parent does and does not see.",
      concepts: [
        { id: "b8-1", code: "B8.1", title: "Two valid spawn triggers",   bloom: "R",  lesson: null, quiz: null },
        { id: "b8-2", code: "B8.2", title: "Critique underbriefed prompt", bloom: "E",  lesson: null, quiz: null },
        { id: "b8-3", code: "B8.3", title: "Cost of unnecessary splits",  bloom: "An", lesson: null, quiz: null },
        { id: "b8-4", code: "B8.4", title: "What parent does NOT see",    bloom: "U",  lesson: null, quiz: null }
      ],
      sectionTest: null
    },
    {
      id: "s9-cowork",
      n: 9,
      title: "Introduction to Claude Cowork",
      sourceCourse: "Anthropic Academy — Introduction to Claude Cowork",
      blurb: "Long-running agentic work, plugins vs skills, checkpoint cadence, the set-and-forget anti-pattern.",
      concepts: [
        { id: "b9-1", code: "B9.1", title: "Plugin vs skill",         bloom: "U",  lesson: null, quiz: null },
        { id: "b9-2", code: "B9.2", title: "Add checkpoint cadence",  bloom: "E",  lesson: null, quiz: null },
        { id: "b9-3", code: "B9.3", title: "Detect set-and-forget",   bloom: "An", lesson: null, quiz: null }
      ],
      sectionTest: null
    }
  ]
};

if (typeof window !== "undefined") window.CURRICULUM = CURRICULUM;
