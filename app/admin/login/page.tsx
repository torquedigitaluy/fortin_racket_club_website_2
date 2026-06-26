"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-full bg-brand px-6 py-3 font-mulish text-sm font-semibold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Ingresando…" : "Ingresar"}
    </button>
  );
}

export default function LoginPage() {
  const [error, formAction] = useFormState(signIn, null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-offwhite px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="font-kanit text-2xl font-bold text-brand">
          Panel de administración
        </h1>
        <p className="mt-1 font-mulish text-sm text-brand/60">
          Fortín Racket Club
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1 font-mulish text-sm text-brand">
            Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="rounded-lg border border-brand/20 px-3 py-2 font-mulish text-brand outline-none focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1 font-mulish text-sm text-brand">
            Contraseña
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="rounded-lg border border-brand/20 px-3 py-2 font-mulish text-brand outline-none focus:border-brand"
            />
          </label>

          {error && (
            <p className="font-mulish text-sm text-red-600">{error}</p>
          )}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
