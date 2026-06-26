import { getSupabase } from "./supabase";

/**
 * Fotos recientes del footer (grilla tipo Instagram). Tabla `footer_fotos`.
 */
const MOCK_FOTOS = [
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1531315396756-905d68d21b56?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=300&q=80",
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
