-- 비공개 사이트이므로 RLS 비활성화
alter table characters disable row level security;
alter table episodes disable row level security;
alter table fragments disable row level security;
alter table refs disable row level security;
alter table world_items disable row level security;
alter table scratch disable row level security;
alter table brainstorm_history disable row level security;
alter table activity_log disable row level security;
