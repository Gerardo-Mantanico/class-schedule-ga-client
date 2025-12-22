"use client";

import Button from "@/components/ui/button/Button";
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones";

interface NotasProgresoProps {
  onSubmit?: (data: NotasProgresoData) => void;
  onCancel?: () => void;
  pacienteId?: string;
}

interface NotasProgresoData {
  fechaSesion: string;
  numeroSesion: number;
  asistencia: boolean;
  justificacionInasistencia?: string;
  temasAbordados: string;
  intervenciones: string;
  respuestaPaciente: string;
  tareasAsignadas?: string;
  observaciones?: string;
  proximaCita: string;
  firmaDigital: string;
}

export default function NotasProgreso({
  onSubmit,
  onCancel,
  pacienteId,
}: NotasProgresoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const [formData, setFormData] = useState<NotasProgresoData>({
    fechaSesion: new Date().toISOString().slice(0, 16),
    numeroSesion: 1,
    asistencia: true,
    justificacionInasistencia: "",
    temasAbordados: "",
    intervenciones: "",
    respuestaPaciente: "",
    tareasAsignadas: "",
    observaciones: "",
    proximaCita: "",
    firmaDigital: "",
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [createItem] = useSesiones();

  const hcId =
    typeof window !== "undefined"
      ? localStorage.getItem("HistoriClinica")
      : null;

  /* ===============================
     Inicializar SignaturePad
     =============================== */
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

  /* ===============================
     Validaciones
     =============================== */
  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    // Fecha sesión
    const fechaSesion = new Date(formData.fechaSesion);
    if (fechaSesion > new Date()) {
      nuevosErrores.fechaSesion =
        "La fecha debe ser igual o anterior a hoy";
    }

    // Próxima cita
    if (!formData.proximaCita) {
      nuevosErrores.proximaCita = "La próxima cita es obligatoria";
    } else {
      const proximaCita = new Date(formData.proximaCita);
      if (proximaCita <= new Date()) {
        nuevosErrores.proximaCita =
          "La próxima cita debe ser posterior a hoy";
      }
    }

    // Inasistencia
    if (!formData.asistencia && !formData.justificacionInasistencia?.trim()) {
      nuevosErrores.justificacionInasistencia =
        "La justificación es requerida";
    }

    // Temas abordados
    if (!formData.temasAbordados.trim()) {
      nuevosErrores.temasAbordados =
        "Debe ingresar al menos un tema";
    }

    // Firma
    if (signaturePadRef.current?.isEmpty()) {
      nuevosErrores.firma = "La firma digital es requerida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /* ===============================
     Limpiar firma
     =============================== */
  const handleLimpiarFirma = () => {
    signaturePadRef.current?.clear();
  };

  /* ===============================
     Submit
     =============================== */
  const handleSubmit = async (e: React.FormEvent) => {


    // try {
    //   await createItem(datosCompletos);
    //   alert("Información guardada correctamente");
    //   onSubmit?.(datosCompletos);
    // } catch (error: any) {
    //   alert(error?.message || "Error al guardar la información");
    // }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      <div className="border-b border-stroke px-4 py-6 sm:px-6">
        <h3 className="font-medium text-black">
          Notas de Progreso (por Sesión)
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* Fecha y número sesión */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Fecha de Sesión *
            </label>
            <input
              disabled
              type="datetime-local"
              value={formData.fechaSesion}
              className="w-full rounded border border-stroke px-4 py-2"
            />
            {errores.fechaSesion && (
              <p className="text-xs text-red-500">
                {errores.fechaSesion}
              </p>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Nº de Sesión *
            </label>
            <input
              disabled
              type="number"
              value={formData.numeroSesion}
              className="w-full rounded border border-stroke bg-gray-100 px-4 py-2"
            />
          </div>
        </div>

        {/* Asistencia */}
        <div className="mb-6">
          <label className="mr-4 text-sm font-medium text-black">
            Asistencia *
          </label>
          <input
            type="checkbox"
            checked={formData.asistencia}
            onChange={(e) =>
              setFormData({ ...formData, asistencia: e.target.checked })
            }
            className="ml-2"
          />
        </div>

        {/* Justificación */}
        {!formData.asistencia && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-black">
              Justificación *
            </label>
            <input
              type="text"
              value={formData.justificacionInasistencia}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  justificacionInasistencia: e.target.value,
                })
              }
              className="w-full rounded border px-4 py-2"
            />
            {errores.justificacionInasistencia && (
              <p className="text-xs text-red-500">
                {errores.justificacionInasistencia}
              </p>
            )}
          </div>
        )}

        {/* Temas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black">
            Temas Abordados *
          </label>
          <input
            type="text"
            value={formData.temasAbordados}
            onChange={(e) =>
              setFormData({
                ...formData,
                temasAbordados: e.target.value,
              })
            }
            className="w-full rounded border px-4 py-2"
          />
          {errores.temasAbordados && (
            <p className="text-xs text-red-500">
              {errores.temasAbordados}
            </p>
          )}
        </div>

        {/* Intervenciones */}
        <textarea
          className="mb-6 w-full rounded border px-4 py-2"
          rows={4}
          placeholder="Intervenciones"
          value={formData.intervenciones}
          onChange={(e) =>
            setFormData({
              ...formData,
              intervenciones: e.target.value,
            })
          }
        />

        {/* Respuesta */}
        <textarea
          className="mb-6 w-full rounded border px-4 py-2"
          rows={4}
          placeholder="Respuesta del paciente"
          value={formData.respuestaPaciente}
          onChange={(e) =>
            setFormData({
              ...formData,
              respuestaPaciente: e.target.value,
            })
          }
        />

        {/* Próxima cita */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black">
            Próxima Cita *
          </label>
          <input
            type="datetime-local"
            value={formData.proximaCita}
            onChange={(e) =>
              setFormData({
                ...formData,
                proximaCita: e.target.value,
              })
            }
            className="w-full rounded border px-4 py-2"
          />
          {errores.proximaCita && (
            <p className="text-xs text-red-500">
              {errores.proximaCita}
            </p>
          )}
        </div>

        {/* Firma */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black">
            Firma Digital *
          </label>
          <canvas
            ref={canvasRef}
            className="w-full border"
            style={{ height: 200 }}
          />
          <button
            type="button"
            onClick={handleLimpiarFirma}
            className="mt-2 rounded border px-4 py-2"
          >
            Limpiar Firma
          </button>
          {errores.firma && (
            <p className="text-xs text-red-500">{errores.firma}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit">Guardar</Button>
          {onCancel && (
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
