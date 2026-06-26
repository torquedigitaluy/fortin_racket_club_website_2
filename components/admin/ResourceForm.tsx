"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import type { Field, Resource } from "@/lib/admin/resources";
import { saveRecord } from "@/lib/admin/crud";
import ImageUpload from "./ImageUpload";

/**
 * Formulario genérico de alta/edición construido a partir del esquema de campos
 * del recurso. La server action `saveRecord` se ata con bind al recurso e id.
 */

function SubmitButton({ nuevo }: { nuevo: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand px-6 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
    >
      {pending ? "Guardando…" : nuevo ? "Crear" : "Guardar cambios"}
    </button>
  );
}

function FieldInput({
  field,
  value,
}: {
  field: Field;
  value: unknown;
}) {
  const baseInput =
    "rounded-lg border border-brand/20 px-3 py-2 font-mulish text-sm text-brand outline-none focus:border-brand";

  if (field.type === "image") {
    return (
      <ImageUpload
        name={field.name}
        label={field.label}
        defaultValue={value ? String(value) : ""}
        required={field.required}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 font-mulish text-sm text-brand">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={value === true || value === "true"}
          className="h-4 w-4"
        />
        {field.label}
      </label>
    );
  }

  const labelEl = (
    <span className="font-mulish text-sm text-brand">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </span>
  );

  if (field.type === "select") {
    return (
      <label className="flex flex-col gap-1">
        {labelEl}
        <select
          name={field.name}
          defaultValue={value ? String(value) : field.options?.[0]?.value ?? ""}
          className={baseInput}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="flex flex-col gap-1">
        {labelEl}
        <textarea
          name={field.name}
          defaultValue={value ? String(value) : ""}
          required={field.required}
          rows={3}
          className={baseInput}
        />
      </label>
    );
  }

  // datetime → input datetime-local (recibe ISO, recorta a yyyy-MM-ddTHH:mm)
  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "datetime"
        ? "datetime-local"
        : "text";

  const inputValue =
    field.type === "datetime" && value
      ? String(value).slice(0, 16)
      : value != null
        ? String(value)
        : "";

  return (
    <label className="flex flex-col gap-1">
      {labelEl}
      <input
        type={inputType}
        name={field.name}
        defaultValue={inputValue}
        required={field.required}
        className={baseInput}
      />
      {field.help && (
        <span className="font-mulish text-xs text-brand/50">{field.help}</span>
      )}
    </label>
  );
}

export default function ResourceForm({
  resourceKey,
  resource,
  id,
  record,
}: {
  resourceKey: string;
  resource: Resource;
  id: string;
  record: Record<string, unknown> | null;
}) {
  const nuevo = id === "new";
  const action = saveRecord.bind(null, resourceKey, id);

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      {resource.fields.map((field) => (
        <FieldInput key={field.name} field={field} value={record?.[field.name]} />
      ))}

      <div className="mt-2 flex items-center gap-4">
        <SubmitButton nuevo={nuevo} />
        <Link
          href={`/admin/${resourceKey}`}
          className="font-mulish text-sm text-brand/60 hover:text-brand"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
