"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";

interface ObjetivosTerapeuticosConfiguracionProps {
  objetivoCortoplazo?: string;
  objetivoMedioplazo?: string;
  objetivoLargoplazo?: string;
  modalidad?: string[];
  enfoqueTerapeutico?: string[];
  frecuencia?: string;
  sesionesPorSemana?: number;
  duracionEstimada?: number;
  costoPorSesion?: string;
  onChange?: (data: ObjetivosTerapeuticosConfiguracionData) => void;
  disabled?: boolean;
}

export interface ObjetivosTerapeuticosConfiguracionData {
  objetivoCortoplazo: string;
  objetivoMedioplazo: string;
  objetivoLargoplazo: string;
  modalidad: string[];
  enfoqueTerapeutico: string[];
  frecuencia: string;
  sesionesPorSemana: number;
  duracionEstimada: number;
  costoPorSesion: string;
}

const modalidadOptions = [
  { value: "individual", label: "Individual" },
  { value: "familiar", label: "Familiar" },
  { value: "pareja", label: "Pareja" },
  { value: "grupo", label: "Grupo" },
];

const enfoqueTerapeuticoOptions = [
  { value: "cognitivo_conductual", label: "Cognitivo-Conductual" },
  { value: "sistemico", label: "Sistémico" },
  { value: "psicodinamico", label: "Psicodinámico" },
  { value: "humanista", label: "Humanista" },
  { value: "integrativo", label: "Integrativo" },
];

const frecuenciaOptions = [
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
];

export default function ObjetivosTerapeuticosConfiguracion({
  objetivoCortoplazo = "",
  objetivoMedioplazo = "",
  objetivoLargoplazo = "",
  modalidad = [],
  enfoqueTerapeutico = [],
  frecuencia = "",
  sesionesPorSemana = 1,
  duracionEstimada = 0,
  costoPorSesion = "",
  onChange,
  disabled = false,
}: ObjetivosTerapeuticosConfiguracionProps) {
  const [formData, setFormData] = useState<ObjetivosTerapeuticosConfiguracionData>({
    objetivoCortoplazo,
    objetivoMedioplazo,
    objetivoLargoplazo,
    modalidad,
    enfoqueTerapeutico,
    frecuencia,
    sesionesPorSemana,
    duracionEstimada,
    costoPorSesion,
  });

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = (
    field: keyof ObjetivosTerapeuticosConfiguracionData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModalidadChange = (value: string, checked: boolean) => {
    setFormData((prev) => {
      const newModalidad = checked
        ? [...prev.modalidad, value]
        : prev.modalidad.filter((m) => m !== value);

      return {
        ...prev,
        modalidad: newModalidad,
      };
    });
  };

  const handleEnfoqueChange = (value: string, checked: boolean) => {
    setFormData((prev) => {
      const newEnfoque = checked
        ? [...prev.enfoqueTerapeutico, value]
        : prev.enfoqueTerapeutico.filter((e) => e !== value);

      return {
        ...prev,
        enfoqueTerapeutico: newEnfoque,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Sección: Objetivos Terapéuticos */}
      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
          Objetivos Terapéuticos
        </h2>

        <div className="space-y-6">
          {/* Objetivo a Corto Plazo */}
          <div>
            <Label htmlFor="objetivoCortoplazo">
              Objetivo a Corto Plazo (1-3 meses)
              <span className="text-error-500">*</span>
            </Label>
            <TextArea
              id="objetivoCortoplazo"
              name="objetivoCortoplazo"
              placeholder="Describa los objetivos a alcanzar en el corto plazo (ejemplo: reducir síntomas de ansiedad, mejorar habilidades de afrontamiento, etc.)"
              value={formData.objetivoCortoplazo}
              onChange={(v) =>
                handleInputChange("objetivoCortoplazo", v)
              }
              disabled={disabled}
              required
              className="max-w-full"
              rows={4}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Objetivos específicos, medibles y alcanzables en 1-3 meses
            </p>
          </div>

          {/* Objetivo a Medio Plazo */}
          <div>
            <Label htmlFor="objetivoMedioplazo">
              Objetivo a Medio Plazo (3-6 meses)
            </Label>
            <TextArea
              id="objetivoMedioplazo"
              name="objetivoMedioplazo"
              placeholder="Describa los objetivos a alcanzar en el medio plazo (ejemplo: consolidar estrategias aprendidas, mejorar relaciones interpersonales, etc.)"
              value={formData.objetivoMedioplazo}
              onChange={(v) =>
                handleInputChange("objetivoMedioplazo",v)
              }
              disabled={disabled}
              className="max-w-full"
              rows={4}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Objetivos a alcanzar en 3-6 meses
            </p>
          </div>

          {/* Objetivo a Largo Plazo */}
          <div>
            <Label htmlFor="objetivoLargoplazo">
              Objetivo a Largo Plazo (6+ meses)
            </Label>
            <TextArea
              id="objetivoLargoplazo"
              name="objetivoLargoplazo"
              placeholder="Describa los objetivos a largo plazo (ejemplo: mantener estabilidad emocional, prevenir recaídas, desarrollo personal continuo, etc.)"
              value={formData.objetivoLargoplazo}
              onChange={(v) =>
                handleInputChange("objetivoLargoplazo", v)
              }
              disabled={disabled}
              className="max-w-full"
              rows={4}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Objetivos de mantenimiento y desarrollo personal a largo plazo
            </p>
          </div>
        </div>
      </div>

      {/* Sección: Configuración del Tratamiento */}
      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
          Configuración del Tratamiento
        </h2>

        <div className="space-y-6">
          {/* Modalidad */}
          <div>
            <Label>Modalidad de Tratamiento</Label>
            <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              Seleccione una o más modalidades (puede combinar)
            </p>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              {modalidadOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  id={`modalidad-${option.value}`}
                  name="modalidad"
                  value={option.value}
                  label={option.label}
                  checked={formData.modalidad.includes(option.value)}
                  onChange={(v) =>
                    handleModalidadChange(option.value, v)
                  }
                  disabled={disabled}
                />
              ))}
            </div>
          </div>

          {/* Enfoque Terapéutico */}
          <div>
            <Label>Enfoque Terapéutico</Label>
            <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              Seleccione uno o más enfoques a utilizar
            </p>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              {enfoqueTerapeuticoOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  id={`enfoque-${option.value}`}
                  name="enfoqueTerapeutico"
                  value={option.value}
                  label={option.label}
                  checked={formData.enfoqueTerapeutico.includes(option.value)}
                  onChange={(v) =>
                    handleEnfoqueChange(option.value, v)
                  }
                  disabled={disabled}
                />
              ))}
            </div>
          </div>

          {/* Frecuencia y Sesiones */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Frecuencia */}
            <div>
              <Label htmlFor="frecuencia">Frecuencia de Sesiones</Label>
              <Select
                options={frecuenciaOptions}
                placeholder="Seleccione la frecuencia"
                onChange={(value) => handleInputChange("frecuencia", value)}
                defaultValue={formData.frecuencia}
                className="max-w-full"
              />
            </div>

            {/* Sesiones por Semana */}
            <div>
              <Label htmlFor="sesionesPorSemana">Sesiones por Semana</Label>
              <Input
                type="number"
                id="sesionesPorSemana"
                name="sesionesPorSemana"
                placeholder="1"
                value={formData.sesionesPorSemana}
                onChange={(e) =>
                  handleInputChange(
                    "sesionesPorSemana",
                    parseInt(e.target.value) || 1
                  )
                }
                disabled={disabled}
                min={1}
                max={3}
                className="max-w-full"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Mínimo 1, Máximo 3 sesiones por semana
              </p>
            </div>
          </div>

          {/* Duración Estimada y Costo */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Duración Estimada */}
            <div>
              <Label htmlFor="duracionEstimada">
                Duración Estimada (semanas)
              </Label>
              <Input
                type="number"
                id="duracionEstimada"
                name="duracionEstimada"
                placeholder="12"
                value={formData.duracionEstimada || ""}
                onChange={(e) =>
                  handleInputChange(
                    "duracionEstimada",
                    parseInt(e.target.value) || 0
                  )
                }
                disabled={disabled}
                min={1}
                className="max-w-full"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Duración aproximada del tratamiento en semanas
              </p>
            </div>

            {/* Costo por Sesión */}
            <div>
              <Label htmlFor="costoPorSesion">Costo por Sesión (GTQ)</Label>
              <Input
                type="number"
                id="costoPorSesion"
                name="costoPorSesion"
                placeholder="250.00"
                value={formData.costoPorSesion}
                onChange={(e) =>
                  handleInputChange("costoPorSesion", e.target.value)
                }
                disabled={disabled}
                step={0.01}
                min={0}
                className="max-w-full"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Costo en quetzales por sesión individual
              </p>
            </div>
          </div>

          {/* Resumen de Configuración */}
          {(formData.modalidad.length > 0 ||
            formData.enfoqueTerapeutico.length > 0 ||
            formData.frecuencia) && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
              <h3 className="mb-3 text-sm font-semibold text-green-800 dark:text-green-300">
                Resumen de Configuración
              </h3>
              <div className="space-y-2 text-sm">
                {formData.modalidad.length > 0 && (
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Modalidad:{" "}
                    </span>
                    <span className="text-green-900 dark:text-green-200">
                      {formData.modalidad
                        .map(
                          (m) =>
                            modalidadOptions.find((opt) => opt.value === m)
                              ?.label
                        )
                        .join(", ")}
                    </span>
                  </div>
                )}
                {formData.enfoqueTerapeutico.length > 0 && (
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Enfoque:{" "}
                    </span>
                    <span className="text-green-900 dark:text-green-200">
                      {formData.enfoqueTerapeutico
                        .map(
                          (e) =>
                            enfoqueTerapeuticoOptions.find(
                              (opt) => opt.value === e
                            )?.label
                        )
                        .join(", ")}
                    </span>
                  </div>
                )}
                {formData.frecuencia && (
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Frecuencia:{" "}
                    </span>
                    <span className="text-green-900 dark:text-green-200">
                      {frecuenciaOptions.find(
                        (opt) => opt.value === formData.frecuencia
                      )?.label || formData.frecuencia}{" "}
                      ({formData.sesionesPorSemana}{" "}
                      {formData.sesionesPorSemana === 1
                        ? "sesión"
                        : "sesiones"}{" "}
                      por semana)
                    </span>
                  </div>
                )}
                {formData.duracionEstimada > 0 && (
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Duración estimada:{" "}
                    </span>
                    <span className="text-green-900 dark:text-green-200">
                      {formData.duracionEstimada}{" "}
                      {formData.duracionEstimada === 1 ? "semana" : "semanas"}
                    </span>
                  </div>
                )}
                {formData.costoPorSesion && parseFloat(formData.costoPorSesion) > 0 && (
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-400">
                      Costo por sesión:{" "}
                    </span>
                    <span className="text-green-900 dark:text-green-200">
                      GTQ {parseFloat(formData.costoPorSesion).toFixed(2)}
                    </span>
                  </div>
                )}
                {formData.duracionEstimada > 0 &&
                  formData.costoPorSesion &&
                  parseFloat(formData.costoPorSesion) > 0 &&
                  formData.sesionesPorSemana > 0 && (
                    <div className="mt-3 border-t border-green-300 pt-2 dark:border-green-700">
                      <span className="font-medium text-green-700 dark:text-green-400">
                        Costo total estimado:{" "}
                      </span>
                      <span className="text-lg font-bold text-green-900 dark:text-green-200">
                        GTQ{" "}
                        {(
                          parseFloat(formData.costoPorSesion) *
                          formData.sesionesPorSemana *
                          formData.duracionEstimada
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
        {/* Botón para mandar la información */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400"
            onClick={() => handleEnviarInformacion()}
            disabled={disabled}
          >
            Mandar información
          </button>
        </div>
      </div>
    );
  }

  // Función para manejar el envío de información
  function handleEnviarInformacion() {
    // Aquí puedes implementar la lógica para enviar la información
    // Por ejemplo, llamar a una API o mostrar un mensaje
    alert("Información enviada correctamente.");
  }
    </div>
  );
}
