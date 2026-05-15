-- ============================================================
-- BRAINSTORM HISTORY (브레인스토밍 질문/답변 기록)
-- ============================================================
create table brainstorm_history (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  category text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table brainstorm_history enable row level security;

create policy "Users can manage own brainstorm_history" on brainstorm_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
