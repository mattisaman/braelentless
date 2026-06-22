-- Braelentless — key/value app state for cross-device persistence
-- Run once in the Supabase SQL Editor.
-- Mirrors the localStorage keys the app already uses (braelentless_*),
-- so every edit (hero name, habits, goals, meals, recruiting, etc.) is
-- saved to Supabase and re-hydrated on any device.

create table if not exists app_state (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table app_state enable row level security;

-- Single-user app: permissive policy (tighten when auth is added).
drop policy if exists "allow_all_app_state" on app_state;
create policy "allow_all_app_state" on app_state
  for all using (true) with check (true);
