import { getSupabase } from "./supabase";

/**
 * Patrocinadores (carrusel). Tabla `sponsors`.
 */
const MOCK_SPONSORS = [
  "Wilson",
  "Babolat",
  "HEAD",
  "Yonex",
  "Dunlop",
  "Prince",
  "Asics",
  "Lacoste",
];

export async function getSponsors(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_SPONSORS;

  const { data, error } = await supabase
    .from("sponsors")
    .select("nombre")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[sponsors] usando mock:", error.message);
    return MOCK_SPONSORS;
  }

  return data.map((r) => r.nombre);
}
