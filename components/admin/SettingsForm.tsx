"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { SETTINGS_GROUPS, type Settings } from "@/lib/settings";
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
          {group.fields.map((f) =>
            f.image ? (
              <ImageUpload
                key={f.key}
                name={f.key}
                label={f.label}
                defaultValue={settings[f.key] ?? ""}
              />
            ) : f.video ? (
              <VideoUpload
                key={f.key}
                name={f.key}
                label={f.label}
                defaultValue={settings[f.key] ?? ""}
              />
            ) : (
              <label key={f.key} className="flex flex-col gap-1">
                <span className="font-mulish text-sm text-brand">{f.label}</span>
                {f.select ? (
                  <select
                    name={f.key}
                    defaultValue={settings[f.key] ?? ""}
                    className={inputCls}
                    onChange={() => setGuardado(false)}
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
            )
          )}
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
