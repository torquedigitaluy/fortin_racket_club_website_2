import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la **service-role key**: BYPASSEA RLS.
 *
 * Solo para tareas privilegiadas del lado del servidor (p. ej. insertar una
 * reserva desde el route handler de checkout). NUNCA debe importarse desde un
 * Client Component ni usar una variable `NEXT_PUBLIC_*` para la key.
 *
 * Devuelve `null` si falta la key (modo desarrollo sin credenciales).
 */
export function createAdminClient() {
  // Guard defensivo: este módulo jamás debe ejecutarse en el navegador.
  if (typeof window !== "undefined") {
    throw new Error("lib/supabase/admin.ts no puede usarse en el cliente");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
