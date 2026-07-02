import HeroVideoBg from "./HeroVideoBg";

/**
 * Hero en modo video: un clip en loop a pantalla completa. El overlay se
 * renderiza en el servidor; el fondo (HeroVideoBg) es un hijo client que
 * elige el video de escritorio o el vertical de móvil según el viewport.
 */
export default function HeroVideo({
  videoUrl,
  videoMovilUrl,
  posterUrl,
}: {
  videoUrl: string;
  videoMovilUrl?: string;
  posterUrl?: string;
}) {
  return (
    <section id="inicio" className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Video de fondo en loop (escritorio / móvil según viewport) */}
      <HeroVideoBg
        desktopUrl={videoUrl}
        mobileUrl={videoMovilUrl}
        posterUrl={posterUrl}
      />

      {/* Overlay claro (igual que el carrusel) */}
      <div className="absolute inset-0 bg-white/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-white/10" />
    </section>
  );
}
