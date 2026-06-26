import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Helpers de autenticación para Server Components y Server Actions.
 *
 * `getUser()` → el usuario logueado (o null).
 * `isAdmin()` → true si el usuario tiene rol 'admin' en `profiles`.
 * `requireAdmin()` → corta con redirect a /admin/login si no es admin (defensa
 *   en profundidad: el middleware ya filtra, pero cada acción que muta también
 *   debe verificar).
 */

export async function getUser() {
  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role === "admin";
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}
