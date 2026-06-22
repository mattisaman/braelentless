-- Braelentless — lock app_state to an email allowlist (Google auth).
-- Run in the Supabase SQL Editor AFTER enabling the Google provider.
--
-- This replaces the open "allow_all" policy: only authenticated users
-- whose Google email is on the list can read or write. The anon key can
-- no longer touch the data, so this is real access control (not just a
-- hidden UI). Keep this list in sync with src/lib/auth.ts.

drop policy if exists "allow_all_app_state" on app_state;
drop policy if exists "allowlist_app_state" on app_state;

create policy "allowlist_app_state" on app_state
  for all
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') in (
      'mattisaman@gmail.com',
      'tisaman07@gmail.com',
      'bisaman07@gmail.com'
    )
  )
  with check (
    lower(auth.jwt() ->> 'email') in (
      'mattisaman@gmail.com',
      'tisaman07@gmail.com',
      'bisaman07@gmail.com'
    )
  );

-- Optional: lock down the (currently unused, publicly writable) normalized
-- tables to the same allowlist. Uncomment to apply.
-- do $$
-- declare t text;
-- begin
--   foreach t in array array['athletes','sports','sport_stats','sport_goals',
--     'sport_milestones','schedule_events','habits','drills','journal_entries',
--     'books','videos','meals','sleep_log','recruiting_schools','checklist_items',
--     'pentathlon_marks']
--   loop
--     execute format('drop policy if exists "allow_all" on %I', t);
--     execute format($f$create policy "allowlist" on %I for all to authenticated
--       using (lower(auth.jwt() ->> 'email') in
--         ('mattisaman@gmail.com','tisaman07@gmail.com','bisaman07@gmail.com'))
--       with check (lower(auth.jwt() ->> 'email') in
--         ('mattisaman@gmail.com','tisaman07@gmail.com','bisaman07@gmail.com'))$f$, t);
--   end loop;
-- end $$;
