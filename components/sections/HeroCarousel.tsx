"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Slide } from "@/lib/heroSlides";

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay con reinicio en cada cambio de slide.
  useEffect(() => {
    const id = setTimeout(() => goTo(current + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [current, goTo]);

  const slide = slides[current];
  if (!slide) return null;

  return (
    <section id="inicio" className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Imágenes de fondo (crossfade). Cada slide puede tener una versión
          vertical (9:16) para móvil; si no, se reutiliza la horizontal. */}
      {slides.map((s, i) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {s.imageMovil && (
            <Image
              src={s.imageMovil}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              unoptimized
              className="object-cover md:hidden"
            />
          )}
          <Image
            src={s.image}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            unoptimized
            className={`object-cover ${s.imageMovil ? "hidden md:block" : ""}`}
          />
        </div>
      ))}

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-brand/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-brand/10" />

      {/* Título y bajada: opcionales, el slide puede dejarse solo con imagen */}
      {(slide.title || slide.text) && (
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center text-white">
          {slide.title && (
            <h1 className="font-kanit text-4xl font-bold uppercase leading-tight tracking-wide drop-shadow-md sm:text-5xl md:text-7xl">
              {slide.title}
            </h1>
          )}
          {slide.text && (
            <p className="mt-6 max-w-2xl font-mulish text-base text-white/90 sm:text-lg">
              {slide.text}
            </p>
          )}
        </div>
      )}

      {/* Flechas laterales */}
      <button
        type="button"
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30 md:left-8 md:p-3"
      >
        <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Slide siguiente"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30 md:right-8 md:p-3"
      >
        <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? "w-8 bg-lime" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
