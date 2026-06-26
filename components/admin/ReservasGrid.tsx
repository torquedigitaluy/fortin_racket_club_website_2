"use client";

import { useTransition } from "react";
import { bloquearSlot, liberarSlot } from "@/app/admin/(panel)/reservas/actions";
import { CANCHAS, padHora } from "@/lib/disponibilidad";

/**
 * Grilla de reservas del admin para una fecha. Muestra cada turno por cancha y
 * permite bloquear los libres o liberar los ocupados/bloqueados.
 */
type Reserva = {
  id: number;
  cancha: string;
  hora: number;
  estado: string;
  nombre: string | null;
  email: string | null;
};

const HORAS = Array.from({ length: 14 }, (_, i) => 9 + i);

const ESTADO_COLOR: Record<string, string> = {
  reservado: "bg-brand text-white",
  pagado: "bg-lime text-white",
  bloqueado: "bg-gray-400 text-white",
};

export default function ReservasGrid({
  fecha,
  reservas,
}: {
  fecha: string;
  reservas: Reserva[];
}) {
  const [pending, startTransition] = useTransition();

  const byKey = new Map<string, Reserva>();
  for (const r of reservas) byKey.set(`${r.cancha}:${r.hora}`, r);

  function onCell(cancha: string, hora: number, existing?: Reserva) {
    startTransition(() => {
      if (existing) liberarSlot(existing.id);
      else bloquearSlot(cancha, fecha, hora);
    });
  }

  return (
    <div className="space-y-6">
      {CANCHAS.map((cancha) => (
        <div key={cancha}>
          <h3 className="mb-2 font-kanit text-lg font-bold text-brand">{cancha}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {HORAS.map((h) => {
              const r = byKey.get(`${cancha}:${h}`);
              const cls = r ? ESTADO_COLOR[r.estado] ?? "bg-brand text-white" : "bg-gray-100 text-brand";
              return (
                <button
                  key={h}
                  type="button"
                  disabled={pending}
                  onClick={() => onCell(cancha, h, r)}
                  title={r ? `${r.estado}${r.nombre ? ` — ${r.nombre}` : ""} (click para liberar)` : "Libre (click para bloquear)"}
                  className={`rounded-lg px-2 py-3 text-center font-mulish text-xs font-semibold transition-opacity disabled:opacity-50 ${cls}`}
                >
                  <span className="block">{padHora(h)}</span>
                  {r && <span className="block text-[10px] opacity-80">{r.estado}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-4 font-mulish text-xs text-brand/60">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-gray-100" /> Libre</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-brand" /> Reservado</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-lime" /> Pagado</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-gray-400" /> Bloqueado</span>
      </div>
    </div>
  );
}
