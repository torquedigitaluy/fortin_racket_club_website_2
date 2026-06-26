import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

/**
 * Editor de ajustes del sitio (textos singulares de site_settings).
 */
export default async function AjustesPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-2 font-kanit text-3xl font-bold text-brand">
        Ajustes del sitio
      </h1>
      <p className="mb-8 font-mulish text-brand/60">
        Textos de contacto, redes, banner promocional y newsletter.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
