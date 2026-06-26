import { getSupabase } from "./supabase";

/**
 * Testimonios. Tabla `testimonios`.
 */
export type Testimonio = {
  texto: string;
  autor: string;
  rol: string;
  foto: string;
};

const MOCK_TESTIMONIOS: Testimonio[] = [
  {
    texto:
      "Desde que me hice socio mejoré muchísimo mi juego. Las canchas están impecables y los coaches son de primer nivel. Es mi segundo hogar.",
    autor: "Andrés Molina",
    rol: "Socio Full",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    texto:
      "Llevo a mis hijos a la escuela infantil y la experiencia es excelente. Aprenden, se divierten y están en un entorno seguro y profesional.",
    autor: "Valeria Ríos",
    rol: "Mamá de la escuela",
    foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
  {
    texto:
      "Reservar una cancha es súper fácil desde la web y siempre encuentro horario. El ambiente del club después del partido, con la barbacoa, es inmejorable.",
    autor: "Tomás Ferreyra",
    rol: "Socio Profesional",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

export async function getTestimonios(): Promise<Testimonio[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_TESTIMONIOS;

  const { data, error } = await supabase
    .from("testimonios")
    .select("texto, autor, rol, foto_url")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[testimonios] usando mock:", error.message);
    return MOCK_TESTIMONIOS;
  }

  return data.map((r) => ({
    texto: r.texto,
    autor: r.autor,
    rol: r.rol,
    foto: r.foto_url ?? "",
  }));
}
