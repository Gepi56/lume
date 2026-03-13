create table if not exists public.creator_images (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_creator_images_creator_id
  on public.creator_images (creator_id);

create index if not exists idx_creator_images_visible_sort
  on public.creator_images (creator_id, is_visible, is_primary desc, sort_order asc);

alter table public.creator_images enable row level security;

create policy if not exists "creator_images public read visible"
  on public.creator_images
  for select
  using (is_visible = true);
