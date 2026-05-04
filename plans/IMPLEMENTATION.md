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

---

