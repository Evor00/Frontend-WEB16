"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

const INICIAL = { nombre: "", email: "", telefono: "", password: "", confirmar: "" };

export default function RegisterForm() {
  const { registrar } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(INICIAL);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validar() {
    if (form.nombre.trim().length < 2) return "El nombre debe tener al menos 2 caracteres.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Ingresa un correo válido.";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (form.password !== form.confirmar) return "Las contraseñas no coinciden.";
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
      await registrar({
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        password: form.password,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-slate-700">
          Nombre completo
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          minLength={2}
          value={form.nombre}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-slate-700">
          Teléfono (opcional)
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={form.telefono}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
      </div>

      <div>
        <label htmlFor="confirmar" className="block text-sm font-medium text-slate-700">
          Confirmar contraseña
        </label>
        <input
          id="confirmar"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={form.confirmar}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-sky-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
