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
  id: number;
  userId: number;
  especialidadId?: number;
  colegiado?: string;
  areaId?: number;
  user?: User;
  especialidad?: {
    id: number;
    nombre: string;
  };
  area?: {
    id: number;
    nombre: string;
  };
  horarios?: Array<{
    id: number;
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
    <div className="mx-auto max-w-5xl p-6">
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
        <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Buscar Información de Empleado (PSM)
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Busca un empleado para ver su información de área, especialidad y horarios
        </p>

        {/* Búsqueda de Usuario */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                {loading ? "Buscando..." : "Buscar"}
              </Button>
              <Button onClick={handleClear} variant="outline" disabled={loading}>
                Limpiar
              </Button>
            </div>
          </div>

          {selectedUserId && (
            <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Empleado seleccionado:</strong> {selectedUserName} (ID: {selectedUserId})
              </p>
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
                <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">ID PSM</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {psmData.id}
                  </p>
                </div>

                {psmData.especialidad && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Especialidad</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {psmData.especialidad.nombre}
                    </p>
                  </div>
                )}

                {psmData.area && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Área</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {psmData.area.nombre}
                    </p>
                  </div>
                )}

                {psmData.colegiado && (
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Número de Colegiado</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {psmData.colegiado}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Datos del Usuario */}
            {psmData.user && (
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                  Datos del Usuario
                </h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nombre Completo</p>
                    <p className="text-base font-medium text-gray-800 dark:text-white/90">
                      {psmData.user.firstname} {psmData.user.lastname}
                    </p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base font-medium text-gray-800 dark:text-white/90">
                      {psmData.user.email}
                    </p>
                  </div>
                  {psmData.user.dpi && (
                    <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400">DPI</p>
                      <p className="text-base font-medium text-gray-800 dark:text-white/90">
                        {psmData.user.dpi}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Horarios */}
            {psmData.horarios && psmData.horarios.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                  Horarios de Trabajo
                </h3>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {psmData.horarios.map((horario) => (
                    <div
                      key={horario.id}
                      className="rounded-md border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold text-gray-800 dark:text-white/90">
                          {horario.diaSemana}
                        </span>
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                          ID: {horario.id}
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
