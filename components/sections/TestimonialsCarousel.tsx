"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonio } from "@/lib/testimonios";

const AUTOPLAY_MS = 7000;

export default function TestimonialsCarousel({
  testimonios,
}: {
  testimonios: Testimonio[];
}) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + testimonios.length) % testimonios.length);
    },
    [testimonios.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const id = setTimeout(() => goTo(current + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [current, goTo]);

  const t = testimonios[current];
  if (!t) return null;

  return (
    <section className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Comillas gigantes */}
        <Quote
          className="mx-auto h-16 w-16 text-brand md:h-20 md:w-20"
          fill="currentColor"
          strokeWidth={0}
          aria-hidden
        />

        {/* Texto de la reseña */}
        <blockquote className="mt-8 min-h-[7rem] font-kanit text-2xl font-medium leading-snug text-brand md:text-3xl">
          “{t.texto}”
        </blockquote>

        {/* Autor */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-lime">
            <Image
              src={t.foto}
              alt={`Foto de ${t.autor}`}
              fill
              sizes="64px"
              unoptimized
              className="object-cover"
            />
          </div>
          <p className="mt-3 font-mulish font-bold text-brand">{t.autor}</p>
          <p className="font-mulish text-sm text-brand/60">{t.rol}</p>
        </div>

        {/* Controles */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Reseña anterior"
            className="rounded-full border border-brand/20 p-2 text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonios.map((item, i) => (
              <button
                key={item.autor}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la reseña ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === current ? "w-8 bg-brand" : "w-2.5 bg-brand/30 hover:bg-brand/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Reseña siguiente"
            className="rounded-full border border-brand/20 p-2 text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
