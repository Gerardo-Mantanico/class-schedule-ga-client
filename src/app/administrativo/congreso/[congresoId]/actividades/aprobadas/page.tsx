"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { MdCalendarMonth, MdDescription, MdInsertDriveFile, MdPerson } from "react-icons/md";
import Button from "@/components/ui/button/Button";
import api from "@/service/api.service";

type Actividad = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  horaInicio: string;
  horaFin: string;
  capacidadMaxima: number | null;
  congresoId?: number | { id?: number; titulo?: string };
  convocatoriaId?: number | { id?: number; nombre?: string };
  userId?: number | { firstname?: string; lastname?: string };
  archivoUrl?: string;
  estadoId?: string;
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

const pageSize = 20;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });
};

const resolveCongresoId = (value: Actividad["congresoId"]) => {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "id" in value) {
    const parsed = Number((value as { id?: unknown }).id);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const resolveContent = (response: PaginatedResponse<Actividad> | Actividad[]) => {
  if (Array.isArray(response)) return response;

  let nestedData: PaginatedResponse<Actividad> | null = null;
  if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    nestedData = response.data;
  }

  if (Array.isArray(response.content)) return response.content;
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(nestedData?.content)) return nestedData.content;
  return [];
};

const isAccepted = (estado?: string) => {
  const normalized = (estado || "").toUpperCase();
  return normalized === "ACEPTADA" || normalized === "APROBADA";
};

export default function ActividadesAprobadasPage() {
  const params = useParams<{ congresoId: string }>();
  const congresoId = Number(params?.congresoId || 0);

  const [items, setItems] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = (await api.get("/actividades", {
          params: { page: currentPage - 1, size: pageSize },
        })) as PaginatedResponse<Actividad> | Actividad[];

        const content = resolveContent(response);
        const filtered = content.filter((item) => resolveCongresoId(item.congresoId) === congresoId && isAccepted(item.estadoId));

        setItems(filtered);
        const serverTotalPages = Array.isArray(response) ? 1 : Number(response.totalPages ?? 1);
        setTotalPages(Number.isNaN(serverTotalPages) ? 1 : Math.max(1, serverTotalPages));
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Error al cargar actividades aprobadas";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadItems();
  }, [congresoId, currentPage]);

  const hasItems = useMemo(() => items.length > 0, [items.length]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Actividades aceptadas</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Listado de actividades aprobadas para este congreso.</p>
          </div>
          <Link
            href={`/administrativo/congreso?id=${congresoId}`}
            className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
          >
            Volver
          </Link>
        </div>
      </div>

      {loading && <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm dark:border-gray-800 dark:bg-white/3">Cargando actividades...</div>}
      {!loading && error && <div className="rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">{error}</div>}
      {!loading && !error && !hasItems && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          No hay actividades aceptadas para este congreso en esta página.
        </div>
      )}

      {!loading && !error && hasItems && (
        <>
          <div className="grid gap-4">
            {items.map((item) => {
              const user = item.userId && typeof item.userId === "object" ? item.userId : null;
              const userName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Participante";
              const cupoTexto = item.tipo?.toUpperCase() === "PONENCIA" && item.capacidadMaxima == null ? "Cupo ilimitado" : String(item.capacidadMaxima ?? 0);

              return (
                <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/3">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{item.nombre}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.descripcion}</p>

                  <div className="mt-4 grid gap-2 text-xs text-gray-700 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdDescription className="h-4 w-4 text-brand-500" />Tipo: {item.tipo || "-"}</p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdCalendarMonth className="h-4 w-4 text-brand-500" />Inicio: {formatDate(item.horaInicio)}</p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdCalendarMonth className="h-4 w-4 text-brand-500" />Fin: {formatDate(item.horaFin)}</p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60"><MdPerson className="h-4 w-4 text-brand-500" />{userName}</p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">Cupo: {cupoTexto}</p>
                  </div>

                  {item.archivoUrl && (
                    <a href={item.archivoUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-300">
                      <MdInsertDriveFile className="h-4 w-4" /> Ver archivo
                    </a>
                  )}
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage <= 1 || loading}>Anterior</Button>
            <span className="text-sm text-gray-700 dark:text-gray-200">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages || loading}>Siguiente</Button>
          </div>
        </>
      )}
    </div>
  );
}
