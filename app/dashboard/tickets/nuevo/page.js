"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";

const INICIAL = { titulo: "", descripcion: "", categoria: "otro", prioridad: "media" };

export default function NuevoTicketPage() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(INICIAL);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (usuario && usuario.rol !== "cliente") {
    return (
      <p className="rounded-md bg-amber-50 p-4 text-sm text-amber-700">
        Solo los clientes pueden crear tickets nuevos.
      </p>
    );
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validar() {
    if (form.titulo.trim().length < 5) return "El título debe tener al menos 5 caracteres.";
    if (form.descripcion.trim().length < 10)
      return "La descripción debe tener al menos 10 caracteres.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const mensajeError = validar();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setError("");
    setEnviando(true);
    try {
      const ticket = await api.post("/api/tickets", form);
      router.push(`/dashboard/tickets/${ticket._id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear el ticket.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Crear nuevo ticket</h1>
      <p className="mt-1 text-sm text-slate-500">
        Describe tu incidencia con el mayor detalle posible para agilizar la atención.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {error && (
          <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-slate-700">
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            minLength={5}
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ej. No puedo acceder a mi correo institucional"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-slate-700">
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="red">Red</option>
              <option value="accesos">Accesos</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="prioridad" className="block text-sm font-medium text-slate-700">
              Prioridad
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={form.prioridad}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            required
            minLength={10}
            rows={5}
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Explica qué ocurre, cuándo empezó y qué has intentado hacer."
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {enviando ? "Enviando…" : "Crear ticket"}
        </button>
      </form>
    </div>
  );
}
