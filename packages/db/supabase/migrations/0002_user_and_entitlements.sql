-- User-facing tables. `entitlements` and `profile.stripe_customer_id` are
-- present from day one but DORMANT during the free-launch phase: every user
-- defaults to an unrestricted plan and the gating middleware no-ops. When
-- pricing flips on (Phase 1.5), the default flips to 'free' and Stripe webhook
-- writes update entitlements. No schema migration is required at that point.

create type plan_tier as enum ('free', 'pro', 'team', 'enterprise');

create table profile (
  id                  uuid primary key references auth.users(id) on delete cascade,
  display_name        text,
  stripe_customer_id  text unique,
  created_at          timestamptz not null default now()
);

create table entitlements (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  -- Default 'pro' during free-launch phase: every user gets full access. When
  -- pricing flips on, change this default to 'free' and let Stripe webhooks
  -- promote paying users.
  plan                   plan_tier not null default 'pro',
  unlimited_explainer    boolean not null default true,
  cohort_dashboard       boolean not null default true,
  custom_packs           boolean not null default false,
  sso                    boolean not null default false,
  export_enabled         boolean not null default true,
  -- Per-day caps. NULL = unlimited. During free-launch phase NULLs are set so
  -- everyone is unlimited; flip to integer caps on free plan when pricing
  -- launches.
  mcq_per_day_cap        int,
  explainer_per_day_cap  int,
  current_period_end     timestamptz,
  updated_at             timestamptz not null default now()
);

create index entitlements_plan_idx on entitlements (plan);

create table exam_attempt (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  mock_exam_id  uuid references mock_exam(id) on delete set null,
  pack_id       uuid not null references content_pack(id) on delete cascade,
  pack_version  int not null,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  score_pct     numeric(5,2),
  scaled_score  int
);

create index exam_attempt_user_idx on exam_attempt (user_id);

create table response (
  id              uuid primary key default gen_random_uuid(),
  attempt_id      uuid not null references exam_attempt(id) on delete cascade,
  mcq_id          uuid not null references mcq(id) on delete cascade,
  selected_idx    int not null check (selected_idx between 0 and 3),
  is_correct      boolean not null,
  confidence      int check (confidence between 1 and 5),
  responded_at    timestamptz not null default now(),
  unique (attempt_id, mcq_id)
);

create index response_mcq_idx on response (mcq_id);

create type flag_reason as enum ('ambiguous', 'two_correct', 'outdated', 'typo', 'other');

create table flag (
  id          uuid primary key default gen_random_uuid(),
  mcq_id      uuid not null references mcq(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  reason      flag_reason not null,
  note        text,
  created_at  timestamptz not null default now(),
  unique (mcq_id, user_id, reason)
);

create index flag_mcq_idx on flag (mcq_id);

-- Auto-provision profile + entitlements row when a new auth user is created.
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profile (id) values (new.id) on conflict do nothing;
  insert into public.entitlements (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
