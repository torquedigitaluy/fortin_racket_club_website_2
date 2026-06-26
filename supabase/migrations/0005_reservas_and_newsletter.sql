-- =============================================================================
-- 0005  Reservas de canchas + suscriptores del newsletter
-- =============================================================================

create table if not exists public.reservas (
  id           bigint generated always as identity primary key,
  cancha       text not null,
  fecha        date not null,
  hora         int  not null check (hora between 0 and 23),
  estado       text not null default 'reservado'
               check (estado in ('reservado','bloqueado','pagado','cancelado')),
  nombre       text,
  email        text,
  mp_reference text,
  created_at   timestamptz not null default now(),
  unique (cancha, fecha, hora)      -- evita doble reserva del mismo turno
);

create index if not exists idx_reservas_fecha on public.reservas (fecha, cancha);

alter table public.reservas enable row level security;

-- Solo admins ven/gestionan reservas (incluye datos personales del reservante).
drop policy if exists "reservas_admin_all" on public.reservas;
create policy "reservas_admin_all" on public.reservas
  for all using (public.is_admin()) with check (public.is_admin());

-- Disponibilidad pública SIN exponer PII: solo cancha/hora/estado de los turnos
-- ocupados de una fecha. SECURITY DEFINER para saltar la RLS de reservas.
create or replace function public.get_ocupacion(p_fecha date)
returns table (cancha text, hora int, estado text)
language sql security definer set search_path = public stable
as $$
  select cancha, hora, estado
  from public.reservas
  where fecha = p_fecha and estado in ('reservado','pagado','bloqueado');
$$;

grant execute on function public.get_ocupacion(date) to anon, authenticated;

-- Suscriptores del newsletter: cualquiera se suscribe, solo admin lee.
create table if not exists public.suscriptores (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.suscriptores enable row level security;

drop policy if exists "suscriptores_public_insert" on public.suscriptores;
create policy "suscriptores_public_insert" on public.suscriptores
  for insert with check (true);

drop policy if exists "suscriptores_admin_read" on public.suscriptores;
create policy "suscriptores_admin_read" on public.suscriptores
  for select using (public.is_admin());
