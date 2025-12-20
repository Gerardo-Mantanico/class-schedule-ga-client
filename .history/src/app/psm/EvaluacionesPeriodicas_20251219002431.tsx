"use client";

import React, { useState } from "react";

interface EvaluacionesPeriodicasProps {
  onSubmit?: (data: EvaluacionesPeriodicasData) => void;
  onCancel?: () => void;
  pacienteId?: string;
}

interface EvaluacionesPeriodicasData {
  fechaEvaluacion: string;
  tipoEvaluacion: "Parcial" | "Seguimiento" | "Final";
  progresoObservado: string;
  objetivosAlcanzados: string;
  objetivosPendientes: string;
  recomendaciones: string;
  escalaProgreso: number;
}

export default function EvaluacionesPeriodicas({
  onSubmit,
  onCancel,
  pacienteId,
}: EvaluacionesPeriodicasProps) {
  const [formData, setFormData] = useState<EvaluacionesPeriodicasData>({
    fechaEvaluacion: new Date().toISOString().split("T")[0],
    tipoEvaluacion: "Seguimiento",
    progresoObservado: "",
    objetivosAlcanzados: "",
    objetivosPendientes: "",
    recomendaciones: "",
    escalaProgreso: 5,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const tiposEvaluacion = ["Parcial", "Seguimiento", "Final"];

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    // Validar fecha
    const fechaEvaluacion = new Date(formData.fechaEvaluacion);
    if (fechaEvaluacion > new Date()) {
      nuevosErrores.fechaEvaluacion =
        "La fecha no puede ser posterior a hoy";
    }

    // Validar campos de texto requeridos
    if (!formData.progresoObservado.trim()) {
      nuevosErrores.progresoObservado =
        "El progreso observado es requerido";
    }

    if (!formData.objetivosAlcanzados.trim()) {
      nuevosErrores.objetivosAlcanzados =
        "Los objetivos alcanzados son requeridos";
    }

    if (!formData.objetivosPendientes.trim()) {
      nuevosErrores.objetivosPendientes =
        "Los objetivos pendientes son requeridos";
    }

    if (!formData.recomendaciones.trim()) {
      nuevosErrores.recomendaciones = "Las recomendaciones son requeridas";
    }

    // Validar escala de progreso
    if (formData.escalaProgreso < 1 || formData.escalaProgreso > 10) {
      nuevosErrores.escalaProgreso = "La escala debe estar entre 1 y 10";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    onSubmit?.(formData);
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              setFormData({ ...formData, escalaProgreso: star })
            }
            className={`text-2xl transition-transform hover:scale-110 ${
              star <= formData.escalaProgreso
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b border-stroke px-4 py-6 sm:px-6">
        <h3 className="font-medium text-black">Evaluaciones Periódicas</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* Fila 1: Fecha y Tipo de Evaluación */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Fecha de Evaluación */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Fecha de Evaluación <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.fechaEvaluacion}
              onChange={(e) =>
                setFormData({ ...formData, fechaEvaluacion: e.target.value })
              }
              className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                errores.fechaEvaluacion ? "border-red-500" : "border-stroke"
              }`}
              max={new Date().toISOString().split("T")[0]}
            />
            {errores.fechaEvaluacion && (
              <p className="mt-1 text-xs text-red-500">
                {errores.fechaEvaluacion}
              </p>
            )}
          </div>

          {/* Tipo de Evaluación */}
          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Tipo de Evaluación <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipoEvaluacion}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipoEvaluacion: e.target.value as
                    | "Parcial"
                    | "Seguimiento"
                    | "Final",
                })
              }
              className="relative w-full appearance-none rounded border border-stroke bg-white px-4 py-2 pr-8 text-black outline-none transition focus:border-primary"
            >
              {tiposEvaluacion.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progreso Observado */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Progreso Observado <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.progresoObservado}
            onChange={(e) =>
              setFormData({ ...formData, progresoObservado: e.target.value })
            }
            rows={4}
            placeholder="Describa el progreso observado en el paciente"
            className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
              errores.progresoObservado ? "border-red-500" : "border-stroke"
            }`}
          />
          {errores.progresoObservado && (
            <p className="mt-1 text-xs text-red-500">
              {errores.progresoObservado}
            </p>
          )}
        </div>

        {/* Objetivos Alcanzados */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Objetivos Alcanzados <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.objetivosAlcanzados}
            onChange={(e) =>
              setFormData({ ...formData, objetivosAlcanzados: e.target.value })
            }
            rows={4}
            placeholder="Liste los objetivos que han sido alcanzados"
            className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
              errores.objetivosAlcanzados ? "border-red-500" : "border-stroke"
            }`}
          />
          {errores.objetivosAlcanzados && (
            <p className="mt-1 text-xs text-red-500">
              {errores.objetivosAlcanzados}
            </p>
          )}
        </div>

        {/* Objetivos Pendientes */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Objetivos Pendientes <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.objetivosPendientes}
            onChange={(e) =>
              setFormData({ ...formData, objetivosPendientes: e.target.value })
            }
            rows={4}
            placeholder="Liste los objetivos que aún están pendientes"
            className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
              errores.objetivosPendientes ? "border-red-500" : "border-stroke"
            }`}
          />
          {errores.objetivosPendientes && (
            <p className="mt-1 text-xs text-red-500">
              {errores.objetivosPendientes}
            </p>
          )}
        </div>

        {/* Recomendaciones */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Recomendaciones <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.recomendaciones}
            onChange={(e) =>
              setFormData({ ...formData, recomendaciones: e.target.value })
            }
            rows={4}
            placeholder="Proporcione recomendaciones para el tratamiento futuro"
            className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
              errores.recomendaciones ? "border-red-500" : "border-stroke"
            }`}
          />
          {errores.recomendaciones && (
            <p className="mt-1 text-xs text-red-500">
              {errores.recomendaciones}
            </p>
          )}
        </div>

        {/* Escala de Progreso */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Escala de Progreso (1-10) <span className="text-red-500">*</span>
          </label>
          <div className="mb-3 flex items-center justify-between">
            {renderStars()}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={formData.escalaProgreso}
              onChange={(e) => {
                const valor = parseInt(e.target.value) || 5;
                if (valor >= 1 && valor <= 10) {
                  setFormData({ ...formData, escalaProgreso: valor });
                }
              }}
              className="w-20 appearance-none rounded border border-stroke bg-white px-3 py-2 text-center text-black outline-none transition focus:border-primary"
            />
            <span className="text-sm text-gray-600">/ 10</span>
          </div>
          {errores.escalaProgreso && (
            <p className="mt-1 text-xs text-red-500">
              {errores.escalaProgreso}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Guardar Evaluación
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex justify-center rounded border border-stroke bg-white px-6 py-2 font-medium text-black hover:bg-gray-100"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
