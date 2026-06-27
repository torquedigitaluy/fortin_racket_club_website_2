"use client";

import { useEffect, useState } from "react";

/**
 * Fondo de video del hero que elige la fuente según el ancho del viewport:
 * en pantallas chicas (≤767px, el breakpoint mobile de Tailwind) usa el video
 * vertical, si está definido; si no, el de escritorio.
 *
 * Para no descargar ambos videos ni romper la hidratación, en el servidor se
 * renderiza el <video> sin `src` (solo el poster) y la fuente se decide al
 * montar. `key={src}` fuerza el remount para que el autoplay arranque al
 * cambiar de fuente (p. ej. al rotar el dispositivo).
 */
export default function HeroVideoBg({
  desktopUrl,
  mobileUrl,
  posterUrl,
}: {
  desktopUrl: string;
  mobileUrl?: string;
  posterUrl?: string;
}) {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const pick = () => setSrc(mq.matches && mobileUrl ? mobileUrl : desktopUrl);
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, [desktopUrl, mobileUrl]);

  return (
    <video
      key={src}
      src={src}
      poster={posterUrl}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
