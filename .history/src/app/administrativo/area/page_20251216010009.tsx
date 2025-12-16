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
    <div className="mx-auto max-w-5xl p-6">
      <div className="rounded-xl bg-white p-6 shadow dark:bg-gray-900">
        <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Registrar Empleado en Área
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Asigna especialidad, área y horarios a un empleado
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <p className="font-semibold">¡Éxito!</p>
            <p>El empleado ha sido registrado correctamente en el área.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Búsqueda de Empleado */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              1. Seleccionar Empleado
            </h3>
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
                  searchText: `DPI: ${user.dpi || "N/A"} - Email: ${user.email}`,
                };
              }}
            />
            {selectedUserId && (
              <div className="mt-3 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Empleado seleccionado:</strong> {selectedUserName} (ID: {selectedUserId})
                </p>
              </div>
            )}
          </div>

          {/* Datos de IL Empleado */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              2. Información del Empleado
            </h3>
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

          {/* Horarios */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                3. Horarios de Trabajo
              </h3>
              <Button
                type="button"
                onClick={handleAddHorario}
                variant="outline"
                className="text-sm"
              >
                + Agregar Horario
              </Button>
            </div>

            <div className="space-y-3">
              {horarios.map((horario, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 p-3 dark:border-gray-700 lg:grid-cols-4"
                >
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
                      className="w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
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
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Empleado"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
