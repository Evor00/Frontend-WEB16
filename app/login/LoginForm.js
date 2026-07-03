"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function LoginForm() {
  const { iniciarSesion } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Completa tu correo y contraseña.");
      return;
    }

    setEnviando(true);
    try {
      await iniciarSesion(form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión.");
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
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-md bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Ingresando…" : "Ingresar"}
      </button>

      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-sky-700 hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
