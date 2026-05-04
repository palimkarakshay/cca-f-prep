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

