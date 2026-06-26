"use client";

import { useTransition } from "react";
import { deleteRecord } from "@/lib/admin/crud";

/**
 * Botón de borrado con confirmación. Llama a la server action deleteRecord y
 * refresca la lista vía revalidatePath.
 */
export default function DeleteButton({
  resourceKey,
  id,
}: {
  resourceKey: string;
  id: string | number;
}) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) {
      return;
    }
    startTransition(() => {
      deleteRecord(resourceKey, String(id));
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="font-mulish text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
