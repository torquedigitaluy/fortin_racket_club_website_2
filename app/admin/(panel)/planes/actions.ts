"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

/**
 * Guarda el editor de planes (matriz planes × features) en una sola operación.
 *
 * El cliente envía cada plan/feature con una `key` estable; los nuevos tienen
 * `id: null`. El servidor reconcilia (insert/update/delete), mapea key→id real
 * y reconstruye plan_feature_values a partir de la matriz.
 */

export type FeatureInput = {
  key: string;
  id: number | null;
  label: string;
  orden: number;
  activo: boolean;
};
export type PlanInput = {
  key: string;
  id: number | null;
  nombre: string;
  precio: number;
  destacado: boolean;
  orden: number;
  activo: boolean;
};
export type PlanesPayload = {
  features: FeatureInput[];
  planes: PlanInput[];
  matrix: string[]; // ["planKey:featureKey", ...] de los incluidos
};

export async function savePlanes(payload: PlanesPayload) {
  await requireAdmin();

  const supabase = createClient();
  if (!supabase) throw new Error("Supabase no está configurado.");

  // --- Features: reconciliar ------------------------------------------------
  const featureKeyToId = new Map<string, number>();
  const keptFeatureIds: number[] = [];

  for (const f of payload.features) {
    const row = { label: f.label, orden: f.orden, activo: f.activo };
    if (f.id == null) {
      const { data, error } = await supabase
        .from("plan_features")
        .insert(row)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      featureKeyToId.set(f.key, data!.id);
      keptFeatureIds.push(data!.id);
    } else {
      const { error } = await supabase
        .from("plan_features")
        .update(row)
        .eq("id", f.id);
      if (error) throw new Error(error.message);
      featureKeyToId.set(f.key, f.id);
      keptFeatureIds.push(f.id);
    }
  }
  // Borrar features eliminadas (cascade limpia plan_feature_values).
  await deleteMissing(supabase, "plan_features", keptFeatureIds);

  // --- Planes: reconciliar --------------------------------------------------
  const planKeyToId = new Map<string, number>();
  const keptPlanIds: number[] = [];

  for (const p of payload.planes) {
    const row = {
      nombre: p.nombre,
      precio: p.precio,
      destacado: p.destacado,
      orden: p.orden,
      activo: p.activo,
    };
    if (p.id == null) {
      const { data, error } = await supabase
        .from("planes")
        .insert(row)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      planKeyToId.set(p.key, data!.id);
      keptPlanIds.push(data!.id);
    } else {
      const { error } = await supabase.from("planes").update(row).eq("id", p.id);
      if (error) throw new Error(error.message);
      planKeyToId.set(p.key, p.id);
      keptPlanIds.push(p.id);
    }
  }
  await deleteMissing(supabase, "planes", keptPlanIds);

  // --- Matriz: reconstruir --------------------------------------------------
  if (keptPlanIds.length > 0) {
    await supabase
      .from("plan_feature_values")
      .delete()
      .in("plan_id", keptPlanIds);
  }

  const values = payload.matrix
    .map((entry) => {
      const [planKey, featureKey] = entry.split(":");
      const plan_id = planKeyToId.get(planKey);
      const feature_id = featureKeyToId.get(featureKey);
      if (plan_id == null || feature_id == null) return null;
      return { plan_id, feature_id, incluido: true };
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  if (values.length > 0) {
    const { error } = await supabase.from("plan_feature_values").insert(values);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/planes");
}

// Borra filas cuyo id no esté en `keep`.
async function deleteMissing(
  supabase: NonNullable<ReturnType<typeof createClient>>,
  table: string,
  keep: number[]
) {
  const { data, error: selError } = await supabase.from(table).select("id");
  if (selError) throw new Error(selError.message);

  const toDelete = (data ?? [])
    .map((r) => (r as { id: number }).id)
    .filter((id) => !keep.includes(id));
  if (toDelete.length > 0) {
    const { error } = await supabase.from(table).delete().in("id", toDelete);
    if (error) throw new Error(`Error borrando en ${table}: ${error.message}`);
  }
}
