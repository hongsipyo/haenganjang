-- ============================================================
-- ACTIVITY LOG (모든 활동 기록)
-- ============================================================
create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  action text not null,          -- 'fragment_created', 'brainstorm_answered', 'scratch_created', 'episode_edited', 'character_edited', 'world_item_created', 'ref_created'
  detail text,                   -- 내용 요약 (50자)
  section text,                  -- fragments, brainstorm, scratch, episodes, people, world, refs
  related_id uuid,               -- 관련 레코드 ID
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create index activity_log_user_date on activity_log (user_id, created_at desc);
create index activity_log_section on activity_log (section);

alter table activity_log enable row level security;

create policy "Users can manage own activity_log" on activity_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
