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
        {
          id: "b1-1", code: "B1.1", title: "Project vs RAG corpus", bloom: "U",
          lesson: {
            status: "ready",
            paragraphs: [
              "A Claude.ai *Project* gives one chat (or many) a persistent system prompt plus a small attached file corpus. Files attached to a Project are loaded into the model's context for every chat in that Project — every file, every time, as raw text.",
              "Critically: there is no semantic search, no embeddings index, no retrieval step. The Project does not pick the most relevant file for your question. It puts them all in front of the model and lets attention sort it out.",
              "A *RAG* system is the opposite: an embeddings index sits between the user question and the documents. Only the top-k most relevant chunks ride into context. The corpus can be vastly larger than the model's context window because retrieval filters before the model ever sees the data.",
              "This single distinction explains why answer quality degrades as you add files to a Claude.ai Project. The model isn't confused — it's correctly attending to a noisier prompt. Adding more files makes the prompt noisier, not smarter."
            ],
            keyPoints: [
              "Project = in-context file storage. Every file loads every chat.",
              "No embeddings index. No retriever. No vector store.",
              "Quality degrades with file count because attention competes against more text.",
              "RAG = retrieval before context. Corpus can be unbounded; context cost is constant."
            ],
            examples: [
              {
                title: "Why uploading 40 PDFs to a Project hurts",
                body: "All 40 PDFs land in the system context for every chat. The model has to find the relevant one inside a wall of text — and worse, irrelevant content starts to compete for attention with the actual answer. The fix isn't 'better prompting'; it's switching to retrieval (RAG, MCP server, etc.)."
              }
            ],
            pitfalls: [
              "Treating a Project like a corpus: 'I'll just upload all our docs and Claude can answer across them.' Works at 3 files. Breaks at 30.",
              "Assuming Claude.ai exposes an 'index' or 'vector store' you can query. It does not. There is nothing to re-index, no quota to hit."
            ],
            notesRef: "00-academy-basics/notes/01-claude-101.md"
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "A team uploads 40 PDFs to a Claude.ai Project so the assistant can answer across the corpus. As more PDFs are added, answer quality degrades — irrelevant content keeps surfacing. What is happening?",
                options: {
                  A: "The model's context window is too small to hold the embeddings index.",
                  B: "Project files are loaded into context, not retrieved by similarity — so all of them compete for attention.",
                  C: "Claude.ai's project retriever needs an explicit re-index call after each upload.",
                  D: "The Project's vector store has hit its quota and is silently dropping older files."
                },
                correct: "B",
                explanations: {
                  A: "Wrong axis. There is no embeddings index in a Claude.ai Project — the misconception this option encodes is the question's whole trap.",
                  B: "Right. Project files are in-context file storage, not RAG. Every chat loads attached files as raw text up to the context limit; when relevance pressure goes up, retrieval-by-similarity is what fixes it, not 'more files'.",
                  C: "Fabricated mechanism. There is no retriever to re-index.",
                  D: "Fabricated mechanism. There is no vector store, hence no quota."
                },
                principle: "A Claude.ai Project is in-context file storage, not retrieval. If you need a corpus that scales, you need RAG — not more uploads.",
                bSkills: ["B1.1"]
              },
              {
                n: 2,
                question: "A user opens a Claude.ai Project with 8 files attached and notices their per-message context budget feels very small. Why?",
                options: {
                  A: "Project files compete for retrieval slots with the user message; the system reserves room for the top-k.",
                  B: "All Project files are loaded into context for every chat, taking from the same context budget as the user turn.",
                  C: "Projects use a separate 'file context' budget; the user-message budget should not be affected.",
                  D: "The model needs context space to embed each file before answering."
                },
                correct: "B",
                explanations: {
                  A: "There are no retrieval slots and no top-k. Projects don't retrieve.",
                  B: "Right. Project files load into the same context window as the user turn. 8 files of 30 KB each = ~24 KB of system context burned every chat, leaving less room for the conversation.",
                  C: "There is no separate budget. One window, shared.",
                  D: "Embedding doesn't happen at chat time, and even if it did it wouldn't consume context."
                },
                principle: "Project files cost context like any other text in the prompt. Attaching more files = smaller per-message budget for the actual conversation.",
                bSkills: ["B1.1", "B1.4"]
              },
              {
                n: 3,
                question: "Which best describes when to use a Claude.ai Project versus when to build a RAG system?",
                options: {
                  A: "Project: small corpus that all needs to be considered every chat. RAG: corpus too big to fit in context, or only the relevant slice should be retrieved.",
                  B: "Always Project; RAG is a legacy pattern for older Claude versions.",
                  C: "RAG for short documents, Project for long ones.",
                  D: "They are interchangeable; the choice is purely a cost optimization."
                },
                correct: "A",
                explanations: {
                  A: "Right. Project = small, durable, every-chat context. RAG = scale-out via retrieval. The deciding axis is whether all the content needs to be present every chat.",
                  B: "RAG is the standard pattern for any non-trivial corpus. Newer Claude versions don't change that.",
                  C: "Document length isn't the deciding factor. Corpus size and the every-chat-vs-on-demand question are.",
                  D: "They have different operational shapes. Treating them as interchangeable will produce one of the failure modes from the lesson."
                },
                principle: "Choose by access pattern, not by file size. Every-chat → Project. On-demand / scale-out → RAG.",
                bSkills: ["B1.1"]
              }
            ]
          }
        },
        { id: "b1-2", code: "B1.2", title: "Product-tier vs API-level limit",  bloom: "A", lesson: null, quiz: null },
        { id: "b1-3", code: "B1.3", title: "Artifact vs inline message",       bloom: "E", lesson: null, quiz: null },
        { id: "b1-4", code: "B1.4", title: "Context cost of N file uploads",   bloom: "A", lesson: null, quiz: null }
      ],
      sectionTest: {
        title: "Section 1 test — Claude 101",
        passPct: 0.7,
        questions: [
          {
            n: 1,
            question: "You're advising a team that wants to make 200 internal docs queryable by Claude. They propose attaching all 200 to a single Claude.ai Project. What's the strongest objection?",
            options: {
              A: "Projects only support up to 50 files; this hits the limit.",
              B: "Each chat would load all 200 docs into context, exceeding the window and degrading attention even where it fits.",
              C: "Projects are per-user; the team can't share one across the team.",
              D: "The UI doesn't allow bulk uploads; they'd have to add files one at a time."
            },
            correct: "B",
            explanations: {
              A: "Wrong axis. Even if the file-count limit weren't an issue, the underlying problem (no retrieval, all-in-context) is the real reason.",
              B: "Right. Projects are in-context file storage. 200 docs = 200 docs of system context every chat. Quality degrades long before the hard window limit; relevance pressure makes retrieval the right tool.",
              C: "Sharing is a permissions concern, not the architectural objection.",
              D: "UI ergonomics; not the principled objection."
            },
            principle: "Project ≠ corpus. For 'queryable across N docs', reach for retrieval (RAG/MCP), not more uploads.",
            bSkills: ["B1.1", "B1.4"]
          },
          {
            n: 2,
            question: "A pro-tier user notices their per-message context limit is much smaller than what the Claude API exposes for the same model. What explains the gap?",
            options: {
              A: "The API runs a different (larger) version of the model.",
              B: "Product-tier limits are subscription-side caps, separate from API-level model capacity.",
              C: "The user must have hit a daily message quota that triggered a downgrade.",
              D: "Claude.ai compresses prompts before sending them to the model, reducing usable context."
            },
            correct: "B",
            explanations: {
              A: "Same model, different surface. The API and Claude.ai expose the same underlying model with different envelopes.",
              B: "Right. Per-product limits (context length, daily caps, model selection) are subscription-tier features. The API exposes the model's actual capacity; Claude.ai sits behind a product-side envelope.",
              C: "Quotas affect message count, not per-message context length.",
              D: "Fabricated. The product surface doesn't compress prompts behind your back."
            },
            principle: "Product-tier limits ≠ API-level model capacity. When users see 'small' context on Claude.ai, they're hitting the subscription envelope, not the model's ceiling.",
            bSkills: ["B1.2"]
          },
          {
            n: 3,
            question: "A user asks Claude to draft a 4 000-word policy doc. Why is producing it as an Artifact preferable to inlining the text in the chat reply?",
            options: {
              A: "Artifacts cost less per token than inline text.",
              B: "Artifacts isolate the long output from conversational context, so iteration doesn't bloat the chat history, and the Artifact can be re-rendered/edited directly.",
              C: "Inline text is hard-capped at 1 000 words; Artifacts have no such limit.",
              D: "Artifacts get extra fact-checking from a secondary model."
            },
            correct: "B",
            explanations: {
              A: "Token cost is identical. The benefit is structural, not economic.",
              B: "Right. The point of the Artifact construct is *separation*: the long deliverable lives outside the chat thread and can be iterated without polluting context or replaying the entire doc on every turn.",
              C: "Fabricated limit. There is no 1 000-word inline cap.",
              D: "Fabricated. Artifacts aren't reviewed by a separate model."
            },
            principle: "Artifacts exist to keep long deliverables out of conversational context — for iteration, re-rendering, and direct editing without replay overhead.",
            bSkills: ["B1.3"]
          },
          {
            n: 4,
            question: "A team attaches 12 PDFs (~30 KB each) to a Claude.ai Project. What is the most accurate description of the per-message context cost?",
            options: {
              A: "0 KB — Project files use a separate budget that doesn't count against the message context.",
              B: "~360 KB of context is consumed by Project files on every chat, leaving the rest of the window for the conversation and answer.",
              C: "Cost is paid only on the first message; subsequent messages reuse a cached representation at no context cost.",
              D: "Cost depends on the subscription tier; pro users pay no context cost for Project files."
            },
            correct: "B",
            explanations: {
              A: "There is no separate budget. One window, shared.",
              B: "Right. Project files load into the same context window as the rest of the prompt. 12 × 30 KB ≈ 360 KB consumed every chat. That's the budget the conversation and answer share with the corpus.",
              C: "There is no first-turn-only caching of Project files at this layer; they're re-included every turn.",
              D: "Subscription doesn't change the per-message context math."
            },
            principle: "Project files cost context every chat. N × file_size = system context burned per turn — plan capacity accordingly.",
            bSkills: ["B1.4"]
          }
        ]
      }
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
