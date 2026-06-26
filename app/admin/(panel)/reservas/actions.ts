"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

/**
 * Acciones del admin sobre reservas: bloquear y liberar turnos.
 */

export async function bloquearSlot(cancha: string, fecha: string, hora: number) {
  await requireAdmin();
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase no está configurado.");

  const { error } = await supabase
    .from("reservas")
    .insert({ cancha, fecha, hora, estado: "bloqueado" });

  // 23505 → ya existe una fila para ese turno; lo ignoramos.
  if (error && error.code !== "23505") throw new Error(error.message);

  revalidatePath("/admin/reservas");
}

export async function liberarSlot(id: number) {
  await requireAdmin();
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase no está configurado.");

  const { error } = await supabase.from("reservas").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reservas");
}
