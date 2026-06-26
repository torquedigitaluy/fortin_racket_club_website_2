"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Actions de autenticación del panel de administración.
 */

export async function signIn(_prev: string | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return "Ingresá email y contraseña.";
  }

  const supabase = createClient();
  if (!supabase) {
    return "Supabase no está configurado todavía.";
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return "Email o contraseña incorrectos.";
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
