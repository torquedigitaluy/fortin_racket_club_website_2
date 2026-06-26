/**
 * Registro de recursos del CMS genérico.
 *
 * Cada colección "simple" se describe acá con su tabla, etiquetas y el esquema
 * de campos. Las rutas /admin/[resource] (lista) y /admin/[resource]/[id]
 * (alta/edición) se generan a partir de esta config, y las server actions de
 * lib/admin/crud.ts validan contra ella.
 *
 * Las entidades irregulares (planes, reservas, ajustes, suscriptores) NO están
 * acá: tienen páginas dedicadas.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "image"
  | "select"
  | "datetime";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  /** Columna a mostrar como título en la tabla de listado. */
  primary?: boolean;
};

export type Resource = {
  table: string;
  label: string; // plural, ej. "Entrenadores"
  singular: string; // ej. "entrenador"
  orderBy: { column: string; ascending: boolean };
  fields: Field[];
};

// Campos comunes reutilizados por casi todas las colecciones.
const ORDEN: Field = {
  name: "orden",
  label: "Orden",
  type: "number",
  help: "Menor número aparece primero.",
};
const ACTIVO: Field = {
  name: "activo",
  label: "Activo",
  type: "boolean",
};

// Íconos lucide disponibles para Beneficios (deben existir en el registry de
// components/sections/Beneficios.tsx).
const ICONOS_BENEFICIOS = [
  "LandPlot",
  "Users",
  "Trophy",
  "Shirt",
  "Dumbbell",
  "Flame",
].map((v) => ({ value: v, label: v }));

export const RESOURCES: Record<string, Resource> = {
  hero_slides: {
    table: "hero_slides",
    label: "Slides del hero",
    singular: "slide",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "title", label: "Título", type: "text", required: true, primary: true },
      { name: "texto", label: "Descripción", type: "textarea", required: true },
      { name: "image_url", label: "Imagen de fondo", type: "image", required: true },
      { name: "alt", label: "Texto alternativo", type: "text" },
      ORDEN,
      ACTIVO,
    ],
  },

  servicios: {
    table: "servicios",
    label: "Servicios",
    singular: "servicio",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "title", label: "Título", type: "text", required: true, primary: true },
      { name: "texto", label: "Descripción", type: "textarea", required: true },
      { name: "image_url", label: "Imagen", type: "image" },
      { name: "alt", label: "Texto alternativo", type: "text" },
      { name: "href", label: "Enlace", type: "text" },
      ORDEN,
      ACTIVO,
    ],
  },

  clases: {
    table: "clases",
    label: "Clases",
    singular: "clase",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "numero", label: "Número", type: "text", required: true, help: 'Ej: "01"' },
      { name: "title", label: "Título", type: "text", required: true, primary: true },
      { name: "texto", label: "Descripción", type: "textarea", required: true },
      { name: "href", label: "Enlace", type: "text" },
      ORDEN,
      ACTIVO,
    ],
  },

  beneficios: {
    table: "beneficios",
    label: "Beneficios",
    singular: "beneficio",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "title", label: "Título", type: "text", required: true, primary: true },
      { name: "texto", label: "Descripción", type: "textarea", required: true },
      { name: "icono", label: "Ícono", type: "select", required: true, options: ICONOS_BENEFICIOS },
      {
        name: "columna",
        label: "Columna",
        type: "select",
        options: [
          { value: "left", label: "Izquierda" },
          { value: "right", label: "Derecha" },
        ],
      },
      ORDEN,
      ACTIVO,
    ],
  },

  coaches: {
    table: "coaches",
    label: "Entrenadores",
    singular: "entrenador",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true, primary: true },
      { name: "cargo", label: "Cargo", type: "text", required: true },
      { name: "descripcion", label: "Descripción", type: "textarea", required: true },
      { name: "foto_url", label: "Foto", type: "image" },
      ORDEN,
      ACTIVO,
    ],
  },

  testimonios: {
    table: "testimonios",
    label: "Testimonios",
    singular: "testimonio",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "autor", label: "Autor", type: "text", required: true, primary: true },
      { name: "rol", label: "Rol", type: "text", required: true },
      { name: "texto", label: "Testimonio", type: "textarea", required: true },
      { name: "foto_url", label: "Foto", type: "image" },
      ORDEN,
      ACTIVO,
    ],
  },

  estadisticas: {
    table: "estadisticas",
    label: "Estadísticas",
    singular: "estadística",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "valor", label: "Valor", type: "text", required: true, primary: true, help: 'Ej: "124"' },
      { name: "label", label: "Etiqueta", type: "text", required: true },
      ORDEN,
      ACTIVO,
    ],
  },

  sponsors: {
    table: "sponsors",
    label: "Sponsors",
    singular: "sponsor",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true, primary: true },
      { name: "logo_url", label: "Logo", type: "image" },
      ORDEN,
      ACTIVO,
    ],
  },

  nav_links: {
    table: "nav_links",
    label: "Links de navegación",
    singular: "link",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "label", label: "Texto", type: "text", required: true, primary: true },
      { name: "href", label: "Destino", type: "text", required: true, help: 'Ej: "#reservas"' },
      ORDEN,
      ACTIVO,
    ],
  },

  footer_fotos: {
    table: "footer_fotos",
    label: "Fotos del footer",
    singular: "foto",
    orderBy: { column: "orden", ascending: true },
    fields: [
      { name: "image_url", label: "Imagen", type: "image", required: true, primary: true },
      ORDEN,
      ACTIVO,
    ],
  },

  partidos: {
    table: "partidos",
    label: "Partidos",
    singular: "partido",
    orderBy: { column: "fecha", ascending: true },
    fields: [
      { name: "fecha", label: "Fecha y hora", type: "datetime", required: true, primary: true },
      { name: "jugadores", label: "Jugadores", type: "text", required: true, help: 'Ej: "J. Pérez vs M. Torres"' },
      { name: "cancha", label: "Cancha", type: "text", required: true },
      ACTIVO,
    ],
  },
};

export function getResource(key: string): Resource | null {
  return RESOURCES[key] ?? null;
}
