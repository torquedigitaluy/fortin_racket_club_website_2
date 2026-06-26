import { getEstadisticas } from "@/lib/estadisticas";

export default async function Estadisticas() {
  const stats = await getEstadisticas();
  return (
    <section className="bg-brand py-16 text-white md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center ${
                i !== 0 ? "lg:border-l lg:border-white/15" : ""
              }`}
            >
              <span className="font-kanit text-5xl font-bold text-white md:text-6xl">
                {stat.valor}
              </span>
              <span className="mt-2 font-mulish text-sm font-medium uppercase tracking-widest text-white/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
