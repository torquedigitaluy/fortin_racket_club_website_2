# Hero: modo galería o video (toggle desde el CMS)

Fecha: 2026-06-27

## Objetivo

Permitir que la sección Hero muestre **una galería de imágenes** (comportamiento
actual) **o un video en loop**, eligible desde el CMS (`/admin/ajustes`). Lo que
el admin elija es lo que se renderiza en la home.

## Decisiones (de la fase de brainstorming)

- El texto del overlay en modo video sale de **campos propios del CMS** (no se
  reusan los slides).
- El **botón del overlay en video tiene su propio label** (`hero_video_cta_label`),
  independiente del de la galería (`hero_cta_label`).
- Unsplash no aloja videos; el default es un clip de tenis libre de derechos con
  URL `.mp4` directa (Pexels/Mixkit/Coverr), preferentemente cancha de polvo de
  ladrillo, si no uno genérico.

## Modelo de datos (sin migración de schema)

Nuevas claves en `site_settings` (key/value), con defaults en
`SETTINGS_DEFAULTS` de `lib/settings.ts`:

| Clave | Tipo de campo CMS | Default |
|-------|-------------------|---------|
| `hero_modo` | select: `galeria` / `video` | `galeria` |
| `hero_video_url` | video (upload o URL) | clip stock `.mp4` |
| `hero_video_poster_url` | imagen | foto de tenis (poster mientras carga) |
| `hero_video_titulo` | texto | "Fortín Racket Club" |
| `hero_video_texto` | multilínea | bajada |
| `hero_video_cta_label` | texto | "Saber más" |
| `hero_video_movil_url` | video (upload o URL) | clip vertical 9:16 de tenis |

El destino del botón se mantiene en `#quienes-somos` (igual que el carrusel).

## Video por dispositivo (escritorio vs móvil)

El admin define un video aparte para móvil (vertical 9:16). La selección es
automática por viewport: en pantallas ≤767px (breakpoint mobile de Tailwind) se
usa `hero_video_movil_url`; si está vacío, móvil cae al video de escritorio.

Implementación: `HeroVideoBg.tsx` (client) usa `window.matchMedia` para elegir
la fuente. El `<video>` se renderiza sin `src` en el servidor (solo poster) y la
fuente se setea al montar, así solo se descarga el video correcto y no hay
mismatch de hidratación. `key={src}` fuerza el remount para que el autoplay
arranque al cambiar de fuente (p. ej. al rotar el dispositivo). `HeroVideo` pasa
a ser server wrapper del overlay + este hijo client.

El bucket `media` es público y no restringe MIME, así que acepta `.mp4`. Aplica
el límite de tamaño por archivo de Supabase (50 MB por defecto) → usar clips
cortos y comprimidos.

## Componentes

- **`Hero.tsx`** (server, ya existe): trae `getHeroSlides()` + `getSettings()`.
  Decide por `settings.hero_modo`:
  - `video` **y** `hero_video_url` no vacío → renderiza `HeroVideo`.
  - cualquier otro caso → `HeroCarousel` (fallback resiliente).
- **`HeroVideo.tsx`** (nuevo, server — no requiere JS de cliente):
  `<video autoPlay muted loop playsInline preload="metadata" poster=…>` a
  pantalla completa (`h-screen min-h-[600px]`, `object-cover`), con el mismo
  overlay oscuro + título/bajada/CTA que el carrusel. Sin flechas ni dots.
- **`HeroCarousel.tsx`**: sin cambios.

## CMS (`/admin/ajustes`)

- En `lib/settings.ts`, extender el tipo de campo de `SETTINGS_GROUPS` con
  `select?: { value: string; label: string }[]` y `video?: true`.
- **`SettingsForm.tsx`**: renderizar `<select>` para campos con `select`, y un
  nuevo **`VideoUpload.tsx`** (hermano de `ImageUpload`, mismo `uploadMedia`,
  `accept="video/*"`, preview con `<video>`) para campos con `video`.
- Nuevo grupo **"Hero — modo y video"** con las 6 claves nuevas.

## Resiliencia

Si el modo es `video` pero falta `hero_video_url`, cae a la galería. El default
del video es un clip stock, así que la feature funciona sin que el admin suba
nada.

## Fuera de alcance

- No se migra el schema (todo es key/value en `site_settings`).
- No se agrega gestión de múltiples videos ni playlist: un único video de fondo.
