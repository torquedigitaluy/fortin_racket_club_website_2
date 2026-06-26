-- =============================================================================
-- 0004  Ajustes del sitio (key/value para textos singulares)
-- =============================================================================

create table if not exists public.site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists t_settings_upd on public.site_settings;
create trigger t_settings_upd before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed de claves que consumen los componentes (valor vacío → default del comp).
insert into public.site_settings (key, value) values
  ('hero_cta_label', 'Saber más'),
  ('footer_descripcion', 'Un club moderno donde el tenis se vive con pasión, comunidad y alto rendimiento.'),
  ('contacto_telefono', '+54 11 1234-5678'),
  ('contacto_direccion', 'Av. del Tenis 1234, Buenos Aires'),
  ('contacto_whatsapp_url', 'https://wa.me/541112345678'),
  ('social_instagram', '#'),
  ('social_facebook', '#'),
  ('social_youtube', '#'),
  ('cta_eyebrow', 'Oferta de bienvenida'),
  ('cta_titulo', '¡Tu primera clase es GRATIS!'),
  ('cta_texto', 'Probá una clase con nuestros coaches profesionales sin costo y descubrí por qué somos tu próximo club.'),
  ('cta_boton_label', 'Saber más'),
  ('cta_boton_href', '#contacto'),
  ('newsletter_titulo', 'Sumate a nuestro newsletter'),
  ('newsletter_texto', 'Recibí novedades, torneos y promociones exclusivas en tu correo.'),
  ('reservas_precio_hora', '999')
on conflict (key) do nothing;
