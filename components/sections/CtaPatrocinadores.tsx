import Link from "next/link";
import { getSponsors } from "@/lib/sponsors";
import { getSettings } from "@/lib/settings";
import ParallaxImage from "./ParallaxImage";

export default async function CtaPatrocinadores() {
  const [patrocinadores, settings] = await Promise.all([
    getSponsors(),
    getSettings(),
  ]);
  return (
    <section aria-label="Promoción y patrocinadores">
      {/* CTA Banner — fondo de cancha de polvo de ladrillo */}
      <div className="relative overflow-hidden">
        <ParallaxImage src={settings.cta_bg_url} alt="Cancha de polvo de ladrillo" />
        {/* Tinte arcilla para garantizar el aspecto de polvo de ladrillo */}
        <div className="absolute inset-0 bg-clay/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 px-6 py-16 text-brand md:py-20">
          <span className="font-mulish text-sm font-semibold uppercase tracking-widest text-brand/90">
            {settings.cta_eyebrow}
          </span>
          <h2 className="max-w-2xl whitespace-pre-line font-kanit text-3xl font-bold uppercase leading-tight drop-shadow-md sm:text-4xl md:text-5xl">
            {settings.cta_titulo}
          </h2>
          <p className="max-w-xl font-mulish text-brand/90">{settings.cta_texto}</p>
          <Link
            href={settings.cta_boton_href || "#contacto"}
            className="mt-2 rounded-full bg-white px-8 py-3.5 font-mulish text-sm font-semibold text-brand shadow-lg transition-transform hover:scale-105"
          >
            {settings.cta_boton_label}
          </Link>
        </div>
      </div>

      {/* Carrusel infinito de patrocinadores (blanco) */}
      <div className="overflow-hidden bg-white py-8">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {/* Contenido duplicado para el loop continuo sin salto */}
          {[...patrocinadores, ...patrocinadores].map((nombre, i) => (
            <span
              key={`${nombre}-${i}`}
              aria-hidden={i >= patrocinadores.length}
              className="select-none whitespace-nowrap font-kanit text-2xl font-bold uppercase tracking-wide text-brand/70 transition-colors hover:text-brand"
            >
              {nombre}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
