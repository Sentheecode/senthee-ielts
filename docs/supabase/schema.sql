-- Senthee IELTS learning sync schema
-- Run this in a NEW Supabase project. The previous project ref
-- xitslotqqmxakthbvurd cannot be restored because it was paused for more than 90 days.

create table if not exists public.learner_snapshots (
  id text primary key,
  profile_name text not null default 'Senthee',
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.learner_snapshots enable row level security;

drop policy if exists "single personal snapshot can be read" on public.learner_snapshots;
create policy "single personal snapshot can be read"
on public.learner_snapshots
for select
using (id = 'senthee');

drop policy if exists "single personal snapshot can be inserted" on public.learner_snapshots;
create policy "single personal snapshot can be inserted"
on public.learner_snapshots
for insert
with check (id = 'senthee');

drop policy if exists "single personal snapshot can be updated" on public.learner_snapshots;
create policy "single personal snapshot can be updated"
on public.learner_snapshots
for update
using (id = 'senthee')
with check (id = 'senthee');

create or replace function public.touch_learner_snapshot_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists learner_snapshots_touch_updated_at on public.learner_snapshots;
create trigger learner_snapshots_touch_updated_at
before update on public.learner_snapshots
for each row
execute function public.touch_learner_snapshot_updated_at();
