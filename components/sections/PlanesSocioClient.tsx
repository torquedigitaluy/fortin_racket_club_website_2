"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { startCheckout } from "@/lib/checkout";
import type { PlanPublico } from "@/lib/planes";

export default function PlanesSocioClient({
  features,
  planes,
  bgUrl,
  destacadoBgUrl,
}: {
  features: string[];
  planes: PlanPublico[];
  bgUrl: string;
  destacadoBgUrl: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function comprar(plan: PlanPublico) {
    setAviso(null);
    setLoading(plan.nombre);
    const status = await startCheckout({
      title: `Membresía ${plan.nombre} — Fortín Racket Club`,
      price: plan.precio,
      reference: `socio-${plan.nombre.toLowerCase()}`,
    });
    setLoading(null);

    if (status === "not_configured") {
      setAviso("El pago aún no está disponible. Mercado Pago se conectará pronto.");
    } else if (status === "error") {
      setAviso("Hubo un problema al iniciar el pago. Intentá de nuevo.");
    }
    // "redirect" → el navegador ya se está yendo a Mercado Pago.
  }

  return (
    <section id="socios" className="relative overflow-hidden py-20 md:py-28">
      {/* Fondo de cancha de polvo de ladrillo (igual que el CTA banner) */}
      <Image
        src={bgUrl}
        alt=""
        fill
        sizes="100vw"
        unoptimized
        className="object-cover"
      />
      <div className="absolute inset-0 bg-clay/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-brand">
            Hacete socio
          </span>
          <h2 className="mt-3 font-kanit text-3xl font-bold text-brand md:text-4xl">
            Planes de Socio
          </h2>
          <p className="mt-4 font-mulish text-brand/80">
            Elegí el plan que mejor se adapta a tu juego. Cambiá o cancelá cuando
            quieras.
          </p>
        </div>

        {/* Grid de planes */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {planes.map((plan) => {
            const destacado = plan.destacado;
            return (
              <article
                key={plan.nombre}
                className={`relative flex flex-col overflow-hidden rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-2 ${
                  destacado
                    ? "text-brand shadow-2xl lg:-my-4"
                    : "bg-brand text-white"
                }`}
              >
                {/* Fondo de la tarjeta destacada: raqueta + pelota con overlay blanco 75% */}
                {destacado && (
                  <>
                    <Image
                      src={destacadoBgUrl}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-white/75" />
                    {/* Badge "Recomendado" */}
                    <span className="absolute right-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 font-mulish text-xs font-bold uppercase tracking-wide text-brand shadow">
                      Recomendado
                    </span>
                  </>
                )}

                <div className="relative z-10 flex flex-1 flex-col">
                  {/* Nombre + precio */}
                  <h3 className="font-kanit text-xl font-bold">{plan.nombre}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-kanit text-5xl font-bold">
                      ${plan.precio}
                    </span>
                    <span
                      className={`font-mulish text-sm ${
                        destacado ? "text-brand/70" : "text-white/60"
                      }`}
                    >
                      /mes
                    </span>
                  </div>

                  {/* Ventajas */}
                  <ul className="mt-8 flex-1 space-y-3">
                    {features.map((feature, i) => {
                      const incluido = plan.incluye[i];
                      return (
                        <li
                          key={feature}
                          className="flex items-center gap-3 font-mulish text-sm"
                        >
                          {incluido ? (
                            <Check className="h-5 w-5 flex-shrink-0 text-lime" />
                          ) : (
                            <X
                              className={`h-5 w-5 flex-shrink-0 ${
                                destacado ? "text-brand/40" : "text-gray-300"
                              }`}
                            />
                          )}
                          <span
                            className={
                              incluido
                                ? ""
                                : destacado
                                  ? "text-brand/50"
                                  : "text-white/40"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Botón Comprar */}
                  <button
                    type="button"
                    onClick={() => comprar(plan)}
                    disabled={loading === plan.nombre}
                    className={`mt-8 rounded-full px-6 py-3 font-mulish text-sm font-semibold transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${
                      destacado
                        ? "bg-brand-dark text-white"
                        : "bg-white text-brand"
                    }`}
                  >
                    {loading === plan.nombre ? "Procesando…" : "Comprar"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Aviso (no configurado / error) */}
        {aviso && (
          <p className="mt-8 text-center font-mulish text-sm text-brand/80">
            {aviso}
          </p>
        )}
      </div>
    </section>
  );
}
