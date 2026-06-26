"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/lib/navLinks";

export default function NavbarClient({ navLinks }: { navLinks: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sobre el Hero el navbar es transparente con texto blanco; al hacer scroll
  // pasa a fondo blanco con texto en color marca (#142d4b).
  const onLight = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onLight ? "bg-offwhite/95 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
        {/* Logo */}
        <Link
          href="#inicio"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 font-kanit text-xl font-bold tracking-tight md:text-2xl"
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-lime transition-colors"
            aria-hidden
          />
          <span className={onLight ? "text-brand" : "text-white"}>
            Fortín{" "}
            <span className={onLight ? "text-brand" : "text-lime"}>
              Racket Club
            </span>
          </span>
        </Link>

        {/* Menú central (desktop) */}
        <ul className="hidden items-center gap-8 font-mulish text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors hover:text-lime ${
                  onLight ? "text-brand" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + botón móvil */}
        <div className="flex items-center gap-3">
          <Link
            href="#reservas"
            className="hidden rounded-full bg-brand px-5 py-2.5 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105 lg:inline-block"
          >
            Reservar
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className={`lg:hidden ${onLight ? "text-brand" : "text-white"}`}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="border-t border-brand/10 bg-offwhite lg:hidden">
          <ul className="flex flex-col px-6 py-4 font-mulish">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-brand transition-colors hover:text-lime"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="#reservas"
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-full bg-brand px-5 py-3 text-center font-semibold text-white"
              >
                Reservar
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
