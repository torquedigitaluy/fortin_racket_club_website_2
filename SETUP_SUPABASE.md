# Configuración manual — Supabase Auth, CMS y Reservas

Esta guía lista **todo lo que tenés que configurar vos** para que funcione la
nueva capa de Auth + CMS + reservas. Mientras no completes estos pasos, el sitio
sigue andando con datos de ejemplo (mock) y el panel `/admin` muestra avisos.

## 1. Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

| Variable | Dónde se obtiene | Notas |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` | pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` `secret` | **SOLO servidor. Nunca `NEXT_PUBLIC_`.** Bypassa RLS; se usa para registrar reservas. |
| `MERCADOPAGO_ACCESS_TOKEN` | Mercado Pago (cuando lo conectes) | dejar vacío por ahora (pagos mockeados) |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Mercado Pago | dejar vacío por ahora |

> En producción (Vercel u otro host) cargá las mismas variables en el panel de
> entorno del proyecto.

## 2. Aplicar las migraciones (tablas + RLS + storage)

Las migraciones están en `supabase/migrations/` (`0001`…`0006`). Como ya
conectaste el repo de GitHub a Supabase, se aplican **al hacer push**.

1. Hacé commit y push de la carpeta `supabase/migrations/`.
2. Verificá en Supabase → **Database → Migrations** que `0001`…`0006` se
   aplicaron sin error.

Si preferís correrlas a mano, pegá cada archivo en Supabase → **SQL Editor** en
orden numérico.

## 3. Crear el primer administrador

1. **Deshabilitar registro público**: Authentication → Providers → **Email** →
   apagá *"Allow new users to sign up"*. (Opcional: apagá *"Confirm email"* para
   que el admin pueda entrar sin confirmar.)
2. **URL Configuration**: Authentication → URL Configuration → seteá *Site URL*
   (`http://localhost:3000` en desarrollo y tu dominio en producción) y agregá
   ambas a *Redirect URLs*.
3. **Crear el usuario**: Authentication → **Users → Add user** → email +
   contraseña, marcá el email como confirmado. Un trigger le crea
   automáticamente su fila en `profiles` con rol `viewer`.
4. **Promoverlo a admin**: en **SQL Editor** corré:
   ```sql
   update public.profiles set role = 'admin'
   where email = 'fabian.vipermed@gmail.com';
   ```

Ahora podés entrar a `/admin/login` con ese usuario.

## 4. Storage de imágenes

El bucket público `media` lo crea la migración `0006`. Si por algún motivo no se
creó, hacelo a mano: Storage → **New bucket** → nombre `media` → marcá **Public**.

El CMS sube las imágenes a este bucket y guarda la URL pública.

## 5. Imágenes en `next.config.mjs`

Ya está agregado `*.supabase.co` a `images.remotePatterns`, así que `next/image`
puede renderizar las imágenes subidas. No necesitás tocar nada salvo que tu
proyecto use un dominio de storage distinto.

## 6. Mercado Pago (más adelante)

Cuando tengas la cuenta, completá `MERCADOPAGO_ACCESS_TOKEN`. Hasta entonces, al
comprar un plan o reservar una cancha la UI avisa *"el pago aún no está
disponible"* — pero la **reserva sí se registra** en la tabla `reservas` (si
está la `SUPABASE_SERVICE_ROLE_KEY`).

---

## ¿Qué podés gestionar desde `/admin`?

- **Ajustes del sitio**: contacto, redes, banner promocional, newsletter, precio
  por hora.
- **Contenido**: slides del hero, servicios, clases, beneficios, entrenadores,
  planes de socio (matriz de ventajas), testimonios, estadísticas, sponsors,
  links de navegación, fotos del footer.
- **Operación**: partidos (agenda), reservas (ver/bloquear turnos por fecha),
  suscriptores del newsletter.

Todo el contenido cae a datos de ejemplo si falta una tabla o credencial, así
que la web nunca se rompe durante la configuración.
