const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

class ApiError extends Error {
  constructor(mensaje, status, errores) {
    super(mensaje);
    this.status = status;
    this.errores = errores;
  }
}

async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(
      data?.mensaje || "Ocurrió un error inesperado",
      res.status,
      data?.errores
    );
  }

  return data;
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: "POST", body }),
  put: (path, body) => apiFetch(path, { method: "PUT", body }),
  delete: (path) => apiFetch(path, { method: "DELETE" }),
};

export { ApiError, API_URL };
