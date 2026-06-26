"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, DollarSign } from "lucide-react";
import { startCheckout } from "@/lib/checkout";
import { fetchOcupacion } from "@/lib/public-actions";
import { CANCHAS, padHora, type Ocupacion } from "@/lib/disponibilidad";

// Horarios de 09:00 a 22:00 (último turno termina 23:00).
const HORAS = Array.from({ length: 14 }, (_, i) => 9 + i);
type Cancha = (typeof CANCHAS)[number];

export default function ReservaCanchasClient({
  precioHora,
  fechaInicial,
  ocupacionInicial,
}: {
  precioHora: number;
  fechaInicial: string;
  ocupacionInicial: Ocupacion[];
}) {
  const [cancha, setCancha] = useState<Cancha>("Cancha 1");
  const [fecha, setFecha] = useState(fechaInicial);
  const [ocupacion, setOcupacion] = useState<Ocupacion[]>(ocupacionInicial);
  const [loading, setLoading] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const ocupados = new Set(
    ocupacion.filter((o) => o.cancha === cancha).map((o) => o.hora)
  );

  async function onFecha(nueva: string) {
    setFecha(nueva);
    setAviso(null);
    const data = await fetchOcupacion(nueva);
    setOcupacion(data);
  }

  async function reservar(hora: number) {
    setAviso(null);
    setLoading(hora);
    const status = await startCheckout({
      title: `Reserva ${cancha} ${padHora(hora)} — Fortín Racket Club`,
      price: precioHora,
      reference: `reserva-${cancha.replace(" ", "").toLowerCase()}-${fecha}-${hora}`,
      reserva: { cancha, fecha, hora },
    });
    setLoading(null);

    if (status === "taken") {
      setAviso("Ese turno acaba de ser reservado. Elegí otro horario.");
      const data = await fetchOcupacion(fecha);
      setOcupacion(data);
    } else if (status === "not_configured") {
      setAviso("La reserva con pago aún no está disponible. Mercado Pago se conectará pronto.");
      // En modo mock igualmente se registró la reserva (si hay service-role).
      const data = await fetchOcupacion(fecha);
      setOcupacion(data);
    } else if (status === "error") {
      setAviso("Hubo un problema al iniciar la reserva. Intentá de nuevo.");
    }
  }

  return (
    <section id="reservas" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <div className="mb-12 max-w-2xl">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-lime">
            Jugá hoy
          </span>
          <h2 className="mt-3 font-kanit text-3xl font-bold text-brand md:text-4xl">
            Reserva de canchas
          </h2>
          <p className="mt-4 font-mulish text-brand/70">
            Elegí tu cancha y horario. Reservá online y asegurá tu turno en
            segundos.
          </p>
        </div>

        {/* Fila superior: grid asimétrico (imagen + caja destacada) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative h-72 overflow-hidden rounded-2xl lg:col-span-2 lg:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80"
              alt="Ambiente del club de tenis"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-6 rounded-2xl bg-brand p-8 text-white">
            <div>
              <span className="flex items-center gap-2 font-mulish text-sm uppercase tracking-widest text-lime">
                <Clock className="h-4 w-4" /> Horarios
              </span>
              <p className="mt-2 font-kanit text-4xl font-bold">09:00 – 23:00</p>
              <p className="mt-1 font-mulish text-sm text-white/60">Todos los días</p>
            </div>
            <div className="h-px bg-white/15" />
            <div>
              <span className="flex items-center gap-2 font-mulish text-sm uppercase tracking-widest text-lime">
                <DollarSign className="h-4 w-4" /> Precio por hora
              </span>
              <p className="mt-2 font-kanit text-5xl font-bold">${precioHora}</p>
            </div>
          </div>
        </div>

        {/* Fila inferior: reservar cancha */}
        <div className="mt-8 rounded-2xl border border-brand/10 bg-offwhite p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="font-kanit text-xl font-bold text-brand">
                Elegí tu horario
              </h3>
              <input
                type="date"
                value={fecha}
                onChange={(e) => onFecha(e.target.value)}
                className="rounded-full border border-brand/20 bg-white px-4 py-2 font-mulish text-sm text-brand outline-none focus:border-brand"
              />
            </div>
            <div className="inline-flex rounded-full bg-white p-1 shadow-sm">
              {CANCHAS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCancha(c)}
                  className={`rounded-full px-5 py-2 font-mulish text-sm font-semibold transition-colors ${
                    cancha === c
                      ? "bg-brand text-white"
                      : "text-brand/70 hover:text-brand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {HORAS.map((h) => {
              const disponible = !ocupados.has(h);
              const cargando = loading === h;
              return (
                <button
                  key={h}
                  type="button"
                  disabled={!disponible || cargando}
                  onClick={() => reservar(h)}
                  className={`rounded-xl px-3 py-3 font-mulish text-sm font-semibold transition-all ${
                    disponible
                      ? "bg-brand text-white hover:scale-105 hover:bg-brand/90"
                      : "cursor-not-allowed bg-gray-200 text-gray-400 line-through"
                  } ${cargando ? "opacity-60" : ""}`}
                  aria-label={
                    disponible
                      ? `Reservar ${cancha} a las ${padHora(h)}`
                      : `${padHora(h)} no disponible`
                  }
                >
                  {cargando ? "…" : padHora(h)}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 font-mulish text-xs text-brand/60">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-brand" /> Disponible
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-gray-200" /> No disponible
            </span>
          </div>

          {aviso && (
            <p className="mt-6 font-mulish text-sm text-brand/70">{aviso}</p>
          )}
        </div>
      </div>
    </section>
  );
}
