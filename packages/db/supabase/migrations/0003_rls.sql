-- Row-level security. Content tables are world-readable when published;
-- user-owned tables are private to the owner.

alter table content_pack       enable row level security;
alter table domain             enable row level security;
alter table mcq                enable row level security;
alter table challenge          enable row level security;
alter table solution           enable row level security;
alter table mock_exam          enable row level security;
alter table mock_exam_question enable row level security;
alter table profile            enable row level security;
alter table entitlements       enable row level security;
alter table exam_attempt       enable row level security;
alter table response           enable row level security;
alter table flag               enable row level security;

create policy "published packs are public"
  on content_pack for select
  using (status = 'published');

create policy "domains follow pack visibility"
  on domain for select
  using (exists (
    select 1 from content_pack p
    where p.id = domain.pack_id and p.status = 'published'
  ));

create policy "published mcqs are public"
  on mcq for select using (status = 'published');

create policy "published challenges are public"
  on challenge for select using (status = 'published');

create policy "solutions follow challenge visibility"
  on solution for select
  using (exists (
    select 1 from challenge c
    where c.id = solution.challenge_id and c.status = 'published'
  ));

create policy "published mock exams are public"
  on mock_exam for select using (status = 'published');

create policy "mock exam questions follow exam visibility"
  on mock_exam_question for select
  using (exists (
    select 1 from mock_exam e
    where e.id = mock_exam_question.mock_exam_id and e.status = 'published'
  ));

create policy "users read own profile"
  on profile for select using (auth.uid() = id);
create policy "users update own profile"
  on profile for update using (auth.uid() = id);

create policy "users read own entitlements"
  on entitlements for select using (auth.uid() = user_id);

create policy "users manage own attempts"
  on exam_attempt for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users manage own responses"
  on response for all
  using (exists (
    select 1 from exam_attempt a
    where a.id = response.attempt_id and a.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from exam_attempt a
    where a.id = response.attempt_id and a.user_id = auth.uid()
  ));

create policy "users insert own flags"
  on flag for insert with check (auth.uid() = user_id);
create policy "users read own flags"
  on flag for select using (auth.uid() = user_id);
