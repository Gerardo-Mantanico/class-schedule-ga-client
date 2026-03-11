"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MdCalendarMonth,
  MdCategory,
  MdInsertDriveFile,
  MdNumbers,
  MdOutlineChecklist,
  MdPlace,
} from "react-icons/md";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import api from "@/service/api.service";

type InstitucionResumen = {
  id: number;
  nombre?: string;
};

type CongresoResumen = {
  id: number;
  titulo?: string;
  ubicacion?: string;
  fotoUrl?: string;
  institucionId?: InstitucionResumen | null;
};

type ConvocatoriaResumen = {
  id: number;
  nombre?: string;
  titulo?: string;
};

type UsuarioResumen = {
  id: number;
  firstname?: string;
  lastname?: string;
};

type Propuesta = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  horaInicio: string;
  horaFin: string;
  capacidadMaxima: number | null;
  congresoId?: number | CongresoResumen;
  convocatoriaId?: number | ConvocatoriaResumen;
  userId?: number | UsuarioResumen;
  archivoUrl?: string;
  estadoId?: string;
  createdAt?: string;
};

type PaginatedResponse<T> = {
  content?: T[];
  data?: T[] | PaginatedResponse<T>;
  items?: T[];
  totalPages?: number;
  totalElements?: number;
  totalItems?: number;
  total?: number;
  number?: number;
  size?: number;
};

const resolvePropuestasResponse = (response: PaginatedResponse<Propuesta> | Propuesta[]) => {
  if (Array.isArray(response)) {
    return {
      content: response,
      totalPages: 1,
      totalItems: response.length,
    };
  }

  let nestedData: PaginatedResponse<Propuesta> | null = null;
  if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    nestedData = response.data;
  }

  let content: Propuesta[] = [];
  if (Array.isArray(response.content)) {
    content = response.content;
  } else if (Array.isArray(response.items)) {
    content = response.items;
  } else if (Array.isArray(response.data)) {
    content = response.data;
  } else if (Array.isArray(nestedData?.content)) {
    content = nestedData.content;
  }

  const rawTotalPages = Number(response.totalPages ?? nestedData?.totalPages ?? 1);
  const rawTotalItems = Number(
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
    totalPages: Number.isNaN(rawTotalPages) ? 1 : Math.max(1, rawTotalPages),
    totalItems: Number.isNaN(rawTotalItems) ? content.length : rawTotalItems,
  };
};

const pageSize = 6;
const fallbackImage = "/images/carousel/vitaly-gariev-iyeUwItlIPk-unsplash.jpg";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });
};

const getStatusBadgeColor = (status?: string) => {
  const normalized = (status || "PENDIENTE").toUpperCase();
  if (normalized === "APROBADO") return "success" as const;
  if (normalized === "RECHAZADO") return "error" as const;
  return "warning" as const;
};

const getCongreso = (value: Propuesta["congresoId"]): CongresoResumen | null => {
  if (!value || typeof value !== "object") return null;
  return value;
};

const getConvocatoria = (value: Propuesta["convocatoriaId"]): ConvocatoriaResumen | null => {
  if (!value || typeof value !== "object") return null;
  return value;
};

const getUser = (value: Propuesta["userId"]): UsuarioResumen | null => {
  if (!value || typeof value !== "object") return null;
  return value;
};

export default function PropuestasParticipantePage() {
  const [items, setItems] = useState<Propuesta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPropuestas = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = (await api.get("/actividades", {
          params: {
            page: currentPage - 1,
            size: pageSize,
          },
        })) as PaginatedResponse<Propuesta> | Propuesta[];
        const parsed = resolvePropuestasResponse(response);

        setItems(parsed.content);
        setTotalItems(parsed.totalItems);
        setTotalPages(parsed.totalPages);
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Error al cargar propuestas";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadPropuestas();
  }, [currentPage]);

  const hasResults = useMemo(() => items.length > 0, [items.length]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Mis propuestas</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revisa el estado y detalle de las propuestas que has creado para convocatorias.
        </p>
      </section>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          Cargando propuestas...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-error-200 bg-error-50 p-5 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          No se pudieron cargar las propuestas: {error}
        </div>
      )}

      {!loading && !error && !hasResults && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          Aún no tienes propuestas registradas.
        </div>
      )}

      {!loading && !error && hasResults && (
        <>
          <div className="space-y-4">
            {items.map((propuesta) => {
              const congreso = getCongreso(propuesta.congresoId);
              const convocatoria = getConvocatoria(propuesta.convocatoriaId);
              const status = (propuesta.estadoId || "PENDIENTE").toUpperCase();
              const tipoNormalizado = (propuesta.tipo || "").toUpperCase();
              const convocatoriaNombre = convocatoria?.titulo || convocatoria?.nombre || "Convocatoria";
              const institucionNombre =
                congreso?.institucionId && typeof congreso.institucionId === "object"
                  ? congreso.institucionId.nombre || "Institución"
                  : "Institución";
              const image = congreso?.fotoUrl?.trim() || fallbackImage;
              const cupoTexto =
                tipoNormalizado === "PONENCIA" &&
                (propuesta.capacidadMaxima === null || propuesta.capacidadMaxima === undefined)
                  ? "Cupo ilimitado"
                  : `${propuesta.capacidadMaxima ?? 0}`;

              return (
                <article
                  key={propuesta.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Propuesta</p>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{propuesta.nombre}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estado:</p>
                      <Badge color={getStatusBadgeColor(status)} size="sm">
                        {status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[160px_1fr]">
                    <div className="h-32 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                      <img
                        src={image}
                        alt={congreso?.titulo || propuesta.nombre}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>

                    <div className="grid gap-2 text-sm text-gray-700 dark:text-gray-300 md:grid-cols-2">
                      <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Congreso</p>
                        <p className="mt-1 font-medium text-gray-800 dark:text-white/90">{congreso?.titulo || "Congreso"}</p>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Convocatoria</p>
                        <p className="mt-1 font-medium text-gray-800 dark:text-white/90">{convocatoriaNombre}</p>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700 md:col-span-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Descripción</p>
                        <p className="mt-1 line-clamp-2 text-gray-700 dark:text-gray-300">{propuesta.descripcion}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-xs text-gray-700 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                      <MdCalendarMonth className="h-4 w-4 text-brand-500" />
                      <span>Inicio: {formatDate(propuesta.horaInicio)}</span>
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                      <MdCalendarMonth className="h-4 w-4 text-brand-500" />
                      <span>Fin: {formatDate(propuesta.horaFin)}</span>
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                      <MdCategory className="h-4 w-4 text-brand-500" />
                      <span>Tipo: {propuesta.tipo || "-"}</span>
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                      <MdNumbers className="h-4 w-4 text-brand-500" />
                      <span>Cupo: {cupoTexto}</span>
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                      <MdPlace className="h-4 w-4 text-brand-500" />
                      <span>{congreso?.ubicacion || institucionNombre}</span>
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                      <MdOutlineChecklist className="h-4 w-4 text-brand-500" />
                      <span>Creada: {formatDate(propuesta.createdAt)}</span>
                    </p>
                  </div>

                  {propuesta.archivoUrl && (
                    <a
                      href={propuesta.archivoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-300"
                    >
                      <MdInsertDriveFile className="h-4 w-4" />
                      Ver archivo adjunto
                    </a>
                  )}
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total de propuestas: {totalItems}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1 || loading}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages || loading}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
