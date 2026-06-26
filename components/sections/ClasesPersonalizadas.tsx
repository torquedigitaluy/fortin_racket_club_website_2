import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getClases } from "@/lib/clases";
import { getSettings } from "@/lib/settings";

export default async function ClasesPersonalizadas() {
  const [clases, settings] = await Promise.all([getClases(), getSettings()]);

  return (
    <section id="actividades" className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Izquierda: imagen de tenista recortada (editable desde el CMS) */}
        <div className="relative h-80 lg:h-auto lg:min-h-[640px]">
          <Image
            src={settings.clases_imagen_url}
            alt={settings.clases_imagen_alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Derecha: contenido + lista numerada */}
        <div className="flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-24">
          <div className="max-w-xl">
            <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-lime">
              Empieza hoy
            </span>
            <h2 className="mt-3 font-kanit text-3xl font-bold text-brand md:text-4xl">
              Clases personalizadas
            </h2>
            <p className="mt-4 font-mulish text-brand/70">
              Elegí el formato que mejor se adapta a vos. Sea cual sea tu nivel,
              tenemos una clase pensada para que avances jugando.
            </p>

            <ul className="mt-10 space-y-8">
              {clases.map((clase) => (
                <li key={clase.numero} className="flex gap-5">
                  <span className="font-kanit text-4xl font-bold leading-none text-lime md:text-5xl">
                    {clase.numero}
                  </span>
                  <div className="border-l border-brand/10 pl-5">
                    <h3 className="font-kanit text-xl font-bold text-brand">
                      {clase.title}
                    </h3>
                    <p className="mt-2 font-mulish text-sm text-brand/70">
                      {clase.text}
                    </p>
                    <Link
                      href={clase.href}
                      className="group mt-3 inline-flex items-center gap-1.5 font-mulish text-sm font-semibold text-brand transition-colors hover:text-lime"
                    >
                      Saber más
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
