import { NextResponse } from "next/server";
import { createCheckoutPreference } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/checkout
 * Body: {
 *   title: string, price: number, quantity?: number, reference?: string,
 *   reserva?: { cancha, fecha, hora, nombre?, email? }
 * }
 *
 * Si viene `reserva`, primero registra la fila en `reservas` (estado
 * 'reservado') vía la service-role key. Si el turno ya está tomado (violación
 * de UNIQUE) devuelve 409. Luego crea la preferencia de Mercado Pago (que sigue
 * mockeada mientras no haya token) y devuelve:
 *   { configured: true, url }   → redirigir al usuario a `url`
 *   { configured: false }       → MP aún no configurado (mostrar aviso)
 */
type Reserva = {
  cancha: string;
  fecha: string;
  hora: number;
  nombre?: string;
  email?: string;
};

export async function POST(req: Request) {
  let payload: {
    title?: string;
    price?: number;
    quantity?: number;
    reference?: string;
    reserva?: Reserva;
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { title, price, quantity = 1, reference, reserva } = payload;

  if (!title || typeof price !== "number" || price <= 0) {
    return NextResponse.json(
      { error: "Faltan datos válidos (title, price)" },
      { status: 400 }
    );
  }

  // Registrar la reserva antes del pago (si corresponde).
  // Guardamos el cliente admin y el id insertado para poder revertir si el pago
  // falla (en modo mock —MP sin token— la reserva queda registrada a propósito).
  const admin = reserva ? createAdminClient() : null;
  let reservaId: number | null = null;

  if (reserva && admin) {
    const { data, error } = await admin
      .from("reservas")
      .insert({
        cancha: reserva.cancha,
        fecha: reserva.fecha,
        hora: reserva.hora,
        estado: "reservado",
        nombre: reserva.nombre ?? null,
        email: reserva.email ?? null,
        mp_reference: reference ?? null,
      })
      .select("id")
      .single();

    if (error) {
      // 23505 = unique_violation → turno ya tomado.
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ese turno ya fue reservado" },
          { status: 409 }
        );
      }
      console.error("[checkout] error insertando reserva:", error);
      return NextResponse.json(
        { error: "No se pudo registrar la reserva" },
        { status: 502 }
      );
    }

    reservaId = data?.id ?? null;
  }

  try {
    const result = await createCheckoutPreference(
      [{ title, quantity, unit_price: price }],
      { externalReference: reference }
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("[checkout]", err);
    // El pago falló: revertimos la reserva para no dejar el turno bloqueado.
    if (admin && reservaId != null) {
      await admin.from("reservas").delete().eq("id", reservaId);
    }
    return NextResponse.json(
      { error: "No se pudo iniciar el pago" },
      { status: 502 }
    );
  }
}
