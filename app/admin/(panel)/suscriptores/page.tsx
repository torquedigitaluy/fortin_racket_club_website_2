import { createClient } from "@/lib/supabase/server";

/**
 * Listado de suscriptores del newsletter (solo lectura).
 */
export default async function SuscriptoresPage() {
  const supabase = createClient();
  let rows: { id: number; email: string; created_at: string }[] = [];
  let sinConexion = false;

  if (supabase) {
    const { data, error } = await supabase
      .from("suscriptores")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });
    if (error) sinConexion = true;
    else rows = data ?? [];
  } else {
    sinConexion = true;
  }

  return (
    <div>
      <h1 className="mb-2 font-kanit text-3xl font-bold text-brand">
        Suscriptores
      </h1>
      <p className="mb-6 font-mulish text-brand/60">
        {rows.length} suscripto{rows.length === 1 ? "" : "s"} al newsletter.
      </p>

      {sinConexion && (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 font-mulish text-sm text-amber-800">
          Supabase no está configurado o la tabla aún no existe.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-brand/10 bg-white">
        {rows.length === 0 ? (
          <p className="px-6 py-8 text-center font-mulish text-sm text-brand/50">
            Todavía no hay suscriptores.
          </p>
        ) : (
          <ul className="divide-y divide-brand/10">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between px-6 py-3 font-mulish text-sm text-brand"
              >
                <span>{r.email}</span>
                <span className="text-brand/40">
                  {new Date(r.created_at).toLocaleDateString("es-AR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
