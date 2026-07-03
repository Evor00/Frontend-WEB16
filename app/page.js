import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Inicio",
  description:
    "Registra incidencias, dales seguimiento y resuélvelas a tiempo con el Sistema de Mesa de Ayuda de Tecsup.",
};

const CARACTERISTICAS = [
  {
    titulo: "Registro de tickets",
    descripcion:
      "Los clientes reportan incidencias de hardware, software, red o accesos en segundos.",
    icono: "📝",
  },
  {
    titulo: "Asignación de responsables",
    descripcion:
      "El administrador asigna cada ticket al agente de soporte más adecuado.",
    icono: "🧑‍💻",
  },
  {
    titulo: "Seguimiento de estados",
    descripcion:
      "Controla el ciclo de vida: abierto, en proceso, resuelto y cerrado.",
    icono: "📊",
  },
  {
    titulo: "Historial de atención",
    descripcion:
      "Cada acción y comentario queda registrado para auditar la atención brindada.",
    icono: "🕒",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
              Evaluación Final &middot; Desarrollo de Aplicaciones Web Avanzado
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Sistema de Mesa de Ayuda <span className="text-sky-700">(Help Desk)</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Digitaliza la gestión de incidencias de tu empresa: crea tickets, asigna
              responsables, actualiza estados y mantén un historial completo de atención al
              cliente.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-md bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-sky-800"
              >
                Crear una cuenta
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Image
              src="/globe.svg"
              alt="Ilustración de una red global de soporte técnico conectado"
              width={56}
              height={56}
              priority
            />
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Roles del sistema
            </h2>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-xl">👤</span>
                <div>
                  <p className="font-semibold text-slate-800">Cliente</p>
                  <p className="text-sm text-slate-500">Crea tickets y consulta su estado.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-xl">🎧</span>
                <div>
                  <p className="font-semibold text-slate-800">Soporte</p>
                  <p className="text-sm text-slate-500">
                    Atiende los tickets asignados y actualiza su estado.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 text-xl">🛠️</span>
                <div>
                  <p className="font-semibold text-slate-800">Administrador</p>
                  <p className="text-sm text-slate-500">
                    Gestiona usuarios y asigna responsables a cada ticket.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Todo lo que necesitas para tu mesa de ayuda
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CARACTERISTICAS.map((c) => (
              <div
                key={c.titulo}
                className="rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md"
              >
                <span className="text-3xl" aria-hidden="true">
                  {c.icono}
                </span>
                <h3 className="mt-3 font-semibold text-slate-800">{c.titulo}</h3>
                <p className="mt-1 text-sm text-slate-500">{c.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
