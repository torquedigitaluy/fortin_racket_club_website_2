import Link from "next/link";
import { getUser } from "@/lib/auth";
import { ADMIN_NAV } from "@/lib/admin/nav";

/**
 * Dashboard del panel. Saludo + accesos rápidos a todas las secciones.
 */
export default async function AdminHome() {
  const user = await getUser();

  return (
    <div>
      <h1 className="font-kanit text-3xl font-bold text-brand">
        Panel de administración
      </h1>
      <p className="mt-2 font-mulish text-brand/60">
        {user?.email
          ? `Conectado como ${user.email}`
          : "Gestioná el contenido del sitio"}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {ADMIN_NAV.flatMap((g) => g.items)
          .filter((i) => i.href !== "/admin")
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-brand/10 bg-white p-5 font-mulish text-sm font-semibold text-brand shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              {item.label}
            </Link>
          ))}
      </div>
    </div>
  );
}
