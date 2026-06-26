"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getResource, type Field } from "./resources";

/**
 * Server Actions genéricas de CRUD para las colecciones simples del CMS.
 *
 * Validan contra el registry (lib/admin/resources.ts), escriben con el cliente
 * server (RLS exige admin) y revalidan la landing y el listado.
 */

type Values = Record<string, unknown>;

function coerce(field: Field, raw: FormDataEntryValue | null): unknown {
  if (field.type === "boolean") {
    return raw === "on" || raw === "true";
  }
  if (field.type === "number") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  if (field.type === "datetime") {
    return raw ? new Date(String(raw)).toISOString() : null;
  }
  // Campos de texto/imagen/select: cadena vacía si está vacío (NO null), para
  // no chocar con columnas `not null` que tienen default. En el alta, las
  // cadenas vacías se omiten más abajo para que aplique el default de la DB.
  return raw == null ? "" : String(raw);
}

function parseForm(resourceKey: string, formData: FormData): Values {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Recurso desconocido: ${resourceKey}`);

  const values: Values = {};
  for (const field of resource.fields) {
    values[field.name] = coerce(field, formData.get(field.name));
  }
  return values;
}

export async function saveRecord(
  resourceKey: string,
  id: string,
  formData: FormData
) {
  await requireAdmin();

  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Recurso desconocido: ${resourceKey}`);

  const supabase = createClient();
  if (!supabase) throw new Error("Supabase no está configurado.");

  const values = parseForm(resourceKey, formData);

  if (id === "new") {
    // Omitir valores vacíos/null en el alta para que apliquen los defaults de
    // la DB (p. ej. hero_slides.alt = '', servicios.href = '#actividades').
    const insertValues = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== "" && v !== null)
    );
    const { error } = await supabase.from(resource.table).insert(insertValues);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from(resource.table)
      .update(values)
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function deleteRecord(resourceKey: string, id: string) {
  await requireAdmin();

  const resource = getResource(resourceKey);
  if (!resource) throw new Error(`Recurso desconocido: ${resourceKey}`);

  const supabase = createClient();
  if (!supabase) throw new Error("Supabase no está configurado.");

  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/admin/${resourceKey}`);
}
