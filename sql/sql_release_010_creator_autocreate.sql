alter table public.creators
  add column if not exists auth_user_id uuid;

create index if not exists idx_creators_auth_user_id
  on public.creators (auth_user_id);

update public.creators c
set auth_user_id = u.id
from auth.users u
where c.email is not null
  and u.email is not null
  and lower(c.email) = lower(u.email)
  and c.auth_user_id is null;

alter table public.creators enable row level security;

drop policy if exists "creators owner select" on public.creators;
create policy "creators owner select"
  on public.creators
  for select
  to authenticated
  using (
    auth_user_id = auth.uid()
    or (
      auth_user_id is null
      and email is not null
      and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists "creators owner insert" on public.creators;
create policy "creators owner insert"
  on public.creators
  for insert
  to authenticated
  with check (
    auth_user_id = auth.uid()
    and (
      email is null
      or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists "creators owner update" on public.creators;
create policy "creators owner update"
  on public.creators
  for update
  to authenticated
  using (
    auth_user_id = auth.uid()
    or (
      auth_user_id is null
      and email is not null
      and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  with check (
    auth_user_id = auth.uid()
  );
