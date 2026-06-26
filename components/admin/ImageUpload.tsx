"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadMedia } from "@/lib/storage";

/**
 * Campo de subida de imagen. Sube el archivo al bucket `media` y guarda la URL
 * pública en un input oculto (`name`) que consume el formulario del CMS.
 * También permite pegar una URL manual.
 */
export default function ImageUpload({
  name,
  label,
  defaultValue = "",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSubiendo(true);
    try {
      const publicUrl = await uploadMedia(file, name);
      setUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mulish text-sm text-brand">{label}</span>

      {url && (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-brand/10">
          <Image src={url} alt="" fill sizes="128px" className="object-cover" />
        </div>
      )}

      <input type="hidden" name={name} value={url} required={required} />

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-lg bg-brand px-4 py-2 font-mulish text-xs font-semibold text-white">
          {subiendo ? "Subiendo…" : "Subir imagen"}
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            disabled={subiendo}
            className="hidden"
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="font-mulish text-xs text-brand/60 underline"
          >
            Quitar
          </button>
        )}
      </div>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="o pegá una URL…"
        className="rounded-lg border border-brand/20 px-3 py-2 font-mulish text-sm text-brand outline-none focus:border-brand"
      />

      {error && <p className="font-mulish text-xs text-red-600">{error}</p>}
    </div>
  );
}
