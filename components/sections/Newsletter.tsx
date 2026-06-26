"use client";

import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { subscribeNewsletter } from "@/lib/public-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="whitespace-nowrap rounded-full bg-lime px-8 py-3.5 font-mulish text-sm font-semibold text-brand transition-transform hover:scale-105 disabled:opacity-60"
    >
      {pending ? "Enviando…" : "Suscribirme"}
    </button>
  );
}

export default function Newsletter({
  titulo = "Sumate a nuestro newsletter",
  texto = "Recibí novedades, torneos y promociones exclusivas para la comunidad del club.",
}: {
  titulo?: string;
  texto?: string;
}) {
  const [state, formAction] = useFormState(subscribeNewsletter, null);

  return (
    <section className="relative overflow-hidden">
      {/* Fondo: raquetas cruzadas */}
      <Image
        src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        sizes="100vw"
        unoptimized
        className="object-cover"
      />
      {/* Overlay #142d4b al 75% */}
      <div className="absolute inset-0 bg-brand/75" />

      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center text-white md:py-20">
        <h2 className="font-kanit text-3xl font-bold md:text-4xl">{titulo}</h2>
        <p className="mx-auto mt-3 max-w-xl font-mulish text-white/80">{texto}</p>

        {state?.ok ? (
          <p className="mt-8 font-mulish font-semibold text-lime">{state.msg}</p>
        ) : (
          <form
            action={formAction}
            className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Tu correo electrónico"
              aria-label="Correo electrónico"
              className="w-full rounded-full bg-white px-6 py-3.5 font-mulish text-sm text-brand outline-none ring-lime focus:ring-2"
            />
            <SubmitButton />
          </form>
        )}

        {state && !state.ok && (
          <p className="mt-4 font-mulish text-sm text-white/90">{state.msg}</p>
        )}
      </div>
    </section>
  );
}
