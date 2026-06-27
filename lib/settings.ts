import { getSupabase } from "./supabase";

/**
 * Ajustes singulares del sitio (textos de contacto, CTA, newsletter, etc.).
 *
 * Se guardan como filas key/value en `site_settings`. `getSettings()` devuelve
 * un Record completo: los defaults de abajo mergeados con lo que haya en la DB,
 * así los componentes siempre tienen un valor (resiliencia tipo mock).
 */

export type Settings = Record<string, string>;

export const SETTINGS_DEFAULTS: Settings = {
  hero_cta_label: "Saber más",
  // Logo opcional arriba del título del hero (sirve en galería y video).
  hero_logo_url: "/hero-logo-placeholder.svg",
  hero_logo_alt: "Logo Fortín Racket Club",
  // Hero: "galeria" (carrusel de imágenes) o "video" (video en loop).
  hero_modo: "video",
  hero_video_url: "https://assets.mixkit.co/videos/880/880-720.mp4",
  // Video vertical 9:16 para móvil; si queda vacío, móvil usa el de escritorio.
  hero_video_movil_url:
    "https://videos.pexels.com/video-files/5730499/5730499-hd_720_1366_25fps.mp4",
  hero_video_poster_url:
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1920&q=80",
  hero_video_titulo: "Fortín Racket Club",
  hero_video_texto:
    "Un club moderno donde el tenis se vive con pasión. Canchas profesionales, entrenamiento de primer nivel y comunidad.",
  hero_video_cta_label: "Saber más",
  footer_descripcion:
    "Un club moderno donde el tenis se vive con pasión, comunidad y alto rendimiento.",
  contacto_telefono: "+54 11 1234-5678",
  contacto_direccion: "Av. del Tenis 1234, Buenos Aires",
  contacto_whatsapp_url: "https://wa.me/541112345678",
  social_instagram: "#",
  social_facebook: "#",
  social_youtube: "#",
  cta_eyebrow: "Oferta de bienvenida",
  cta_titulo: "¡Tu primera clase\nes GRATIS!",
  cta_texto:
    "Probá una clase con nuestros coaches profesionales sin costo y descubrí por qué somos tu próximo club.",
  cta_boton_label: "Saber más",
  cta_boton_href: "#contacto",
  newsletter_titulo: "Sumate a nuestro newsletter",
  newsletter_texto:
    "Recibí novedades, torneos y promociones exclusivas en tu correo.",
  reservas_precio_hora: "999",
  clases_imagen_url:
    "https://images.unsplash.com/photo-1531315396756-905d68d21b56?auto=format&fit=crop&w=1000&q=80",
  clases_imagen_alt: "Tenista en plena acción durante una clase",
  beneficios_imagen_url:
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
  beneficios_imagen_alt: "Raqueta de tenis y pelotas",
  torneo_imagen_url:
    "https://images.unsplash.com/photo-1751275061929-2f63fc96838c?auto=format&fit=crop&w=1000&q=80",
  torneo_imagen_alt: "Cancha de polvo de ladrillo",
  torneo_bg_url:
    "https://images.unsplash.com/photo-1751275061929-2f63fc96838c?auto=format&fit=crop&w=1000&q=80",
  torneo_bg_alt: "Cancha de polvo de ladrillo",
  reservas_imagen_url:
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
  reservas_imagen_alt: "Ambiente del club de tenis",
  cta_bg_url:
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1920&q=80",
  planes_bg_url:
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1920&q=80",
  planes_destacado_bg_url:
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
  newsletter_bg_url:
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1920&q=80",
};

// Agrupación y etiquetas para el formulario del CMS.
export const SETTINGS_GROUPS: {
  label: string;
  fields: {
    key: string;
    label: string;
    multiline?: boolean;
    image?: boolean;
    video?: boolean;
    select?: { value: string; label: string }[];
  }[];
}[] = [
  {
    label: "Hero — modo y video",
    fields: [
      {
        key: "hero_modo",
        label: "Modo del hero",
        select: [
          { value: "galeria", label: "Galería de imágenes" },
          { value: "video", label: "Video en loop" },
        ],
      },
      { key: "hero_video_url", label: "Video del hero (escritorio)", video: true },
      { key: "hero_video_movil_url", label: "Video del hero (móvil — vertical 9:16)", video: true },
      { key: "hero_video_poster_url", label: "Video — imagen de carga (poster)", image: true },
      { key: "hero_video_titulo", label: "Video — título" },
      { key: "hero_video_texto", label: "Video — bajada", multiline: true },
      { key: "hero_video_cta_label", label: "Video — texto del botón" },
    ],
  },
  {
    label: "Contacto",
    fields: [
      { key: "contacto_telefono", label: "Teléfono" },
      { key: "contacto_direccion", label: "Dirección" },
      { key: "contacto_whatsapp_url", label: "URL de WhatsApp" },
    ],
  },
  {
    label: "Redes sociales",
    fields: [
      { key: "social_instagram", label: "Instagram" },
      { key: "social_facebook", label: "Facebook" },
      { key: "social_youtube", label: "YouTube" },
    ],
  },
  {
    label: "Hero & banner",
    fields: [
      { key: "hero_logo_url", label: "Hero — logo (arriba del título)", image: true },
      { key: "hero_logo_alt", label: "Hero — texto alternativo del logo" },
      { key: "hero_cta_label", label: "Texto del botón del hero" },
      { key: "cta_eyebrow", label: "Banner — bajada" },
      { key: "cta_titulo", label: "Banner — título", multiline: true },
      { key: "cta_texto", label: "Banner — texto", multiline: true },
      { key: "cta_boton_label", label: "Banner — texto del botón" },
      { key: "cta_boton_href", label: "Banner — destino del botón" },
    ],
  },
  {
    label: "Newsletter & footer",
    fields: [
      { key: "newsletter_titulo", label: "Newsletter — título" },
      { key: "newsletter_texto", label: "Newsletter — texto", multiline: true },
      { key: "footer_descripcion", label: "Footer — descripción", multiline: true },
    ],
  },
  {
    label: "Reservas",
    fields: [{ key: "reservas_precio_hora", label: "Precio por hora ($)" }],
  },
  {
    label: "Imágenes de secciones",
    fields: [
      { key: "clases_imagen_url", label: "Clases personalizadas — imagen", image: true },
      { key: "clases_imagen_alt", label: "Clases personalizadas — texto alternativo" },
      { key: "beneficios_imagen_url", label: "Beneficios — imagen central", image: true },
      { key: "beneficios_imagen_alt", label: "Beneficios — texto alternativo" },
      { key: "torneo_bg_url", label: "Fortín Club Cup — fondo (polvo de ladrillo)", image: true },
      { key: "torneo_bg_alt", label: "Fortín Club Cup — texto alternativo del fondo" },
      { key: "torneo_imagen_url", label: "Torneo & Calendario — imagen (derecha)", image: true },
      { key: "torneo_imagen_alt", label: "Torneo & Calendario — texto alternativo" },
      { key: "reservas_imagen_url", label: "Reserva de canchas — imagen", image: true },
      { key: "reservas_imagen_alt", label: "Reserva de canchas — texto alternativo" },
    ],
  },
  {
    label: "Imágenes de fondo",
    fields: [
      { key: "cta_bg_url", label: "Banner CTA — fondo", image: true },
      { key: "planes_bg_url", label: "Planes — fondo", image: true },
      { key: "planes_destacado_bg_url", label: "Planes — fondo tarjeta destacada", image: true },
      { key: "newsletter_bg_url", label: "Newsletter — fondo", image: true },
    ],
  },
];

export async function getSettings(): Promise<Settings> {
  const supabase = getSupabase();
  if (!supabase) return { ...SETTINGS_DEFAULTS };

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error || !data) {
    if (error) {
      console.warn("[settings] Supabase no disponible, usando defaults:", error.message);
    }
    return { ...SETTINGS_DEFAULTS };
  }

  const fromDb: Settings = {};
  for (const row of data as { key: string; value: string | null }[]) {
    // Solo sobrescribimos el default si hay un valor no vacío: así una imagen
    // borrada/vacía en la DB cae al default en lugar de romperse.
    if (row.value) fromDb[row.key] = row.value;
  }

  return { ...SETTINGS_DEFAULTS, ...fromDb };
}
