"use client";


import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";
import type { HistoriaPersonal } from "@/interfaces/historiaClinica/HistoriaPersonal";

interface HistoriaPersonalProps extends Partial<HistoriaPersonal> {
  onChange?: (data: HistoriaPersonal) => void;
  disabled?: boolean;
}

const consumoAlcoholOptions = [
  { value: "nunca", label: "Nunca" },
  { value: "ocasional", label: "Ocasional" },
  { value: "moderado", label: "Moderado" },
  { value: "excesivo", label: "Excesivo" },
];

const consumoTabacoOptions = [
  { value: "nunca", label: "Nunca" },
  { value: "ocasional", label: "Ocasional" },
  { value: "fumador", label: "Fumador" },
  { value: "exfumador", label: "Exfumador" },
];

export default function HistoriaPersonal({
  desarrolloEvolutivo = "",
  historiaAcademicaLaboral = "",
  historiaMedica = "",
  medicacionActual = "",
  consumoAlcohol = "nunca",
  consumoTabaco = "nunca",
  consumoDrogas = "",
  tuveTratamientosPrevios = false,
  detallesTratamientosPrevios = "",
  tuveHospitalizaciones = false,
  detallesHospitalizaciones = "",
  onChange,
  disabled = false,
}: HistoriaPersonalProps) {
  const [formData, setFormData] = useState<HistoriaPersonal>({
    id: 0,
    hcId: 0,
    desarrolloEvolutivo: desarrolloEvolutivo ?? "",
    medicacionActual: medicacionActual ?? "",
    consumoAlcohol: consumoAlcohol ?? "nunca",
    consumoTabaco: consumoTabaco ?? "nunca",
    consumoDrogras: consumoDrogas ?? "",
    tratamientosPrevios: tuveTratamientosPrevios ?? false,
    tratamientosPreviosDetalles: detallesTratamientosPrevios ?? "",
    hospitalizaciones: tuveHospitalizaciones ?? false,
    hospitalizacionesDetalles: detallesHospitalizaciones ?? "",
    hmedica: historiaMedica ?? "",
    hacademica: historiaAcademicaLaboral ?? "",
  });

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = <K extends keyof HistoriaPersonal>(
    field: K,
    value: HistoriaPersonal[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTratamientosChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tratamientosPrevios: checked,
      tratamientosPreviosDetalles: checked ? prev.tratamientosPreviosDetalles : "",
    }));
  };

  const handleHospitalizacionesChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hospitalizaciones: checked,
      hospitalizacionesDetalles: checked ? prev.hospitalizacionesDetalles : "",
    }));
  };

  const getSliderValue = (value: string, options: typeof consumoAlcoholOptions) => {
    const index = options.findIndex((opt) => opt.value === value);
    return index >= 0 ? index : 0;
  };

  const getSliderLabel = (index: number, options: typeof consumoAlcoholOptions) => {
    return options[index]?.label || options[0].label;
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Historia Personal
      </h2>

      <div className="space-y-6">
        {/* Desarrollo Evolutivo */}
        <div>
          <Label htmlFor="desarrolloEvolutivo">Desarrollo Evolutivo</Label>
          <TextArea
            id="desarrolloEvolutivo"
            name="desarrolloEvolutivo"
            placeholder="Describa el desarrollo evolutivo del paciente (embarazo, parto, hitos del desarrollo, niñez, adolescencia, etc.)"
            value={formData.desarrolloEvolutivo}
            onChange={(e) =>
              handleInputChange("desarrolloEvolutivo", e.target.value)
            }
            disabled={disabled}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya información sobre embarazo, parto, hitos del desarrollo,
            infancia y adolescencia
          </p>
        </div>

        {/* Historia Académica/Laboral */}
        <div>
          <Label htmlFor="historiaAcademicaLaboral">
            Historia Académica/Laboral
          </Label>
          <TextArea
            id="historiaAcademicaLaboral"
            name="historiaAcademicaLaboral"
            placeholder="Describa la trayectoria académica y laboral del paciente"
            value={formData.historiaAcademicaLaboral}
            onChange={(e) =>
              handleInputChange("historiaAcademicaLaboral", e.target.value)
            }
            disabled={disabled}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya logros, dificultades, cambios significativos en estudios o
            trabajo
          </p>
        </div>

        {/* Historia Médica */}
        <div>
          <Label htmlFor="historiaMedica">Historia Médica</Label>
          <TextArea
            id="historiaMedica"
            name="historiaMedica"
            placeholder="Describa el historial médico del paciente (enfermedades, cirugías, accidentes, condiciones crónicas, etc.)"
            value={formData.historiaMedica}
            onChange={(e) =>
              handleInputChange("historiaMedica", e.target.value)
            }
            disabled={disabled}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enfermedades, cirugías, accidentes, condiciones crónicas relevantes
          </p>
        </div>

        {/* Medicación Actual */}
        <div>
          <Label htmlFor="medicacionActual">Medicación Actual</Label>
          <TextArea
            id="medicacionActual"
            name="medicacionActual"
            placeholder="Liste los medicamentos actuales (nombre, dosis, frecuencia, para qué condición)"
            value={formData.medicacionActual}
            onChange={(e) =>
              handleInputChange("medicacionActual", e.target.value)
            }
            disabled={disabled}
            className="max-w-full"
            rows={4}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya nombre del medicamento, dosis, frecuencia y para qué se usa
          </p>
        </div>

        {/* Sección de Consumo de Sustancias */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Consumo de Sustancias
          </h3>

          <div className="space-y-6">
            {/* Consumo de Alcohol */}
            <div>
              <Label htmlFor="consumoAlcohol">Consumo de Alcohol</Label>
              <div className="mt-3">
                <input
                  type="range"
                  id="consumoAlcohol"
                  min="0"
                  max="3"
                  step="1"
                  value={getSliderValue(formData.consumoAlcohol, consumoAlcoholOptions)}
                  onChange={(e) => {
                    const index = parseInt(e.target.value);
                    handleInputChange(
                      "consumoAlcohol",
                      consumoAlcoholOptions[index].value
                    );
                  }}
                  disabled={disabled}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(getSliderValue(formData.consumoAlcohol, consumoAlcoholOptions) / 3) * 100}%, #e5e7eb ${(getSliderValue(formData.consumoAlcohol, consumoAlcoholOptions) / 3) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  {consumoAlcoholOptions.map((option) => (
                    <span key={option.value}>{option.label}</span>
                  ))}
                </div>
                <div className="mt-2 text-center text-sm font-medium text-gray-800 dark:text-white">
                  Seleccionado:{" "}
                  {getSliderLabel(
                    getSliderValue(formData.consumoAlcohol, consumoAlcoholOptions),
                    consumoAlcoholOptions
                  )}
                </div>
              </div>
            </div>

            {/* Consumo de Tabaco */}
            <div>
              <Label htmlFor="consumoTabaco">Consumo de Tabaco</Label>
              <div className="mt-3">
                <input
                  type="range"
                  id="consumoTabaco"
                  min="0"
                  max="3"
                  step="1"
                  value={getSliderValue(formData.consumoTabaco, consumoTabacoOptions)}
                  onChange={(e) => {
                    const index = parseInt(e.target.value);
                    handleInputChange(
                      "consumoTabaco",
                      consumoTabacoOptions[index].value
                    );
                  }}
                  disabled={disabled}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(getSliderValue(formData.consumoTabaco, consumoTabacoOptions) / 3) * 100}%, #e5e7eb ${(getSliderValue(formData.consumoTabaco, consumoTabacoOptions) / 3) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  {consumoTabacoOptions.map((option) => (
                    <span key={option.value}>{option.label}</span>
                  ))}
                </div>
                <div className="mt-2 text-center text-sm font-medium text-gray-800 dark:text-white">
                  Seleccionado:{" "}
                  {getSliderLabel(
                    getSliderValue(formData.consumoTabaco, consumoTabacoOptions),
                    consumoTabacoOptions
                  )}
                </div>
              </div>
            </div>

            {/* Consumo de Drogas */}
            <div>
              <Label htmlFor="consumoDrogas">Consumo de Drogas</Label>
              <TextArea
                id="consumoDrogas"
                name="consumoDrogas"
                placeholder="Especifique el tipo de droga y frecuencia de consumo (si aplica)"
                value={formData.consumoDrogas}
                onChange={(e) =>
                  handleInputChange("consumoDrogas", e.target.value)
                }
                disabled={disabled}
                className="max-w-full"
                rows={4}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Especifique tipo de sustancia, frecuencia y patrón de consumo
              </p>
            </div>
          </div>
        </div>

        {/* Tratamientos Previos */}
        <div>
          <Label>Tratamientos Psicológicos/Psiquiátricos Previos</Label>

          <div className="mt-3">
            <Checkbox
              id="tuveTratamientosPrevios"
              name="tuveTratamientosPrevios"
              label="¿Ha recibido tratamiento psicológico o psiquiátrico anteriormente?"
              checked={formData.tuveTratamientosPrevios}
              onChange={(e) => handleTratamientosChange(e.target.checked)}
              disabled={disabled}
            />
          </div>

          {formData.tuveTratamientosPrevios && (
            <div className="mt-4">
              <Label htmlFor="detallesTratamientosPrevios">
                Detalles de Tratamientos Previos
              </Label>
              <TextArea
                id="detallesTratamientosPrevios"
                name="detallesTratamientosPrevios"
                placeholder="Describa los tratamientos previos (tipo de tratamiento, profesional, duración, resultados, etc.)"
                value={formData.detallesTratamientosPrevios}
                onChange={(e) =>
                  handleInputChange(
                    "detallesTratamientosPrevios",
                    e.target.value
                  )
                }
                disabled={disabled}
                className="max-w-full"
                rows={5}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Incluya tipo de tratamiento, profesional, duración, diagnósticos
                y resultados
              </p>
            </div>
          )}
        </div>

        {/* Hospitalizaciones */}
        <div>
          <Label>Hospitalizaciones Psiquiátricas</Label>

          <div className="mt-3">
            <Checkbox
              id="tuveHospitalizaciones"
              name="tuveHospitalizaciones"
              label="¿Ha sido hospitalizado por motivos psiquiátricos o de salud mental?"
              checked={formData.tuveHospitalizaciones}
              onChange={(e) => handleHospitalizacionesChange(e.target.checked)}
              disabled={disabled}
            />
          </div>

          {formData.tuveHospitalizaciones && (
            <div className="mt-4">
              <Label htmlFor="detallesHospitalizaciones">
                Detalles de Hospitalizaciones
              </Label>
              <TextArea
                id="detallesHospitalizaciones"
                name="detallesHospitalizaciones"
                placeholder="Describa las hospitalizaciones (fecha, motivo, duración, institución, tratamiento recibido, etc.)"
                value={formData.detallesHospitalizaciones}
                onChange={(e) =>
                  handleInputChange("detallesHospitalizaciones", e.target.value)
                }
                disabled={disabled}
                className="max-w-full"
                rows={5}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Incluya fecha, motivo, duración, institución y tratamiento
                recibido
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
