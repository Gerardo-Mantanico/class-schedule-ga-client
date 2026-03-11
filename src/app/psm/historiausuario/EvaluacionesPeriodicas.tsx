
  "use client";
  import React, { useState } from "react";
  import { EvaluacionPeriodica } from "../../../interfaces/historiaClinica/EvaluacionPeriodica";
  import { useEvaluacionPeriodica } from "../../../hooks/historaClinica/useEvaluacionPeriodica";

  import Button from "../../../components/ui/button/Button";
import { toast } from "react-hot-toast";

interface EvaluacionesPeriodicasProps {
  onSubmit?: (data: EvaluacionPeriodica) => void;
  onCancel?: () => void;
  pacienteId?: string;
  evaluacion?: EvaluacionPeriodica;
}

export default function EvaluacionesPeriodicas({
    onSubmit,
    onCancel,
    pacienteId,
    evaluacion,
  }: EvaluacionesPeriodicasProps) {
    const { createItem, loading, error } = useEvaluacionPeriodica();
    const [formData, setFormData] = useState<EvaluacionPeriodica>({
      id: 0,
      hcId: pacienteId ? parseInt(pacienteId) : 0,
      fechaEvalucacion: new Date().toISOString().split("T")[0],
      tipoEvaluacion: 2,
      progresoObservado: "",
      objetivoAlcanzado: "",
      objetivosPedientes: "",
      recomendaciones: "",
      escalaProgreso: 5,
      modificacionPlanTratamiento: "",
      reevaluacionDiagnostico: "",
    });
    const [errores, setErrores] = useState<Record<string, string>>({});

    // Si hay evaluación seleccionada, mostrar solo los detalles
    if (evaluacion !== undefined && evaluacion !== null) {
      return (
        <div title="Detalle de Evaluación" className="max-w-2xl mx-auto mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-gray-500 mb-1">Fecha</span>
              <span className="font-medium text-gray-900 dark:text-white">{evaluacion.fechaEvalucacion}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Tipo</span>
              <span className="font-medium text-gray-900 dark:text-white">{["Parcial", "Seguimiento", "Final"][evaluacion.tipoEvaluacion - 1]}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Escala de Progreso</span>
              <span className="font-medium text-gray-900 dark:text-white">{evaluacion.escalaProgreso} / 10</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <span className="block text-xs text-gray-500 mb-1">Progreso Observado</span>
              <span className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{evaluacion.progresoObservado}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Objetivo Alcanzado</span>
              <span className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{evaluacion.objetivoAlcanzado}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Objetivos Pendientes</span>
              <span className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{evaluacion.objetivosPedientes}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Recomendaciones</span>
              <span className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{evaluacion.recomendaciones}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Modificación Plan Tratamiento</span>
              <span className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{evaluacion.modificacionPlanTratamiento}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Reevaluación Diagnóstico</span>
              <span className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{evaluacion.reevaluacionDiagnostico}</span>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button variant="primary" onClick={onCancel}>
              Cerrar
            </Button>
          </div>
        </div>
      );
    }

   
    const tiposEvaluacion = [
      { label: "Parcial", value: 1 },
      { label: "Seguimiento", value: 2 },
      { label: "Final", value: 3 },
    ];

    const validar = () => {
      const nuevosErrores: Record<string, string> = {};

      // Validar fecha
      const fechaEvaluacion = new Date(formData.fechaEvalucacion || "");
      if (fechaEvaluacion > new Date()) {
        nuevosErrores.fechaEvalucacion = "La fecha no puede ser posterior a hoy";
      }

      // Validar campos de texto requeridos
      if (!formData.progresoObservado.trim()) {
        nuevosErrores.progresoObservado = "El progreso observado es requerido";
      }

      if (!formData.objetivoAlcanzado.trim()) {
        nuevosErrores.objetivoAlcanzado = "Los objetivos alcanzados son requeridos";
      }

      if (!formData.objetivosPedientes.trim()) {
        nuevosErrores.objetivosPedientes = "Los objetivos pendientes son requeridos";
      }

      setErrores(nuevosErrores);
      return Object.keys(nuevosErrores).length === 0;
    };

const handleSubmit = async (e: React.FormEvent) => {
  const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;

  e.preventDefault();
  if (!validar()) {
    return;
  }
  // Guardar usando el hook
  formData.hcId = hcId ? parseInt(hcId) : 0;
 createItem(formData).then((success: boolean) => {
  if (success) {
    toast.success('Información guardada correctamente');
    onSubmit?.(formData); // Puedes pasar formData o undefined según tu lógica
    setFormData({
      id: 0,
      hcId: pacienteId ? parseInt(pacienteId) : 0,
      fechaEvalucacion: new Date().toISOString().split("T")[0],
      tipoEvaluacion: 2,
      progresoObservado: "",
      objetivoAlcanzado: "",
      objetivosPedientes: "",
      recomendaciones: "",
      escalaProgreso: 5,
      modificacionPlanTratamiento: "",
      reevaluacionDiagnostico: "",
    });
    window.location.reload();
  } else {
    toast.error('No se pudo guardar la información');
  }
});
};

    const renderStars = () => {
      return (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, escalaProgreso: star })}
              className={`text-2xl transition-transform hover:scale-110 ${
                star <= formData.escalaProgreso ? "text-yellow-400" : "text-gray-300"
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
        {loading && <div className="text-center text-gray-500">Cargando...</div>}
        <div className="border-b border-stroke px-4 py-6 sm:px-6">
          <h3 className="font-medium text-black">Evaluaciones Periódicas</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Fila 1: Fecha y Tipo de Evaluación */}
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-medium text-black">Fecha de Evaluación</label>
              <input
                type="date"
                value={formData.fechaEvalucacion ?? ""}
                onChange={(e) => setFormData({ ...formData, fechaEvalucacion: e.target.value })}
                className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                  errores.fechaEvalucacion ? "border-red-500" : "border-stroke"
                }`}
                max={new Date().toISOString().split("T")[0]}
              />
              {errores.fechaEvalucacion && (
                <span className="text-xs text-red-500">{errores.fechaEvalucacion}</span>
              )}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-black">Tipo de Evaluación</label>
              <select
                value={formData.tipoEvaluacion}
                onChange={(e) => setFormData({ ...formData, tipoEvaluacion: Number(e.target.value) })}
                className="w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary border-stroke"
              >
                {tiposEvaluacion.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Progreso Observado */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">Progreso Observado</label>
            <textcongreso
              value={formData.progresoObservado}
              onChange={(e) => setFormData({ ...formData, progresoObservado: e.target.value })}
              rows={4}
              placeholder="Describa el progreso observado en el paciente"
              className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                errores.progresoObservado ? "border-red-500" : "border-stroke"
              }`}
            />
            {errores.progresoObservado && (
              <span className="text-xs text-red-500">{errores.progresoObservado}</span>
            )}
          </div>

          {/* Objetivos Alcanzados */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">Objetivos Alcanzados</label>
            <textcongreso
              value={formData.objetivoAlcanzado}
              onChange={(e) => setFormData({ ...formData, objetivoAlcanzado: e.target.value })}
              rows={4}
              placeholder="Liste los objetivos que han sido alcanzados"
              className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                errores.objetivoAlcanzado ? "border-red-500" : "border-stroke"
              }`}
            />
            {errores.objetivoAlcanzado && (
              <span className="text-xs text-red-500">{errores.objetivoAlcanzado}</span>
            )}
          </div>

          {/* Objetivos Pendientes */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">Objetivos Pendientes</label>
            <textcongreso
              value={formData.objetivosPedientes}
              onChange={(e) => setFormData({ ...formData, objetivosPedientes: e.target.value })}
              rows={4}
              placeholder="Liste los objetivos que aún están pendientes"
              className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                errores.objetivosPedientes ? "border-red-500" : "border-stroke"
              }`}
            />
            {errores.objetivosPedientes && (
              <span className="text-xs text-red-500">{errores.objetivosPedientes}</span>
            )}
          </div>

          {/* Recomendaciones */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">Recomendaciones</label>
            <textcongreso
              value={formData.recomendaciones}
              onChange={(e) => setFormData({ ...formData, recomendaciones: e.target.value })}
              rows={4}
              placeholder="Proporcione recomendaciones para el tratamiento futuro"
              className={`w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary ${
                errores.recomendaciones ? "border-red-500" : "border-stroke"
              }`}
            />
            {errores.recomendaciones && (
              <span className="text-xs text-red-500">{errores.recomendaciones}</span>
            )}
          </div>
          {/* Escala de Progreso */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">Escala de Progreso (1-10)</label>
            <div className="mb-3 flex items-center justify-between">
              {renderStars()}
              <span className="ml-4 text-sm text-gray-500">{formData.escalaProgreso}</span>
            </div>
            {errores.escalaProgreso && (
              <span className="text-xs text-red-500">{errores.escalaProgreso}</span>
            )}
          </div>

          {/* Modificación del Plan de Tratamiento */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">Modificación del Plan de Tratamiento</label>
            <textcongreso
              value={formData.modificacionPlanTratamiento}
              onChange={(e) => setFormData({ ...formData, modificacionPlanTratamiento: e.target.value })}
              rows={3}
              placeholder="Describa cualquier modificación al plan de tratamiento"
              className="w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary border-stroke"
            />
          </div>

          {/* Re-evaluación Diagnóstico */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black">Re-evaluación Diagnóstico</label>
            <textcongreso
              value={formData.reevaluacionDiagnostico}
              onChange={(e) => setFormData({ ...formData, reevaluacionDiagnostico: e.target.value })}
              rows={3}
              placeholder="Describa la re-evaluación del diagnóstico si aplica"
              className="w-full appearance-none rounded border bg-white px-4 py-2 text-black outline-none transition focus:border-primary border-stroke"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="rounded bg-primary px-6 py-2 text-white hover:bg-primary-dark"
            >
             Guardar
            </Button>
            <Button
              type="button"
              className="rounded bg-gray-300 px-6 py-2 text-black hover:bg-gray-400"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }
