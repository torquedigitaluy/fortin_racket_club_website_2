import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/resources";
import { createClient } from "@/lib/supabase/server";
import ResourceForm from "@/components/admin/ResourceForm";

/**
 * Alta (id = "new") o edición de un registro de la colección.
 */
export default async function ResourceEditPage({
  params,
}: {
  params: { resource: string; id: string };
}) {
  const resource = getResource(params.resource);
  if (!resource) notFound();

  const nuevo = params.id === "new";
  let record: Record<string, unknown> | null = null;

  if (!nuevo) {
    const supabase = createClient();
    if (supabase) {
      const { data } = await supabase
        .from(resource.table)
        .select("*")
        .eq("id", params.id)
        .single();
      record = data ?? null;
    }
    if (!record) notFound();
  }

  return (
    <div>
      <Link
        href={`/admin/${params.resource}`}
        className="font-mulish text-sm text-brand/60 hover:text-brand"
      >
        ← {resource.label}
      </Link>
      <h1 className="mb-6 mt-2 font-kanit text-3xl font-bold text-brand">
        {nuevo ? `Nuevo ${resource.singular}` : `Editar ${resource.singular}`}
      </h1>

      <ResourceForm
        resourceKey={params.resource}
        resource={resource}
        id={params.id}
        record={record}
      />
    </div>
  );
}
