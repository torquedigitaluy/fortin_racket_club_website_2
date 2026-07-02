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
  imagenUrl,
  imagenMovilUrl,
  imagenAlt,
}: {
  precioHora: number;
  fechaInicial: string;
  ocupacionInicial: Ocupacion[];
  imagenUrl: string;
  imagenMovilUrl?: string;
  imagenAlt: string;
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
    <section id="reservas" className="bg-brand py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <div className="mb-12 max-w-2xl">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-white">
            Jugá hoy
          </span>
          <h2 className="mt-3 font-kanit text-3xl font-bold text-white md:text-4xl">
            Reserva de canchas
          </h2>
          <p className="mt-4 font-mulish text-white/70">
            Elegí tu cancha y horario. Reservá online y asegurá tu turno en
            segundos.
          </p>
        </div>

        {/* Fila superior: grid asimétrico (imagen + caja destacada) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative h-72 overflow-hidden rounded-2xl lg:col-span-2 lg:h-auto">
            {imagenMovilUrl && (
              <Image
                src={imagenMovilUrl}
                alt={imagenAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                unoptimized
                className="object-cover lg:hidden"
              />
            )}
            <Image
              src={imagenUrl}
              alt={imagenAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              unoptimized
              className={`object-cover ${imagenMovilUrl ? "hidden lg:block" : ""}`}
            />
          </div>

          <div className="flex flex-col justify-center gap-6 rounded-2xl bg-white p-8 text-brand">
            <div>
              <span className="flex items-center gap-2 font-mulish text-sm uppercase tracking-widest text-lime">
                <Clock className="h-4 w-4" /> Horarios
              </span>
              <p className="mt-2 font-kanit text-4xl font-bold">09:00 – 23:00</p>
              <p className="mt-1 font-mulish text-sm text-brand/60">Todos los días</p>
            </div>
            <div className="h-px bg-brand/15" />
            <div>
              <span className="flex items-center gap-2 font-mulish text-sm uppercase tracking-widest text-lime">
                <DollarSign className="h-4 w-4" /> Precio por hora
              </span>
              <p className="mt-2 font-kanit text-5xl font-bold">${precioHora}</p>
            </div>
          </div>
        </div>

        {/* Fila inferior: reservar cancha */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-brand-dark p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="font-kanit text-xl font-bold text-white">
                Elegí tu horario
              </h3>
              <input
                type="date"
                value={fecha}
                onChange={(e) => onFecha(e.target.value)}
                className="rounded-full border border-white/20 bg-brand px-4 py-2 font-mulish text-sm text-white outline-none focus:border-white"
              />
            </div>
            <div className="inline-flex rounded-full bg-brand p-1 shadow-sm">
              {CANCHAS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCancha(c)}
                  className={`rounded-full px-5 py-2 font-mulish text-sm font-semibold transition-colors ${
                    cancha === c
                      ? "bg-white text-brand"
                      : "text-white/70 hover:text-white"
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
                      ? "bg-white text-brand hover:scale-105 hover:bg-white/90"
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

          <div className="mt-6 flex flex-wrap items-center gap-6 font-mulish text-xs text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-white" /> Disponible
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-gray-200" /> No disponible
            </span>
          </div>

          {aviso && (
            <p className="mt-6 font-mulish text-sm text-white/70">{aviso}</p>
          )}
        </div>
      </div>
    </section>
  );
}
