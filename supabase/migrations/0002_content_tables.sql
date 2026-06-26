-- =============================================================================
-- 0002  Tablas de contenido (las 13 secciones)
-- =============================================================================
-- Forma compartida en colecciones simples: orden / activo / timestamps, para
-- que el CMS genérico las trate de forma uniforme.

-- Entrenadores (mantiene columnas existentes) --------------------------------
create table if not exists public.coaches (
  id          bigint generated always as identity primary key,
  nombre      text not null,
  cargo       text not null,
  descripcion text not null,
  foto_url    text,
  orden       int  not null default 0,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Agenda de partidos (Torneo & Calendario) -----------------------------------
create table if not exists public.partidos (
  id         bigint generated always as identity primary key,
  fecha      timestamptz not null,
  jugadores  text not null,
  cancha     text not null,
  activo     boolean not null default true,
  created_at timestamptz not null default now()
);

-- Servicios (grilla de 4 tarjetas) -------------------------------------------
create table if not exists public.servicios (
  id        bigint generated always as identity primary key,
  title     text not null,
  texto     text not null,
  image_url text,
  alt       text,
  href      text not null default '#actividades',
  orden     int not null default 0,
  activo    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clases personalizadas (lista numerada) -------------------------------------
create table if not exists public.clases (
  id      bigint generated always as identity primary key,
  numero  text not null,            -- "01"
  title   text not null,
  texto   text not null,
  href    text not null default '#actividades',
  orden   int not null default 0,
  activo  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Beneficios ("Full Comfort") ------------------------------------------------
create table if not exists public.beneficios (
  id      bigint generated always as identity primary key,
  icono   text not null,            -- nombre lucide: LandPlot, Users, Trophy...
  title   text not null,
  texto   text not null,
  columna text not null default 'left' check (columna in ('left','right')),
  orden   int not null default 0,
  activo  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Sponsors (carrusel) --------------------------------------------------------
create table if not exists public.sponsors (
  id     bigint generated always as identity primary key,
  nombre text not null,
  logo_url text,
  orden  int not null default 0,
  activo boolean not null default true
);

-- Slides del hero ------------------------------------------------------------
create table if not exists public.hero_slides (
  id        bigint generated always as identity primary key,
  image_url text not null,
  alt       text not null default '',
  title     text not null,
  texto     text not null,
  orden     int not null default 0,
  activo    boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Estadísticas (contadores) --------------------------------------------------
create table if not exists public.estadisticas (
  id     bigint generated always as identity primary key,
  valor  text not null,             -- string ("124")
  label  text not null,
  orden  int not null default 0,
  activo boolean not null default true
);

-- Testimonios ----------------------------------------------------------------
create table if not exists public.testimonios (
  id      bigint generated always as identity primary key,
  texto   text not null,
  autor   text not null,
  rol     text not null,
  foto_url text,
  orden   int not null default 0,
  activo  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Fotos del footer (grilla tipo Instagram) -----------------------------------
create table if not exists public.footer_fotos (
  id        bigint generated always as identity primary key,
  image_url text not null,
  orden     int not null default 0,
  activo    boolean not null default true
);

-- Links de navegación --------------------------------------------------------
create table if not exists public.nav_links (
  id     bigint generated always as identity primary key,
  label  text not null,
  href   text not null,
  orden  int not null default 0,
  activo boolean not null default true
);

-- Planes de socio: lista de planes + lista de features + matriz booleana ------
create table if not exists public.planes (
  id        bigint generated always as identity primary key,
  nombre    text not null,
  precio    numeric(10,2) not null default 0,
  destacado boolean not null default false,
  orden     int not null default 0,
  activo    boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.plan_features (
  id     bigint generated always as identity primary key,
  label  text not null,            -- "Acceso a 2 canchas"
  orden  int not null default 0,
  activo boolean not null default true
);

create table if not exists public.plan_feature_values (
  plan_id    bigint not null references public.planes(id) on delete cascade,
  feature_id bigint not null references public.plan_features(id) on delete cascade,
  incluido   boolean not null default false,
  primary key (plan_id, feature_id)
);

-- Triggers updated_at --------------------------------------------------------
drop trigger if exists t_coaches_upd on public.coaches;
create trigger t_coaches_upd before update on public.coaches    for each row execute function public.set_updated_at();
drop trigger if exists t_serv_upd on public.servicios;
create trigger t_serv_upd    before update on public.servicios   for each row execute function public.set_updated_at();
drop trigger if exists t_clases_upd on public.clases;
create trigger t_clases_upd  before update on public.clases      for each row execute function public.set_updated_at();
drop trigger if exists t_benef_upd on public.beneficios;
create trigger t_benef_upd   before update on public.beneficios  for each row execute function public.set_updated_at();
drop trigger if exists t_hero_upd on public.hero_slides;
create trigger t_hero_upd    before update on public.hero_slides for each row execute function public.set_updated_at();
drop trigger if exists t_test_upd on public.testimonios;
create trigger t_test_upd    before update on public.testimonios for each row execute function public.set_updated_at();
drop trigger if exists t_planes_upd on public.planes;
create trigger t_planes_upd  before update on public.planes      for each row execute function public.set_updated_at();

-- Índices de ordenamiento/lectura --------------------------------------------
create index if not exists idx_coaches_orden      on public.coaches      (orden);
create index if not exists idx_servicios_orden    on public.servicios    (orden);
create index if not exists idx_clases_orden       on public.clases       (orden);
create index if not exists idx_beneficios_orden   on public.beneficios   (orden);
create index if not exists idx_sponsors_orden     on public.sponsors     (orden);
create index if not exists idx_hero_orden         on public.hero_slides  (orden);
create index if not exists idx_estadisticas_orden on public.estadisticas (orden);
create index if not exists idx_testimonios_orden  on public.testimonios  (orden);
create index if not exists idx_footer_orden       on public.footer_fotos (orden);
create index if not exists idx_navlinks_orden     on public.nav_links    (orden);
create index if not exists idx_planes_orden       on public.planes       (orden);
create index if not exists idx_partidos_fecha     on public.partidos     (fecha);
