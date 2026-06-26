import { getHeroSlides } from "@/lib/heroSlides";
import { getSettings } from "@/lib/settings";
import HeroCarousel from "./HeroCarousel";

/**
 * Server wrapper: trae los slides y el texto del CTA, y delega la interacción
 * (slider, autoplay, flechas) al componente cliente HeroCarousel.
 */
export default async function Hero() {
  const [slides, settings] = await Promise.all([getHeroSlides(), getSettings()]);

  return (
    <HeroCarousel slides={slides} ctaLabel={settings.hero_cta_label} />
  );
}
