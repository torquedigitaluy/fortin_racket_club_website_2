import { getSupabase } from "./supabase";

/**
 * Planes de socio. Modelo en Supabase:
 *   - planes(id, nombre, precio, destacado, orden, activo)
 *   - plan_features(id, label, orden, activo)
 *   - plan_feature_values(plan_id, feature_id, incluido)
 *
 * El componente PlanesSocio consume la forma plana:
 *   features: string[]   +   planes: { nombre, precio, destacado, incluye[] }
 * donde `incluye` está alineado por índice con `features`.
 *
 * Sin credenciales / tablas vacías → datos mock (mismos que tenía el componente).
 */

export type PlanPublico = {
  nombre: string;
  precio: number;
  destacado: boolean;
  incluye: boolean[];
};

export type PlanesData = {
  features: string[];
  planes: PlanPublico[];
};

const MOCK_FEATURES = [
  "Acceso a 2 canchas",
  "Reservas online",
  "Clases grupales",
  "Acceso a torneos",
  "Entrenamiento personalizado",
];

const MOCK_PLANES: PlanPublico[] = [
  { nombre: "Principiante", precio: 29, destacado: false, incluye: [true, true, false, false, false] },
  { nombre: "Avanzado", precio: 59, destacado: false, incluye: [true, true, true, false, false] },
  { nombre: "Profesional", precio: 90, destacado: false, incluye: [true, true, true, true, false] },
  { nombre: "Full", precio: 120, destacado: true, incluye: [true, true, true, true, true] },
];

const MOCK: PlanesData = { features: MOCK_FEATURES, planes: MOCK_PLANES };

// --- Tipos crudos para el editor del CMS ------------------------------------
export type PlanRow = {
  id: number;
  nombre: string;
  precio: number;
  destacado: boolean;
  orden: number;
  activo: boolean;
};
export type FeatureRow = {
  id: number;
  label: string;
  orden: number;
  activo: boolean;
};
export type FeatureValue = {
  plan_id: number;
  feature_id: number;
  incluido: boolean;
};

export type PlanesAdminData = {
  planes: PlanRow[];
  features: FeatureRow[];
  values: FeatureValue[];
};

/** Lectura cruda para el editor de matriz del admin. */
export async function getPlanesAdmin(): Promise<PlanesAdminData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const [planesRes, featuresRes, valuesRes] = await Promise.all([
    supabase.from("planes").select("*").order("orden", { ascending: true }),
    supabase.from("plan_features").select("*").order("orden", { ascending: true }),
    supabase.from("plan_feature_values").select("*"),
  ]);

  if (planesRes.error || featuresRes.error || valuesRes.error) {
    const msg =
      planesRes.error?.message ??
      featuresRes.error?.message ??
      valuesRes.error?.message;
    console.warn("[planes] Supabase no disponible, usando mock:", msg);
    return null;
  }

  return {
    planes: (planesRes.data ?? []) as PlanRow[],
    features: (featuresRes.data ?? []) as FeatureRow[],
    values: (valuesRes.data ?? []) as FeatureValue[],
  };
}

/** Forma plana para el componente público PlanesSocio. */
export async function getPlanes(): Promise<PlanesData> {
  const data = await getPlanesAdmin();

  if (!data || data.planes.length === 0 || data.features.length === 0) {
    return MOCK;
  }

  const features = data.features
    .filter((f) => f.activo)
    .sort((a, b) => a.orden - b.orden);

  const incluidoSet = new Set(
    data.values.filter((v) => v.incluido).map((v) => `${v.plan_id}:${v.feature_id}`)
  );

  const planes: PlanPublico[] = data.planes
    .filter((p) => p.activo)
    .sort((a, b) => a.orden - b.orden)
    .map((p) => ({
      nombre: p.nombre,
      precio: Number(p.precio),
      destacado: p.destacado,
      incluye: features.map((f) => incluidoSet.has(`${p.id}:${f.id}`)),
    }));

  return { features: features.map((f) => f.label), planes };
}
