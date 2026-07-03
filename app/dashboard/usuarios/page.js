"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";

const INICIAL = { nombre: "", email: "", password: "", rol: "soporte", telefono: "" };

export default function UsuariosPage() {
  const { usuario: usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [form, setForm] = useState(INICIAL);
  const [enviando, setEnviando] = useState(false);

  async function cargarUsuarios() {
    setCargando(true);
    try {
      const data = await api.get("/api/users");
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  if (usuarioActual && usuarioActual.rol !== "administrador") {
    return (
      <p className="rounded-md bg-amber-50 p-4 text-sm text-amber-700">
        Solo el administrador puede gestionar usuarios.
      </p>
    );
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAviso("");
    if (form.nombre.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(form.email) || form.password.length < 6) {
      setAviso("Revisa los datos: nombre, correo válido y contraseña de al menos 6 caracteres.");
      return;
    }
    setEnviando(true);
    try {
      await api.post("/api/users", form);
      setForm(INICIAL);
      setAviso("Usuario creado correctamente.");
      cargarUsuarios();
    } catch (err) {
      setAviso(err instanceof ApiError ? err.message : "No se pudo crear el usuario.");
    } finally {
      setEnviando(false);
    }
  }

  async function toggleActivo(u) {
    try {
      await api.put(`/api/users/${u.id}`, { activo: !u.activo });
      cargarUsuarios();
    } catch (err) {
      setAviso(err instanceof ApiError ? err.message : "No se pudo actualizar el usuario.");
    }
  }

  async function eliminarUsuario(u) {
    if (!confirm(`¿Eliminar la cuenta de ${u.nombre}?`)) return;
    try {
      await api.delete(`/api/users/${u.id}`);
      cargarUsuarios();
    } catch (err) {
      setAviso(err instanceof ApiError ? err.message : "No se pudo eliminar el usuario.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Gestión de usuarios</h1>
      <p className="mt-1 text-sm text-slate-500">
        Crea cuentas de soporte o administración y gestiona el acceso de los usuarios.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-700">Nueva cuenta</h2>

          {aviso && <p className="mt-2 text-sm text-sky-700">{aviso}</p>}

          <div className="mt-3 space-y-3">
            <input
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
            <input
              name="telefono"
              placeholder="Teléfono (opcional)"
              value={form.telefono}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña temporal"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="soporte">Soporte</option>
              <option value="administrador">Administrador</option>
              <option value="cliente">Cliente</option>
            </select>
            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-800 disabled:opacity-60"
            >
              {enviando ? "Creando…" : "Crear usuario"}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white lg:col-span-2">
          {cargando && <p className="p-5 text-sm text-slate-500">Cargando usuarios…</p>}
          {error && <p className="p-5 text-sm text-red-600">{error}</p>}
          {!cargando && !error && (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Correo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Rol</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{u.nombre}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.rol}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          u.activo ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => toggleActivo(u)}
                          className="text-xs font-medium text-sky-700 hover:underline"
                        >
                          {u.activo ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={() => eliminarUsuario(u)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
