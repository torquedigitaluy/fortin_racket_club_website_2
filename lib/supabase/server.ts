import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv } from "./env";

/**
 * Cliente de Supabase para Server Components y Server Actions.
 *
 * A diferencia del singleton anon de `lib/supabase.ts` (lecturas públicas con
 * fallback a mock), este cliente está atado a las cookies de la request, por lo
 * que **lleva la sesión del usuario logueado** y respeta las políticas RLS como
 * ese usuario. Úsalo para escrituras del admin.
 *
 * Devuelve `null` si todavía no están configuradas las variables de entorno,
 * para no romper el build/dev sin credenciales (igual que `getSupabase()`).
 */
export function createClient() {
  const env = getPublicEnv();
  if (!env) return null;

  const cookieStore = cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // `setAll` desde un Server Component lanza error: lo ignoramos porque
          // el refresco de sesión lo maneja el middleware.
        }
      },
    },
  });
}
