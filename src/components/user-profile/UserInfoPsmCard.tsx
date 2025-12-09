"use client";
import React, { useEffect, useState } from "react";
import { psmApi } from "@/service/psm.service";

type Especialidad = {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
};

type Area = {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
};

type ILEmpleadoResDto = {
  especialidad: Especialidad;
  colegiado: string;
  area: Area;
  tipoContrato: string;
  tarifa: number;
};

type HorarioReqDto = {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
};

type PsmMeResponse = {
  ilempleadoResDto: ILEmpleadoResDto;
  horarioReqDto: HorarioReqDto[];
};

export default function UserInfoPsmCard() {
  const [data, setData] = useState<PsmMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await psmApi.getCurrentUser();
        setData(res);
        setError(null);
      } catch {
        setError("No se pudo cargar la información de PSM");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex items-center justify-center h-24">
          <div className="text-gray-500 dark:text-gray-400">Cargando información de PSM...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-5 border border-red-200 rounded-2xl bg-red-50 dark:bg-red-900/10 dark:border-red-800 lg:p-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-red-600 dark:text-red-400">{error || "Sin datos de PSM"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Verifica el endpoint /psm/me</div>
        </div>
      </div>
    );
  }

  const { ilempleadoResDto, horarioReqDto } = data;
  const { especialidad, colegiado, area, tipoContrato, tarifa } = ilempleadoResDto;

  const getTipoContratoClasses = (tipo?: string) => {
    const t = (tipo || "").toLowerCase();
    // Badge colors by type
    switch (t) {
      case "mensual":
        return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "por-hora":
      case "hora":
        return "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
      case "fijo":
      case "contrato":
        return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "temporal":
        return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getDiaSemanaClasses = (dia?: string) => {
    const d = (dia || "").toLowerCase();
    if (d.includes("lunes") && d.includes("viernes")) {
      return "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
    }
    if (d.includes("sabado") || d.includes("sábado")) {
      return "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800";
    }
    if (d.includes("domingo")) {
      return "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800";
    }
    return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700";
  };

  const getTarifaClasses = (valor?: number) => {
    if (typeof valor !== "number") {
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700";
    }
    // Simple tiering: <=50 low, 50-100 medium, >100 high
    if (valor <= 50) {
      return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
    }
    if (valor <= 100) {
      return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
    }
    return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
        Información Profesional (PSM)
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
        <div className="col-span-1">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Especialidad</p>
          {especialidad?.nombre ? (
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800">
              {especialidad.nombre}
            </span>
          ) : (
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">-</p>
          )}
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{especialidad?.descripcion || ""}</p>
        </div>

        <div className="col-span-1">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Colegiado</p>
          {colegiado ? (
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">
              {colegiado}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700">
              -
            </span>
          )}
        </div>

        <div className="col-span-1">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Área</p>
          {area?.nombre ? (
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800">
              {area.nombre}
            </span>
          ) : (
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">-</p>
          )}
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{area?.descripcion || ""}</p>
        </div>

        <div className="col-span-1">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tipo de Contrato</p>
          {tipoContrato ? (
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${getTipoContratoClasses(tipoContrato)}`}
            >
              {tipoContrato}
            </span>
          ) : (
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">-</p>
          )}
        </div>

        <div className="col-span-1">
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tarifa</p>
          {typeof tarifa === "number" ? (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getTarifaClasses(tarifa)}`}>
              ${tarifa.toFixed(2)}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700">
              -
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs leading-normal text-gray-500 dark:text-gray-400">Horario</p>
        {horarioReqDto && horarioReqDto.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {horarioReqDto.map((h, idx) => (
              <div key={`${h.diaSemana}-${idx}`} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getDiaSemanaClasses(h.diaSemana)}`}>
                  {h.diaSemana}
                </span>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {h.horaInicio} - {h.horaFin}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">No hay horario configurado.</p>
        )}
      </div>
    </div>
  );
}
