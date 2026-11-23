-- Fome de Bola: saves das contas Google/Facebook (Supabase Auth).
-- Rode uma vez no SQL Editor do projeto (ou peça pro Claude aplicar com o conector do Supabase).
create table if not exists public.fdb_saves_auth(
  uid uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cid text not null check (char_length(cid) between 1 and 64),
  meta jsonb not null default '{}'::jsonb,
  data text not null check (octet_length(data) <= 6000000),
  updated_at timestamptz not null default now(),
  primary key (uid, cid)
);
alter table public.fdb_saves_auth enable row level security;
drop policy if exists "fdb_auth_select" on public.fdb_saves_auth;
drop policy if exists "fdb_auth_insert" on public.fdb_saves_auth;
drop policy if exists "fdb_auth_update" on public.fdb_saves_auth;
drop policy if exists "fdb_auth_delete" on public.fdb_saves_auth;
create policy "fdb_auth_select" on public.fdb_saves_auth for select to authenticated using (uid = (select auth.uid()));
create policy "fdb_auth_insert" on public.fdb_saves_auth for insert to authenticated with check (uid = (select auth.uid()));
create policy "fdb_auth_update" on public.fdb_saves_auth for update to authenticated using (uid = (select auth.uid())) with check (uid = (select auth.uid()));
create policy "fdb_auth_delete" on public.fdb_saves_auth for delete to authenticated using (uid = (select auth.uid()));
revoke all on public.fdb_saves_auth from anon;
grant select, insert, update, delete on public.fdb_saves_auth to authenticated;

-- no máximo 60 carreiras por conta
create or replace function public.fdb_saves_auth_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.fdb_saves_auth where uid = new.uid and cid = new.cid)
     and (select count(*) from public.fdb_saves_auth where uid = new.uid) >= 60 then
    raise exception 'muitas_carreiras';
  end if;
  return new;
end $$;
revoke execute on function public.fdb_saves_auth_limit() from public, anon, authenticated;
drop trigger if exists fdb_saves_auth_limit on public.fdb_saves_auth;
create trigger fdb_saves_auth_limit before insert on public.fdb_saves_auth
  for each row execute function public.fdb_saves_auth_limit();
