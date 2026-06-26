-- =============================================================================
-- 0006  Bucket de Storage 'media' + políticas
-- =============================================================================
-- Lectura pública; subir/reemplazar/borrar solo admins.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
