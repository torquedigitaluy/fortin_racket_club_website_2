import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";
import { ADMIN_NAV } from "@/lib/admin/nav";

/**
 * Layout del panel (rutas protegidas). El grupo (panel) deja fuera a
 * /admin/login, evitando un loop de redirección.
 */
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-offwhite">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-brand/10 bg-white">
        <div className="px-6 py-5">
          <Link href="/admin" className="font-kanit text-lg font-bold text-brand">
            Fortín CMS
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {ADMIN_NAV.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-3 pb-1 font-mulish text-xs font-semibold uppercase tracking-wider text-brand/40">
                {group.label}
              </p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 font-mulish text-sm text-brand/80 transition-colors hover:bg-offwhite hover:text-brand"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <form action={signOut} className="border-t border-brand/10 p-3">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left font-mulish text-sm text-brand/70 transition-colors hover:bg-offwhite hover:text-brand"
          >
            Cerrar sesión
          </button>
        </form>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
