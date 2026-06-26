import { createClient } from "./supabase/browser";

/**
 * Sube un archivo al bucket público `media` de Supabase Storage y devuelve la
 * URL pública. Se usa desde el componente cliente ImageUpload del CMS.
 *
 * La RLS del bucket exige rol admin para subir, así que esta función solo
 * funciona dentro del panel autenticado.
 */
export async function uploadMedia(file: File, folder = "media"): Promise<string> {
  const supabase = createClient();
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`No se pudo subir la imagen: ${error.message}`);
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
