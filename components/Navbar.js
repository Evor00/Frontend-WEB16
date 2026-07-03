"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ENLACES_POR_ROL = {
  cliente: [
    { href: "/dashboard", label: "Panel" },
    { href: "/dashboard/tickets", label: "Mis tickets" },
    { href: "/dashboard/tickets/nuevo", label: "Nuevo ticket" },
  ],
  soporte: [
    { href: "/dashboard", label: "Panel" },
    { href: "/dashboard/tickets", label: "Tickets asignados" },
  ],
  administrador: [
    { href: "/dashboard", label: "Panel" },
    { href: "/dashboard/tickets", label: "Todos los tickets" },
    { href: "/dashboard/usuarios", label: "Usuarios" },
  ],
};

export default function Navbar() {
  const { usuario, cerrarSesion, cargando } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  const enlaces = usuario ? ENLACES_POR_ROL[usuario.rol] || [] : [];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-sky-700">
          <span aria-hidden="true">🎧</span>
          HelpDesk Tecsup
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-md p-2 text-slate-700 sm:hidden"
          aria-label="Abrir menú de navegación"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {abierto ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <div className="hidden items-center gap-6 sm:flex">
          {!cargando && enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={`text-sm font-medium transition-colors hover:text-sky-700 ${
                pathname === enlace.href ? "text-sky-700" : "text-slate-600"
              }`}
            >
              {enlace.label}
            </Link>
          ))}

          {!cargando && usuario ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {usuario.nombre} · <span className="capitalize">{usuario.rol}</span>
              </span>
              <button
                onClick={cerrarSesion}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            !cargando && (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-sky-700">
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-sky-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-800"
                >
                  Crear cuenta
                </Link>
              </div>
            )
          )}
        </div>
      </nav>

      {abierto && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-3">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={() => setAbierto(false)}
                className="text-sm font-medium text-slate-700"
              >
                {enlace.label}
              </Link>
            ))}
            {usuario ? (
              <button
                onClick={cerrarSesion}
                className="text-left text-sm font-medium text-red-600"
              >
                Cerrar sesión ({usuario.nombre})
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setAbierto(false)} className="text-sm font-medium text-slate-700">
                  Ingresar
                </Link>
                <Link href="/register" onClick={() => setAbierto(false)} className="text-sm font-medium text-sky-700">
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
