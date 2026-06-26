/**
 * Lee las variables de entorno públicas de Supabase. Devuelve `null` si falta
 * alguna, para que los clientes (server/browser/middleware) puedan degradar a
 * modo sin credenciales de forma uniforme.
 */
export function getPublicEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}
