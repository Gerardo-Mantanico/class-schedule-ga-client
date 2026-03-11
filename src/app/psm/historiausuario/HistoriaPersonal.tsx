"use client";


import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import TextCongreso from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";

import type { HistoriaPersonal } from "@/interfaces/historiaClinica/HistoriaPersonal";
import { useHistoriaPersonal } from "@/hooks/historaClinica/useHistoriaPersonal";
import Button from "@/components/ui/button/Button";
import { toast } from "react-hot-toast";

interface HistoriaPersonalProps extends Partial<HistoriaPersonal> {
  onChange?: (data: HistoriaPersonal) => void;
  disabled?: boolean;
}

const consumoAlcoholOptions = [
  { value: "NUNCA", label: "Nunca" },
  { value: "OCASIONAL", label: "Ocasional" },
  { value: "MODERADO", label: "Moderado" },
  { value: "EXCESIVO", label: "Excesivo" },
];

const consumoTabacoOptions = [
  { value: "NUNCA", label: "Nunca" },
  { value: "OCASIONAL", label: "Ocasional" },
  { value: "FUMADOR", label: "Fumador" },
  { value: "EXFUMADOR", label: "Exfumador" },
];


export default function HistoriaPersonal({
  desarrolloEvolutivo = "",
  hAcademica = "",
  hMedica = "",
  medicacionActual = "",
  consumoAlcohol = "NUNCA",
  consumoTabaco = "NUNCA",
  consumoDrogras = "",
  tratamientosPrevios = false,
  tratamientosPreviosDetalles = "",
  hospitalizaciones = false,
  hospitalizacionesDetalles = "",
  onChange,
  disabled = false,
}: HistoriaPersonalProps) {
  const { getItem, createItem } = useHistoriaPersonal();


  const [formData, setFormData] = useState<HistoriaPersonal>({
  id: 0,
  hcId: 0,
  desarrolloEvolutivo: desarrolloEvolutivo ?? "",
  hAcademica: hAcademica ?? "",
  hMedica: hMedica ?? "",
  medicacionActual: medicacionActual ?? "",
  consumoAlcohol: consumoAlcohol ?? "NUNCA",
  consumoTabaco: consumoTabaco ?? "NUNCA",
  consumoDrogras: consumoDrogras ?? "",
  tratamientosPrevios: tratamientosPrevios ?? false,
  tratamientosPreviosDetalles: tratamientosPreviosDetalles ?? "",
  hospitalizaciones: hospitalizaciones ?? false,
  hospitalizacionesDetalles: hospitalizacionesDetalles ?? "",
});


  const [historiaExistente, setHistoriaExistente] = useState<HistoriaPersonal | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener el id de la historia clínica (ajusta la clave si es diferente)
  const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;

  useEffect(() => {
    if (!hcId) return setLoading(false);
    getItem(hcId)
      .then((data) => {
        if (data && data.id && data.id !== 0) {
          setHistoriaExistente(data);
          setFormData({ ...data });
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hcId]);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);
  const handleGuardar = async () => {
    try {
      if (!hcId) throw new Error("No se encontró el id de la historia clínica");
      const payload: HistoriaPersonal = {
        ...formData,
        hcId: Number(hcId),
      };
      await createItem(payload);
      toast.success('Información guardada correctamente');
      setHistoriaExistente(payload);
    } catch (error) {
      toast.error('Error al guardar la información');
    }
  };

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

  if (loading) return <p>Cargando datos...</p>;

  const readOnly = !!historiaExistente || disabled;

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Historia Personal
      </h2>

{historiaExistente && historiaExistente.id !== 0 && (
  <div className="mb-4 p-3 text-sm bg-yellow-100 rounded">
    Modo solo lectura: historia personal ya registrada
  </div>
)}
      <div className="space-y-6">
        {/* Desarrollo Evolutivo */}
        <div>
          <Label htmlFor="desarrolloEvolutivo">Desarrollo Evolutivo</Label>
          <TextCongreso
            placeholder="Describa el desarrollo evolutivo del paciente (embarazo, parto, hitos del desarrollo, niñez, adolescencia, etc.)"
            value={formData.desarrolloEvolutivo}
            onChange={(v) => handleInputChange("desarrolloEvolutivo", v)}
            disabled={readOnly}
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
          <TextCongreso
            placeholder="Describa la trayectoria académica y laboral del paciente"
            value={formData.hAcademica}
            onChange={(v) => handleInputChange("hAcademica", v)}
            disabled={readOnly}
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
          <TextCongreso
            placeholder="Describa el historial médico del paciente (enfermedades, cirugías, accidentes, condiciones crónicas, etc.)"
            value={formData.hMedica }
            onChange={(v) => handleInputChange("hMedica", v)}
            disabled={readOnly}
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
          <TextCongreso
            placeholder="Liste los medicamentos actuales (nombre, dosis, frecuencia, para qué condición)"
            value={formData.medicacionActual}
            onChange={(v) => handleInputChange("medicacionActual", v)}
            disabled={readOnly}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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
              <TextCongreso
                placeholder="Especifique el tipo de droga y frecuencia de consumo (si aplica)"
                value={formData.consumoDrogras}
                onChange={(v) => handleInputChange("consumoDrogras", v)}
                disabled={readOnly}
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
              label="¿Ha recibido tratamiento psicológico o psiquiátrico anteriormente?"
              checked={formData.tratamientosPrevios}
              onChange={handleTratamientosChange}
              disabled={readOnly}
            />
          </div>

          {formData.tratamientosPrevios && (
            <div className="mt-4">
              <Label htmlFor="detallesTratamientosPrevios">
                Detalles de Tratamientos Previos
              </Label>
              <TextCongreso
                placeholder="Describa los tratamientos previos (tipo de tratamiento, profesional, duración, resultados, etc.)"
                value={formData.tratamientosPreviosDetalles}
                onChange={(v) => handleInputChange("tratamientosPreviosDetalles", v)}
                disabled={readOnly}
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
              label="¿Ha sido hospitalizado por motivos psiquiátricos o de salud mental?"
              checked={formData.hospitalizaciones}
              onChange={handleHospitalizacionesChange}
              disabled={readOnly}
            />
          </div>

          {formData.hospitalizaciones && (
            <div className="mt-4">
              <Label htmlFor="detallesHospitalizaciones">
                Detalles de Hospitalizaciones
              </Label>
              <TextCongreso
                placeholder="Describa las hospitalizaciones (fecha, motivo, duración, institución, tratamiento recibido, etc.)"
                value={formData.hospitalizacionesDetalles}
                onChange={(v) => handleInputChange("hospitalizacionesDetalles", v)}
                disabled={readOnly}
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
      {/* Botón para guardar solo si NO existe el registro */}
      {!historiaExistente && (
        <div className="mt-8 flex justify-end">
          <Button onClick={handleGuardar} disabled={readOnly}>
            Guardar información
          </Button>
        </div>
      )}
    </div>
  );
}
