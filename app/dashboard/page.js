"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const TARJETAS = [
  { clave: "abiertos", label: "Abiertos", color: "bg-amber-50 text-amber-700" },
  { clave: "enProceso", label: "En proceso", color: "bg-sky-50 text-sky-700" },
  { clave: "resueltos", label: "Resueltos", color: "bg-emerald-50 text-emerald-700" },
  { clave: "cerrados", label: "Cerrados", color: "bg-slate-100 text-slate-700" },
  { clave: "total", label: "Total", color: "bg-indigo-50 text-indigo-700" },
];

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/tickets/stats/resumen")
      .then(setStats)
      .catch(() => setError("No se pudieron cargar las estadísticas."));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Hola, {usuario?.nombre?.split(" ")[0]} 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500 capitalize">Rol: {usuario?.rol}</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TARJETAS.map((t) => (
          <div key={t.clave} className={`rounded-xl p-4 ${t.color}`}>
            <p className="text-sm font-medium">{t.label}</p>
            <p className="mt-2 text-3xl font-bold">{stats ? stats[t.clave] : "—"}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        {usuario?.rol === "cliente" && (
          <Link
            href="/dashboard/tickets/nuevo"
            className="rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-800"
          >
            + Crear nuevo ticket
          </Link>
        )}
        <Link
          href="/dashboard/tickets"
          className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Ver tickets
        </Link>
        {usuario?.rol === "administrador" && (
          <Link
            href="/dashboard/usuarios"
            className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Gestionar usuarios
          </Link>
        )}
      </div>
    </div>
  );
}
