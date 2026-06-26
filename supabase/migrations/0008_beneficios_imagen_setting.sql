-- =============================================================================
-- 0008  Imagen central de la sección "Beneficios" (editable desde el CMS)
-- =============================================================================

insert into public.site_settings (key, value) values
  ('beneficios_imagen_url', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80'),
  ('beneficios_imagen_alt', 'Raqueta de tenis y pelotas')
on conflict (key) do nothing;
