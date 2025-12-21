"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Radio from "@/components/form/input/Radio";
import type { EstadoActual } from "@/interfaces/historiaClinica/EstadoActual";
import { useEstadoActual } from "../../../hooks/historaClinica/useEstadoActual";

interface EstadoActualProps extends Partial<EstadoActual> {
  onChange?: (data: EstadoActual) => void;
  disabled?: boolean;
}

const escalaLikert = [
  { value: 1, label: "1 - Muy bajo" },
  { value: 2, label: "2 - Bajo" },
  { value: 3, label: "3 - Normal" },
  { value: 4, label: "4 - Alto" },
  { value: 5, label: "5 - Muy alto" },
];

export default function EstadoActual({
  onChange,
  ...props
}: EstadoActualProps) {
  const { getItem, createItem } = useEstadoActual();

  const [estadoActual, setEstadoActual] = useState<EstadoActual | null>(null);
  const [formData, setFormData] = useState<EstadoActual>({
    id: 0,
    hcId: 0,
    estadoAnimo: 0,
    ansiedad: 0,
    funcionamientoSocial: 0,
    calidadSueno: 0,
    apetito: 0,
    observacionesGenerales: "",
    ...props,
  });
  const [loading, setLoading] = useState(true);

  // Consulta si existe registro al montar
  useEffect(() => {
    if (!formData.hcId) {
      setLoading(false);
      return;
    }
    getItem(formData.hcId)
      .then((data) => {
        if (data && data.id && data.id !== 0) {
          setEstadoActual(data);
          setFormData(data);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.hcId]);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = <K extends keyof EstadoActual>(
    field: K,
    value: EstadoActual[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGuardar = async () => {
    setLoading(true);
    try {
      await createItem(formData);
      // Vuelve a consultar para bloquear el formulario
      const data = await getItem(formData.hcId);
      if (data && data.id && data.id !== 0) {
        setEstadoActual(data);
        setFormData(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = !!estadoActual;

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Estado Actual
      </h2>

      <div className="space-y-8">
        {/* Estado de Ánimo */}
        <div>
          <Label>Estado de Ánimo</Label>
          <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            Evalúe el estado de ánimo actual del paciente
          </p>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            {escalaLikert.map((opcion) => (
              <Radio
                key={`estado-animo-${opcion.value}`}
                id={`estado-animo-${opcion.value}`}
                name="estadoAnimo"
                value={opcion.value.toString()}
                label={opcion.label}
                checked={formData.estadoAnimo === opcion.value}
                onChange={(e) =>
                  handleInputChange("estadoAnimo", parseInt(e.target.value))
                }
                disabled={isReadOnly}
              />
            ))}
          </div>
        </div>

        {/* Ansiedad */}
        <div>
          <Label>Nivel de Ansiedad</Label>
          <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            Evalúe el nivel de ansiedad del paciente
          </p>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            {escalaLikert.map((opcion) => (
              <Radio
                key={`ansiedad-${opcion.value}`}
                id={`ansiedad-${opcion.value}`}
                name="ansiedad"
                value={opcion.value.toString()}
                label={opcion.label}
                checked={formData.ansiedad === opcion.value}
                onChange={(e) =>
                  handleInputChange("ansiedad", parseInt(e.target.value))
                }
                disabled={isReadOnly}
              />
            ))}
          </div>
        </div>

        {/* Funcionamiento Social */}
        <div>
          <Label>Funcionamiento Social</Label>
          <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            Evalúe el funcionamiento social del paciente (relaciones,
            interacciones, etc.)
          </p>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            {escalaLikert.map((opcion) => (
              <Radio
                key={`funcionamiento-social-${opcion.value}`}
                id={`funcionamiento-social-${opcion.value}`}
                name="funcionamientoSocial"
                value={opcion.value.toString()}
                label={opcion.label}
                checked={formData.funcionamientoSocial === opcion.value}
                onChange={(e) =>
                  handleInputChange(
                    "funcionamientoSocial",
                    parseInt(e.target.value)
                  )
                }
                disabled={isReadOnly}
              />
            ))}
          </div>
        </div>

        {/* Calidad de Sueño */}
        <div>
          <Label>Calidad de Sueño</Label>
          <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            Evalúe la calidad del sueño del paciente
          </p>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            {escalaLikert.map((opcion) => (
              <Radio
                key={`calidad-sueno-${opcion.value}`}
                id={`calidad-sueno-${opcion.value}`}
                name="calidadSueno"
                value={opcion.value.toString()}
                label={opcion.label}
                checked={formData.calidadSueno === opcion.value}
                onChange={(e) =>
                  handleInputChange("calidadSueno", parseInt(e.target.value))
                }
                disabled={isReadOnly}
              />
            ))}
          </div>
        </div>

        {/* Apetito */}
        <div>
          <Label>Apetito</Label>
          <p className="mb-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            Evalúe el nivel de apetito del paciente
          </p>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            {escalaLikert.map((opcion) => (
              <Radio
                key={`apetito-${opcion.value}`}
                id={`apetito-${opcion.value}`}
                name="apetito"
                value={opcion.value.toString()}
                label={opcion.label}
                checked={formData.apetito === opcion.value}
                onChange={(v) =>
                  handleInputChange("apetito", parseInt(v))
                }
                disabled={isReadOnly}
                   
              />
            ))}
          </div>
        </div>

        {/* Observaciones Generales */}
        <div>
          <Label htmlFor="observacionesGenerales">
            Observaciones Generales
          </Label>
          <TextArea
            id="observacionesGenerales"
            name="observacionesGenerales"
            placeholder="Incluya observaciones adicionales sobre el estado actual del paciente"
            value={formData.observacionesGenerales}
            onChange={(v) =>
              handleInputChange("observacionesGenerales", v)
            }
            disabled={isReadOnly}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Añada cualquier observación relevante sobre el estado actual del
            paciente
          </p>
        </div>

        {/* Botón Guardar solo si no existe registro */}
        {!isReadOnly && (
          <div>
            <button
              type="button"
              className="mt-4 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={handleGuardar}
              disabled={loading}
            >
              Guardar
            </button>
          </div>
        )}

        {/* Resumen Visual */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="mb-3 text-sm font-semibold text-blue-800 dark:text-blue-300">
            Resumen de Evaluación
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Estado de Ánimo:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.estadoAnimo > 0
                  ? `${formData.estadoAnimo}/5`
                  : "Sin evaluar"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Ansiedad:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.ansiedad > 0
                  ? `${formData.ansiedad}/5`
                  : "Sin evaluar"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Funcionamiento Social:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.funcionamientoSocial > 0
                  ? `${formData.funcionamientoSocial}/5`
                  : "Sin evaluar"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Calidad de Sueño:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.calidadSueno > 0
                  ? `${formData.calidadSueno}/5`
                  : "Sin evaluar"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Apetito:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.apetito > 0 ? `${formData.apetito}/5` : "Sin evaluar"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}