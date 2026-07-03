"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { EstadoBadge, PrioridadBadge } from "@/components/StatusBadge";

const ESTADOS = ["abierto", "en_proceso", "resuelto", "cerrado"];

export default function DetalleTicketPage() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [soporte, setSoporte] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [aviso, setAviso] = useState("");

  const cargarDatos = useCallback(async () => {
    try {
      const [t, c] = await Promise.all([
        api.get(`/api/tickets/${id}`),
        api.get(`/api/tickets/${id}/comentarios`),
      ]);
      setTicket(t);
      setComentarios(c);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cargar el ticket.");
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    if (usuario?.rol === "administrador") {
      api.get("/api/users/soporte").then(setSoporte).catch(() => {});
    }
  }, [usuario]);

  async function handleCambiarEstado(estado) {
    setAviso("");
    try {
      const actualizado = await api.put(`/api/tickets/${id}/estado`, { estado });
      setTicket((t) => ({ ...t, estado: actualizado.estado, fechaResolucion: actualizado.fechaResolucion }));
      setAviso(`Estado actualizado a "${estado.replace("_", " ")}".`);
      cargarDatos();
    } catch (err) {
      setAviso(err instanceof ApiError ? err.message : "No se pudo actualizar el estado.");
    }
  }

  async function handleAsignar(soporteId) {
    setAviso("");
    try {
      const actualizado = await api.put(`/api/tickets/${id}/asignar`, { soporteId: soporteId || null });
      setTicket((t) => ({ ...t, asignadoA: actualizado.asignadoA, estado: actualizado.estado }));
      setAviso("Responsable actualizado correctamente.");
      cargarDatos();
    } catch (err) {
      setAviso(err instanceof ApiError ? err.message : "No se pudo asignar el responsable.");
    }
  }

  async function handleComentario(e) {
    e.preventDefault();
    if (!mensaje.trim()) return;
    setEnviandoComentario(true);
    try {
      const nuevo = await api.post(`/api/tickets/${id}/comentarios`, { mensaje });
      setComentarios((c) => [...c, nuevo]);
      setMensaje("");
    } catch (err) {
      setAviso(err instanceof ApiError ? err.message : "No se pudo enviar el comentario.");
    } finally {
      setEnviandoComentario(false);
    }
  }

  if (cargando) return <p className="text-sm text-slate-500">Cargando ticket…</p>;
  if (error)
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
        {error}{" "}
        <button onClick={() => router.push("/dashboard/tickets")} className="underline">
          Volver a mis tickets
        </button>
      </div>
    );
  if (!ticket) return null;

  const esSoporteAsignado =
    usuario?.rol === "soporte" && String(ticket.asignadoA?._id) === String(usuario.id);
  const puedeCambiarEstado = usuario?.rol === "administrador" || esSoporteAsignado;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              {ticket.codigo} &middot; {ticket.titulo}
            </h1>
            <div className="flex gap-2">
              <PrioridadBadge prioridad={ticket.prioridad} />
              <EstadoBadge estado={ticket.estado} />
            </div>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm text-slate-700">{ticket.descripcion}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Categoría</dt>
              <dd className="font-medium capitalize text-slate-800">{ticket.categoria}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Cliente</dt>
              <dd className="font-medium text-slate-800">{ticket.cliente?.nombre}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Asignado a</dt>
              <dd className="font-medium text-slate-800">
                {ticket.asignadoA?.nombre || "Sin asignar"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Historial de atención</h2>

          <ul className="mt-4 space-y-4">
            {comentarios.map((c) => (
              <li key={c._id} className="border-l-2 border-sky-200 pl-4">
                <p className="text-sm text-slate-700">{c.mensaje}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {c.autor?.nombre} ({c.autor?.rol}) &middot;{" "}
                  {new Date(c.createdAt).toLocaleString("es-PE")}
                </p>
              </li>
            ))}
            {comentarios.length === 0 && (
              <p className="text-sm text-slate-400">Aún no hay actividad registrada.</p>
            )}
          </ul>

          <form onSubmit={handleComentario} className="mt-6 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un comentario para el historial…"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
            <button
              type="submit"
              disabled={enviandoComentario}
              className="rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
            >
              Comentar
            </button>
          </form>
        </div>
      </div>

      <aside className="space-y-6">
        {aviso && (
          <div className="rounded-md bg-sky-50 p-3 text-sm text-sky-700">{aviso}</div>
        )}

        {puedeCambiarEstado && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-700">Actualizar estado</h3>
            <select
              value={ticket.estado}
              onChange={(e) => handleCambiarEstado(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm capitalize shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        )}

        {usuario?.rol === "administrador" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-700">Asignar responsable</h3>
            <select
              value={ticket.asignadoA?._id || ""}
              onChange={(e) => handleAsignar(e.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="">Sin asignar</option>
              {soporte.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </aside>
    </div>
  );
}
