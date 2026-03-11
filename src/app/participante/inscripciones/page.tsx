"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useCongreso } from "@/hooks/useCongreso";

const formatDate = (isoDate: string) => {
  if (!isoDate) {
    return "-";
  }

  return new Date(isoDate).toLocaleDateString("es-GT", {
    dateStyle: "medium",
  });
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(value || 0);
};

export default function InscripcionesPacientePage() {
  const { congresos, loading, error } = useCongreso();
  const [inscripcionesLocales, setInscripcionesLocales] = useState<number[]>([]);

  const congresosActivos = useMemo(
    () => congresos.filter((congreso) => congreso.activo),
    [congresos]
  );

  const handleInscribirme = (congresoId: number, titulo: string) => {
    if (inscripcionesLocales.includes(congresoId)) {
      return;
    }

    setInscripcionesLocales((current) => [...current, congresoId]);
    toast.success(`Inscripción iniciada en ${titulo}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Inscripciones a congresos</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Selecciona el congreso de tu interés y realiza tu inscripción desde esta sección.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          Cargando congresos disponibles...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-error-200 bg-error-50 p-5 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          No se pudieron cargar los congresos: {error}
        </div>
      )}

      {!loading && !error && congresosActivos.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          No hay congresos activos para inscripción en este momento.
        </div>
      )}

      {!loading && !error && congresosActivos.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          {congresosActivos.map((congreso) => {
            const yaInscrito = inscripcionesLocales.includes(congreso.id);

            return (
              <article
                key={congreso.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3"
              >
                <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-900">
                  <Image
                    src={congreso.fotoUrl || "/images/cards/card-01.png"}
                    alt={congreso.titulo}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {congreso.titulo}
                    </h3>
                    <Badge color={yaInscrito ? "success" : "primary"} size="sm">
                      {yaInscrito ? "Inscripción iniciada" : "Disponible"}
                    </Badge>
                  </div>

                  <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                    {congreso.descripcion}
                  </p>

                  <div className="grid gap-3 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
                    <p>
                      <span className="font-medium">Inicio:</span> {formatDate(congreso.fechaInicio)}
                    </p>
                    <p>
                      <span className="font-medium">Fin:</span> {formatDate(congreso.fechaFin)}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-medium">Ubicación:</span> {congreso.ubicacion}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-medium">Precio inscripción:</span> {formatMoney(congreso.precioInscripcion)}
                    </p>
                  </div>

                  <div className="pt-1">
                    <Button
                      onClick={() => handleInscribirme(congreso.id, congreso.titulo)}
                      disabled={yaInscrito}
                    >
                      {yaInscrito ? "Inscripción procesada" : "Inscribirme"}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
