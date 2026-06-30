"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { SETTINGS_GROUPS, type Settings, type SettingsField } from "@/lib/settings";
import { saveSettings } from "@/app/admin/(panel)/ajustes/actions";
import ImageUpload from "./ImageUpload";
import VideoUpload from "./VideoUpload";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand px-6 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
    >
      {pending ? "Guardando…" : "Guardar ajustes"}
    </button>
  );
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [guardado, setGuardado] = useState(false);
  // Valores en vivo de los campos de los que dependen otros (ej. hero_modo),
  // para poder mostrar/ocultar campos sin recargar el formulario.
  const [liveValues, setLiveValues] = useState<Settings>(settings);

  function setLive(key: string, value: string) {
    setLiveValues((prev) => ({ ...prev, [key]: value }));
    setGuardado(false);
  }

  function isVisible(f: SettingsField) {
    if (!f.dependsOn) return true;
    return liveValues[f.dependsOn.key] === f.dependsOn.value;
  }

  async function action(formData: FormData) {
    await saveSettings(formData);
    setGuardado(true);
  }

  const inputCls =
    "rounded-lg border border-brand/20 px-3 py-2 font-mulish text-sm text-brand outline-none focus:border-brand";

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-8">
      {SETTINGS_GROUPS.map((group) => (
        <fieldset key={group.label} className="flex flex-col gap-4">
          <legend className="font-kanit text-lg font-bold text-brand">
            {group.label}
          </legend>
          {group.fields.map((f) => (
            // Los campos no visibles se ocultan con CSS (no se desmontan): así
            // los inputs ocultos de imagen/video conservan su valor al guardar,
            // aunque el modo elegido no los muestre ahora mismo.
            <div key={f.key} className={isVisible(f) ? "" : "hidden"}>
              {f.info ? (
                <div className="rounded-lg border border-brand/15 bg-brand/5 px-4 py-3">
                  <p className="font-mulish text-sm text-brand">{f.label}</p>
                  <p className="mt-1 font-mulish text-sm text-brand/70">{f.info}</p>
                  {f.infoLink && (
                    <Link
                      href={f.infoLink.href}
                      className="mt-2 inline-block font-mulish text-sm font-semibold text-brand underline hover:text-brand/80"
                    >
                      {f.infoLink.label}
                    </Link>
                  )}
                </div>
              ) : f.image ? (
                <ImageUpload
                  name={f.key}
                  label={f.label}
                  defaultValue={settings[f.key] ?? ""}
                />
              ) : f.video ? (
                <VideoUpload
                  name={f.key}
                  label={f.label}
                  defaultValue={settings[f.key] ?? ""}
                />
              ) : (
                <label className="flex flex-col gap-1">
                  <span className="font-mulish text-sm text-brand">{f.label}</span>
                  {f.select ? (
                    <select
                      name={f.key}
                      defaultValue={settings[f.key] ?? ""}
                      className={inputCls}
                      onChange={(e) => setLive(f.key, e.target.value)}
                    >
                      {f.select.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : f.multiline ? (
                    <textarea
                      name={f.key}
                      defaultValue={settings[f.key] ?? ""}
                      rows={3}
                      className={inputCls}
                      onChange={() => setGuardado(false)}
                    />
                  ) : (
                    <input
                      type="text"
                      name={f.key}
                      defaultValue={settings[f.key] ?? ""}
                      className={inputCls}
                      onChange={() => setGuardado(false)}
                    />
                  )}
                </label>
              )}
            </div>
          ))}
        </fieldset>
      ))}

      <div className="flex items-center gap-4">
        <SubmitButton />
        {guardado && (
          <span className="font-mulish text-sm text-lime">✓ Guardado</span>
        )}
      </div>
    </form>
  );
}
