"use client";

/**
 * Botón "Volver al inicio" con scroll suave. Aislado como Client Component
 * pequeño para que el resto del footer pueda renderizarse en el servidor.
 */
export default function ScrollTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-2 font-mulish text-xs font-semibold text-white/70 transition-colors hover:text-lime"
    >
      {/* Pelota de tenis */}
      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-lime">
        <span className="absolute h-3 w-3 rounded-full border border-brand/40" />
      </span>
      Volver al inicio
    </button>
  );
}
