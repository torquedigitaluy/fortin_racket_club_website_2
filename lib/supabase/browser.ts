import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "./env";

/**
 * Cliente de Supabase para Client Components (login del admin, subida de
 * imágenes). Mantiene la sesión en cookies vía `@supabase/ssr`, de modo que el
 * servidor (middleware / Server Components) la pueda leer.
 *
 * Devuelve `null` si faltan las variables de entorno públicas.
 */
export function createClient() {
  const env = getPublicEnv();
  if (!env) return null;

  return createBrowserClient(env.url, env.anonKey);
}
