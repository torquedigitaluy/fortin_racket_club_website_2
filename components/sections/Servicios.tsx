import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServicios } from "@/lib/servicios";

export default async function Servicios() {
  const servicios = await getServicios();

  return (
    <section id="servicios" className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-lime">
            Nuestros servicios
          </span>
          <h2 className="mt-3 font-kanit text-3xl font-bold text-brand md:text-4xl">
            Todo lo que necesitás para jugar
          </h2>
          <p className="mt-4 font-mulish text-brand/70">
            Desde la reserva de tu cancha hasta el entrenamiento profesional, en
            Fortín Racket Club te acompañamos en cada paso.
          </p>
        </div>

        {/* Grilla de 4 tarjetas */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((servicio) => (
            <article
              key={servicio.title}
              className="group flex flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Imagen */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={servicio.image}
                  alt={servicio.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Contenido */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-kanit text-xl font-bold text-brand">
                  {servicio.title}
                </h3>
                <p className="mt-3 flex-1 font-mulish text-sm text-brand/70">
                  {servicio.text}
                </p>
                <Link
                  href={servicio.href}
                  className="mt-5 inline-flex items-center gap-1.5 font-mulish text-sm font-semibold text-brand transition-colors hover:text-lime"
                >
                  Saber más
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
