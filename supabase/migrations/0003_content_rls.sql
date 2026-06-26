-- =============================================================================
-- 0003  RLS de las tablas de contenido
-- =============================================================================
-- Política uniforme por tabla: SELECT público + escritura solo admin.

do $$
declare t text;
begin
  foreach t in array array[
    'coaches','partidos','servicios','clases','beneficios','sponsors',
    'hero_slides','estadisticas','testimonios','footer_fotos','nav_links',
    'planes','plan_features','plan_feature_values'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists %I on public.%I;', t||'_public_read', t);
    execute format(
      'create policy %I on public.%I for select using (true);',
      t||'_public_read', t);

    execute format('drop policy if exists %I on public.%I;', t||'_admin_write', t);
    execute format(
      'create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin());',
      t||'_admin_write', t);
  end loop;
end $$;
