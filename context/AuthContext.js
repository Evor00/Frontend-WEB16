"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  const cargarPerfil = useCallback(async () => {
    try {
      const data = await api.get("/api/auth/me");
      setUsuario(data.usuario);
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  async function iniciarSesion(email, password) {
    const data = await api.post("/api/auth/login", { email, password });
    setToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }

  async function registrar(payload) {
    const data = await api.post("/api/auth/register", payload);
    setToken(data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }

  async function cerrarSesion() {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // si la petición falla igual limpiamos la sesión local
    }
    setToken(null);
    setUsuario(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, iniciarSesion, registrar, cerrarSesion, cargarPerfil }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
