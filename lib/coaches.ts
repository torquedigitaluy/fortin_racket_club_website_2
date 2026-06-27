import { getSupabase } from "./supabase";

/**
 * Entrenadores del club.
 *
 * Tabla esperada en Supabase (crear cuando esté el proyecto):
 *
 *   create table coaches (
 *     id          bigint generated always as identity primary key,
 *     nombre      text not null,
 *     cargo       text not null,            -- ej: "Coach de alto rendimiento"
 *     descripcion text not null,
 *     foto_url    text,                     -- URL pública de la foto
 *     orden       int default 0,            -- para ordenar la grilla
 *     created_at  timestamptz default now()
 *   );
 *
 * Mientras no existan las variables de entorno de Supabase (o la tabla esté
 * vacía / falle la consulta) se devuelven los datos mock de abajo.
 */
export type Coach = {
  id: string | number;
  nombre: string;
  cargo: string;
  descripcion: string;
  foto_url: string;
};

const MOCK_COACHES: Coach[] = [
  {
    id: 1,
    nombre: "Martín Herrera",
    cargo: "Director deportivo",
    descripcion:
      "Ex jugador profesional con más de 15 años formando campeones.",
    foto_url:
      "https://images.unsplash.com/photo-1714841197541-aa64d90cb6a8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    nombre: "Lucía Fernández",
    cargo: "Coach de alto rendimiento",
    descripcion:
      "Especialista en técnica y preparación para la competencia.",
    foto_url:
      "https://images.unsplash.com/photo-1545151414-8a948e1ea54f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    nombre: "Diego Sosa",
    cargo: "Coach escuela infantil",
    descripcion:
      "Apasionado por iniciar a los más chicos en el mundo del tenis.",
    foto_url:
      "https://images.unsplash.com/photo-1516742720271-6ae39cbc5bd1?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    nombre: "Carla Méndez",
    cargo: "Preparadora física",
    descripcion:
      "Diseña los planes físicos para que rindas al máximo en cancha.",
    foto_url:
      "https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?auto=format&fit=crop&w=600&q=80",
  },
];

export async function getCoaches(limit = 8): Promise<Coach[]> {
  const supabase = getSupabase();

  // Sin credenciales aún → datos mock.
  if (!supabase) {
    return MOCK_COACHES.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("coaches")
    .select("id, nombre, cargo, descripcion, foto_url")
    .eq("activo", true)
    .order("orden", { ascending: true })
    .limit(limit);

  // Ante cualquier problema (tabla inexistente, vacía, error de red) → mock.
  if (error || !data || data.length === 0) {
    if (error) {
      console.warn("[coaches] Supabase no disponible, usando mock:", error.message);
    }
    return MOCK_COACHES.slice(0, limit);
  }

  return data as Coach[];
}
