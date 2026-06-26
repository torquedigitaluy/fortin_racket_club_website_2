import { createClient } from "@/lib/supabase/server";
import ReservasGrid from "@/components/admin/ReservasGrid";

/**
 * Gestión de reservas por fecha. El admin elige el día (querystring ?fecha=),
 * ve la grilla por cancha y puede bloquear/liberar turnos.
 */
export default async function ReservasPage({
  searchParams,
}: {
  searchParams: { fecha?: string };
}) {
  const hoy = new Date().toISOString().slice(0, 10);
  const fecha = searchParams.fecha ?? hoy;

  const supabase = createClient();
  let reservas: Parameters<typeof ReservasGrid>[0]["reservas"] = [];
  let sinConexion = false;

  if (supabase) {
    const { data, error } = await supabase
      .from("reservas")
      .select("id, cancha, hora, estado, nombre, email")
      .eq("fecha", fecha)
      .order("hora", { ascending: true });
    if (error) sinConexion = true;
    else reservas = data ?? [];
  } else {
    sinConexion = true;
  }

  return (
    <div>
      <h1 className="mb-2 font-kanit text-3xl font-bold text-brand">Reservas</h1>
      <p className="mb-6 font-mulish text-brand/60">
        Elegí una fecha para ver y administrar los turnos.
      </p>

      <form method="get" className="mb-8 flex items-center gap-3">
        <input
          type="date"
          name="fecha"
          defaultValue={fecha}
          className="rounded-lg border border-brand/20 px-3 py-2 font-mulish text-sm text-brand outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2 font-mulish text-sm font-semibold text-white"
        >
          Ver
        </button>
      </form>

      {sinConexion && (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 font-mulish text-sm text-amber-800">
          Supabase no está configurado o la tabla aún no existe. Configurá las
          credenciales y aplicá las migraciones para gestionar reservas.
        </p>
      )}

      <ReservasGrid fecha={fecha} reservas={reservas} />
    </div>
  );
}
