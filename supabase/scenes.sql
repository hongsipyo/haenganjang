create table if not exists written_scenes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  characters text[] default '{}',
  episode_number int,
  scene_order int default 0,
  prompt_id text,
  user_id uuid not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table written_scenes disable row level security;
