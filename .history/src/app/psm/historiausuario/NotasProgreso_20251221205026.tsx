"use client";

import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import Button from "@/components/ui/button/Button";
import { useSesiones } from "../../../hooks/historaClinica/useSesiones";
import { Sesion } from "@/interfaces/historiaClinica/Sesiones";
import NotasProgresoPanel from "./NotasProgresoPanel";

interface NotasProgresoProps {
  onSubmit?: (data: Sesion) => void;
  onCancel?: () => void;
  pacienteId?: string;
}

export default function NotasProgreso({
  onSubmit,
  onCancel,
  pacienteId,
}: NotasProgresoProps) {
  /** =========================
   * REFS FIRMA
   ========================== */
  const canvasPacienteRef = useRef<HTMLCanvasElement>(null);
  const signaturePacienteRef = useRef<SignaturePad | null>(null);

  const canvasPsicologoRef = useRef<HTMLCanvasElement>(null);
  const signaturePsicologoRef = useRef<SignaturePad | null>(null);

  /** =========================
   * STATE
   ========================== */
  const [formData, setFormData] = useState<Sesion>({
    fecha: new Date().toISOString().slice(0, 16),
    numeroSesiones: 1,
    asistencia: true,
    justificacionInasistencia: "",
    temasAbordados: "",
    intervencionesRealizadas: "",
    repuestaPaciente: "",
    tareasAsignadas: "",
    observaciones: "",
    proximaCita: "",
    firmaPsicologo: "",
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [notasGuardadas, setNotasGuardadas] = useState<Sesion[]>([]);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const { createItem } = useSesiones();

  const hcId =
    typeof window !== "undefined"
      ? localStorage.getItem("HistoriClinica")
      : null;

  /** =========================
   * INIT SIGNATURE PAD
   ========================== */
  useEffect(() => {
    const initSignature = (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      sigRef: React.MutableRefObject<SignaturePad | null>
    ) => {
      if (canvasRef.current && !sigRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        sigRef.current = new SignaturePad(canvas, {
          backgroundColor: "#fff",
          penColor: "#000",
        });
      }
    };

    initSignature(canvasPacienteRef, signaturePacienteRef);
    initSignature(canvasPsicologoRef, signaturePsicologoRef);
  }, []);

  /** =========================
   * VALIDACIÓN
   ========================== */
  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.temasAbordados.trim()) {
      nuevosErrores.temasAbordados = "Campo requerido";
    }

    if (!formData.intervencionesRealizadas.trim()) {
      nuevosErrores.intervencionesRealizadas = "Campo requerido";
    }

    if (!formData.repuestaPaciente.trim()) {
      nuevosErrores.repuestaPaciente = "Campo requerido";
    }

    if (!formData.proximaCita) {
      nuevosErrores.proximaCita = "La próxima cita es requerida";
    } else if (new Date(formData.proximaCita) <= new Date()) {
      nuevosErrores.proximaCita =
        "La próxima cita debe ser posterior a hoy";
    }

    if (!formData.asistencia && !formData.justificacionInasistencia) {
      nuevosErrores.justificacionInasistencia =
        "La justificación es obligatoria";
    }

    if (signaturePacienteRef.current?.isEmpty()) {
      nuevosErrores.firmaPaciente = "Firma del paciente requerida";
    }

    if (signaturePsicologoRef.current?.isEmpty()) {
      nuevosErrores.firmaPsicologo = "Firma del psicólogo requerida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /** =========================
   * HELPERS
   ========================== */
  const limpiarFirma = (
    ref: React.MutableRefObject<SignaturePad | null>
  ) => {
    ref.current?.clear();
  };

  /** =========================
   * SUBMIT
   ========================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) return;
    if (!hcId) {
      alert("No se encontró el id de la historia clínica");
      return;
    }

    const payload = {
      ...formData,
      firmaPsicologo:
        signaturePsicologoRef.current?.toDataURL() || "",
      hcId: Number(hcId),
    };

    try {
      await createItem(payload);
      setNotasGuardadas((prev) => [...prev, payload]);
      onSubmit?.(payload);
      alert("Información guardada correctamente");
      setMostrarFormulario(false);
    } catch (error: any) {
      alert(error?.message || "Error al guardar");
    }
  };

  /** =========================
   * RENDER
   ========================== */
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={`p-4 sm:p-6 ${
          !mostrarFormulario ? "hidden" : ""
        }`}
      >
        {/* FECHA */}
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">
              Fecha *
            </label>
            <input
              type="datetime-local"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fecha: e.target.value,
                })
              }
              className="w-full rounded border px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Nº Sesión
            </label>
            <input
              type="number"
              disabled
              value={formData.numeroSesiones}
              className="w-full rounded border bg-gray-100 px-4 py-2"
            />
          </div>
        </div>

        {/* ASISTENCIA */}
        <div className="mb-6">
          <label className="text-sm font-medium">
            Asistencia
          </label>
          <input
            type="checkbox"
            checked={formData.asistencia}
            onChange={(e) =>
              setFormData({
                ...formData,
                asistencia: e.target.checked,
              })
            }
            className="ml-2"
          />
        </div>

        {!formData.asistencia && (
          <div className="mb-6">
            <label className="text-sm font-medium">
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

        {/* TEXTOS */}
        {[
          ["Temas Abordados", "temasAbordados"],
          [
            "Intervenciones",
            "intervencionesRealizadas",
          ],
          ["Respuesta del Paciente", "repuestaPaciente"],
          ["Tareas Asignadas", "tareasAsignadas"],
          ["Observaciones", "observaciones"],
        ].map(([label, key]) => (
          <div key={key} className="mb-6">
            <label className="text-sm font-medium">
              {label}
            </label>
            <textarea
              value={(formData as any)[key]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [key]: e.target.value,
                })
              }
              rows={3}
              className="w-full rounded border px-4 py-2"
            />
            {errores[key] && (
              <p className="text-xs text-red-500">
                {errores[key]}
              </p>
            )}
          </div>
        ))}

        {/* PROXIMA CITA */}
        <div className="mb-6">
          <label className="text-sm font-medium">
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

        {/* FIRMA PACIENTE */}
        <div className="mb-6">
          <label className="text-sm font-medium">
            Firma Paciente *
          </label>
          <canvas
            ref={canvasPacienteRef}
            className="w-full border"
            style={{ height: 200 }}
          />
          <button
            type="button"
            onClick={() =>
              limpiarFirma(signaturePacienteRef)
            }
            className="mt-2 border px-4 py-2"
          >
            Limpiar
          </button>
          {errores.firmaPaciente && (
            <p className="text-xs text-red-500">
              {errores.firmaPaciente}
            </p>
          )}
        </div>

        {/* FIRMA PSICOLOGO */}
        <div className="mb-6">
          <label className="text-sm font-medium">
            Firma Psicólogo *
          </label>
          <canvas
            ref={canvasPsicologoRef}
            className="w-full border"
            style={{ height: 200 }}
          />
          <button
            type="button"
            onClick={() =>
              limpiarFirma(signaturePsicologoRef)
            }
            className="mt-2 border px-4 py-2"
          >
            Limpiar
          </button>
          {errores.firmaPsicologo && (
            <p className="text-xs text-red-500">
              {errores.firmaPsicologo}
            </p>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex gap-4">
          <Button type="submit">Guardar</Button>
          <button
            type="button"
            onClick={() => setMostrarFormulario(false)}
            className="border px-6 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>

      <NotasProgresoPanel
        notas={notasGuardadas}
        onRegistrar={() => setMostrarFormulario(true)}
      />
    </div>
  );
}
