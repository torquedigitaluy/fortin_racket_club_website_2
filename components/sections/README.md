# Componentes de sección

Un componente por sección de `PLAN.md`, en orden. Se van componiendo en `app/page.tsx`.

Todo el contenido se lee ahora desde Supabase mediante los getters de `lib/*`
(con fallback a datos mock si faltan credenciales o la tabla está vacía). Las
secciones con interactividad usan el patrón **wrapper Server + hijo Client**: el
wrapper (`Componente.tsx`) hace el `await getX()` y le pasa los datos por props al
hijo Client (`ComponenteClient.tsx`), que mantiene el estado.

| #  | Componente            | Datos (lib / tabla)                       | Tipo                         |
|----|-----------------------|-------------------------------------------|------------------------------|
| 1  | `Navbar`              | `navLinks` / `nav_links`                  | Server + `NavbarClient`      |
| 2  | `Hero`                | `heroSlides` / `hero_slides` + settings   | Server + `HeroCarousel`      |
| 3  | `Servicios`           | `servicios` / `servicios`                 | Server                       |
| 4  | `ClasesPersonalizadas`| `clases` / `clases`                       | Server                       |
| 5  | `TorneoCalendario`    | `partidos` / `partidos`                   | Server                       |
| 6  | `Beneficios`          | `beneficios` / `beneficios`               | Server                       |
| 7  | `CtaPatrocinadores`   | `sponsors` / `sponsors` + settings        | Server (marquee CSS)         |
| 8  | `Entrenadores`        | `coaches` / `coaches`                     | Server                       |
| 9  | `PlanesSocio`         | `planes` / `planes`+`plan_features`+matriz| Server + `PlanesSocioClient` |
| 10 | `ReservaCanchas`      | `disponibilidad` (RPC) + settings precio  | Server + `ReservaCanchasClient` |
| 11 | `Estadisticas`        | `estadisticas` / `estadisticas`           | Server                       |
| 12 | `Testimonials`        | `testimonios` / `testimonios`             | Server + `TestimonialsCarousel` |
| 13 | `Newsletter`+`Footer` | settings + `footerFotos` + `navLinks`     | Client form / Server+`FooterClient` |

El contenido se gestiona desde el panel `/admin` (ver `app/admin/` y
`lib/admin/`). Pagos con Mercado Pago siguen mockeados hasta cargar el token.
