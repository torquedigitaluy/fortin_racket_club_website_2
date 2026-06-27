import { getHeroSlides } from "@/lib/heroSlides";
import { getSettings } from "@/lib/settings";
import HeroCarousel from "./HeroCarousel";
import HeroVideo from "./HeroVideo";

/**
 * Server wrapper del hero. Según `hero_modo` muestra el video en loop o la
 * galería de imágenes. Si el modo es video pero falta la URL, cae a la galería
 * (resiliencia: la home nunca queda sin hero).
 */
export default async function Hero() {
  const [slides, settings] = await Promise.all([getHeroSlides(), getSettings()]);

  if (settings.hero_modo === "video" && settings.hero_video_url) {
    return (
      <HeroVideo
        videoUrl={settings.hero_video_url}
        videoMovilUrl={settings.hero_video_movil_url}
        posterUrl={settings.hero_video_poster_url}
        titulo={settings.hero_video_titulo}
        texto={settings.hero_video_texto}
        ctaLabel={settings.hero_video_cta_label}
        logoUrl={settings.hero_logo_url}
        logoAlt={settings.hero_logo_alt}
      />
    );
  }

  return (
    <HeroCarousel
      slides={slides}
      ctaLabel={settings.hero_cta_label}
      logoUrl={settings.hero_logo_url}
      logoAlt={settings.hero_logo_alt}
    />
  );
}
