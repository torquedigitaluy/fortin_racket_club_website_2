import { getPlanesAdmin } from "@/lib/planes";
import PlanesEditor from "@/components/admin/PlanesEditor";

/**
 * Editor de planes de socio (matriz planes × ventajas).
 */
export default async function PlanesAdminPage() {
  const data = await getPlanesAdmin();

  return (
    <div>
      <h1 className="mb-2 font-kanit text-3xl font-bold text-brand">
        Planes de socio
      </h1>
      <p className="mb-8 font-mulish text-brand/60">
        Definí los planes, sus precios y qué ventajas incluye cada uno.
      </p>

      {data === null && (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 font-mulish text-sm text-amber-800">
          Supabase no está configurado o las tablas aún no existen. El sitio
          muestra los planes de ejemplo hasta que cargues datos.
        </p>
      )}

      <PlanesEditor data={data} />
    </div>
  );
}
