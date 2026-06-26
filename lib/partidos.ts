import { getSupabase } from "./supabase";

/**
 * Agenda de partidos del Torneo & Calendario.
 *
 * Tabla esperada en Supabase (crear cuando esté el proyecto):
 *
 *   create table partidos (
 *     id        bigint generated always as identity primary key,
 *     fecha     timestamptz not null,
 *     jugadores text not null,            -- ej: "J. Pérez vs M. Torres"
 *     cancha    text not null,            -- ej: "Cancha 1"
 *     created_at timestamptz default now()
 *   );
 *
 * Mientras no existan las variables de entorno de Supabase (o la tabla esté
 * vacía / falle la consulta) se devuelven los datos mock de abajo.
 */
export type Partido = {
  id: string | number;
  fecha: string; // ISO 8601
  jugadores: string;
  cancha: string;
};

const MOCK_PARTIDOS: Partido[] = [
  {
    id: 1,
    fecha: "2026-06-27T18:00:00",
    jugadores: "J. Pérez vs M. Torres",
    cancha: "Cancha 1",
  },
  {
    id: 2,
    fecha: "2026-06-28T10:30:00",
    jugadores: "L. Gómez vs A. Ruiz",
    cancha: "Cancha 2",
  },
  {
    id: 3,
    fecha: "2026-06-28T19:00:00",
    jugadores: "C. Díaz vs F. Romero",
    cancha: "Cancha 1",
  },
  {
    id: 4,
    fecha: "2026-06-29T17:30:00",
    jugadores: "S. Vega vs P. Castro",
    cancha: "Cancha 2",
  },
];

export async function getProximosPartidos(limit = 4): Promise<Partido[]> {
  const supabase = getSupabase();

  // Sin credenciales aún → datos mock.
  if (!supabase) {
    return MOCK_PARTIDOS.slice(0, limit);
  }

  const { data, error } = await supabase
    .from("partidos")
    .select("id, fecha, jugadores, cancha")
    .eq("activo", true)
    .order("fecha", { ascending: true })
    .limit(limit);

  // Ante cualquier problema (tabla inexistente, vacía, error de red) → mock,
  // para que la UI nunca quede rota durante el desarrollo.
  if (error || !data || data.length === 0) {
    if (error) {
      console.warn("[partidos] Supabase no disponible, usando mock:", error.message);
    }
    return MOCK_PARTIDOS.slice(0, limit);
  }

  return data as Partido[];
}
