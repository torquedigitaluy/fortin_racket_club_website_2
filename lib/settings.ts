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
  footer_descripcion:
    "Un club moderno donde el tenis se vive con pasión, comunidad y alto rendimiento.",
  contacto_telefono: "+54 11 1234-5678",
  contacto_direccion: "Av. del Tenis 1234, Buenos Aires",
  contacto_whatsapp_url: "https://wa.me/541112345678",
  social_instagram: "#",
  social_facebook: "#",
  social_youtube: "#",
  cta_eyebrow: "Oferta de bienvenida",
  cta_titulo: "¡Tu primera clase es GRATIS!",
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
};

// Agrupación y etiquetas para el formulario del CMS.
export const SETTINGS_GROUPS: {
  label: string;
  fields: { key: string; label: string; multiline?: boolean; image?: boolean }[];
}[] = [
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
      { key: "hero_cta_label", label: "Texto del botón del hero" },
      { key: "cta_eyebrow", label: "Banner — bajada" },
      { key: "cta_titulo", label: "Banner — título" },
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
    label: "Secciones",
    fields: [
      { key: "clases_imagen_url", label: "Clases personalizadas — imagen", image: true },
      { key: "clases_imagen_alt", label: "Clases personalizadas — texto alternativo" },
      { key: "beneficios_imagen_url", label: "Beneficios — imagen central", image: true },
      { key: "beneficios_imagen_alt", label: "Beneficios — texto alternativo" },
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
    if (row.value != null) fromDb[row.key] = row.value;
  }

  return { ...SETTINGS_DEFAULTS, ...fromDb };
}
