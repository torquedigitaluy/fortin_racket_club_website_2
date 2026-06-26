import { getSupabase } from "./supabase";

/**
 * Estadísticas (contadores). Tabla `estadisticas`.
 */
export type Estadistica = {
  valor: string;
  label: string;
};

const MOCK_STATS: Estadistica[] = [
  { valor: "2", label: "Canchas" },
  { valor: "10", label: "Coaches" },
  { valor: "124", label: "Socios" },
  { valor: "18", label: "Torneos Organizados" },
];

export async function getEstadisticas(): Promise<Estadistica[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_STATS;

  const { data, error } = await supabase
    .from("estadisticas")
    .select("valor, label")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[estadisticas] usando mock:", error.message);
    return MOCK_STATS;
  }

  return data as Estadistica[];
}
