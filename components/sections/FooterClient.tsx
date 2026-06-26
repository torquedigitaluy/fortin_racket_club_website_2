import Image from "next/image";
import Link from "next/link";
import { Phone, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";
import type { NavLink } from "@/lib/navLinks";
import type { Settings } from "@/lib/settings";
import ScrollTopButton from "./ScrollTopButton";

export default function FooterClient({
  enlaces,
  fotos,
  settings,
}: {
  enlaces: NavLink[];
  fotos: string[];
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
      {/* Cuerpo del footer (#142d4b) */}
      <div className="bg-brand text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-3">
          {/* Columna 1: info corporativa + teléfono + redes */}
          <div>
            <h3 className="font-kanit text-2xl font-bold">
              Fortín <span className="text-lime">Racket Club</span>
            </h3>
            <p className="mt-4 max-w-xs font-mulish text-sm text-white/70">
              {settings.footer_descripcion}
            </p>
            <a
              href={telHref}
              className="mt-6 inline-flex items-center gap-2 font-mulish text-sm text-white/90 transition-colors hover:text-lime"
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
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-lime hover:text-brand"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
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
                    className="font-mulish text-sm text-white/70 transition-colors hover:text-lime"
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
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 font-mulish text-sm font-semibold text-brand transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" /> Contacto
            </a>
          </div>

          {/* Columna 3: fotos recientes tipo Instagram */}
          <div>
            <h4 className="font-kanit text-lg font-bold">Fotos recientes</h4>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {fotos.map((foto, i) => (
                <a
                  key={foto}
                  href="#"
                  className="group relative aspect-square overflow-hidden rounded-lg"
                  aria-label={`Foto reciente ${i + 1}`}
                >
                  <Image
                    src={foto}
                    alt=""
                    fill
                    sizes="120px"
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-brand/0 transition-colors group-hover:bg-brand/30" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer (#0d1d30) */}
      <div className="bg-brand-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
          <p className="font-mulish text-xs text-white/50">
            © 2026 Fortín Racket Club. Todos los derechos reservados.
          </p>
          <ScrollTopButton />
        </div>
      </div>
    </footer>
  );
}
