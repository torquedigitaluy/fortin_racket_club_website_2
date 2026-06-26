import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "./env";

/**
 * Refresca la sesión de Supabase en cada request y la sincroniza en las cookies
 * de la respuesta (patrón estándar de `@supabase/ssr` para Next.js).
 *
 * Devuelve `{ response, user, supabase }`:
 *  - `response`: la NextResponse con las cookies actualizadas (siempre devolverla).
 *  - `user`: el usuario autenticado o `null`.
 *  - `supabase`: el cliente (o `null` si faltan credenciales) para chequear el rol.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Sin credenciales no hay auth posible → seguir sin sesión.
  const env = getPublicEnv();
  if (!env) {
    return { response, user: null, supabase: null };
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, supabase };
}
