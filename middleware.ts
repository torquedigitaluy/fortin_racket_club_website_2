import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Protege las rutas /admin/* (excepto /admin/login):
 *  1. Refresca la sesión de Supabase (updateSession).
 *  2. Si no hay usuario o su rol no es 'admin' → redirige a /admin/login.
 *
 * Defensa en profundidad: el layout y cada server action vuelven a verificar.
 */
export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  // /admin/login es público; el resto requiere admin.
  if (isLogin) {
    return response;
  }

  // Sin Supabase configurado no podemos verificar → dejamos pasar para no
  // romper el desarrollo sin credenciales (el layout igual exige admin).
  if (!supabase) {
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
