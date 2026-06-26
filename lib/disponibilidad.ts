import { getSupabase } from "./supabase";

/**
 * Disponibilidad de canchas. Lee los turnos ocupados de una fecha vía el RPC
 * `get_ocupacion` (que no expone datos personales del reservante).
 *
 * Sin credenciales → mock para que la grilla muestre algunos turnos ocupados
 * durante el desarrollo (mismo espíritu que NO_DISPONIBLES original).
 */
export type Ocupacion = {
  cancha: string;
  hora: number;
  estado: string;
};

/** Canchas del club (valor de dominio compartido por la web y el admin). */
export const CANCHAS = ["Cancha 1", "Cancha 2"] as const;

/** Formatea una hora entera a "HH:00". */
export function padHora(h: number): string {
  return `${h < 10 ? `0${h}` : h}:00`;
}

const MOCK_OCUPACION: Ocupacion[] = [
  { cancha: "Cancha 1", hora: 10, estado: "reservado" },
  { cancha: "Cancha 1", hora: 13, estado: "reservado" },
  { cancha: "Cancha 1", hora: 17, estado: "bloqueado" },
  { cancha: "Cancha 2", hora: 9, estado: "reservado" },
  { cancha: "Cancha 2", hora: 12, estado: "reservado" },
  { cancha: "Cancha 2", hora: 19, estado: "reservado" },
];

export async function getOcupacion(fecha: string): Promise<Ocupacion[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_OCUPACION;

  const { data, error } = await supabase.rpc("get_ocupacion", { p_fecha: fecha });

  if (error || !data) {
    if (error) {
      console.warn("[disponibilidad] Supabase no disponible, usando mock:", error.message);
    }
    return MOCK_OCUPACION;
  }

  return data as Ocupacion[];
}
