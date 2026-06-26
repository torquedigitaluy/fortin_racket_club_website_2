-- =============================================================================
-- 0001  Profiles, roles y plomería de Auth
-- =============================================================================

-- Perfiles de usuario (1:1 con auth.users) -----------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       text not null default 'viewer',   -- 'admin' | 'viewer'
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- is_admin(): SECURITY DEFINER para evitar recursión de RLS. Lee `profiles`
-- como dueño de la tabla, así las policies de OTRAS tablas pueden llamarla sin
-- volver a disparar la RLS de profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Un usuario puede leer su propio perfil (id = auth.uid(): sin recursión).
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

-- Solo los admins pueden cambiar roles (usa is_admin(), que bypassa RLS adentro).
drop policy if exists "profiles_admin_write" on public.profiles;
create policy "profiles_admin_write"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- Auto-crear un perfil cuando se crea un usuario en auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger compartido para mantener updated_at (lo reutilizan migraciones posteriores).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
