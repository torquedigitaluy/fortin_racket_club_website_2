import { getSupabase } from "./supabase";

/**
 * Slides del hero. Tabla `hero_slides`.
 */
export type Slide = {
  image: string;
  alt: string;
  title: string;
  text: string;
};

const MOCK_SLIDES: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1920&q=80",
    alt: "Cancha de tenis al atardecer",
    title: "Fortín Racket Club",
    text: "Un club moderno donde el tenis se vive con pasión. Canchas profesionales, entrenamiento de primer nivel y comunidad.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1920&q=80",
    alt: "Jugadora de tenis en acción",
    title: "Entrená con los mejores",
    text: "Clases individuales, grupales y sociales con coaches profesionales para todos los niveles.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1920&q=80",
    alt: "Pelotas y raqueta de tenis",
    title: "Reservá tu cancha",
    text: "Disponibilidad de 09:00 a 23:00. Reservá online en segundos y salí a jugar.",
  },
];

export async function getHeroSlides(): Promise<Slide[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_SLIDES;

  const { data, error } = await supabase
    .from("hero_slides")
    .select("image_url, alt, title, texto")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[hero_slides] usando mock:", error.message);
    return MOCK_SLIDES;
  }

  return data.map((r) => ({
    image: r.image_url,
    alt: r.alt ?? "",
    title: r.title,
    text: r.texto,
  }));
}
