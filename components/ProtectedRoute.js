"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;
    if (!usuario) {
      router.replace("/login");
      return;
    }
    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
      router.replace("/dashboard");
    }
  }, [usuario, cargando, rolesPermitidos, router]);

  if (cargando || !usuario || (rolesPermitidos && !rolesPermitidos.includes(usuario.rol))) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-500">Cargando…</p>
      </div>
    );
  }

  return children;
}
