import { getSupabase } from "./supabase";

/**
 * Servicios (grilla de tarjetas). Tabla `servicios`.
 * Sin credenciales / tabla vacía → mock (mismos datos que tenía el componente).
 */
export type Servicio = {
  title: string;
  text: string;
  image: string;
  alt: string;
  href: string;
};

const MOCK_SERVICIOS: Servicio[] = [
  {
    title: "Reserva de canchas",
    text: "Canchas profesionales disponibles de 09:00 a 23:00. Reservá online en segundos.",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
    alt: "Cancha de tenis lista para jugar",
    href: "#reservas",
  },
  {
    title: "Entrenamientos personales",
    text: "Clases individuales con coaches profesionales adaptadas a tu nivel y objetivos.",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
    alt: "Entrenador dando una clase de tenis",
    href: "#actividades",
  },
  {
    title: "Escuela infantil",
    text: "Formación para los más chicos en un entorno seguro, divertido y profesional.",
    image:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80",
    alt: "Niños aprendiendo a jugar al tenis",
    href: "#actividades",
  },
  {
    title: "Actividades",
    text: "Torneos, clases sociales y eventos para vivir el club más allá de la cancha.",
    image:
      "https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&w=800&q=80",
    alt: "Jugadores disfrutando una actividad del club",
    href: "#actividades",
  },
];

export async function getServicios(): Promise<Servicio[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_SERVICIOS;

  const { data, error } = await supabase
    .from("servicios")
    .select("title, texto, image_url, alt, href")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[servicios] usando mock:", error.message);
    return MOCK_SERVICIOS;
  }

  return data.map((r) => ({
    title: r.title,
    text: r.texto,
    image: r.image_url ?? "",
    alt: r.alt ?? "",
    href: r.href ?? "#",
  }));
}
