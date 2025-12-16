"use client";

import React, { useState } from "react";
import AsyncSearchableSelect from "@/components/form/AsyncSearchableSelect";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { useArea } from "@/hooks/useArea";
import { useEspecialidad } from "@/hooks/useEspecialidad";
import { usePsm } from "@/hooks/usePsm";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  dpi?: string;
}

interface HorarioDto {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

const diasSemana = [
  { value: "LUNES_VIERNES", label: "Lunes-Viernes" },
  { value: "SABADO_DOMINGO", label: "Sábado-Domingo" },
  { value: "LUNES", label: "Lunes" },
  { value: "MARTES", label: "Martes" },
  { value: "MIERCOLES", label: "Miércoles" },
  { value: "JUEVES", label: "Jueves" },
  { value: "VIERNES", label: "Viernes" },
  { value: "SABADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
];

export default function SearchPSMPage() {
  const { areas, fetchAreas } = useArea();
  const { especialidades, fetchEspecialidades } = useEspecialidad();
  const { 
    psmData, 
    loading, 
    error, 
    notFound, 
    fetchPsmByUserId, 
    updatePsm,
    clearPsmData 
  } = usePsm();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Estados para edición
  const [editEspecialidadId, setEditEspecialidadId] = useState<number>(0);
  const [editAreaId, setEditAreaId] = useState<number>(0);
  const [editColegiado, setEditColegiado] = useState<string>("");
  const [editHorarios, setEditHorarios] = useState<HorarioDto[]>([]);

  React.useEffect(() => {
    fetchAreas();
    fetchEspecialidades();
  }, []);

  const handleSearch = async () => {
    if (!selectedUserId) {
      return;
    }

    const data = await fetchPsmByUserId(selectedUserId);
    
    if (data) {
      // Cargar datos en los estados de edición
      setEditEspecialidadId(data.ilempleadoResDto.especialidad?.id || 0);
      setEditAreaId(data.ilempleadoResDto.area?.id || 0);
      setEditColegiado(data.ilempleadoResDto.colegiado || "");
      setEditHorarios(data.horarioReqDto || []);
    }
  };

  const handleClear = () => {
    setSelectedUserId(null);
    setSelectedUserName("");
    clearPsmData();
    setIsEditing(false);
    setEditEspecialidadId(0);
    setEditAreaId(0);
    setEditColegiado("");
    setEditHorarios([]);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar valores originales
    if (psmData) {
      setEditEspecialidadId(psmData.ilempleadoResDto.especialidad?.id || 0);
      setEditAreaId(psmData.ilempleadoResDto.area?.id || 0);
      setEditColegiado(psmData.ilempleadoResDto.colegiado || "");
      setEditHorarios(psmData.horarioReqDto || []);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUserId) return;

    // Validaciones
    if (!editEspecialidadId || editEspecialidadId === 0) {
      return;
    }

    if (!editAreaId || editAreaId === 0) {
      return;
    }

    if (!editColegiado.trim()) {
      return;
    }

    const horariosValidos = editHorarios.filter(
      (h) => h.diaSemana && h.horaInicio && h.horaFin
    );

    if (horariosValidos.length === 0) {
      return;
    }

    try {
      const payload = {
        ilempleadoReqDto: {
          especialidadId: editEspecialidadId,
          colegiado: editColegiado,
          areaId: editAreaId,
        },
        horarioReqDto: horariosValidos,
      };

      await updatePsm(selectedUserId, payload);
      
      // Recargar los datos actualizados
      await handleSearch();
      setIsEditing(false);
    } catch (err) {
      // El error ya está manejado en el hook
      console.error("Error en handleSaveEdit:", err);
    }
  };

  const handleAddHorario = () => {
    setEditHorarios([...editHorarios, { diaSemana: "", horaInicio: "", horaFin: "" }]);
  };

  const handleRemoveHorario = (index: number) => {
    if (editHorarios.length > 1) {
      setEditHorarios(editHorarios.filter((_, i) => i !== index));
    }
  };

  const handleHorarioChange = (index: number, field: keyof HorarioDto, value: string) => {
    const newHorarios = [...editHorarios];
    newHorarios[index][field] = value;
    setEditHorarios(newHorarios);
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
                  clearPsmData();
                  setIsEditing(false);
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
          <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 p-8 text-center shadow-md dark:from-yellow-900/20 dark:to-orange-900/20">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800/30">
              <svg
                className="h-10 w-10 text-yellow-600 dark:text-yellow-500"
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
            </div>
            <h3 className="mb-2 text-xl font-bold text-yellow-900 dark:text-yellow-300">
              Sin Información Registrada
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              El empleado <strong>{selectedUserName}</strong> aún no tiene información de PSM en el sistema.
            </p>
            <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
              Puede registrar esta información desde el módulo de administración.
            </p>
          </div>
        )}



        {/* Datos de PSM */}
        {psmData && !isEditing && (
          <div className="space-y-6">
            {/* Botón de Editar */}
            <div className="flex justify-end">
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Información
              </Button>
            </div>

            {/* Información General */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
              <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-brand-100 p-2 dark:bg-brand-900/30">
                    <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    Información Profesional
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {psmData.ilempleadoResDto.especialidad && (
                    <div className="group rounded-lg border-2 border-purple-200 bg-white p-4 transition-all hover:border-purple-400 hover:shadow-lg dark:border-purple-800/30 dark:bg-gray-800 dark:hover:border-purple-700">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
                          <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <p className="text-xs font-medium uppercase tracking-wide text-purple-600 dark:text-purple-400">
                          Especialidad
                        </p>
                      </div>
                      <p className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                        {psmData.ilempleadoResDto.especialidad.nombre}
                      </p>
                      {psmData.ilempleadoResDto.especialidad.descripcion && (
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                          {psmData.ilempleadoResDto.especialidad.descripcion}
                        </p>
                      )}
                    </div>
                  )}

                  {psmData.ilempleadoResDto.area && (
                    <div className="group rounded-lg border-2 border-blue-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-800 dark:hover:border-blue-700">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                          Área
                        </p>
                      </div>
                      <p className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                        {psmData.ilempleadoResDto.area.nombre}
                      </p>
                      {psmData.ilempleadoResDto.area.descripcion && (
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                          {psmData.ilempleadoResDto.area.descripcion}
                        </p>
                      )}
                    </div>
                  )}

                  {psmData.ilempleadoResDto.colegiado && (
                    <div className="group rounded-lg border-2 border-green-200 bg-white p-4 transition-all hover:border-green-400 hover:shadow-lg dark:border-green-800/30 dark:bg-gray-800 dark:hover:border-green-700">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                          <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <p className="text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
                          Colegiado
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {psmData.ilempleadoResDto.colegiado}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Número de registro profesional
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Horarios */}
            {psmData.horarioReqDto && psmData.horarioReqDto.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
                <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                      <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                        Horarios de Trabajo
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {psmData.horarioReqDto.length} {psmData.horarioReqDto.length === 1 ? 'día configurado' : 'días configurados'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {psmData.horarioReqDto.map((horario, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-lg border-2 border-indigo-200 bg-white p-4 transition-all hover:border-indigo-400 hover:shadow-xl dark:border-indigo-800/30 dark:bg-gray-800 dark:hover:border-indigo-700"
                      >
                        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-indigo-100 opacity-50 transition-transform group-hover:scale-150 dark:bg-indigo-900/20"></div>
                        <div className="relative">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-md bg-indigo-100 p-1.5 dark:bg-indigo-900/30">
                                <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                                {horario.diaSemana}
                              </span>
                            </div>
                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700">
                              <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                              </svg>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {horario.horaInicio}
                              </span>
                            </div>
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <div className="flex items-center gap-1.5 rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-700">
                              <svg className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                              </svg>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {horario.horaFin}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulario de Edición */}
        {psmData && isEditing && (
          <div className="space-y-6">
            {/* Información del Empleado */}
            <div className="overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-md dark:border-purple-800/30 dark:from-gray-900 dark:to-purple-900/10">
              <div className="border-b border-purple-200 bg-white px-6 py-4 dark:border-purple-800/30 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      Editar Información del Empleado
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedUserName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label>Especialidad</Label>
                    <Select
                      key={`especialidad-${editEspecialidadId}-${isEditing}`}
                      options={(especialidades || []).map((e) => ({
                        value: String(e.id),
                        label: e.nombre,
                      }))}
                      placeholder="Seleccione especialidad"
                      defaultValue={editEspecialidadId ? String(editEspecialidadId) : ""}
                      onChange={(value) => setEditEspecialidadId(Number(value))}
                    />
                  </div>

                  <div>
                    <Label>Área</Label>
                    <Select
                      key={`area-${editAreaId}-${isEditing}`}
                      options={(areas || []).map((a) => ({
                        value: String(a.id),
                        label: a.nombre,
                      }))}
                      placeholder="Seleccione área"
                      defaultValue={editAreaId ? String(editAreaId) : ""}
                      onChange={(value) => setEditAreaId(Number(value))}
                    />
                  </div>

                  <div>
                    <Label>Número de Colegiado</Label>
                    <Input
                      type="text"
                      placeholder="Ej: 12345"
                      value={editColegiado}
                      onChange={(e) => setEditColegiado(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios Editables */}
            <div className="overflow-hidden rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30 shadow-md dark:border-indigo-800/30 dark:from-gray-900 dark:to-indigo-900/10">
              <div className="border-b border-indigo-200 bg-white px-6 py-4 dark:border-indigo-800/30 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                      <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                        Horarios de Trabajo
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {editHorarios.length} {editHorarios.length === 1 ? 'horario configurado' : 'horarios configurados'}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddHorario}
                    variant="outline"
                    className="flex items-center gap-2 text-sm"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar Horario
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {editHorarios.map((horario, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg border-2 border-indigo-200 bg-white p-4 transition-all hover:border-indigo-400 hover:shadow-lg dark:border-indigo-800/30 dark:bg-gray-800 dark:hover:border-indigo-700"
                    >
                      <div className="absolute right-0 top-0 h-16 w-16 translate-x-6 -translate-y-6 rounded-full bg-indigo-100 opacity-30 transition-transform group-hover:scale-150 dark:bg-indigo-900/20"></div>
                      <div className="relative grid grid-cols-1 gap-3 lg:grid-cols-4">
                        <div>
                          <Label>Día de la Semana</Label>
                          <Select
                            options={diasSemana}
                            placeholder="Seleccione día"
                            defaultValue={horario.diaSemana}
                            onChange={(value) => handleHorarioChange(index, "diaSemana", value)}
                          />
                        </div>

                        <div>
                          <Label>Hora Inicio</Label>
                          <Input
                            type="time"
                            value={horario.horaInicio}
                            onChange={(e) => handleHorarioChange(index, "horaInicio", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>Hora Fin</Label>
                          <Input
                            type="time"
                            value={horario.horaFin}
                            onChange={(e) => handleHorarioChange(index, "horaFin", e.target.value)}
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => handleRemoveHorario(index)}
                            variant="outline"
                            disabled={editHorarios.length === 1}
                            className="flex w-full items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-3 border-t-2 border-gray-200 pt-6 dark:border-gray-700">
              <Button
                type="button"
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
