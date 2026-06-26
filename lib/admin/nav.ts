/**
 * Navegación del panel de administración (sidebar).
 *
 * Agrupa los enlaces a las distintas secciones del CMS. Las colecciones simples
 * apuntan a las rutas genéricas /admin/[resource]; las entidades especiales
 * (planes, reservas, ajustes, suscriptores) a sus rutas dedicadas.
 */
export type AdminNavItem = { label: string; href: string };
export type AdminNavGroup = { label: string; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "General",
    items: [
      { label: "Inicio", href: "/admin" },
      { label: "Ajustes del sitio", href: "/admin/ajustes" },
    ],
  },
  {
    label: "Contenido",
    items: [
      { label: "Slides del hero", href: "/admin/hero_slides" },
      { label: "Servicios", href: "/admin/servicios" },
      { label: "Clases", href: "/admin/clases" },
      { label: "Beneficios", href: "/admin/beneficios" },
      { label: "Entrenadores", href: "/admin/coaches" },
      { label: "Planes de socio", href: "/admin/planes" },
      { label: "Testimonios", href: "/admin/testimonios" },
      { label: "Estadísticas", href: "/admin/estadisticas" },
      { label: "Sponsors", href: "/admin/sponsors" },
      { label: "Links de navegación", href: "/admin/nav_links" },
      { label: "Fotos del footer", href: "/admin/footer_fotos" },
    ],
  },
  {
    label: "Operación",
    items: [
      { label: "Partidos", href: "/admin/partidos" },
      { label: "Reservas", href: "/admin/reservas" },
      { label: "Suscriptores", href: "/admin/suscriptores" },
    ],
  },
];
