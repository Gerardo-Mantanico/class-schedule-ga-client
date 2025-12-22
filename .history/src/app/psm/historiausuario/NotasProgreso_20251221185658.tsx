"use client";

import Button from "@/components/ui/button/Button";
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones";
import type { EvaluacionPeriodica } from "@/interfaces/historiaClinica/EvaluacionPeriodica";

interface NotasProgresoProps {
  onSubmit?: (data: EvaluacionPeriodica) => void;
  onCancel?: () => void;
  pacienteId?: string;
}

  onSubmit,
  onCancel,
  pacienteId,
}: NotasProgresoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const [formData, setFormData] = useState<EvaluacionPeriodica>({
    id: 0,
    hcId: 0,
    fechaEvalucacion: new Date().toISOString().slice(0, 16),
    tipoEvaluacion: 1,
    progresoObservado: "",
    objetivoAlcanzado: "",
    objetivosPedientes: "",
    recomendaciones: "",
    escalaProgreso: 0,
    modificacionPlanTratamiento: "",
    reevaluacionDiagnostico: "",
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  



  // Inicializar SignaturePad
  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      });
    }
  }, []);

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};
    if (!formData.fechaEvalucacion) {
      nuevosErrores.fechaEvalucacion = "La fecha de evaluación es requerida";
    }
    if (!formData.progresoObservado) {
      nuevosErrores.progresoObservado = "El progreso observado es requerido";
    }
    if (!formData.objetivoAlcanzado) {
      nuevosErrores.objetivoAlcanzado = "El objetivo alcanzado es requerido";
    }
    if (!formData.escalaProgreso || formData.escalaProgreso < 0) {
      nuevosErrores.escalaProgreso = "La escala de progreso es requerida";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };




  const handleLimpiarFirma = () => {
    signaturePadRef.current?.clear();
  };


const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;

 const { getItem, createItem } = useSesiones();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) {
      return;
    }
    if (!hcId) {
      alert("No se encontró el id de la historia clínica");
      return;
    }
    const payload: EvaluacionPeriodica = {
      ...formData,
      hcId: Number(hcId),
    };
    try {
      await createItem(payload);
      alert("Información guardada correctamente");
      onSubmit?.(payload);
    } catch (error: any) {
      alert(error?.message || "Error al guardar la información");
    }
  };
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b border-stroke px-4 py-6 sm:px-6">
        <h3 className="font-medium text-black">Notas de Progreso (por Sesión)</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* Fecha de Evaluación */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Fecha de Evaluación <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.fechaEvalucacion || ''}
            onChange={e => setFormData({ ...formData, fechaEvalucacion: e.target.value })}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
          {errores.fechaEvalucacion && <p className="mt-1 text-xs text-red-500">{errores.fechaEvalucacion}</p>}
        </div>

        {/* Tipo de Evaluación */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Tipo de Evaluación
          </label>
          <input
            type="number"
            value={formData.tipoEvaluacion}
            onChange={e => setFormData({ ...formData, tipoEvaluacion: Number(e.target.value) })}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
        </div>

        {/* Progreso Observado */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Progreso Observado <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.progresoObservado}
            onChange={e => setFormData({ ...formData, progresoObservado: e.target.value })}
            rows={3}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
          {errores.progresoObservado && <p className="mt-1 text-xs text-red-500">{errores.progresoObservado}</p>}
        </div>

        {/* Objetivo Alcanzado */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Objetivo Alcanzado <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.objetivoAlcanzado}
            onChange={e => setFormData({ ...formData, objetivoAlcanzado: e.target.value })}
            rows={2}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
          {errores.objetivoAlcanzado && <p className="mt-1 text-xs text-red-500">{errores.objetivoAlcanzado}</p>}
        </div>

        {/* Objetivos Pendientes */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Objetivos Pendientes
          </label>
          <textarea
            value={formData.objetivosPedientes}
            onChange={e => setFormData({ ...formData, objetivosPedientes: e.target.value })}
            rows={2}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
        </div>

        {/* Recomendaciones */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Recomendaciones
          </label>
          <textarea
            value={formData.recomendaciones}
            onChange={e => setFormData({ ...formData, recomendaciones: e.target.value })}
            rows={2}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
        </div>

        {/* Escala de Progreso */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Escala de Progreso <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.escalaProgreso}
            onChange={e => setFormData({ ...formData, escalaProgreso: Number(e.target.value) })}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
          {errores.escalaProgreso && <p className="mt-1 text-xs text-red-500">{errores.escalaProgreso}</p>}
        </div>

        {/* Modificación del Plan de Tratamiento */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Modificación del Plan de Tratamiento
          </label>
          <textarea
            value={formData.modificacionPlanTratamiento}
            onChange={e => setFormData({ ...formData, modificacionPlanTratamiento: e.target.value })}
            rows={2}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
        </div>

        {/* Re-evaluación Diagnóstico */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-black">
            Re-evaluación Diagnóstico
          </label>
          <textarea
            value={formData.reevaluacionDiagnostico}
            onChange={e => setFormData({ ...formData, reevaluacionDiagnostico: e.target.value })}
            rows={2}
            className="w-full appearance-none rounded border border-stroke bg-white px-4 py-2 text-black outline-none transition focus:border-primary"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Guardar Evaluación
          </Button>
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
