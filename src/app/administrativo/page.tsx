"use client";

import Link from "next/link";
import { TableIcon } from "@/icons";
import { useCongreso } from "@/hooks/useCongreso";
import { useEffect } from "react";
import {
  MdAttachMoney,
  MdCalendarMonth,
  MdCalendarToday,
  MdDescription,
  MdLocationOn,
  MdApartment,
} from "react-icons/md";

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};

const formatCurrency = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value);
};

const infoItemClass =
  "flex items-start gap-2 rounded-md bg-gray-50 px-2 py-1.5 text-xs text-gray-700 dark:bg-white/[0.03] dark:text-gray-300";
const fallbackCongresoImage = "/images/carousel/vitaly-gariev-iyeUwItlIPk-unsplash.jpg";

export default function AdministrativoHomePage() {
  const { congresos, loading, error, fetchCongresos } = useCongreso();

  useEffect(() => {
    fetchCongresos();
  }, [fetchCongresos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Panel administrativo</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Accede rápidamente al módulo de congresos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-white/10 dark:bg-white/3 sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                <TableIcon />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Congresos</h2>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Ver y gestionar congresos asignados.</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
              {congresos.length} registro{congresos.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="p-5">
            {loading && congresos.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">Cargando congresos...</p>
            ) : null}

            {error && congresos.length === 0 ? (
              <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
            ) : null}

            {!loading && !error && congresos.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">No hay congresos disponibles.</p>
            ) : null}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {congresos.map((congreso) => (
                <div
                  key={congreso.id}
                  className="rounded-xl border border-gray-200 p-3 shadow-theme-xs transition hover:border-brand-300 hover:shadow-theme-sm dark:border-white/10"
                >
                  {(() => {
                    const institucionNombre =
                      typeof (congreso as any).institucionId === "object" && (congreso as any).institucionId !== null
                        ? (congreso as any).institucionId.nombre
                        : "N/A";

                    return (
                  <div className="flex items-center gap-4">
                    <div className="w-[30%] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5">
                      <img
                        src={congreso.fotoUrl?.trim() ? congreso.fotoUrl : fallbackCongresoImage}
                        alt={congreso.titulo}
                        className="aspect-4/3 h-full w-full object-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = fallbackCongresoImage;
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-base font-bold text-gray-800 dark:text-white/90">{congreso.titulo}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            congreso.activo
                              ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                              : "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                          }`}
                        >
                          {congreso.activo ? "ACTIVO" : "INACTIVO"}
                        </span>
                      </div>

                      <div className="mt-2 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <MdDescription className="mt-0.5 h-3.5 w-3.5 text-brand-500" />
                        <p className="line-clamp-2">{congreso.descripcion || "N/A"}</p>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
                        <div className={infoItemClass}>
                          <MdCalendarToday className="mt-0.5 h-3.5 w-3.5 text-brand-500" />
                          <p><span className="font-medium">Inicio:</span> {formatDateTime(congreso.fechaInicio)}</p>
                        </div>
                        <div className={infoItemClass}>
                          <MdCalendarMonth className="mt-0.5 h-3.5 w-3.5 text-brand-500" />
                          <p><span className="font-medium">Fin:</span> {formatDateTime(congreso.fechaFin)}</p>
                        </div>
                        <div className={infoItemClass}>
                          <MdLocationOn className="mt-0.5 h-3.5 w-3.5 text-brand-500" />
                          <p><span className="font-medium">Ubicación:</span> {congreso.ubicacion || "N/A"}</p>
                        </div>
                        <div className={infoItemClass}>
                          <MdAttachMoney className="mt-0.5 h-3.5 w-3.5 text-brand-500" />
                          <p><span className="font-medium">Precio:</span> {formatCurrency(congreso.precioInscripcion)}</p>
                        </div>
                        <div className={infoItemClass}>
                          <MdApartment className="mt-0.5 h-3.5 w-3.5 text-brand-500" />
                          <p><span className="font-medium">Institución:</span> {institucionNombre || "N/A"}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Link
                          href={`/administrativo/congreso?id=${congreso.id}`}
                          className="inline-flex items-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                        >
                          Ir al congreso
                        </Link>
                      </div>
                    </div>
                  </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
