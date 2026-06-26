import { getSupabase } from "./supabase";

/**
 * Clases personalizadas (lista numerada). Tabla `clases`.
 */
export type Clase = {
  numero: string;
  title: string;
  text: string;
  href: string;
};

const MOCK_CLASES: Clase[] = [
  {
    numero: "01",
    title: "Clases individuales",
    text: "Atención uno a uno con un coach profesional. Plan a medida según tu nivel, ritmo y objetivos.",
    href: "#actividades",
  },
  {
    numero: "02",
    title: "Clases grupales",
    text: "Entrená en grupos reducidos, mejorá tu técnica y disfrutá la energía de jugar acompañado.",
    href: "#actividades",
  },
  {
    numero: "03",
    title: "Clases sociales",
    text: "Partidos y dinámicas distendidas para conocer gente, sumar horas de cancha y pasarla bien.",
    href: "#actividades",
  },
];

export async function getClases(): Promise<Clase[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_CLASES;

  const { data, error } = await supabase
    .from("clases")
    .select("numero, title, texto, href")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[clases] usando mock:", error.message);
    return MOCK_CLASES;
  }

  return data.map((r) => ({
    numero: r.numero,
    title: r.title,
    text: r.texto,
    href: r.href ?? "#",
  }));
}
