import Image from "next/image";
import { LandPlot, Users, Trophy, Shirt, Dumbbell, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getBeneficios, type Beneficio } from "@/lib/beneficios";
import { getSettings } from "@/lib/settings";

// Registro de íconos permitidos (el CMS guarda el nombre como string).
const ICONS: Record<string, LucideIcon> = {
  LandPlot,
  Users,
  Trophy,
  Shirt,
  Dumbbell,
  Flame,
};

function BeneficioItem({ beneficio }: { beneficio: Beneficio }) {
  const Icon = ICONS[beneficio.icono] ?? LandPlot;
  const reverse = beneficio.columna === "right";
  return (
    <div
      className={`flex items-start gap-4 ${
        reverse ? "lg:flex-row-reverse lg:text-right" : ""
      }`}
    >
      <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/5 text-brand">
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </span>
      <div>
        <h3 className="font-kanit text-lg font-semibold text-brand">
          {beneficio.title}
        </h3>
        <p className="mt-1 font-mulish text-sm text-brand/70">
          {beneficio.text}
        </p>
      </div>
    </div>
  );
}

export default async function Beneficios() {
  const [beneficios, settings] = await Promise.all([
    getBeneficios(),
    getSettings(),
  ]);
  const izquierda = beneficios.filter((b) => b.columna === "left");
  const derecha = beneficios.filter((b) => b.columna === "right");
  return (
    <section id="beneficios" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-lime">
            Beneficios
          </span>
          <h2 className="mt-3 font-kanit text-3xl font-bold text-brand md:text-4xl">
            Full Comfort para Miembros
          </h2>
          <p className="mt-4 font-mulish text-brand/70">
            Todo lo que un socio necesita para disfrutar el club dentro y fuera
            de la cancha.
          </p>
        </div>

        {/* Grilla: 3 bloques · imagen central · 3 bloques */}
        <div className="grid items-center gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-10">
            {izquierda.map((b) => (
              <BeneficioItem key={b.title} beneficio={b} />
            ))}
          </div>

          {/* Imagen central */}
          <div className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-[2rem] shadow-xl sm:h-80 lg:h-[460px]">
            <Image
              src={settings.beneficios_imagen_url}
              alt={settings.beneficios_imagen_alt}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-10">
            {derecha.map((b) => (
              <BeneficioItem key={b.title} beneficio={b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
