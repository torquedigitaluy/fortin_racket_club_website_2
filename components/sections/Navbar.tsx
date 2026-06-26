import { getNavLinks } from "@/lib/navLinks";
import NavbarClient from "./NavbarClient";

/**
 * Server wrapper: trae los links de navegación y delega el comportamiento
 * (scroll, menú móvil) al componente cliente.
 */
export default async function Navbar() {
  const navLinks = await getNavLinks();
  return <NavbarClient navLinks={navLinks} />;
}
