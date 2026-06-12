-- ============================================================
-- RLS 재활성화 — 모든 테이블
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 기본 테이블 (schema.sql에 정책 이미 존재)
alter table characters enable row level security;
alter table episodes enable row level security;
alter table fragments enable row level security;
alter table refs enable row level security;
alter table world_items enable row level security;
alter table scratch enable row level security;

-- 추가 테이블 (activity.sql, brainstorm.sql에 정책 이미 존재)
alter table brainstorm_history enable row level security;
alter table activity_log enable row level security;

-- written_scenes (정책 새로 추가)
alter table written_scenes enable row level security;

create policy if not exists "Users can manage own written_scenes" on written_scenes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
