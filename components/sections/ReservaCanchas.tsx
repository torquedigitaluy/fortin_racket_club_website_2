import { getSettings } from "@/lib/settings";
import { getOcupacion } from "@/lib/disponibilidad";
import ReservaCanchasClient from "./ReservaCanchasClient";

/**
 * Server wrapper: trae el precio por hora (ajustes) y la ocupación de hoy, y se
 * los pasa al componente cliente que maneja la interacción (selector de fecha,
 * cancha y reserva con pago).
 */
export default async function ReservaCanchas() {
  const settings = await getSettings();
  const precioHora = Number(settings.reservas_precio_hora) || 999;

  const hoy = new Date().toISOString().slice(0, 10);
  const ocupacion = await getOcupacion(hoy);

  return (
    <ReservaCanchasClient
      precioHora={precioHora}
      fechaInicial={hoy}
      ocupacionInicial={ocupacion}
    />
  );
}
