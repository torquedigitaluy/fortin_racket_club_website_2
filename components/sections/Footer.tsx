import { getNavLinks } from "@/lib/navLinks";
import { getFooterFotos } from "@/lib/footerFotos";
import { getSettings } from "@/lib/settings";
import FooterClient from "./FooterClient";

/**
 * Server wrapper: trae enlaces, fotos y ajustes (contacto, redes, whatsapp) y
 * delega el botón "volver al inicio" al componente cliente.
 */
export default async function Footer() {
  const [enlaces, fotos, settings] = await Promise.all([
    getNavLinks(),
    getFooterFotos(),
    getSettings(),
  ]);

  return <FooterClient enlaces={enlaces} fotos={fotos} settings={settings} />;
}
