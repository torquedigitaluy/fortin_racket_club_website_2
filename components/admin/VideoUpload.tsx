"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/storage";

/**
 * Campo de subida de video. Sube el archivo al bucket `media` y guarda la URL
 * pública en un input oculto (`name`) que consume el formulario del CMS.
 * También permite pegar una URL manual. Espejo de ImageUpload pero para video.
 */
export default function VideoUpload({
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
        <video
          src={url}
          muted
          loop
          playsInline
          controls
          className="h-32 w-56 rounded-lg border border-brand/10 object-cover"
        />
      )}

      <input type="hidden" name={name} value={url} required={required} />

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-lg bg-brand px-4 py-2 font-mulish text-xs font-semibold text-white">
          {subiendo ? "Subiendo…" : "Subir video"}
          <input
            type="file"
            accept="video/*"
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

      <p className="font-mulish text-xs text-brand/50">
        Usá un clip corto y comprimido (máx. ~50 MB). Se reproduce en loop, sin
        sonido.
      </p>

      {error && <p className="font-mulish text-xs text-red-600">{error}</p>}
    </div>
  );
}
