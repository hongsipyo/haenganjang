-- ============================================================
-- 다정 (Dajeong) — Supabase Database Schema
-- 16부작 드라마/소설 비공개 작업 공간
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type fragment_type as enum ('text', 'voice', 'image');
create type world_item_type as enum ('image', 'music', 'text');

-- ============================================================
-- CHARACTERS (인물)
-- ============================================================
create table characters (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,                    -- 한 줄 설명
  image_url text,                      -- AI 생성 이미지 등
  details jsonb default '{}',          -- 배경, 관계, 외모, 말투, 습관, 사주/원소/동물 등 자유 구조
  notes text,                          -- 자유 메모
  element text,                        -- 오행 (水/火/木/金/土)
  animal text,                         -- 동물 대응
  order_index int default 0,           -- 정렬 순서
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- EPISODES (회차 — 16부작)
-- ============================================================
create table episodes (
  id uuid primary key default uuid_generate_v4(),
  number int not null check (number between 1 and 16),
  title text,                          -- 회차 제목 (ex: "다정이는 투명인간이다")
  synopsis text,                       -- 시놉시스
  scenes jsonb default '[]',           -- 장면 카드들 [{title, content, order}]
  dialogues jsonb default '[]',        -- 대사 파편들 [{speaker, line, context}]
  progress int default 0 check (progress between 0 and 100),
  focus_character_id uuid references characters(id) on delete set null,  -- 이 부의 중심 인물
  notes text,                          -- 자유 메모
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, number)
);

-- ============================================================
-- FRAGMENTS (파편 — 가장 활발한 공간)
-- ============================================================
create table fragments (
  id uuid primary key default uuid_generate_v4(),
  type fragment_type not null default 'text',
  content text,                        -- 텍스트 내용
  audio_url text,                      -- 음성 녹음 URL (Supabase Storage)
  image_url text,                      -- 이미지 URL
  tags text[] default '{}',            -- 태그 배열 (선택, 강제 X)
  episode_id uuid references episodes(id) on delete set null,
  character_id uuid references characters(id) on delete set null,
  section text,                        -- 어디서 왔는지 (fragments, world, scratch 등)
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Full-text search index
create index fragments_content_search on fragments using gin(to_tsvector('simple', coalesce(content, '')));
create index fragments_tags on fragments using gin(tags);
create index fragments_created_at on fragments (created_at desc);

-- ============================================================
-- REFS (레퍼런스)
-- ============================================================
create table refs (
  id uuid primary key default uuid_generate_v4(),
  type text,                           -- 영화, 책, 음악, 사진 등
  url text,
  title text not null,
  note text,                           -- 한 줄 메모 + 다정과의 관계
  tags text[] default '{}',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ============================================================
-- WORLD ITEMS (세계관 — 무드보드/음악/메모)
-- ============================================================
create table world_items (
  id uuid primary key default uuid_generate_v4(),
  type world_item_type not null,
  content text,                        -- 텍스트 내용 또는 설명
  url text,                            -- 이미지 URL, Spotify embed URL 등
  note text,
  category text,                       -- 무드보드, 음악, 시대배경, 톤 등
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ============================================================
-- SCRATCH (분류 안 된 메모)
-- ============================================================
create table scratch (
  id uuid primary key default uuid_generate_v4(),
  content text not null,
  moved_to text,                       -- 이동된 섹션 (null이면 아직 안 옮김)
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (본인만 사용하는 사이트)
-- ============================================================
alter table characters enable row level security;
alter table episodes enable row level security;
alter table fragments enable row level security;
alter table refs enable row level security;
alter table world_items enable row level security;
alter table scratch enable row level security;

-- 모든 테이블에 동일한 정책: 본인 데이터만 CRUD
create policy "Users can manage own characters" on characters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own episodes" on episodes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own fragments" on fragments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own refs" on refs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own world_items" on world_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own scratch" on scratch
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS (음성/이미지 파일)
-- ============================================================
insert into storage.buckets (id, name, public) values ('voice', 'voice', false);
insert into storage.buckets (id, name, public) values ('images', 'images', false);

-- Storage policies
create policy "Users can upload voice" on storage.objects
  for insert with check (bucket_id = 'voice' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own voice" on storage.objects
  for select using (bucket_id = 'voice' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can upload images" on storage.objects
  for insert with check (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own images" on storage.objects
  for select using (bucket_id = 'images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- UPDATED_AT TRIGGER (자동 갱신)
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger characters_updated_at before update on characters
  for each row execute function update_updated_at();

create trigger episodes_updated_at before update on episodes
  for each row execute function update_updated_at();

create trigger fragments_updated_at before update on fragments
  for each row execute function update_updated_at();

create trigger scratch_updated_at before update on scratch
  for each row execute function update_updated_at();

-- ============================================================
-- SEED: 16 episodes (빈 회차 자리 잡기)
-- 실행 시 auth.uid()를 본인 user_id로 교체하세요
-- ============================================================
-- INSERT INTO episodes (number, title, user_id) VALUES
--   (1,  '1부',  'YOUR_USER_ID'),
--   (2,  '2부',  'YOUR_USER_ID'),
--   (3,  '3부',  'YOUR_USER_ID'),
--   (4,  '4부',  'YOUR_USER_ID'),
--   (5,  '5부',  'YOUR_USER_ID'),
--   (6,  '6부',  'YOUR_USER_ID'),
--   (7,  '7부',  'YOUR_USER_ID'),
--   (8,  '8부',  'YOUR_USER_ID'),
--   (9,  '9부',  'YOUR_USER_ID'),
--   (10, '10부', 'YOUR_USER_ID'),
--   (11, '11부', 'YOUR_USER_ID'),
--   (12, '12부', 'YOUR_USER_ID'),
--   (13, '13부', 'YOUR_USER_ID'),
--   (14, '14부', 'YOUR_USER_ID'),
--   (15, '15부', 'YOUR_USER_ID'),
--   (16, '16부', 'YOUR_USER_ID');
