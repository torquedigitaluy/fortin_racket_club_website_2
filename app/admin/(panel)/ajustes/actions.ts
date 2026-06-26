"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { SETTINGS_GROUPS } from "@/lib/settings";

/**
 * Guarda los ajustes del sitio (upsert de cada key/value de site_settings).
 */
export async function saveSettings(formData: FormData) {
  await requireAdmin();

  const supabase = createClient();
  if (!supabase) throw new Error("Supabase no está configurado.");

  const keys = SETTINGS_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
  const rows = keys.map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
  }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/ajustes");
}
