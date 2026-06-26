/**
 * Helper de cliente para iniciar un pago de Mercado Pago.
 * Llama a /api/checkout y, si está configurado, redirige al checkout.
 *
 * Devuelve el estado para que el componente decida qué mostrar:
 *   "redirect"       → se está redirigiendo a Mercado Pago
 *   "not_configured" → MP todavía no tiene token (modo desarrollo)
 *   "error"          → falló la creación del pago
 */
export type CheckoutStatus = "redirect" | "not_configured" | "error" | "taken";

/** Datos opcionales para registrar una reserva de cancha junto con el pago. */
export type ReservaInput = {
  cancha: string;
  fecha: string; // YYYY-MM-DD
  hora: number;
  nombre?: string;
  email?: string;
};

export async function startCheckout(input: {
  title: string;
  price: number;
  quantity?: number;
  reference?: string;
  reserva?: ReservaInput;
}): Promise<CheckoutStatus> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (res.status === 409) return "taken";
    if (!res.ok) return "error";

    const data = (await res.json()) as
      | { configured: false }
      | { configured: true; url: string };

    if (!data.configured) return "not_configured";

    window.location.href = data.url;
    return "redirect";
  } catch {
    return "error";
  }
}
