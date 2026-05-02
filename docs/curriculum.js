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
       ],
       mockExams: [                              // optional
         {
           id, title, blurb, sourceFile,
           timeMinutes, passPct,
           scoreBands: [ { min, max, verdict, message } ],
           questions                             // same shape as sectionTest.questions
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
       notesRef: "00-academy-basics/notes/..", // pointer back to the source notes
       simplified: {                          // optional — drives the "Simplify" toggle
         oneLiner: "...",                     // one-sentence TLDR
         analogy: "...",                      // plain-language analogy paragraph
         paragraphs: ["..."],                 // 1-3 simpler paragraphs
         keyPoints: ["..."]                   // optional simpler bullets
       }
     }
   When `simplified` is absent the toggle still appears and falls through
   to the "Ask Claude" panel so the user can ask for a custom simpler take.

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
            notesRef: "00-academy-basics/notes/01-claude-101.md",
            simplified: {
              oneLiner: "A Claude.ai Project pastes every attached file into every chat — it doesn't search them. RAG searches first, then pastes only the relevant bit.",
              analogy: "Think of a Project as a desk: every file you've stuck on it is in front of you when you sit down, all the time. RAG is a librarian: you ask a question, and only the relevant pages get handed to you. Stack 40 things on the desk and you can't find anything; ask the librarian for the same 40 and you get one tidy answer.",
              paragraphs: [
                "When you attach files to a Claude.ai Project, Claude reads all of them at the start of every chat. There is no smart search step. Add more files and Claude has more text to wade through — answers get noisier, not better.",
                "RAG (Retrieval-Augmented Generation) does the opposite. A separate index sits in front of the documents and only the pieces that match your question get passed to Claude. The corpus can be huge because Claude only ever sees the slice that matters."
              ],
              keyPoints: [
                "Project = full files, every chat. No search.",
                "RAG = search first, then send only the matching pieces.",
                "More files in a Project = worse answers, not better."
              ]
            }
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
        {
          id: "b1-4", code: "B1.4", title: "Context cost of N file uploads", bloom: "A",
          lesson: {
            status: "ready",
            paragraphs: [
              "B1.1 established the qualitative claim: a Claude.ai Project is in-context file storage, not retrieval. B1.4 makes that quantitative. Every file you attach to a Project is concatenated into the system context on *every* chat, every turn — there is no caching, no on-demand load, no top-k. The per-message cost of N files is roughly N × file_size in tokens, paid every turn for the life of the Project.",
              "Two things follow from that. First: the budget the conversation and the model's answer get is what's left of the context window after the files are loaded. With a 200 KB context budget and 150 KB of attached files, the user message and the answer share the remaining 50 KB. The 'context window feels small' complaint on a heavily-loaded Project is a direct consequence of this math, not a subscription tier issue.",
              "Second: even when N × file_size still fits, attention quality degrades non-linearly. The model has to find the relevant tokens inside an ever-growing wall of content. Distractor passages compete for attention with the actual question. The breaking point arrives long before the hard window limit — usually as 'answers get vaguer / cite the wrong file' rather than as a visible error.",
              "The decision rule is mechanical. If the access pattern is *every chat needs all of it*, a Project is the right shape and you must size N × file_size to leave conversational headroom. If the access pattern is *only the relevant slice should land in context*, you've outgrown a Project and you need retrieval (RAG / MCP server / search tool). Adding more files to a Project that's already too big does not help. It is the failure mode."
            ],
            keyPoints: [
              "Per-message cost ≈ N × file_size, paid every turn. No caching at this layer.",
              "Conversation budget = window − attached files. Heavy Projects shrink the budget visibly.",
              "Quality degrades from attention competition before the hard window limit fires.",
              "Threshold question: must every chat see all of it? If no, switch to retrieval — don't add files."
            ],
            examples: [
              {
                title: "Sizing a Project before attaching",
                body: "Window: ~200,000 tokens. Files: 12 PDFs, ~10,000 tokens each = 120,000 tokens of system context every chat. Conversation + answer share ~80,000 tokens — usually fine. Now add the 13th file at 100,000 tokens (a long policy doc): you've blown past the window and the Project will start dropping content silently. The fix is not 'shorten the conversation' — it's pulling that 13th file out of the Project and behind retrieval."
              },
              {
                title: "Diagnosing 'context feels tight'",
                body: "User reports: 'Claude is forgetting earlier turns sooner than usual.' Project has 8 files attached. Total: ~140,000 tokens of files in a 200,000-token window. The conversation budget is ~60,000 tokens — earlier turns are being squeezed out by the file load, not by anything wrong with the conversation. The fix is structural: drop files that don't need to be in every chat."
              }
            ],
            pitfalls: [
              "Believing 'Claude.ai caches Project files between turns.' It does not at this layer; cost is paid every turn.",
              "Assuming a separate 'file context budget' exists. There is one window, shared by files + conversation + answer.",
              "Treating 'add another file' as the default response when answer quality drops. The opposite is usually correct: pull files out and switch the access pattern."
            ],
            notesRef: "00-academy-basics/notes/01-claude-101.md",
            simplified: {
              oneLiner: "N attached files cost roughly N × file_size of context every chat — there is no caching, no retrieval, no separate budget.",
              analogy: "Imagine printing every attached file at the start of every conversation and stapling it to the front of your question. The pile grows; your speaking room shrinks; eventually the staple bursts. Adding more paper doesn't help — moving the rarely-needed pages off the desk does.",
              paragraphs: [
                "Every file you attach to a Claude.ai Project gets pasted into the prompt at the start of every chat. There is no clever caching — the same files are re-sent each turn.",
                "That means the room left for your question and Claude's answer is the context window minus all those files. Pile on too many and the conversation gets cramped, and answers start missing things even before you hit the hard limit.",
                "The fix is rarely 'add more files.' It's usually 'remove files that don't need to be in every chat,' or 'switch to a setup that searches before sending.'"
              ],
              keyPoints: [
                "Files load fresh every chat — no cache, no shortcut.",
                "Window ≠ unlimited. Files eat the same budget as the conversation.",
                "If quality drops, take files out — don't pile more in."
              ]
            }
          },
          quiz: {
            questions: [
              {
                n: 1,
                question: "A team attaches 10 internal docs (~20 KB each) to a Claude.ai Project. After the first week, users complain Claude 'forgets' earlier turns much sooner than expected. What is the most likely structural cause?",
                options: {
                  A: "The Project is silently summarizing earlier turns to make room.",
                  B: "The 10 docs are loaded into context every chat, shrinking the budget the conversation and answer share.",
                  C: "Claude.ai's tier-based cache eviction is dropping older turns under load.",
                  D: "The model is operating below its context limit but above its 'attention budget,' a separate cap."
                },
                correct: "B",
                explanations: {
                  A: "There is no automatic summarization at this layer.",
                  B: "Right. ~200 KB of files in the system context every turn leaves the conversation a much smaller working budget. Earlier turns drop because the window is genuinely tighter, not because anything is being summarized.",
                  C: "Fabricated mechanism. There is no tier-based cache eviction of conversation turns.",
                  D: "Fabricated. There is no separate 'attention budget' cap."
                },
                principle: "Per-message context budget = window − attached files. The 'forgetting' symptom is the math made visible.",
                bSkills: ["B1.4"]
              },
              {
                n: 2,
                question: "A user reports answer quality is poor and asks whether they should attach 5 more reference PDFs to their already-loaded Project. What is the strongest response?",
                options: {
                  A: "Yes — more reference material gives Claude more grounding to answer correctly.",
                  B: "Yes, but only if the new PDFs are smaller than the existing ones, to stay under the file-count limit.",
                  C: "No — adding files raises the per-turn context cost and increases attention competition. The fix is usually to remove files or move to retrieval, not add more.",
                  D: "No — Project files are write-once; the originals would have to be re-uploaded together."
                },
                correct: "C",
                explanations: {
                  A: "This is the canonical failure mode the lesson names. More files = more context cost + more attention competition, not better grounding.",
                  B: "File-count is not the binding constraint here; aggregate token cost and attention quality are.",
                  C: "Right. The corrective intervention when answer quality drops on a heavy Project is to reduce the file load or switch the access pattern (retrieval), not to add more.",
                  D: "Fabricated. Project files can be added and removed freely."
                },
                principle: "When a Project is already saturated, more files is the wrong direction. Either trim the corpus to what every chat truly needs, or move to retrieval.",
                bSkills: ["B1.4"]
              },
              {
                n: 3,
                question: "Which statement about per-message context cost on a Claude.ai Project is correct?",
                options: {
                  A: "Files are paid for once on first attach; subsequent chats reuse a cached representation at zero context cost.",
                  B: "Cost ≈ N × file_size every turn, regardless of whether the user's question relates to the files.",
                  C: "Cost is computed lazily — only the files relevant to the current question are loaded.",
                  D: "Cost is bounded by the subscription tier's daily token quota, not the per-message window."
                },
                correct: "B",
                explanations: {
                  A: "No first-turn caching at this layer. Files re-load every chat.",
                  B: "Right. Claude.ai Projects do not retrieve. All attached files load into the system context every turn, whether or not the question touches them. Cost is mechanical: N × file_size, every chat.",
                  C: "There is no relevance filter on Project files. That's the point of the Project / RAG distinction in B1.1.",
                  D: "Daily quotas govern message count, not per-message context cost."
                },
                principle: "Project context cost is mechanical and paid every turn. Plan capacity from N × file_size; expect no relevance filtering.",
                bSkills: ["B1.4"]
              }
            ]
          }
        }
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
  ],

  mockExams: [
    {
      id: "diagnostic-01",
      title: "Diagnostic 01 — Mixed Domain",
      blurb: "10 questions, ~20 min. Cold calibration across all five exam domains. Take it without notes — the score band tells you which domain to train first.",
      sourceFile: "07-mock-exams/diagnostic-01.md",
      timeMinutes: 20,
      passPct: 0.7,
      scoreBands: [
        {
          min: 9, max: 10,
          verdict: "Strong baseline",
          message: "Train misses' sub-areas only. One full mock per week to keep edges sharp."
        },
        {
          min: 7, max: 8,
          verdict: "Solid",
          message: "Train the misses' domains in full (notes + 5–10 challenges + a per-domain MCQ set). Skim the rest."
        },
        {
          min: 5, max: 6,
          verdict: "Sequence by exam weight",
          message: "Order by weight: D1 Agentic Arch (27%) → D4 Prompt Eng (20%) → D2 Claude Code (20%) → D3 Tool/MCP (18%) → D5 Context (15%)."
        },
        {
          min: 0, max: 4,
          verdict: "Slow down",
          message: "Notes first, then 1 worked example per sub-area before any MCQs. Re-take after one cycle."
        }
      ],
      questions: [
        {
          n: 1,
          question: "A team is building a research assistant that must (a) search across 12 internal knowledge bases, (b) cross-check facts across the results, and (c) write a final report. The current implementation runs as a single agentic loop calling tools sequentially. Median latency is 90 seconds and the assistant occasionally drops sources mid-report when the context grows long.\n\nWhat is the strongest reason to refactor to a coordinator-subagent pattern?",
          options: {
            A: "Subagents will reduce per-turn token cost because they run on cheaper models.",
            B: "Independent searches can run in parallel, and each subagent's intermediate context is isolated from the coordinator's.",
            C: "Subagents have access to a longer context window than the coordinator.",
            D: "The coordinator-subagent pattern is required when more than 10 tools are registered."
          },
          correct: "B",
          explanations: {
            A: "Wrong axis. Subagents inherit the parent model unless explicitly configured otherwise; cost is not the canonical justification.",
            B: "Right. The two real wins of coordinator-subagent are parallel execution of independent work and context isolation — the subagent's intermediate scratch never lands in the coordinator's window.",
            C: "False. Subagents don't get a bigger window; they get a fresh one.",
            D: "Fabricated. There is no '10 tools' threshold."
          },
          principle: "Reach for coordinator-subagent when (a) work is independently parallelizable or (b) intermediate context would otherwise pollute the parent. Not for cost, not for window size.",
          domain: "1. Agentic Architecture",
          subArea: "Coordinator-subagent vs. linear loop"
        },
        {
          n: 2,
          question: "A developer wants Claude Code to refuse to run any shell command containing `rm -rf` or `--no-verify`, regardless of the user's permission mode.\n\nWhich hook event should this rule live in?",
          options: {
            A: "SessionStart — block at session boot before any tool call happens.",
            B: "PreToolUse — inspect and reject the tool call before it executes.",
            C: "PostToolUse — inspect the result and warn if a dangerous command ran.",
            D: "Stop — analyze the full transcript at the end of the session."
          },
          correct: "B",
          explanations: {
            A: "SessionStart runs once at boot with no per-tool-call context. Can't inspect commands.",
            B: "Right. PreToolUse is the only event that fires before a tool call and can return a blocking decision. This is the canonical home for command guardrails.",
            C: "PostToolUse runs after the command. Too late to prevent harm.",
            D: "Stop runs once at session end. Same problem as C, only worse."
          },
          principle: "Pre-execution policy → PreToolUse. The blocking-decision capability is what makes it the right primitive for guardrails.",
          domain: "1. Agentic Architecture",
          subArea: "Hook event placement"
        },
        {
          n: 3,
          question: "An agent is implementing a complex feature. It has been going for 47 turns, looping between editing the same file, running tests, and re-editing. The tests still fail.\n\nWhich mitigation is most aligned with agentic-architecture best practices?",
          options: {
            A: "Increase max_tokens so the agent has more room to think.",
            B: "Add a soft watermark at ~80% of max-turns: finish current unit, commit, exit cleanly, resume next run.",
            C: "Switch the agent to a more powerful model mid-run when retries exceed 5.",
            D: "Disable the test-running tool until the agent commits to a written plan."
          },
          correct: "B",
          explanations: {
            A: "Confuses turn budget with token budget. max_tokens controls per-message generation, not loop count.",
            B: "Right. Self-pacing watermarks (~80% commit + exit cleanly, ~95% hard exit) are the canonical defense against runaway loops. Partial progress is preserved; the next run resumes.",
            C: "Escalating model mid-run is not a recognized pattern; adds complexity, doesn't solve loop dynamics.",
            D: "Removes the feedback the agent needs to validate work."
          },
          principle: "Bounded loops with self-pacing watermarks. Exiting at 80% is a success, not a failure — partial work is recoverable.",
          domain: "1. Agentic Architecture",
          subArea: "Bounded loops / session budget"
        },
        {
          n: 4,
          question: "A repo's CLAUDE.md has grown to 12,000 tokens over six months. Sessions feel slower to start, and the operator notices Claude sometimes parrots instructions back rather than acting on them.\n\nWhat is the most appropriate action?",
          options: {
            A: "Switch the model to a smaller one to reduce per-token cost.",
            B: "Move historical sections into docs/reference/ and @-include only the parts that are still actively binding.",
            C: "Delete the file and re-derive context from each new session's user prompt.",
            D: "Compress the file with an LLM-based summarizer and overwrite it in place."
          },
          correct: "B",
          explanations: {
            A: "Wrong axis. The bottleneck is context shape, not per-token cost.",
            B: "Right. CLAUDE.md is loaded into context every session — treat it like RAM, not a database. Move historical decisions to disk (reference/, docs/) and @-include or link only what is still binding.",
            C: "Destroys durable behavior anchors that won't be reconstructed from a user prompt.",
            D: "LLM-summarizing loses fidelity, and the file will balloon again."
          },
          principle: "Lean charter, archive history. The same content can serve the agent equally well from reference/ if it's referenced rather than inlined.",
          domain: "2. Claude Code",
          subArea: "CLAUDE.md hygiene"
        },
        {
          n: 5,
          question: "The user says: \"From now on, every time you finish a task, run `npm run lint` and post the output in the chat.\"\n\nWhich mechanism implements this reliably?",
          options: {
            A: "Add a sentence to CLAUDE.md describing the desired behavior.",
            B: "Save it as a memory / preference for future sessions.",
            C: "Configure a Stop hook in settings.json that runs `npm run lint` and prints the result.",
            D: "Create a slash command that runs lint, and tell the user to invoke it after each task."
          },
          correct: "C",
          explanations: {
            A: "CLAUDE.md instructions are advisory. The model can interpret, prioritize, or even forget. Not an enforcement mechanism.",
            B: "Same problem as A. Memories/preferences are read by the model, not executed by the harness.",
            C: "Right. Hooks run in the harness layer, deterministically, regardless of what the model decides. 'Every time you finish a task' = per-turn = Stop hook (PostToolUse would fire per individual tool call).",
            D: "Slash commands require the user to invoke them. 'Every time' is the user not having to remember."
          },
          principle: "Automated behaviors ('every time X', 'from now on when X') need hooks in settings.json. The harness executes hooks; it does not execute CLAUDE.md or memory. Match event granularity to the trigger: per-task = Stop, per-tool-call = PostToolUse.",
          domain: "2. Claude Code",
          subArea: "Hooks vs. memory for automation"
        },
        {
          n: 6,
          question: "A team is building an MCP server that exposes a 50ms-latency internal database. The server will be used by a single developer's Claude Code instance, running on the same machine.\n\nWhich transport should they use?",
          options: {
            A: "HTTP + Server-Sent Events, because it is the future-proof default.",
            B: "stdio, because the server runs on the same machine and its lifecycle is bound to the Claude Code process.",
            C: "WebSockets, for full-duplex streaming.",
            D: "gRPC, for strongly-typed schemas."
          },
          correct: "B",
          explanations: {
            A: "HTTP+SSE (now called Streamable HTTP in the current spec) is for remote or multi-user MCP servers. Single dev, same machine? Overkill.",
            B: "Right. stdio is the canonical local-machine transport. Claude Code spawns the server as a subprocess; lifecycle is bound to the Claude process; no port management; no auth surface.",
            C: "WebSockets is not a current MCP transport.",
            D: "gRPC is not a current MCP transport."
          },
          principle: "Match transport to deployment shape. Local single-user → stdio. Remote / multi-user → Streamable HTTP (older docs: HTTP+SSE).",
          domain: "3. Tool Design / MCP",
          subArea: "MCP transport choice"
        },
        {
          n: 7,
          question: "Two tools are registered: `search_documents` and `find_files`. Both currently have one-line descriptions: \"Search the system for documents\" and \"Find files.\" The model keeps picking the wrong one.\n\nWhich fix has the highest leverage?",
          options: {
            A: "Rename the tools to search_documents_v2 and find_files_v2.",
            B: "Rewrite both descriptions to specify what each tool searches (e.g., 'search indexed PDFs by content' vs. 'list filenames in working directory by glob'), the input shape, and the kind of question each is right for.",
            C: "Add a system-prompt rule: 'When in doubt, prefer search_documents.'",
            D: "Merge both tools into one `search` tool with a `mode` parameter."
          },
          correct: "B",
          explanations: {
            A: "Renaming is cosmetic. Doesn't tell the model what each tool does.",
            B: "Right. Tool descriptions are the model's selection signal. Specify (1) what it operates on, (2) input shape, (3) ideal-use scenarios, (4) what it does not handle. Differentiation > naming > nudging.",
            C: "System-prompt nudges paper over the design problem and bias the model without informing it.",
            D: "Merging into one tool with a `mode` param adds API surface complexity to dodge a description-quality issue."
          },
          principle: "When the model picks the wrong tool, the tool's description is the first thing to fix. Renames, system nudges, and tool merges are second-order.",
          domain: "3. Tool Design / MCP",
          subArea: "Tool description quality"
        },
        {
          n: 8,
          question: "An agent must return a list of {name, email, score} records to be inserted into a database. About 1 in 30 responses has a trailing comma or unescaped quote that breaks JSON.parse.\n\nWhat is the most reliable fix?",
          options: {
            A: "Add 'Return valid JSON, no trailing commas' to the system prompt.",
            B: "Use the API's structured-output / tool-use mode with a JSON schema for the records.",
            C: "Wrap the response in <json> XML tags and parse the inner content.",
            D: "Increase temperature so the model takes more care."
          },
          correct: "B",
          explanations: {
            A: "Soft constraint in the prompt. The model will still violate it ~3% of the time, exactly the rate the question describes.",
            B: "Right. Structured-output / tool-use mode with a schema uses constrained decoding — the model literally cannot emit tokens that violate the schema for those fields. This is a platform-level guarantee.",
            C: "XML tags don't constrain the JSON inside. The same trailing-comma bug recurs.",
            D: "Higher temperature increases variance, not reliability."
          },
          principle: "For machine-consumed output, prefer platform-level constraints over prompt-level requests. The model cannot violate a constraint that isn't sampled.",
          domain: "4. Prompt Engineering",
          subArea: "Structured output reliability"
        },
        {
          n: 9,
          question: "A classification prompt has 5 few-shot examples. The role definition is in the system prompt, the examples sit inline as text inside the user message before the actual input, and the input itself follows. Classification accuracy varies wildly between runs.\n\nWhich restructure is most likely to improve consistency?",
          options: {
            A: "Move all examples into the system prompt as a long bulleted list.",
            B: "Use alternating user / assistant turns for the few-shot examples, then send the actual input as the final user message.",
            C: "Increase temperature to add diversity, then average over multiple runs.",
            D: "Compress the examples with bullet points to fit more into context."
          },
          correct: "B",
          explanations: {
            A: "Works, but inline-text examples in a system prompt match the training distribution less well than conversational turns.",
            B: "Right. Claude is trained on conversation patterns. Putting few-shots as user / assistant alternating turns lets the model pattern-match form and content. Consistency improves because the input→output shape is exemplified, not just described.",
            C: "Temperature averaging is a workaround for poor structure, not a fix.",
            D: "Compressing examples often removes the discriminating signal that makes them few-shots in the first place."
          },
          principle: "Few-shots work best in their natural form — conversation turns, not bulleted text. Match training distribution where possible.",
          domain: "4. Prompt Engineering",
          subArea: "Few-shot placement"
        },
        {
          n: 10,
          question: "A team calls Claude with a 30,000-token system prompt (instructions + reference docs) and 200-token user messages. They make ~500 calls per day and want to reduce cost.\n\nWhich strategy delivers the biggest win?",
          options: {
            A: "Truncate the system prompt to 10,000 tokens.",
            B: "Add cache_control to the static reference-docs portion of the system prompt.",
            C: "Switch from Sonnet to Haiku.",
            D: "Batch 10 user messages per call."
          },
          correct: "B",
          explanations: {
            A: "Truncation loses information; you'd ship a worse system prompt to save dollars.",
            B: "Right. Static prefix + 500 calls/day is the exact shape prompt caching is built for. Cache reads are ~10% of the price of cache writes. With a 30k-token reused prefix, this is the largest available lever.",
            C: "Haiku trades quality for cost; doesn't address the underlying inefficiency (sending the same 30k tokens 500 times).",
            D: "Batching helps amortize per-call overhead but doesn't help when the system prompt is the cost driver."
          },
          principle: "When a large stable prefix is reused across calls, prompt caching with cache_control is the highest-leverage cost lever. Place the cache breakpoint at the boundary between stable and dynamic content.",
          domain: "5. Context & Reliability",
          subArea: "Prompt caching strategy"
        }
      ]
    }
  ]
};

if (typeof window !== "undefined") window.CURRICULUM = CURRICULUM;
