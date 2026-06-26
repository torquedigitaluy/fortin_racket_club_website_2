"use server";

import { getOcupacion, type Ocupacion } from "./disponibilidad";
import { getSupabase } from "./supabase";

/**
 * Server actions públicas (sin auth) usadas por componentes de la landing.
 */

/** Refresca la ocupación de una fecha (se llama al cambiar el selector de día). */
export async function fetchOcupacion(fecha: string): Promise<Ocupacion[]> {
  return getOcupacion(fecha);
}

/** Alta de un suscriptor del newsletter. */
export async function subscribeNewsletter(
  _prev: { ok: boolean; msg: string } | null,
  formData: FormData
): Promise<{ ok: boolean; msg: string }> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, msg: "Ingresá un email válido." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Sin backend aún: respondemos OK para no romper la UX en desarrollo.
    return { ok: true, msg: "¡Gracias por suscribirte!" };
  }

  const { error } = await supabase.from("suscriptores").insert({ email });

  if (error) {
    // 23505 = unique_violation → ya estaba suscripto.
    if (error.code === "23505") {
      return { ok: true, msg: "Ya estabas suscripto. ¡Gracias!" };
    }
    return { ok: false, msg: "No pudimos suscribirte. Probá de nuevo." };
  }

  return { ok: true, msg: "¡Gracias por suscribirte!" };
}
