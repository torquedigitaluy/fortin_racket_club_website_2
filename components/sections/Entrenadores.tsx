import Image from "next/image";
import { getCoaches } from "@/lib/coaches";

export default async function Entrenadores() {
  const coaches = await getCoaches();

  return (
    <section id="entrenadores" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-lime">
            Nuestro equipo
          </span>
          <h2 className="mt-3 font-kanit text-3xl font-bold text-brand md:text-4xl">
            Entrenadores
          </h2>
          <p className="mt-4 font-mulish text-brand/70">
            Profesionales que te acompañan en cada etapa de tu juego.
          </p>
        </div>

        {/* Grilla de coaches */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((coach) => (
            <article
              key={coach.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Foto */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={coach.foto_url}
                  alt={`Foto de ${coach.nombre}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Datos */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-kanit text-lg font-bold text-brand">
                  {coach.nombre}
                </h3>
                <span className="mt-1 font-mulish text-xs font-semibold uppercase tracking-wide text-lime">
                  {coach.cargo}
                </span>
                <p className="mt-3 font-mulish text-sm text-brand/70">
                  {coach.descripcion}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
