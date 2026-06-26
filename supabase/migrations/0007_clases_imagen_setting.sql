-- =============================================================================
-- 0007  Imagen de la sección "Clases personalizadas" (editable desde el CMS)
-- =============================================================================

insert into public.site_settings (key, value) values
  ('clases_imagen_url', 'https://images.unsplash.com/photo-1531315396756-905d68d21b56?auto=format&fit=crop&w=1000&q=80'),
  ('clases_imagen_alt', 'Tenista en plena acción durante una clase')
on conflict (key) do nothing;
