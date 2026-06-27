import Link from "next/link";
import HeroVideoBg from "./HeroVideoBg";

/**
 * Hero en modo video: un clip en loop a pantalla completa con el mismo overlay
 * (oscurecido + título/bajada/CTA) que el carrusel. El overlay se renderiza en
 * el servidor; el fondo (HeroVideoBg) es un hijo client que elige el video de
 * escritorio o el vertical de móvil según el viewport.
 */
export default function HeroVideo({
  videoUrl,
  videoMovilUrl,
  posterUrl,
  titulo,
  texto,
  ctaLabel = "Saber más",
  logoUrl,
  logoAlt = "",
}: {
  videoUrl: string;
  videoMovilUrl?: string;
  posterUrl?: string;
  titulo: string;
  texto: string;
  ctaLabel?: string;
  logoUrl?: string;
  logoAlt?: string;
}) {
  return (
    <section id="inicio" className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Video de fondo en loop (escritorio / móvil según viewport) */}
      <HeroVideoBg
        desktopUrl={videoUrl}
        mobileUrl={videoMovilUrl}
        posterUrl={posterUrl}
      />

      {/* Overlay oscuro (igual que el carrusel) */}
      <div className="absolute inset-0 bg-brand/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand/50 via-transparent to-brand/10" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center text-white">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- logo de proporción/format arbitrario (puede ser SVG)
          <img
            src={logoUrl}
            alt={logoAlt}
            className="mb-6 h-64 w-auto max-w-full object-contain drop-shadow-md sm:h-80 md:h-96"
          />
        )}
        <h1 className="font-kanit text-4xl font-bold uppercase leading-tight tracking-wide drop-shadow-md sm:text-5xl md:text-7xl">
          {titulo}
        </h1>
        <p className="mt-6 max-w-2xl font-mulish text-base text-white/90 sm:text-lg">
          {texto}
        </p>
        <Link
          href="#quienes-somos"
          className="mt-8 rounded-full bg-brand px-8 py-3.5 font-mulish text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
