-- Braelentless — initial schema
-- Run once Supabase project is ready

-- Athletes
create table athletes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  grad_year int,
  school text,
  height_in int,
  weight_lb int,
  wingspan_in int,
  commit_school text,
  commit_sport text,
  commit_detail text,
  created_at timestamptz default now()
);

-- Sports (soccer, basketball, track per athlete)
create table sports (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  key text not null, -- 'soccer' | 'basketball' | 'track'
  name text not null,
  number int,
  role text,
  tag text,
  bg_image text,
  season text,
  motto text,
  home_goal_label text,
  home_pct int default 0,
  is_track boolean default false,
  unique(athlete_id, key)
);

-- Season stats (6 per sport, updatable)
create table sport_stats (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid references sports(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order int default 0,
  updated_at timestamptz default now()
);

-- Goals (editable, with progress tracking)
create table sport_goals (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid references sports(id) on delete cascade,
  label text not null,
  current_val numeric not null default 0,
  target_val numeric not null,
  unit text,
  lower_better boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Milestones
create table sport_milestones (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid references sports(id) on delete cascade,
  text text not null,
  achieved boolean default false,
  sort_order int default 0
);

-- Season schedule / calendar events
create table schedule_events (
  id uuid primary key default gen_random_uuid(),
  sport_id uuid references sports(id) on delete cascade,
  athlete_id uuid references athletes(id) on delete cascade,
  title text not null,
  event_type text default 'game', -- 'game' | 'tournament' | 'practice' | 'scrimmage'
  opponent text,
  location text,
  event_date timestamptz not null,
  result text,
  notes text,
  created_at timestamptz default now()
);

-- Training habits
create table habits (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  name text not null,
  streak int default 0,
  note text,
  last_checked_at date,
  sort_order int default 0
);

-- Drill library
create table drills (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  name text not null,
  sport_key text,
  focus text,
  dose text,
  description text,
  sort_order int default 0
);

-- Mind / R&R — journal entries
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  content text not null,
  entry_type text default 'reflect', -- 'reflect' | 'forward'
  prompt text,
  created_at timestamptz default now()
);

-- Reading list
create table books (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  title text not null,
  author text,
  status text default 'Up next', -- 'Reading' | 'Up next' | 'Done'
  pct_complete int default 0,
  note text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Video gallery (footage + highlights)
create table videos (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  sport_id uuid references sports(id) on delete set null,
  title text not null,
  url text not null, -- YouTube/Vimeo embed URL
  video_type text default 'footage', -- 'footage' | 'highlight'
  notes text,
  created_at timestamptz default now()
);

-- Fuel — meal plans
create table meals (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  meal text not null,
  items text,
  kcal int,
  plan_date date default current_date,
  sort_order int default 0
);

-- Sleep log
create table sleep_log (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  hours numeric not null,
  log_date date not null default current_date,
  unique(athlete_id, log_date)
);

-- Recruiting pipeline
create table recruiting_schools (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  school text not null,
  division text,
  status text default 'WATCHING', -- 'COMMITTED' | 'TALKING' | 'INTERESTED' | 'WATCHING'
  coach text,
  next_action text,
  is_accent boolean default false,
  sort_order int default 0
);

-- Eligibility checklist
create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  label text not null,
  done boolean default false,
  sort_order int default 0
);

-- Pentathlon personal bests
create table pentathlon_marks (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athletes(id) on delete cascade,
  event_key text not null, -- 'h100' | 'hj' | 'sp' | 'lj' | 'r800'
  mark numeric not null,
  recorded_at timestamptz default now(),
  unique(athlete_id, event_key)
);

-- Enable RLS on all tables
alter table athletes enable row level security;
alter table sports enable row level security;
alter table sport_stats enable row level security;
alter table sport_goals enable row level security;
alter table sport_milestones enable row level security;
alter table schedule_events enable row level security;
alter table habits enable row level security;
alter table drills enable row level security;
alter table journal_entries enable row level security;
alter table books enable row level security;
alter table videos enable row level security;
alter table meals enable row level security;
alter table sleep_log enable row level security;
alter table recruiting_schools enable row level security;
alter table checklist_items enable row level security;
alter table pentathlon_marks enable row level security;

-- Permissive policies (single-user app — tighten when auth is added)
do $$
declare t text;
begin
  foreach t in array array['athletes','sports','sport_stats','sport_goals','sport_milestones',
    'schedule_events','habits','drills','journal_entries','books','videos','meals',
    'sleep_log','recruiting_schools','checklist_items','pentathlon_marks']
  loop
    execute format('create policy "allow_all" on %I for all using (true) with check (true)', t);
  end loop;
end $$;
