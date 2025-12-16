"use client";

import React, { useState } from "react";
import AsyncSearchableSelect from "@/components/form/AsyncSearchableSelect";
import Button from "@/components/ui/button/Button";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  dpi?: string;
}

interface PSMData {
  ilempleadoResDto: {
    especialidad?: {
      id: number;
      nombre: string;
      descripcion?: string;
    };
    colegiado?: string;
    area?: {
      id: number;
      nombre: string;
      descripcion?: string;
    };
  };
  horarioReqDto?: Array<{
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
  }>;
}

export default function SearchPSMPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [psmData, setPsmData] = useState<PSMData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!selectedUserId) {
      setError("Debe seleccionar un usuario");
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);
    setPsmData(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8090/api/v1/psm/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        setNotFound(true);
        setPsmData(null);
      } else if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      } else {
        const data = await response.json();
        setPsmData(data);
        setNotFound(false);
      }
    } catch (err: any) {
      console.error("Error al buscar PSM:", err);
      setError(err.message || "Error al buscar la información");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedUserId(null);
    setSelectedUserName("");
    setPsmData(null);
    setError(null);
    setNotFound(false);
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-3">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Consultar Información de Empleado</h1>
            <p className="mt-1 text-sm text-white/90">
              Busca y visualiza la información completa de especialidad, área y horarios
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        {/* Búsqueda de Usuario */}
        <div className="mb-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Paso 1: Seleccionar Empleado
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AsyncSearchableSelect
                label="Buscar Empleado"
                searchEndpoint="http://localhost:8090/api/v1/users/search"
                placeholder="Buscar por nombre o DPI..."
                searchPlaceholder="Escribe nombre o DPI del empleado..."
                value={selectedUserId ? String(selectedUserId) : ""}
                onChange={(value) => {
                  setSelectedUserId(Number(value));
                  setPsmData(null);
                  setError(null);
                  setNotFound(false);
                }}
                minChars={2}
                debounceMs={300}
                formatOption={(user: any) => {
                  if (user.id === Number(selectedUserId)) {
                    setSelectedUserName(`${user.firstname} ${user.lastname}`);
                  }
                  return {
                    value: String(user.id),
                    label: `${user.firstname} ${user.lastname}`,
                    searchText: `DPI: ${user.dpi || "N/A"} - Email: ${user.email}`,
                  };
                }}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} disabled={loading || !selectedUserId} className="flex-1">
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Buscar
                  </>
                )}
              </Button>
              <Button onClick={handleClear} variant="outline" disabled={loading}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {selectedUserId && (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800/30">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Empleado seleccionado
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  {selectedUserName} (ID: {selectedUserId})
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Mensaje de no encontrado */}
        {notFound && (
          <div className="rounded-lg bg-yellow-50 p-6 text-center dark:bg-yellow-900/20">
            <svg
              className="mx-auto mb-3 h-12 w-12 text-yellow-600 dark:text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-300">
              No se encontró información
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              El empleado <strong>{selectedUserName}</strong> no tiene información de PSM registrada.
            </p>
          </div>
        )}

        {/* Datos de PSM */}
        {psmData && (
          <div className="space-y-4">
            {/* Información General */}
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                Información General
              </h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {psmData.ilempleadoResDto.especialidad && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Especialidad</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {psmData.ilempleadoResDto.especialidad.nombre}
                    </p>
                    {psmData.ilempleadoResDto.especialidad.descripcion && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {psmData.ilempleadoResDto.especialidad.descripcion}
                      </p>
                    )}
                  </div>
                )}

                {psmData.ilempleadoResDto.area && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Área</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {psmData.ilempleadoResDto.area.nombre}
                    </p>
                    {psmData.ilempleadoResDto.area.descripcion && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {psmData.ilempleadoResDto.area.descripcion}
                      </p>
                    )}
                  </div>
                )}

                {psmData.ilempleadoResDto.colegiado && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Número de Colegiado</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {psmData.ilempleadoResDto.colegiado}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Horarios */}
            {psmData.horarioReqDto && psmData.horarioReqDto.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                  Horarios de Trabajo
                </h3>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {psmData.horarioReqDto.map((horario, index) => (
                    <div
                      key={index}
                      className="rounded-md border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div className="mb-2">
                        <span className="font-semibold text-gray-800 dark:text-white/90">
                          {horario.diaSemana}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {horario.horaInicio} - {horario.horaFin}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
