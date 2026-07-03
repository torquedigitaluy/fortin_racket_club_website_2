import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { getCoaches } from "@/lib/coaches";

// Redes mostradas en cada tarjeta de coach (placeholders hasta tener URLs reales).
const REDES = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "X" },
];

export default async function Entrenadores() {
  const coaches = await getCoaches();

  return (
    <section id="entrenadores" className="bg-brand py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-white">
            Nuestro equipo
          </span>
          <h2 className="mt-3 font-kanit text-3xl font-bold text-white md:text-4xl">
            Entrenadores
          </h2>
          <p className="mt-4 font-mulish text-white/70">
            Profesionales que te acompañan en cada etapa de tu juego.
          </p>
        </div>

        {/* Grilla de coaches */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((coach) => (
            <article
              key={coach.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-brand-dark shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Foto */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={coach.foto_url}
                  alt={`Foto de ${coach.nombre}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Datos */}
              <div className="flex items-center justify-between px-5 py-4">
                <h3 className="font-kanit text-lg font-bold text-white">
                  {coach.nombre}
                </h3>
                <div className="flex gap-2">
                  {REDES.map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={`${coach.nombre} en ${label}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white hover:text-brand"
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
