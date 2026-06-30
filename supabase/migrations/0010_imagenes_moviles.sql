-- =============================================================================
-- 0010  Imagen móvil (vertical 9:16) opcional para slides del hero y secciones
-- =============================================================================

-- Slides del hero: cada slide puede tener una versión vertical para móvil.
-- Si queda vacía, el carrusel usa la imagen horizontal también en móvil.
alter table public.hero_slides
  add column if not exists image_movil_url text;

-- site_settings: defaults vacíos para las nuevas claves (se completan desde el CMS).
insert into public.site_settings (key, value) values
  ('clases_imagen_movil_url', ''),
  ('torneo_imagen_movil_url', ''),
  ('reservas_imagen_movil_url', '')
on conflict (key) do nothing;
