import Link from "next/link";
import {
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  ExternalLink,
  Navigation,
} from "lucide-react";
import type { NavLink } from "@/lib/navLinks";
import type { Settings } from "@/lib/settings";
import { GOOGLE_MAPS_URL, WAZE_URL } from "@/lib/clubLocation";
import ScrollTopButton from "./ScrollTopButton";
import FooterMap from "./FooterMap";

export default function FooterClient({
  enlaces,
  settings,
}: {
  enlaces: NavLink[];
  settings: Settings;
}) {
  const redes = [
    { label: "Instagram", icon: Instagram, href: settings.social_instagram || "#" },
    { label: "Facebook", icon: Facebook, href: settings.social_facebook || "#" },
    { label: "YouTube", icon: Youtube, href: settings.social_youtube || "#" },
  ];

  const telefono = settings.contacto_telefono;
  const telHref = `tel:${telefono.replace(/[^+\d]/g, "")}`;

  return (
    <footer id="contacto">
      {/* Cuerpo del footer (blanco) */}
      <div className="bg-white text-brand">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-3">
          {/* Columna 1: logo + info corporativa + teléfono + redes */}
          <div className="flex items-start gap-5">
            {settings.hero_logo_url && (
              // eslint-disable-next-line @next/next/no-img-element -- logo de proporción/formato arbitrario
              <img
                src={settings.hero_logo_url}
                alt={settings.hero_logo_alt}
                className="h-20 w-auto shrink-0 object-contain md:h-24"
              />
            )}
            <div>
              <h3 className="font-kanit text-2xl font-bold uppercase">
                Fortín <span className="text-brand">Racket Club</span>
              </h3>
              <p className="mt-4 max-w-xs font-mulish text-sm text-brand/70">
                {settings.footer_descripcion}
              </p>
              <p className="mt-6 flex max-w-xs items-start gap-2 font-mulish text-sm text-brand/70">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                {settings.contacto_direccion}
              </p>
              <a
                href={telHref}
                className="mt-4 inline-flex items-center gap-2 font-mulish text-sm text-brand/90 transition-colors hover:text-lime"
              >
                <Phone className="h-4 w-4" /> {telefono}
              </a>
              <div className="mt-6 flex gap-3">
                {redes.map((red) => {
                  const Icon = red.icon;
                  return (
                    <a
                      key={red.label}
                      href={red.href}
                      aria-label={red.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 transition-colors hover:bg-lime hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna 2: enlaces rápidos + botón WhatsApp */}
          <div>
            <h4 className="font-kanit text-lg font-bold">Enlaces rápidos</h4>
            <ul className="mt-4 space-y-2.5">
              {enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className="font-mulish text-sm text-brand/70 transition-colors hover:text-lime"
                  >
                    {enlace.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={settings.contacto_whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" /> Contacto
            </a>
          </div>

          {/* Columna 3: mapa de ubicación, como tarjeta clara con accesos directos */}
          <div>
            <h4 className="font-kanit text-lg font-bold">Ubicación</h4>
            <div className="mt-4 overflow-hidden rounded-2xl bg-brand text-white shadow-lg">
              <div className="relative">
                <FooterMap />
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 font-mulish text-xs font-semibold text-white shadow-md transition-colors hover:bg-brand-dark"
                >
                  Abrir en Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" />
                  <div>
                    <p className="font-kanit text-sm font-bold uppercase tracking-wide text-white">
                      Fortín Racket Club
                    </p>
                    <p className="mt-1 font-mulish text-xs leading-relaxed text-white/60">
                      {settings.contacto_direccion}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-3 py-2 font-mulish text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Google Maps
                  </a>
                  <a
                    href={WAZE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-3 py-2 font-mulish text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Waze
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer (offwhite) */}
      <div className="bg-offwhite">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <p className="font-mulish text-xs text-brand/50">
            © 2026 Fortín Racket Club. Todos los derechos reservados.
          </p>
          <ScrollTopButton />
        </div>
      </div>
    </footer>
  );
}
