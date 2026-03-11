"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  MdCalendarMonth,
  MdCheckCircle,
  MdClose,
  MdDescription,
  MdInsertDriveFile,
  MdPerson,
} from "react-icons/md";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import api from "@/service/api.service";

type UserResumen = {
  id?: number;
  firstname?: string;
  lastname?: string;
};

type ActividadPropuesta = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  horaInicio: string;
  horaFin: string;
  capacidadMaxima: number | null;
  congresoId?: number | { id?: number; titulo?: string };
  convocatoriaId?: number | { id?: number; nombre?: string };
  userId?: number | UserResumen;
  archivoUrl?: string;
  estadoId?: string;
  createdAt?: string;
};

type PaginatedResponse<T> = {
  content?: T[];
  totalPages?: number;
  totalElements?: number;
  data?: T[] | PaginatedResponse<T>;
  items?: T[];
  totalItems?: number;
  total?: number;
};

const pageSize = 8;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });
};

const getStatusColor = (status?: string) => {
  const normalized = (status || "PENDIENTE").toUpperCase();
  if (normalized === "ACEPTADA" || normalized === "APROBADA") return "success" as const;
  if (normalized === "RECHAZADA") return "error" as const;
  return "warning" as const;
};

const resolveId = (value: unknown) => {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "id" in value) {
    const parsed = Number((value as { id?: unknown }).id);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const resolveContent = (response: PaginatedResponse<ActividadPropuesta> | ActividadPropuesta[]) => {
  if (Array.isArray(response)) {
    return { content: response, totalPages: 1, totalItems: response.length };
  }

  let nestedData: PaginatedResponse<ActividadPropuesta> | null = null;
  if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    nestedData = response.data;
  }

  let content: ActividadPropuesta[] = [];
  if (Array.isArray(response.content)) content = response.content;
  else if (Array.isArray(response.items)) content = response.items;
  else if (Array.isArray(response.data)) content = response.data;
  else if (Array.isArray(nestedData?.content)) content = nestedData.content;

  const totalPages = Number(response.totalPages ?? nestedData?.totalPages ?? 1);
  const totalItems = Number(
    response.totalElements ??
      response.totalItems ??
      response.total ??
      nestedData?.totalElements ??
      nestedData?.totalItems ??
      nestedData?.total ??
      content.length
  );

  return {
    content,
    totalPages: Number.isNaN(totalPages) ? 1 : Math.max(1, totalPages),
    totalItems: Number.isNaN(totalItems) ? content.length : totalItems,
  };
};

export default function PropuestasConvocatoriaPage() {
  const params = useParams<{ congresoId: string; convocatoriaId: string }>();
  const congresoId = Number(params?.congresoId || 0);
  const convocatoriaId = Number(params?.convocatoriaId || 0);

  const [items, setItems] = useState<ActividadPropuesta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadItems = useCallback(async () => {
    if (!convocatoriaId) return;

    setLoading(true);
    setError(null);
    try {
      const response = (await api.get(`/actividades/convocatoria/${convocatoriaId}`, {
        params: { page: currentPage - 1, size: pageSize },
      })) as PaginatedResponse<ActividadPropuesta> | ActividadPropuesta[];

      const parsed = resolveContent(response);
      setItems(parsed.content);
      setTotalItems(parsed.totalItems);
      setTotalPages(parsed.totalPages);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Error al cargar propuestas";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [convocatoriaId, currentPage]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const updateEstado = async (item: ActividadPropuesta, accepted: boolean) => {
    const nextEstado = accepted ? "ACEPTADA" : "RECHAZADA";

    const payload = {
      nombre: item.nombre,
      descripcion: item.descripcion,
      tipo: item.tipo,
      horaInicio: item.horaInicio,
      horaFin: item.horaFin,
      capacidadMaxima: Number(item.capacidadMaxima ?? 0),
      congresoId: resolveId(item.congresoId),
      convocatoriaId: resolveId(item.convocatoriaId),
      archivoUrl: item.archivoUrl || "",
      estadoId: nextEstado,
    };

    try {
      await api.put(`/actividades/${item.id}`, payload);
      toast.success(`Propuesta ${accepted ? "aceptada" : "rechazada"} con éxito`);
      await loadItems();
    } catch {
      toast.error(`No fue posible ${accepted ? "aceptar" : "rechazar"} la propuesta`);
    }
  };

  const hasItems = useMemo(() => items.length > 0, [items.length]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Propuestas por convocatoria</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Revisa propuestas enviadas por participantes y resuelve su estado.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/administrativo/congreso/${congresoId}/actividades/aprobadas`}
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
            >
              Ver aceptadas
            </Link>
            <Link
              href={`/administrativo/congreso?id=${congresoId}`}
              className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>

      {loading && <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm dark:border-gray-800 dark:bg-white/3">Cargando propuestas...</div>}
      {!loading && error && <div className="rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">{error}</div>}
      {!loading && !error && !hasItems && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          No hay propuestas registradas para esta convocatoria.
        </div>
      )}

      {!loading && !error && hasItems && (
        <div className="grid gap-4">
          {items.map((item) => {
            const user = item.userId && typeof item.userId === "object" ? item.userId : null;
            const userName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Participante";
            const estado = (item.estadoId || "PENDIENTE").toUpperCase();
            const cupoTexto = item.tipo?.toUpperCase() === "PONENCIA" && item.capacidadMaxima == null ? "Cupo ilimitado" : String(item.capacidadMaxima ?? 0);

            return (
              <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{item.nombre}</h3>
                  <Badge color={getStatusColor(estado)} size="sm">{estado}</Badge>
                </div>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.descripcion}</p>

                <div className="mt-4 grid gap-2 text-xs text-gray-700 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdDescription className="h-4 w-4 text-brand-500" />Tipo: {item.tipo || "-"}</p>
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdCalendarMonth className="h-4 w-4 text-brand-500" />Inicio: {formatDate(item.horaInicio)}</p>
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdCalendarMonth className="h-4 w-4 text-brand-500" />Fin: {formatDate(item.horaFin)}</p>
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdPerson className="h-4 w-4 text-brand-500" />{userName}</p>
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">Cupo: {cupoTexto}</p>
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">Creada: {formatDate(item.createdAt)}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  {item.archivoUrl ? (
                    <a
                      href={item.archivoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-300"
                    >
                      <MdInsertDriveFile className="h-4 w-4" /> Ver archivo
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Sin archivo adjunto</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void updateEstado(item, true)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 text-green-600 transition hover:bg-green-50 dark:border-green-500/30 dark:text-green-300 dark:hover:bg-green-500/10"
                      title="Aceptar propuesta"
                    >
                      <MdCheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void updateEstado(item, false)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                      title="Rechazar propuesta"
                    >
                      <MdClose className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total: {totalItems} propuestas</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage <= 1 || loading}>Anterior</Button>
              <span className="text-sm text-gray-700 dark:text-gray-200">Página {currentPage} de {totalPages}</span>
              <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages || loading}>Siguiente</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
