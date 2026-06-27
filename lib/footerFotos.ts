import { getSupabase } from "./supabase";

/**
 * Fotos recientes del footer (grilla tipo Instagram). Tabla `footer_fotos`.
 */
const MOCK_FOTOS = [
  // Cancha al atardecer (Hero / Reservas)
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=300&q=80",
  // Jugador en acción (Hero)
  "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=300&q=80",
  // Cancha de polvo de ladrillo (Fortín Club Cup)
  "https://images.unsplash.com/photo-1751275061929-2f63fc96838c?auto=format&fit=crop&w=300&q=80",
  // Chica en cancha (Servicios — Escuela infantil)
  "https://images.unsplash.com/photo-1723980856085-8f8e725329a7?auto=format&fit=crop&w=300&q=80",
  // Raqueta y pelotas (Beneficios)
  "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=300&q=80",
  // Actividad del club (Servicios — Actividades)
  "https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&w=300&q=80",
];

export async function getFooterFotos(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_FOTOS;

  const { data, error } = await supabase
    .from("footer_fotos")
    .select("image_url")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[footer_fotos] usando mock:", error.message);
    return MOCK_FOTOS;
  }

  return data.map((r) => r.image_url);
}
