"use client";

import React, { useState, useEffect } from "react";
import AsyncSearchableSelect from "@/components/form/AsyncSearchableSelect";
import { useArea } from "@/hooks/useArea";
import { useEspecialidad } from "@/hooks/useEspecialidad";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

interface HorarioDto {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

interface ILEmpleadoReqDto {
  especialidadId: number;
  colegiado: string;
  areaId: number;
}

interface FormData {
  userId: number;
  ilempleadoReqDto: ILEmpleadoReqDto;
  horarioReqDto: HorarioDto[];
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

export default function AreaPage() {
  const { areas, fetchAreas } = useArea();
  const { especialidades, fetchEspecialidades } = useEspecialidad();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  const [empleadoData, setEmpleadoData] = useState<ILEmpleadoReqDto>({
    especialidadId: 0,
    colegiado: "",
    areaId: 0,
  });

  const [horarios, setHorarios] = useState<HorarioDto[]>([
    { diaSemana: "", horaInicio: "", horaFin: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAreas();
    fetchEspecialidades();
  }, []);

  const handleAddHorario = () => {
    setHorarios([...horarios, { diaSemana: "", horaInicio: "", horaFin: "" }]);
  };

  const handleRemoveHorario = (index: number) => {
    if (horarios.length > 1) {
      setHorarios(horarios.filter((_, i) => i !== index));
    }
  };

  const handleHorarioChange = (index: number, field: keyof HorarioDto, value: string) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] = value;
    setHorarios(newHorarios);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validaciones
    if (!selectedUserId) {
      setError("Debe seleccionar un empleado");
      return;
    }

    if (!empleadoData.especialidadId || empleadoData.especialidadId === 0) {
      setError("Debe seleccionar una especialidad");
      return;
    }

    if (!empleadoData.areaId || empleadoData.areaId === 0) {
      setError("Debe seleccionar un área");
      return;
    }

    if (!empleadoData.colegiado.trim()) {
      setError("Debe ingresar el número de colegiado");
      return;
    }

    // Validar horarios
    const horariosValidos = horarios.filter(
      (h) => h.diaSemana && h.horaInicio && h.horaFin
    );

    if (horariosValidos.length === 0) {
      setError("Debe agregar al menos un horario completo");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ilempleadoReqDto: empleadoData,
        horarioReqDto: horariosValidos,
      };

      console.log("Payload a enviar:", payload);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8090/api/v1/psm/${selectedUserId}`,
        
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      setSuccess(true);
      setError(null);

      // Limpiar formulario
      setSelectedUserId(null);
      setSelectedUserName("");
      setEmpleadoData({
        especialidadId: 0,
        colegiado: "",
        areaId: 0,
      });
      setHorarios([{ diaSemana: "", horaInicio: "", horaFin: "" }]);
    } catch (err: any) {
      console.error("Error al guardar:", err);
      setError(err.message || "Error al guardar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Registrar Empleado en Área
              </h1>
              <p className="mt-1 text-sm text-white/80">
                Asigna especialidad, área y horarios a un empleado
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/20">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-800 dark:text-red-300">Error</p>
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800/30 dark:bg-green-900/20">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">¡Éxito!</p>
                <p className="text-sm text-green-700 dark:text-green-400">El empleado ha sido registrado correctamente en el área.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Búsqueda de Empleado */}
            <div className="overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50/30 shadow-md dark:border-blue-800/30 dark:from-gray-900 dark:to-blue-900/10">
              <div className="border-b border-blue-200 bg-white px-6 py-4 dark:border-blue-800/30 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      Paso 1: Seleccionar Empleado
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Busca por nombre o DPI
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
            <AsyncSearchableSelect
              label="Buscar Empleado"
              searchEndpoint="http://localhost:8090/api/v1/users/search"
              placeholder="Buscar por nombre o DPI..."
              searchPlaceholder="Escribe nombre o DPI del empleado..."
              value={selectedUserId ? String(selectedUserId) : ""}
              onChange={(value) => {
                setSelectedUserId(Number(value));
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
                  searchText: `DPI: ${user.dpi || "N/A"} - Email: ${user.email} - Rol: ${user.role?.description || "N/A"}`,
                };
              }}
            />
                {selectedUserId && (
                  <div className="mt-4 flex items-center gap-3 rounded-lg border-2 border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Empleado seleccionado</p>
                      <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                        {selectedUserName} <span className="font-normal text-blue-700 dark:text-blue-400">(ID: {selectedUserId})</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Datos de IL Empleado */}
            <div className="overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-md dark:border-purple-800/30 dark:from-gray-900 dark:to-purple-900/10">
              <div className="border-b border-purple-200 bg-white px-6 py-4 dark:border-purple-800/30 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      Paso 2: Información del Empleado
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Especialidad, área y número de colegiado
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <Label>Especialidad</Label>
                <Select
                  options={(especialidades || []).map((e) => ({
                    value: String(e.id),
                    label: e.nombre,
                  }))}
                  placeholder="Seleccione especialidad"
                  defaultValue={empleadoData.especialidadId ? String(empleadoData.especialidadId) : ""}
                  onChange={(value) =>
                    setEmpleadoData({
                      ...empleadoData,
                      especialidadId: Number(value),
                    })
                  }
                />
              </div>

              <div>
                <Label>Área</Label>
                <Select
                  options={(areas || []).map((a) => ({
                    value: String(a.id),
                    label: a.nombre,
                  }))}
                  placeholder="Seleccione área"
                  defaultValue={empleadoData.areaId ? String(empleadoData.areaId) : ""}
                  onChange={(value) =>
                    setEmpleadoData({ ...empleadoData, areaId: Number(value) })
                  }
                />
              </div>

                  <div>
                    <Label>Número de Colegiado</Label>
                    <Input
                      type="text"
                      placeholder="Ej: 12345"
                      value={empleadoData.colegiado}
                      onChange={(e) =>
                        setEmpleadoData({
                          ...empleadoData,
                          colegiado: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios */}
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
                        Paso 3: Horarios de Trabajo
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {horarios.length} {horarios.length === 1 ? 'horario configurado' : 'horarios configurados'}
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
                  {horarios.map((horario, index) => (
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
                            onChange={(value) =>
                              handleHorarioChange(index, "diaSemana", value)
                            }
                          />
                        </div>

                        <div>
                          <Label>Hora Inicio</Label>
                          <Input
                            type="time"
                            value={horario.horaInicio}
                            onChange={(e) =>
                              handleHorarioChange(index, "horaInicio", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label>Hora Fin</Label>
                          <Input
                            type="time"
                            value={horario.horaFin}
                            onChange={(e) =>
                              handleHorarioChange(index, "horaFin", e.target.value)
                            }
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            onClick={() => handleRemoveHorario(index)}
                            variant="outline"
                            disabled={horarios.length === 1}
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

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-3 border-t-2 border-gray-200 pt-6 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedUserId(null);
                  setSelectedUserName("");
                  setEmpleadoData({
                    especialidadId: 0,
                    colegiado: "",
                    areaId: 0,
                  });
                  setHorarios([{ diaSemana: "", horaInicio: "", horaFin: "" }]);
                  setError(null);
                  setSuccess(false);
                }}
                className="flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
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
                    Guardar Empleado
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
