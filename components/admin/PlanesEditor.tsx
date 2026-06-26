"use client";

import { useState, useTransition } from "react";
import { Check, Trash2, Plus } from "lucide-react";
import type { PlanesAdminData } from "@/lib/planes";
import {
  savePlanes,
  type FeatureInput,
  type PlanInput,
} from "@/app/admin/(panel)/planes/actions";

/**
 * Editor de la matriz planes × features. Mantiene todo en estado local y guarda
 * con una sola server action. Las filas nuevas usan una `key` temporal (id null).
 */

let counter = 0;
const tmpKey = () => `tmp-${counter++}`;

export default function PlanesEditor({ data }: { data: PlanesAdminData | null }) {
  const [features, setFeatures] = useState<FeatureInput[]>(
    (data?.features ?? []).map((f) => ({
      key: `f-${f.id}`,
      id: f.id,
      label: f.label,
      orden: f.orden,
      activo: f.activo,
    }))
  );
  const [planes, setPlanes] = useState<PlanInput[]>(
    (data?.planes ?? []).map((p) => ({
      key: `p-${p.id}`,
      id: p.id,
      nombre: p.nombre,
      precio: Number(p.precio),
      destacado: p.destacado,
      orden: p.orden,
      activo: p.activo,
    }))
  );
  const [matrix, setMatrix] = useState<Set<string>>(
    new Set(
      (data?.values ?? [])
        .filter((v) => v.incluido)
        .map((v) => `p-${v.plan_id}:f-${v.feature_id}`)
    )
  );

  const [pending, startTransition] = useTransition();
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(planKey: string, featKey: string) {
    const k = `${planKey}:${featKey}`;
    setMatrix((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
    setGuardado(false);
  }

  function addFeature() {
    setFeatures((p) => [
      ...p,
      { key: tmpKey(), id: null, label: "Nueva ventaja", orden: p.length, activo: true },
    ]);
  }
  function addPlan() {
    setPlanes((p) => [
      ...p,
      { key: tmpKey(), id: null, nombre: "Nuevo plan", precio: 0, destacado: false, orden: p.length, activo: true },
    ]);
  }

  function onSave() {
    setError(null);
    startTransition(async () => {
      try {
        await savePlanes({ features, planes, matrix: Array.from(matrix) });
        setGuardado(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    });
  }

  const inputCls =
    "rounded border border-brand/20 px-2 py-1 font-mulish text-sm text-brand outline-none focus:border-brand";

  return (
    <div className="flex flex-col gap-8">
      {/* Planes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-kanit text-lg font-bold text-brand">Planes</h2>
          <button onClick={addPlan} type="button" className="flex items-center gap-1 font-mulish text-sm text-brand hover:underline">
            <Plus className="h-4 w-4" /> Agregar plan
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {planes.map((p, i) => (
            <div key={p.key} className="flex flex-wrap items-center gap-2 rounded-lg border border-brand/10 bg-white p-3">
              <input className={`${inputCls} w-40`} value={p.nombre}
                onChange={(e) => { const v = e.target.value; setPlanes((a) => a.map((x, j) => j === i ? { ...x, nombre: v } : x)); setGuardado(false); }} />
              <span className="font-mulish text-sm text-brand/50">$</span>
              <input type="number" className={`${inputCls} w-24`} value={p.precio}
                onChange={(e) => { const v = Number(e.target.value); setPlanes((a) => a.map((x, j) => j === i ? { ...x, precio: v } : x)); setGuardado(false); }} />
              <label className="flex items-center gap-1 font-mulish text-sm text-brand">
                <input type="checkbox" checked={p.destacado}
                  onChange={(e) => { const v = e.target.checked; setPlanes((a) => a.map((x, j) => j === i ? { ...x, destacado: v } : x)); setGuardado(false); }} />
                Destacado
              </label>
              <label className="flex items-center gap-1 font-mulish text-sm text-brand">
                <input type="checkbox" checked={p.activo}
                  onChange={(e) => { const v = e.target.checked; setPlanes((a) => a.map((x, j) => j === i ? { ...x, activo: v } : x)); setGuardado(false); }} />
                Activo
              </label>
              <button type="button" className="ml-auto text-red-600"
                onClick={() => { setPlanes((a) => a.filter((_, j) => j !== i)); setGuardado(false); }}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features + matriz */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-kanit text-lg font-bold text-brand">Ventajas y matriz</h2>
          <button onClick={addFeature} type="button" className="flex items-center gap-1 font-mulish text-sm text-brand hover:underline">
            <Plus className="h-4 w-4" /> Agregar ventaja
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-brand/10 bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-brand/10">
                <th className="p-3 text-left font-mulish text-sm font-semibold text-brand">Ventaja</th>
                {planes.map((p) => (
                  <th key={p.key} className="p-3 text-center font-mulish text-sm font-semibold text-brand">
                    {p.nombre || "—"}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={f.key} className="border-b border-brand/5">
                  <td className="p-3">
                    <input className={`${inputCls} w-full min-w-[12rem]`} value={f.label}
                      onChange={(e) => { const v = e.target.value; setFeatures((a) => a.map((x, j) => j === i ? { ...x, label: v } : x)); setGuardado(false); }} />
                  </td>
                  {planes.map((p) => {
                    const on = matrix.has(`${p.key}:${f.key}`);
                    return (
                      <td key={p.key} className="p-3 text-center">
                        <button type="button" onClick={() => toggle(p.key, f.key)}
                          className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full transition-colors ${on ? "bg-lime text-white" : "bg-gray-100 text-gray-300"}`}>
                          <Check className="h-4 w-4" />
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <button type="button" className="text-red-600"
                      onClick={() => { setFeatures((a) => a.filter((_, j) => j !== i)); setGuardado(false); }}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button type="button" onClick={onSave} disabled={pending}
          className="rounded-full bg-brand px-6 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60">
          {pending ? "Guardando…" : "Guardar planes"}
        </button>
        {guardado && <span className="font-mulish text-sm text-lime">✓ Guardado</span>}
        {error && <span className="font-mulish text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
