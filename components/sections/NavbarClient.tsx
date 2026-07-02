"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/lib/navLinks";

export default function NavbarClient({
  navLinks,
  logoUrl,
  logoAlt = "",
}: {
  navLinks: NavLink[];
  logoUrl?: string;
  logoAlt?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sobre el Hero el navbar es transparente con texto color marca (#142d4b);
  // al hacer scroll pasa a fondo azul oscuro con texto blanco.
  const onLight = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onLight ? "bg-brand-dark/95 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
        {/* Logo */}
        <Link
          href="#inicio"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 font-kanit text-xl font-bold uppercase tracking-tight md:text-2xl"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo de proporción/formato arbitrario
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-14 w-auto shrink-0 object-contain md:h-16"
            />
          ) : (
            // Pelota de tenis: verde sobre fondo azul oscuro, azul marca sobre fondo transparente
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              className="h-6 w-6 shrink-0 md:h-7 md:w-7"
            >
              <circle cx="12" cy="12" r="10" fill={onLight ? "#93d419" : "#142d4b"} />
              <path
                d="M4.2 5.6a11 11 0 0 1 0 12.8"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M19.8 5.6a11 11 0 0 0 0 12.8"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          )}
          <span className={onLight ? "text-white" : "text-brand"}>
            Fortín Racket Club
          </span>
        </Link>

        {/* Menú central (desktop) */}
        <ul className="hidden items-center gap-8 font-mulish text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors hover:text-lime ${
                  onLight ? "text-white" : "text-brand"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón móvil (menú) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className={`lg:hidden ${onLight ? "text-white" : "text-brand"}`}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-dark lg:hidden">
          <ul className="flex flex-col px-6 py-4 font-mulish">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-white transition-colors hover:text-lime"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
