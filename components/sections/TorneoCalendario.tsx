import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { getProximosPartidos } from "@/lib/partidos";
import { getSettings } from "@/lib/settings";
import ParallaxImage from "./ParallaxImage";

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
  const [partidos, settings] = await Promise.all([
    getProximosPartidos(),
    getSettings(),
  ]);

  return (
    <section id="torneo" className="w-full">
      {/* Fila superior: imagen + presentación, ambas columnas a la misma
          altura fija (no la altura total de la agenda) para que una foto
          horizontal entre sin recortes raros. */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Columna izquierda: foto del torneo — admite versión vertical para móvil */}
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-video lg:aspect-auto lg:min-h-[520px]">
          {settings.torneo_imagen_movil_url && (
            <Image
              src={settings.torneo_imagen_movil_url}
              alt={settings.torneo_imagen_alt}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              unoptimized
              className="object-cover lg:hidden"
            />
          )}
          <Image
            src={settings.torneo_imagen_url}
            alt={settings.torneo_imagen_alt}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            unoptimized
            className={`object-cover ${
              settings.torneo_imagen_movil_url ? "hidden lg:block" : ""
            }`}
          />
        </div>

        {/* Columna derecha: presentación del torneo (fondo con parallax) */}
        <div className="relative flex flex-col justify-center overflow-hidden px-8 py-14 lg:min-h-[520px] lg:px-12 lg:py-16">
          <ParallaxImage src={settings.torneo_bg_url} alt={settings.torneo_bg_alt} />
          {/* Filtro azul (similar al banner "Oferta de bienvenida") */}
          <div className="absolute inset-0 bg-white/50" />

          <div className="relative text-brand">
            <h2 className="font-kanit text-5xl font-bold md:text-6xl">
              Fortín Club Cup
            </h2>
            <p className="mt-4 font-mulish text-sm text-brand/80">
              Nuestro torneo insignia. Competí, sumá ranking y viví el mejor
              tenis del club.
            </p>
            <ul className="mt-8 space-y-3">
              {BENEFICIOS.map((beneficio) => (
                <li
                  key={beneficio}
                  className="flex items-start gap-3 font-mulish text-sm text-brand"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-lime text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {beneficio}
                </li>
              ))}
            </ul>
            <Link
              href="#contacto"
              className="mt-10 inline-block w-fit rounded-full bg-lime px-8 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Saber más
            </Link>
          </div>
        </div>
      </div>

      {/* Franja inferior a todo el ancho: agenda de partidos en tarjetas (blanco) */}
      <div className="bg-white px-6 py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-lime">
                Agenda
              </span>
              <h3 className="mt-2 font-kanit text-2xl font-bold text-brand md:text-3xl">
                Próximos partidos
              </h3>
            </div>
            <Link
              href="#contacto"
              className="inline-block w-fit rounded-full bg-lime px-8 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Ver más
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partidos.map((partido) => {
              const { dia, hora } = formatFecha(partido.fecha);
              return (
                <div
                  key={partido.id}
                  className="flex items-center gap-4 rounded-xl bg-brand/5 px-4 py-4"
                >
                  <div className="flex w-16 flex-shrink-0 flex-col items-center rounded-lg bg-brand/10 px-2 py-2 text-center">
                    <span className="font-mulish text-xs font-semibold uppercase text-lime">
                      {dia}
                    </span>
                    <span className="font-mulish text-sm font-bold text-brand">
                      {hora}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-mulish text-sm font-semibold text-brand">
                      {partido.jugadores}
                    </p>
                    <p className="font-mulish text-xs text-brand/60">
                      {partido.cancha}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
