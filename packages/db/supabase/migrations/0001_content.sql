-- Content schema: packs, domains, MCQs, challenges, solutions, mock exams.
-- Source-of-truth is Markdown in the repo; rows are produced by the importer.

create extension if not exists "pgcrypto";

create type content_status as enum ('draft', 'published', 'disputed', 'retired');
create type difficulty as enum ('easy', 'medium', 'hard');

create table content_pack (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  locale        text not null default 'en',
  passing_score int,
  version       int not null default 1,
  status        content_status not null default 'draft',
  source_ref    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table domain (
  id           uuid primary key default gen_random_uuid(),
  pack_id      uuid not null references content_pack(id) on delete cascade,
  slug         text not null,
  title        text not null,
  weight_pct   int,
  position     int not null default 0,
  notes_md     text,
  unique (pack_id, slug)
);

create table mcq (
  id                     uuid primary key default gen_random_uuid(),
  domain_id              uuid not null references domain(id) on delete cascade,
  external_ref           text,
  stem_md                text not null,
  options                jsonb not null,
  correct_idx            int not null check (correct_idx between 0 and 3),
  principle              text,
  distractor_rationales  jsonb,
  difficulty             difficulty not null default 'medium',
  source_ref             text,
  generation_meta        jsonb,
  reviewer_id            uuid,
  status                 content_status not null default 'draft',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  check (jsonb_array_length(options) = 4),
  unique (domain_id, external_ref)
);

create index mcq_domain_idx on mcq (domain_id);
create index mcq_status_idx on mcq (status);

create table challenge (
  id          uuid primary key default gen_random_uuid(),
  domain_id   uuid not null references domain(id) on delete cascade,
  slug        text not null,
  title       text not null,
  prompt_md   text not null,
  difficulty  difficulty not null default 'medium',
  tags        text[] not null default '{}',
  status      content_status not null default 'draft',
  unique (domain_id, slug)
);

create table solution (
  id            uuid primary key default gen_random_uuid(),
  challenge_id  uuid not null references challenge(id) on delete cascade unique,
  body_md       text not null,
  principle     text,
  reviewer_id   uuid
);

create table mock_exam (
  id              uuid primary key default gen_random_uuid(),
  pack_id         uuid not null references content_pack(id) on delete cascade,
  slug            text not null,
  title           text not null,
  duration_min    int,
  question_count  int not null,
  status          content_status not null default 'draft',
  unique (pack_id, slug)
);

create table mock_exam_question (
  mock_exam_id  uuid not null references mock_exam(id) on delete cascade,
  position      int not null,
  mcq_id        uuid not null references mcq(id) on delete restrict,
  primary key (mock_exam_id, position),
  unique (mock_exam_id, mcq_id)
);

create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger content_pack_touch before update on content_pack
  for each row execute function touch_updated_at();
create trigger mcq_touch before update on mcq
  for each row execute function touch_updated_at();
