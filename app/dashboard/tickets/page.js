"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { EstadoBadge, PrioridadBadge } from "@/components/StatusBadge";

const ESTADOS = ["", "abierto", "en_proceso", "resuelto", "cerrado"];

export default function ListaTicketsPage() {
  const { usuario } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    setCargando(true);
    const query = filtroEstado ? `?estado=${filtroEstado}` : "";
    api
      .get(`/api/tickets${query}`)
      .then(setTickets)
      .catch(() => setError("No se pudieron cargar los tickets."))
      .finally(() => setCargando(false));
  }, [filtroEstado]);

  const titulo =
    usuario?.rol === "cliente"
      ? "Mis tickets"
      : usuario?.rol === "soporte"
      ? "Tickets asignados a mí"
      : "Todos los tickets";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
        {usuario?.rol === "cliente" && (
          <Link
            href="/dashboard/tickets/nuevo"
            className="rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-800"
          >
            + Nuevo ticket
          </Link>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ESTADOS.map((estado) => (
          <button
            key={estado || "todos"}
            onClick={() => setFiltroEstado(estado)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              filtroEstado === estado
                ? "bg-sky-700 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {estado ? estado.replace("_", " ") : "Todos"}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {cargando && <p className="mt-6 text-sm text-slate-500">Cargando tickets…</p>}

      {!cargando && tickets.length === 0 && !error && (
        <p className="mt-8 rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No hay tickets para mostrar.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Código</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Título</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Prioridad</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Estado</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Cliente</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Asignado a</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/tickets/${ticket._id}`}
                    className="font-medium text-sky-700 hover:underline"
                  >
                    {ticket.codigo}
                  </Link>
                </td>
                <td className="max-w-xs truncate px-4 py-3">{ticket.titulo}</td>
                <td className="px-4 py-3">
                  <PrioridadBadge prioridad={ticket.prioridad} />
                </td>
                <td className="px-4 py-3">
                  <EstadoBadge estado={ticket.estado} />
                </td>
                <td className="px-4 py-3 text-slate-600">{ticket.cliente?.nombre}</td>
                <td className="px-4 py-3 text-slate-600">
                  {ticket.asignadoA?.nombre || "Sin asignar"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
