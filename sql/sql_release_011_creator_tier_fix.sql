-- Release 011: align creator autocreate with real tier constraint
-- Allowed values discovered in the current schema: free, premium, elite

alter table public.creators
  alter column tier set default 'free';

update public.creators
set tier = 'free'
where tier is null;
