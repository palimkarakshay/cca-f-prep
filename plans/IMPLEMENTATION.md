# Content Pack Management Platform — End-to-End Implementation Guide

> **Source-of-truth runbook.** Hand this document to a fresh project (or a fresh Claude Code session) and it should contain everything needed to build the platform from zero to a paying customer. If anything below is ambiguous, raise it — do not silently improvise.

---

## Table of contents

- **Part 0 — How to use this document** (the two-actor model: AI + operator)
- **Part 1 — Product summary** (what you are building and why, in 3 paragraphs)
- **Part 2 — Operator one-time setup** (provision accounts, register domain, init repo)
- **Part 3 — Reference: data shapes, validators, schema, RLS** (the contract every later step depends on)
- **Part 4 — Phase 1 (POC) implementation, P1 → P6** (the 18-day build)
- **Part 5 — Phase 2 (Commercial) implementation, P7 → P12** (additive on Phase 1)
- **Part 6 — Acceptance & verification** (end-to-end test plan, RLS, Lighthouse, accessibility)
- **Part 7 — Operating playbooks** (daily authoring, incident response, cost monitoring)
- **Part 8 — Appendices** (env vars, API surface, common errors, migration paths)

---

## Part 0 — How to use this document

### The two-actor model

This platform is built by **two cooperating actors**:

- **[OP] Operator** — a human with a browser, a credit card, and admin access to external accounts. Provisions services, copies secrets to `.env`, clicks through verification flows, signs LOIs, talks to customers, owns product decisions.
- **[AI] Claude Code session** — an AI agent with shell + file access in the project repo. Reads this document, executes the prompts, writes code, runs tests, opens PRs.

Throughout this document:

- A block tagged `[OP]` is an operator task. Do not delegate it to the AI.
- A block tagged `[AI]` is a verbatim prompt the operator pastes into a Claude Code session. The AI executes it without further human steering except as instructed.
- A block tagged `[AI+OP]` requires both — usually AI writes code, operator clicks through a browser flow to verify.

### Working rhythm

Each implementation phase (P1 … P12) follows the same shape:

1. **Pre-tasks** — operator provisions whatever external state the AI will need (accounts, secrets, sample files).
2. **AI prompt** — operator pastes the prompt into a fresh Claude Code session. AI works to completion.
3. **Verification** — operator runs the documented verification steps (browser clicks, terminal commands, test invocations).
4. **Commit & push** — AI commits work in small atomic commits and pushes; codex review on the PR is the merge gate.
5. **Definition of Done** — explicit checklist; do not advance until every box is ticked.

### Conventions

- All file paths are repo-relative unless prefixed with `/`.
- All shell commands assume cwd is the repo root.
- Secrets live in `.env` (never committed). The repo's `.env.example` is the canonical list.
- Branch naming: `claude/<phase>-<short-slug>` (e.g. `claude/p3-learner-app`).
- Commit format: `<scope>(<area>): <imperative summary>` (e.g. `feat(db): add tenant_policy table`). One concern per commit.

### What this document is NOT

- Not a marketing brief. See `plans/deck-overview.md` for sales material.
- Not a strategy debate. The strategy is locked; see `plans/content-pack-management-plan.md` for rationale.
- Not a learning resource. Assumes the AI has working knowledge of TypeScript, Postgres, Next.js, and basic SaaS patterns.

---

## Part 1 — Product summary (read first if you are starting fresh)

### What we are building

A learning platform that hosts short focused lessons grouped into **catalogs** (e.g. "AWS Cloud Practitioner", "GDPR for Product Managers", "Beginner Sewing"). Two markets share the same product:

- **B2C** — anyone signs up, picks a catalog, learns at their own pace.
- **B2B** — companies buy access for their employees; their internal expert reviews material before it reaches staff.

Learners can request topics they want covered. Those requests feed a queue. AI drafts the content from operator-supplied knowledge files. **Deterministic validators** screen for a documented set of failure modes. A **stronger reviewer model** audits the drafter. A **human always approves** before publish.

### Why two phases

We split the build into two phases so we don't pay for AI before knowing whether anyone will pay us:

- **Phase 1 (POC, ~$1/mo).** Web platform stores, versions, and serves content the operator authored offline using their existing Claude Max 20x subscription. **Zero Anthropic API calls from the server.** Goal: validate paying intent.
- **Phase 2 (Commercial, ~$450–1000/mo).** Turn on in-app AI generation, billing, B2B controls. Built additively on Phase 1 — no rewrites.

### Phase 1 success metric (the gate to Phase 2)

**Paying intent, measured directly:**

- B2B target: **3 signed Letters of Intent** from prospective customers.
- B2C target: **50 waitlist signups + 10 refundable Stripe pre-orders** ($9 each).

If Phase 1 doesn't hit these targets, Phase 2 is not built. Hard gate.

### Hard constraints

1. Phase 1 runs on free tiers everywhere. Only paid line item is the operator's existing Claude Max 20x.
2. Claude Max 20x funds Claude Code (local CLI), **not** Anthropic API. Phase 1 web app makes zero API calls.
3. Phase 1 → Phase 2 must be additive. Same data model, same auth, same hosting. No rewrites.
4. B2B and B2C share one platform. Tenancy is in the schema from day 1 even if Phase 1 only exercises a single-tenant code path.
5. Vercel Hobby is OK for Phase 1 while pre-revenue. **Move to Vercel Pro the moment a paying customer or signed LOI exists** (Hobby ToS forbids commercial use).

### The moat (what makes this defensible)

Not the lessons. Not the AI model. **The quality loop:**

- 23 documented AI-content failure modes catalogued from real-world misses.
- F1–F8 cognitive failure-mode taxonomy.
- Deterministic validators that run vendor-independent.
- Opus-critiques-Sonnet reviewer architecture (Phase 2).
- Pause-not-pull post-publish quality signals.

These are reproduced in full in **Part 3** of this document.

---

## Part 2 — Operator one-time setup (do this before P1)

This part is **operator-only**. The AI cannot create external accounts, accept ToS, or enter payment details. Plan ~3 hours total.

### 2.1 — Domain & DNS

**[OP]**

1. Pick a domain. Register at any registrar (Porkbun, Cloudflare, Namecheap). ~$12/yr.
2. Point DNS at Cloudflare for free DNS management (transfer nameservers if not already there).
3. Plan two subdomains:
   - `www.<domain>` → marketing site (Astro)
   - `app.<domain>` → learner + admin app (Next.js)
4. Do **not** add the DNS records yet — wait until the Vercel projects exist (P1 / P2).

### 2.2 — Provision external services (free tiers)

Sign up for each. Save credentials to a password manager and a temporary `setup.txt` scratch file. After P1 everything moves to `.env`.

**[OP] Required for Phase 1:**

| # | Service | URL | What you create | Note |
|---|---|---|---|---|
| 1 | **GitHub** | github.com | Empty repo named `<product-slug>` (private) | Will be the canonical repo |
| 2 | **Vercel** | vercel.com | Account, hobby plan; do NOT create projects yet | Projects come in P1 / P2 |
| 3 | **Neon** | neon.tech | Project + database; copy connection string (HTTP variant) | Free 0.5 GB |
| 4 | **Cloudflare** | dash.cloudflare.com | Account; create R2 bucket `content-packs`; create API token with R2 read/write | Free 10 GB |
| 5 | **Clerk** | clerk.com | Application (development instance); copy `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` | Free 10k MAU |
| 6 | **Resend** | resend.com | Account, verify your sending domain DNS (SPF/DKIM); create API key | Free 3k emails/mo |
| 7 | **PostHog** | posthog.com | Project (US or EU region per data residency preference); copy API key | Free 1M events/mo |
| 8 | **Sentry** | sentry.io | Two projects: `app-frontend`, `app-backend`. Copy DSNs | Free 5k events/mo |
| 9 | **Stripe** | stripe.com | Account in test mode for P2 forms; activate live mode only at first paid customer | No spend until live |
| 10 | **Anthropic** (account only) | console.anthropic.com | Sign up; create an API key but do **not** add credit | Used in Phase 2 only |

**Required for Phase 2 (defer until Phase 1 success metric is hit):**

| # | Service | URL | What you create | Note |
|---|---|---|---|---|
| 11 | **Inngest** | inngest.com | Account; create app `<product-slug>` | Phase 2 queue |
| 12 | **Voyage AI** | voyageai.com | Account; API key | Embeddings |

### 2.3 — Local dev environment

**[OP]**

```
# Required
node --version    # ≥ 20.x
pnpm --version    # ≥ 9.x — install via `corepack enable` if missing
git --version
gh --version      # GitHub CLI; recommended for PR/issue work

# Editor
- VS Code or Cursor with Tailwind CSS IntelliSense + ESLint + Prettier extensions

# Claude Code
- Already have Claude Max 20x subscription
- Install Claude Code CLI: https://claude.com/claude-code
- Authenticate via `claude login`
```

### 2.4 — Repo init (operator drives, AI takes over after)

**[OP]**

```bash
# Create the repo locally
mkdir <product-slug> && cd <product-slug>
git init
git remote add origin git@github.com:<your-handle>/<product-slug>.git

# Establish baseline files (operator commits these before AI takes over)
echo "node_modules\n.next\n.env\n.env.local\n.vercel\ndist\n.DS_Store" > .gitignore
echo "# <Product Name>\n\nSee plans/IMPLEMENTATION.md" > README.md

# Add this implementation guide as the canonical reference
mkdir -p plans
cp /path/to/this/document plans/IMPLEMENTATION.md

git add .gitignore README.md plans/IMPLEMENTATION.md
git commit -m "chore: bootstrap repo with implementation guide"
git push -u origin main
```

### 2.5 — Set up `.env.example` & `.env`

**[OP]** Create both files. Commit `.env.example`. Do **not** commit `.env`.

`.env.example` (copy this verbatim):

```
# --- Database ---
DATABASE_URL="postgres://USER:PASSWORD@HOST/DB?sslmode=require"
DATABASE_URL_HTTP="https://...neon.tech/sql"   # Neon HTTP driver, used for RLS-bearing queries

# --- Object storage ---
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET="content-packs"
R2_PUBLIC_URL="https://<bucket>.<account>.r2.cloudflarestorage.com"

# --- Auth ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# --- Email ---
RESEND_API_KEY=""
RESEND_FROM_EMAIL="hello@<domain>"

# --- Analytics & observability ---
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""

# --- Payments (Phase 1: Stripe Payment Link only; Phase 2: full integration) ---
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PREORDER_PAYMENT_LINK=""

# --- Phase 2 only ---
ANTHROPIC_API_KEY=""
INNGEST_EVENT_KEY=""
INNGEST_SIGNING_KEY=""
VOYAGE_API_KEY=""

# --- App ---
NEXT_PUBLIC_APP_URL="https://app.<domain>"
NEXT_PUBLIC_MARKETING_URL="https://www.<domain>"
TENANT_DEFAULT_PLAN="free"
```

`.env` is the same file with values filled in from §2.2. Keep it out of git.

### 2.6 — Definition of Done for Part 2

Operator is ready to start P1 when **all** of these are true:

- [ ] Domain is registered and DNS is on Cloudflare.
- [ ] All 10 Phase 1 service accounts exist and credentials are in `.env`.
- [ ] Local Node ≥ 20, pnpm ≥ 9, git, and Claude Code are installed and working.
- [ ] Empty private GitHub repo exists with `main` branch protected (require PR review before merge).
- [ ] Initial commit pushed with `.gitignore`, `README.md`, `plans/IMPLEMENTATION.md`, `.env.example`.
- [ ] `.env` file exists locally, populated, and listed in `.gitignore`.
- [ ] You can `git push` and `gh repo view` from the repo root.

---

## Part 3 — Reference: data shapes, validators, schema, RLS

This is the contract every later step depends on. Read it once before starting P1; refer back as needed. The AI prompts in Parts 4–5 cite these definitions by name.

### 3.1 — Curriculum types (the unit of authoring)

Lessons live inside concepts; concepts live inside catalogs. A catalog corresponds to one course or topic-stream (e.g. "AWS Cloud Practitioner"); a concept is one short lesson + a 3-question quiz.

```typescript
// packages/shared/src/curriculum-types.ts

export type Bloom = "R" | "U" | "A" | "An" | "E" | "C";
export type LessonStatus = "draft" | "ready";
export type LessonDepth = "easy" | "conceptual" | "deeper";
export type OptionLetter = "A" | "B" | "C" | "D";

export interface LessonExample { title: string; body: string; }

export interface LessonSimplified {
  oneLiner?: string;
  analogy?: string;
  paragraphs?: string[];
  keyPoints?: string[];
}

export interface LessonDeeper {
  oneLiner?: string;
  paragraphs?: string[];
  keyPoints?: string[];
  examples?: LessonExample[];
  pitfalls?: string[];
  furtherReading?: { title: string; href: string }[];
}

export interface Lesson {
  status: LessonStatus;
  paragraphs: string[];          // canonical "conceptual" depth body
  keyPoints?: string[];
  examples?: LessonExample[];
  pitfalls?: string[];
  notesRef?: string;
  simplified?: LessonSimplified; // depth toggle "Easy"
  deeper?: LessonDeeper;         // depth toggle "Deeper"
}

export interface QuestionBase {
  n: number;                     // 1-based, stable per-quiz id
  question: string;
  principle?: string;            // one-line takeaway shown after submit
  bSkills?: string[];            // optional skill tags
  domain?: string;               // optional domain tag
  subArea?: string;
}

export interface MCQQuestion extends QuestionBase {
  kind?: "mcq";
  options: Record<OptionLetter, string>;
  correct: OptionLetter;
  explanations?: Record<OptionLetter, string>;
}

export interface TrueFalseQuestion extends QuestionBase {
  kind: "true-false";
  correct: boolean;
  explanationTrue?: string;
  explanationFalse?: string;
}

export interface FillInQuestion extends QuestionBase {
  kind: "fill-in";
  acceptedAnswers: string[];     // case-insensitive after trim; first is canonical
  placeholder?: string;
  explanation?: string;
}

export type Question = MCQQuestion | TrueFalseQuestion | FillInQuestion;

export interface Quiz { questions: Question[]; }
export interface SectionTest extends Quiz { passPct?: number; }

export interface Concept {
  id: string;
  code: string;
  title: string;
  bloom?: Bloom;
  lesson: Lesson | null;
  quiz: Quiz | null;
}

export interface Section {
  id: string;
  n: number;
  title: string;
  sourceCourse?: string;
  blurb: string;
  concepts: Concept[];
  sectionTest: SectionTest | null;
}

export interface Curriculum {
  schemaVersion: number;
  sections: Section[];
  mockExams?: MockExam[];
}

export interface ScoreBand { min: number; max: number; verdict: string; message: string; }
export interface MockExam {
  id: string;
  title: string;
  blurb: string;
  sourceFile?: string;
  timeMinutes: number;
  passPct: number;
  scoreBands: ScoreBand[];
  questions: Question[];
}
```

**Authoring rules baked into the schema:**

- An MCQ has exactly 4 options keyed `A`, `B`, `C`, `D`. No `E`, no "all of the above".
- Each MCQ has exactly one `correct` letter.
- A quiz has exactly 3 questions (enforced in the validator, not the type).
- `principle` is required on every question for a published concept (validator-enforced).
- Inside a quiz, the **distribution of correct letters across A/B/C/D should not be all-one-letter**. (B-bias detector — see §3.3.)

### 3.2 — F1–F8 cognitive failure-mode taxonomy

Every validator finding is tagged with one of these codes. The taxonomy comes from real misses on the CCA-F study repo's diagnostic exam. Memorise: an AI generation failure is *always* one of these eight shapes.

| Code | Name | Looks like |
|---|---|---|
| **F1** | Distractor lure | Picked the most creative-sounding option (often D). Felt clever. |
| **F2** | Compression reflex | Reached for "summarize / shrink / compress" when the answer was restructure. |
| **F3** | Mechanism gap | Knew the platform feature exists but missed *when* to use it. |
| **F4** | Rationale gap | Knew the right *what* but couldn't explain *why* it dominated alternatives. |
| **F5** | Fabricated rule | Picked an option asserting a non-existent rule, threshold, or guarantee. |
| **F6** | Closed-list miss | Picked an option outside the protocol's actual options (e.g. WebSockets for MCP). |
| **F7** | Misread scenario | Did not extract the constraint that disambiguated the answer. |
| **F8** | Over-engineered | Picked the elaborate option when the simplest correct answer was obvious. |

### 3.3 — The 23 deterministic validators

Every validator runs in three places: (1) operator's local `pnpm lint:draft`, (2) admin server-side import handler, (3) Phase 2 critic stage. **Same code, three call sites.**

| # | Validator | What it catches | F-code |
|---|---|---|---|
| 1 | `schemaValidator` | Type / shape violations of the curriculum schema | — |
| 2 | `fieldRequiredValidator` | Missing `principle`, missing `correct`, missing `n`, etc. | — |
| 3 | `questionCountValidator` | Quiz has != 3 questions | — |
| 4 | `optionsCountValidator` | MCQ has != 4 options | — |
| 5 | `correctLetterValidValidator` | `correct` is not one of A/B/C/D | — |
| 6 | `letterDistributionValidator` | All correct answers in a quiz are the same letter (B-bias) | F1 |
| 7 | `spoilerValidator` | Stem text contains the answer verbatim | F1 |
| 8 | `distractorDifferentiationValidator` | Distractors are paraphrases of each other | F1 |
| 9 | `closedListWhitelistValidator` | Forbidden phrases ("all of the above", "none of the above", "always", "never") | F5 |
| 10 | `fabricatedRuleDetector` | Phrasing like "exceeds N tools", "must be ≥ X" without source | F5 |
| 11 | `compressionReflexDetector` | Quiz answer says "summarize" / "compress" when stem implies restructure | F2 |
| 12 | `mcpClosedListValidator` | Mentions transports outside `stdio` / `HTTP+SSE` for MCP topics | F6 |
| 13 | `crossRefValidator` | Internal links / `notesRef` resolve to existing concepts | — |
| 14 | `principleQualityValidator` | `principle` is a one-liner, not a paragraph | — |
| 15 | `bloomTagValidator` | If `bloom` is set, the question kind aligns (R/U → recall ok; A/An/E/C → application) | — |
| 16 | `lessonLengthValidator` | Lesson `paragraphs` ≥ 200 chars total, ≤ 2000 | — |
| 17 | `lessonReadabilityValidator` | Flesch-Kincaid grade level ≤ 12 (configurable per pack) | F8 |
| 18 | `examplesPresenceValidator` | Lesson has ≥ 1 example *or* ≥ 1 keyPoint | — |
| 19 | `tooMuchJargonValidator` | Lesson uses > N undefined acronyms / proper nouns | — |
| 20 | `pitfallSpecificityValidator` | If `pitfalls` is set, each is a concrete-action sentence | F4 |
| 21 | `simplifiedDepthValidator` | If `simplified` is set, it is genuinely shorter than `paragraphs` | F2 |
| 22 | `deeperDepthValidator` | If `deeper` is set, it adds at least one of: example / pitfall / further reading | — |
| 23 | `answerJustificationAuditValidator` | (**Phase 2 only**) Critic must point at knowledge-file span justifying the marked answer; refuse to publish if no span found | F4 |

Each validator returns:

```typescript
type Finding = {
  validator: string;
  severity: "error" | "warn";
  fCode?: "F1"|"F2"|"F3"|"F4"|"F5"|"F6"|"F7"|"F8";
  message: string;
  path?: string;          // JSON path to the offending field
  suggestion?: string;
};

type LintResult = { findings: Finding[]; pass: boolean }; // pass = no error-severity findings
```

### 3.4 — Postgres schema (Drizzle)

Every tenant-scoped table has a `tenant_id uuid not null` column and an RLS policy. Tenant context is set per request via `SET LOCAL app.tenant_id = '...'` on a fresh Neon HTTP connection.

```typescript
// packages/db/src/schema.ts (paraphrased; see P1 prompt for canonical version)

export const tenant = pgTable("tenant", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  plan: text("plan").$type<"free"|"pro"|"enterprise">().notNull().default("free"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tenantMember = pgTable("tenant_member", {
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  userId: uuid("user_id").notNull().references(() => user.id),
  role: text("role").$type<"learner"|"admin"|"sme">().notNull().default("learner"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, t => ({ pk: primaryKey({ columns: [t.tenantId, t.userId] }) }));

export const catalog = pgTable("catalog", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  visibility: text("visibility").$type<"public"|"private">().notNull().default("public"),
  currentVersionId: uuid("current_version_id"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const catalogVersion = pgTable("catalog_version", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  catalogId: uuid("catalog_id").notNull().references(() => catalog.id),
  versionNumber: integer("version_number").notNull(),
  blobKey: text("blob_key").notNull(),       // R2 object key
  publishedAt: timestamp("published_at"),
  publishedBy: uuid("published_by").references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const progress = pgTable("progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  userId: uuid("user_id").notNull().references(() => user.id),
  conceptId: text("concept_id").notNull(),    // string id from curriculum
  catalogVersionId: uuid("catalog_version_id").notNull().references(() => catalogVersion.id),
  status: text("status").$type<"viewed"|"quizzed"|"complete">().notNull(),
  scorePct: integer("score_pct"),
  attempts: integer("attempts").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const suggestion = pgTable("suggestion", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  userId: uuid("user_id").references(() => user.id),
  catalogId: uuid("catalog_id").references(() => catalog.id),
  conceptCode: text("concept_code"),
  text: text("text").notNull(),
  status: text("status").$type<"open"|"accepted"|"dismissed"|"linked">().notNull().default("open"),
  linkedSuggestionId: uuid("linked_suggestion_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const draft = pgTable("draft", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  catalogId: uuid("catalog_id").references(() => catalog.id),
  payload: jsonb("payload").$type<Concept>().notNull(),
  lintFindings: jsonb("lint_findings").$type<Finding[]>(),
  status: text("status").$type<"pending"|"published"|"rejected">().notNull().default("pending"),
  authoredBy: uuid("authored_by").references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const knowledgeFile = pgTable("knowledge_file", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  blobKey: text("blob_key").notNull(),
  filename: text("filename").notNull(),
  byteSize: integer("byte_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedBy: uuid("uploaded_by").references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const event = pgTable("event", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  userId: uuid("user_id").references(() => user.id),
  kind: text("kind").notNull(),                  // closed-list ~10 kinds; see Part 8
  payload: jsonb("payload"),
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
});

export const questionSignal = pgTable("question_signal", {
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  catalogVersionId: uuid("catalog_version_id").notNull().references(() => catalogVersion.id),
  conceptId: text("concept_id").notNull(),
  questionN: integer("question_n").notNull(),
  attempts: integer("attempts").notNull().default(0),
  correctAttempts: integer("correct_attempts").notNull().default(0),
  pausedAt: timestamp("paused_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, t => ({ pk: primaryKey({ columns: [t.tenantId, t.catalogVersionId, t.conceptId, t.questionN] }) }));

export const lead = pgTable("lead", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").$type<"b2b_pilot"|"b2c_waitlist"|"b2c_preorder">().notNull(),
  email: text("email").notNull(),
  orgName: text("org_name"),
  orgSize: text("org_size"),
  useCase: text("use_case"),
  source: text("source"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tenantPolicy = pgTable("tenant_policy", {
  tenantId: uuid("tenant_id").primaryKey().references(() => tenant.id),
  approvalMode: text("approval_mode").$type<"always-human"|"confidence-routed"|"auto-publish">().notNull().default("always-human"),
  confidenceThreshold: numeric("confidence_threshold", { precision: 3, scale: 2 }).notNull().default("0.85"),
  spotCheckRate: numeric("spot_check_rate", { precision: 3, scale: 2 }).notNull().default("0.05"),
  twoEyeGate: boolean("two_eye_gate").notNull().default(false),
  generationsPerUserPerDay: integer("generations_per_user_per_day").notNull().default(10),
  suggestionsPerUserPerDay: integer("suggestions_per_user_per_day").notNull().default(10),
  monthlyTokenBudgetUsd: numeric("monthly_token_budget_usd", { precision: 10, scale: 2 }),
  ruleOverrides: jsonb("rule_overrides"),
});

// Phase 2 only:
export const calibrationRule = pgTable("calibration_rule", { /* ... */ });
export const catalogImport = pgTable("catalog_import", { /* ... */ });
export const subscription = pgTable("subscription", { /* ... */ });
```

### 3.5 — Row-Level Security policy template

Apply to **every** tenant-scoped table:

```sql
alter table catalog enable row level security;
create policy tenant_isolation on catalog
  using (tenant_id = current_setting('app.tenant_id', true)::uuid)
  with check (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

The `, true` in `current_setting(..., true)` returns NULL if the GUC is unset, instead of throwing — so unauthenticated queries simply return zero rows instead of erroring. The `with check` clause prevents writes that would set `tenant_id` to a different tenant.

### 3.6 — `withTenant` helper (RLS-bearing query wrapper)

Every server-side DB call that touches tenant-scoped data goes through this helper:

```typescript
// packages/db/src/with-tenant.ts
import { neon } from "@neondatabase/serverless";

export async function withTenant<T>(
  tenantId: string,
  fn: (sql: ReturnType<typeof neon>) => Promise<T>
): Promise<T> {
  const sql = neon(process.env.DATABASE_URL_HTTP!);
  await sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
  return fn(sql);
}
```

**Rule:** never write a tenant-scoped query outside `withTenant(...)`. Lint rule (P1) flags any `db.select().from(catalog)` that isn't inside this wrapper.

### 3.7 — Event taxonomy (PostHog budget discipline)

Closed list. Total ~10 event types. **No** per-keystroke or per-millisecond timing events.

| Event | When | Payload |
|---|---|---|
| `signup` | New user account | `{ kind: "b2c"|"b2b", source }` |
| `catalog_view` | Catalog landing page rendered | `{ catalog_id }` |
| `lesson_view` | Lesson page rendered | `{ concept_id, depth }` |
| `quiz_start` | Quiz first interaction | `{ concept_id }` |
| `quiz_submit` | Quiz answers submitted | `{ concept_id, score_pct, time_seconds }` |
| `suggestion_submit` | Topic suggestion submitted | `{ catalog_id, length }` |
| `lead_submit` | Marketing-site form submitted | `{ kind, source }` |
| `import_publish` | Operator publishes a draft | `{ catalog_id, version }` |
| `report_content` | Learner reports a concept | `{ concept_id, reason }` |
| `error` | Client-side captured error | `{ message_hash }` |

### 3.8 — Section D extensions: cognitive-mechanics contracts (read before P3+)

The strategy plan's [Section D](./content-pack-management-plan.md#section-d--learner-absorption--sme-elicitation-strategy) introduces eight learner-absorption mechanics (LM1–LM8) and eight SME-elicitation scaffolds (SM1–SM8), each mapped to peer-reviewed evidence and a concrete platform feature. This subsection adds the data contracts those features require. **Every type, table, and validator below is referenced by name in the P3, P4, P5, P8, P9, P10, P11 prompts.**

#### 3.8.1 — F9–F12 cognitive failure modes (extends the F1–F8 taxonomy)

| Code | Name | Looks like |
|---|---|---|
| **F9** | Fluency illusion | Re-reading or skimming feels like learning; high JOL, low actual recall. (Roediger & Karpicke 2006; Bjork & Bjork 2011) |
| **F10** | Massed-practice trap | Same sub-area drilled back-to-back; transfer fails. (Rohrer & Taylor 2007) |
| **F11** | Calibration drift | Predicted-vs-actual gap (\|JOL − score\|) widens over time; no metacognitive correction. (Dunlosky & Bjork; Kruger & Dunning 1999) |
| **F12** | Cue-bias / positional learning | Learner picks correct answer from positional cue (e.g. always B) rather than principle reasoning. Validator-detectable; see §3.10 validator 24. |

Validators that produce findings tagged F9–F12 are listed in §3.8.6. Findings continue to use the `Finding` shape from §3.3.

#### 3.8.2 — Learner-side data contracts (LM1–LM8)

```typescript
// packages/shared/src/section-d-types.ts

// LM1 — Spaced retrieval
export interface SpacedReviewItem {
  userId: string;
  conceptId: string;
  catalogVersionId: string;
  dueAt: Date;
  intervalDays: 1 | 3 | 7 | 14 | 30 | 60;  // expanding interval ladder
  consecutiveMisses: number;                // ≥ 3 → leech rule kicks in (LM1)
  isLeech: boolean;
  lastReviewedAt: Date | null;
  lastWasCorrect: boolean | null;
}

// LM2 — Mid-lesson retrieval gate
export interface RetrievalGateResponse {
  conceptId: string;
  prompt: string;                           // 1-Q recall prompt shown before "next" unlocks
  learnerWrote: string;
  judgedCorrect: boolean;                   // self-judged or model-judged depending on tier
  latencyMs: number;
}

// LM3 — Generation-effect (write-the-principle before reveal)
export interface PrincipleWrite {
  questionId: string;                       // conceptId + questionN
  learnerWrote: string;
  canonicalPrinciple: string;
  similarityScore: number;                  // 0..1 fuzzy match against canonical
}

// LM5 — Worked-example fading (Dreyfus rung, expertise reversal)
export type DreyfusRung = "novice" | "advanced-beginner" | "competent" | "proficient" | "expert";
export interface DepthRung {
  rung: "easy" | "conceptual" | "deeper" | "solo"; // "solo" disables hints (LM5)
  available: boolean;                                // gated by mastery score
  cutoverAt: { masteryScore: number };               // expertise reversal threshold
}

// LM6 — Calibration capture (JOL pre-answer; Δ surfaced)
export interface JOLCapture {
  questionId: string;
  jolBefore: 1 | 2 | 3 | 4 | 5;             // 1 = "very unsure" → 5 = "certain"
  actualCorrect: boolean;
  delta: number;                             // |JOL_normalised - actual_score|
  capturedAt: Date;
}

// LM7 — Streak with variable-ratio reinforcement
export interface Streak {
  userId: string;
  currentDays: number;
  longestDays: number;
  lastActiveDay: string;                    // YYYY-MM-DD
  freezesAvailable: number;                 // streak-freeze affordance
  modalStudyTime: { hour: number; minute: number; tz: string }; // for push-notification anchoring
  pushOptIn: boolean;
}

// LM8 — Cohort surface
export interface CohortContext {
  cohortId: string;
  tenantId: string;
  catalogId: string;
  startDate: Date;
  endDate: Date;
  memberCount: number;
  liveTouchpointSlot?: { weekday: number; hour: number; minute: number; tz: string };
}
export interface CohortMember {
  cohortId: string;
  userId: string;
  role: "learner" | "facilitator";
  joinedAt: Date;
}
```

#### 3.8.3 — SME-side data contracts (SM1–SM8)

```typescript
// SM1 — CTA 5-probe drafter intake (rejected if any field empty)
export interface DrafterIntake {
  draftId: string;
  noviceError: string;                      // What does a novice typically get wrong?
  onePrinciple: string;                     // The single most important takeaway
  workedExample: { worked: string; faded: string }; // SM3 — pair editor
  boundaryCase: string;                     // Where does this stop being true?
  nearestConfusable: string;                // What concept is most easily mistaken for this?
  authoredBy: string;                       // SME user.id
  authoredAt: Date;
}

// SM2 — Backward-design lock state
export interface BackwardDesignState {
  draftId: string;
  assessmentAuthoredAt: Date | null;        // lesson editor disabled until non-null
  passingTestExists: boolean;               // a quiz draft that the SME themselves can pass
  lessonUnlockedAt: Date | null;
}

// SM4 — Expert blind-spot probe
export interface BlindSpotProbe {
  draftId: string;
  noviceWouldGetWrong: string;              // free text, required at submit
  flaggedByCritic: string[];                // critic adds to this list during review
}

// SM5 — Closed-taxonomy principle picker
export interface PrincipleTag {
  bSkillCode: string;                       // approved B-skill code (e.g. "B1.4")
  text: string;                             // canonical text from taxonomy
  // Free-typed principles unmapped to this taxonomy are rejected at submit
}

// SM6 — 4C/ID coverage gate (Phase-2 critic checks all four present)
export interface FourCidCoverage {
  learningTasks: boolean;                   // (a) authentic whole-task practice
  supportiveInfo: boolean;                  // (b) background / theory
  jitInfo: boolean;                         // (c) just-in-time procedural info
  partTaskPractice: boolean;                // (d) drills for component skills
}

// SM8 — Per-SME blind-spot rolling signal
export interface SmeBlindSpotSignal {
  smeUserId: string;
  windowDays: number;                       // rolling window (default 30)
  draftsAuthored: number;
  criticRejectionsByCategory: Record<
    "expert_blind_spot" | "principle_unstated" | "no_worked_example" | "no_boundary_case" |
    "missing_4cid_component" | "fcode_F9" | "fcode_F10" | "fcode_F11" | "fcode_F12",
    number
  >;
  trend: "improving" | "flat" | "regressing";
  lastUpdatedAt: Date;
}
```

#### 3.8.4 — Critic output (Phase 2; consumed by P9 + P11)

The Phase-2 Opus critic produces a structured object that drives both publish-gating (P9) and the per-SME blind-spot dashboard (P11). Schema mirrors Section D §D3:

```typescript
export interface CriticOutput {
  confidence: number;                       // 0..1
  findings: Finding[];                      // §3.3 shape
  missingComponents: ("learning_tasks" | "supportive_info" | "jit_info" | "part_task_practice")[];
  blindSpotFlags: (
    | "expert_blind_spot" | "principle_unstated" | "no_worked_example"
    | "no_boundary_case" | "no_nearest_confusable"
  )[];
  fcodeRisks: ("F1"|"F2"|"F3"|"F4"|"F5"|"F6"|"F7"|"F8"|"F9"|"F10"|"F11"|"F12")[];
  suggestedProbes: string[];                // probe text the SME should answer before re-submit
  answerJustifications: { questionN: number; cited: boolean; span?: string }[];
}
```

**Refuse-to-publish gates** (Phase 2):
- Any `answerJustifications[i].cited === false` → block (already covered by validator 23).
- Any `missingComponents` non-empty → block (4C/ID gate).
- Any `blindSpotFlags` non-empty AND `tenant_policy.two_eye_gate` is on → block until SME re-submits.

#### 3.8.5 — Section D database tables (Drizzle additions)

Phase-2 only. None of these are required for Phase-1 sign-off.

```typescript
// packages/db/src/section-d-schema.ts

export const spacedReviewItem = pgTable("spaced_review_item", {
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  userId: uuid("user_id").notNull().references(() => user.id),
  conceptId: text("concept_id").notNull(),
  catalogVersionId: uuid("catalog_version_id").notNull().references(() => catalogVersion.id),
  dueAt: timestamp("due_at").notNull(),
  intervalDays: integer("interval_days").notNull().default(1),
  consecutiveMisses: integer("consecutive_misses").notNull().default(0),
  isLeech: boolean("is_leech").notNull().default(false),
  lastReviewedAt: timestamp("last_reviewed_at"),
  lastWasCorrect: boolean("last_was_correct"),
}, t => ({ pk: primaryKey({ columns: [t.tenantId, t.userId, t.conceptId, t.catalogVersionId] }) }));

export const calibrationEvent = pgTable("calibration_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  userId: uuid("user_id").notNull().references(() => user.id),
  conceptId: text("concept_id").notNull(),
  questionN: integer("question_n").notNull(),
  jolBefore: integer("jol_before").notNull(),       // 1..5
  actualCorrect: boolean("actual_correct").notNull(),
  delta: numeric("delta", { precision: 4, scale: 3 }).notNull(),
  capturedAt: timestamp("captured_at").notNull().defaultNow(),
});

export const retrievalEvent = pgTable("retrieval_event", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  userId: uuid("user_id").notNull().references(() => user.id),
  conceptId: text("concept_id").notNull(),
  prompt: text("prompt").notNull(),
  learnerWrote: text("learner_wrote").notNull(),
  judgedCorrect: boolean("judged_correct").notNull(),
  latencyMs: integer("latency_ms").notNull(),
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
});

export const streak = pgTable("streak", {
  userId: uuid("user_id").primaryKey().references(() => user.id),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  currentDays: integer("current_days").notNull().default(0),
  longestDays: integer("longest_days").notNull().default(0),
  lastActiveDay: text("last_active_day"),               // YYYY-MM-DD
  freezesAvailable: integer("freezes_available").notNull().default(2),
  modalStudyHour: integer("modal_study_hour"),          // 0..23, learned over time
  modalStudyMinute: integer("modal_study_minute"),
  modalStudyTz: text("modal_study_tz"),                 // IANA tz
  pushOptIn: boolean("push_opt_in").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cohort = pgTable("cohort", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  catalogId: uuid("catalog_id").notNull().references(() => catalog.id),
  slug: text("slug").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  liveTouchpointSlotJson: jsonb("live_touchpoint_slot"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cohortMember = pgTable("cohort_member", {
  cohortId: uuid("cohort_id").notNull().references(() => cohort.id),
  userId: uuid("user_id").notNull().references(() => user.id),
  role: text("role").$type<"learner"|"facilitator">().notNull().default("learner"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
}, t => ({ pk: primaryKey({ columns: [t.cohortId, t.userId] }) }));

export const drafterIntake = pgTable("drafter_intake", {
  draftId: uuid("draft_id").primaryKey().references(() => draft.id),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  noviceError: text("novice_error").notNull(),
  onePrinciple: text("one_principle").notNull(),
  workedExample: text("worked_example").notNull(),
  fadedVariant: text("faded_variant").notNull(),
  boundaryCase: text("boundary_case").notNull(),
  nearestConfusable: text("nearest_confusable").notNull(),
  noviceWouldGetWrong: text("novice_would_get_wrong").notNull(),    // SM4 probe
  authoredBy: uuid("authored_by").notNull().references(() => user.id),
  authoredAt: timestamp("authored_at").notNull().defaultNow(),
});

export const smeBlindSpotSignal = pgTable("sme_blind_spot_signal", {
  smeUserId: uuid("sme_user_id").primaryKey().references(() => user.id),
  tenantId: uuid("tenant_id").notNull().references(() => tenant.id),
  windowDays: integer("window_days").notNull().default(30),
  draftsAuthored: integer("drafts_authored").notNull().default(0),
  rejectionsJson: jsonb("rejections_json").$type<Record<string, number>>().notNull(),
  trend: text("trend").$type<"improving"|"flat"|"regressing">().notNull().default("flat"),
  lastUpdatedAt: timestamp("last_updated_at").notNull().defaultNow(),
});
```

All Section D tables that are tenant-scoped follow the §3.5 RLS pattern. `streak` and `cohort_member` are dual-keyed; the RLS predicate matches on `tenant_id` even on join tables. Cohort-flow events (`cohort_join`, `cohort_complete`, `peer_compare_view`) reuse the existing `event` table.

#### 3.8.6 — Validators 24–30 (Section D additions)

Numbering continues from §3.3. Same `Finding` shape, same three call sites (local lint, server import, Phase-2 critic).

| # | Validator | What it catches | F-code |
|---|---|---|---|
| 24 | `letterBiasV2Validator` | A catalog/section's correct-letter distribution exceeds 55% of any single letter (replaces stricter §3.3 #6 "all same"; tunable per tenant via `tenant_policy.rule_overrides`) | F12 |
| 25 | `intakeRequiredValidator` | A draft's `drafter_intake` row has any of the 5 SM1 fields empty | — (SM1) |
| 26 | `backwardDesignValidator` | Lesson body present but no quiz / no passing test exists for the draft | — (SM2) |
| 27 | `workedExamplePairValidator` | `workedExample` present but `fadedVariant` missing, or faded variant has not removed at least one hint (length-delta heuristic + manual override flag) | — (SM3) |
| 28 | `principleTagInTaxonomyValidator` | A question's `principle` is free text not mapped to the closed B-skill taxonomy in `packages/shared/src/principle-taxonomy.ts` | — (SM5) |
| 29 | `fourCidCoverageValidator` | (Phase-2 critic) `CriticOutput.missingComponents` is non-empty | — (SM6) |
| 30 | `expertBlindSpotProbeValidator` | `drafter_intake.noviceWouldGetWrong` is empty or < 30 chars | — (SM4) |

The Phase-2 cycle reads:

```
draft → validators 1–22 → drafter intake check (24–30 client-side) →
        Sonnet drafter (P8) → validators 1–22 → Opus critic (P9; emits CriticOutput) →
        validators 23, 29 (justification + 4C/ID gates) → publish | queue review
```

#### 3.8.7 — Spaced-review interval ladder (LM1)

Server-side scheduler in `apps/web/src/lib/spaced-review.ts`. Pure function; no I/O.

```typescript
export function nextInterval(prev: SpacedReviewItem, wasCorrect: boolean): { intervalDays: number; isLeech: boolean } {
  if (!wasCorrect) {
    const consecutiveMisses = prev.consecutiveMisses + 1;
    const isLeech = consecutiveMisses >= 3;
    return { intervalDays: 1, isLeech };           // reset to 1d on miss; flag as leech at 3+
  }
  const ladder = [1, 3, 7, 14, 30, 60];
  const next = ladder[Math.min(ladder.indexOf(prev.intervalDays) + 1, ladder.length - 1)];
  return { intervalDays: next, isLeech: prev.isLeech };
}
```

Cron (P11) enqueues due items nightly at 03:00 UTC; SpacedReviewBanner (P3 extension) surfaces the 3 oldest due items on dashboard.

#### 3.8.8 — Streak push cadence (LM7)

Variable-ratio reinforcement schedule (Skinner / Eyal). `apps/web/src/lib/streak-push.ts`:

- **Anchor** push at the user's modal study time ± 30 min jitter.
- **Variable ratio**: send on day d with probability `p(d)`, where `p` follows a multi-armed bandit (Thompson sampling) optimising for return-visit-given-push within 24h.
- **Floor**: send at most one push per day; never between 22:00–07:00 user-local.
- **Email digest fallback** when push not granted.
- **Streak-freeze**: 2 free freezes/month; auto-applied on a missed day if available.

#### 3.8.9 — TTFV markers (Section D §D5)

Two TTFV (time-to-first-value) acceptance criteria are added to Phase-1 Verification (Part 6.1) and Phase-2 Verification (Part 6.2):

- **Learner TTFV ≤ 5 min.** Measured from `signup` event → first `quiz_submit` event with `score_pct ≥ passing`. Tracked via PostHog funnel.
- **SME TTFV ≤ 1 hour.** Measured from `drafter_intake.authoredAt` → `catalog_version.publishedAt` for the draft. Aggregated per-SME, surfaced in `/admin/sme/[id]/`.

#### 3.8.10 — Kirkpatrick L1–L4 measurement contracts (Section D §D4)

The platform commits to four levels of measurement. Each level has a designated metric, a designated event source, and a target threshold:

| Level | Metric | Event source(s) | Target |
|---|---|---|---|
| **L1** Reaction | NPS + CES post-section | `event` table `nps_response`, `ces_response` | NPS ≥ 40 (B2C), ≥ 50 (B2B) |
| **L2** Learning | Mock pass-rate trajectory + calibration Δ | `quiz_submit`, `calibration_event` | \|Δ\| ≤ 0.5 |
| **L3** Behaviour | D1/D7/D30 cohort retention; CURR; completion-rate; spaced-review clearance | `signup`, `lesson_view`, `quiz_submit`, `cohort_complete` | D7 ≥ 40% (cohort), D30 ≥ 35%, completion ≥ 60% |
| **L4** Results | NRR, expansion revenue, gross margin | Stripe webhook → `subscription` table | NRR Y1 ≥ 110%, Y2 ≥ 120%, margin > 95% |

Implementation of these dashboards is in P11 (post-publish quality signals + cohort aggregator). Required Phase-1 wiring: the four event types above (`nps_response`, `ces_response`, `cohort_complete` plus the existing `quiz_submit`) must already be emitted in P3/P5 even though the dashboards land later.

---

## Part 4 — Phase 1 (POC) implementation

Six phases, ~18 working days total. Each phase is one branch, one PR, codex-reviewed before merge.

> **How each phase works:** Operator does the **Pre-tasks**, then pastes the verbatim **AI prompt** into a fresh Claude Code session in the repo. The AI completes the work, opens a PR, runs verification. Operator does the **Verification** clicks. When all DoD boxes are ticked, merge and start the next phase.

### P1 — Monorepo, DB schema, auth, storage (~3 days)

**Goal:** working monorepo with Drizzle schema migrated, Clerk auth gated routes, R2 read/write helper, and the RLS isolation test passing.

#### P1 Pre-tasks (operator)

- [ ] All Phase 1 services in `.env` (verified via `pnpm dlx envalid` or by visiting each service dashboard).
- [ ] Branch protection on `main` requires PR + codex review.
- [ ] Empty Vercel projects do **not** exist yet (P1's last step creates the app project).

#### P1 AI prompt (paste into fresh Claude Code session)

```
You are building Phase 1 P1 of the Content Pack Management Platform.
The full implementation guide is at plans/IMPLEMENTATION.md — read it
end-to-end before starting; it is the source of truth for every choice.

OBJECTIVES (in order):

1. Initialize a pnpm workspace at the repo root with these packages:
   - apps/web        (Next.js 16, App Router, TypeScript strict, Tailwind v4)
   - packages/shared (curriculum types from §3.1, validators 1–22 from §3.3)
   - packages/db     (Drizzle schema from §3.4, withTenant helper from §3.6,
                      RLS policies from §3.5)
   - packages/shared-ui (LessonView, QuizRunner, Button, Input — Base UI primitives,
                         Tailwind v4, no heavy framework. shadcn-style colocated.)

2. Set up Drizzle:
   - drizzle.config.ts in packages/db
   - npm scripts: db:generate (drizzle-kit generate), db:migrate (drizzle-kit migrate),
     db:studio (drizzle-kit studio), db:reset (drop+recreate schema; refuse if
     NODE_ENV === 'production')
   - Generate the initial migration. Apply it to Neon. Commit the SQL.
   - Add a SQL file under packages/db/migrations/_rls.sql containing the RLS
     enable + policy statements for every tenant-scoped table. Apply it.

3. Wire Clerk in apps/web:
   - middleware.ts protecting (learner) and (admin) route groups
   - /sign-in and /sign-up pages using Clerk components
   - On first sign-in, upsert a row in the user table (clerk_id → user.id),
     and if the Clerk session has an organization, ensure a tenant row exists
     and a tenant_member row links the user to that tenant. If no org,
     create a personal tenant for the user with a slug like `personal-<short-clerk-id>`.

4. Implement the R2 client at apps/web/src/server/r2-client.ts:
   - readObject(key): Buffer
   - writeObject(key, body, contentType): void
   - presignReadUrl(key, ttlSeconds): string (S3 v4 presign)
   - Uses @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner pointed at R2 endpoint

5. Implement withTenant helper exactly as in §3.6 of the guide. Add a unit test
   that asserts unset tenant context returns 0 rows from a seeded 2-tenant DB.

6. Add a vitest integration test at packages/db/__tests__/rls.test.ts that:
   - seeds two tenants A and B with one catalog each
   - asserts withTenant(A, ...) returns only A's catalog
   - asserts a raw query (no withTenant) returns 0 rows
   - This test MUST pass; it is the gate of P1.

7. Commit in small atomic commits, one concern per commit. Open a PR titled
   "P1: monorepo, DB schema, Clerk, R2, RLS test". Wait for codex review.

CONSTRAINTS:
- TypeScript strict mode, no `any` without comment justification.
- No Anthropic API calls anywhere in the codebase.
- Follow §3.1 types verbatim — do not invent fields.
- All tenant-scoped queries must go through withTenant; add an ESLint rule that
  flags db.select().from(<tenant-scoped-table>) outside withTenant.
- Tests must run via `pnpm test` and `pnpm test:e2e` from repo root.
- Lighthouse / accessibility verification is in P3, not now.

DELIVERABLES:
- pnpm-workspace.yaml, packages/{shared,db,shared-ui}, apps/web
- packages/db migrations + RLS SQL file applied
- Vitest RLS isolation test passing
- PR open with green CI

When done, post a summary to the PR description listing every file created
and every test added, plus the exact commands the operator runs to verify.
```

#### P1 Operator verification

After AI says "done":

1. **Pull the branch.** `git fetch && git checkout claude/p1-bootstrap`
2. **Install + run:** `pnpm install && pnpm test` — must be all green.
3. **Apply migrations to Neon:** `pnpm --filter db db:migrate` then `psql "$DATABASE_URL" -f packages/db/migrations/_rls.sql`. (AI should script this; verify the script ran without errors.)
4. **Boot the dev server:** `pnpm --filter web dev`. Visit `localhost:3000/sign-up`, create a test account, confirm you land on a placeholder `/`.
5. **Inspect Drizzle Studio:** `pnpm --filter db db:studio`. Confirm `tenant`, `user`, `tenant_member` rows exist for the test account.
6. **Connect Vercel:** in Vercel dashboard, import the repo as a project; root directory `apps/web`. Add all `.env` values to Vercel. Deploy preview should succeed.

#### P1 Definition of Done

- [ ] PR merged to main after codex review passes.
- [ ] RLS isolation test green in CI.
- [ ] Migrations + RLS policies applied to Neon.
- [ ] Test sign-up creates user + tenant + tenant_member rows.
- [ ] Vercel preview deploy succeeds (no DNS yet).
- [ ] All routes outside `(public)` return 401/redirect when unauthenticated.

---

### P2 — Astro marketing site + lead capture (~3 days)

**Goal:** marketing site live at `www.<domain>`, with B2B LOI form, B2C waitlist, and Stripe pre-order Payment Link. Forms POST to `/api/leads` on the app subdomain.

#### P2 Pre-tasks (operator)

- [ ] In Stripe (test mode), create a product "CCA-F Pro Pre-order — $9 refundable" with a Payment Link. Save the URL to `STRIPE_PREORDER_PAYMENT_LINK`.
- [ ] In Stripe, create a webhook endpoint pointing at `https://app.<domain>/api/stripe-webhook` (placeholder; we'll DNS in step 6 below). Save signing secret to `STRIPE_WEBHOOK_SECRET`.
- [ ] In Resend, verify your sending domain (DNS records propagated).

#### P2 AI prompt

```
You are building Phase 1 P2 of the Content Pack Management Platform.
Read plans/IMPLEMENTATION.md §1, §2, §3, §4-P2 in full before starting.

OBJECTIVES:

1. Create apps/marketing as an Astro 5 project (separate workspace; will deploy
   to Vercel as a separate project later).
   - Pages: index.astro (home), b2b.astro, b2c.astro, pricing-preview.astro,
     about.astro, blog/index.astro (stub).
   - Use Tailwind v4 via @tailwindcss/vite. Share design tokens with apps/web
     via packages/design-tokens (a tiny CSS-vars package).
   - Mobile-first, accessibility AA, Lighthouse mobile ≥ 95.

2. Build two forms on the marketing site:
   - On /b2b: "Request a pilot" form with fields email, org_name, org_size,
     use_case. POSTs to https://app.<domain>/api/leads with kind=b2b_pilot.
   - On /b2c: "Get early access" waitlist with field email. POSTs to /api/leads
     with kind=b2c_waitlist. Below it, a CTA "Reserve a Pro seat for $9
     (refundable)" linking to STRIPE_PREORDER_PAYMENT_LINK.
   - Both forms show a thank-you message inline on success and a friendly error
     on failure. No spinners that block (use optimistic UI).

3. In apps/web, add /api/leads (POST) that:
   - Validates the body with Zod.
   - Inserts into the `lead` table (kind, email, org_name, org_size, use_case,
     source from `Origin` header).
   - Sends a Resend email to RESEND_FROM_EMAIL with the lead details
     (operator notification) and an auto-reply to the lead's email
     (templated; markdown body).
   - Rate-limited to 5 submissions per IP per hour (in-memory LRU; OK for POC).
   - CORS allows the marketing-site origin (NEXT_PUBLIC_MARKETING_URL).

4. In apps/web, add /api/stripe-webhook (POST) that:
   - Verifies signature with STRIPE_WEBHOOK_SECRET.
   - On `payment_intent.succeeded`, inserts a lead row with kind=b2c_preorder
     and stripe_payment_intent_id set.
   - Returns 200 with no body on success; 400 on bad signature.

5. Add a /admin/leads page (admin-only) that lists leads grouped by kind, with
   CSV export. Mobile-friendly table.

6. Configure Vercel:
   - Create a second Vercel project pointing at apps/marketing.
   - Add CNAMEs in Cloudflare DNS: www → marketing project, app → web project.
   - Verify both deploy and the production URLs respond.

7. Tests:
   - Vitest: /api/leads validates input, rate-limits, writes to DB, sends Resend.
   - Vitest: /api/stripe-webhook signature verification + DB write.
   - Playwright e2e: marketing-site forms submit and show thank-you.
   - Lighthouse mobile ≥ 95 on each marketing page (use lhci CI action).

8. Commit small, atomic. PR title "P2: Astro marketing + LOI/waitlist/preorder
   capture". Codex review.

CONSTRAINTS:
- Marketing site is fully static at build time (no SSR). It must function
  with JavaScript disabled — forms degrade gracefully to a mailto link.
- No PII in PostHog events; use lead.id only.
- Resend sender must be a verified domain (operator did this in pre-tasks).
- Astro workspace must not depend on Clerk or Drizzle; it knows nothing about
  the app's auth or DB.

DELIVERABLES:
- apps/marketing deployed at https://www.<domain>
- /api/leads + /api/stripe-webhook live at https://app.<domain>
- /admin/leads page renders a list of test leads
- All tests green in CI
```

#### P2 Operator verification

1. Visit `https://www.<domain>/b2b`. Submit the form with a test email. Confirm:
   - Thank-you message appears inline.
   - You receive an auto-reply email at the test address.
   - You receive an operator notification at `RESEND_FROM_EMAIL`.
2. Visit `https://www.<domain>/b2c`. Same waitlist test.
3. Click "Reserve a Pro seat for $9". Stripe Payment Link opens; complete a test charge using `4242 4242 4242 4242`. Stripe dashboard shows the payment.
4. In Stripe → Developers → Webhooks → recent deliveries, confirm a 200 from your `/api/stripe-webhook`.
5. Visit `https://app.<domain>/admin/leads` (signed in as operator). All three test leads should appear: one B2B, one B2C waitlist, one pre-order.
6. Run Lighthouse mobile against `https://www.<domain>`. Score ≥ 95.

#### P2 Definition of Done

- [ ] Both Vercel projects deploying on push to `main`.
- [ ] DNS resolved: `www.<domain>` → marketing, `app.<domain>` → app.
- [ ] All three test leads (B2B, B2C waitlist, B2C preorder) visible in `/admin/leads`.
- [ ] Stripe webhook signature verification tested with a malformed signature → returns 400.
- [ ] Lighthouse mobile ≥ 95 on every marketing page.
- [ ] Operator received both notification emails and one auto-reply.

---

### P3 — Learner app: catalog, lesson, quiz, progress, search, suggest (~4 days)

**Goal:** signed-in learner can browse catalogs, take a lesson + quiz, see progress, search across catalogs, submit a suggestion. Mobile Lighthouse ≥ 90.

#### P3 Pre-tasks (operator)

- [ ] Have one sample content pack ready (just JSON with one catalog, two concepts, two quizzes — paste from `plans/IMPLEMENTATION.md` §3.1 or use the cca-f-prep sample). Save it at `apps/web/seed/sample-pack.json`.

#### P3 AI prompt

```
You are building Phase 1 P3 of the Content Pack Management Platform.
Read plans/IMPLEMENTATION.md §1, §3 (curriculum types + validators), §4-P3
in full before starting.

OBJECTIVES:

1. Seed the DB with the sample pack at apps/web/seed/sample-pack.json:
   - Insert one catalog row + one catalog_version row.
   - Upload the JSON to R2 at key `packs/<catalog-slug>/v1.json`.
   - Set catalog.current_version_id.
   - Idempotent (running twice does not create duplicates).
   - Wire as `pnpm --filter web seed`.

2. Build the learner pages under (learner) route group:
   - /                       Catalog browse: grid of catalog cards
   - /catalogs/[slug]        Catalog landing: blurb + section list + concept tiles
   - /catalogs/[slug]/[code] Concept page: LessonView + QuizRunner
   - /search?q=...           Postgres `tsvector` search across all accessible catalogs
   - /me/progress            Personal progress overview

3. Implement LessonView (in packages/shared-ui):
   - Tabs for Easy / Conceptual / Deeper depth
   - Renders paragraphs, keyPoints (bullets), examples (cards), pitfalls (warning bullets)
   - The Easy/Deeper tabs disable if the lesson has no `simplified` / `deeper` block

4. Implement QuizRunner (in packages/shared-ui):
   - 3 questions, one at a time with a stepper
   - Supports MCQ, TrueFalse, FillIn (per §3.1 types)
   - On submit: shows correct/incorrect with `principle` line and per-option `explanations`
   - Keyboard accessible (Tab through options, Enter to submit)
   - Records progress via /api/progress on submit

5. Implement progress sync:
   - /api/progress (POST) inserts/updates a progress row keyed by (tenantId, userId, conceptId)
   - Status: viewed (lesson opened) → quizzed (quiz started) → complete (quiz submitted with score)
   - LocalStorage warm cache hydrates on page load; server is canonical

6. Implement search:
   - tsvector column on catalog_version with weights: title (A), concept titles (B), lesson paragraphs (C)
   - GIN index on the tsvector column
   - /api/search?q=… returns up to 20 hits, each with catalog title, concept title, snippet
   - Search input on every page (cmd-K modal)

7. Implement suggestion submit:
   - "Suggest a topic" button on every concept page and at catalog level
   - Modal with text area (max 500 chars)
   - POSTs to /api/suggestions; rate-limited per tenant_policy.suggestionsPerUserPerDay
   - Closed-list disallowed-tokens filter (load from packages/shared/src/disallowed.json)
   - On success: optimistic UI shows "we heard you"

8. Mobile-first design:
   - Tailwind breakpoints sm 640, md 768, lg 1024
   - Lighthouse mobile ≥ 90 on /, /catalogs/[slug], /catalogs/[slug]/[code]
   - All interactive elements ≥ 44×44 px tap target

9. Tests:
   - Vitest unit: LessonView depth toggle, QuizRunner answer submit
   - Playwright e2e: sign-up → browse → take quiz → see progress
   - Vitest integration: /api/progress writes through withTenant
   - Vitest integration: /api/search returns hits in expected weight order

10. Commit small, atomic. PR "P3: learner app — catalogs, lessons, quizzes,
    progress, search, suggestions". Codex review.

CONSTRAINTS:
- Every DB call inside /api/* handlers MUST go through withTenant (lint enforced).
- No third-party UI libs beyond Base UI + Tailwind. No Material UI, no Chakra.
- Keep `apps/web` bundle ≤ 220 kB gzipped on the learner home (perf budget).
- Server components by default; client components only where interactivity demands.

DELIVERABLES:
- All learner routes functional with the sample pack
- Lighthouse mobile ≥ 90
- Tests green
```

#### P3 Operator verification

1. Sign in as test learner. Land on `/`. The sample catalog tile shows up.
2. Click into the catalog. Section + concept list renders.
3. Click a concept. Lesson reads cleanly on mobile width (375 px). Toggle Easy/Deeper — content changes.
4. Take the quiz. Submit. See the correctness indicator + principle line.
5. Visit `/me/progress`. The completed concept shows.
6. Cmd-K → search for a word from the lesson. Hit lands you on the right concept.
7. Click "Suggest a topic", submit. See "we heard you". Confirm a row in the `suggestion` table.
8. Run Lighthouse mobile against `/catalogs/[slug]`. ≥ 90.
9. Disable JavaScript: confirm `/` still shows server-rendered catalog list (graceful degradation).

#### P3 Definition of Done

- [ ] Learner can complete the full happy path on mobile.
- [ ] Progress row persists across sessions.
- [ ] Suggestion submitted with a disallowed token (e.g. profanity from the closed list) is rejected with a friendly error.
- [ ] Lighthouse mobile ≥ 90 on every learner page.
- [ ] Bundle size budget met.
- [ ] All tests green; codex review passed.

#### P3 Section D extensions (LM2 / LM3 / LM5 / LM6 — learner-side absorption mechanics)

These extensions can be built inside P3 or split into a P3.b PR — operator's choice. **Add these sub-bullets to the P3 AI prompt** above:

```
ADDITIONAL OBJECTIVES (Section D — read §3.8 first):

11. RetrievalGate (LM2) inside LessonView:
    - After ~50% of paragraphs, render a "Quick check" gate: a 1-Q recall prompt
      (sourced from concept.lesson.keyPoints[0] or a draft.intake.onePrinciple
      if available); learner types a sentence; "Next" stays disabled until
      submit; on submit, write a retrieval_event row.
    - Self-judged correctness (radio: "I covered this | I missed it"); the
      Phase-2 critic adds model-judging later. Latency captured for L3.

12. PrincipleWrite (LM3) before answer reveal in QuizRunner:
    - Add a small textarea labelled "In one sentence, what's the principle
      this question tests?" that must be non-empty before the answer reveal
      button enables. Compare similarity (Levenshtein over normalised text)
      to question.principle; surface a soft "your wording is close / very
      different" note (no blocking).

13. JOL slider (LM6) in QuizRunner:
    - Before submit, show a 1–5 confidence slider ("How sure are you?").
    - On submit, POST /api/calibration/event with {jolBefore, actualCorrect}.
      Server computes delta = |jol_normalised - score| and writes a
      calibration_event row.
    - The /me/progress page gains a "Calibration trend" chart (sparkline of
      |delta| over the last 30 events).

14. Depth-4-rung "solo" (LM5) in LessonView:
    - The depth toggle gains a 4th option "Solo" that disables hints,
      examples, and pitfalls — only paragraphs render.
    - "Solo" is gated: visible-but-disabled until a derived mastery score
      ≥ 0.7 (correct ≥ 70% on the last 5 attempts of this concept's quiz).
    - Mastery score helper at packages/shared/src/mastery.ts.

15. /api/calibration/event (POST):
    - Validates body, computes delta, writes calibration_event with
      withTenant, emits a 'calibration_recorded' PostHog event for L2 funnel.

16. Tests:
    - Vitest: nextInterval helper from §3.8.7 (correct ladder + leech rule).
    - Vitest: retrieval-event write-through; rls-isolation for retrieval_event.
    - Vitest: calibration delta computed correctly across normalisation cases.
    - Playwright: a quiz attempt submits with JOL captured and chart updates.

CONSTRAINTS for Section D extensions:
- These features add weight; preserve P3's bundle budget (≤ 220 kB gzipped on
  /catalogs/[slug]/[code]) — lazy-load the calibration chart.
- The retrieval-event self-judging is intentionally generous in Phase 1
  (no model-judging yet); Phase 2 P9 critic upgrades the judge.
- Each Section D mechanic is independently feature-flagged via
  tenant_policy.rule_overrides.flags so a tenant can opt out (B2B compliance).
```

#### P3 Section D — Definition of Done (additions)

- [ ] RetrievalGate renders in any lesson with ≥ 4 paragraphs; "Next" is gated.
- [ ] PrincipleWrite blocks reveal until a non-empty sentence is typed.
- [ ] JOL slider captured for every quiz submit; calibration_event row written; rls-isolated.
- [ ] Depth-4-rung "Solo" hidden until mastery threshold met; transitions correctly.
- [ ] `/api/calibration/event` end-to-end test green.
- [ ] Mobile Lighthouse stays ≥ 90 even with the new surfaces.

---

### P4 — Admin app: import draft, lint, suggestions, knowledge files, leads (~4 days)

**Goal:** operator can paste a draft JSON into `/admin/catalogs/[id]/import`, see validator results, see a diff vs the current published version, publish or save as draft. Plus suggestions triage, knowledge file upload, and the leads dashboard from P2.

#### P4 Pre-tasks (operator)

- [ ] Promote your test account to `admin` role on the test tenant: in Drizzle Studio, set `tenant_member.role = 'admin'`.
- [ ] Have one knowledge file ready (any PDF or markdown, ~1 MB) for upload testing.

#### P4 AI prompt

```
You are building Phase 1 P4 of the Content Pack Management Platform.
Read plans/IMPLEMENTATION.md §1, §3.3 (validators), §3.4 (schema), §4-P4.

OBJECTIVES:

1. Build the (admin) route group, all gated by `tenant_member.role = 'admin'`:
   - /admin                 Dashboard (counts + funnel widgets)
   - /admin/catalogs        List + create + archive
   - /admin/catalogs/[id]   Detail: version history, current version, rollback
   - /admin/catalogs/[id]/import   Import draft JSON
   - /admin/catalogs/[id]/lint     Run all validators against current version
   - /admin/suggestions     Triage queue: open / accepted / dismissed / linked
   - /admin/knowledge       Upload + list knowledge files
   - /admin/leads           Already exists from P2; add CSV export and filters
   - /admin/settings        Tenant policy editor

2. Implement the import flow at /admin/catalogs/[id]/import:
   - Big text area for JSON paste, or "Upload .json" button.
   - On submit, server validates with packages/shared validators 1–22 (NOT 23
     — that's Phase 2). Returns a structured LintResult.
   - UI shows findings grouped by severity. Errors block publish; warns are
     shown but allow publish-anyway (logged with operator override).
   - If valid: render a side-by-side diff (the `diff` package, JSON-aware) of
     current published version vs the draft. Operator clicks "Publish" or
     "Save draft for later".
   - "Publish": writes new catalog_version row + uploads to R2 +
     flips catalog.current_version_id + calls revalidateTag(`catalog:${id}`).
   - "Save draft": writes a draft row with status=pending. Re-importing later
     loads from the draft.

3. Implement /admin/catalogs/[id]/lint:
   - Loads the current published version, runs all validators, displays findings.
   - Used to find latent bias (e.g. CCA-F pack's B-bias).
   - Shows a heatmap of correct-letter distribution per quiz.

4. Implement /admin/suggestions triage:
   - Filterable list (status, catalog, age).
   - Each row: text + author + count of similar suggestions (TF-IDF + Jaccard
     similarity, see lib at packages/shared/src/dedup-tfidf.ts).
   - Actions per row: Accept, Dismiss with reason, Link to existing.
   - "Accept" copies the text to the clipboard formatted as a Claude Code prompt
     "Draft a topic that addresses: <suggestion>" so operator can paste into
     their local Claude Code session.

5. Implement knowledge file upload at /admin/knowledge:
   - Drag-drop or file picker. Accepted: .pdf, .md, .txt, .docx (≤ 10 MB).
   - Server-side: validate MIME type, then upload to R2 at
     `tenants/<tenant-id>/knowledge/<file-id>.<ext>`.
   - For PDFs, extract text using `unpdf` (Mozilla pdf.js wrapper). DO NOT use
     pdf-parse (unmaintained). Text extraction runs in a serverless function
     with no DB access; quarantine the file on parse failure.
   - For .docx, use `mammoth`.
   - Store metadata in knowledge_file table; the extracted text is stored in
     R2 at `tenants/<tenant-id>/knowledge/<file-id>.txt` for the operator's
     Claude Code skill to read.

6. Implement /admin/settings:
   - Form bound to tenant_policy row (create on demand if missing).
   - Editable: approval mode, suggestion rate limit, suggestion daily cap.
   - Phase 2 fields (confidence_threshold, two_eye_gate, monthly_token_budget_usd)
     are visible but disabled with the tooltip "available in Commercial phase".

7. Tests:
   - Vitest: importing a draft with a B-bias quiz returns a finding with fCode=F1.
   - Vitest: importing a draft with all 4 options being paraphrases returns a
     distractor-differentiation finding.
   - Vitest: rollback flips current_version_id.
   - Playwright e2e: operator pastes draft → sees diff → publishes → learner
     sees new content on next request.

8. Commit small, atomic. PR "P4: admin — import, lint, suggestions, knowledge,
   leads, settings".

CONSTRAINTS:
- Admin pages are SSR/server components by default; only the import diff
  viewer is client-side.
- Every admin handler runs withTenant; the role check happens in middleware
  before the handler runs.
- Knowledge file upload limit: 10 MB POC, 25 MB at Phase 2.
- The PDF parse function must be isolated (no DB import) and quarantine the
  file on parse failure — quarantined files do not block the upload UI.

DELIVERABLES:
- Full admin app functional
- Validator findings render with F-code badges
- Diff viewer shows side-by-side JSON
- Knowledge file upload + text extraction working
- All tests green
```

#### P4 Operator verification

1. Visit `/admin`. Dashboard shows lead counts from P2.
2. Visit `/admin/catalogs`. Create a catalog "Test 2".
3. Visit `/admin/catalogs/<id>/import`. Paste a draft JSON with a B-bias quiz (all 4 questions correct = B). Confirm validator finding appears with `F1` badge. Click "Publish" — should be **blocked**.
4. Edit the JSON to mix correct letters; resubmit. Diff renders. Click "Publish".
5. Visit the learner side, confirm the new concept is visible.
6. Visit `/admin/catalogs/<id>` — version history shows v1 + v2. Click "Rollback to v1". Learner now sees v1.
7. Submit a suggestion as the learner; visit `/admin/suggestions` as admin. Click "Accept" — clipboard contains the formatted Claude Code prompt.
8. Visit `/admin/knowledge`. Upload a 1 MB PDF. Confirm metadata row + extracted text in R2.
9. Visit `/admin/settings`. Change suggestions-per-day cap; submit a 11th suggestion as the learner — rejected.

#### P4 Definition of Done

- [ ] All 9 verification clicks pass.
- [ ] B-bias detector blocks publish.
- [ ] PDF text extraction works for at least one real-world PDF (operator's choice).
- [ ] Rollback round-trip works (v1 → v2 → v1 → v2).
- [ ] All tests green; codex review passed.

#### P4 Section D extensions (SM1 / SM2 / SM3 / SM4 / SM5 — drafter-side scaffolds)

**Add these sub-bullets to the P4 AI prompt** above:

```
ADDITIONAL OBJECTIVES (Section D — read §3.8.3 before starting):

10. Drafter Intake form (SM1) at /admin/catalogs/[id]/import:
    - Render the 5 required fields from §3.8.3 DrafterIntake before the
      JSON paste / lesson editor: noviceError, onePrinciple, workedExample
      (worked + faded sub-fields), boundaryCase, nearestConfusable, plus
      the SM4 "What would a novice get wrong here?" textarea (≥ 30 chars).
    - On submit: write a drafter_intake row keyed to a freshly-created
      draft.id; only THEN unlock the lesson editor (this implements SM2).
    - Validators 25 + 30 (§3.8.6) run server-side; missing fields block.

11. Backward-design lock (SM2):
    - The lesson editor on /admin/catalogs/[id]/draft/[draftId] is
      disabled until drafter_intake is written AND a passing-test exists
      (the SME drafts the quiz first; the SME's own attempt at the quiz
      must score ≥ passPct).
    - State persisted in BackwardDesignState fields on the draft row
      (assessmentAuthoredAt, passingTestExists, lessonUnlockedAt).
    - UI shows the locked sequence as a 3-step stepper: Intake → Test → Lesson.

12. Worked-example pair editor (SM3) inside DrafterIntake:
    - The workedExample.worked and workedExample.faded textareas are
      side-by-side. Validator 27 enforces the faded variant has ≥ 1 hint
      removed (length-delta heuristic threshold tunable per pack; manual
      override flag visible to admin only).
    - Submit blocked if either field empty.

13. Closed-taxonomy principle picker (SM5):
    - For every quiz question, principle is selected from an autocomplete
      of approved B-skills loaded from packages/shared/src/principle-taxonomy.ts.
    - Free-typed principles unmapped to taxonomy → validator 28 blocks
      submit. Admin role can extend the taxonomy via /admin/settings (this
      writes to a tenant-scoped principle_taxonomy_extension table or a
      JSONB array on tenant_policy — implementer's pick).

14. Per-SME blind-spot dashboard scaffolding (SM8 — read-only in P4; the
    aggregator job lands in P11):
    - /admin/sme/[smeUserId] page (admin or self-only) reads from
      sme_blind_spot_signal and renders:
        - drafts authored in window
        - rejection-by-category table (placeholder zeros until P11/P9 land)
        - trend pill (improving|flat|regressing)
        - "personalised authoring prompts" panel — empty in Phase 1
    - The page must render even when no signal row exists (cold-start UX).

15. Tests:
    - Vitest: validator 25 rejects an intake with empty fields.
    - Vitest: validator 27 rejects a faded variant identical to worked.
    - Vitest: validator 28 rejects a free-typed principle outside taxonomy.
    - Vitest: validator 30 rejects noviceWouldGetWrong < 30 chars.
    - Playwright: SME cannot reach lesson editor until intake + test pass.

CONSTRAINTS for Section D extensions:
- SM7 (voice-first authoring) is OUT of scope for P4; tracked for P10.
- The principle taxonomy is shared library code (packages/shared); a tenant
  can extend it but cannot replace the closed list.
- The backward-design lock can be feature-flagged off via
  tenant_policy.rule_overrides — early B2C tenants may not need the gate.
```

#### P4 Section D — Definition of Done (additions)

- [ ] DrafterIntake form blocks submit until all 6 fields valid (SM1 + SM4).
- [ ] Lesson editor inaccessible until intake written and passing-test exists (SM2).
- [ ] Worked-example pair: faded variant validated against worked variant (SM3).
- [ ] Principle picker autocomplete from taxonomy; free-typed rejects (SM5).
- [ ] /admin/sme/[id] renders with cold-start UX (SM8 scaffolding).
- [ ] Validators 25, 27, 28, 30 all green; rls-isolated tests pass.

---

### P5 — Operator authoring loop (~2 days)

**Goal:** operator can run `/draft-topic <suggestion>` inside Claude Code, get validated JSON, paste into `/admin/catalogs/[id]/import`, publish in ~10 minutes. Also: seed the existing `cca-f-prep` content into Postgres + R2 as the first real catalog.

#### P5 Pre-tasks (operator)

- [ ] Confirm Claude Code is authenticated locally (`claude --version`).

#### P5 AI prompt

```
You are building Phase 1 P5 of the Content Pack Management Platform.
Read plans/IMPLEMENTATION.md §1, §3 (validators + types), §4-P5.

OBJECTIVES:

1. Build a Claude Code repo-local skill at .claude/skills/draft-topic/
   - SKILL.md with frontmatter: name=draft-topic, description, tools=Read,Write,Bash
   - Skill takes one argument: a topic title or learner suggestion text
   - It:
     a) Loads the curriculum schema (packages/shared/src/curriculum-types.ts)
     b) Loads the F1–F8 anti-patterns (from plans/IMPLEMENTATION.md §3.2)
     c) Loads the closed-list whitelists (packages/shared/src/disallowed.json
        and any per-pack whitelist file)
     d) Loads any knowledge files in scope (passes path globs as args, defaults
        to docs/knowledge/*.md; reads .pdf via unpdf; .docx via mammoth)
     e) Drafts a Concept JSON: { id, code, title, lesson, quiz } following
        §3.1 types exactly
     f) Writes to drafts/<slug>.json
     g) Runs `pnpm lint:draft drafts/<slug>.json` and reports the result
     h) If lint fails, iterates up to 3 times with the validator findings
        as feedback before stopping
     i) Reports to the operator: "drafts/<slug>.json validated; paste into
        /admin/catalogs/<id>/import"

2. Build the local lint script at scripts/lint-draft.ts:
   - Imports validators from packages/shared
   - Loads the JSON file, runs all validators 1–22, prints findings
   - Exit code 0 = pass, 1 = errors found
   - Wire as `pnpm lint:draft <path>`
   - Hook into pre-commit: any drafts/*.json in the commit must pass

3. Build the seed-from-existing-packs script at scripts/seed-from-existing-packs.ts:
   - Reads from a directory of existing content packs (point at the cca-f-prep
     repo's web/content-packs/cca-f-prep/curriculum.ts as the test case)
   - Transforms to the canonical Concept[] shape if needed
   - Inserts catalog + catalog_version rows for each pack
   - Uploads pack JSON to R2
   - Idempotent (re-runs do not create duplicates)
   - Wire as `pnpm seed:packs <path>`

4. Document the operator workflow in plans/OPERATOR_RUNBOOK.md:
   - "How to author a topic in 10 minutes"
   - Step-by-step with copy-paste commands and screenshots placeholders
   - Includes the Claude Code skill invocation form

5. Tests:
   - Vitest: lint-draft.ts on a known-good fixture exits 0
   - Vitest: lint-draft.ts on a known-bad fixture (B-bias) exits 1 with the
     expected finding
   - Manual: operator runs the full loop end-to-end (covered in P6)

6. Commit small, atomic. PR "P5: operator authoring loop + cca-f-prep seed".

CONSTRAINTS:
- The skill must not require any API keys (operator authors locally with Max 20x).
- The skill writes only to drafts/ and never directly to the DB.
- The seed script writes to the operator's tenant only (uses a CLI flag for
  tenant slug; no global writes).

DELIVERABLES:
- .claude/skills/draft-topic/ with SKILL.md and any helper scripts
- scripts/lint-draft.ts (CLI)
- scripts/seed-from-existing-packs.ts (CLI)
- plans/OPERATOR_RUNBOOK.md
- Tests green
```

#### P5 Operator verification

1. In a Claude Code session, run `/draft-topic "What is prompt caching"`. Drafts a JSON to `drafts/what-is-prompt-caching.json` and reports validators passed.
2. Open the JSON. Confirm shape matches §3.1 types. Confirm 3 questions, mixed letter distribution, principles set.
3. `pnpm lint:draft drafts/what-is-prompt-caching.json` — exit code 0.
4. In `/admin/catalogs/<id>/import`, paste the JSON. Validators pass. Publish.
5. Run `pnpm seed:packs <path-to-cca-f-prep>/web/content-packs/cca-f-prep`. Confirm catalog + version rows + R2 blobs created.
6. Visit the learner side. The CCA-F catalog appears with all sections.

#### P5 Definition of Done

- [ ] Operator goes from "topic suggestion" to "published concept" in ≤ 10 minutes (timed).
- [ ] CCA-F content seeded successfully (≥ 9 sections × ≥ 4 concepts each).
- [ ] `/draft-topic` skill iterates on validator failures up to 3 times automatically.
- [ ] All tests green; PR merged.

#### P5 Section D extensions (CTA-style drafting in the local Claude Code skill)

**Add these sub-bullets to the P5 AI prompt** above:

```
ADDITIONAL OBJECTIVES (Section D — read §3.8.3 + §3.8.6 first):

7. Update .claude/skills/draft-topic/ to emit a DrafterIntake JSON
   alongside the Concept JSON:
   - The skill output is now { intake: DrafterIntake, concept: Concept }.
   - Skill prompt instructs Claude to (a) draft the 5-probe intake first
     (novice-error → one-principle → worked + faded pair → boundary case
     → nearest confusable + SM4 noviceWouldGetWrong), THEN (b) draft the
     quiz from the intake's onePrinciple and boundaryCase, THEN (c) draft
     the lesson last (backward design — SM2).
   - Save: drafts/<slug>.intake.json + drafts/<slug>.concept.json.

8. Update scripts/lint-draft.ts to validate BOTH files:
   - Validators 1–22 against concept.json
   - Validators 25, 27, 28, 30 against intake.json
   - Exit 0 only if all pass.

9. The admin import endpoint (P4) accepts a tar/zip of intake + concept
   together OR two file uploads; backward-design lock pre-fills from intake.

10. Update plans/OPERATOR_RUNBOOK.md with the new authoring sequence:
    intake → quiz → lesson, ≤ 10 min target preserved.

CONSTRAINTS:
- Skill still uses no API keys; all drafting via the operator's Claude
  Max 20x via Claude Code locally.
- The skill's iteration loop (max 3) now considers BOTH intake and concept
  validator failures together — feedback merged before the next attempt.
- Backward-design ordering is enforced by the skill prompt structure;
  there is no separate enforcement layer in P5 (the server-side enforcement
  is in P4).
```

#### P5 Section D — Definition of Done (additions)

- [ ] /draft-topic emits both intake.json and concept.json.
- [ ] Local lint passes both files together; exits 1 if either fails.
- [ ] Authored sequence audit log shows intake → quiz → lesson order.
- [ ] OPERATOR_RUNBOOK.md updated with the new flow.

---

### P6 — Verification, hardening, accessibility (~2 days)

**Goal:** end-to-end happy paths verified, RLS isolation re-tested with adversarial inputs, Lighthouse and accessibility passes documented, ready to drive marketing-side traffic for the success-metric gate.

#### P6 Pre-tasks (operator)

- [ ] Two domains verified in Resend (one for marketing replies, one for app notifications).
- [ ] An LOI / NDA template ready (Word/PDF) for B2B outreach.

#### P6 AI prompt

```
You are running P6 verification of the Content Pack Management Platform Phase 1.
Read plans/IMPLEMENTATION.md §6 in full before starting.

OBJECTIVES:

1. Run the 12-step end-to-end test plan from §6.1 and document each step's
   result in plans/VERIFICATION_LOG.md (pass/fail + timestamp + notes).

2. Add an axe-core/playwright accessibility test that runs against:
   - / (learner home), /catalogs/[slug], /catalogs/[slug]/[code],
     /admin (dashboard), /admin/catalogs/[id]/import,
     www.<domain>/, www.<domain>/b2b, www.<domain>/b2c
   Must pass at WCAG 2.1 AA.

3. Add Lighthouse CI assertions:
   - Mobile performance ≥ 90 on every learner page
   - Marketing site mobile performance ≥ 95
   - First Contentful Paint ≤ 1.5s on 4G
   - CLS < 0.1

4. Add an adversarial RLS test:
   - Simulate a malicious request that sets app.tenant_id to tenant B's id
     while the Clerk-authenticated user is in tenant A. Assert the request
     fails (middleware enforces user's tenant context, not request body).

5. Add a load test (k6 script) at scripts/load-test.js:
   - 50 concurrent learners doing the happy path for 2 minutes
   - Assert p95 < 800ms, error rate < 1%

6. Add Sentry monitors and a status page (simple /api/health → JSON with
   DB ping, R2 ping, Clerk ping).

7. Open a tracking issue for any deferred items and label them
   `phase-2`. Specifically:
   - In-app generation
   - Critic stage
   - Stripe subscription billing
   - SME role
   - Embedding-based dedup
   - Quality signal aggregation cron

8. Commit small, atomic. PR "P6: verification, accessibility, hardening".

CONSTRAINTS:
- VERIFICATION_LOG.md must be updated as you go, not at the end (so a
  reviewer can see the timeline of checks).
- If any check fails, STOP and surface to the operator before proceeding —
  do not paper over a failure with retries.

DELIVERABLES:
- 12 of 12 verification steps green
- Accessibility test passing on all 8 surfaces
- Lighthouse CI green
- k6 load test green
- Adversarial RLS test green
- /api/health endpoint deployed
- Tracking issues opened for deferred items
```

#### P6 Operator verification

1. Read `plans/VERIFICATION_LOG.md` — every step pass.
2. Run `pnpm test:e2e` locally — green.
3. Visit `https://app.<domain>/api/health` — JSON with all three pings green.
4. Visit Lighthouse CI report — performance ≥ 90 on every learner page.
5. Open the GitHub issues list — `phase-2` label has the deferred items.
6. **Drive marketing-side traffic.** Operator now starts the success-metric gate:
   share `www.<domain>` with the target B2B prospect list and B2C cohort.

#### P6 Definition of Done

- [ ] 12-step end-to-end log: 12/12 pass.
- [ ] Accessibility test: 0 violations.
- [ ] Lighthouse CI: green.
- [ ] Load test: p95 < 800ms.
- [ ] Adversarial RLS test: green.
- [ ] Operator has begun outbound for the Phase 1 success metric.

---

## Part 5 — Phase 2 (Commercial) implementation

**Phase 2 starts only after the Phase 1 success metric is hit** (3 signed B2B LOIs OR 50 waitlist + 10 pre-orders). Six phases, ~6–8 weeks. Everything is additive on Phase 1; no schema breaks.

### P7 — Vercel Pro + Stripe billing + plan gating (~3 days)

**Goal:** the app is on Vercel Pro (commercial-use compliant), Stripe subscriptions are live, `tenant.plan` flips on webhook, paid-plan features are gated server-side.

#### P7 Pre-tasks (operator)

- [ ] Upgrade to Vercel Pro ($20/mo). Migrate the app project; the marketing site stays on Hobby.
- [ ] Activate Stripe live mode. Create products: `B2C Pro` ($9/mo), `B2B Standard / Pro / Enterprise` ($5/$10/$15 per learner per month with $100/mo platform minimum).
- [ ] Update Stripe webhook endpoint to live mode; rotate `STRIPE_WEBHOOK_SECRET`.

#### P7 AI prompt

```
You are building Phase 2 P7 of the Content Pack Management Platform.
Read plans/IMPLEMENTATION.md §1, §3.4 (subscription table coming), §5-P7.

OBJECTIVES:

1. Add a `subscription` table:
   - tenant_id, stripe_customer_id, stripe_subscription_id, plan, status,
     current_period_end, seats (B2B), cancel_at_period_end, updated_at
   - Drizzle migration; idempotent.

2. Implement /api/stripe-webhook (extend P2's): handle
   customer.subscription.{created,updated,deleted} + invoice.payment_succeeded.
   Update tenant.plan and subscription rows.

3. Implement /admin/billing:
   - Shows current plan, seats, next renewal, last invoice
   - "Upgrade" / "Manage" buttons → Stripe Customer Portal
   - For B2B: shows seats currently in use vs subscribed seats; alert if over

4. Implement plan gating middleware:
   - packages/shared/src/plan-gate.ts: maps features → required plan
   - Examples: `feature:custom-catalog → pro|enterprise`,
     `feature:sme-role → enterprise`, `feature:over-100-mau → not-free`
   - Server handlers wrap protected actions with assertPlan(tenant, feature)

5. Tests:
   - Vitest: webhook signature verification (good + tampered)
   - Vitest: subscription created → tenant.plan flips → gated feature
     becomes available
   - Vitest: subscription canceled → tenant.plan flips back at period end
   - Playwright e2e: upgrade flow (test mode) → /admin/billing reflects

6. Commit. PR "P7: Stripe billing + plan gating".

CONSTRAINTS:
- Webhook handler is idempotent (Stripe can deliver the same event twice).
- Plan downgrade does not delete data; it gates UI/actions.
- Free tier hard cap: 5 catalogs, 100 quiz attempts/month per learner.
```

#### P7 Definition of Done

- [ ] Subscription created in test mode → tenant.plan = "pro".
- [ ] Subscription canceled → tenant.plan reverts at period end.
- [ ] Free-plan tenant blocked from creating a 6th catalog.
- [ ] Stripe Customer Portal accessible from /admin/billing.

---

### P8 — Inngest pipeline + Sonnet drafter + budget enforcement (~5 days)

**Goal:** in-app generation pipeline live with Sonnet drafter; per-tenant monthly token budget enforced; UI burn meter.

#### P8 Pre-tasks (operator)

- [ ] Top up Anthropic API account with $200 (covers a month at planned scale).
- [ ] Create Inngest app; copy `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to `.env`.

#### P8 AI prompt

```
You are building Phase 2 P8.
Read plans/IMPLEMENTATION.md §3, §5-P8 in full.

OBJECTIVES:

1. Add Inngest to apps/web. Mount /api/inngest. Define functions:
   - draft.requested → calls Sonnet, writes draft row, emits draft.created
   - draft.created → runs validators, writes findings to draft.lintFindings
     (Phase 2 critic stage P9 takes over from here)

2. Implement Sonnet drafter at apps/web/src/server/anthropic-client.ts:
   - Uses @anthropic-ai/sdk
   - Model: claude-sonnet-4-6
   - System prompt loads: schema (§3.1), F1–F8 (§3.2), F-code anti-pattern
     rules from packages/shared/src/anti-patterns.ts, plus the tenant's
     calibration rules (calibration_rule rows where tenant_id matches)
   - Prompt caching enabled on system prompt (5-min default TTL; budget
     30–60% input savings at sustained traffic)
   - Tool use schema mirrors §3.1 Concept type for structured output

3. Build /admin/generate:
   - Form: topic, scope (lesson|quiz|both), knowledge file selector, model
     toggle (Sonnet default, Opus advanced)
   - On submit: emits draft.requested event; SSE-streams progress to UI
   - Renders the resulting draft in the same diff viewer as P4

4. Implement per-tenant token budget:
   - Track usage in a `token_usage` table: tenant_id, month (YYYY-MM-DD-01),
     input_tokens, output_tokens, usd_cost
   - Inngest function increments after each Sonnet call
   - Hard cap: tenant_policy.monthly_token_budget_usd; reject new generations
     above 100% with a friendly error
   - Soft cap: alert at 80% via Resend email + UI banner
   - /admin/dashboard shows a burn meter (current usage vs cap)

5. Implement per-user daily generation rate limit:
   - Redis-free: in-memory LRU is fine at Phase 2 v1 (single Vercel region)
   - Replace with @upstash/ratelimit when traffic warrants

6. Tests:
   - Vitest with mocked Anthropic SDK: drafter returns valid §3.1 Concept
   - Vitest: budget cap rejects beyond 100%
   - Vitest: rate limit rejects 11th generation in a day
   - Playwright e2e: /admin/generate happy path

7. Commit. PR "P8: Inngest pipeline + Sonnet drafter + budget".

CONSTRAINTS:
- Anthropic client must respect the tenant's calibration rules (load from
  calibration_rule table; cap at 8 most-recent + summarised anti-pattern
  rules per §10 of plans/content-pack-management-plan.md).
- Inngest functions must be idempotent (use the event ID as dedup key).
- Token usage tracking is the cost-control safety belt — write a test that
  asserts no Sonnet call can complete without the usage row being updated.
```

#### P8 Definition of Done

- [ ] Generating via /admin/generate produces a valid draft + lint findings.
- [ ] Budget cap blocks at 100%; banner shows at 80%.
- [ ] Rate limit blocks 11th attempt.
- [ ] Token usage table updates on every call.

#### P8 Section D extensions (Sonnet drafter emits CTA + worked/faded; Phase-1 → Phase-2 parity)

**Add these sub-bullets to the P8 AI prompt** above:

```
ADDITIONAL OBJECTIVES (Section D — read §3.8.3, §3.8.6, §3.8.10 first):

7. The Sonnet drafter's tool-use schema emits { intake, concept } — same
   shape as the P5 local skill. Single source of truth for the structure.
   The system prompt cites §3.8.3 DrafterIntake interface verbatim plus
   the SM4 novice-would-get-wrong probe.

8. Drafter loads tenant's calibration_rule rows + the closed B-skill
   taxonomy (§3.8.6 validator 28) at request time. The taxonomy is included
   in the cached prompt prefix to maximise prompt-caching hit rate.

9. Server-side validator pipeline after generate:
   - validators 1–22 on concept.json
   - validators 25, 27, 28, 30 on intake.json
   - on any failure, retry up to 2 times with findings prepended to the
     next prompt (Phase-2 calibration loop)
   - on persistent failure, queue for /admin/review

10. Token usage tracking (existing) extended with model_kind tag
    ("drafter"|"critic") so the burn meter can split Sonnet vs Opus spend.

11. Tests:
    - Vitest with mocked Anthropic SDK: drafter returns valid intake + concept.
    - Vitest: validator-fail retry path increments counter, eventually
      gives up and queues.
    - Vitest: token_usage row carries model_kind tag.

CONSTRAINTS:
- Prompt caching — the system prompt (schema + F1–F12 anti-patterns + closed
  taxonomy + calibration rules) MUST be the cacheable prefix. Operator
  variable bits (topic, scope, knowledge files) come last.
- The drafter NEVER omits intake fields in its tool-use output; if the model
  attempts an empty field, the tool-call validator at the SDK boundary
  rejects the call before incrementing token usage.
```

#### P8 Section D — Definition of Done (additions)

- [ ] Drafter output validates against intake + concept schema together.
- [ ] Caching prefix includes the closed B-skill taxonomy.
- [ ] Token usage tagged by model_kind in /admin/dashboard.
- [ ] Validator-fail retry path verified by integration test.

---

### P9 — Critic stage (Opus) + answer-justification audit + confidence routing (~4 days)

**Goal:** every drafted concept passes through an Opus critic that audits the drafter; confidence routing decides auto-publish vs human queue; answer-justification audit blocks publish if the critic can't cite the source span.

#### P9 AI prompt

```
You are building Phase 2 P9.
Read plans/IMPLEMENTATION.md §3.3 (especially validator 23), §5-P9.

OBJECTIVES:

1. Extend the Inngest pipeline:
   draft.requested → drafter → draft.drafted →
   critic → draft.reviewed → router → (publish | queue.review)

2. Build the Opus critic at apps/web/src/server/critic-prompts.ts:
   - Model: claude-opus-4-7
   - Reviewer prompt: schema, F1–F8, validator findings from §3.3, plus
     for quizzes: "for each MCQ, point at the exact span of the knowledge
     file that justifies the marked answer. If you cannot cite a span,
     mark answerJustified=false."
   - Outputs: { confidence: 0..1, findings: Finding[], suggested_edits, answerJustifications }

3. Implement validator 23 (answerJustificationAuditValidator):
   - For each MCQ, require answerJustifications[i].cited === true
   - If any false, returns an error finding with fCode=F4
   - This is a publish blocker

4. Implement confidence routing:
   - tenant_policy.approval_mode: always-human | confidence-routed | auto-publish
   - If confidence-routed and confidence ≥ tenant_policy.confidence_threshold
     and no validator errors, auto-publish.
   - Else, queue to /admin/review (human queue).
   - Sample 1 in 20 of auto-published drafts to /admin/review for calibration
     (does NOT block; calibration only).

5. Build /admin/review (human queue):
   - List of drafts with critic findings + suggested_edits + diff vs current
   - Three-button decision: Approve / Approve+Edit / Reject with reason
   - Reject reason inserts into calibration_rule (after deduping similar reasons)
   - Approve flips draft.status, writes catalog_version, R2 blob, revalidates

6. B2B default policy: on tenant creation for B2B kind, set approval_mode =
   always-human. B2C: confidence-routed with threshold 0.85.

7. Tests:
   - Vitest with mocked Opus: low confidence routes to human queue
   - Vitest: missing answerJustification blocks publish
   - Vitest: rejected draft creates calibration_rule row
   - Vitest: B2B tenant always-human regardless of confidence

8. Commit. PR "P9: Opus critic + justification audit + routing".

CONSTRAINTS:
- The critic prompt MUST be at least as strict as the drafter — never let
  the critic relax the rules.
- Calibration_rule rows are bounded: prune to ≤ 8 most-recent per tenant on
  insert; older ones are summarised into anti-pattern text in tenant_policy.
- Cross-vendor critic (OpenRouter → GPT) is NOT built here — it's the v2
  escape hatch documented in §C5 of plans/content-pack-management-plan.md.
```

#### P9 Definition of Done

- [ ] Auto-publish path works at confidence ≥ 0.85.
- [ ] Human queue receives low-confidence drafts.
- [ ] Justification audit blocks a fabricated quiz.
- [ ] Spot-check sampling lands ~5% of auto-published in queue.
- [ ] B2B tenant cannot auto-publish even at confidence 0.99.

#### P9 Section D extensions (CriticOutput shape, 4C/ID gate, F9–F12, blind-spot signal)

**Add these sub-bullets to the P9 AI prompt** above:

```
ADDITIONAL OBJECTIVES (Section D — read §3.8.1, §3.8.4, §3.8.6 first):

8. Opus critic emits a CriticOutput object per §3.8.4:
   - confidence: 0..1
   - findings: validator findings PLUS critic-only F9/F10/F11/F12 findings
   - missingComponents: which of {learning_tasks, supportive_info, jit_info,
     part_task_practice} the lesson lacks (4C/ID coverage gate — SM6)
   - blindSpotFlags: {expert_blind_spot, principle_unstated,
     no_worked_example, no_boundary_case, no_nearest_confusable}
   - fcodeRisks: any of F1..F12 the critic detects
   - suggestedProbes: text the SME should answer before re-submit
   - answerJustifications: per-question { questionN, cited, span? }

9. Refuse-to-publish gates wired in the router step (incremental on P9
   base behaviour):
   - Any answerJustifications.cited === false → block (validator 23 already)
   - missingComponents non-empty → block (validator 29 — 4C/ID coverage gate)
   - blindSpotFlags non-empty AND tenant_policy.two_eye_gate === true → block
     until SME re-submits with addressed probes

10. Critic prompt explicitly checks F9 (fluency illusion: lesson over-relies
    on re-reading rather than retrieval), F10 (massed practice: same
    sub-area repeated without interleaving — interacts with §3.8.7), F11
    (calibration drift: principles drift from canonical taxonomy across
    the section), F12 (positional cue: distractor lengths reveal the answer).
    All four feed CriticOutput.fcodeRisks.

11. After critic emits, increment sme_blind_spot_signal counters
    (§3.8.5) for the SME who authored the draft. Categories tracked:
    expert_blind_spot, principle_unstated, no_worked_example,
    no_boundary_case, missing_4cid_component, fcode_F9, fcode_F10,
    fcode_F11, fcode_F12.

12. Calibration loop: rejected-draft reasons + suggestedProbes are written
    to calibration_rule rows; cap kept at 8 most-recent + summarised
    anti-pattern rules per tenant.

13. Tests:
    - Vitest with mocked Opus: critic returns CriticOutput with all fields
      populated.
    - Vitest: missingComponents=['learning_tasks'] → publish blocked.
    - Vitest: blindSpotFlags=['expert_blind_spot'] under two_eye_gate → block.
    - Vitest: F9-flagged draft increments sme_blind_spot_signal.fcode_F9.
    - Vitest: 8-most-recent calibration_rule cap holds (9th insert prunes).

CONSTRAINTS:
- The critic prompt cites the F1–F12 taxonomy verbatim; do NOT paraphrase.
- 4C/ID gate is OFF by default in B2C tenants (it is strict; B2C content
  often legitimately omits part-task practice). Toggle via
  tenant_policy.rule_overrides.flags.fourCidGate.
- Cross-vendor critic remains a v2 escape hatch — not built here.
```

#### P9 Section D — Definition of Done (additions)

- [ ] CriticOutput emitted with all six structured fields populated.
- [ ] 4C/ID gate blocks publish when any component missing (B2B default on).
- [ ] F9–F12 detection paths exercised by fixture-based tests.
- [ ] sme_blind_spot_signal counters increment on critic findings.
- [ ] Calibration_rule cap (≤ 8 recent) enforced.

---

### P10 — B2B controls: SME role + two-eye gate + per-tenant catalogs + SAML (~5 days)

**Goal:** B2B tenants get the SME role for review-only access, an optional two-eye gate (admin + SME both approve), per-tenant private catalogs, and SAML/SCIM via Clerk Enterprise.

#### P10 AI prompt

```
You are building Phase 2 P10.
Read plans/IMPLEMENTATION.md §3.4 (tenant_policy fields), §5-P10.

OBJECTIVES:

1. Add `sme` to the tenant_member.role enum. Existing tenants are unaffected.

2. Build /admin/sme:
   - Role: sme. Cannot edit tenant settings, cannot publish without admin co-sign.
   - Sees the same /admin/review queue but with a "Co-sign" button (when
     two-eye gate is enabled).

3. Implement two-eye gate logic:
   - tenant_policy.two_eye_gate (boolean) gates publish on draft.status='approved'
     AND draft.coSignedAt IS NOT NULL
   - admin can approve; SME can approve OR co-sign; both required when gate is on

4. Per-tenant catalogs:
   - catalog.visibility ∈ {public, tenant-private, shared}
   - tenant-private: only that tenant's members see it
   - shared: cross-tenant pinned imports (deferred to v2 commercial — out of
     scope for P10)

5. SAML / SCIM via Clerk Enterprise:
   - Document the operator steps to enable per tenant
   - Add a /admin/sso page that surfaces the SAML metadata URL when enabled
   - SCIM provisions tenant_member rows on user create

6. Tests:
   - Vitest: SME cannot publish unilaterally
   - Vitest: two-eye gate requires both approvals
   - Vitest: tenant-private catalog not visible to other tenant's learners
   - Playwright e2e: SAML sign-in flow on a test SAML IdP (Mock SAML)

7. Commit. PR "P10: B2B SME role + two-eye gate + tenant-private catalogs".

CONSTRAINTS:
- All previous role checks must be re-audited for the new role (sme).
- SAML/SCIM paths must not affect non-SAML tenants.
```

#### P10 Definition of Done

- [ ] B2B tenant with two-eye gate ON cannot publish until admin + SME both approve.
- [ ] SME role cannot edit tenant_policy or other admin-gated settings.
- [ ] Tenant-private catalog isolation verified via RLS test.
- [ ] SAML test sign-in works.

---

### P11 — Embeddings dedup + post-publish quality signals + cron aggregation (~3 days)

**Goal:** suggestion dedup upgrades from TF-IDF to embeddings; question-level quality signals aggregate nightly and pause-not-pull bad questions for new sessions.

#### P11 AI prompt

```
You are building Phase 2 P11.
Read plans/IMPLEMENTATION.md §3.4 (event + question_signal tables), §5-P11.

OBJECTIVES:

1. Add `embedding` table:
   - id, tenant_id, kind ("suggestion"|"concept"|"knowledge"), source_id,
     vector vector(1024), model_name, created_at
   - pgvector extension on Neon (enable via SQL migration)

2. Replace TF-IDF dedup with Voyage embeddings:
   - On suggestion submit, compute embedding with voyage-3-lite, insert row,
     query for cosine similarity > 0.85 against existing suggestions
   - If hit, surface the matching suggestion in /admin/suggestions; the
     operator decides "Link to existing" or "Treat as separate"

3. Build the quality-signal aggregator:
   - Inngest cron: daily 03:00 UTC
   - For each (tenant, catalog_version, concept, question_n), aggregate
     attempts and correctAttempts from event table where kind='quiz_submit'
   - Update question_signal row
   - If attempts ≥ 30 and correct_pct < 30, set paused_at = NOW(), emit
     event 'quality_signal_pause' for operator alerting

4. Implement pause-not-pull:
   - Quiz runner skips questions with paused_at IS NOT NULL when starting
     a new attempt (in-flight attempts unaffected)
   - /admin/quality shows the list of paused questions for review

5. Tests:
   - Vitest: simulated 30 attempts at 20% correct → question paused
   - Vitest: new quiz session skips paused question; running quiz unaffected
   - Vitest with mocked Voyage: dedup links a near-duplicate suggestion

6. Commit. PR "P11: embeddings dedup + quality signals".

CONSTRAINTS:
- pgvector index: HNSW with cosine distance, m=16, ef_construction=64.
- Aggregator must be idempotent: running twice in one day is safe.
- Pause-not-pull means we never delete or change the question content; we
  hide it for new sessions only.
```

#### P11 Definition of Done

- [ ] Voyage embedding lookup works on suggestion submit.
- [ ] Daily aggregator pauses a bad question after 30 attempts.
- [ ] In-flight quizzes are not affected when a question pauses.
- [ ] /admin/quality shows the paused question.

---

### P12 — Cross-tenant catalog import (v2 commercial; only build at first request) (~3 days)

**Goal:** B2B admin can import a B2C public catalog into their tenant, version-pinned, with an "update available" prompt when the source publishes a new version. **Build only when a real B2B prospect requests it.**

#### P12 AI prompt (deferred — only run when triggered)

```
You are building Phase 2 P12.
Read plans/IMPLEMENTATION.md §3.4 (catalog_import) + §5-P12.

OBJECTIVES:

1. Activate the catalog_import table (already in schema; create migration).

2. Build /admin/catalogs/import-shared:
   - Lists public catalogs from other tenants
   - On import: writes catalog_import row pinning source_catalog_id +
     pinned_version_id
   - The B2B tenant's learners see the imported catalog as if it were native,
     but the underlying R2 blob is the source's pinned version

3. Implement update-available banner:
   - When the source catalog publishes a new catalog_version, all importers
     get a banner in /admin: "Update available: <catalog> v3 → v4. Review
     diff." Importer chooses "Upgrade now" (re-points pinned_version_id) or
     "Stay on v3".

4. Tests:
   - Vitest: importer's learners see source's pinned version
   - Vitest: source publishes v4; importer still on v3 until they upgrade
   - Vitest: upgrade flips pinned_version_id, learners see v4

5. Commit. PR "P12: cross-tenant catalog import".

CONSTRAINTS:
- Source tenant retains full ownership; importer cannot modify content.
- Billing implications: token spend on generation in v4 belongs to source
  tenant, not importer (importers consume; sources produce).
```

#### P12 Definition of Done

- [ ] B2B importer sees the C2B public catalog in /admin/catalogs/import-shared.
- [ ] Pinned version doesn't drift when source publishes.
- [ ] Update-available banner appears; upgrade flow works.

---

## Part 6 — Acceptance & verification

### 6.1 — Phase 1 end-to-end test plan (12 steps; must all pass before declaring P6 done)

1. **Sign up two test accounts** — one B2C learner, one operator. Verify both land on `/` and roles are correct in Drizzle Studio.
2. **Operator creates a catalog "test"** via `/admin/catalogs` and imports one concept from a sample JSON. Validators pass; publish succeeds.
3. **Learner browses the catalog**, opens the concept, takes the quiz. `progress.status` advances `viewed → quizzed → complete`.
4. **Learner submits a suggestion**; operator sees it in `/admin/suggestions` queue.
5. **Operator runs `/draft-topic <suggestion>`** in Claude Code; gets validated JSON; pastes into `/admin/catalogs/[id]/import`; publishes.
6. **Learner refreshes**, sees the new concept; receives in-app notification "your suggestion is live."
7. **Lint mode** flags any latent bias in seeded content (run against `cca-f-prep`'s known B-bias quizzes; expect findings).
8. **Rollback**: import a v2 of a concept, then rollback to v1; learner sees v1 on next request.
9. **Multi-tenant isolation**: operator B (separate Clerk org) cannot see operator A's drafts. RLS test green.
10. **Lighthouse mobile** on `/catalogs/test` ≥ 90.
11. **Marketing-side metric loop**: submit B2B LOI form on `www.<domain>` → row appears in `/admin/leads` within 2s.
12. **Pre-order loop**: click Stripe Payment Link → complete test charge → webhook fires → `lead.kind = 'b2c_preorder'` row written with `stripe_payment_intent_id`.

### 6.2 — Phase 2 verification additions

13. Generate a quiz via `/admin/generate`; SSE streams; validators run; critic returns confidence; auto-publish at confidence ≥ 0.85.
14. Force a low-confidence draft; ends up in human queue; reviewer approves with edits; goes live.
15. Per-user rate limit: 11th generation in a day rejected.
16. Per-tenant budget cap: 80% threshold shows banner; 100% blocks generation.
17. B2B human-required: new draft cannot be auto-published even at confidence 0.99.
18. Two-eye gate: admin approval + SME approval both required.
19. Calibration: rejected draft's reason appears in next generation's prompt within ~1 min.
20. Quality signal: simulate 30 attempts on a question with 20% correct rate → question paused for new sessions.
21. Stripe upgrade → `tenant.plan` flips → quota lifted.
22. Cross-tenant import (P12 only): pinned version doesn't drift when source publishes a new version.

### 6.3 — Continuous quality bars

| Bar | Tool | Gate |
|---|---|---|
| TypeScript strict, zero `any` (without justification comment) | tsc + ESLint | CI required |
| Unit + integration tests | Vitest | ≥ 80% line coverage on `packages/shared` and `packages/db` |
| End-to-end happy paths | Playwright | All steps green |
| Accessibility | axe-core/playwright | 0 violations on listed surfaces |
| Lighthouse | lhci CI action | Mobile perf ≥ 90 (learner), ≥ 95 (marketing) |
| Bundle budget | next-bundle-analyzer | ≤ 220 kB gzipped on learner home |
| RLS isolation | Custom integration test | Adversarial scenario passes |
| Codex review | `.github/workflows/codex-review.yml` | `codex-blockers` label = no merge |

### 6.4 — Phase 1 success-metric gate (the business-side acceptance test)

Phase 2 work does not start until **all** of these are true:

- [ ] **B2B**: 3 signed Letters of Intent in hand. (Operator owns this.)
- [ ] **B2C**: 50 waitlist signups + 10 paid Stripe pre-orders.
- [ ] **Engagement floor** (sanity check): ≥ 50% of waitlist who tried the platform completed at least one full lesson + quiz.
- [ ] **Operator availability**: at least 12 weeks of focused build time available for P7–P11.

If the engagement floor fails, do **not** spend on Phase 2 — the issue is product, not capacity. Iterate Phase 1 instead.

---

## Part 7 — Operating playbooks (post-launch)

### 7.1 — Daily authoring loop (Phase 1)

**Time budget: ~30 min/day.**

1. Open Claude Code in the repo.
2. Visit `/admin/suggestions`. Pick the top-voted open suggestion. Click "Accept" (copies a draft prompt to clipboard).
3. Paste into Claude Code: `/draft-topic <pasted-text>`.
4. Wait ~3 minutes for the skill to draft + auto-validate.
5. If lint passes, paste the JSON into `/admin/catalogs/[id]/import`. Review the diff. Publish.
6. If lint fails after 3 auto-iterations, manually fix the JSON or refine the prompt.
7. Move the suggestion to "Accepted" status; learner gets a notification.

### 7.2 — Weekly business loop

**Time budget: ~2 hours/week.**

1. Run the lead funnel report: marketing visits → form submits → LOIs → pre-orders.
2. Reach out to any B2B leads from the past week (target ≤ 24h response time).
3. Update the Phase 1 success-metric scoreboard (a one-page doc the operator maintains).
4. Run `/admin/quality` (Phase 2): any newly paused questions? Investigate root cause.
5. Run `/admin/billing` (Phase 2): tenants near their token budget? Send proactive notice.

### 7.3 — Quality incident response

**Triggers:**
- A learner reports a concept (`report_content` event).
- A question is auto-paused by the quality aggregator.
- A B2B SME flags an approved concept after publish.

**Steps:**

1. **Triage within 24h.** Open the concept in `/admin/catalogs/[id]/lint`. Re-run validators. Check the post-publish event stream.
2. **If the issue is content**: rollback to the previous catalog_version, regenerate the concept (Phase 2) or hand-edit (Phase 1), publish, test.
3. **If the issue is systemic** (e.g. validator missed a class of failure): add a new validator to `packages/shared`, run it across all published versions, identify other affected concepts, batch-fix.
4. **If the issue is critic-related** (Phase 2): consider activating the cross-vendor critic for the next 2 weeks while you tune the same-family critic.
5. **Always**: write a post-mortem in `plans/incidents/YYYY-MM-DD-<short-slug>.md` with timeline, root cause, fix, prevention. The discipline matters more than the doc.

### 7.4 — Cost monitoring (Phase 2)

**Daily**: glance at /admin/dashboard → token-burn meter. Any tenant > 50% of monthly cap before mid-month? Open a conversation.

**Weekly**: download Anthropic + Stripe + Vercel usage reports. Compare against the tenant_policy.monthly_token_budget_usd column. Recompute unit economics.

**Monthly**: write a one-page cost-vs-revenue summary. Adjust pricing or budgets if margin drops below 80%.

### 7.5 — Operator-side regression discipline

Every time an issue causes a content-quality miss:

1. Reproduce the failure as a fixture under `packages/shared/__fixtures__/regressions/`.
2. Add a validator (or extend an existing one) that catches it.
3. Run the validator across all published versions of all catalogs.
4. The fixture becomes part of CI; the failure cannot recur silently.

This is the **"strict validation loop"** principle from the cca-f-prep `CLAUDE.md`. Honour it without exception.

### 7.6 — Migration off vendors (escape hatches)

| If we need to leave… | Path | ETA |
|---|---|---|
| Clerk | Auth.js + WorkOS (for SAML/SCIM); user table is portable | ~5 days |
| Inngest | Vercel Cron + DB-backed queue (`inngest_state` → custom queue table) | ~3 days |
| Anthropic | OpenAI / Google via a thin shim layer at `apps/web/src/server/llm-client.ts`; same JSON tool-use shape | ~7 days |
| Vercel | AWS Amplify / SST + RDS + S3 (Postgres + R2 already standard APIs) | ~10 days |
| Cloudflare R2 | AWS S3 (drop-in API) | ~2 days |

None of these are pre-built. Document them; build only when forced.

---

## Part 8 — Appendices

### 8.1 — Full environment-variable reference

See §2.5. Every variable on every host must be set; missing values cause a startup failure (`zod`-validated `env.ts` at app boot).

```typescript
// apps/web/src/env.ts
import { z } from "zod";

const envSchema = z.object({
  // DB
  DATABASE_URL: z.string().url(),
  DATABASE_URL_HTTP: z.string().url(),
  // R2
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET: z.string(),
  R2_PUBLIC_URL: z.string().url(),
  // Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  // Email
  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string().email(),
  // Analytics & errors
  NEXT_PUBLIC_POSTHOG_KEY: z.string(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
  SENTRY_DSN: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  // Payments
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PREORDER_PAYMENT_LINK: z.string().url(),
  // Phase 2
  ANTHROPIC_API_KEY: z.string().optional(),
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),
  VOYAGE_API_KEY: z.string().optional(),
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_MARKETING_URL: z.string().url(),
  TENANT_DEFAULT_PLAN: z.enum(["free", "pro", "enterprise"]).default("free"),
});

export const env = envSchema.parse(process.env);
```

### 8.2 — API surface (canonical list)

| Method | Path | Purpose | Auth | Phase |
|---|---|---|---|---|
| POST | `/api/leads` | Marketing lead capture | none (CORS-locked) | P2 |
| POST | `/api/stripe-webhook` | Stripe events | signature | P2 |
| GET | `/api/health` | Liveness probe | none | P6 |
| POST | `/api/progress` | Update learner progress | Clerk + tenant | P3 |
| GET | `/api/search` | Cross-catalog search | Clerk + tenant | P3 |
| POST | `/api/suggestions` | Submit a suggestion | Clerk + tenant | P3 |
| POST | `/api/catalogs/[id]/import` | Operator publish | admin | P4 |
| POST | `/api/knowledge/upload` | Knowledge file upload | admin | P4 |
| POST | `/api/inngest` | Inngest function entry | signature | P8 |
| POST | `/api/generate` | Trigger AI generation | admin + plan | P8 |
| POST | `/api/billing/portal` | Stripe Customer Portal | admin | P7 |

### 8.3 — Common errors & fixes

| Error | Fix |
|---|---|
| `permission denied for table catalog` | RLS is enabled but `app.tenant_id` not set. Wrap the call in `withTenant(...)`. |
| `connection terminated due to connection timeout` (Neon) | Using the pooler driver instead of HTTP for RLS-bearing queries. Switch to `DATABASE_URL_HTTP`. |
| Vercel deploy fails: "Hobby plan does not allow commercial use" | Upgrade the app project to Pro. Marketing site can stay on Hobby. |
| Clerk session loops on `/sign-in` | `middleware.ts` matcher includes `/sign-in`. Exclude it. |
| Stripe webhook returns 400 in CI | Test events are being sent without a signature. Use `stripe.webhooks.constructEvent` in dev mode with a test secret. |
| `validators[6].letterDistribution returned no findings` on B-biased quiz | The validator's threshold is set too lax. Default: flag if ≥ 75% of correct answers in a quiz are the same letter. |
| PostHog events not recording | EU vs US host mismatch. Confirm `NEXT_PUBLIC_POSTHOG_HOST` matches the project's region. |
| Sentry double-recording errors | Both server-side and client-side SDKs initialised on a server component. Use server SDK only on server. |

### 8.4 — Migration matrix (Phase 1 → Phase 2 layer-by-layer)

| Layer | Phase 1 state | Phase 2 change |
|---|---|---|
| Routes | `apps/web` with `(public) / (learner) / (admin)` route groups | Same; add `(admin)/sme`, `(admin)/generate`, `(admin)/review`, `(admin)/billing`, `(admin)/quality`, `(admin)/sso` |
| DB | Neon free | Neon Scale; add `subscription`, `embedding`, `calibration_rule`, `catalog_import`, `token_usage`. No schema breaks. |
| R2 | one bucket, `packs/` + `tenants/<id>/knowledge/` | Add `tenants/<id>/private/` for B2B-private catalogs; presigned URLs |
| Auth | Clerk free | Clerk Pro; Organizations everywhere; SAML/SCIM on Enterprise |
| AI | none on server | Anthropic API (Sonnet drafter + Opus critic) + Inngest |
| Validators | shared lib runs in lint + import | Same lib runs additionally in critic + post-publish quality aggregator |
| Billing | none | Stripe; `tenant.plan` gated by webhook |
| Observability | basic | Token usage burn meter; per-tenant cost dashboard |

### 8.5 — Files this implementation guide expects to be created

POC (Phase 1):

- `pnpm-workspace.yaml`
- `apps/web/`, `apps/marketing/`
- `packages/shared/`, `packages/db/`, `packages/shared-ui/`, `packages/design-tokens/`
- `apps/web/src/app/{(public),(learner),(admin)}/...`
- `apps/web/src/middleware.ts`, `apps/web/src/server/{r2-client,with-tenant}.ts`
- `apps/web/src/app/api/{leads,stripe-webhook,progress,search,suggestions,health,catalogs/[id]/import,knowledge/upload}/route.ts`
- `apps/marketing/src/pages/{index,b2b,b2c,pricing-preview,about,blog/index}.astro`
- `scripts/{seed-from-existing-packs,lint-draft,load-test}.ts`
- `.claude/skills/draft-topic/SKILL.md`
- `plans/IMPLEMENTATION.md` (this document — operator copies it in Part 2)
- `plans/OPERATOR_RUNBOOK.md`
- `plans/VERIFICATION_LOG.md`

Commercial (Phase 2):

- `apps/web/src/inngest/{generate,validate,critique,publish,quality-aggregator}.ts`
- `apps/web/src/server/{anthropic-client,critic-prompts,billing-stripe,llm-client-shim}.ts`
- `apps/web/src/app/api/{generate,billing/portal,inngest}/route.ts`
- `apps/web/src/app/(admin)/{generate,review,sme,billing,quality,sso}/...`

### 8.6 — Glossary (terms used throughout)

- **Catalog** — a course or topic-stream. Has a slug, a current version, and many concepts.
- **Catalog version** — an immutable snapshot of a catalog's content. New versions are minted on publish; learners always read the catalog's `current_version_id`.
- **Concept** — one unit of learning: a lesson + a 3-question quiz.
- **F-code** — one of F1–F8, the cognitive failure-mode taxonomy used to tag validator findings.
- **HITL** — Human-in-the-loop. The publish gate is always a human in this product.
- **Pause-not-pull** — when a question performs poorly, hide it for new sessions; never pull it from in-flight quizzes.
- **RLS** — Row-Level Security in Postgres; enforced via `current_setting('app.tenant_id')`.
- **Tenant** — a B2C personal account or a B2B organization. Every row is tenant-scoped.
- **Validator** — a deterministic code-only check that runs over a draft Concept JSON. 22 of them in Phase 1, 23 in Phase 2.

### 8.7 — Where the strategy doc lives

The "why" of this plan (market, pricing, two-phase rationale, decision triggers, founder fit) lives at `plans/content-pack-management-plan.md` plus four audience-specific decks (`deck-overview.md`, `deck-investor.md`, `deck-b2b-prospect.md`, `deck-collaborator.md`). This document is the "how"; that document is the "why". Keep them in sync — when a decision changes, update both.
