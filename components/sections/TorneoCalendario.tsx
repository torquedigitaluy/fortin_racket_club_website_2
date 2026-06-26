import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { getProximosPartidos } from "@/lib/partidos";

const BENEFICIOS = [
  "Cuadro individual y de dobles",
  "Premios para los finalistas",
  "Categorías por nivel de juego",
  "Cobertura de fotos y video",
  "Asado de cierre para participantes",
];

const FECHA_FORMAT = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const HORA_FORMAT = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatFecha(iso: string) {
  const date = new Date(iso);
  return {
    dia: FECHA_FORMAT.format(date).replace(".", ""),
    hora: HORA_FORMAT.format(date),
  };
}

export default async function TorneoCalendario() {
  const partidos = await getProximosPartidos();

  return (
    <section id="torneo" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Columna izquierda: Fortín Club Cup (#93d419) */}
        <div className="flex flex-col justify-center bg-lime px-8 py-14 lg:px-12 lg:py-20">
          <h2 className="font-kanit text-3xl font-bold text-brand md:text-4xl">
            Fortín Club Cup
          </h2>
          <p className="mt-4 font-mulish text-sm text-brand/80">
            Nuestro torneo insignia. Competí, sumá ranking y viví el mejor tenis
            del club.
          </p>
          <ul className="mt-8 space-y-3">
            {BENEFICIOS.map((beneficio) => (
              <li
                key={beneficio}
                className="flex items-start gap-3 font-mulish text-sm text-brand"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {beneficio}
              </li>
            ))}
          </ul>
          <Link
            href="#contacto"
            className="mt-10 inline-block w-fit rounded-full bg-brand px-8 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Saber más
          </Link>
        </div>

        {/* Columna central: agenda de partidos (#142d4b) — datos dinámicos */}
        <div className="flex flex-col justify-center bg-brand px-8 py-14 lg:px-12 lg:py-20">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-lime">
            Agenda
          </span>
          <h3 className="mt-2 font-kanit text-2xl font-bold text-white md:text-3xl">
            Próximos partidos
          </h3>

          <ul className="mt-8 divide-y divide-white/10">
            {partidos.map((partido) => {
              const { dia, hora } = formatFecha(partido.fecha);
              return (
                <li key={partido.id} className="flex items-center gap-4 py-4">
                  <div className="flex w-16 flex-shrink-0 flex-col items-center rounded-lg bg-white/10 px-2 py-2 text-center">
                    <span className="font-mulish text-xs font-semibold uppercase text-lime">
                      {dia}
                    </span>
                    <span className="font-mulish text-sm font-bold text-white">
                      {hora}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-mulish text-sm font-semibold text-white">
                      {partido.jugadores}
                    </p>
                    <p className="font-mulish text-xs text-white/60">
                      {partido.cancha}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link
            href="#contacto"
            className="mt-8 inline-block w-fit rounded-full bg-lime px-8 py-3 font-mulish text-sm font-semibold text-brand transition-transform hover:scale-105"
          >
            Ver más
          </Link>
        </div>

        {/* Columna derecha: imagen estática */}
        <div className="relative min-h-[320px] lg:min-h-0">
          <Image
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1000&q=80"
            alt="Jugador de tenis ejecutando un golpe en acción"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            unoptimized
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
