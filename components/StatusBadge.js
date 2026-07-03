const ESTILOS_ESTADO = {
  abierto: "bg-amber-100 text-amber-800",
  en_proceso: "bg-sky-100 text-sky-800",
  resuelto: "bg-emerald-100 text-emerald-800",
  cerrado: "bg-slate-200 text-slate-700",
};

const ETIQUETAS_ESTADO = {
  abierto: "Abierto",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
};

const ESTILOS_PRIORIDAD = {
  baja: "bg-slate-100 text-slate-600",
  media: "bg-blue-100 text-blue-700",
  alta: "bg-orange-100 text-orange-700",
  urgente: "bg-red-100 text-red-700",
};

export function EstadoBadge({ estado }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ESTILOS_ESTADO[estado] || "bg-slate-100 text-slate-700"}`}>
      {ETIQUETAS_ESTADO[estado] || estado}
    </span>
  );
}

export function PrioridadBadge({ prioridad }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ESTILOS_PRIORIDAD[prioridad] || "bg-slate-100 text-slate-700"}`}>
      {prioridad}
    </span>
  );
}
