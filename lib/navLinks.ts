import { getSupabase } from "./supabase";

/**
 * Links de navegación (navbar y footer). Tabla `nav_links`.
 */
export type NavLink = { label: string; href: string };

const MOCK_NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "¿Quiénes somos?", href: "#quienes-somos" },
  { label: "Reservas", href: "#reservas" },
  { label: "Socios", href: "#socios" },
  { label: "Actividades", href: "#actividades" },
  { label: "Contacto", href: "#contacto" },
];

export async function getNavLinks(): Promise<NavLink[]> {
  const supabase = getSupabase();
  if (!supabase) return MOCK_NAV_LINKS;

  const { data, error } = await supabase
    .from("nav_links")
    .select("label, href")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[nav_links] usando mock:", error.message);
    return MOCK_NAV_LINKS;
  }

  return data as NavLink[];
}
