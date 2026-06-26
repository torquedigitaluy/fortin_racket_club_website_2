import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/resources";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/admin/DeleteButton";

/**
 * Listado genérico de una colección. La ruta /admin/[resource] usa el registry
 * para saber qué tabla leer y qué columna mostrar como título.
 */
export default async function ResourceListPage({
  params,
}: {
  params: { resource: string };
}) {
  const resource = getResource(params.resource);
  if (!resource) notFound();

  const supabase = createClient();

  let rows: Record<string, unknown>[] = [];
  let sinConexion = false;

  if (supabase) {
    const { data, error } = await supabase
      .from(resource.table)
      .select("*")
      .order(resource.orderBy.column, {
        ascending: resource.orderBy.ascending,
      });
    if (error) sinConexion = true;
    else rows = data ?? [];
  } else {
    sinConexion = true;
  }

  const primary =
    resource.fields.find((f) => f.primary)?.name ?? resource.fields[0]?.name;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-kanit text-3xl font-bold text-brand">
          {resource.label}
        </h1>
        <Link
          href={`/admin/${params.resource}/new`}
          className="rounded-full bg-brand px-5 py-2.5 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          + Nuevo
        </Link>
      </div>

      {sinConexion && (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 font-mulish text-sm text-amber-800">
          Supabase no está configurado o la tabla aún no existe. Configurá las
          credenciales y aplicá las migraciones para gestionar este contenido.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-brand/10 bg-white">
        {rows.length === 0 ? (
          <p className="px-6 py-8 text-center font-mulish text-sm text-brand/50">
            No hay registros todavía.
          </p>
        ) : (
          <ul className="divide-y divide-brand/10">
            {rows.map((row) => (
              <li
                key={String(row.id)}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <span className="truncate font-mulish text-sm text-brand">
                  {String(row[primary] ?? `#${row.id}`)}
                  {row.activo === false && (
                    <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-brand/50">
                      inactivo
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-4">
                  <Link
                    href={`/admin/${params.resource}/${row.id}`}
                    className="font-mulish text-sm text-brand hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    resourceKey={params.resource}
                    id={row.id as string | number}
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
