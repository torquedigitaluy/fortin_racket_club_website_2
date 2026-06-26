import { getSupabase } from "./supabase";

/**
 * Beneficios ("Full Comfort"). Tabla `beneficios`.
 * El ícono se guarda como string (nombre lucide) y el componente lo mapea.
 */
export type Beneficio = {
  icono: string;
  title: string;
  text: string;
  columna: "left" | "right";
};

const MOCK_BENEFICIOS: Beneficio[] = [
  { icono: "LandPlot", title: "2 Canchas", text: "Dos canchas profesionales de polvo de ladrillo en óptimas condiciones.", columna: "left" },
  { icono: "Users", title: "Coaches profesionales", text: "Equipo de entrenadores certificados para todos los niveles.", columna: "left" },
  { icono: "Trophy", title: "Torneos", text: "Competencias internas y torneos abiertos durante todo el año.", columna: "left" },
  { icono: "Shirt", title: "Guardarropa", text: "Vestuarios y guardarropa con lockers para tus pertenencias.", columna: "right" },
  { icono: "Dumbbell", title: "Campos de entrenamiento", text: "Espacios dedicados para la práctica física y la preparación.", columna: "right" },
  { icono: "Flame", title: "Barbacoa", text: "Sector de parrillas para compartir después del partido.", columna: "right" },
];

export async function getBeneficios(): Promise<Beneficio[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_BENEFICIOS;

  const { data, error } = await supabase
    .from("beneficios")
    .select("icono, title, texto, columna")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[beneficios] usando mock:", error.message);
    return MOCK_BENEFICIOS;
  }

  return data.map((r) => ({
    icono: r.icono,
    title: r.title,
    text: r.texto,
    columna: (r.columna === "right" ? "right" : "left") as "left" | "right",
  }));
}
